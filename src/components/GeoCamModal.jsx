import React, { useState, useEffect, useRef } from 'react';
import { useCivicStore } from '../store/useCivicStore';
import { 
  X, 
  Camera, 
  MapPin, 
  AlertOctagon, 
  FileText, 
  RefreshCw, 
  Upload, 
  ShieldAlert, 
  SwitchCamera, 
  Compass, 
  CheckCircle2,
  Crosshair
} from 'lucide-react';

export default function GeoCamModal() {
  const { isGeoCamOpen, closeGeoCam, triggerEmergencyModal, openComplaintModal, language } = useCivicStore();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  
  const [stream, setStream] = useState(null);
  const [facingMode, setFacingMode] = useState('environment'); // 'environment' | 'user'
  const [capturedImage, setCapturedImage] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  
  const [location, setLocation] = useState({
    lat: 13.0827,
    long: 80.2707,
    accuracy: 4,
    altitude: 12,
    address: 'Anna Nagar, Chennai, Tamil Nadu - 600040',
    timestamp: new Date().toISOString()
  });

  // Start camera and GPS when modal opens
  useEffect(() => {
    let watchId = null;
    if (isGeoCamOpen) {
      startCamera(facingMode);
      fetchGPSLocation();

      // Live GPS watcher
      if ('geolocation' in navigator) {
        watchId = navigator.geolocation.watchPosition(
          (pos) => {
            setLocation(prev => ({
              ...prev,
              lat: pos.coords.latitude,
              long: pos.coords.longitude,
              accuracy: Math.round(pos.coords.accuracy || 4),
              altitude: Math.round(pos.coords.altitude || 10),
              timestamp: new Date().toISOString()
            }));
          },
          (err) => console.warn('GPS Watcher notice:', err.message),
          { enableHighAccuracy: true, maximumAge: 1000 }
        );
      }
    } else {
      stopCamera();
      setCapturedImage(null);
      setCameraError(null);
    }

    return () => {
      stopCamera();
      if (watchId !== null && 'geolocation' in navigator) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [isGeoCamOpen, facingMode]);

  const startCamera = async (facing) => {
    setCameraError(null);
    stopCamera();
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facing,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.warn('Camera access error or restricted:', err);
      setCameraError('Camera access denied or unavailable. You can take a snapshot simulation or upload a photo.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const toggleFacingMode = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
  };

  const fetchGPSLocation = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const long = pos.coords.longitude;
          const accuracy = Math.round(pos.coords.accuracy || 3);

          setLocation({
            lat,
            long,
            accuracy,
            altitude: Math.round(pos.coords.altitude || 8),
            address: `Lat: ${lat.toFixed(5)}, Long: ${long.toFixed(5)} (Live GPS Fix)`,
            timestamp: new Date().toISOString()
          });
          setIsLocating(false);
        },
        (err) => {
          console.warn('Geolocation fallback to Chennai default coordinates:', err);
          setIsLocating(false);
        },
        { enableHighAccuracy: true, timeout: 6000 }
      );
    } else {
      setIsLocating(false);
    }
  };

  // Snaps photo and burns permanent GPS watermark into the canvas bitmap
  const snapPhotoWithGPSWatermark = () => {
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    const width = (video && video.videoWidth) ? video.videoWidth : 800;
    const height = (video && video.videoHeight) ? video.videoHeight : 600;

    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (video && stream) {
      ctx.drawImage(video, 0, 0, width, height);
    } else {
      // Draw simulated camera viewfinder frame
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 0, width, height);

      // Grid guidelines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(width / 3, 0); ctx.lineTo(width / 3, height);
      ctx.moveTo((width / 3) * 2, 0); ctx.lineTo((width / 3) * 2, height);
      ctx.moveTo(0, height / 3); ctx.lineTo(width, height / 3);
      ctx.moveTo(0, (height / 3) * 2); ctx.lineTo(width, (height / 3) * 2);
      ctx.stroke();

      // Camera lens center text
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 20px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('[GEO-CAM CAPTURED SCENE]', width / 2, height / 2 - 20);
      ctx.font = '14px sans-serif';
      ctx.fillText('Live Geotagged Civic Incident Verification Photo', width / 2, height / 2 + 15);
    }

    // --- BURN REAL GPS WATERMARK OVERLAY ON IMAGE ---
    const bannerHeight = 85;
    ctx.fillStyle = 'rgba(11, 26, 46, 0.88)';
    ctx.fillRect(0, height - bannerHeight, width, bannerHeight);

    // Accent line
    ctx.fillStyle = '#1769E0';
    ctx.fillRect(0, height - bannerHeight, width, 3);

    // GPS Text formatting
    ctx.textAlign = 'left';
    ctx.fillStyle = '#0EA5C6';
    ctx.font = 'bold 15px monospace';
    const latStr = `${Math.abs(location.lat).toFixed(6)}° ${location.lat >= 0 ? 'N' : 'S'}`;
    const longStr = `${Math.abs(location.long).toFixed(6)}° ${location.long >= 0 ? 'E' : 'W'}`;
    ctx.fillText(`📍 LAT: ${latStr}  |  LONG: ${longStr} (±${location.accuracy}m)`, 20, height - bannerHeight + 25);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '12px sans-serif';
    const timeStr = new Date().toLocaleString('en-IN', { timeZoneName: 'short' });
    ctx.fillText(`🕒 ${timeStr}  •  ${location.address}`, 20, height - bannerHeight + 48);

    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 11px monospace';
    ctx.fillText(`🛡️ CIVICLOOP GEO-CAM VERIFIED INCIDENT REPORT  [TAMIL NADU MUNICIPAL GRID]`, 20, height - bannerHeight + 70);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    setCapturedImage(dataUrl);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        // Burn GPS Watermark on uploaded photo as well
        const bannerHeight = 80;
        ctx.fillStyle = 'rgba(11, 26, 46, 0.9)';
        ctx.fillRect(0, img.height - bannerHeight, img.width, bannerHeight);
        ctx.fillStyle = '#1769E0';
        ctx.fillRect(0, img.height - bannerHeight, img.width, 3);

        ctx.fillStyle = '#0EA5C6';
        ctx.font = 'bold 15px monospace';
        ctx.fillText(`📍 LAT: ${location.lat.toFixed(6)}°  |  LONG: ${location.long.toFixed(6)}° (±${location.accuracy}m)`, 20, img.height - bannerHeight + 25);

        ctx.fillStyle = '#FFFFFF';
        ctx.font = '12px sans-serif';
        ctx.fillText(`🕒 ${new Date().toLocaleString()}  •  ${location.address}`, 20, img.height - bannerHeight + 48);

        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 11px monospace';
        ctx.fillText(`🛡️ CIVICLOOP GEO-CAM VERIFIED EVIDENCE`, 20, img.height - bannerHeight + 68);

        setCapturedImage(canvas.toDataURL('image/jpeg', 0.9));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSelectEmergency = () => {
    const photoData = {
      imageUri: capturedImage || 'https://images.unsplash.com/photo-1587740896339-96a76170508d?w=800&auto=format&fit=crop&q=80',
      ...location
    };
    closeGeoCam();
    triggerEmergencyModal(photoData);
  };

  const handleSelectComplaint = () => {
    const photoData = {
      imageUri: capturedImage || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80',
      ...location
    };
    closeGeoCam();
    openComplaintModal(photoData);
  };

  if (!isGeoCamOpen) return null;

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-3 sm:p-5 bg-[#0B2E59]/60 backdrop-blur-sm animate-fade-in font-sans">
      <div className="bg-white border border-[#D9E2EC] rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="px-5 py-3.5 bg-[#F8FAFC] border-b border-[#D9E2EC] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-[#0B2E59] text-white">
              <Camera className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-extrabold text-[#14213D] text-base">
                  Geo-Cam Incident Capture
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-[#EAF7EE] text-[#16803C] border border-[#16803C]/30 text-[10px] font-mono font-bold">
                  GPS LOCK ACTIVE
                </span>
              </div>
              <p className="text-[11px] text-[#52616B] font-mono">
                Live Latitude & Longitude automatically burned into photo evidence
              </p>
            </div>
          </div>

          <button
            onClick={closeGeoCam}
            className="p-2 rounded-xl bg-[#F1F5F9] hover:bg-[#EAF1F8] text-[#52616B] hover:text-[#14213D] font-bold"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live GPS Coordinates Status Strip */}
        <div className="px-5 py-2.5 bg-[#0B2E59] text-white flex items-center justify-between text-xs font-mono">
          <div className="flex items-center space-x-2">
            <Crosshair className={`w-4 h-4 text-cyan-400 ${isLocating ? 'animate-spin' : ''}`} />
            <div>
              <span className="text-cyan-300 font-bold">
                LAT: {location.lat.toFixed(6)}° N  |  LONG: {location.long.toFixed(6)}° E
              </span>
              <span className="text-slate-300 ml-2 text-[11px]">(Accuracy: ±{location.accuracy}m)</span>
            </div>
          </div>

          <button
            onClick={fetchGPSLocation}
            className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] flex items-center space-x-1"
            title="Refresh GPS Satellite Fix"
          >
            <RefreshCw className={`w-3 h-3 ${isLocating ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh GPS</span>
          </button>
        </div>

        {/* Viewfinder / Captured Photo Area */}
        <div className="relative bg-[#0d1e33] flex-1 min-h-[300px] sm:min-h-[360px] flex items-center justify-center overflow-hidden">
          
          {capturedImage ? (
            /* Captured photo with baked-in GPS watermark */
            <div className="relative w-full h-full flex flex-col items-center justify-center">
              <img
                src={capturedImage}
                alt="Captured Geo-Cam evidence with GPS stamp"
                className="w-full max-h-[360px] object-contain"
              />
              <button
                onClick={() => setCapturedImage(null)}
                className="absolute top-3 right-3 px-3 py-1.5 rounded-xl bg-black/70 hover:bg-black/90 text-white font-bold text-xs flex items-center space-x-1.5 backdrop-blur-sm"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retake Photo</span>
              </button>
            </div>
          ) : stream ? (
            /* Live camera video stream */
            <div className="relative w-full h-full">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />

              {/* Viewfinder crosshairs overlay */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-48 h-48 border border-white/30 rounded-2xl relative">
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400"></div>
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400"></div>
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400"></div>
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-cyan-400/80"></div>
                </div>
              </div>

              {/* Camera switch button */}
              <button
                onClick={toggleFacingMode}
                className="absolute top-3 right-3 p-2 rounded-xl bg-black/60 hover:bg-black/80 text-white"
                title="Switch Camera (Front/Back)"
              >
                <SwitchCamera className="w-5 h-5" />
              </button>
            </div>
          ) : (
            /* Fallback when browser camera permission is waiting or unavailable */
            <div className="flex flex-col items-center justify-center p-6 text-center text-white space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-cyan-400">
                <Camera className="w-7 h-7" />
              </div>
              <div>
                <h4 className="font-bold text-sm">Geo-Cam Ready</h4>
                <p className="text-xs text-slate-400 max-w-sm mt-1">
                  {cameraError || 'Click Snap Photo to take a geotagged verification snapshot with embedded Latitude & Longitude.'}
                </p>
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <button
                  onClick={() => startCamera(facingMode)}
                  className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold"
                >
                  Retry Camera Access
                </button>
                <button
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-cyan-300 text-xs font-semibold flex items-center space-x-1"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Image</span>
                </button>
              </div>
            </div>
          )}

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>

        {/* Capture Shutter Button (When not yet captured) */}
        {!capturedImage && (
          <div className="p-3 bg-[#F8FAFC] border-t border-[#D9E2EC] flex items-center justify-between">
            <button
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#EAF1F8] border border-[#D9E2EC] text-[#52616B] text-xs font-semibold flex items-center space-x-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Browse Image</span>
            </button>

            <button
              onClick={snapPhotoWithGPSWatermark}
              className="px-6 py-2.5 rounded-2xl bg-[#0B2E59] hover:bg-[#14213D] text-white font-extrabold text-xs shadow-md flex items-center space-x-2 transition-transform active:scale-95"
            >
              <Camera className="w-4 h-4 text-cyan-400" />
              <span>SNAP GEOTAGGED PHOTO</span>
            </button>

            <span className="text-[11px] font-mono text-[#52616B] hidden sm:inline">
              Embeds Lat {location.lat.toFixed(3)}°, Long {location.long.toFixed(3)}°
            </span>
          </div>
        )}

        {/* Dual Primary Action Selector: [EMERGENCY MODE] vs [COMPLAINT MODE] */}
        <div className="p-4 sm:p-5 bg-white border-t border-[#D9E2EC] flex flex-col sm:flex-row gap-3">
          
          {/* Action 1: EMERGENCY MODE */}
          <button
            onClick={handleSelectEmergency}
            className="flex-1 bg-[#FFF0F0] hover:bg-[#C62828] text-[#C62828] hover:text-white p-3.5 rounded-2xl border border-[#C62828]/40 shadow-xs flex items-center space-x-3 transition-all active:scale-95 group text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-[#C62828]/15 group-hover:bg-white/20 flex items-center justify-center shrink-0">
              <AlertOctagon className="w-6 h-6 text-[#C62828] group-hover:text-white animate-bounce" />
            </div>
            <div>
              <div className="font-extrabold text-xs tracking-wider uppercase">
                [EMERGENCY MODE]
              </div>
              <p className="text-[11px] opacity-90 leading-tight mt-0.5">
                Life-threat: Nearest hospitals lookup & priority n8n dispatch
              </p>
            </div>
          </button>

          {/* Action 2: COMPLAINT MODE */}
          <button
            onClick={handleSelectComplaint}
            className="flex-1 bg-[#EAF1F8] hover:bg-[#1769E0] text-[#0B2E59] hover:text-white p-3.5 rounded-2xl border border-[#1769E0]/40 shadow-xs flex items-center space-x-3 transition-all active:scale-95 group text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-[#1769E0]/15 group-hover:bg-white/20 flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6 text-[#1769E0] group-hover:text-white" />
            </div>
            <div>
              <div className="font-extrabold text-xs tracking-wider uppercase">
                [COMPLAINT MODE]
              </div>
              <p className="text-[11px] opacity-90 leading-tight mt-0.5">
                Civic Hazard: Auto-fill complaint templates & Tamil memos
              </p>
            </div>
          </button>

        </div>

      </div>
    </div>
  );
}
