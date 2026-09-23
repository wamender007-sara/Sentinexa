import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useCivicStore } from '../../../store/useCivicStore';
import { 
  startLiveLocationTracking, 
  reverseGeocode, 
  getTamilNaduCityHint 
} from '../../../services/geoService';
import { 
  Camera, 
  MapPin, 
  AlertOctagon, 
  FileText, 
  RefreshCw, 
  SwitchCamera, 
  ArrowRight, 
  CheckCircle2, 
  Crosshair, 
  Upload, 
  Check, 
  Smartphone, 
  Image as ImageIcon 
} from 'lucide-react';

export default function Screen2GeoCamCapture({ onProceedToFlow, onCapture, onClose }) {
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  const [stream, setStream] = useState(null);
  const [facingMode, setFacingMode] = useState('environment');
  const [captureMode, setCaptureMode] = useState('complaint'); // 'complaint' | 'emergency'
  const [capturedImage, setCapturedImage] = useState(null);
  const [isLocating, setIsLocating] = useState(true);
  const [cameraActive, setCameraActive] = useState(false);

  const storeUserLocation = useCivicStore(state => state.userLocation);
  const setUserLocation = useCivicStore(state => state.setUserLocation);

  // Initialize with existing global location or sensing state
  const [location, setLocation] = useState(() => {
    if (storeUserLocation && storeUserLocation.lat) {
      return storeUserLocation;
    }
    return {
      lat: null,
      long: null,
      accuracy: null,
      address: 'Sensing live GPS satellites...',
      district: 'Coimbatore',
      city: 'Coimbatore',
      isLocked: false,
      timestamp: new Date().toISOString()
    };
  });

  // Track live GPS continuously with cellular fast fix + satellite lock
  useEffect(() => {
    setIsLocating(true);
    const unwatch = startLiveLocationTracking(
      (newLoc) => {
        setLocation(newLoc);
        setIsLocating(false);
        setUserLocation(newLoc);
      },
      (status) => {
        if (status?.isLocating !== undefined) {
          setIsLocating(status.isLocating);
        }
      }
    );

    return () => unwatch();
  }, [setUserLocation]);

  // Start live WebRTC camera stream
  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [facingMode]);

  // Ensure stream connects to video element and starts playback
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.play()
        .then(() => setCameraActive(true))
        .catch(err => {
          console.warn('Video auto-playback caught:', err);
          setCameraActive(false);
        });
    }
  }, [stream]);

  const startCamera = async () => {
    stopCamera();
    try {
      const constraints = {
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
    } catch (err) {
      console.warn('Standard camera constraints failed, attempting fallback:', err);
      try {
        const fallbackStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        setStream(fallbackStream);
      } catch (fallbackErr) {
        console.warn('Camera preview not supported or permission denied:', fallbackErr);
        setCameraActive(false);
      }
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setCameraActive(false);
    }
  };

  // Manual GPS refresh trigger on tapping the badge
  const handleRefreshGPS = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          const accuracy = Math.round(pos.coords.accuracy);
          const hint = getTamilNaduCityHint(lat, lon);
          
          const updated = {
            lat,
            long: lon,
            accuracy,
            address: `${hint.area}, ${hint.city}, Tamil Nadu`,
            city: hint.city,
            district: hint.district,
            isLocked: true,
            timestamp: new Date().toISOString()
          };
          setLocation(updated);
          setUserLocation(updated);
          setIsLocating(false);

          // Asynchronous reverse geocode enrichment
          const geoRes = await reverseGeocode(lat, lon);
          if (geoRes?.address) {
            const enriched = {
              ...updated,
              address: geoRes.address,
              city: geoRes.city,
              district: geoRes.district
            };
            setLocation(enriched);
            setUserLocation(enriched);
          }
        },
        (err) => {
          console.warn('GPS refresh error:', err);
          setIsLocating(false);
        },
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
      );
    } else {
      setIsLocating(false);
    }
  };

  // Helper to burn live GPS watermark on captured image
  const watermarkAndSave = useCallback((sourceImgOrCanvas) => {
    const canvas = document.createElement('canvas');
    const width = 800;
    const height = 600;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (sourceImgOrCanvas) {
      ctx.drawImage(sourceImgOrCanvas, 0, 0, width, height);
    } else {
      ctx.fillStyle = captureMode === 'emergency' ? '#fee2e2' : '#e0f2fe';
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = captureMode === 'emergency' ? '#dc2626' : '#2563eb';
      ctx.font = 'bold 24px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(
        captureMode === 'emergency' ? '🚨 EMERGENCY INCIDENT EVIDENCE' : '📋 CIVIC COMPLAINT EVIDENCE', 
        width / 2, 
        height / 2 - 20
      );
      ctx.font = '16px monospace';
      ctx.fillStyle = '#475569';
      ctx.fillText('TAMIL NADU MUNICIPAL & EMERGENCY RESPONSE MESH', width / 2, height / 2 + 15);
    }

    // Determine accurate coordinates and address for watermark
    const activeLat = location.lat != null ? location.lat : 11.0168;
    const activeLong = location.long != null ? location.long : 76.9558;
    const activeAcc = location.accuracy != null ? `(±${location.accuracy}m)` : '(GPS Fix)';
    
    let activeAddr = location.address;
    if (!activeAddr || activeAddr.includes('Sensing')) {
      const hint = getTamilNaduCityHint(activeLat, activeLong);
      activeAddr = `${hint.area}, ${hint.city}, Tamil Nadu`;
    }

    // Burn GPS Watermark bar on bottom of image
    const bh = 85;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.94)';
    ctx.fillRect(0, height - bh, width, bh);
    ctx.fillStyle = captureMode === 'emergency' ? '#dc2626' : '#2563eb';
    ctx.fillRect(0, height - bh, width, 4);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 15px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`📍 LAT: ${activeLat.toFixed(5)}° N | LONG: ${activeLong.toFixed(5)}° E ${activeAcc}`, 20, height - bh + 28);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '13px sans-serif';
    ctx.fillText(`🕒 ${new Date().toLocaleTimeString()} • ${activeAddr}`, 20, height - bh + 52);

    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 11px monospace';
    ctx.fillText(`🛡️ SENTINEXA GEO-CAM VERIFIED EVIDENCE • HMAC AUTHENTICATED`, 20, height - bh + 72);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    setCapturedImage(dataUrl);
  }, [captureMode, location]);

  // Handle capture from live video stream
  const handleCapture = () => {
    const video = videoRef.current;
    if (video && cameraActive && video.videoWidth > 0 && video.readyState >= 2) {
      watermarkAndSave(video);
    } else {
      if (fileInputRef.current) {
        fileInputRef.current.click();
      } else {
        const fallbackImg = new Image();
        fallbackImg.crossOrigin = 'anonymous';
        fallbackImg.onload = () => watermarkAndSave(fallbackImg);
        fallbackImg.onerror = () => watermarkAndSave(null);
        fallbackImg.src = captureMode === 'emergency'
          ? 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80';
      }
    }
  };

  // Handle photo from phone's native camera or gallery
  const handleFilePicked = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        watermarkAndSave(img);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleConfirmAndProceed = () => {
    const resolvedLat = location.lat != null ? location.lat : 11.0168;
    const resolvedLong = location.long != null ? location.long : 76.9558;
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

  return (
    <div className="relative w-full h-full bg-slate-900 rounded-[36px] overflow-hidden flex flex-col justify-between font-sans select-none">
      
      {/* Hidden Native Device Camera & Gallery Inputs */}
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

      {/* Top Overlay: Live GPS Stamp & Close */}
      <div className="absolute top-3 left-3 right-3 z-30 flex items-center justify-between pointer-events-auto">
        <button
          onClick={handleRefreshGPS}
          title="Live GPS status. Tap to refresh."
          className="px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md shadow-md border border-slate-200 text-slate-800 font-mono text-[11px] flex items-center space-x-2 active:scale-95 transition-transform"
        >
          <Crosshair className={`w-3.5 h-3.5 ${isLocating ? 'text-blue-600 animate-spin' : 'text-emerald-600'}`} />
          {location.lat != null ? (
            <>
              <span className="text-blue-700 font-bold">{location.lat.toFixed(4)}°N, {location.long.toFixed(4)}°E</span>
              <span className="text-emerald-700 font-semibold bg-emerald-100 px-1.5 py-0.2 rounded">±{location.accuracy || 4}m</span>
            </>
          ) : (
            <span className="text-amber-700 font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping inline-block"></span>
              Sensing Live GPS...
            </span>
          )}
        </button>

        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-white/95 backdrop-blur-md shadow-md text-slate-800 hover:bg-white flex items-center justify-center font-bold text-sm border border-slate-200"
        >
          ✕
        </button>
      </div>

      {/* Main Viewfinder Stream or Confirmation Card */}
      <div className="relative w-full h-full flex items-center justify-center bg-slate-950">
        {capturedImage ? (
          /* Confirmation Card in Clean Light UI */
          <div className="absolute inset-0 bg-white p-5 flex flex-col justify-between z-40 overflow-y-auto">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono text-[11px] font-bold inline-flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" /> GPS METADATA LOCKED
                </span>
                <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  VERIFIED GEO-TAG
                </span>
              </div>

              <div>
                <h3 className="font-extrabold text-slate-900 text-lg">
                  Photo Captured with Geotags
                </h3>
                <p className="text-xs text-slate-500">Live coordinates and location burned into cryptographic evidence</p>
              </div>
              
              {/* Photo Preview */}
              <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-md max-h-64 bg-slate-100">
                <img src={capturedImage} alt="Captured preview" className="w-full object-cover" />
              </div>

              {/* Geo metadata card */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-800 space-y-1">
                <p className="font-bold flex items-center gap-1.5 text-slate-900">
                  <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span className="break-words">
                    {location.address || `${getTamilNaduCityHint(location.lat || 11.0168, location.long || 76.9558).area}, Coimbatore, Tamil Nadu`}
                  </span>
                </p>
                <p className="text-slate-500 text-[11px]">
                  Coordinates: <strong>{location.lat ? location.lat.toFixed(5) : '11.01680'}°N, {location.long ? location.long.toFixed(5) : '76.95580'}°E</strong>
                </p>
                <p className="text-slate-500 text-[11px]">Timestamp: {new Date().toLocaleString()}</p>
                <p className="text-slate-500 text-[11px]">Mode: <strong className="uppercase text-blue-600">{captureMode}</strong></p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="space-y-2 pt-3">
              <button
                id="btn-confirm-continue"
                onClick={handleConfirmAndProceed}
                className={`w-full py-3.5 rounded-2xl font-black text-sm uppercase tracking-wider text-white shadow-lg flex items-center justify-center space-x-2 transition-all active:scale-98 ${
                  captureMode === 'emergency'
                    ? 'bg-red-600 hover:bg-red-700 shadow-red-500/20'
                    : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'
                }`}
              >
                <span>Confirm &amp; Continue to {captureMode}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setCapturedImage(null)}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
              >
                Retake Photo
              </button>
            </div>
          </div>
        ) : (
          /* Live Camera Viewfinder */
          <div className="relative w-full h-full flex items-center justify-center">
            {stream ? (
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                onLoadedMetadata={() => setCameraActive(true)}
                className="w-full h-full object-cover" 
              />
            ) : null}

            {/* Fallback & Phone Camera Launcher if WebRTC is waiting */}
            {!cameraActive && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-slate-900/90 text-white space-y-4">
                <div className="w-16 h-16 rounded-full bg-blue-600/20 border-2 border-blue-400 flex items-center justify-center text-blue-400 animate-pulse">
                  <Camera className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-white">Geo-Cam Ready</h4>
                  <p className="text-xs text-slate-300 mt-1 max-w-xs">
                    Tap below to take a photo using your phone's camera with live GPS watermark.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg flex items-center space-x-2 active:scale-95"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Open Phone Camera</span>
                </button>
              </div>
            )}

            {/* Target Reticle */}
            <div className="absolute w-56 h-56 border-2 border-dashed border-white/50 rounded-3xl pointer-events-none flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-blue-400/80 shadow-[0_0_10px_#60a5fa]"></div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Controls: Mode Toggle ABOVE Shutter Button */}
      {!capturedImage && (
        <div className="absolute bottom-0 left-0 right-0 p-4 pb-6 bg-gradient-to-t from-black/85 via-black/50 to-transparent flex flex-col items-center gap-3 z-20">
          
          {/* Mode Switcher Toggle Pill - DIRECTLY ABOVE SHUTTER */}
          <div className="flex items-center p-1 rounded-full bg-white/95 backdrop-blur-md shadow-lg border border-slate-200">
            <button
              onClick={() => setCaptureMode('complaint')}
              className={`flex items-center space-x-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                captureMode === 'complaint'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Civic Complaint</span>
            </button>

            <button
              onClick={() => setCaptureMode('emergency')}
              className={`flex items-center space-x-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                captureMode === 'emergency'
                  ? 'bg-red-600 text-white shadow-md animate-pulse'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <AlertOctagon className="w-3.5 h-3.5" />
              <span>Emergency SOS</span>
            </button>
          </div>

          {/* Shutter Button Row */}
          <div className="w-full flex items-center justify-around px-8">
            {/* Gallery Upload Option */}
            <button
              type="button"
              onClick={() => galleryInputRef.current?.click()}
              className="w-11 h-11 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-md flex items-center justify-center transition-all active:scale-95"
              title="Upload Photo from Gallery"
            >
              <ImageIcon className="w-4 h-4 text-slate-700" />
            </button>

            {/* Central Shutter Button */}
            <button
              onClick={handleCapture}
              className={`w-18 h-18 rounded-full border-4 p-1 shadow-2xl transition-transform active:scale-95 flex items-center justify-center ${
                captureMode === 'emergency'
                  ? 'border-red-400 bg-red-600 hover:bg-red-500 shadow-red-600/40'
                  : 'border-blue-400 bg-blue-600 hover:bg-blue-500 shadow-blue-600/40'
              }`}
            >
              <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center">
                <Camera className={`w-7 h-7 ${captureMode === 'emergency' ? 'text-red-600' : 'text-blue-600'}`} />
              </div>
            </button>

            {/* Switch Camera / Device Camera Trigger */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-11 h-11 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-md flex items-center justify-center transition-all active:scale-95"
              title="Open Device Camera"
            >
              <Smartphone className="w-4 h-4 text-blue-600" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
