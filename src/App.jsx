import React, { useState } from 'react';
import SentinexaViewportBar from './components/sentinexa/SentinexaViewportBar';
import MobileAppContainer from './components/sentinexa/MobileAppContainer';
import DesktopCommandCenter from './components/sentinexa/DesktopCommandCenter';
import HeroPitchShowcase from './components/sentinexa/HeroPitchShowcase';

// Optional legacy full-web suite
import Navbar from './components/Navbar';
import GISMap from './components/GISMap';
import GeoCamModal from './components/GeoCamModal';
import EmergencyPanel from './components/EmergencyPanel';
import ComplaintModal from './components/ComplaintModal';
import CitizenReportModal from './components/CitizenReportModal';
import AgentEcosystem from './components/AgentEcosystem';
import TelemetryDashboard from './components/TelemetryDashboard';
import TicketTracker from './components/TicketTracker';
import N8nConfigModal from './components/N8nConfigModal';
import { useCivicStore } from './store/useCivicStore';

export default function App() {
  const [viewMode, setViewMode] = useState('mobile'); // 'mobile' | 'desktop' | 'pitch' | 'portal'
  const [activeTab, setActiveTab] = useState('map');
  const { selectedIncident, setSelectedIncident } = useCivicStore();

  const handleSelectTicketFromMap = (ticket) => {
    setSelectedIncident(ticket);
    setActiveTab('tickets');
  };

  return (
    <div className="min-h-screen bg-[#060a14] text-[#14213D] flex flex-col font-sans selection:bg-[#1769E0] selection:text-white overflow-x-hidden">
      {/* Universal Sentinexa Viewport / Breakpoint Switcher */}
      <SentinexaViewportBar activeMode={viewMode} onSelectMode={setViewMode} />

      {/* Main View Area */}
      <main className="flex-1 w-full flex flex-col">
        {viewMode === 'mobile' && (
          <div className="flex-1 w-full flex flex-col items-center justify-center p-3 sm:p-6 bg-gradient-to-b from-[#060a14] via-[#090f1f] to-[#070b14]">
            {/* Quick Context helper banner */}
            <div className="mb-4 text-center max-w-md">
              <span className="text-[11px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-500/30 px-3 py-1 rounded-full">
                Interactive 375×812 Mobile Viewport
              </span>
              <p className="text-xs text-slate-400 mt-1">
                Tap bottom tabs (Home, GIS Map, Geo-Cam, Tickets, Agents, Config) or launch Emergency / Complaint flows.
              </p>
            </div>
            <MobileAppContainer />
          </div>
        )}

        {viewMode === 'desktop' && (
          <div className="flex-1 w-full h-[calc(100vh-53px)] min-h-[700px]">
            <DesktopCommandCenter />
          </div>
        )}

        {viewMode === 'pitch' && (
          <div className="flex-1 w-full">
            <HeroPitchShowcase />
          </div>
        )}

        {viewMode === 'portal' && (
          <div className="flex-1 w-full flex flex-col bg-[#F7F9FC]">
            <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="flex-1 w-full relative">
              {activeTab === 'map' && <GISMap onSelectTicket={handleSelectTicketFromMap} />}
              {activeTab === 'tickets' && (
                <TicketTracker selectedTicket={selectedIncident} onSelectTicket={setSelectedIncident} />
              )}
              {activeTab === 'agents' && <AgentEcosystem />}
              {activeTab === 'telemetry' && <TelemetryDashboard />}
              {activeTab === 'n8n-config' && <N8nConfigModal />}
            </div>
            <GeoCamModal />
            <EmergencyPanel />
            <ComplaintModal />
            <CitizenReportModal />
          </div>
        )}
      </main>
    </div>
  );
}
