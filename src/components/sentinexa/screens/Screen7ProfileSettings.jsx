import React, { useState } from 'react';
import { 
  Globe, Bell, Shield, Cpu, Award, Smartphone, CheckCircle, 
  ChevronRight, Volume2, Moon, Sliders, RefreshCw, AlertTriangle
} from 'lucide-react';

export default function Screen7ProfileSettings({ onBack }) {
  const [lang, setLang] = useState('en');
  const [notifs, setNotifs] = useState({
    emergencyOnly: false,
    allCivic: true,
    agentAudit: true,
    soundAlert: true
  });
  const [offlineSync, setOfflineSync] = useState(true);

  const t = {
    en: {
      title: 'Settings & Trust Profile',
      subtitle: 'Autonomous Node Configuration',
      profileBadge: 'Verified Civic Scout',
      level: 'Level 4 · 42 Reports Resolved',
      langTitle: 'Application Language',
      langSub: 'Instant UI & Memo Bilingual Switch',
      notifTitle: 'Dispatch & Alert Preferences',
      notifEmergency: 'Critical Emergency Broadcasts (108/100)',
      notifCivic: 'Civic Triage & SLA Notifications',
      notifAudit: 'Agent Lifecycle Step Audit Feeds',
      n8nTitle: 'Agent Orchestration Pipeline',
      n8nStatus: 'n8n Cloud Workflow: Connected',
      n8nLatency: 'Webhook Latency: 142ms',
      offlineTitle: 'Resilient Offline Queue',
      offlineSub: 'Local SQLite caching with background sync on reconnect',
      emergencyContacts: 'Emergency SOS Contacts',
      primaryContact: 'Chennai City Police Control: 100',
      secondaryContact: 'State Emergency Ambulance Service: 108'
    },
    ta: {
      title: 'சுயவிவரம் & அமைப்புகள்',
      subtitle: 'தன்னாட்சி முகவர் கட்டமைப்பு',
      profileBadge: 'சரிபார்க்கப்பட்ட குடிமை சாரணர்',
      level: 'நிலை 4 · 42 கோரிக்கைகள் தீர்க்கப்பட்டன',
      langTitle: 'செயலி மொழி மாற்றம்',
      langSub: 'தமிழ் மற்றும் ஆங்கிலம் இருமொழி வசதி',
      notifTitle: 'அறிவிப்பு விருப்பங்கள்',
      notifEmergency: 'முக்கிய அவசர கால அறிவிப்புகள் (108/100)',
      notifCivic: 'குடிமை குறைகள் & SLA தீர்வு அறிவிப்புகள்',
      notifAudit: 'முகவர் வாழ்க்கை சுழற்சி பதிவுகள்',
      n8nTitle: 'முகவர் ஒருங்கிணைப்பு கட்டமைப்பு',
      n8nStatus: 'n8n கிளவுட் பணிப்பாய்வு: இணைக்கப்பட்டது',
      n8nLatency: 'வலைக்கொக்கி தாமதம்: 142ms',
      offlineTitle: 'இணையமற்ற பதிவு முறை',
      offlineSub: 'இணையம் வரும்போது தானாக பதிவேற்றம் செய்யப்படும்',
      emergencyContacts: 'அவசர SOS தொடர்புகள்',
      primaryContact: 'சென்னை காவல் கட்டுப்பாட்டு அறை: 100',
      secondaryContact: 'மாநில ஆம்புலன்ஸ் அவசர சேவை: 108'
    }
  };

  const cur = t[lang];

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC] text-slate-800 font-sans overflow-y-auto select-none">
      
      {/* Top Header */}
      <div className="p-4 border-b border-slate-200 bg-white sticky top-0 z-20 flex items-center justify-between shadow-sm">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 tracking-wide flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            {cur.title}
          </h2>
          <p className="text-[11px] text-slate-500 font-mono">{cur.subtitle}</p>
        </div>
        <button 
          onClick={onBack}
          className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 font-bold transition-colors"
        >
          Done
        </button>
      </div>

      <div className="p-4 space-y-4 pb-20">
        
        {/* Civic Scout Badge Card */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20 text-white">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-900">{cur.profileBadge}</span>
                <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200 font-mono font-bold">
                  Trust 98.4%
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{cur.level}</p>
              <div className="w-48 bg-slate-100 h-2 rounded-full mt-2 overflow-hidden border border-slate-200">
                <div className="bg-gradient-to-r from-blue-600 to-emerald-500 h-full w-[85%] rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Language Switcher EN / TA */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-600" />
              <div>
                <h3 className="text-xs font-bold text-slate-900">{cur.langTitle}</h3>
                <p className="text-[10px] text-slate-500">{cur.langSub}</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setLang('en')}
              className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                lang === 'en'
                  ? 'bg-blue-50 border-blue-500 text-blue-900 shadow-xs'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              <div>
                <p className="text-xs font-bold">English (UK/IN)</p>
                <p className="text-[10px] text-slate-500">Standard Gov Format</p>
              </div>
              {lang === 'en' && <CheckCircle className="w-4 h-4 text-blue-600" />}
            </button>
            <button
              onClick={() => setLang('ta')}
              className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                lang === 'ta'
                  ? 'bg-blue-50 border-blue-500 text-blue-900 shadow-xs'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              <div>
                <p className="text-xs font-bold">தமிழ் (Tamil)</p>
                <p className="text-[10px] text-slate-500">தமிழ்நாடு அரசு வடிவம்</p>
              </div>
              {lang === 'ta' && <CheckCircle className="w-4 h-4 text-blue-600" />}
            </button>
          </div>
        </div>

        {/* n8n Connected Agent Infrastructure Status */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center">
                <Cpu className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">{cur.n8nTitle}</span>
                  <span className="flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200 font-mono font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Live
                  </span>
                </div>
                <p className="text-[11px] text-emerald-700 font-mono font-semibold mt-0.5">{cur.n8nStatus}</p>
                <p className="text-[10px] text-slate-400 font-mono">{cur.n8nLatency} · TLS 1.3 · HMAC Verified</p>
              </div>
            </div>
            <RefreshCw className="w-4 h-4 text-slate-400 hover:text-blue-600 cursor-pointer" />
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-bold text-slate-900">{cur.notifTitle}</h3>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs text-slate-700">{cur.notifEmergency}</span>
              <input 
                type="checkbox" 
                checked={notifs.emergencyOnly} 
                onChange={() => setNotifs({...notifs, emergencyOnly: !notifs.emergencyOnly})}
                className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
              />
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs text-slate-700">{cur.notifCivic}</span>
              <input 
                type="checkbox" 
                checked={notifs.allCivic} 
                onChange={() => setNotifs({...notifs, allCivic: !notifs.allCivic})}
                className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
              />
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs text-slate-700">{cur.notifAudit}</span>
              <input 
                type="checkbox" 
                checked={notifs.agentAudit} 
                onChange={() => setNotifs({...notifs, agentAudit: !notifs.agentAudit})}
                className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Resilient Offline Mode */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-blue-600" />
              <h3 className="text-xs font-bold text-slate-900">{cur.offlineTitle}</h3>
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">{cur.offlineSub}</p>
          </div>
          <button
            onClick={() => setOfflineSync(!offlineSync)}
            className={`w-11 h-6 flex items-center rounded-full p-1 duration-200 cursor-pointer ${
              offlineSync ? 'bg-blue-600 justify-end' : 'bg-slate-300 justify-start'
            }`}
          >
            <div className="w-4 h-4 bg-white rounded-full shadow-md"></div>
          </button>
        </div>

        {/* Quick Emergency SOS Cards */}
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <h3 className="text-xs font-bold text-red-900">{cur.emergencyContacts}</h3>
          </div>
          <div className="space-y-1.5 text-xs text-slate-700">
            <div className="flex justify-between items-center py-1 border-b border-red-100">
              <span>{cur.primaryContact}</span>
              <a href="tel:100" className="text-red-600 font-mono font-bold hover:underline">CALL 100</a>
            </div>
            <div className="flex justify-between items-center py-1">
              <span>{cur.secondaryContact}</span>
              <a href="tel:108" className="text-red-600 font-mono font-bold hover:underline">CALL 108</a>
            </div>
          </div>
        </div>

        <div className="text-center pb-4 text-[10px] font-mono text-slate-400">
          SENTINEXA MOBILE AGENT OS · BUILD 2026.09.23 · LIGHT EDITION
        </div>
      </div>
    </div>
  );
}
