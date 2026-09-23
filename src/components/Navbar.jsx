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
  Layers,
  ChevronDown
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const { 
    language, 
    setLanguage, 
    openGeoCam, 
    openCitizenSignalModal,
    triggerEmergencyModal,
    simulateHeavyRain,
    selectedRegion, 
    setSelectedRegion,
    n8nConfig
  } = useCivicStore();

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const regions = [
    'Tamil Nadu',
    'Global',
    'India',
    'Chennai',
    'Coimbatore',
    'Madurai',
    'Salem',
    'Tiruchirappalli'
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#D9E2EC] px-4 py-2.5 shadow-sm">
      <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-3">
        
        {/* Left Brand & System Status */}
        <div className="flex items-center justify-between w-full lg:w-auto">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('map')}>
            <div className="w-9 h-9 rounded-xl bg-[#0B2E59] text-white flex items-center justify-center font-extrabold shadow-sm">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-extrabold text-lg tracking-tight text-[#0B2E59]">
                  CIVIC<span className="text-[#1769E0]">LOOP</span>
                </h1>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#EAF1F8] text-[#0B2E59] border border-[#D9E2EC]">
                  Social Incident Engine
                </span>
              </div>
              <p className="text-[11px] text-[#52616B] font-mono">
                Closed-Loop Incident Response Command Center
              </p>
            </div>
          </div>

          {/* System Online Badge & Clock (Mobile/Tablet) */}
          <div className="flex lg:hidden items-center space-x-2 text-xs font-mono">
            <span className="w-2.5 h-2.5 rounded-full bg-[#16803C] animate-pulse"></span>
            <span className="text-[#16803C] font-semibold">Swarm Online</span>
          </div>
        </div>

        {/* Center: System Status, Live Time & Region Selector */}
        <div className="flex items-center space-x-4 overflow-x-auto max-w-full pb-1 lg:pb-0 scrollbar-none">
          
          {/* Swarm Status Indicator */}
          <div className="hidden lg:flex items-center space-x-2 px-3 py-1 rounded-full bg-[#EAF7EE] border border-[#16803C]/20 text-xs font-mono">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16803C] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#16803C]"></span>
            </span>
            <span className="font-bold text-[#16803C]">Autonomous Swarm Online</span>
          </div>

          {/* Live Date & Time Clock */}
          <div className="hidden xl:flex items-center space-x-1.5 text-xs font-mono text-[#52616B] px-2.5 py-1 bg-[#F1F5F9] rounded-lg border border-[#D9E2EC]">
            <Clock className="w-3.5 h-3.5 text-[#1769E0]" />
            <span>{currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
            <span className="font-bold text-[#14213D]">{currentTime.toLocaleTimeString()}</span>
          </div>

          {/* Simulation Mode Badge */}
          {n8nConfig.simulationMode && (
            <span className="px-2.5 py-0.5 rounded-md bg-[#FFF5DF] text-[#C97700] border border-[#C97700]/30 font-mono text-[11px] font-bold shrink-0">
              SIMULATION MODE
            </span>
          )}

          {/* Navigation Tabs */}
          <nav className="flex items-center bg-[#F1F5F9] p-1 rounded-xl border border-[#D9E2EC] text-xs font-semibold">
            <button
              onClick={() => setActiveTab('map')}
              className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all ${
                activeTab === 'map' ? 'bg-[#1769E0] text-white shadow-sm' : 'text-[#52616B] hover:text-[#14213D]'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Map</span>
            </button>
            <button
              onClick={() => setActiveTab('tickets')}
              className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all ${
                activeTab === 'tickets' ? 'bg-[#1769E0] text-white shadow-sm' : 'text-[#52616B] hover:text-[#14213D]'
              }`}
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>Incidents</span>
            </button>
            <button
              onClick={() => setActiveTab('agents')}
              className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all ${
                activeTab === 'agents' ? 'bg-[#1769E0] text-white shadow-sm' : 'text-[#52616B] hover:text-[#14213D]'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Agents</span>
            </button>
            <button
              onClick={() => setActiveTab('telemetry')}
              className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all ${
                activeTab === 'telemetry' ? 'bg-[#1769E0] text-white shadow-sm' : 'text-[#52616B] hover:text-[#14213D]'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Telemetry</span>
            </button>
          </nav>
        </div>

        {/* Right Primary Action Buttons */}
        <div className="flex items-center space-x-2 w-full lg:w-auto justify-end">
          
          {/* Action 1: Simulate Heavy Rain */}
          <button
            onClick={simulateHeavyRain}
            title="Trigger Weather Risk Agent simulation"
            className="px-3 py-1.5 rounded-xl border border-[#D9E2EC] bg-white hover:bg-[#EAF1F8] text-[#14213D] text-xs font-semibold flex items-center space-x-1.5 transition-all"
          >
            <CloudRain className="w-4 h-4 text-[#0EA5C6]" />
            <span className="hidden sm:inline">Simulate Heavy Rain</span>
          </button>

          {/* Action 2: Submit Citizen Signal */}
          <button
            onClick={openCitizenSignalModal}
            className="px-3.5 py-1.5 rounded-xl bg-[#1769E0] hover:bg-[#1253B3] text-white font-bold text-xs shadow-sm flex items-center space-x-1.5 transition-all active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Submit Citizen Signal</span>
          </button>

          {/* Action 3: Report Emergency (Red outline/fill) */}
          <button
            onClick={() => triggerEmergencyModal({ lat: 13.0827, long: 80.2707 })}
            className="px-3.5 py-1.5 rounded-xl bg-[#FFF0F0] hover:bg-[#C62828] text-[#C62828] hover:text-white font-extrabold text-xs border border-[#C62828]/40 shadow-sm flex items-center space-x-1.5 transition-all active:scale-95"
          >
            <AlertOctagon className="w-4 h-4" />
            <span>Report Emergency</span>
          </button>

          {/* Tamil / English Language Switcher */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'ta' : 'en')}
            className="px-2.5 py-1.5 rounded-xl bg-[#F1F5F9] hover:bg-[#EAF1F8] text-[#0B2E59] font-mono text-xs border border-[#D9E2EC] font-bold"
          >
            {language === 'en' ? 'தமிழ்' : 'ENG'}
          </button>

          {/* Settings Modal */}
          <button
            onClick={() => setActiveTab('n8n-config')}
            className="p-1.5 rounded-xl bg-[#F1F5F9] hover:bg-[#EAF1F8] text-[#52616B] border border-[#D9E2EC]"
            title="Configure n8n Account Webhooks"
          >
            <Settings className="w-4 h-4" />
          </button>

        </div>
      </div>
    </header>
  );
}
