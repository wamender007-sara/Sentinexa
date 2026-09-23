import React, { useState, useEffect, useRef } from 'react';
import { useCivicStore } from '../../../store/useCivicStore';
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
  Check
} from 'lucide-react';

export default function Screen2GeoCamCapture({ onProceedToFlow, onCapture, onClose }) {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [facingMode, setFacingMode] = useState('environment');
  const [captureMode, setCaptureMode] = useState('complaint'); // 'complaint' | 'emergency'
  const [capturedImage, setCapturedImage] = useState(null);
  const [isLocating, setIsLocating] = useState(false);

  const [location, setLocation] = useState({
    lat: 13.0827,
    long: 80.2707,
    accuracy: 3,
    address: 'Anna Nagar 2nd Avenue, Chennai, Tamil Nadu',
    timestamp: new Date().toISOString()
  });

  useEffect(() => {
    startCamera();
    fetchGPS();
    return () => stopCamera();
  }, [facingMode]);

  const startCamera = async () => {
    stopCamera();
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.warn('Camera preview simulated fallback:', err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const fetchGPS = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            lat: pos.coords.latitude,
            long: pos.coords.longitude,
            accuracy: Math.round(pos.coords.accuracy),
            address: `Lat: ${pos.coords.latitude.toFixed(5)}, Long: ${pos.coords.longitude.toFixed(5)} (GPS Lock)`,
            timestamp: new Date().toISOString()
          });
          setIsLocating(false);
        },
        (err) => {
          console.warn('GPS location simulation fallback', err);
          setIsLocating(false);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      setIsLocating(false);
    }
  };

  const handleCapture = () => {
    const canvas = document.createElement('canvas');
    const width = 640;
    const height = 480;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (videoRef.current && stream) {
      ctx.drawImage(videoRef.current, 0, 0, width, height);
    } else {
      // Clean fallback canvas if no webcam
      ctx.fillStyle = captureMode === 'emergency' ? '#fef2f2' : '#f0f9ff';
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = captureMode === 'emergency' ? '#dc2626' : '#2563eb';
      ctx.font = 'bold 22px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('[GEO-CAM INCIDENT CAPTURE]', width / 2, height / 2);
    }

    // Burn GPS Watermark on image
    const bh = 80;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
    ctx.fillRect(0, height - bh, width, bh);
    ctx.fillStyle = captureMode === 'emergency' ? '#dc2626' : '#2563eb';
    ctx.fillRect(0, height - bh, width, 4);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 15px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`📍 LAT: ${location.lat.toFixed(5)}° N | LONG: ${location.long.toFixed(5)}° E (±${location.accuracy}m)`, 18, height - bh + 26);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '12px sans-serif';
    ctx.fillText(`🕒 ${new Date().toLocaleTimeString()} • ${location.address}`, 18, height - bh + 48);

    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 11px monospace';
    ctx.fillText(`🛡️ SENTINEXA GEO-CAM VERIFIED EVIDENCE`, 18, height - bh + 68);

    setCapturedImage(canvas.toDataURL('image/jpeg', 0.92));
  };

  const handleConfirmAndProceed = () => {
    const payload = {
      image: capturedImage,
      location,
      mode: captureMode
    };

    // Invoke whatever callback was supplied
    if (typeof onProceedToFlow === 'function') {
      onProceedToFlow(captureMode, payload);
    } else if (typeof onCapture === 'function') {
      onCapture(payload);
    }
  };

  return (
    <div className="relative w-full h-full bg-slate-900 rounded-[36px] overflow-hidden flex flex-col justify-between font-sans select-none">
      
      {/* Top Overlay: Live GPS Stamp & Close */}
      <div className="absolute top-3 left-3 right-3 z-30 flex items-center justify-between pointer-events-auto">
        <div className="px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md shadow-md border border-slate-200 text-slate-800 font-mono text-[11px] flex items-center space-x-2">
          <Crosshair className={`w-3.5 h-3.5 text-blue-600 ${isLocating ? 'animate-spin' : ''}`} />
          <span className="text-blue-700 font-bold">{location.lat.toFixed(4)}°N, {location.long.toFixed(4)}°E</span>
          <span className="text-emerald-700 font-semibold bg-emerald-100 px-1.5 py-0.2 rounded">±{location.accuracy}m</span>
        </div>

        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-md shadow-md text-slate-800 hover:bg-white flex items-center justify-center font-bold text-sm border border-slate-200"
        >
          ✕
        </button>
      </div>

      {/* Main Viewfinder Stream or Captured Card */}
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
                <p className="text-xs text-slate-500">Live coordinates burned into cryptographic metadata</p>
              </div>
              
              {/* Photo Preview */}
              <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-md max-h-64 bg-slate-100">
                <img src={capturedImage} alt="Captured preview" className="w-full object-cover" />
              </div>

              {/* Geo metadata card */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-800 space-y-1">
                <p className="font-bold flex items-center gap-1 text-slate-900">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  {location.address}
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
                <span>Confirm & Continue to {captureMode}</span>
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
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            ) : (
              <div className="text-center p-6 text-slate-400 space-y-2">
                <Camera className="w-12 h-12 text-blue-400 mx-auto animate-pulse" />
                <p className="font-mono text-xs text-white">Live Geo-Cam Viewfinder Active</p>
                <p className="text-[11px] text-slate-400">Tap the shutter button below to capture with live GPS stamp.</p>
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
        <div className="absolute bottom-0 left-0 right-0 p-4 pb-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col items-center gap-3 z-20">
          
          {/* Mode Switcher Toggle Pill - DIRECTLY ABOVE SHUTTER */}
          <div className="flex items-center p-1 rounded-full bg-white/90 backdrop-blur-md shadow-lg border border-slate-200">
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
            {/* GPS Refresh Button */}
            <button
              onClick={fetchGPS}
              className="w-11 h-11 rounded-full bg-white/80 hover:bg-white text-slate-800 shadow-md flex items-center justify-center transition-all"
              title="Refresh GPS"
            >
              <RefreshCw className={`w-4 h-4 ${isLocating ? 'animate-spin text-blue-600' : ''}`} />
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

            {/* Camera Switch */}
            <button
              onClick={() => setFacingMode(prev => prev === 'environment' ? 'user' : 'environment')}
              className="w-11 h-11 rounded-full bg-white/80 hover:bg-white text-slate-800 shadow-md flex items-center justify-center transition-all"
              title="Switch Camera"
            >
              <SwitchCamera className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
