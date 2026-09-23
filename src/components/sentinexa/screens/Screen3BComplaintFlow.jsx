import React, { useState } from 'react';
import { useCivicStore } from '../../../store/useCivicStore';
import { 
  FileText, Send, ArrowLeft, Building2, CheckCircle2, Clock, MapPin, Sparkles, Languages
} from 'lucide-react';

export default function Screen3BComplaintFlow({ photoData, capturedData, onBack, onComplete, onSubmitSuccess }) {
  const effectiveData = photoData || capturedData;
  const { addIncident } = useCivicStore();
  const [selectedCategory, setSelectedCategory] = useState('road');
  const [title, setTitle] = useState('Deep Pothole & Road Cave-in');
  const [tamilTitle, setTamilTitle] = useState('முக்கிய சந்திப்பில் ஆபத்தான பள்ளம்');
  const [description, setDescription] = useState('Severe road pothole causing two-wheeler skidding hazards during peak traffic hours.');
  const [tamilDescription, setTamilDescription] = useState('பீக் ஹவர்ஸில் இருசக்கர வாகனங்கள் சறுக்கி விழும் ஆபத்தான சாலை பள்ளம்.');
  const [activeLang, setActiveLang] = useState('en');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdTicket, setCreatedTicket] = useState(null);

  const storeUserLocation = useCivicStore(state => state.userLocation);
  const effectiveLocation = effectiveData?.location || storeUserLocation;
  const lat = effectiveLocation?.lat || 11.0168;
  const long = effectiveLocation?.long || 76.9558;
  const address = effectiveLocation?.address || 'Gandhipuram, Coimbatore - 641012';
  const district = effectiveLocation?.district || 'Coimbatore';
  const photoUrl = effectiveData?.image || null;
  const isCoimbatore = district.toLowerCase().includes('coimbatore');

  const categories = [
    { id: 'road', label: '🛣️ Roads & Potholes', aiSuggested: true, dept: isCoimbatore ? 'CCMC Roads & Bridges Dept' : 'Municipal Roads Division' },
    { id: 'drainage', label: '🚿 Drainage & Sewage', aiSuggested: false, dept: isCoimbatore ? 'CCMC Drainage & Sanitation' : 'Water & Sewerage Board' },
    { id: 'water', label: '💧 Water Leak / Burst', aiSuggested: false, dept: isCoimbatore ? 'Siruvani Water Supply (CCMC)' : 'Public Water Works Dept' },
    { id: 'eb', label: '💡 Street Light / Power', aiSuggested: false, dept: 'TANGEDCO Distribution Circle' },
    { id: 'sanitation', label: '🗑️ Garbage & Waste', aiSuggested: false, dept: isCoimbatore ? 'CCMC Solid Waste Management' : 'Municipal Solid Waste Cell' }
  ];

  const currentCategory = categories.find(c => c.id === selectedCategory) || categories[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const ticketId = 'CIVIC-' + Math.floor(1000 + Math.random() * 9000);
    const newComplaint = {
      id: ticketId, type: 'CIVIC', category: selectedCategory, severity: 2,
      title: activeLang === 'ta' ? tamilTitle : title,
      tamilTitle, description: activeLang === 'ta' ? tamilDescription : description,
      tamilDescription, lat, long, state: 'Tamil Nadu', district, address,
      department: currentCategory.dept, status: 'ROUTED_WARD',
      createdAt: new Date().toISOString(), slaHours: 48,
      photoUrl: photoUrl || null, imageUri: photoUrl || null
    };
    if (typeof addIncident === 'function') addIncident(newComplaint);
    setTimeout(() => {
      setIsSubmitting(false);
      setCreatedTicket(newComplaint);
      onComplete?.(newComplaint);
      onSubmitSuccess?.(newComplaint);
    }, 900);
  };

  // ── SUCCESS STATE ──
  if (createdTicket) {
    return (
      <div className="flex flex-col h-full bg-gray-50 items-center justify-center px-6 text-center gap-4">
        <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-300 flex items-center justify-center">
          <CheckCircle2 className="w-9 h-9 text-emerald-600" />
        </div>
        <div>
          <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold mb-2">
            Ticket Registered & Routed
          </span>
          <h3 className="text-xl font-black text-slate-900">#{createdTicket.id}</h3>
          <p className="text-xs text-slate-500 mt-1">
            Forwarded to <strong className="text-blue-700">{createdTicket.department}</strong>
          </p>
        </div>
        <div className="w-full bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 text-left">
          <div className="flex items-center gap-2 text-amber-800 font-bold text-xs mb-1">
            <Clock className="w-4 h-4" /> 48-Hour Resolution Guarantee
          </div>
          <p className="text-[11px] text-amber-900">
            Auto-escalates to Tamil Nadu Commissioner if not resolved within 48 hours.
          </p>
        </div>
        <button
          onClick={onBack}
          className="w-full py-3.5 rounded-2xl bg-blue-600 text-white font-bold text-sm shadow-lg shadow-blue-200"
        >
          Return to Home
        </button>
      </div>
    );
  }

  // ── FORM ──
  return (
    <div className="flex flex-col h-full bg-gray-50 overflow-y-auto">

      {/* Header */}
      <div className="bg-white px-4 pt-3 pb-3 border-b border-slate-100 shadow-sm sticky top-0 z-20 flex items-center gap-3">
        <button onClick={onBack} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h2 className="font-black text-slate-900 text-base flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-blue-600" /> Report Complaint
          </h2>
          <p className="text-[10px] text-slate-400">{address}</p>
        </div>
        <span className="ml-auto flex items-center gap-1 text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          AI Routing
        </span>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-4 pb-8">

        {/* Photo preview */}
        {photoUrl && (
          <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm max-h-40 bg-slate-100">
            <img src={photoUrl} alt="Incident" className="w-full h-full object-cover" />
          </div>
        )}

        {/* Category chips */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-500" /> Category
            </span>
            <span className="text-[10px] text-blue-600 font-semibold">AI Auto-Detected</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {categories.map(cat => (
              <button
                type="button" key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`p-2.5 rounded-xl border text-left text-xs flex flex-col gap-0.5 transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-400'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800">{cat.label}</span>
                  {cat.aiSuggested && (
                    <span className="text-[9px] bg-blue-600 text-white px-1.5 py-0.5 rounded font-bold">AI</span>
                  )}
                </div>
                <span className="text-[10px] text-slate-400 line-clamp-1">{cat.dept}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Routing preview */}
        <div className="bg-white rounded-xl border border-slate-200 px-3 py-2.5 flex items-start gap-2">
          <Building2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-bold text-slate-900">{currentCategory.dept}</p>
            <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3" /> {address}
            </p>
          </div>
        </div>

        {/* Bilingual memo */}
        <div className="bg-white rounded-xl border border-slate-200 p-3 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Languages className="w-4 h-4 text-blue-500" /> Complaint Details
            </span>
            <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-bold">
              <button type="button" onClick={() => setActiveLang('en')}
                className={`px-3 py-1 rounded-md transition-all ${activeLang === 'en' ? 'bg-blue-600 text-white' : 'text-slate-600'}`}>
                EN
              </button>
              <button type="button" onClick={() => setActiveLang('ta')}
                className={`px-3 py-1 rounded-md transition-all ${activeLang === 'ta' ? 'bg-blue-600 text-white' : 'text-slate-600'}`}>
                தமிழ்
              </button>
            </div>
          </div>

          {activeLang === 'ta' ? (
            <div className="space-y-2">
              <input type="text" value={tamilTitle} onChange={e => setTamilTitle(e.target.value)}
                placeholder="புகார் தலைப்பு..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-400" required />
              <textarea rows={3} value={tamilDescription} onChange={e => setTamilDescription(e.target.value)}
                placeholder="புகார் விவரம்..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-400" required />
            </div>
          ) : (
            <div className="space-y-2">
              <input type="text" value={title} onChange={e => setTitle(e.target.value)}
                placeholder="Complaint title..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-400" required />
              <textarea rows={3} value={description} onChange={e => setDescription(e.target.value)}
                placeholder="Describe the issue..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-400" required />
            </div>
          )}
        </div>

        {/* 48hr SLA note */}
        <div className="flex items-start gap-2 px-3 py-2.5 bg-amber-50 border border-amber-100 rounded-xl">
          <Clock className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
          <p className="text-[11px] text-amber-800">
            <strong>48-hour SLA.</strong> Auto-escalates to TN Municipal Commissioner if unresolved.
          </p>
        </div>

        {/* Submit */}
        <button
          type="submit" disabled={isSubmitting}
          className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-black text-sm uppercase tracking-wide shadow-lg shadow-blue-200 flex items-center justify-center gap-2 transition-all disabled:opacity-60"
        >
          <Send className="w-4 h-4" />
          {isSubmitting ? 'Submitting…' : 'Submit Complaint'}
        </button>
      </form>
    </div>
  );
}
