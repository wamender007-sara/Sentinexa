import React, { useState } from 'react';
import { useCivicStore } from '../../../store/useCivicStore';
import { 
  AlertOctagon, 
  PhoneCall, 
  Stethoscope, 
  Navigation, 
  Send, 
  CheckCircle2, 
  ShieldAlert, 
  Clock, 
  ArrowLeft,
  Flame,
  Radio
} from 'lucide-react';

export default function Screen3AEmergencyFlow({ photoData, onBack, onComplete }) {
  const { nearbyHospitals, addIncident, n8nConfig, language } = useCivicStore();
  const [dispatchStage, setDispatchStage] = useState(0); // 0: Ready, 1: Alert Sent, 2: Acknowledged, 3: Ambulance Dispatched
  const [selectedHospital, setSelectedHospital] = useState(nearbyHospitals[0] || null);

  const lat = photoData?.location?.lat || 13.0604;
  const long = photoData?.location?.long || 80.2496;
  const address = photoData?.location?.address || 'Anna Salai, Thousand Lights, Chennai';

  const handleInstantDispatch = () => {
    setDispatchStage(1);

    const newEmergency = {
      id: 'EMG-2026-' + Math.floor(1000 + Math.random() * 9000),
      type: 'EMERGENCY',
      category: 'accident',
      severity: 5,
      title: 'Priority 1 Life-Threat Emergency Dispatch',
      tamilTitle: 'உயிர் பாதுகாப்பு முதன்மை அவசர கால மீட்பு நடவடிக்கை',
      description: `Critical emergency reported at ${address}. Target trauma hospital: ${selectedHospital?.name || 'Apollo Emergency'}.`,
      tamilDescription: `அவசர கால மீட்பு நடவடிக்கை. குறிக்கப்பட்ட இடம்: ${address}.`,
      lat,
      long,
      state: 'Tamil Nadu',
      district: 'Chennai',
      address,
      department: 'Disaster Rescue Services & 108 Ambulance Unit',
      routingPortal: 'State Emergency Command & n8n Priority Webhook',
      truthScore: 99,
      corroboratingSignals: 14,
      status: 'DISPATCHED',
      createdAt: new Date().toISOString(),
      unacknowledgedDays: 0,
      retryCount: 0,
      imageUri: photoData?.image || 'https://images.unsplash.com/photo-1587740896339-96a76170508d?w=600&auto=format&fit=crop&q=60'
    };

    addIncident(newEmergency);

    setTimeout(() => setDispatchStage(2), 1400);
    setTimeout(() => setDispatchStage(3), 2800);
  };

  const hospitalsList = nearbyHospitals.slice(0, 3);

  return (
    <div className="flex flex-col space-y-4 pb-20 font-sans text-[#14213D] animate-fade-in">
      
      {/* Top Urgent Header */}
      <div className="bg-gradient-to-r from-[#C62828] via-[#B71C1C] to-[#991B1B] text-white p-4 rounded-3xl shadow-xl flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-black text-lg tracking-tight uppercase">EMERGENCY DETECTED</span>
              <span className="px-2 py-0.5 rounded-full bg-white text-[#C62828] font-mono text-[9px] font-black">
                CRITICAL
              </span>
            </div>
            <p className="text-[11px] text-red-100 font-mono">
              Auto GPS Lock: {lat.toFixed(4)}°N, {long.toFixed(4)}°E
            </p>
          </div>
        </div>

        <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center animate-bounce">
          <AlertOctagon className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* QUICK-DIAL ROW (Police 100, Ambulance 108, Fire 101) */}
      <div className="grid grid-cols-3 gap-2">
        <a
          href="tel:108"
          className="p-3 bg-[#FFF0F0] border border-[#C62828]/30 rounded-2xl flex flex-col items-center justify-center text-center shadow-xs hover:bg-[#C62828] hover:text-white transition-colors group"
        >
          <PhoneCall className="w-4 h-4 text-[#C62828] group-hover:text-white mb-1" />
          <span className="font-black text-base leading-none text-[#C62828] group-hover:text-white">108</span>
          <span className="text-[9px] font-bold text-[#52616B] group-hover:text-red-100 uppercase">Ambulance</span>
        </a>

        <a
          href="tel:100"
          className="p-3 bg-[#EAF1F8] border border-[#1769E0]/30 rounded-2xl flex flex-col items-center justify-center text-center shadow-xs hover:bg-[#1769E0] hover:text-white transition-colors group"
        >
          <PhoneCall className="w-4 h-4 text-[#1769E0] group-hover:text-white mb-1" />
          <span className="font-black text-base leading-none text-[#1769E0] group-hover:text-white">100</span>
          <span className="text-[9px] font-bold text-[#52616B] group-hover:text-blue-100 uppercase">Police</span>
        </a>

        <a
          href="tel:101"
          className="p-3 bg-[#FFF5DF] border border-[#C97700]/30 rounded-2xl flex flex-col items-center justify-center text-center shadow-xs hover:bg-[#C97700] hover:text-white transition-colors group"
        >
          <PhoneCall className="w-4 h-4 text-[#C97700] group-hover:text-white mb-1" />
          <span className="font-black text-base leading-none text-[#C97700] group-hover:text-white">101</span>
          <span className="text-[9px] font-bold text-[#52616B] group-hover:text-amber-100 uppercase">Fire Rescue</span>
        </a>
      </div>

      {/* REAL-TIME DISPATCH STEPPER */}
      <div className="bg-white border border-[#D9E2EC] p-4 rounded-2xl shadow-xs space-y-3">
        <h4 className="font-extrabold text-xs uppercase tracking-wider text-[#52616B]">
          Live Dispatch Pipeline Status
        </h4>

        <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
          <div className={`p-2 rounded-xl border ${dispatchStage >= 1 ? 'bg-[#EAF7EE] border-[#16803C]/40 text-[#16803C] font-bold' : 'bg-[#F1F5F9] border-[#D9E2EC] text-[#94A3B8]'}`}>
            <span className="block text-sm">01</span>
            <span className="text-[10px]">Alert Sent</span>
          </div>
          <div className={`p-2 rounded-xl border ${dispatchStage >= 2 ? 'bg-[#EAF7EE] border-[#16803C]/40 text-[#16803C] font-bold' : 'bg-[#F1F5F9] border-[#D9E2EC] text-[#94A3B8]'}`}>
            <span className="block text-sm">02</span>
            <span className="text-[10px]">Acknowledged</span>
          </div>
          <div className={`p-2 rounded-xl border ${dispatchStage >= 3 ? 'bg-[#C62828] text-white font-bold' : 'bg-[#F1F5F9] border-[#D9E2EC] text-[#94A3B8]'}`}>
            <span className="block text-sm">03</span>
            <span className="text-[10px]">Ambulance En Route</span>
          </div>
        </div>
      </div>

      {/* ONE-TAP HUGE DISPATCH BUTTON */}
      {dispatchStage === 0 ? (
        <button
          onClick={handleInstantDispatch}
          className="w-full py-5 rounded-3xl bg-gradient-to-r from-[#C62828] via-[#D32F2F] to-[#B71C1C] hover:from-[#B71C1C] hover:to-[#7F1D1D] text-white font-black text-base uppercase tracking-wider shadow-xl shadow-[#C62828]/40 border-2 border-white/30 flex items-center justify-center space-x-2 transition-transform active:scale-95 animate-pulse"
        >
          <Send className="w-5 h-5" />
          <span>ONE-TAP DISPATCH TO NEAREST HOSPITAL</span>
        </button>
      ) : (
        <div className="p-4 bg-[#EAF7EE] border border-[#16803C]/40 rounded-2xl text-[#16803C] text-xs font-mono flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-[#16803C] shrink-0" />
            <span>Priority Webhook Dispatched via n8n! Emergency units alerted.</span>
          </div>
          <button
            onClick={onComplete}
            className="px-3 py-1 rounded-lg bg-[#16803C] text-white font-bold text-xs shrink-0"
          >
            Track in Tickets
          </button>
        </div>
      )}

      {/* NEAREST 3 HOSPITALS (Name, Distance, ETA) */}
      <div className="bg-white border border-[#D9E2EC] p-4 rounded-2xl shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <Stethoscope className="w-4 h-4 text-[#C62828]" />
            <h4 className="font-extrabold text-xs uppercase tracking-wider text-[#14213D]">
              Nearest 3 Trauma Centers
            </h4>
          </div>
          <span className="text-[10px] font-mono text-[#52616B]">Live GPS Radii</span>
        </div>

        <div className="space-y-2.5">
          {hospitalsList.map((hosp, idx) => (
            <div
              key={hosp.id}
              onClick={() => setSelectedHospital(hosp)}
              className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                selectedHospital?.id === hosp.id
                  ? 'bg-[#FFF0F0] border-[#C62828] shadow-sm'
                  : 'bg-[#F8FAFC] border-[#D9E2EC] hover:border-[#C62828]/40'
              }`}
            >
              <div className="space-y-0.5">
                <div className="flex items-center space-x-1.5">
                  <span className="w-4 h-4 rounded-full bg-[#0B2E59] text-white text-[10px] font-mono font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <h5 className="font-extrabold text-xs text-[#14213D] leading-tight">
                    {hosp.name}
                  </h5>
                </div>
                <p className="text-[11px] text-[#52616B] font-mono pl-5">
                  {hosp.distanceKm} km away • <strong className="text-[#C62828]">ETA {Math.round(parseFloat(hosp.distanceKm) * 2.5)} mins</strong>
                </p>
                <div className="pl-5 flex items-center space-x-3 text-[10px] font-mono text-[#16803C]">
                  <span>ICU Beds: {hosp.icuBedsAvailable}</span>
                  <span>Ambulance: {hosp.ambulanceUnits} units</span>
                </div>
              </div>

              <a
                href={`tel:${hosp.emergencyHotline.split('/')[0].trim()}`}
                className="p-2 rounded-xl bg-white border border-[#D9E2EC] text-[#C62828] hover:bg-[#C62828] hover:text-white shadow-xs shrink-0"
                title="Call Emergency Hotline"
              >
                <PhoneCall className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
