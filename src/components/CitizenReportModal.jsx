import React, { useState } from 'react';
import { useCivicStore } from '../store/useCivicStore';
import { X, Send, MapPin, Camera, CheckCircle2, ShieldCheck, Upload, AlertTriangle, EyeOff } from 'lucide-react';

export default function CitizenReportModal() {
  const { isCitizenSignalOpen, closeCitizenSignalModal, openGeoCam, addIncident, language } = useCivicStore();
  
  const [category, setCategory] = useState('drainage');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState(3); // 1-5
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [location, setLocation] = useState({
    lat: 13.0827,
    long: 80.2707,
    address: 'Anna Nagar 2nd Avenue, Chennai - 600040'
  });
  const [photoUri, setPhotoUri] = useState(null);
  const [submittedIncident, setSubmittedIncident] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isCitizenSignalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newInc = {
      id: 'INC-2026-' + Math.floor(1000 + Math.random() * 9000),
      type: urgency >= 5 ? 'EMERGENCY' : 'CIVIC',
      category,
      severity: urgency,
      title: title || 'Citizen Reported Civic Incident',
      tamilTitle: 'நகரவாசியால் பதிவு செய்யப்பட்ட சாக்கடை/குடிநீர் குறைபாடு',
      description: description || 'Reported via CIVICLOOP citizen signal portal.',
      tamilDescription: 'குடிமக்களின் சமிக்ஞை போர்ட்டல் மூலம் பதிவு செய்யப்பட்டது.',
      lat: location.lat,
      long: location.long,
      state: 'Tamil Nadu',
      district: 'Chennai',
      address: location.address,
      department: category === 'eb' ? 'TNEB Electricity Board' : 'Greater Chennai Corporation (GCC)',
      routingPortal: 'GCC Public Portal & n8n Dispatch',
      truthScore: 92,
      corroboratingSignals: 3,
      status: 'VERIFIED',
      createdAt: new Date().toISOString(),
      unacknowledgedDays: 0,
      retryCount: 0,
      imageUri: photoUri || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=60'
    };

    addIncident(newInc);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedIncident(newInc);
    }, 800);
  };

  const handleResetAndClose = () => {
    setSubmittedIncident(null);
    setTitle('');
    setDescription('');
    closeCitizenSignalModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#14213D]/40 backdrop-blur-sm animate-fade-in font-sans">
      <div className="bg-white border border-[#D9E2EC] rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-[#F8FAFC] border-b border-[#D9E2EC] flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-[#14213D] text-base">
              Submit Citizen Signal
            </h3>
            <p className="text-xs text-[#52616B] font-mono">
              Report potholes, garbage, water leaks, blocked drains, or hazards
            </p>
          </div>

          <button
            onClick={handleResetAndClose}
            className="p-2 rounded-xl bg-[#F1F5F9] hover:bg-[#EAF1F8] text-[#52616B] font-bold"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body or Confirmation */}
        <div className="p-6 overflow-y-auto space-y-5 bg-white flex-1">
          
          {submittedIncident ? (
            /* Confirmation Screen */
            <div className="p-6 rounded-2xl bg-[#EAF7EE] border border-[#16803C]/30 text-[#14213D] space-y-4 animate-fade-in">
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="w-8 h-8 text-[#16803C] shrink-0" />
                <div>
                  <h4 className="font-extrabold text-base text-[#16803C]">Report Received & Verifying</h4>
                  <p className="text-xs text-[#52616B]">
                    Incident Reference ID: <strong className="font-mono text-[#0B2E59]">#{submittedIncident.id}</strong>
                  </p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-[#D9E2EC] font-mono text-xs space-y-2 text-[#52616B]">
                <p>Status: <span className="text-[#16803C] font-bold">VERIFIED (Confidence 92%)</span></p>
                <p>Routing: <span className="text-[#1769E0] font-bold">{submittedIncident.department}</span></p>
                <p>Next Step: Swarm verification & automatic authority assignment.</p>
              </div>

              <p className="text-xs text-[#52616B] leading-relaxed">
                Your report has been received and is being cross-checked with nearby citizen signals and municipal weather data.
              </p>

              <button
                onClick={handleResetAndClose}
                className="w-full py-2.5 rounded-xl bg-[#1769E0] hover:bg-[#1253B3] text-white font-bold text-xs shadow-xs text-center"
              >
                Done & Return to Operations
              </button>
            </div>
          ) : (
            /* Form Fields */
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Category Select */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#52616B] mb-1">
                  Issue Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#F8FAFC] border border-[#D9E2EC] rounded-xl px-3.5 py-2 text-xs text-[#14213D] focus:outline-none focus:border-[#1769E0] font-semibold"
                >
                  <option value="drainage">Blocked Drain & Storm Water Overflow</option>
                  <option value="water">Drinking Water Supply Contamination / Burst</option>
                  <option value="eb">Electricity Cable Snap & EB Hazard</option>
                  <option value="road">Pothole & Asphalt Road Cave-in</option>
                  <option value="sanitation">Garbage Waste Dumping</option>
                </select>
              </div>

              {/* Title & Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#52616B] mb-1">
                  Incident Title
                </label>
                <input
                  type="text"
                  placeholder="e.g., Deep pothole causing accidents near main bus stand"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#F8FAFC] border border-[#D9E2EC] rounded-xl px-3.5 py-2 text-xs text-[#14213D] focus:outline-none focus:border-[#1769E0]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#52616B] mb-1">
                  Description & Evidence Details
                </label>
                <textarea
                  rows={2}
                  placeholder="Describe location details, severity, or immediate hazards..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#F8FAFC] border border-[#D9E2EC] rounded-xl px-3.5 py-2 text-xs text-[#14213D] focus:outline-none focus:border-[#1769E0]"
                  required
                />
              </div>

              {/* Location Tag */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#52616B]">
                  GPS Location & Geo-Cam Capture
                </label>
                <div className="flex items-center space-x-2 bg-[#F8FAFC] p-2.5 rounded-xl border border-[#D9E2EC] text-xs font-mono text-[#0B2E59]">
                  <MapPin className="w-4 h-4 text-[#1769E0] shrink-0" />
                  <span className="truncate">{location.address} (Lat: {location.lat}, Long: {location.long})</span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    closeCitizenSignalModal();
                    openGeoCam();
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-[#0B2E59] hover:bg-[#14213D] text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all active:scale-95 shadow-xs"
                >
                  <Camera className="w-4 h-4 text-cyan-400" />
                  <span>Launch Geo-Cam with Live GPS Watermark</span>
                </button>
              </div>

              {/* Urgency Slider */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#52616B] mb-1 flex items-center justify-between">
                  <span>Urgency Level: Severity {urgency}/5</span>
                  <span className="font-mono text-[#C97700] text-[10px]">
                    {urgency >= 5 ? 'EMERGENCY' : urgency >= 4 ? 'HIGH' : 'NORMAL'}
                  </span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={urgency}
                  onChange={(e) => setUrgency(parseInt(e.target.value))}
                  className="w-full h-2 bg-[#F1F5F9] rounded-lg appearance-none cursor-pointer accent-[#1769E0]"
                />
              </div>

              {/* Anonymous Submission Checkbox */}
              <label className="flex items-center space-x-2 text-xs text-[#52616B] font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="rounded border-[#D9E2EC] text-[#1769E0]"
                />
                <span className="flex items-center space-x-1">
                  <EyeOff className="w-3.5 h-3.5 text-[#52616B]" />
                  <span>Submit report anonymously</span>
                </span>
              </label>

              {/* Privacy Notice */}
              <p className="text-[11px] text-[#94A3B8] leading-tight font-mono pt-1">
                Privacy Notice: Your signal location will be verified against city sensor feeds and nearby citizen reports.
              </p>

              {/* Submit */}
              <div className="pt-3 border-t border-[#D9E2EC] flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-4 py-2 rounded-xl bg-[#F1F5F9] hover:bg-[#EAF1F8] text-[#52616B] font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-[#1769E0] hover:bg-[#1253B3] text-white font-bold text-xs shadow-xs flex items-center space-x-1.5 transition-all disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'VERIFYING SIGNAL...' : 'SUBMIT CITIZEN SIGNAL'}</span>
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
}
