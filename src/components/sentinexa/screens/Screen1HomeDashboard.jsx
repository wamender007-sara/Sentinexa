import React, { useState } from 'react';
import { useCivicStore } from '../../../store/useCivicStore';
import HomeMiniMap from '../HomeMiniMap';
import SentinexaLogo from '../SentinexaLogo';
import { 
  AlertOctagon, FileText, MapPin, ChevronRight, Clock, 
  ShieldCheck, Sparkles, Languages, ArrowUpRight, CheckCircle2,
  Navigation, Zap, Filter
} from 'lucide-react';

export default function Screen1HomeDashboard({ onNavigate, onOpenGeoCam }) {
  const { incidents, streakDays, solvedCount, userLocation, language, setLanguage } = useCivicStore();
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'critical' | 'resolved'
  const isTamil = language === 'ta';

  const pending = incidents.filter(i => i.status !== 'SOLVED' && i.status !== 'RESOLVED').length;
  const filteredIncidents = incidents.filter(inc => {
    if (filterMode === 'critical') return inc.type === 'EMERGENCY' || inc.severity >= 4;
    if (filterMode === 'resolved') return inc.status === 'RESOLVED' || inc.status === 'SOLVED';
    return true;
  }).slice(0, 4);

  const cityName = userLocation?.city || 'Coimbatore';
  const displayAddress = userLocation?.address 
    ? (userLocation.address.length > 32 ? userLocation.address.substring(0, 32) + '...' : userLocation.address)
    : 'Kinathukadavu, Coimbatore';

  return (
    <div className="flex flex-col h-full bg-slate-50/70 overflow-y-auto pb-24 text-slate-800">

      {/* ── Top Header Bar ── */}
      <header className="bg-white/95 backdrop-blur-md px-4 py-3 border-b border-slate-100 shadow-xs flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <SentinexaLogo size="xs" showSubtitle={false} />
          <div>
            <h1 className="text-base font-black tracking-tight text-slate-900 leading-none">
              SENTIN<span className="text-blue-600">EXA</span>
            </h1>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-semibold text-slate-500 truncate max-w-[150px]">
                {displayAddress}
              </span>
            </div>
          </div>
        </div>

        {/* Language Pill & Verified Badge */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setLanguage?.(isTamil ? 'en' : 'ta')}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-[10px] font-bold text-slate-700 transition-colors"
            title="Toggle Language"
          >
            <Languages className="w-3 h-3 text-blue-600" />
            <span>{isTamil ? 'தமிழ்' : 'EN'}</span>
          </button>
        </div>
      </header>

      {/* ── Autonomous Mesh Status Banner ── */}
      <div className="px-4 pt-3">
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-3.5 shadow-sm border border-blue-950/20 relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-24 h-24 bg-blue-500/10 rounded-full blur-xl pointer-events-none" />
          
          <div className="flex items-center justify-between mb-2">
            <span className="inline-flex items-center gap-1 text-[10px] font-mono tracking-wider font-bold bg-white/10 px-2 py-0.5 rounded-full text-blue-200 border border-white/10">
              <Zap className="w-3 h-3 text-cyan-400" />
              {isTamil ? 'தன்னாட்சி பொது கட்டமைப்பு' : 'AUTONOMOUS CIVIC MESH'}
            </span>
            <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Active
            </span>
          </div>

          <p className="text-xs font-semibold text-slate-100 leading-snug">
            {isTamil 
              ? 'AI புகைப்பட பரிசோதனை & 48 மணிநேர அரசு தீர்வு உத்தரவாதம் தயார்.' 
              : 'AI Multi-Region Vision & 48-Hour Municipal SLA Routing Active.'}
          </p>

          <div className="grid grid-cols-3 gap-2 mt-3 pt-2.5 border-t border-white/10 text-center">
            <div>
              <p className="text-sm font-black text-white">{solvedCount || 184}</p>
              <p className="text-[9px] text-slate-300 font-medium uppercase tracking-tight">
                {isTamil ? 'தீர்க்கப்பட்டது' : 'Resolved'}
              </p>
            </div>
            <div>
              <p className="text-sm font-black text-amber-400">{pending}</p>
              <p className="text-[9px] text-slate-300 font-medium uppercase tracking-tight">
                {isTamil ? 'நடவடிக்கையில்' : 'Active'}
              </p>
            </div>
            <div>
              <p className="text-sm font-black text-cyan-400">&lt; 4s</p>
              <p className="text-[9px] text-slate-300 font-medium uppercase tracking-tight">
                {isTamil ? 'பதில் வேகம்' : 'Dispatch'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Two Big Primary Action Cards ── */}
      <div className="px-4 pt-3.5 grid grid-cols-2 gap-3">
        {/* Report Civic Issue */}
        <button
          type="button"
          onClick={() => onOpenGeoCam?.('complaint')}
          className="group relative flex flex-col justify-between bg-white hover:bg-blue-50/50 border border-slate-200 hover:border-blue-300 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all active:scale-98 text-left"
        >
          <div className="flex items-start justify-between w-full">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
          </div>

          <div className="mt-4">
            <span className="block font-black text-slate-900 text-sm leading-tight">
              {isTamil ? 'புகார் பதிவு செய்' : 'Report Issue'}
            </span>
            <span className="block text-[11px] text-slate-500 mt-0.5">
              {isTamil ? 'சாலை, குடிநீர், கழிவுநீர்' : 'Road, Water, Drainage'}
            </span>
          </div>

          <span className="inline-block mt-2 text-[9px] font-bold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">
            48h SLA Guarantee
          </span>
        </button>

        {/* Emergency SOS */}
        <button
          type="button"
          onClick={() => onOpenGeoCam?.('emergency')}
          className="group relative flex flex-col justify-between bg-gradient-to-br from-red-600 to-rose-700 text-white rounded-2xl p-4 shadow-md shadow-red-600/20 hover:shadow-lg transition-all active:scale-98 text-left overflow-hidden"
        >
          <div className="absolute right-0 bottom-0 translate-x-3 translate-y-3 w-20 h-20 bg-white/10 rounded-full blur-md pointer-events-none" />

          <div className="flex items-start justify-between w-full relative z-10">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:scale-105 transition-transform">
              <AlertOctagon className="w-5 h-5 text-white" />
            </div>
            <span className="text-[10px] font-mono font-bold bg-white/20 px-2 py-0.5 rounded-full border border-white/20">
              108 / 100
            </span>
          </div>

          <div className="mt-4 relative z-10">
            <span className="block font-black text-white text-sm leading-tight">
              {isTamil ? 'அவசர உதவி' : 'Emergency SOS'}
            </span>
            <span className="block text-[11px] text-red-100 mt-0.5">
              {isTamil ? 'ஆம்புலன்ஸ் & போலீஸ்' : 'Ambulance & Trauma'}
            </span>
          </div>

          <span className="inline-block mt-2 text-[9px] font-bold text-white bg-black/20 px-2 py-0.5 rounded-full relative z-10 w-fit">
            &lt; 3 Min Triage
          </span>
        </button>
      </div>

      {/* ── Live Mini Map Card ── */}
      <div className="px-4 pt-3.5">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-bold text-slate-800">
                {isTamil ? 'நேரலை பகுதி வரைபடம்' : 'Live Neighborhood Map'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => onNavigate?.('map')}
              className="text-[11px] text-blue-600 font-bold hover:text-blue-800 flex items-center gap-0.5"
            >
              <span>{isTamil ? 'முழு வரைபடம்' : 'Full Map'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="rounded-xl overflow-hidden border border-slate-100 shadow-inner" style={{ height: 160 }}>
            <HomeMiniMap onExpand={() => onNavigate?.('map')} />
          </div>

          <p className="text-[10px] text-slate-400 flex items-center justify-between pt-0.5">
            <span>Showing verified incidents near your GPS</span>
            <span className="font-mono text-blue-600 font-semibold">Live GPS Active</span>
          </p>
        </div>
      </div>

      {/* ── Verified Civic Incidents Feed ── */}
      <div className="px-4 pt-3.5 space-y-2.5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider">
              {isTamil ? 'சமீபத்திய சம்பவங்கள்' : 'Civic Activity & Dispatches'}
            </h2>
            <p className="text-[10px] text-slate-400">
              {isTamil ? 'அரசு துறை வழிகாட்டல் நிலை' : 'Automated department routing status'}
            </p>
          </div>

          {/* Quick Filter tabs */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[10px] font-bold">
            <button
              type="button"
              onClick={() => setFilterMode('all')}
              className={`px-2 py-0.5 rounded-md transition-all ${filterMode === 'all' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-500'}`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('critical')}
              className={`px-2 py-0.5 rounded-md transition-all ${filterMode === 'critical' ? 'bg-red-600 text-white shadow-xs' : 'text-slate-500'}`}
            >
              Critical
            </button>
          </div>
        </div>

        {/* List */}
        <div className="space-y-2">
          {filteredIncidents.map((inc) => (
            <div
              key={inc.id}
              onClick={() => onNavigate?.('tickets')}
              className="bg-white rounded-xl border border-slate-200 shadow-xs p-3 flex items-start gap-3 hover:border-blue-300 transition-colors cursor-pointer group"
            >
              <div className={`w-2.5 h-10 rounded-full shrink-0 mt-0.5 ${
                inc.type === 'EMERGENCY' ? 'bg-red-500' : 'bg-blue-500'
              }`} />

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <p className="text-xs font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                    {isTamil && inc.tamilTitle ? inc.tamilTitle : inc.title}
                  </p>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                    inc.status === 'RESOLVED' || inc.status === 'SOLVED'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : inc.status === 'DISPATCHED'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {inc.status === 'ROUTED_WARD' ? 'Routed' : inc.status || 'Active'}
                  </span>
                </div>

                <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                  {inc.address}
                </p>

                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mt-1.5 pt-1.5 border-t border-slate-50">
                  <span className="flex items-center gap-1 text-slate-500">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {inc.id}
                  </span>
                  <span className="text-blue-600 font-semibold truncate max-w-[120px]">
                    {inc.department}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {filteredIncidents.length === 0 && (
            <div className="bg-white rounded-xl border border-dashed border-slate-200 py-6 text-center">
              <p className="text-xs text-slate-400">No reports matching this filter.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

