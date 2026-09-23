import React, { useState } from 'react';
import { useCivicStore } from '../../../store/useCivicStore';
import { 
  AlertOctagon, PhoneCall, ShieldAlert, Flame, Send,
  Stethoscope, ArrowLeft, MapPin, Radio, Check, Mail
} from 'lucide-react';

export default function Screen3AEmergencyFlow({ photoData, capturedData, onBack, onComplete, onDispatched }) {
  const effectiveData = photoData || capturedData;
  const { nearbyHospitals, addIncident } = useCivicStore();
  const prototypeSettings = useCivicStore(state => state.prototypeSettings);
  const secondaryEmail = prototypeSettings?.secondaryEmail;
  const [dispatchStage, setDispatchStage] = useState(0);
  const [selectedHospital, setSelectedHospital] = useState(null);

  const storeUserLocation = useCivicStore(state => state.userLocation);
  const effectiveLocation = effectiveData?.location || storeUserLocation;
  const lat = effectiveLocation?.lat || 11.0168;
  const long = effectiveLocation?.long || 76.9558;
  const address = effectiveLocation?.address || 'Gandhipuram, Coimbatore - 641012';
  const district = effectiveLocation?.district || 'Coimbatore';
  const photoUrl = effectiveData?.image || null;

  const fallbackHospitals = [
    { id: 'h1', name: 'CMCH — Coimbatore Medical College', distance: '1.2 km', eta: '3 min', trauma: 'Level 1 Trauma' },
    { id: 'h2', name: 'GKNM Hospital — Emergency & Trauma', distance: '1.4 km', eta: '4 min', trauma: 'Emergency Trauma' },
    { id: 'h3', name: 'KMCH Emergency Medical Centre', distance: '3.1 km', eta: '7 min', trauma: 'Critical Care' }
  ];
  const hospitalsList = (nearbyHospitals?.length > 0) ? nearbyHospitals.slice(0, 3) : fallbackHospitals;
  const activeHospital = selectedHospital || hospitalsList[0];

  const handleDispatch = () => {
    setDispatchStage(1);
    const newEmergency = {
      id: 'SOS-' + Math.floor(1000 + Math.random() * 9000),
      type: 'EMERGENCY', category: 'medical', severity: 5,
      title: 'Emergency SOS Dispatched',
      description: `Emergency at ${address}. Hospital: ${activeHospital?.name}.`,
      lat, long, state: 'Tamil Nadu', district, address,
      department: '108 Ambulance & Police', status: 'DISPATCHED',
      createdAt: new Date().toISOString(),
      photoUrl: photoUrl || null, imageUri: photoUrl || null
    };
    if (typeof addIncident === 'function') addIncident(newEmergency);
    setTimeout(() => setDispatchStage(2), 1200);
    setTimeout(() => {
      setDispatchStage(3);
      onComplete?.(newEmergency);
      onDispatched?.(newEmergency);
    }, 2400);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 overflow-y-auto pb-20">

      {/* ── Top Bar ── */}
      <div className="bg-red-600 px-4 pt-3 pb-4 shadow-lg">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={onBack} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="font-black text-white text-base uppercase tracking-tight">Emergency SOS</h2>
            <p className="text-red-100 text-[11px] flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {lat.toFixed(4)}°N, {long.toFixed(4)}°E
            </p>
          </div>
          <div className="ml-auto">
            <AlertOctagon className="w-7 h-7 text-white animate-bounce" />
          </div>
        </div>
        <p className="text-red-100 text-[11px] bg-red-700/40 rounded-lg px-2 py-1 truncate">{address}</p>
      </div>

      <div className="flex flex-col gap-3 p-4">

        {/* ── Quick Dial ── */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { num: '108', label: 'Ambulance', icon: PhoneCall, color: 'red' },
            { num: '100', label: 'Police', icon: ShieldAlert, color: 'blue' },
            { num: '101', label: 'Fire', icon: Flame, color: 'amber' }
          ].map(({ num, label, icon: Icon, color }) => (
            <a key={num} href={`tel:${num}`}
              className={`flex flex-col items-center justify-center gap-1 py-3.5 rounded-2xl border transition-colors ${
                color === 'red' ? 'bg-red-50 border-red-200 text-red-700' :
                color === 'blue' ? 'bg-blue-50 border-blue-200 text-blue-700' :
                'bg-amber-50 border-amber-200 text-amber-700'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-black text-lg leading-none">{num}</span>
              <span className="text-[9px] font-bold text-slate-500 uppercase">{label}</span>
            </a>
          ))}
        </div>

        {/* ── Photo ── */}
        {photoUrl && (
          <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm max-h-40 bg-slate-100">
            <img src={photoUrl} alt="Evidence" className="w-full h-full object-cover" />
          </div>
        )}

        {/* ── Hospitals ── */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-2.5 border-b border-slate-100">
            <Stethoscope className="w-4 h-4 text-red-600" />
            <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wide">Nearest Hospitals</h3>
            <span className="ml-auto text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">Live ETA</span>
          </div>
          <div className="divide-y divide-slate-100">
            {hospitalsList.map((h, i) => (
              <button
                key={h.id || i}
                onClick={() => setSelectedHospital(h)}
                className={`w-full text-left px-3 py-2.5 flex items-center gap-3 transition-colors ${
                  activeHospital?.name === h.name ? 'bg-red-50' : 'hover:bg-slate-50'
                }`}
              >
                <div className={`w-1.5 h-10 rounded-full flex-shrink-0 ${activeHospital?.name === h.name ? 'bg-red-500' : 'bg-slate-200'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-900 truncate">{h.name}</p>
                  <p className="text-[10px] text-slate-400 font-mono">{h.distance} · {h.trauma}</p>
                </div>
                <span className="text-xs font-black text-red-600 bg-red-50 border border-red-200 px-2 py-1 rounded-lg flex-shrink-0">
                  {h.eta}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Dispatch Button ── */}
        {dispatchStage === 0 && (
          <button
            onClick={handleDispatch}
            className="w-full py-4 rounded-2xl bg-red-600 hover:bg-red-700 active:scale-95 text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-red-200 flex items-center justify-center gap-2 transition-all"
          >
            <Send className="w-4 h-4 animate-pulse" />
            Dispatch All Emergency Units
          </button>
        )}

        {/* ── Live Dispatch Steps ── */}
        {dispatchStage > 0 && (
          <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-4 space-y-2.5">
            <div className="flex items-center gap-2 mb-1">
              <Radio className="w-4 h-4 text-red-600 animate-spin" />
              <span className="font-bold text-xs text-slate-800">Dispatching…</span>
              <span className="ml-auto text-[10px] text-red-600 font-mono font-bold">
                {dispatchStage === 1 ? 'Sending SOS...' : dispatchStage === 2 ? 'Unit Alerted' : '🟢 En Route'}
              </span>
            </div>
            {[
              { label: 'GPS Location Locked & Verified', step: 0 },
              { label: '108 Emergency Dispatch Sent', step: 1 },
              { label: `Trauma Bed Reserved — ${activeHospital?.name}`, step: 2 },
              { label: `Ambulance En Route (ETA ${activeHospital?.eta})`, step: 3 }
            ].map(({ label, step }) => (
              <div key={step} className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                  dispatchStage > step ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400'
                }`}>
                  {dispatchStage > step ? <Check className="w-3 h-3" /> : step + 1}
                </div>
                <span className={`text-xs ${dispatchStage > step ? 'text-slate-800 font-medium' : 'text-slate-400'}`}>
                  {label}
                </span>
              </div>
            ))}

            {/* Prototype Alert Sent to Secondary Mail */}
            {dispatchStage === 3 && (
              <div className="mt-3 pt-3 border-t border-red-100 text-left space-y-1">
                <div className="flex items-center gap-1.5 text-red-900 font-bold text-xs">
                  <Mail className="w-3.5 h-3.5 text-red-600" />
                  <span>Prototype SOS Alert Dispatched</span>
                </div>
                <p className="text-[11px] text-red-800 leading-snug">
                  Emergency telemetry & GPS coordinates automatically routed to your secondary mail:
                  <strong className="block text-red-950 font-mono mt-0.5">{secondaryEmail || 'your secondary mail'}</strong>
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
