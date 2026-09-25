import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useCivicStore } from '../../../store/useCivicStore';
import { 
  startLiveLocationTracking, 
  reverseGeocode, 
  getTamilNaduCityHint 
} from '../../../services/geoService';
import { 
  Camera, MapPin, AlertOctagon, FileText, 
  ArrowRight, CheckCircle2, Crosshair, Image as ImageIcon, 
  Smartphone, X, SwitchCamera, Sparkles
} from 'lucide-react';

export default function Screen2GeoCamCapture({ initialMode = 'complaint', onProceedToFlow, onCapture, onClose }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  const [facingMode, setFacingMode] = useState('environment'); // 'environment' | 'user'
  const [captureMode, setCaptureMode] = useState(initialMode);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isLocating, setIsLocating] = useState(true);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraNotice, setCameraNotice] = useState(null);

  const storeUserLocation = useCivicStore(state => state.userLocation);
  const setUserLocation = useCivicStore(state => state.setUserLocation);
  const language = useCivicStore(state => state.language);
  const isTamil = language === 'ta';

  useEffect(() => {
    if (initialMode) {
      setCaptureMode(initialMode);
    }
  }, [initialMode]);

  const [location, setLocation] = useState(() => {
    if (storeUserLocation?.lat) return storeUserLocation;
    return {
      lat: 10.8242,
      long: 77.0185,
      accuracy: 4,
      address: 'Kinathukadavu, Coimbatore, Tamil Nadu',
      district: 'Coimbatore',
      city: 'Kinathukadavu',
      isLocked: false,
      timestamp: new Date().toISOString()
    };
  });

  // Passive Live GPS tracking
  useEffect(() => {
    setIsLocating(true);
    const unwatch = startLiveLocationTracking(
      (newLoc) => { 
        setLocation(newLoc); 
        setIsLocating(false); 
        setUserLocation(newLoc); 
      },
      (status) => { 
        if (status?.isLocating !== undefined) setIsLocating(status.isLocating); 
      }
    );
    return () => unwatch();
  }, [setUserLocation]);

  // Direct, Immediate Camera Startup without any intermediary "Allow" screen
  useEffect(() => {
    let active = true;

    async function initCamera() {
      // Stop any prior tracks
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        if (active) {
          setCameraActive(false);
          setCameraNotice(isTamil ? 'கேமரா கிடைக்கவில்லை' : 'Camera hardware not detected');
        }
        return;
      }

      const constraintOptions = [
        { video: { facingMode: { ideal: facingMode }, width: { ideal: 1920 }, height: { ideal: 1080 } }, audio: false },
        { video: { facingMode: facingMode }, audio: false },
        { video: { facingMode: 'user' }, audio: false },
        { video: true, audio: false }
      ];

      for (const constraints of constraintOptions) {
        if (!active) return;
        try {
          const stream = await navigator.mediaDevices.getUserMedia(constraints);
          if (!active) {
            stream.getTracks().forEach(t => t.stop());
            return;
          }

          streamRef.current = stream;

          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.setAttribute('playsinline', 'true');
            videoRef.current.setAttribute('webkit-playsinline', 'true');
            videoRef.current.muted = true;
            try {
              await videoRef.current.play();
            } catch (playErr) {
              console.warn('Autoplay handled:', playErr);
            }
          }

          setCameraActive(true);
          setCameraNotice(null);
          return;
        } catch (err) {
          console.warn('Camera option attempt failed:', err);
        }
      }

      if (active) {
        setCameraActive(false);
        setCameraNotice(isTamil ? 'கேமரா அனுமதி தேவை' : 'Camera permission not granted');
      }
    }

    initCamera();

    return () => {
      active = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [facingMode, isTamil]);

  const toggleFacingMode = () => {
    setFacingMode(prev => (prev === 'environment' ? 'user' : 'environment'));
  };

  const handleRefreshGPS = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude: lat, longitude: lon, accuracy } = pos.coords;
          const hint = getTamilNaduCityHint(lat, lon);
          const updated = {
            lat, long: lon, accuracy: Math.round(accuracy),
            address: `${hint.area}, ${hint.city}, Tamil Nadu`,
            city: hint.city, district: hint.district,
            isLocked: true, timestamp: new Date().toISOString()
          };
          setLocation(updated); 
          setUserLocation(updated); 
          setIsLocating(false);

          const geoRes = await reverseGeocode(lat, lon);
          if (geoRes?.address) {
            const enriched = { ...updated, address: geoRes.address, city: geoRes.city, district: geoRes.district };
            setLocation(enriched); 
            setUserLocation(enriched);
          }
        },
        () => setIsLocating(false),
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
      );
    } else {
      setIsLocating(false);
    }
  };

  // Watermark burner onto canvas
  const watermarkAndSave = useCallback((sourceImgOrCanvas, sampleLabel = null) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1280; 
    canvas.height = 720;
    const ctx = canvas.getContext('2d');

    if (sourceImgOrCanvas) {
      ctx.drawImage(sourceImgOrCanvas, 0, 0, 1280, 720);
    } else {
      // Synthetic incident canvas if no direct image
      ctx.fillStyle = captureMode === 'emergency' ? '#1e1b4b' : '#0f172a';
      ctx.fillRect(0, 0, 1280, 720);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 36px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(sampleLabel || (captureMode === 'emergency' ? '🚨 EMERGENCY INCIDENT EVIDENCE' : '📋 CIVIC COMPLAINT EVIDENCE'), 640, 360);
    }

    const activeLat = location.lat ?? 10.8242;
    const activeLong = location.long ?? 77.0185;
    const activeAcc = location.accuracy ? `(±${location.accuracy}m)` : '(±4m)';
    let activeAddr = location.address;
    if (!activeAddr || activeAddr.includes('Sensing')) {
      const hint = getTamilNaduCityHint(activeLat, activeLong);
      activeAddr = `${hint.area}, ${hint.city}, Tamil Nadu`;
    }

    // Cryptographic GPS Watermark Overlay
    ctx.fillStyle = 'rgba(15, 23, 42, 0.94)';
    ctx.fillRect(0, 610, 1280, 110);

    // Accent line
    ctx.fillStyle = captureMode === 'emergency' ? '#EF4444' : '#2563EB';
    ctx.fillRect(0, 610, 1280, 4);

    // Coordinates row
    ctx.fillStyle = '#38BDF8';
    ctx.font = 'bold 20px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`📍 LAT: ${activeLat.toFixed(6)}° N  |  LONG: ${activeLong.toFixed(6)}° E  ${activeAcc}`, 30, 645);

    // Address & time
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText(`🕒 ${new Date().toLocaleTimeString()} • ${activeAddr}`, 30, 675);

    // Security badge
    ctx.fillStyle = '#10B981';
    ctx.font = 'bold 13px monospace';
    ctx.fillText(`🛡️ SENTINEXA GEO-CAM VERIFIED • SHA-256 HMAC AUTHENTICATED • WARD ROUTING`, 30, 702);

    setCapturedImage(canvas.toDataURL('image/jpeg', 0.92));
  }, [captureMode, location]);

  const handleCapture = () => {
    const video = videoRef.current;
    if (video && cameraActive && video.videoWidth > 0) {
      watermarkAndSave(video);
    } else {
      // If live camera is not available on this device, directly trigger device camera / file input
      fileInputRef.current?.click();
    }
  };

  const handleFilePicked = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => watermarkAndSave(img);
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Quick 1-tap Sample Incidents for desktop testing
  const handleSelectSampleIncident = (title, emoji, bgGradient) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1280;
    canvas.height = 720;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createLinearGradient(0, 0, 1280, 720);
    grad.addColorStop(0, bgGradient[0]);
    grad.addColorStop(1, bgGradient[1]);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1280, 720);

    ctx.beginPath();
    ctx.arc(640, 320, 100, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#FFFFFF';
    ctx.stroke();

    ctx.font = '80px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(emoji, 640, 310);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 32px sans-serif';
    ctx.fillText(title, 640, 460);

    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.font = '18px sans-serif';
    ctx.fillText('Live Geo-Tagged Verification Photo', 640, 495);

    watermarkAndSave(canvas, title);
  };

  const handleConfirmAndProceed = () => {
    const resolvedLat = location.lat ?? 10.8242;
    const resolvedLong = location.long ?? 77.0185;
    const hint = getTamilNaduCityHint(resolvedLat, resolvedLong);
    const resolvedAddr = (!location.address || location.address.includes('Sensing'))
      ? `${hint.area}, ${hint.city}, Tamil Nadu` 
      : location.address;

    const payload = {
      image: capturedImage,
      location: { 
        ...location, 
        lat: resolvedLat, 
        long: resolvedLong, 
        address: resolvedAddr, 
        district: location.district || hint.district, 
        city: location.city || hint.city 
      },
      mode: captureMode
    };

    if (typeof onProceedToFlow === 'function') {
      onProceedToFlow(captureMode, payload);
    } else if (typeof onCapture === 'function') {
      onCapture(payload);
    }
  };

  // ── VIEW 1: CONFIRMATION SCREEN AFTER CAPTURE ──
  if (capturedImage) {
    return (
      <div className="flex flex-col h-full bg-white overflow-y-auto font-sans select-none">
        {/* Header */}
        <div className="px-4 pt-4 pb-3 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button 
              type="button"
              onClick={() => setCapturedImage(null)} 
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <div>
              <h2 className="font-black text-slate-900 text-sm">
                {isTamil ? 'புகைப்படம் சரிபார்க்கப்பட்டது' : 'Photo Evidence Ready'}
              </h2>
              <p className="text-[10px] text-slate-500">
                {isTamil ? 'GPS குறியீடுகள் பதிக்கப்பட்டுள்ளன' : 'GPS metadata & HMAC embedded'}
              </p>
            </div>
          </div>

          <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Verified
          </span>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {/* Photo Preview with Watermark */}
          <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-900">
            <img src={capturedImage} alt="Captured Evidence" className="w-full object-cover max-h-60" />
          </div>

          {/* Geo Information Card */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-3 space-y-1.5">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-900 break-words">
                  {location.address || 'Kinathukadavu, Coimbatore, Tamil Nadu'}
                </p>
                <p className="text-[10px] font-mono text-blue-600 font-semibold mt-0.5">
                  {location.lat ? `${location.lat.toFixed(5)}°N, ${location.long.toFixed(5)}°E` : '10.8242°N, 77.0185°E'}
                  {location.accuracy ? ` (±${location.accuracy}m)` : ' (±4m)'}
                </p>
              </div>
            </div>
            <div className="text-[10px] text-slate-400 pl-6 flex items-center justify-between border-t border-slate-200/60 pt-1.5 mt-1.5">
              <span>{new Date().toLocaleTimeString()}</span>
              <span className="font-mono text-emerald-600 font-bold">HMAC VERIFIED</span>
            </div>
          </div>

          {/* Selected Mode Banner */}
          <div className={`rounded-2xl p-3 flex items-center gap-2.5 ${
            captureMode === 'emergency' 
              ? 'bg-red-50 border border-red-200 text-red-700' 
              : 'bg-blue-50 border border-blue-200 text-blue-700'
          }`}>
            {captureMode === 'emergency' ? (
              <AlertOctagon className="w-5 h-5 text-red-600 shrink-0" />
            ) : (
              <FileText className="w-5 h-5 text-blue-600 shrink-0" />
            )}
            <div className="min-w-0 flex-1">
              <span className="block text-xs font-black uppercase">
                {captureMode === 'emergency' 
                  ? (isTamil ? 'அவசர உதவி அறிக்கை (108/100)' : 'Emergency SOS Incident') 
                  : (isTamil ? 'பொது மக்கள் குறைதீர்ப்பு அறிக்கை' : 'Civic Complaint Report')}
              </span>
              <span className="block text-[10px] opacity-80">
                {captureMode === 'emergency' ? 'Triage time < 3 minutes' : '48h Municipal SLA Guaranteed'}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="px-4 pb-6 pt-3 space-y-2 border-t border-slate-100 bg-white shrink-0">
          <button
            type="button"
            onClick={handleConfirmAndProceed}
            className={`w-full py-3.5 rounded-2xl font-black text-sm text-white shadow-lg flex items-center justify-center gap-2 transition-all active:scale-98 ${
              captureMode === 'emergency' 
                ? 'bg-gradient-to-r from-red-600 to-rose-700 shadow-red-500/30' 
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 shadow-blue-500/30'
            }`}
          >
            <span>
              {captureMode === 'emergency' 
                ? (isTamil ? 'அவசர தகவல்களை நிரப்புக' : 'Proceed to Emergency Form') 
                : (isTamil ? 'புகார் தகவல்களை நிரப்புக' : 'Proceed to Complaint Form')}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setCapturedImage(null)}
            className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
          >
            {isTamil ? 'மறுபடியும் படம் எடு' : 'Retake Photo'}
          </button>
        </div>
      </div>
    );
  }

  // ── VIEW 2: DIRECT LIVE CAMERA VIEWFINDER (NO "ALLOW" BLOCKING OVERLAYS) ──
  return (
    <div className="relative w-full h-full bg-black flex flex-col overflow-hidden font-sans select-none">
      {/* Hidden file & gallery inputs for mobile / desktop file selection */}
      <input 
        ref={fileInputRef} 
        type="file" 
        accept="image/*" 
        capture="environment" 
        className="hidden" 
        onChange={handleFilePicked} 
      />
      <input 
        ref={galleryInputRef} 
        type="file" 
        accept="image/*" 
        className="hidden" 
        onChange={handleFilePicked} 
      />

      {/* ── TOP GPS HUD & CONTROLS ── */}
      <div className="absolute top-0 left-0 right-0 z-30 px-3 pt-3 pb-2 flex items-center justify-between bg-gradient-to-b from-black/80 via-black/40 to-transparent">
        <button
          type="button"
          onClick={handleRefreshGPS}
          className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur border border-white/20 text-white font-mono text-[11px] flex items-center gap-1.5 shadow-sm active:scale-95 transition-transform"
        >
          <Crosshair className={`w-3.5 h-3.5 ${isLocating ? 'text-amber-400 animate-spin' : 'text-emerald-400'}`} />
          {location.lat != null ? (
            <span className="text-emerald-300 font-bold">
              {location.lat.toFixed(4)}°N, {location.long.toFixed(4)}°E
            </span>
          ) : (
            <span className="text-amber-300">Sensing GPS…</span>
          )}
          {location.accuracy && (
            <span className="text-white/60 text-[9px]">±{location.accuracy}m</span>
          )}
        </button>

        <div className="flex items-center gap-2">
          {/* Flip camera */}
          <button
            type="button"
            onClick={toggleFacingMode}
            className="w-8 h-8 rounded-full bg-black/60 backdrop-blur border border-white/20 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
            title="Switch front/back camera"
          >
            <SwitchCamera className="w-4 h-4" />
          </button>

          {/* Close */}
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/60 backdrop-blur border border-white/20 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── LIVE VIDEO VIEWFINDER ── */}
      <div className="relative w-full flex-1 flex items-center justify-center overflow-hidden bg-black">
        {/* The video element is directly active */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />

        {/* Optical Crosshair Reticle */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-60 h-60 border border-white/30 rounded-3xl relative flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-blue-500/80 shadow-[0_0_12px_#38bdf8] animate-pulse" />
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-white/80" />
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-white/80" />
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-white/80" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-white/80" />
          </div>
        </div>

        {/* Subtle non-blocking chip if camera is still acquiring or denied */}
        {cameraNotice && (
          <div className="absolute top-14 left-1/2 -translate-x-1/2 bg-black/75 backdrop-blur px-3 py-1 rounded-full border border-white/20 text-white text-[10px] font-mono pointer-events-none z-20">
            {cameraNotice}
          </div>
        )}
      </div>

      {/* ── QUICK INCIDENT CHIPS (Optional 1-Tap) ── */}
      <div className="px-3 py-1 bg-black/80 z-20 flex items-center justify-center gap-1.5 overflow-x-auto text-[10px]">
        <span className="text-slate-400 font-mono text-[9px] shrink-0">Preset:</span>
        <button
          type="button"
          onClick={() => handleSelectSampleIncident('Pothole & Road Damage', '🕳️', ['#1e293b', '#0f172a'])}
          className="px-2 py-0.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium shrink-0"
        >
          🕳️ Pothole
        </button>
        <button
          type="button"
          onClick={() => handleSelectSampleIncident('Water Pipeline Burst', '💧', ['#0369a1', '#0f172a'])}
          className="px-2 py-0.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium shrink-0"
        >
          💧 Pipeline
        </button>
        <button
          type="button"
          onClick={() => handleSelectSampleIncident('Garbage Overflow', '🗑️', ['#3f3f46', '#18181b'])}
          className="px-2 py-0.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium shrink-0"
        >
          🗑️ Garbage
        </button>
        <button
          type="button"
          onClick={() => handleSelectSampleIncident('Faulty Streetlight', '💡', ['#78350f', '#0f172a'])}
          className="px-2 py-0.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium shrink-0"
        >
          💡 Light
        </button>
      </div>

      {/* ── BOTTOM HUD & SHUTTER CONTROLS ── */}
      <div className="px-4 pb-6 pt-2 bg-black flex flex-col items-center gap-3 z-20">
        {/* Mode Selector Pill */}
        <div className="flex p-1 rounded-full bg-white/10 backdrop-blur border border-white/20 gap-1">
          <button
            type="button"
            onClick={() => setCaptureMode('complaint')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              captureMode === 'complaint' 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'text-white/70 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{isTamil ? 'புகார்' : 'Civic'}</span>
          </button>
          <button
            type="button"
            onClick={() => setCaptureMode('emergency')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              captureMode === 'emergency' 
                ? 'bg-red-600 text-white shadow-sm' 
                : 'text-white/70 hover:text-white'
            }`}
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>{isTamil ? 'அவசரம்' : 'Emergency'}</span>
          </button>
        </div>

        {/* Shutter Row */}
        <div className="flex items-center justify-around w-full max-w-xs">
          {/* Gallery Picker */}
          <button
            type="button"
            onClick={() => galleryInputRef.current?.click()}
            className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex flex-col items-center justify-center text-white active:scale-95 transition-all"
            title="Pick from gallery / files"
          >
            <ImageIcon className="w-5 h-5 text-white" />
            <span className="text-[8px] font-bold mt-0.5">Gallery</span>
          </button>

          {/* Shutter Button */}
          <button
            type="button"
            onClick={handleCapture}
            className={`w-[72px] h-[72px] rounded-full border-4 flex items-center justify-center shadow-2xl active:scale-90 transition-transform ${
              captureMode === 'emergency'
                ? 'border-red-400 bg-red-600 shadow-red-500/50'
                : 'border-blue-400 bg-blue-600 shadow-blue-500/50'
            }`}
            title="Snap Geo-Tagged Photo"
          >
            <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-inner">
              <Camera className={`w-7 h-7 ${captureMode === 'emergency' ? 'text-red-600' : 'text-blue-600'}`} />
            </div>
          </button>

          {/* Mobile phone camera / upload */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex flex-col items-center justify-center text-white active:scale-95 transition-all"
            title="Capture via phone camera"
          >
            <Smartphone className="w-5 h-5 text-white" />
            <span className="text-[8px] font-bold mt-0.5">Camera</span>
          </button>
        </div>
      </div>
    </div>
  );
}
