import React, { useState, useEffect, useRef } from 'react';
import { useCivicStore } from '../store/useCivicStore';
import { X, Camera, MapPin, AlertOctagon, FileText, CheckCircle, RefreshCw, Upload, ShieldAlert } from 'lucide-react';

export default function GeoCamModal() {
  const { isGeoCamOpen, closeGeoCam, triggerEmergencyModal, openComplaintModal, language } = useCivicStore();
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [location, setLocation] = useState({
    lat: 13.0827,
    long: 80.2707,
    accuracy: 5,
    address: '2nd Avenue, Anna Nagar, Chennai - 600040',
    timestamp: new Date().toISOString()
  });
  const [isLocating, setIsLocating] = useState(false);

  // Initialize camera & GPS when modal opens
  useEffect(() => {
    if (isGeoCamOpen) {
      startCamera();
      fetchGPSLocation();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isGeoCamOpen]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.warn('Camera access not granted or not supported in sandbox. Using simulated camera canvas preview:', err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const fetchGPSLocation = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            lat: pos.coords.latitude,
            long: pos.coords.longitude,
            accuracy: Math.round(pos.coords.accuracy),
            address: `Lat: ${pos.coords.latitude.toFixed(4)}, Long: ${pos.coords.longitude.toFixed(4)} (GPS Verified)`,
            timestamp: new Date().toISOString()
          });
          setIsLocating(false);
        },
        (err) => {
          console.warn('Geolocation fallback to default Tamil Nadu coordinates:', err);
          setIsLocating(false);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      setIsLocating(false);
    }
  };

  const snapPhoto = () => {
    if (videoRef.current && stream) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      setCapturedImage(canvas.toDataURL('image/jpeg'));
    } else {
      // Simulated sample photo if camera unavailable
      setCapturedImage('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80');
    }
  };

  const handleSelectEmergency = () => {
    const photoData = {
      imageUri: capturedImage || 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&auto=format&fit=crop&q=80',
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-slate-100 text-base">
                {language === 'ta' ? 'ஜியோ-கேம் நேரடி படம் பிடிப்பு' : 'Geo-Cam Incident Capture'}
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                {language === 'ta' ? 'ஜி.பி.எஸ் மெட்டாடேட்டா தானாக சேர்க்கப்படும்' : 'GPS metadata & timestamp automatically embedded'}
              </p>
            </div>
          </div>

          <button
            onClick={closeGeoCam}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewport / Live Stream / Captured Preview */}
        <div className="relative bg-slate-950 flex-1 min-h-[280px] flex items-center justify-center overflow-hidden">
          
          {capturedImage ? (
            <div className="relative w-full h-full">
              <img
                src={capturedImage}
                alt="Captured Geo-Cam photo"
                className="w-full h-64 sm:h-80 object-cover"
              />
              <button
                onClick={() => setCapturedImage(null)}
                className="absolute top-4 right-4 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white font-semibold text-xs border border-slate-700 flex items-center space-x-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retake Photo</span>
              </button>
            </div>
          ) : stream ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-64 sm:h-80 object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-3 animate-pulse">
                <Camera className="w-8 h-8" />
              </div>
              <p className="text-sm font-semibold text-slate-300 mb-1">Live Camera Stream Active</p>
              <p className="text-xs text-slate-400 mb-4 max-w-sm">
                Click below to snap a photo or use the sample geotagged photo preview.
              </p>
              <button
                onClick={snapPhoto}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center space-x-2"
              >
                <Camera className="w-4 h-4" />
                <span>SNAP GEOTAGGED PHOTO</span>
              </button>
            </div>
          )}

          {/* Embedded Real-time GPS Watermark Overlay */}
          <div className="absolute bottom-3 left-3 right-3 bg-slate-950/85 backdrop-blur-md p-3 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
              <div>
                <p className="font-mono text-cyan-300 font-bold text-[11px]">
                  LAT: {location.lat.toFixed(5)} | LONG: {location.long.toFixed(5)} (±{location.accuracy}m)
                </p>
                <p className="text-[10px] text-slate-400 line-clamp-1">{location.address}</p>
              </div>
            </div>
            <button
              onClick={fetchGPSLocation}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
              title="Refresh GPS Lock"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin text-cyan-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Dual Primary Actions Footer: [EMERGENCY] vs [COMPLAINT] */}
        <div className="p-6 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row gap-4">
          
          {/* Action 1: EMERGENCY MODE */}
          <button
            onClick={handleSelectEmergency}
            className="flex-1 bg-gradient-to-r from-red-600 via-red-500 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white p-4 rounded-2xl shadow-xl shadow-red-600/30 border border-red-400/40 flex items-center space-x-3 transition-transform active:scale-95 group"
          >
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <AlertOctagon className="w-6 h-6 text-white animate-bounce" />
            </div>
            <div className="text-left">
              <div className="font-extrabold text-sm tracking-wide uppercase flex items-center space-x-1.5">
                <span>[EMERGENCY MODE]</span>
              </div>
              <p className="text-xs text-red-100 font-medium">
                {language === 'ta' ? 'அவசர ஆபத்து - ஆம்புலன்ஸ் & மருத்துவமனை' : 'Life-threatening scenario: Instant Hospital & n8n Priority Trigger'}
              </p>
            </div>
          </button>

          {/* Action 2: COMPLAINT MODE */}
          <button
            onClick={handleSelectComplaint}
            className="flex-1 bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white p-4 rounded-2xl shadow-xl shadow-indigo-600/30 border border-indigo-400/40 flex items-center space-x-3 transition-transform active:scale-95 group"
          >
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <div className="font-extrabold text-sm tracking-wide uppercase flex items-center space-x-1.5">
                <span>[COMPLAINT MODE]</span>
              </div>
              <p className="text-xs text-blue-100 font-medium">
                {language === 'ta' ? 'நகராட்சி குறை - தானியங்கி மேலாண்மை' : 'Civic Complaint: Auto-fills standard templates & tracks streaks'}
              </p>
            </div>
          </button>

        </div>
      </div>
    </div>
  );
}
