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
    <div className="flex flex-col h-full bg-[#0a0f1d] text-white overflow-y-auto">
      {/* Top Header */}
      <div className="p-4 border-b border-cyan-500/20 bg-[#0d1628]/80 backdrop-blur sticky top-0 z-20 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
            <Shield className="w-5 h-5 text-cyan-400" />
            {cur.title}
          </h2>
          <p className="text-[11px] text-slate-400 font-mono">{cur.subtitle}</p>
        </div>
        <button 
          onClick={onBack}
          className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700"
        >
          Done
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Civic Scout Badge Card */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/40 via-blue-900/30 to-purple-950/40 border border-cyan-500/30 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-cyan-200">{cur.profileBadge}</span>
                <span className="text-[10px] bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-full border border-cyan-500/40 font-mono">
                  Trust 98.4%
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">{cur.level}</p>
              <div className="w-48 bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-gradient-to-r from-cyan-400 to-emerald-400 h-full w-[85%] rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Language Switcher EN / TA */}
        <div className="p-4 rounded-xl bg-[#0d1628] border border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-cyan-400" />
              <div>
                <h3 className="text-xs font-bold text-slate-200">{cur.langTitle}</h3>
                <p className="text-[10px] text-slate-400">{cur.langSub}</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setLang('en')}
              className={`p-3 rounded-lg border text-left flex items-center justify-between transition-all ${
                lang === 'en'
                  ? 'bg-cyan-950/50 border-cyan-500/60 text-cyan-200 shadow-md shadow-cyan-950'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div>
                <p className="text-xs font-bold">English (UK/IN)</p>
                <p className="text-[10px] opacity-70">Primary Gov Format</p>
              </div>
              {lang === 'en' && <CheckCircle className="w-4 h-4 text-cyan-400" />}
            </button>
            <button
              onClick={() => setLang('ta')}
              className={`p-3 rounded-lg border text-left flex items-center justify-between transition-all ${
                lang === 'ta'
                  ? 'bg-cyan-950/50 border-cyan-500/60 text-cyan-200 shadow-md shadow-cyan-950'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div>
                <p className="text-xs font-bold">தமிழ் (Tamil)</p>
                <p className="text-[10px] opacity-70">தமிழ்நாடு அரசு வடிவம்</p>
              </div>
              {lang === 'ta' && <CheckCircle className="w-4 h-4 text-cyan-400" />}
            </button>
          </div>
        </div>

        {/* n8n Connected Agent Infrastructure Status */}
        <div className="p-4 rounded-xl bg-[#0d1628] border border-cyan-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-orange-500/20 border border-orange-500/40 flex items-center justify-center">
                <Cpu className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-200">{cur.n8nTitle}</span>
                  <span className="flex items-center gap-1 text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                    Live
                  </span>
                </div>
                <p className="text-[10px] text-emerald-400 font-mono mt-0.5">{cur.n8nStatus}</p>
                <p className="text-[9px] text-slate-500 font-mono">{cur.n8nLatency} · TLS 1.3 · HMAC Verified</p>
              </div>
            </div>
            <RefreshCw className="w-4 h-4 text-slate-500 hover:text-cyan-400 cursor-pointer" />
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="p-4 rounded-xl bg-[#0d1628] border border-slate-800 space-y-3">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold text-slate-200">{cur.notifTitle}</h3>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800/80">
              <span className="text-xs text-slate-300">{cur.notifEmergency}</span>
              <input 
                type="checkbox" 
                checked={notifs.emergencyOnly} 
                onChange={() => setNotifs({...notifs, emergencyOnly: !notifs.emergencyOnly})}
                className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
              />
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800/80">
              <span className="text-xs text-slate-300">{cur.notifCivic}</span>
              <input 
                type="checkbox" 
                checked={notifs.allCivic} 
                onChange={() => setNotifs({...notifs, allCivic: !notifs.allCivic})}
                className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
              />
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800/80">
              <span className="text-xs text-slate-300">{cur.notifAudit}</span>
              <input 
                type="checkbox" 
                checked={notifs.agentAudit} 
                onChange={() => setNotifs({...notifs, agentAudit: !notifs.agentAudit})}
                className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Resilient Offline Mode */}
        <div className="p-4 rounded-xl bg-[#0d1628] border border-slate-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-bold text-slate-200">{cur.offlineTitle}</h3>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">{cur.offlineSub}</p>
          </div>
          <button
            onClick={() => setOfflineSync(!offlineSync)}
            className={`w-11 h-6 flex items-center rounded-full p-1 duration-200 cursor-pointer ${
              offlineSync ? 'bg-cyan-500 justify-end' : 'bg-slate-700 justify-start'
            }`}
          >
            <div className="w-4 h-4 bg-white rounded-full shadow-md"></div>
          </button>
        </div>

        {/* Quick Emergency SOS Cards */}
        <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/30">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <h3 className="text-xs font-bold text-red-300">{cur.emergencyContacts}</h3>
          </div>
          <div className="space-y-1.5 text-xs text-slate-300">
            <div className="flex justify-between items-center py-1 border-b border-red-500/10">
              <span>{cur.primaryContact}</span>
              <a href="tel:100" className="text-red-400 font-mono font-bold hover:underline">CALL 100</a>
            </div>
            <div className="flex justify-between items-center py-1">
              <span>{cur.secondaryContact}</span>
              <a href="tel:108" className="text-red-400 font-mono font-bold hover:underline">CALL 108</a>
            </div>
          </div>
        </div>

        <div className="text-center pb-4 text-[10px] font-mono text-slate-600">
          SENTINEXA MOBILE AGENT OS · BUILD 2026.09.23 · TAMIL NADU MESH
        </div>
      </div>
    </div>
  );
}
