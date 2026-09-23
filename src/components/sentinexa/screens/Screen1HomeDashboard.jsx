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
  Cpu
} from 'lucide-react';

export default function Screen1HomeDashboard({ onNavigate, onLaunchEmergency, onLaunchComplaint }) {
  const { 
    incidents, 
    streakDays, 
    solvedCount, 
    agentLogs, 
    language,
    openGeoCam
  } = useCivicStore();

  const pendingCount = incidents.filter(i => i.status !== 'SOLVED').length;
  const recentLogs = agentLogs.slice(0, 4);

  return (
    <div className="flex flex-col space-y-4 pb-20 font-sans text-[#14213D]">
      
      {/* Top Welcome & Agency Bar */}
      <div className="flex items-center justify-between px-1">
        <div>
          <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-[#52616B] flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-[#16803C] animate-pulse inline-block mr-1"></span>
            Greater Chennai & TN Civic Grid
          </span>
          <h2 className="text-xl font-black tracking-tight text-[#0B2E59]">
            {language === 'ta' ? 'அவசர & நகர்ப்புற மையம்' : 'Citizen Incident Command'}
          </h2>
        </div>

        <div className="p-2 rounded-2xl bg-[#EAF1F8] border border-[#D9E2EC] text-[#0B2E59]">
          <ShieldCheck className="w-5 h-5 text-[#1769E0]" />
        </div>
      </div>

      {/* 1. BIG TWO-BUTTON HERO: [🚨 EMERGENCY] and [📋 COMPLAINT] */}
      <div className="grid grid-cols-2 gap-3">
        
        {/* EMERGENCY HERO BUTTON */}
        <button
          onClick={onLaunchEmergency}
          className="relative overflow-hidden bg-gradient-to-br from-[#C62828] to-[#991B1B] hover:from-[#B71C1C] hover:to-[#7F1D1D] text-white p-4 rounded-3xl shadow-lg shadow-[#C62828]/25 border border-red-500/40 flex flex-col justify-between h-36 transition-transform active:scale-95 text-left group"
        >
          <div className="flex items-center justify-between w-full">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-xs">
              <AlertOctagon className="w-6 h-6 text-white animate-bounce" />
            </div>
            <span className="px-2 py-0.5 rounded-full bg-black/25 text-white font-mono text-[9px] uppercase font-bold tracking-wider">
              PRIORITY 1
            </span>
          </div>

          <div>
            <div className="font-black text-lg tracking-tight leading-none uppercase">
              🚨 EMERGENCY
            </div>
            <p className="text-[11px] text-red-100 font-medium mt-1 leading-tight">
              Life-threat, crash, fire & ambulance
            </p>
          </div>
        </button>

        {/* COMPLAINT HERO BUTTON */}
        <button
          onClick={onLaunchComplaint}
          className="relative overflow-hidden bg-gradient-to-br from-[#1769E0] to-[#0B2E59] hover:from-[#1253B3] hover:to-[#081F3D] text-white p-4 rounded-3xl shadow-lg shadow-[#1769E0]/20 border border-blue-400/30 flex flex-col justify-between h-36 transition-transform active:scale-95 text-left group"
        >
          <div className="flex items-center justify-between w-full">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-xs">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <span className="px-2 py-0.5 rounded-full bg-black/25 text-white font-mono text-[9px] uppercase font-bold tracking-wider">
              CIVIC TICKET
            </span>
          </div>

          <div>
            <div className="font-black text-lg tracking-tight leading-none uppercase">
              📋 COMPLAINT
            </div>
            <p className="text-[11px] text-blue-100 font-medium mt-1 leading-tight">
              Drain, water leak, road hazard & EB
            </p>
          </div>
        </button>

      </div>

      {/* 2. ACTIVE TICKETS STRIP & STREAK COUNTER */}
      <div className="bg-white border border-[#D9E2EC] p-3.5 rounded-2xl shadow-xs flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-[#FFF5DF] border border-[#C97700]/30 flex items-center justify-center">
            <Flame className="w-5 h-5 text-[#C97700] animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-sm text-[#14213D] font-mono">
                {streakDays} Days Solved Streak
              </span>
            </div>
            <p className="text-[11px] text-[#52616B]">
              <strong>{solvedCount} issues resolved</strong> this month
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="px-2.5 py-1 rounded-xl bg-[#EAF1F8] text-[#1769E0] font-mono text-xs font-bold inline-block">
            {pendingCount} Pending
          </span>
        </div>
      </div>

      {/* 3. MINI LIVE MAP PREVIEW OF NEARBY INCIDENTS */}
      <div className="bg-white border border-[#D9E2EC] rounded-2xl p-3.5 shadow-xs space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <MapPin className="w-4 h-4 text-[#1769E0]" />
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-[#14213D]">
              Nearby Incidents Radar
            </h3>
          </div>
          <button
            onClick={() => onNavigate('map')}
            className="text-[11px] font-bold text-[#1769E0] hover:underline flex items-center space-x-0.5"
          >
            <span>Explore GIS Map</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mini Map Graphic / Live Pin Bar */}
        <div 
          onClick={() => onNavigate('map')}
          className="relative h-28 rounded-xl overflow-hidden bg-[#0d1e33] border border-[#D9E2EC] cursor-pointer group"
        >
          {/* Simulated Satellite Grid Texture */}
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#1769E0_1px,transparent_1px)] [background-size:12px_12px]"></div>

          {/* Chennai Central Radar Center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full border border-cyan-400/30 animate-ping absolute"></div>
            <div className="w-16 h-16 rounded-full border border-cyan-400/50 flex items-center justify-center bg-cyan-950/40">
              <span className="text-[9px] font-mono font-bold text-cyan-300">Anna Nagar</span>
            </div>
          </div>

          {/* Incident Pins on Mini Map */}
          <div className="absolute top-4 left-8 flex items-center space-x-1 bg-red-600/90 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-md animate-bounce">
            <span>🚨 Crash</span>
          </div>
          <div className="absolute bottom-4 right-10 flex items-center space-x-1 bg-amber-600/90 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-md">
            <span>⚠️ Drain Leak</span>
          </div>

          <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-white text-[9px] font-mono">
            {incidents.length} active geocoded signals within 10 km
          </div>
        </div>
      </div>

      {/* 4. RECENT ACTIVITY FEED (Autonomous Multi-Agent Logs) */}
      <div className="bg-white border border-[#D9E2EC] rounded-2xl p-3.5 shadow-xs space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <Cpu className="w-4 h-4 text-[#6D4CCB]" />
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-[#14213D]">
              Agent Swarm Activity Feed
            </h3>
          </div>
          <button
            onClick={() => onNavigate('telemetry')}
            className="text-[11px] font-bold text-[#6D4CCB] hover:underline flex items-center space-x-0.5"
          >
            <span>Telemetry</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2">
          {recentLogs.map((log) => (
            <div
              key={log.id}
              className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#D9E2EC] text-xs space-y-1"
            >
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="font-bold text-[#0B2E59] flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#16803C] inline-block mr-1"></span>
                  {log.agent.replace('Agent', '')}
                </span>
                <span className="text-[#52616B]">{log.timestamp}</span>
              </div>
              <p className="text-[11px] text-[#14213D] leading-snug font-medium line-clamp-2">
                {log.message}
              </p>
              {log.linkedIncidentId && (
                <span className="inline-block text-[9px] font-mono font-bold text-[#1769E0] bg-[#EAF1F8] px-1.5 py-0.2 rounded">
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
