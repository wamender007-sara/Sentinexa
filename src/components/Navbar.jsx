import React, { useState, useEffect } from 'react';
import { useCivicStore } from '../store/useCivicStore';
import { 
  ShieldCheck, 
  AlertOctagon, 
  PlusCircle, 
  CloudRain, 
  Clock, 
  Globe, 
  Settings, 
  Ticket, 
  Cpu, 
  Activity,
  Camera
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const { 
    language, 
    setLanguage, 
    openGeoCam,
    openCitizenSignalModal,
    triggerEmergencyModal,
    simulateHeavyRain,
    n8nConfig
  } = useCivicStore();

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="sticky top-0 z-[2000] bg-white border-b border-[#D9E2EC] shadow-sm select-none">
      <div className="max-w-[1700px] mx-auto px-4 py-2 flex flex-col md:flex-row items-center justify-between gap-2.5">
        
        {/* Left Section: Brand & Swarm Status */}
        <div className="flex items-center justify-between w-full md:w-auto space-x-3 shrink-0">
          <div 
            className="flex items-center space-x-2.5 cursor-pointer hover:opacity-90 transition-opacity" 
            onClick={() => setActiveTab('map')}
          >
            <div className="w-9 h-9 rounded-xl bg-[#0B2E59] text-white flex items-center justify-center font-extrabold shadow-sm shrink-0">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-black text-lg tracking-tight text-[#0B2E59]">
                  CIVIC<span className="text-[#1769E0]">LOOP</span>
                </span>
                <span className="hidden sm:inline text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#EAF1F8] text-[#0B2E59] border border-[#D9E2EC]">
                  Incident Engine
                </span>
              </div>
              <p className="text-[10px] text-[#52616B] font-mono leading-none hidden sm:block">
                Command Center & Dispatch
              </p>
            </div>
          </div>

          {/* Swarm Online Status Indicator */}
          <div className="flex items-center space-x-2 px-2.5 py-1 rounded-full bg-[#EAF7EE] border border-[#16803C]/20 text-[11px] font-mono shrink-0">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16803C] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#16803C]"></span>
            </span>
            <span className="font-bold text-[#16803C] whitespace-nowrap">Swarm Online</span>
          </div>

          {/* Simulation Mode Badge */}
          {n8nConfig.simulationMode && (
            <span className="hidden xl:inline px-2 py-0.5 rounded-md bg-[#FFF5DF] text-[#C97700] border border-[#C97700]/30 font-mono text-[10px] font-bold shrink-0">
              SIMULATION MODE
            </span>
          )}
        </div>

        {/* Center Section: Navigation Tabs */}
        <nav className="flex items-center bg-[#F1F5F9] p-1 rounded-xl border border-[#D9E2EC] text-xs font-semibold shrink-0">
          <button
            onClick={() => setActiveTab('map')}
            className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all whitespace-nowrap ${
              activeTab === 'map' ? 'bg-[#1769E0] text-white shadow-xs font-bold' : 'text-[#52616B] hover:text-[#14213D]'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Live Map</span>
          </button>
          <button
            onClick={() => setActiveTab('tickets')}
            className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all whitespace-nowrap ${
              activeTab === 'tickets' ? 'bg-[#1769E0] text-white shadow-xs font-bold' : 'text-[#52616B] hover:text-[#14213D]'
            }`}
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>Incidents</span>
          </button>
          <button
            onClick={() => setActiveTab('agents')}
            className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all whitespace-nowrap ${
              activeTab === 'agents' ? 'bg-[#1769E0] text-white shadow-xs font-bold' : 'text-[#52616B] hover:text-[#14213D]'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Agents</span>
          </button>
          <button
            onClick={() => setActiveTab('telemetry')}
            className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all whitespace-nowrap ${
              activeTab === 'telemetry' ? 'bg-[#1769E0] text-white shadow-xs font-bold' : 'text-[#52616B] hover:text-[#14213D]'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Telemetry</span>
          </button>
        </nav>

        {/* Right Section: Primary Actions & Utilities */}
        <div className="flex items-center space-x-2 shrink-0">
          
          {/* Action 1: Simulate Heavy Rain */}
          <button
            onClick={simulateHeavyRain}
            title="Simulate Heavy Rain flood risk event"
            className="px-2.5 py-1.5 rounded-xl border border-[#D9E2EC] bg-white hover:bg-[#EAF1F8] text-[#14213D] text-xs font-semibold flex items-center space-x-1.5 transition-colors shrink-0"
          >
            <CloudRain className="w-3.5 h-3.5 text-[#0EA5C6]" />
            <span className="hidden lg:inline text-[11px]">Simulate Rain</span>
          </button>

          {/* Action 2: GEO-CAM Button */}
          <button
            onClick={openGeoCam}
            title="Open Geo-Cam with live GPS Lat/Long watermark"
            className="px-3 py-1.5 rounded-xl bg-[#0B2E59] hover:bg-[#14213D] text-white font-extrabold text-xs shadow-xs flex items-center space-x-1.5 transition-all active:scale-95 shrink-0"
          >
            <Camera className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span className="whitespace-nowrap">GEO-CAM</span>
          </button>

          {/* Action 3: Submit Citizen Signal */}
          <button
            onClick={openCitizenSignalModal}
            className="px-3 py-1.5 rounded-xl bg-[#1769E0] hover:bg-[#1253B3] text-white font-bold text-xs shadow-xs flex items-center space-x-1.5 transition-all active:scale-95 shrink-0"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span className="whitespace-nowrap">Submit Signal</span>
          </button>

          {/* Action 3: Report Emergency */}
          <button
            onClick={() => triggerEmergencyModal({ lat: 13.0604, long: 80.2496 })}
            className="px-3 py-1.5 rounded-xl bg-[#FFF0F0] hover:bg-[#C62828] text-[#C62828] hover:text-white font-extrabold text-xs border border-[#C62828]/40 shadow-xs flex items-center space-x-1.5 transition-all active:scale-95 shrink-0"
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            <span className="whitespace-nowrap">Report Emergency</span>
          </button>

          {/* Tamil / English Toggle */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'ta' : 'en')}
            className="px-2 py-1 rounded-xl bg-[#F1F5F9] hover:bg-[#EAF1F8] text-[#0B2E59] font-mono text-xs border border-[#D9E2EC] font-bold shrink-0"
            title="Toggle Language"
          >
            {language === 'en' ? 'தமிழ்' : 'ENG'}
          </button>

          {/* Settings Modal */}
          <button
            onClick={() => setActiveTab('n8n-config')}
            className="p-1.5 rounded-xl bg-[#F1F5F9] hover:bg-[#EAF1F8] text-[#52616B] border border-[#D9E2EC] shrink-0"
            title="Configure n8n Account Webhooks"
          >
            <Settings className="w-4 h-4" />
          </button>

        </div>
      </div>
    </header>
  );
}
