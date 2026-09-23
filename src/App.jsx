import React, { useState } from 'react';
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
  const [activeTab, setActiveTab] = useState('map');
  const { selectedIncident, setSelectedIncident } = useCivicStore();

  const handleSelectTicketFromMap = (ticket) => {
    setSelectedIncident(ticket);
    setActiveTab('tickets');
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] text-[#14213D] flex flex-col font-sans selection:bg-[#1769E0] selection:text-white">
      {/* Top Navigation */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Workspace */}
      <main className="flex-1 w-full relative">
        {activeTab === 'map' && (
          <GISMap onSelectTicket={handleSelectTicketFromMap} />
        )}

        {activeTab === 'tickets' && (
          <TicketTracker selectedTicket={selectedIncident} onSelectTicket={setSelectedIncident} />
        )}

        {activeTab === 'agents' && (
          <AgentEcosystem />
        )}

        {activeTab === 'telemetry' && (
          <TelemetryDashboard />
        )}

        {activeTab === 'n8n-config' && (
          <N8nConfigModal />
        )}
      </main>

      {/* Modals & Capture Overlays */}
      <GeoCamModal />
      <EmergencyPanel />
      <ComplaintModal />
      <CitizenReportModal />
    </div>
  );
}
