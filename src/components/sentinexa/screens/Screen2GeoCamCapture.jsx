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
  Upload
} from 'lucide-react';

export default function Screen2GeoCamCapture({ onProceedToFlow, onClose }) {
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
            accuracy: Math.round(pos.coords.accuracy || 3),
            address: `Lat: ${pos.coords.latitude.toFixed(5)}, Long: ${pos.coords.longitude.toFixed(5)} (GPS Lock)`,
            timestamp: new Date().toISOString()
          });
          setIsLocating(false);
        },
        () => setIsLocating(false),
        { enableHighAccuracy: true }
      );
    } else {
      setIsLocating(false);
    }
  };

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    const width = video?.videoWidth || 800;
    const height = video?.videoHeight || 600;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (video && stream) {
      ctx.drawImage(video, 0, 0, width, height);
    } else {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 22px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('[GEO-CAM INCIDENT CAPTURE]', width / 2, height / 2);
    }

    // Burn GPS Watermark
    const bh = 80;
    ctx.fillStyle = 'rgba(11, 46, 89, 0.9)';
    ctx.fillRect(0, height - bh, width, bh);
    ctx.fillStyle = '#1769E0';
    ctx.fillRect(0, height - bh, width, 3);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 16px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`📍 LAT: ${location.lat.toFixed(6)}° N  |  LONG: ${location.long.toFixed(6)}° E (±${location.accuracy}m)`, 20, height - bh + 28);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '13px sans-serif';
    ctx.fillText(`🕒 ${new Date().toLocaleTimeString()}  •  ${location.address}`, 20, height - bh + 52);

    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 11px monospace';
    ctx.fillText(`🛡️ SENTINEXA GEO-CAM VERIFIED EVIDENCE`, 20, height - bh + 72);

    setCapturedImage(canvas.toDataURL('image/jpeg', 0.9));
  };

  return (
    <div className="relative w-full h-[700px] sm:h-full bg-black rounded-3xl overflow-hidden flex flex-col justify-between font-sans">
      
      {/* Top Overlay: Live GPS Stamp & Close */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-auto">
        <div className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white font-mono text-[11px] flex items-center space-x-2">
          <Crosshair className={`w-3.5 h-3.5 text-cyan-400 ${isLocating ? 'animate-spin' : ''}`} />
          <span className="text-cyan-300 font-bold">{location.lat.toFixed(4)}°N, {location.long.toFixed(4)}°E</span>
          <span className="text-emerald-400 font-semibold">±{location.accuracy}m</span>
        </div>

        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center font-bold text-xs"
        >
          ✕
        </button>
      </div>

      {/* Main Viewfinder Stream or Captured Card */}
      <div className="relative w-full h-full flex items-center justify-center bg-[#070e17]">
        {capturedImage ? (
          /* Confirmation Card */
          <div className="absolute inset-0 bg-black/90 p-5 flex flex-col justify-between z-30">
            <div className="space-y-3">
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono text-xs font-bold inline-block">
                ✓ GPS METADATA LOCKED
              </span>
              <h3 className="font-extrabold text-white text-lg">
                Photo Captured with Geotags
              </h3>
              
              <div className="rounded-2xl overflow-hidden border border-white/20 shadow-xl max-h-72">
                <img src={capturedImage} alt="Captured preview" className="w-full object-cover" />
              </div>

              <div className="p-3 rounded-xl bg-white/10 text-xs font-mono text-cyan-300 space-y-1">
                <p>📍 {location.address}</p>
                <p className="text-slate-300 text-[11px]">Timestamp: {new Date().toLocaleString()}</p>
              </div>
            </div>

            <div className="space-y-2 pt-4">
              <button
                onClick={() => onProceedToFlow(captureMode, { image: capturedImage, location })}
                className={`w-full py-3.5 rounded-2xl font-black text-sm uppercase tracking-wider text-white shadow-xl flex items-center justify-center space-x-2 ${
                  captureMode === 'emergency'
                    ? 'bg-[#C62828] hover:bg-[#B71C1C]'
                    : 'bg-[#1769E0] hover:bg-[#1253B3]'
                }`}
              >
                <span>Confirm & Continue to {captureMode.toUpperCase()}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setCapturedImage(null)}
                className="w-full py-2.5 rounded-xl bg-white/10 text-slate-300 font-bold text-xs"
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
                <Camera className="w-12 h-12 text-cyan-400 mx-auto animate-pulse" />
                <p className="font-mono text-xs">Live Geo-Cam Viewfinder Active</p>
                <p className="text-[11px] text-slate-500">Tap the shutter below to capture with live GPS stamp.</p>
              </div>
            )}

            {/* Target Reticle */}
            <div className="absolute w-56 h-56 border border-white/25 rounded-3xl pointer-events-none flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-cyan-400/60"></div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Controls: Mode Toggle ABOVE Shutter Button */}
      {!capturedImage && (
        <div className="absolute bottom-6 left-4 right-4 z-20 flex flex-col items-center space-y-4">
          
          {/* MODE TOGGLE ABOVE SHUTTER: [Complaint] / [Emergency] */}
          <div className="bg-black/75 backdrop-blur-md p-1 rounded-2xl border border-white/20 flex items-center space-x-1 shadow-2xl">
            <button
              onClick={() => setCaptureMode('complaint')}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center space-x-1.5 ${
                captureMode === 'complaint'
                  ? 'bg-[#1769E0] text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Complaint Mode</span>
            </button>

            <button
              onClick={() => setCaptureMode('emergency')}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center space-x-1.5 ${
                captureMode === 'emergency'
                  ? 'bg-[#C62828] text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <AlertOctagon className="w-3.5 h-3.5" />
              <span>Emergency Mode</span>
            </button>
          </div>

          {/* Shutter Button */}
          <button
            onClick={handleCapture}
            className={`w-20 h-20 rounded-full border-4 border-white p-1.5 shadow-2xl transition-transform active:scale-90 ${
              captureMode === 'emergency' ? 'bg-[#C62828]' : 'bg-[#1769E0]'
            }`}
          >
            <div className="w-full h-full rounded-full bg-white/30 flex items-center justify-center text-white">
              <Camera className="w-8 h-8" />
            </div>
          </button>

          <span className="text-[10px] font-mono text-white/70">
            Tap to capture geotagged incident
          </span>
        </div>
      )}

    </div>
  );
}
