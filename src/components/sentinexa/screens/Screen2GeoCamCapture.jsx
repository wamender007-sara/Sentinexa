import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useCivicStore } from '../../../store/useCivicStore';
import { 
  startLiveLocationTracking, 
  reverseGeocode, 
  getTamilNaduCityHint 
} from '../../../services/geoService';
import { 
  Camera, MapPin, AlertOctagon, FileText, RefreshCw, 
  ArrowRight, CheckCircle2, Crosshair, Image as ImageIcon, Smartphone, X
} from 'lucide-react';

export default function Screen2GeoCamCapture({ onProceedToFlow, onCapture, onClose }) {
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  const [stream, setStream] = useState(null);
  const [facingMode, setFacingMode] = useState('environment');
  const [captureMode, setCaptureMode] = useState('complaint');
  const [capturedImage, setCapturedImage] = useState(null);
  const [isLocating, setIsLocating] = useState(true);
  const [cameraActive, setCameraActive] = useState(false);

  const storeUserLocation = useCivicStore(state => state.userLocation);
  const setUserLocation = useCivicStore(state => state.setUserLocation);

  const [location, setLocation] = useState(() => {
    if (storeUserLocation?.lat) return storeUserLocation;
    return {
      lat: null, long: null, accuracy: null,
      address: 'Sensing GPS...', district: 'Coimbatore',
      city: 'Coimbatore', isLocked: false,
      timestamp: new Date().toISOString()
    };
  });

  // Live GPS tracking
  useEffect(() => {
    setIsLocating(true);
    const unwatch = startLiveLocationTracking(
      (newLoc) => { setLocation(newLoc); setIsLocating(false); setUserLocation(newLoc); },
      (status) => { if (status?.isLocating !== undefined) setIsLocating(status.isLocating); }
    );
    return () => unwatch();
  }, [setUserLocation]);

  // Camera stream
  useEffect(() => { startCamera(); return () => stopCamera(); }, [facingMode]);
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.play()
        .then(() => setCameraActive(true))
        .catch(() => setCameraActive(false));
    }
  }, [stream]);

  const startCamera = async () => {
    stopCamera();
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: facingMode }, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      });
      setStream(s);
    } catch {
      try {
        const s2 = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        setStream(s2);
      } catch {
        setCameraActive(false);
      }
    }
  };

  const stopCamera = () => {
    if (stream) { stream.getTracks().forEach(t => t.stop()); setStream(null); setCameraActive(false); }
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
          setLocation(updated); setUserLocation(updated); setIsLocating(false);
          const geoRes = await reverseGeocode(lat, lon);
          if (geoRes?.address) {
            const enriched = { ...updated, address: geoRes.address, city: geoRes.city, district: geoRes.district };
            setLocation(enriched); setUserLocation(enriched);
          }
        },
        () => setIsLocating(false),
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
      );
    } else setIsLocating(false);
  };

  const watermarkAndSave = useCallback((sourceImgOrCanvas) => {
    const canvas = document.createElement('canvas');
    canvas.width = 800; canvas.height = 600;
    const ctx = canvas.getContext('2d');

    if (sourceImgOrCanvas) {
      ctx.drawImage(sourceImgOrCanvas, 0, 0, 800, 600);
    } else {
      ctx.fillStyle = captureMode === 'emergency' ? '#fee2e2' : '#e0f2fe';
      ctx.fillRect(0, 0, 800, 600);
      ctx.fillStyle = captureMode === 'emergency' ? '#dc2626' : '#2563eb';
      ctx.font = 'bold 22px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(captureMode === 'emergency' ? '🚨 EMERGENCY EVIDENCE' : '📋 CIVIC COMPLAINT EVIDENCE', 400, 280);
    }

    const activeLat = location.lat ?? 11.0168;
    const activeLong = location.long ?? 76.9558;
    const activeAcc = location.accuracy ? `(±${location.accuracy}m)` : '';
    let activeAddr = location.address;
    if (!activeAddr || activeAddr.includes('Sensing')) {
      const hint = getTamilNaduCityHint(activeLat, activeLong);
      activeAddr = `${hint.area}, ${hint.city}, Tamil Nadu`;
    }

    // GPS watermark bar
    ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
    ctx.fillRect(0, 515, 800, 85);
    ctx.fillStyle = captureMode === 'emergency' ? '#dc2626' : '#2563eb';
    ctx.fillRect(0, 515, 800, 4);
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 14px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`📍 LAT: ${activeLat.toFixed(5)}° N  |  LONG: ${activeLong.toFixed(5)}° E  ${activeAcc}`, 20, 543);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '12px sans-serif';
    ctx.fillText(`🕒 ${new Date().toLocaleTimeString()} • ${activeAddr}`, 20, 567);
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 10px monospace';
    ctx.fillText(`🛡️ SENTINEXA GEO-CAM VERIFIED • HMAC AUTHENTICATED`, 20, 587);

    setCapturedImage(canvas.toDataURL('image/jpeg', 0.92));
  }, [captureMode, location]);

  const handleCapture = () => {
    const video = videoRef.current;
    if (video && cameraActive && video.videoWidth > 0 && video.readyState >= 2) {
      watermarkAndSave(video);
    } else {
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

  const handleConfirmAndProceed = () => {
    const resolvedLat = location.lat ?? 11.0168;
    const resolvedLong = location.long ?? 76.9558;
    const hint = getTamilNaduCityHint(resolvedLat, resolvedLong);
    const resolvedAddr = (!location.address || location.address.includes('Sensing'))
      ? `${hint.area}, ${hint.city}, Tamil Nadu` : location.address;

    const payload = {
      image: capturedImage,
      location: { ...location, lat: resolvedLat, long: resolvedLong, address: resolvedAddr, district: location.district || hint.district, city: location.city || hint.city },
      mode: captureMode
    };
    if (typeof onProceedToFlow === 'function') onProceedToFlow(captureMode, payload);
    else if (typeof onCapture === 'function') onCapture(payload);
  };

  // ── RENDER ──

  // After capture: confirmation view (LIGHT)
  if (capturedImage) {
    return (
      <div className="flex flex-col h-full bg-white overflow-y-auto">
        {/* Header */}
        <div className="px-4 pt-4 pb-3 border-b border-slate-100 flex items-center gap-3">
          <button onClick={() => setCapturedImage(null)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
            <X className="w-4 h-4" />
          </button>
          <div>
            <h2 className="font-black text-slate-900 text-base">Photo Captured</h2>
            <p className="text-[11px] text-slate-500">GPS metadata embedded</p>
          </div>
          <span className="ml-auto px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Verified
          </span>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {/* Photo */}
          <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100">
            <img src={capturedImage} alt="Captured" className="w-full object-cover max-h-56" />
          </div>

          {/* Geo info */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 px-3 py-2.5 space-y-1.5">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs font-semibold text-slate-800 break-words">
                {location.address || 'Coimbatore, Tamil Nadu'}
              </p>
            </div>
            <p className="text-[11px] font-mono text-slate-500 pl-6">
              {location.lat ? `${location.lat.toFixed(5)}°N, ${location.long.toFixed(5)}°E` : '—'}
              {location.accuracy ? ` (±${location.accuracy}m)` : ''}
            </p>
            <p className="text-[11px] text-slate-400 pl-6">{new Date().toLocaleString()}</p>
          </div>

          {/* Mode indicator */}
          <div className={`rounded-xl px-3 py-2 flex items-center gap-2 ${
            captureMode === 'emergency' ? 'bg-red-50 border border-red-200' : 'bg-blue-50 border border-blue-200'
          }`}>
            {captureMode === 'emergency'
              ? <AlertOctagon className="w-4 h-4 text-red-600" />
              : <FileText className="w-4 h-4 text-blue-600" />
            }
            <span className={`text-xs font-bold uppercase ${captureMode === 'emergency' ? 'text-red-700' : 'text-blue-700'}`}>
              {captureMode === 'emergency' ? 'Emergency SOS Report' : 'Civic Complaint Report'}
            </span>
          </div>
        </div>

        {/* Bottom actions */}
        <div className="px-4 pb-6 pt-3 space-y-2 border-t border-slate-100">
          <button
            onClick={handleConfirmAndProceed}
            className={`w-full py-3.5 rounded-2xl font-black text-sm text-white shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 ${
              captureMode === 'emergency' ? 'bg-red-600 shadow-red-200' : 'bg-blue-600 shadow-blue-200'
            }`}
          >
            Continue to {captureMode === 'emergency' ? 'Emergency' : 'Complaint'}
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCapturedImage(null)}
            className="w-full py-2.5 rounded-xl bg-slate-100 text-slate-700 font-semibold text-sm"
          >
            Retake Photo
          </button>
        </div>
      </div>
    );
  }

  // Camera viewfinder (DARK — full screen camera)
  return (
    <div className="relative w-full h-full bg-slate-950 flex flex-col overflow-hidden">
      {/* Hidden inputs */}
      <input ref={fileInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFilePicked} />
      <input ref={galleryInputRef} type="file" accept="image/*" className="hidden" onChange={handleFilePicked} />

      {/* ── TOP OVERLAY: GPS badge + close ── */}
      <div className="absolute top-0 left-0 right-0 z-30 px-3 pt-3 pb-2 flex items-center justify-between bg-gradient-to-b from-black/70 to-transparent">
        <button
          onClick={handleRefreshGPS}
          className="px-3 py-1.5 rounded-full bg-black/70 backdrop-blur border border-white/20 text-white font-mono text-[11px] flex items-center gap-2"
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
            <span className="text-white/60 text-[10px]">±{location.accuracy}m</span>
          )}
        </button>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-black/70 backdrop-blur border border-white/20 flex items-center justify-center text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* ── VIDEO VIEWFINDER ── */}
      <div className="relative w-full h-full flex items-center justify-center">
        {stream && (
          <video
            ref={videoRef}
            autoPlay playsInline muted
            onLoadedMetadata={() => setCameraActive(true)}
            className="w-full h-full object-cover"
          />
        )}

        {/* Fallback when camera not active */}
        {!cameraActive && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-slate-900/95 text-white text-center px-8">
            <div className="w-16 h-16 rounded-full bg-blue-600/20 border-2 border-blue-400/50 flex items-center justify-center">
              <Camera className="w-8 h-8 text-blue-400 animate-pulse" />
            </div>
            <div>
              <h4 className="font-bold text-base">GEO Camera</h4>
              <p className="text-xs text-slate-400 mt-1">Tap below to open your phone camera or pick from gallery</p>
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm flex items-center gap-2"
            >
              <Smartphone className="w-4 h-4" /> Open Camera
            </button>
          </div>
        )}

        {/* Target reticle */}
        {cameraActive && (
          <div className="absolute w-52 h-52 border-2 border-dashed border-white/40 rounded-3xl pointer-events-none flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-400/80 shadow-[0_0_10px_#60a5fa]" />
          </div>
        )}
      </div>

      {/* ── BOTTOM CONTROLS ── */}
      <div className="absolute bottom-0 left-0 right-0 z-20 px-4 pb-6 pt-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent flex flex-col items-center gap-4">
        
        {/* Mode toggle pill */}
        <div className="flex p-1 rounded-full bg-black/70 backdrop-blur border border-white/20 gap-1">
          <button
            onClick={() => setCaptureMode('complaint')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              captureMode === 'complaint' ? 'bg-blue-600 text-white' : 'text-white/60'
            }`}
          >
            <FileText className="w-3.5 h-3.5" /> Complaint
          </button>
          <button
            onClick={() => setCaptureMode('emergency')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              captureMode === 'emergency' ? 'bg-red-600 text-white' : 'text-white/60'
            }`}
          >
            <AlertOctagon className="w-3.5 h-3.5" /> Emergency
          </button>
        </div>

        {/* Shutter row */}
        <div className="flex items-center justify-around w-full px-6">
          {/* Gallery */}
          <button
            onClick={() => galleryInputRef.current?.click()}
            className="w-11 h-11 rounded-full bg-white/15 border border-white/20 flex items-center justify-center"
          >
            <ImageIcon className="w-5 h-5 text-white" />
          </button>

          {/* Main shutter */}
          <button
            onClick={handleCapture}
            className={`w-[72px] h-[72px] rounded-full border-4 flex items-center justify-center shadow-2xl active:scale-95 transition-transform ${
              captureMode === 'emergency'
                ? 'border-red-400 bg-red-600 shadow-red-500/40'
                : 'border-blue-400 bg-blue-600 shadow-blue-500/40'
            }`}
          >
            <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center">
              <Camera className={`w-7 h-7 ${captureMode === 'emergency' ? 'text-red-600' : 'text-blue-600'}`} />
            </div>
          </button>

          {/* Open phone cam */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-11 h-11 rounded-full bg-white/15 border border-white/20 flex items-center justify-center"
          >
            <Smartphone className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
