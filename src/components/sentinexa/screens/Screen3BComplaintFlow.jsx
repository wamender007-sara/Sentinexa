import React, { useState } from 'react';
import { useCivicStore } from '../../../store/useCivicStore';
import { 
  FileText, 
  Send, 
  ArrowLeft, 
  Languages, 
  Building2, 
  CheckCircle2, 
  Sparkles, 
  Clock,
  ShieldCheck,
  MapPin,
  AlertTriangle
} from 'lucide-react';

export default function Screen3BComplaintFlow({ photoData, capturedData, onBack, onComplete, onSubmitSuccess }) {
  const effectiveData = photoData || capturedData;
  const { addIncident } = useCivicStore();
  const [selectedCategory, setSelectedCategory] = useState('road');
  const [title, setTitle] = useState('Deep Pothole & Road Cave-in on Main Junction');
  const [tamilTitle, setTamilTitle] = useState('முக்கிய சந்திப்பில் அபாயகரமான பள்ளம் மற்றும் சாலை சிதைவு');
  const [description, setDescription] = useState('Severe road pothole causing two-wheeler skidding hazards during peak traffic hours.');
  const [tamilDescription, setTamilDescription] = useState('பீக் ஹவர்ஸில் இருசக்கர வாகனங்கள் சறுக்கி விழும் வகையில் ஆபத்தான சாலை பள்ளம்.');
  const [activeLang, setActiveLang] = useState('en'); // 'en' | 'ta'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdTicket, setCreatedTicket] = useState(null);

  const categories = [
    { id: 'road', label: 'Roads & Potholes', aiSuggested: true, dept: 'GCC Roads & Bridges Dept / Ward 172' },
    { id: 'drainage', label: 'Drainage & Sewage', aiSuggested: false, dept: 'CMWSSB (Metro Water & Sewerage)' },
    { id: 'water', label: 'Water Leak / Burst', aiSuggested: false, dept: 'Chennai Metro Water Supply' },
    { id: 'eb', label: 'Street Light & Power', aiSuggested: false, dept: 'TANGEDCO (TNEB) Distribution' },
    { id: 'sanitation', label: 'Garbage & Waste', aiSuggested: false, dept: 'GCC Solid Waste Management Wing' }
  ];

  const currentCategory = categories.find(c => c.id === selectedCategory) || categories[0];
  const lat = effectiveData?.location?.lat || 13.0850;
  const long = effectiveData?.location?.long || 80.2101;
  const address = effectiveData?.location?.address || '2nd Avenue, Anna Nagar, Chennai - 600040';
  const photoUrl = effectiveData?.image || null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const ticketId = 'CIVIC-' + Math.floor(1000 + Math.random() * 9000);
    const newComplaint = {
      id: ticketId,
      type: 'CIVIC',
      category: selectedCategory,
      severity: 2,
      title: activeLang === 'ta' ? tamilTitle : title,
      tamilTitle,
      description: activeLang === 'ta' ? tamilDescription : description,
      tamilDescription,
      lat,
      long,
      state: 'Tamil Nadu',
      district: 'Chennai',
      address,
      department: currentCategory.dept,
      status: 'ROUTED_WARD',
      createdAt: new Date().toISOString(),
      slaHours: 48,
      photoUrl: photoUrl
    };

    if (typeof addIncident === 'function') {
      addIncident(newComplaint);
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setCreatedTicket(newComplaint);
      if (typeof onComplete === 'function') onComplete(newComplaint);
      if (typeof onSubmitSuccess === 'function') onSubmitSuccess(newComplaint);
    }, 900);
  };

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC] text-slate-800 font-sans overflow-y-auto">
      
      {/* Top Header */}
      <div className="p-4 border-b border-slate-200 bg-white sticky top-0 z-20 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-blue-600" />
              Civic Complaint Dispatch
            </h2>
            <p className="text-[10px] font-mono text-slate-500">Autonomous Ward Triage Protocol</p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
          <span className="text-[11px] font-mono font-bold text-blue-600">AI AUTO-ROUTER</span>
        </div>
      </div>

      {createdTicket ? (
        /* Success Confirmation Card */
        <div className="p-5 flex-1 flex flex-col justify-center items-center text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-lg border-2 border-emerald-300">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono text-xs font-bold inline-block">
              TICKET REGISTERED & ROUTED
            </span>
            <h3 className="text-lg font-black text-slate-900 pt-1">
              Ticket #{createdTicket.id}
            </h3>
            <p className="text-xs text-slate-600 max-w-xs">
              Forwarded autonomously to <strong className="text-blue-700">{createdTicket.department}</strong>.
            </p>
          </div>

          {/* SLA Countdown Card */}
          <div className="w-full max-w-sm p-4 rounded-2xl bg-amber-50 border border-amber-200 text-left space-y-1.5">
            <div className="flex items-center space-x-1.5 text-amber-800 text-xs font-bold">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>48-Hour Auto-Escalation SLA Active</span>
            </div>
            <p className="text-[11px] text-amber-900 leading-relaxed">
              If not resolved by ward engineer within 48 hours, this complaint automatically escalates to the Tamil Nadu Commissioner of Municipal Administration.
            </p>
          </div>

          <button
            onClick={onBack}
            className="w-full max-w-sm py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all"
          >
            Return to Dashboard
          </button>
        </div>
      ) : (
        /* Complaint Entry Form */
        <form onSubmit={handleSubmit} className="p-4 space-y-4 pb-8">
          
          {/* Photo Preview Strip if Available */}
          {photoUrl && (
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm max-h-44 bg-slate-100">
              <img src={photoUrl} alt="Incident preview" className="w-full h-full object-cover" />
              <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur text-[10px] font-mono text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/40">
                Verified Geo Evidence Included
              </div>
            </div>
          )}

          {/* AI Category Chips */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Select Category
              </span>
              <span className="text-[10px] font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                AI Vision Auto-Detected
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all text-xs flex flex-col justify-between ${
                    selectedCategory === cat.id
                      ? 'bg-blue-50 border-blue-500 text-blue-900 shadow-sm ring-1 ring-blue-500'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-bold">{cat.label}</span>
                    {cat.aiSuggested && (
                      <span className="text-[9px] bg-blue-600 text-white font-mono px-1.5 py-0.2 rounded font-bold">
                        98% Match
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 line-clamp-1">{cat.dept}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Routing Preview Card */}
          <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-500 uppercase font-bold flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-blue-600" /> Target Department Routing
              </span>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.2 rounded font-mono font-semibold">
                Direct API Sync
              </span>
            </div>
            <p className="text-xs font-bold text-slate-900">{currentCategory.dept}</p>
            <p className="text-[11px] text-slate-500 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-blue-600 shrink-0" />
              <span>{address}</span>
            </p>
          </div>

          {/* Bilingual Memo Toggle & Inputs */}
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Languages className="w-4 h-4 text-blue-600" /> Official Memo Format
              </span>

              {/* Language Pill */}
              <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setActiveLang('en')}
                  className={`px-3 py-1 rounded-md transition-all ${
                    activeLang === 'en' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => setActiveLang('ta')}
                  className={`px-3 py-1 rounded-md transition-all ${
                    activeLang === 'ta' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  தமிழ்
                </button>
              </div>
            </div>

            {activeLang === 'ta' ? (
              <div className="space-y-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-600 uppercase">புகார் தலைப்பு</label>
                  <input
                    type="text"
                    value={tamilTitle}
                    onChange={(e) => setTamilTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-500"
                    placeholder="புகார் தலைப்பு..."
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-600 uppercase">விவரங்கள்</label>
                  <textarea
                    rows={3}
                    value={tamilDescription}
                    onChange={(e) => setTamilDescription(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                    placeholder="புகார் விவரம்..."
                    required
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-600 uppercase">Complaint Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-500"
                    placeholder="Complaint title..."
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-600 uppercase">Description & Details</label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                    placeholder="Complaint description..."
                    required
                  />
                </div>
              </div>
            )}
          </div>

          {/* 2-3 Day Auto-Escalation Guarantee Badge */}
          <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 flex items-start space-x-2.5">
            <Clock className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
            <div className="text-[11px] text-amber-900">
              <span className="font-bold block">Tamil Nadu 48-Hour Resolution Guarantee</span>
              Automated multi-agent retries ping GCC ward supervisor every 6 hours. Auto-escalates on day 2.
            </div>
          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-blue-500/25 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>{isSubmitting ? 'GENERATING TICKET & ROUTING...' : 'CONFIRM & SUBMIT CIVIC COMPLAINT'}</span>
          </button>

        </form>
      )}

    </div>
  );
}
