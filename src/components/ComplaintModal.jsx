import React, { useState } from 'react';
import { useCivicStore } from '../store/useCivicStore';
import { translationService } from '../services/translationService';
import { X, FileText, Send, Languages, MapPin, Building2, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function ComplaintModal() {
  const { 
    isComplaintOpen, 
    closeComplaintModal, 
    capturedGeoPhoto, 
    addIncident, 
    n8nConfig,
    language 
  } = useCivicStore();

  const [category, setCategory] = useState('drainage');
  const [title, setTitle] = useState('Underground Drain Overflow & Water Stagnation');
  const [tamilTitle, setTamilTitle] = useState('நிலத்தடி சாக்கடை கழிவுநீர் பெருக்கெடுத்து ஓடுதல்');
  const [description, setDescription] = useState('Severe sewage leak causing public health risk and road blockage.');
  const [tamilDescription, setTamilDescription] = useState('சாக்கடை கழிவுநீர் ரோட்டில் வழிந்து ஓடி சுகாதார சீர்கேடு மற்றும் போக்குவரத்து அடைப்பு ஏற்படுத்துகிறது.');
  const [department, setDepartment] = useState('Greater Chennai Corporation (GCC) - Water & Sewage Dept');
  const [routingPortal, setRoutingPortal] = useState('GCC Public Portal & CM Grievance Cell');
  const [activeTabLang, setActiveTabLang] = useState('ta'); // 'ta' | 'en'
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isComplaintOpen) return null;

  const lat = capturedGeoPhoto?.lat || 13.0850;
  const long = capturedGeoPhoto?.long || 80.2101;
  const address = capturedGeoPhoto?.address || '2nd Avenue, Anna Nagar, Chennai - 600040';

  const previewIncident = {
    id: 'INC-DRAFT',
    title,
    tamilTitle,
    description,
    tamilDescription,
    lat,
    long,
    address,
    department,
    routingPortal,
    truthScore: 95
  };

  const memo = translationService.generateFormalGrievance(previewIncident);

  const handleSubmitComplaint = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newTicket = {
      id: 'INC-TN-' + Math.floor(1000 + Math.random() * 9000),
      type: 'COMPLAINT',
      category,
      title,
      tamilTitle,
      description,
      tamilDescription,
      lat,
      long,
      state: 'Tamil Nadu',
      district: 'Chennai',
      address,
      department,
      routingPortal,
      truthScore: 95,
      status: 'VERIFIED',
      createdAt: new Date().toISOString(),
      unacknowledgedDays: 0,
      retryCount: 0,
      imageUri: capturedGeoPhoto?.imageUri || 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=600&auto=format&fit=crop&q=60'
    };

    addIncident(newTicket);

    setTimeout(() => {
      setIsSubmitting(false);
      closeComplaintModal();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-slate-100 text-base">
                {language === 'ta' ? 'நகராட்சி குறைபாடுகள் பதிவு மற்றும் வழிநடத்தல்' : 'Civic Complaint Registration & n8n Routing'}
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Auto-filled from Geo-Cam metadata | Bilingual Memorandum Generator
              </p>
            </div>
          </div>

          <button
            onClick={closeComplaintModal}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmitComplaint} className="p-6 overflow-y-auto space-y-6 flex-1 bg-slate-950">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Left Column: Form Inputs */}
            <div className="space-y-4">
              
              {/* Category Select */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Issue Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-semibold"
                >
                  <option value="drainage">Storm Water & Sewerage Drain Overflow</option>
                  <option value="water">Drinking Water Supply Contamination / Pipeline Burst</option>
                  <option value="eb">TNEB Electricity Board & Cable Snap</option>
                  <option value="road">Highways Asphalt Cave-in & Potholes</option>
                  <option value="sanitation">Solid Waste Dumping & Burning</option>
                </select>
              </div>

              {/* Title (English & Tamil) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Complaint Title (English)
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center justify-between">
                  <span>புகார் தலைப்பு (தமிழ் - Tamil Title)</span>
                  <span className="text-[10px] text-cyan-400 font-mono">Auto-Translating</span>
                </label>
                <input
                  type="text"
                  value={tamilTitle}
                  onChange={(e) => setTamilTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-sans"
                  required
                />
              </div>

              {/* Description (Tamil & English) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Detailed Description (English)
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  விரிவான விவரம் (தமிழ் - Tamil Description)
                </label>
                <textarea
                  rows={2}
                  value={tamilDescription}
                  onChange={(e) => setTamilDescription(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-sans"
                  required
                />
              </div>

              {/* Department Routing */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Public Department Routing Portal
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="Greater Chennai Corporation (GCC) - Water & Sewage Dept">Greater Chennai Corporation (GCC)</option>
                  <option value="TNEB Tamil Nadu Electricity Board">TNEB Electricity Board</option>
                  <option value="Highways Department & Local MLA Office">State Highways Dept & Local MLA Cell</option>
                  <option value="CM Special Cell Grievance Portal">Chief Minister's Special Cell Portal</option>
                </select>
              </div>

            </div>

            {/* Right Column: Formal Bilingual Memorandum Preview */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                  <div className="flex items-center space-x-2">
                    <Languages className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-bold uppercase text-slate-200">
                      Bilingual Official Memo Preview
                    </span>
                  </div>

                  {/* Language Tab Switcher */}
                  <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-[11px] font-semibold">
                    <button
                      type="button"
                      onClick={() => setActiveTabLang('ta')}
                      className={`px-2.5 py-1 rounded-md transition-colors ${
                        activeTabLang === 'ta' ? 'bg-indigo-600 text-white' : 'text-slate-400'
                      }`}
                    >
                      தமிழ் (TA)
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTabLang('en')}
                      className={`px-2.5 py-1 rounded-md transition-colors ${
                        activeTabLang === 'en' ? 'bg-indigo-600 text-white' : 'text-slate-400'
                      }`}
                    >
                      English (EN)
                    </button>
                  </div>
                </div>

                {/* Memo Document View */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 whitespace-pre-wrap leading-relaxed max-h-[300px] overflow-y-auto scrollbar-thin">
                  {activeTabLang === 'ta' ? memo.tamil : memo.english}
                </div>
              </div>

              {/* Geo-Cam Attachment Preview & Auto-Retry Notice */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="font-mono text-cyan-300">Lat: {lat.toFixed(4)}, Long: {long.toFixed(4)}</span>
                </div>
                <span className="text-amber-400 font-semibold">
                  ⚡ Auto 2-3 Day Escalation Active
                </span>
              </div>

            </div>

          </div>

          {/* Submit Action Footer */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400 font-mono">
              n8n Dispatch Target: {n8nConfig.complaintWebhookUrl}
            </span>

            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={closeComplaintModal}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 flex items-center space-x-2 transition-transform active:scale-95 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'DISPATCHING TICKET...' : 'DISPATCH COMPLAINT VIA n8n'}</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
}
