import React, { useState } from 'react';
import { useCivicStore } from '../../../store/useCivicStore';
import { translationService } from '../../../services/translationService';
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
  MapPin
} from 'lucide-react';

export default function Screen3BComplaintFlow({ photoData, onBack, onComplete }) {
  const { addIncident, language } = useCivicStore();
  const [selectedCategory, setSelectedCategory] = useState('drainage');
  const [title, setTitle] = useState('Storm Water Drain Overflow & Hazard');
  const [tamilTitle, setTamilTitle] = useState('மழைநீர் வடிகால் அடைப்பு மற்றும் கழிவுநீர் கசிவு');
  const [description, setDescription] = useState('Severe sewage drain leak on main road causing mosquito breeding and transport hazard.');
  const [tamilDescription, setTamilDescription] = useState('முக்கிய சாலையில் கழிவுநீர் வழிந்தோடி கொசு உற்பத்தியும் சுகாதார சீர்கேடும் ஏற்படுகிறது.');
  const [activeLang, setActiveLang] = useState('ta'); // 'ta' | 'en'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdTicket, setCreatedTicket] = useState(null);

  const categories = [
    { id: 'drainage', label: 'Drainage & Sewage', aiSuggested: true, dept: 'Greater Chennai Corporation (GCC) - Storm Water Wing' },
    { id: 'water', label: 'Drinking Water Burst', aiSuggested: false, dept: 'Chennai Metro Water (CMWSSB)' },
    { id: 'road', label: 'Road Cave-in / Pothole', aiSuggested: false, dept: 'State Highways Dept & Corporation' },
    { id: 'eb', label: 'Electricity / Cable Snap', aiSuggested: false, dept: 'TNEB Electricity Board' },
    { id: 'sanitation', label: 'Garbage Dump & Waste', aiSuggested: false, dept: 'GCC Solid Waste Management Wing' }
  ];

  const currentCategory = categories.find(c => c.id === selectedCategory) || categories[0];
  const lat = photoData?.location?.lat || 13.0850;
  const long = photoData?.location?.long || 80.2101;
  const address = photoData?.location?.address || '2nd Avenue, Anna Nagar, Chennai - 600040';

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const ticketId = 'INC-2026-' + Math.floor(1000 + Math.random() * 9000);
    const newComplaint = {
      id: ticketId,
      type: 'CIVIC',
      category: selectedCategory,
      severity: 3,
      title,
      tamilTitle,
      description,
      tamilDescription,
      lat,
      long,
      state: 'Tamil Nadu',
      district: 'Chennai',
      address,
      department: currentCategory.dept,
      routingPortal: 'State Grievance Cell & n8n Escalation Loop',
      truthScore: 96,
      corroboratingSignals: 5,
      status: 'VERIFIED',
      createdAt: new Date().toISOString(),
      unacknowledgedDays: 0,
      retryCount: 0,
      imageUri: photoData?.image || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=60'
    };

    addIncident(newComplaint);

    setTimeout(() => {
      setIsSubmitting(false);
      setCreatedTicket(newComplaint);
    }, 1000);
  };

  return (
    <div className="flex flex-col space-y-4 pb-20 font-sans text-[#14213D] animate-fade-in">
      
      {/* Header */}
      <div className="bg-[#0B2E59] text-white p-4 rounded-3xl shadow-lg flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button onClick={onBack} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h3 className="font-black text-base tracking-tight uppercase">CIVIC COMPLAINT SUBMISSION</h3>
            <p className="text-[11px] text-blue-200 font-mono">AI Verification & Automated Department Dispatch</p>
          </div>
        </div>

        <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-cyan-300">
          <FileText className="w-5 h-5" />
        </div>
      </div>

      {createdTicket ? (
        /* Post-Submission Success Card with Expected Response Window (2-3 Days) */
        <div className="bg-white border border-[#D9E2EC] p-6 rounded-3xl shadow-sm text-center space-y-4 animate-fade-in">
          <div className="w-14 h-14 rounded-full bg-[#EAF7EE] text-[#16803C] flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs font-mono font-bold text-[#1769E0]">
              Ticket Reference: #{createdTicket.id}
            </span>
            <h4 className="font-extrabold text-lg text-[#14213D] mt-0.5">
              Complaint Verified & Dispatched
            </h4>
          </div>

          <div className="p-3.5 bg-[#F8FAFC] border border-[#D9E2EC] rounded-2xl text-left space-y-2 text-xs font-mono text-[#52616B]">
            <p><strong className="text-[#0B2E59]">Routed Department:</strong> {createdTicket.department}</p>
            <p><strong className="text-[#0B2E59]">GPS Location:</strong> {createdTicket.address}</p>
            <p><strong className="text-[#16803C]">Truth Verification:</strong> 96% Confidence (Geo-Cam Confirmed)</p>
          </div>

          {/* Expected Response Window (2-3 Days) */}
          <div className="p-3 bg-[#FFF5DF] border border-[#C97700]/30 rounded-2xl text-left flex items-start space-x-2 text-xs">
            <Clock className="w-4 h-4 text-[#C97700] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-[#C97700]">Expected Response Window: 48-72 Hours (2-3 Days)</span>
              <p className="text-[11px] text-[#52616B] mt-0.5">
                If unacknowledged after 3 days, SENTINEXA will auto-escalate this ticket to Tier 2 (District Collectorate & CM Special Cell) via n8n loops.
              </p>
            </div>
          </div>

          <button
            onClick={onComplete}
            className="w-full py-3 rounded-2xl bg-[#1769E0] text-white font-extrabold text-xs uppercase tracking-wider shadow-sm"
          >
            Track in Tickets
          </button>
        </div>
      ) : (
        /* Complaint Form */
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* AI Category Chips with Auto-suggestion */}
          <div className="bg-white border border-[#D9E2EC] p-4 rounded-2xl shadow-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#52616B] flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#1769E0]" />
                <span>Issue Category (AI Auto-Suggested)</span>
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {categories.map(cat => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                    selectedCategory === cat.id
                      ? 'bg-[#1769E0] text-white shadow-xs'
                      : 'bg-[#F1F5F9] text-[#52616B] hover:text-[#14213D]'
                  }`}
                >
                  <span>{cat.label}</span>
                  {cat.aiSuggested && (
                    <span className={`text-[9px] font-mono px-1 rounded ${selectedCategory === cat.id ? 'bg-white/20 text-white' : 'bg-[#EAF1F8] text-[#1769E0]'}`}>
                      AI Match
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* ROUTING PREVIEW CARD */}
          <div className="p-3.5 rounded-2xl bg-[#EAF1F8] border border-[#1769E0]/30 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white text-[#1769E0] flex items-center justify-center font-bold shadow-xs shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-[#1769E0]">
                Official Routing Destination:
              </span>
              <h5 className="font-extrabold text-xs text-[#0B2E59] leading-tight">
                {currentCategory.dept}
              </h5>
              <p className="text-[10px] text-[#52616B] font-mono">Automated delivery via municipal API & CM Cell</p>
            </div>
          </div>

          {/* Editable Complaint Template with English/Tamil Toggle */}
          <div className="bg-white border border-[#D9E2EC] p-4 rounded-2xl shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-[#D9E2EC] pb-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#14213D] flex items-center space-x-1">
                <Languages className="w-3.5 h-3.5 text-[#1769E0]" />
                <span>Grievance Memorandum Draft</span>
              </span>

              {/* Language Switch */}
              <div className="flex bg-[#F1F5F9] p-0.5 rounded-lg border border-[#D9E2EC] text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => setActiveLang('ta')}
                  className={`px-2.5 py-0.5 rounded-md ${activeLang === 'ta' ? 'bg-[#1769E0] text-white' : 'text-[#52616B]'}`}
                >
                  தமிழ்
                </button>
                <button
                  type="button"
                  onClick={() => setActiveLang('en')}
                  className={`px-2.5 py-0.5 rounded-md ${activeLang === 'en' ? 'bg-[#1769E0] text-white' : 'text-[#52616B]'}`}
                >
                  ENG
                </button>
              </div>
            </div>

            {activeLang === 'ta' ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={tamilTitle}
                  onChange={(e) => setTamilTitle(e.target.value)}
                  className="w-full bg-[#F8FAFC] border border-[#D9E2EC] rounded-xl px-3 py-2 text-xs font-semibold text-[#14213D]"
                  placeholder="புகார் தலைப்பு..."
                  required
                />
                <textarea
                  rows={3}
                  value={tamilDescription}
                  onChange={(e) => setTamilDescription(e.target.value)}
                  className="w-full bg-[#F8FAFC] border border-[#D9E2EC] rounded-xl px-3 py-2 text-xs text-[#14213D]"
                  placeholder="புகார் விவரம்..."
                  required
                />
              </div>
            ) : (
              <div className="space-y-2">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#F8FAFC] border border-[#D9E2EC] rounded-xl px-3 py-2 text-xs font-semibold text-[#14213D]"
                  placeholder="Complaint title..."
                  required
                />
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#F8FAFC] border border-[#D9E2EC] rounded-xl px-3 py-2 text-xs text-[#14213D]"
                  placeholder="Complaint description..."
                  required
                />
              </div>
            )}

            <div className="flex items-center space-x-1.5 text-[10px] font-mono text-[#52616B] pt-1">
              <MapPin className="w-3.5 h-3.5 text-[#1769E0]" />
              <span className="truncate">{address}</span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#1769E0] to-[#0B2E59] hover:from-[#1253B3] hover:to-[#081F3D] text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-[#1769E0]/25 flex items-center justify-center space-x-2 transition-transform active:scale-95 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>{isSubmitting ? 'GENERATING TICKET & ROUTING...' : 'SUBMIT CIVIC COMPLAINT'}</span>
          </button>

        </form>
      )}

    </div>
  );
}
