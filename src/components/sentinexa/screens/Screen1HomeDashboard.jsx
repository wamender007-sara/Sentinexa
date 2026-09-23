import React from 'react';
import { useCivicStore } from '../../../store/useCivicStore';
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
  Send,
  Cpu,
  Radio
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
    agentLogs, 
    language 
  } = useCivicStore();

  const pendingCount = incidents.filter(i => i.status !== 'SOLVED').length;
  const recentLogs = agentLogs.slice(0, 4);

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

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC] text-slate-800 font-sans overflow-y-auto p-4 space-y-4 pb-20 select-none">
      
      {/* Top Welcome & Agency Bar */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-slate-500 flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block mr-1"></span>
            Greater Chennai & TN Civic Grid
          </span>
          <h2 className="text-lg font-black tracking-tight text-slate-900">
            {language === 'ta' ? 'அவசர & நகர்ப்புற மையம்' : 'Citizen Incident Command'}
          </h2>
        </div>

        <div className="p-2 rounded-2xl bg-white border border-slate-200 shadow-sm text-blue-600">
          <ShieldCheck className="w-5 h-5 text-blue-600" />
        </div>
      </div>

      {/* 1. BIG TWO-BUTTON HERO: [🚨 EMERGENCY] and [📋 COMPLAINT] */}
      <div className="grid grid-cols-2 gap-3">
        
        {/* EMERGENCY HERO BUTTON */}
        <button
          onClick={handleEmergencyClick}
          className="relative overflow-hidden bg-gradient-to-br from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white p-4 rounded-3xl shadow-lg shadow-red-500/25 border border-red-500/30 flex flex-col justify-between h-36 transition-transform active:scale-95 text-left group"
        >
          <div className="flex items-center justify-between w-full">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-xs">
              <AlertOctagon className="w-6 h-6 text-white animate-bounce" />
            </div>
            <span className="px-2 py-0.5 rounded-full bg-black/30 text-white font-mono text-[9px] uppercase font-bold tracking-wider">
              PRIORITY 1
            </span>
          </div>

          <div>
            <div className="font-black text-base tracking-tight leading-none uppercase">
              🚨 EMERGENCY
            </div>
            <p className="text-[11px] text-red-100 font-medium mt-1 leading-tight">
              108 Ambulance, crash, fire & police
            </p>
          </div>
        </button>

        {/* COMPLAINT HERO BUTTON */}
        <button
          onClick={handleComplaintClick}
          className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white p-4 rounded-3xl shadow-lg shadow-blue-500/20 border border-blue-400/30 flex flex-col justify-between h-36 transition-transform active:scale-95 text-left group"
        >
          <div className="flex items-center justify-between w-full">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-xs">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <span className="px-2 py-0.5 rounded-full bg-black/30 text-white font-mono text-[9px] uppercase font-bold tracking-wider">
              CIVIC TICKET
            </span>
          </div>

          <div>
            <div className="font-black text-base tracking-tight leading-none uppercase">
              📋 COMPLAINT
            </div>
            <p className="text-[11px] text-blue-100 font-medium mt-1 leading-tight">
              Potholes, sewage, water & streetlights
            </p>
          </div>
        </button>

      </div>

      {/* 2. ACTIVE TICKETS STRIP & STREAK COUNTER */}
      <div className="bg-white border border-slate-200 p-3.5 rounded-2xl shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center">
            <Flame className="w-5 h-5 text-amber-600 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-black text-xs text-slate-900 font-mono">
                {streakDays || 42} Days Solved Streak
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              <strong>{solvedCount || 42} issues resolved</strong> this month
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="px-2.5 py-1 rounded-xl bg-blue-50 text-blue-700 font-mono text-xs font-bold inline-block border border-blue-200">
            {pendingCount || 3} Pending
          </span>
        </div>
      </div>

      {/* 3. MINI LIVE MAP PREVIEW OF NEARBY INCIDENTS */}
      <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-sm space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <MapPin className="w-4 h-4 text-blue-600" />
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-900">
              Nearby Incidents Radar
            </h3>
          </div>
          <button
            onClick={() => onNavigate && onNavigate('map')}
            className="text-[11px] font-bold text-blue-600 hover:underline flex items-center space-x-0.5"
          >
            <span>Explore GIS Map</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mini Map Graphic / Live Pin Bar */}
        <div 
          onClick={() => onNavigate && onNavigate('map')}
          className="relative h-28 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 cursor-pointer group"
        >
          {/* Subtle Grid Texture */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#2563eb_1px,transparent_1px)] [background-size:12px_12px]"></div>

          {/* Chennai Central Radar Center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full border border-blue-500/30 animate-ping absolute"></div>
            <div className="w-16 h-16 rounded-full border border-blue-500/50 flex items-center justify-center bg-blue-50/80 shadow-sm">
              <span className="text-[9px] font-mono font-bold text-blue-700">Anna Nagar</span>
            </div>
          </div>

          {/* Incident Pins on Mini Map */}
          <div className="absolute top-4 left-6 flex items-center space-x-1 bg-red-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-md animate-bounce">
            <span>🚨 Crash</span>
          </div>
          <div className="absolute bottom-4 right-8 flex items-center space-x-1 bg-amber-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-md">
            <span>⚠️ Road Hazard</span>
          </div>

          <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-xs text-slate-700 border border-slate-200 text-[9px] font-mono shadow-xs">
            {incidents.length || 4} active geocoded signals in 5 km
          </div>
        </div>
      </div>

      {/* 4. RECENT ACTIVITY FEED (Autonomous Multi-Agent Logs) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-sm space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <Cpu className="w-4 h-4 text-indigo-600" />
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-900">
              Agent Swarm Activity Feed
            </h3>
          </div>
          <button
            onClick={() => onNavigate && onNavigate('telemetry')}
            className="text-[11px] font-bold text-indigo-600 hover:underline flex items-center space-x-0.5"
          >
            <span>Telemetry</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2">
          {recentLogs.map((log) => (
            <div
              key={log.id}
              className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1"
            >
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="font-bold text-slate-800 flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block mr-1"></span>
                  {log.agent ? log.agent.replace('Agent', '') : 'Agent-01'}
                </span>
                <span className="text-slate-400">{log.timestamp}</span>
              </div>
              <p className="text-[11px] text-slate-700 leading-snug font-medium line-clamp-2">
                {log.message}
              </p>
              {log.linkedIncidentId && (
                <span className="inline-block text-[9px] font-mono font-bold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                  Ref #{log.linkedIncidentId}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
