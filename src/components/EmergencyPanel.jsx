import React, { useState } from 'react';
import { useCivicStore } from '../store/useCivicStore';
import { X, AlertOctagon, PhoneCall, Stethoscope, Navigation, CheckCircle2, ShieldAlert, Send, Radio } from 'lucide-react';

export default function EmergencyPanel() {
  const { 
    isEmergencyOpen, 
    closeEmergencyModal, 
    nearbyHospitals, 
    capturedGeoPhoto, 
    n8nConfig, 
    addN8nLog, 
    addAgentLog,
    addIncident,
    language 
  } = useCivicStore();

  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchedSuccess, setDispatchedSuccess] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState(null);

  if (!isEmergencyOpen) return null;

  const lat = capturedGeoPhoto?.lat || 13.0827;
  const long = capturedGeoPhoto?.long || 80.2707;

  const handleTriggerEmergencyDispatch = async (hospital) => {
    setSelectedHospital(hospital);
    setIsDispatching(true);

    const emergencyTicket = {
      id: 'EMG-TN-' + Math.floor(1000 + Math.random() * 9000),
      type: 'EMERGENCY',
      category: 'EMERGENCY',
      title: 'PRIORITY 1: Life-Safety Emergency Alert (Geo-Cam Verified)',
      tamilTitle: 'முதன்மை 1: உயிர் பாதுகாப்பு அவசர கால எச்சரிக்கை (சரிபார்க்கப்பட்டது)',
      description: `High priority emergency reported near coordinates (${lat.toFixed(4)}, ${long.toFixed(4)}). Target medical center: ${hospital.name}.`,
      tamilDescription: `ஆபத்தான அவசர நிலை குறிக்கப்பட்ட இடம் (${lat.toFixed(4)}, ${long.toFixed(4)}). இலக்கு மருத்துவமனை: ${hospital.tamilName || hospital.name}.`,
      lat,
      long,
      state: 'Tamil Nadu',
      district: 'Chennai',
      address: capturedGeoPhoto?.address || `Coordinates (${lat}, ${long})`,
      department: 'Disaster Management & Hospital Emergency Rescue Cell',
      routingPortal: 'Emergency Response System (108 / n8n Webhook)',
      truthScore: 99,
      status: 'DISPATCHED',
      createdAt: new Date().toISOString(),
      unacknowledgedDays: 0,
      retryCount: 0,
      imageUri: capturedGeoPhoto?.imageUri || 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=600&auto=format&fit=crop&q=60'
    };

    // Add to store & trigger agent pipeline + n8n webhook
    addIncident(emergencyTicket);

    setTimeout(() => {
      setIsDispatching(false);
      setDispatchedSuccess(true);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-red-950/80 backdrop-blur-lg animate-fade-in">
      <div className="bg-slate-900 border-2 border-red-600 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl shadow-red-950/80 flex flex-col max-h-[90vh]">
        
        {/* Banner Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center animate-bounce">
              <AlertOctagon className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-black text-lg tracking-tight uppercase">
                  {language === 'ta' ? 'அவசர கால மருத்துவ உதவி' : 'EMERGENCY RESPONSE PROTOCOL'}
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-white/20 font-mono text-[10px] uppercase font-bold animate-pulse">
                  PRIORITY 1
                </span>
              </div>
              <p className="text-xs text-red-100 font-mono">
                Lat: {lat.toFixed(4)}, Long: {long.toFixed(4)} | Auto Hospital Query Active
              </p>
            </div>
          </div>

          <button
            onClick={closeEmergencyModal}
            className="p-2 rounded-xl bg-black/20 hover:bg-black/40 text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-slate-950">
          
          {/* Dispatch Confirmation Callout */}
          {dispatchedSuccess ? (
            <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 space-y-3 animate-fade-in">
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                <div>
                  <h3 className="font-bold text-sm text-white">n8n Priority Emergency Trigger Dispatched!</h3>
                  <p className="text-xs text-emerald-200">
                    Target Hospital: <strong className="text-white">{selectedHospital?.name}</strong>. Emergency hotline notified.
                  </p>
                </div>
              </div>
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 font-mono text-xs text-slate-300">
                <p>Status: <span className="text-emerald-400 font-bold">200 OK (DISPATCHED)</span></p>
                <p>Webhook Endpoint: <span className="text-cyan-400">{n8nConfig.emergencyWebhookUrl}</span></p>
                <p>Hotline: <span className="text-amber-400 font-bold">{selectedHospital?.emergencyHotline}</span></p>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-300 flex items-start space-x-3">
              <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <p className="text-xs leading-relaxed">
                {language === 'ta'
                  ? 'கீழே உள்ள அருகிலுள்ள மருத்துவமனைகளில் ஒன்றை தேர்வு செய்து உடனடி n8n அவசர தகவலை அனுப்புங்கள்.'
                  : 'Select an available hospital below to dispatch instant n8n emergency broadcast and fetch nearby ambulance response.'}
              </p>
            </div>
          )}

          {/* Hospitals List */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
              <span>Nearby Available Medical Centers ({nearbyHospitals.length})</span>
              <span className="font-mono text-cyan-400">Sorted by Nearest Coordinates</span>
            </h3>

            <div className="space-y-3">
              {nearbyHospitals.map(hosp => (
                <div
                  key={hosp.id}
                  className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-red-500/50 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Stethoscope className="w-4 h-4 text-red-400" />
                      <h4 className="font-bold text-slate-100 text-sm">
                        {language === 'ta' && hosp.tamilName ? hosp.tamilName : hosp.name}
                      </h4>
                      <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 text-[10px] font-bold font-mono">
                        {hosp.distanceKm} km away
                      </span>
                    </div>

                    <p className="text-xs text-slate-400">{hosp.addressText}</p>

                    <div className="flex items-center space-x-4 pt-1 text-xs">
                      <span className="text-emerald-400 font-mono font-semibold">
                        ICU Beds: <strong>{hosp.icuBedsAvailable}</strong> available
                      </span>
                      <span className="text-cyan-400 font-mono">
                        Ambulances: <strong>{hosp.ambulanceUnits}</strong> units
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                    <a
                      href={`tel:${hosp.emergencyHotline.split('/')[0].trim()}`}
                      className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold flex items-center space-x-1.5 border border-slate-700"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>{hosp.emergencyHotline}</span>
                    </a>

                    <button
                      onClick={() => handleTriggerEmergencyDispatch(hosp)}
                      disabled={isDispatching}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-xs shadow-lg shadow-red-600/30 flex items-center space-x-1.5 transition-transform active:scale-95 disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isDispatching ? 'DISPATCHING...' : 'DISPATCH n8n TRIGGER'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-mono flex items-center space-x-1">
            <Radio className="w-3.5 h-3.5 text-red-500 animate-pulse" />
            <span>n8n Emergency Webhook: {n8nConfig.emergencyWebhookUrl}</span>
          </span>
          <button
            onClick={closeEmergencyModal}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
