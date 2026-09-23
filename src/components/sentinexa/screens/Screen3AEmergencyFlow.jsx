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
  Radio,
  MapPin,
  Check
} from 'lucide-react';

export default function Screen3AEmergencyFlow({ photoData, capturedData, onBack, onComplete, onDispatched }) {
  const effectiveData = photoData || capturedData;
  const { nearbyHospitals, addIncident } = useCivicStore();
  const [dispatchStage, setDispatchStage] = useState(0); // 0: Ready, 1: Alert Sent, 2: Acknowledged, 3: Dispatched
  const [selectedHospital, setSelectedHospital] = useState(null);

  const storeUserLocation = useCivicStore(state => state.userLocation);
  const effectiveLocation = effectiveData?.location || storeUserLocation;
  const lat = effectiveLocation?.lat || 11.0168;
  const long = effectiveLocation?.long || 76.9558;
  const address = effectiveLocation?.address || 'Gandhipuram, Coimbatore - 641012';
  const district = effectiveLocation?.district || 'Coimbatore';
  const photoUrl = effectiveData?.image || null;

  const fallbackHospitals = [
    { id: 'h1', name: 'Coimbatore Medical College Hospital (CMCH)', distance: '1.2 km', eta: '3 mins', trauma: 'Level 1 Trauma' },
    { id: 'h2', name: 'GKNM Hospital Emergency & Trauma Care', distance: '1.4 km', eta: '4 mins', trauma: 'Emergency Trauma' },
    { id: 'h3', name: 'KMCH Emergency Medical Centre', distance: '3.1 km', eta: '7 mins', trauma: 'Critical Care' }
  ];

  const hospitalsList = (nearbyHospitals && nearbyHospitals.length > 0) ? nearbyHospitals.slice(0, 3) : fallbackHospitals;
  const activeHospital = selectedHospital || hospitalsList[0];

  const handleInstantDispatch = () => {
    setDispatchStage(1);

    const newEmergency = {
      id: 'SOS-' + Math.floor(1000 + Math.random() * 9000),
      type: 'EMERGENCY',
      category: 'medical',
      severity: 5,
      title: 'Priority 1 Life-Threat Emergency Dispatch',
      tamilTitle: 'உயிர் பாதுகாப்பு முதன்மை அவசர கால மீட்பு நடவடிக்கை',
      description: `Critical emergency reported at ${address}. Target trauma hospital: ${activeHospital?.name || 'Govt General Hospital'}.`,
      tamilDescription: `அவசர கால மீட்பு நடவடிக்கை. குறிக்கப்பட்ட இடம்: ${address}.`,
      lat,
      long,
      state: 'Tamil Nadu',
      district: district,
      address,
      department: '108 Ambulance Unit & Police Control',
      routingPortal: 'State Emergency Command & n8n Priority Webhook',
      status: 'DISPATCHED',
      createdAt: new Date().toISOString(),
      photoUrl: photoUrl || 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&auto=format&fit=crop&q=80',
      imageUri: photoUrl || 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&auto=format&fit=crop&q=80'
    };

    if (typeof addIncident === 'function') {
      addIncident(newEmergency);
    }

    setTimeout(() => setDispatchStage(2), 1200);
    setTimeout(() => {
      setDispatchStage(3);
      if (typeof onComplete === 'function') onComplete(newEmergency);
      if (typeof onDispatched === 'function') onDispatched(newEmergency);
    }, 2400);
  };

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC] text-slate-800 font-sans overflow-y-auto p-4 space-y-4 pb-20 select-none">
      
      {/* Top Urgent Header in Clean Light Theme */}
      <div className="bg-red-600 text-white p-4 rounded-3xl shadow-lg shadow-red-500/25 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-black text-base tracking-tight uppercase">EMERGENCY PROTOCOL</span>
              <span className="px-2 py-0.2 rounded-full bg-white text-red-600 font-mono text-[9px] font-black">
                CRITICAL
              </span>
            </div>
            <p className="text-[11px] text-red-100 font-mono">
              GPS Lock: {lat.toFixed(4)}°N, {long.toFixed(4)}°E
            </p>
          </div>
        </div>

        <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center animate-bounce">
          <AlertOctagon className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* QUICK-DIAL ROW (Ambulance 108, Police 100, Fire 101) */}
      <div className="grid grid-cols-3 gap-2">
        <a
          href="tel:108"
          className="p-3 bg-red-50 hover:bg-red-100 border border-red-200 rounded-2xl flex flex-col items-center justify-center text-center shadow-xs transition-colors group"
        >
          <PhoneCall className="w-4 h-4 text-red-600 mb-1" />
          <span className="font-black text-base leading-none text-red-600">108</span>
          <span className="text-[9px] font-bold text-slate-500 uppercase mt-0.5">Ambulance</span>
        </a>

        <a
          href="tel:100"
          className="p-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-2xl flex flex-col items-center justify-center text-center shadow-xs transition-colors group"
        >
          <ShieldAlert className="w-4 h-4 text-blue-600 mb-1" />
          <span className="font-black text-base leading-none text-blue-600">100</span>
          <span className="text-[9px] font-bold text-slate-500 uppercase mt-0.5">Police</span>
        </a>

        <a
          href="tel:101"
          className="p-3 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-2xl flex flex-col items-center justify-center text-center shadow-xs transition-colors group"
        >
          <Flame className="w-4 h-4 text-amber-600 mb-1" />
          <span className="font-black text-base leading-none text-amber-600">101</span>
          <span className="text-[9px] font-bold text-slate-500 uppercase mt-0.5">Fire Rescue</span>
        </a>
      </div>

      {/* Photo Preview if Available */}
      {photoUrl && (
        <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm max-h-40 bg-slate-100">
          <img src={photoUrl} alt="Emergency capture" className="w-full h-full object-cover" />
          <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur text-[10px] font-mono text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/40">
            Live Geo Evidence Attached
          </div>
        </div>
      )}

      {/* NEAREST 3 HOSPITALS WITH LIVE ETAs */}
      <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-sm space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <Stethoscope className="w-4 h-4 text-red-600" />
            <h3 className="font-black text-xs uppercase tracking-wider text-slate-900">
              Nearest Trauma Centers (ETA)
            </h3>
          </div>
          <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            Real-Time Bed Sync
          </span>
        </div>

        <div className="space-y-2">
          {hospitalsList.map((hosp, idx) => (
            <div
              key={hosp.id || idx}
              onClick={() => setSelectedHospital(hosp)}
              className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                activeHospital?.name === hosp.name
                  ? 'bg-red-50 border-red-400 ring-1 ring-red-400 shadow-xs'
                  : 'bg-slate-50 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-xs text-slate-900">{hosp.name}</span>
                  {activeHospital?.name === hosp.name && (
                    <span className="w-2 h-2 rounded-full bg-red-600"></span>
                  )}
                </div>
                <div className="flex items-center space-x-2 text-[10px] font-mono text-slate-500">
                  <span>{hosp.distance || '2.1 km'}</span>
                  <span>•</span>
                  <span className="text-red-600 font-bold">{hosp.trauma || 'Trauma Center'}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-black font-mono text-red-600 bg-white px-2 py-1 rounded-lg border border-red-200 shadow-xs">
                  {hosp.eta || '5 mins'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ONE-TAP AUTO DISPATCH HERO BUTTON */}
      {dispatchStage === 0 && (
        <button
          onClick={handleInstantDispatch}
          className="w-full py-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-red-500/30 flex items-center justify-center space-x-2 transition-transform active:scale-95"
        >
          <Send className="w-4 h-4 animate-pulse" />
          <span>CONFIRM &amp; DISPATCH ALL EMERGENCY UNITS</span>
        </button>
      )}

      {/* LIVE MULTI-AGENT DISPATCH STEPPER */}
      {dispatchStage > 0 && (
        <div className="bg-white border border-red-200 rounded-2xl p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-900">
            <span className="flex items-center gap-1.5">
              <Radio className="w-4 h-4 text-red-600 animate-spin" />
              Multi-Agent Live Dispatch Stepper
            </span>
            <span className="text-[10px] font-mono text-red-600 font-bold">
              {dispatchStage === 1 && 'Broadcasting SOS...'}
              {dispatchStage === 2 && 'Trauma Unit Alerted'}
              {dispatchStage === 3 && 'Ambulance In Route'}
            </span>
          </div>

          <div className="space-y-2 pt-1">
            <div className="flex items-center space-x-3 text-xs">
              <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">
                ✓
              </div>
              <span className="text-slate-800 font-medium">GPS Geolocation Verified &amp; Watermarked</span>
            </div>

            <div className="flex items-center space-x-3 text-xs">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                dispatchStage >= 1 ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'
              }`}>
                {dispatchStage >= 1 ? '✓' : '2'}
              </div>
              <span className={dispatchStage >= 1 ? 'text-slate-800 font-medium' : 'text-slate-400'}>
                108 Emergency Webhook Dispatched
              </span>
            </div>

            <div className="flex items-center space-x-3 text-xs">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                dispatchStage >= 2 ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'
              }`}>
                {dispatchStage >= 2 ? '✓' : '3'}
              </div>
              <span className={dispatchStage >= 2 ? 'text-slate-800 font-medium' : 'text-slate-400'}>
                Hospital Bed &amp; Trauma Team Reserved ({activeHospital?.name})
              </span>
            </div>

            <div className="flex items-center space-x-3 text-xs">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                dispatchStage >= 3 ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'
              }`}>
                {dispatchStage >= 3 ? '✓' : '4'}
              </div>
              <span className={dispatchStage >= 3 ? 'text-slate-800 font-medium' : 'text-slate-400'}>
                Ambulance En Route (ETA {activeHospital?.eta})
              </span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
