import React from 'react';
import { useCivicStore } from '../../../store/useCivicStore';
import SentinexaLogo from '../SentinexaLogo';
import HomeMiniMap from '../HomeMiniMap';
import { 
  AlertOctagon, 
  FileText, 
  Flame, 
  MapPin, 
  ShieldCheck, 
  ArrowRight, 
  Clock, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle,
  ChevronRight,
  Radio,
  Sparkles,
  Languages
} from 'lucide-react';

export default function Screen1HomeDashboard({ 
  onNavigate, 
  onLaunchEmergency, 
  onLaunchComplaint, 
  onOpenGeoCam 
}) {
  const { 
    incidents, 
    streakDays, 
    solvedCount, 
    language,
    setLanguage,
    userLocation
  } = useCivicStore();

  const pendingCount = incidents.filter(i => i.status !== 'SOLVED').length;
  const recentIncidents = incidents.slice(0, 3);

  const handleEmergencyClick = () => {
    if (typeof onLaunchEmergency === 'function') {
      onLaunchEmergency();
    } else if (typeof onOpenGeoCam === 'function') {
      onOpenGeoCam('emergency');
    } else if (typeof onNavigate === 'function') {
      onNavigate('emergency');
    }
  };

  const handleComplaintClick = () => {
    if (typeof onLaunchComplaint === 'function') {
      onLaunchComplaint();
    } else if (typeof onOpenGeoCam === 'function') {
      onOpenGeoCam('complaint');
    } else if (typeof onNavigate === 'function') {
      onNavigate('complaint');
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ta' : 'en');
  };

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC] text-slate-800 font-sans overflow-y-auto p-4 space-y-4 pb-20 select-none">
      
      {/* 1. TOP HEADER: New Brand Logo & Quick Status Bar */}
      <div className="flex items-center justify-between pt-1">
        <SentinexaLogo size="sm" />

        <div className="flex items-center space-x-2">
          {/* Live Location Chip */}
          <div className="px-2.5 py-1 rounded-full bg-white border border-slate-200 shadow-xs flex items-center space-x-1.5 text-[11px] font-semibold text-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-bold text-slate-900">{userLocation?.city || 'Coimbatore'}</span>
          </div>

          {/* Language Toggle Button */}
          <button
            onClick={toggleLanguage}
            className="px-2 py-1 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 shadow-xs flex items-center space-x-1 text-[11px] font-bold active:scale-95 transition-transform"
            title="Switch Language (English / தமிழ்)"
          >
            <Languages className="w-3.5 h-3.5 text-blue-600" />
            <span>{language === 'en' ? 'தமிழ்' : 'EN'}</span>
          </button>
        </div>
      </div>

      {/* 2. CORE DUAL ACTIONS: [🚨 EMERGENCY SOS] and [📋 CIVIC COMPLAINT] */}
      <div className="grid grid-cols-2 gap-3">
        
        {/* EMERGENCY HERO CARD */}
        <button
          onClick={handleEmergencyClick}
          className="relative overflow-hidden bg-gradient-to-br from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white p-4 rounded-3xl shadow-lg shadow-red-500/20 border border-red-500/30 flex flex-col justify-between h-36 transition-all active:scale-95 text-left group"
        >
          <div className="flex items-center justify-between w-full">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-xs shadow-inner">
              <AlertOctagon className="w-6 h-6 text-white animate-bounce" />
            </div>
            <span className="px-2 py-0.5 rounded-full bg-black/25 text-white font-mono text-[9px] uppercase font-bold tracking-wider">
              1-TAP SOS
            </span>
          </div>

          <div>
            <div className="font-black text-base tracking-tight leading-none uppercase">
              {language === 'ta' ? '🚨 அவசர உதவி' : '🚨 EMERGENCY'}
            </div>
            <p className="text-[11px] text-red-100 font-medium mt-1 leading-tight line-clamp-2">
              108 Ambulance, crash, fire & police
            </p>
          </div>
        </button>

        {/* COMPLAINT HERO CARD */}
        <button
          onClick={handleComplaintClick}
          className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white p-4 rounded-3xl shadow-lg shadow-blue-500/20 border border-blue-400/30 flex flex-col justify-between h-36 transition-all active:scale-95 text-left group"
        >
          <div className="flex items-center justify-between w-full">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-xs shadow-inner">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <span className="px-2 py-0.5 rounded-full bg-black/25 text-white font-mono text-[9px] uppercase font-bold tracking-wider">
              GEO-TAG
            </span>
          </div>

          <div>
            <div className="font-black text-base tracking-tight leading-none uppercase">
              {language === 'ta' ? '📋 புகார் பதிவு' : '📋 COMPLAINT'}
            </div>
            <p className="text-[11px] text-blue-100 font-medium mt-1 leading-tight line-clamp-2">
              Potholes, drainage, water & streetlights
            </p>
          </div>
        </button>

      </div>

      {/* 3. REAL LIVE MAP PREVIEW ON FRONT PAGE (Leaflet Interactive Radar) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center space-x-1.5">
            <MapPin className="w-4 h-4 text-blue-600" />
            <h3 className="font-black text-xs uppercase tracking-wider text-slate-900">
              {language === 'ta' ? 'நேரலை வரைபடம்' : 'Live Area Radar'}
            </h3>
          </div>

          <button
            onClick={() => onNavigate && onNavigate('map')}
            className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center space-x-0.5"
          >
            <span>Full Map View</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Real Live Leaflet Map Component */}
        <HomeMiniMap onExpand={() => onNavigate && onNavigate('map')} />
      </div>

      {/* 4. CLEAN METRICS & RESOLUTION STRIP */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="p-3 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col items-center text-center">
          <Flame className="w-4 h-4 text-amber-500 mb-1" />
          <span className="font-black text-sm text-slate-900 font-mono">{streakDays || 42} Days</span>
          <span className="text-[10px] text-slate-500 font-medium">Active Streak</span>
        </div>

        <div className="p-3 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col items-center text-center">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 mb-1" />
          <span className="font-black text-sm text-slate-900 font-mono">{solvedCount || 184}</span>
          <span className="text-[10px] text-slate-500 font-medium">Resolved</span>
        </div>

        <div className="p-3 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col items-center text-center">
          <Clock className="w-4 h-4 text-blue-600 mb-1" />
          <span className="font-black text-sm text-slate-900 font-mono">{pendingCount || 3}</span>
          <span className="text-[10px] text-slate-500 font-medium">In Progress</span>
        </div>
      </div>

      {/* 5. RECENT VERIFIED SIGNALS NEAR YOU */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-xs space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
            {language === 'ta' ? 'அண்மைய நிகழ்வுகள்' : 'Live Incident Feed'}
          </span>
          <button
            onClick={() => onNavigate && onNavigate('tickets')}
            className="text-[11px] font-bold text-blue-600 hover:underline flex items-center space-x-0.5"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2">
          {recentIncidents.map((inc) => (
            <div
              key={inc.id}
              onClick={() => onNavigate && onNavigate('map')}
              className="p-2.5 rounded-xl bg-slate-50/80 hover:bg-slate-100 border border-slate-200/80 text-xs flex items-center justify-between cursor-pointer transition-colors"
            >
              <div className="space-y-0.5 flex-1 min-w-0 pr-2">
                <div className="flex items-center space-x-1.5">
                  <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase font-mono ${
                    inc.type === 'EMERGENCY' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {inc.type}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {inc.district || 'Coimbatore'}
                  </span>
                </div>
                <p className="font-bold text-slate-800 text-[11px] truncate">
                  {language === 'ta' && inc.tamilTitle ? inc.tamilTitle : inc.title}
                </p>
                <p className="text-[10px] text-slate-500 truncate">
                  {inc.address}
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                  {inc.truthScore}% Conf
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
