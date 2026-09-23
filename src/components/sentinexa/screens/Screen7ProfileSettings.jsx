import React, { useState } from 'react';
import { Globe, Bell, Shield, Award, ChevronRight, Smartphone, MapPin } from 'lucide-react';
import { useCivicStore } from '../../../store/useCivicStore';

export default function Screen7ProfileSettings({ onBack }) {
  const userLocation = useCivicStore(state => state.userLocation);
  const [lang, setLang] = useState('en');
  const [notifs, setNotifs] = useState({
    emergency: true,
    civic: true,
    agents: false
  });
  const [offlineSync, setOfflineSync] = useState(true);

  const Toggle = ({ checked, onChange }) => (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`w-10 h-5.5 rounded-full transition-colors flex items-center px-0.5 ${checked ? 'bg-blue-600' : 'bg-slate-200'}`}
    >
      <span className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-4.5' : 'translate-x-0'}`} />
    </button>
  );

  const city = userLocation?.city || 'Coimbatore';
  const district = userLocation?.district || 'Coimbatore';

  const isTamil = lang === 'ta';

  return (
    <div className="flex flex-col h-full bg-gray-50 overflow-y-auto pb-20">

      {/* Header */}
      <div className="bg-white px-4 pt-3 pb-3 shadow-sm border-b border-slate-100">
        <div className="flex items-center justify-between">
          <h2 className="font-black text-slate-900 text-base flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-600" />
            {isTamil ? 'அமைப்புகள்' : 'Settings'}
          </h2>
          <button onClick={onBack}
            className="text-xs bg-slate-100 text-slate-700 px-3 py-1.5 rounded-xl font-bold border border-slate-200">
            Done
          </button>
        </div>
      </div>

      <div className="p-4 space-y-3">

        {/* Profile Badge */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-4 flex items-center gap-3 shadow-lg shadow-blue-200">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
            <Award className="w-7 h-7 text-white" />
          </div>
          <div>
            <p className="text-white font-black text-sm">Verified Civic Scout</p>
            <p className="text-blue-100 text-[11px]">Level 4 · 42 Reports Resolved</p>
            <div className="flex items-center gap-1.5 mt-1">
              <MapPin className="w-3 h-3 text-blue-200" />
              <span className="text-blue-100 text-[11px]">{city}, {district}</span>
            </div>
          </div>
          <span className="ml-auto px-2.5 py-1 rounded-full bg-white/20 text-white text-[10px] font-bold">
            🔥 42d
          </span>
        </div>

        {/* Language */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-50">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" /> Language
            </h3>
          </div>
          <div className="px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900">App Language</p>
              <p className="text-[11px] text-slate-400">English / தமிழ்</p>
            </div>
            <div className="flex bg-slate-100 p-0.5 rounded-xl gap-0.5 text-xs font-bold">
              <button onClick={() => setLang('en')}
                className={`px-3 py-1.5 rounded-lg transition-all ${lang === 'en' ? 'bg-blue-600 text-white shadow' : 'text-slate-600'}`}>
                EN
              </button>
              <button onClick={() => setLang('ta')}
                className={`px-3 py-1.5 rounded-lg transition-all ${lang === 'ta' ? 'bg-blue-600 text-white shadow' : 'text-slate-600'}`}>
                தமிழ்
              </button>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-50">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5" /> Notifications
            </h3>
          </div>
          {[
            { key: 'emergency', label: 'Emergency Alerts', sub: 'Critical 108 / 100 dispatches', color: 'text-red-600' },
            { key: 'civic', label: 'Civic Updates', sub: 'SLA alerts & ticket updates', color: 'text-blue-600' },
            { key: 'agents', label: 'AI Agent Activity', sub: 'Pipeline steps & telemetry', color: 'text-indigo-600' }
          ].map(({ key, label, sub, color }) => (
            <div key={key} className="flex items-center justify-between px-4 py-3 border-b border-slate-50 last:border-0">
              <div>
                <p className={`text-sm font-semibold ${color}`}>{label}</p>
                <p className="text-[11px] text-slate-400">{sub}</p>
              </div>
              <Toggle
                checked={notifs[key]}
                onChange={v => setNotifs(prev => ({ ...prev, [key]: v }))}
              />
            </div>
          ))}
        </div>

        {/* Device & Sync */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-50">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5" /> Device & Sync
            </h3>
          </div>
          <div className="flex items-center justify-between px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">Offline Queue</p>
              <p className="text-[11px] text-slate-400">Auto-sync when reconnected</p>
            </div>
            <Toggle checked={offlineSync} onChange={setOfflineSync} />
          </div>
        </div>

        {/* Quick Dial */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-50">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Emergency Contacts</h3>
          </div>
          {[
            { label: 'Police Control Room', number: '100' },
            { label: 'Ambulance Service', number: '108' },
            { label: 'Fire & Rescue', number: '101' }
          ].map(({ label, number }) => (
            <a key={number} href={`tel:${number}`}
              className="flex items-center justify-between px-4 py-3 border-b border-slate-50 last:border-0 hover:bg-slate-50 active:bg-slate-100">
              <div>
                <p className="text-sm font-semibold text-slate-900">{label}</p>
                <p className="text-xs font-mono text-blue-600">{number}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </a>
          ))}
        </div>

        {/* App Info */}
        <div className="text-center pt-1 space-y-0.5">
          <p className="text-xs font-black text-slate-400">SENTIN<span className="text-blue-500">EXA</span></p>
          <p className="text-[10px] text-slate-300 font-mono">v2.1.0 · Tamil Nadu Civic Intelligence Mesh</p>
        </div>
      </div>
    </div>
  );
}
