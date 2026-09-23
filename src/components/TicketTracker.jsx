import React, { useState } from 'react';
import { useCivicStore } from '../store/useCivicStore';
import { translationService } from '../services/translationService';
import { 
  Ticket, 
  Search, 
  AlertOctagon, 
  AlertTriangle, 
  CloudRain, 
  CheckCircle2, 
  Clock, 
  Flame, 
  ChevronRight, 
  Languages, 
  RefreshCw, 
  Check,
  Send,
  UserCheck,
  RotateCcw,
  ShieldCheck,
  ArrowUpRight,
  TrendingUp,
  Activity
} from 'lucide-react';

export default function TicketTracker({ selectedTicket, onSelectTicket }) {
  const { 
    incidents, 
    statusFilter, 
    setStatusFilter, 
    resolveIncident, 
    streakDays, 
    solvedCount,
    triggerAutonomousRetries,
    warpTimeForEscalationDemo,
    triggerEmergencyModal,
    language 
  } = useCivicStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeQueueTab, setActiveQueueTab] = useState('all'); // 'all' | 'EMERGENCY' | 'high-severity' | 'awaiting' | 'dispatched'
  const [selectedIncidentDetail, setSelectedIncidentDetail] = useState(selectedTicket || null);
  const [activeLangTab, setActiveLangTab] = useState('ta');

  // Filter queue items
  const filteredQueue = incidents.filter(inc => {
    if (activeQueueTab === 'EMERGENCY' && inc.type !== 'EMERGENCY') return false;
    if (activeQueueTab === 'high-severity' && (inc.severity || 3) < 4) return false;
    if (activeQueueTab === 'awaiting' && inc.status !== 'PENDING_ACK' && inc.status !== 'VERIFIED') return false;
    if (activeQueueTab === 'dispatched' && inc.status !== 'DISPATCHED') return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        inc.title.toLowerCase().includes(q) ||
        inc.id.toLowerCase().includes(q) ||
        inc.department.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getLeftBorderColor = (inc) => {
    if (inc.type === 'EMERGENCY' || inc.severity >= 5) return 'border-l-4 border-l-[#C62828]';
    if (inc.type === 'WEATHER') return 'border-l-4 border-l-[#0EA5C6]';
    if (inc.status === 'SOLVED') return 'border-l-4 border-l-[#16803C]';
    return 'border-l-4 border-l-[#C97700]';
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'DISPATCHED':
        return <span className="px-2.5 py-0.5 rounded-full bg-[#EAF1F8] text-[#1769E0] border border-[#1769E0]/20 text-[10px] font-mono font-bold uppercase">Dispatched</span>;
      case 'PENDING_ACK':
        return <span className="px-2.5 py-0.5 rounded-full bg-[#FFF5DF] text-[#C97700] border border-[#C97700]/30 text-[10px] font-mono font-bold uppercase animate-pulse">Pending Ack (2-3D)</span>;
      case 'ESCALATED':
        return <span className="px-2.5 py-0.5 rounded-full bg-[#FFF0F0] text-[#C62828] border border-[#C62828]/30 text-[10px] font-mono font-bold uppercase">Tier 2 Escalated</span>;
      case 'SOLVED':
        return <span className="px-2.5 py-0.5 rounded-full bg-[#EAF7EE] text-[#16803C] border border-[#16803C]/30 text-[10px] font-mono font-bold uppercase">Resolved</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full bg-[#F1F5F9] text-[#0B2E59] border border-[#D9E2EC] text-[10px] font-mono font-bold uppercase">Verified</span>;
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto p-4 sm:p-6 space-y-6 font-sans animate-fade-in">
      
      {/* Page Title Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-[#D9E2EC] p-6 rounded-2xl shadow-xs">
        <div>
          <h2 className="text-2xl font-extrabold text-[#14213D] tracking-tight">
            City Incident Overview
          </h2>
          <p className="text-sm text-[#52616B] mt-0.5">
            Monitor, verify, dispatch, and resolve civic and emergency incidents across the city.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono">
          <span className="text-[#52616B]">Last updated 12 seconds ago</span>
          <button
            onClick={triggerAutonomousRetries}
            className="px-3 py-1.5 rounded-xl bg-[#F1F5F9] hover:bg-[#EAF1F8] text-[#1769E0] font-bold border border-[#D9E2EC] flex items-center space-x-1"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#1769E0]" />
            <span>Scan 2-3D Retries</span>
          </button>
          <button
            onClick={warpTimeForEscalationDemo}
            className="px-3 py-1.5 rounded-xl bg-[#FFF5DF] hover:bg-[#FFF0F0] text-[#C97700] font-bold border border-[#C97700]/30 flex items-center space-x-1"
          >
            <Clock className="w-3.5 h-3.5 text-[#C97700]" />
            <span>+3 Days Demo</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        
        <div className="bg-white border border-[#D9E2EC] p-3.5 rounded-2xl shadow-xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#52616B]">Active Incidents</span>
          <div className="text-xl font-extrabold text-[#14213D] font-mono">{incidents.length}</div>
          <span className="text-[10px] text-[#16803C] font-semibold">Live in pipeline</span>
        </div>

        <div className="bg-white border border-[#D9E2EC] p-3.5 rounded-2xl shadow-xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#C62828]">Emergency SOS</span>
          <div className="text-xl font-extrabold text-[#C62828] font-mono">
            {incidents.filter(i => i.type === 'EMERGENCY').length}
          </div>
          <span className="text-[10px] text-[#C62828] font-semibold">Priority 1 alert</span>
        </div>

        <div className="bg-white border border-[#D9E2EC] p-3.5 rounded-2xl shadow-xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#C97700]">Civic Issues</span>
          <div className="text-xl font-extrabold text-[#C97700] font-mono">
            {incidents.filter(i => i.type === 'CIVIC').length}
          </div>
          <span className="text-[10px] text-[#52616B]">Water, EB, Drain</span>
        </div>

        <div className="bg-white border border-[#D9E2EC] p-3.5 rounded-2xl shadow-xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#0EA5C6]">Weather Hazards</span>
          <div className="text-xl font-extrabold text-[#0EA5C6] font-mono">
            {incidents.filter(i => i.type === 'WEATHER').length}
          </div>
          <span className="text-[10px] text-[#0EA5C6] font-semibold">Flood surge</span>
        </div>

        <div className="bg-white border border-[#D9E2EC] p-3.5 rounded-2xl shadow-xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#52616B]">Awaiting Action</span>
          <div className="text-xl font-extrabold text-[#C97700] font-mono">
            {incidents.filter(i => i.status === 'PENDING_ACK').length}
          </div>
          <span className="text-[10px] text-[#C97700] font-semibold">2-3D retry loop</span>
        </div>

        <div className="bg-white border border-[#D9E2EC] p-3.5 rounded-2xl shadow-xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#52616B]">Verified Accuracy</span>
          <div className="text-xl font-extrabold text-[#16803C] font-mono">94.2%</div>
          <span className="text-[10px] text-[#16803C] font-semibold flex items-center">
            <TrendingUp className="w-2.5 h-2.5 mr-0.5" /> +2.4% vs last week
          </span>
        </div>

        <div className="bg-white border border-[#D9E2EC] p-3.5 rounded-2xl shadow-xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#52616B]">Avg Response Time</span>
          <div className="text-xl font-extrabold text-[#1769E0] font-mono">14m</div>
          <span className="text-[10px] text-[#1769E0] font-semibold">Dispatch latency</span>
        </div>

        <div className="bg-white border border-[#D9E2EC] p-3.5 rounded-2xl shadow-xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#52616B]">Resolved Streak</span>
          <div className="text-xl font-extrabold text-[#16803C] font-mono">{streakDays}d</div>
          <span className="text-[10px] text-[#16803C] font-semibold">{solvedCount} total solved</span>
        </div>

      </div>

      {/* Main Priority Queue & Dispatch Workspace */}
      <div className="bg-white border border-[#D9E2EC] rounded-2xl p-6 shadow-xs space-y-4">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#D9E2EC] pb-4">
          <div>
            <h3 className="text-base font-extrabold text-[#14213D]">
              Priority Incident Queue & Closed-Loop Dispatch
            </h3>
            <p className="text-xs text-[#52616B]">
              Real-time dispatch tracking, authority assignments, and formal grievance memos.
            </p>
          </div>

          {/* Queue Filter Tabs */}
          <div className="flex items-center space-x-1 overflow-x-auto max-w-full pb-1 md:pb-0 scrollbar-none text-xs font-semibold">
            {[
              { key: 'all', label: 'All Priority' },
              { key: 'EMERGENCY', label: 'Emergency' },
              { key: 'high-severity', label: 'High Severity' },
              { key: 'awaiting', label: 'Awaiting Action' },
              { key: 'dispatched', label: 'Dispatched' }
            ].map(t => (
              <button
                key={t.key}
                onClick={() => setActiveQueueTab(t.key)}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  activeQueueTab === t.key
                    ? 'bg-[#0B2E59] text-white font-bold shadow-xs'
                    : 'bg-[#F1F5F9] text-[#52616B] hover:text-[#14213D]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Incident Queue List */}
        <div className="space-y-4">
          {filteredQueue.map(inc => (
            <div
              key={inc.id}
              className={`bg-white border border-[#D9E2EC] rounded-2xl p-5 shadow-xs ${getLeftBorderColor(inc)} transition-all hover:border-[#1769E0]/40 space-y-4`}
            >
              
              {/* Header Info */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div className="flex items-center space-x-3">
                  <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-[#F1F5F9] text-[#0B2E59]">
                    #{inc.id}
                  </span>

                  <span className={`px-2.5 py-0.5 rounded-md font-mono text-[10px] font-bold uppercase ${
                    inc.severity >= 5 ? 'bg-[#FFF0F0] text-[#C62828]' : 'bg-[#FFF5DF] text-[#C97700]'
                  }`}>
                    Severity {inc.severity || 3}/5
                  </span>

                  {getStatusBadge(inc.status)}
                </div>

                <div className="flex items-center space-x-4 text-xs font-mono text-[#52616B]">
                  <span>Confidence: <strong className="text-[#16803C]">{inc.truthScore}%</strong></span>
                  <span>Signals: <strong className="text-[#1769E0]">{inc.corroboratingSignals || 4}</strong></span>
                  <span>Time: <strong className="text-[#14213D]">Recent</strong></span>
                </div>
              </div>

              {/* Title & Location */}
              <div>
                <h4 className="font-extrabold text-base text-[#14213D]">
                  {language === 'ta' && inc.tamilTitle ? inc.tamilTitle : inc.title}
                </h4>
                <p className="text-xs text-[#52616B] font-mono mt-0.5">
                  📍 {inc.address} • Department: <strong className="text-[#0B2E59]">{inc.department}</strong>
                </p>
              </div>

              {/* Closed-Loop Horizontal Progress Tracker */}
              <div className="pt-3 border-t border-[#D9E2EC]">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#52616B] mb-2 font-mono">
                  Closed-Loop Workflow Progress
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono overflow-x-auto pb-1 scrollbar-none">
                  {[
                    { step: 'Signal Received', done: true },
                    { step: 'Location Validated', done: true },
                    { step: 'Reports Clustered', done: true },
                    { step: 'Evidence Verified', done: true },
                    { step: 'Severity Scored', done: true },
                    { step: 'Action Dispatched', done: inc.status === 'DISPATCHED' || inc.status === 'SOLVED' },
                    { step: 'Resolution Checked', done: inc.status === 'SOLVED' }
                  ].map((s, idx) => (
                    <div key={idx} className="flex items-center space-x-1.5 shrink-0">
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        s.done ? 'bg-[#16803C] text-white' : 'bg-[#E2E8F0] text-[#94A3B8]'
                      }`}>
                        ✓
                      </span>
                      <span className={s.done ? 'text-[#14213D] font-bold' : 'text-[#94A3B8]'}>
                        {s.step}
                      </span>
                      {idx < 6 && <span className="text-[#CBD5E1] mx-1">→</span>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-[#D9E2EC] flex flex-wrap items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedIncidentDetail(inc)}
                  className="px-3 py-1.5 rounded-xl bg-[#F1F5F9] hover:bg-[#EAF1F8] text-[#0B2E59] font-bold text-xs border border-[#D9E2EC] flex items-center space-x-1"
                >
                  <Languages className="w-3.5 h-3.5 text-[#1769E0]" />
                  <span>View Official Grievance Memo</span>
                </button>

                <div className="flex items-center space-x-2">
                  {inc.type === 'EMERGENCY' && (
                    <button
                      onClick={() => triggerEmergencyModal({ lat: inc.lat, long: inc.long })}
                      className="px-3.5 py-1.5 rounded-xl bg-[#C62828] hover:bg-[#B71C1C] text-white font-bold text-xs shadow-xs"
                    >
                      Dispatch Nearest Ambulance
                    </button>
                  )}

                  {inc.status !== 'SOLVED' ? (
                    <button
                      onClick={() => resolveIncident(inc.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-[#16803C] hover:bg-[#12642E] text-white font-bold text-xs shadow-xs flex items-center space-x-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Mark Resolved</span>
                    </button>
                  ) : (
                    <span className="px-3 py-1 rounded-xl bg-[#EAF7EE] text-[#16803C] font-mono text-xs font-bold">
                      ✓ Resolution Verified
                    </span>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* Detail Modal for Grievance Memorandums */}
      {selectedIncidentDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#14213D]/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-[#D9E2EC] rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            
            <div className="px-6 py-4 bg-[#F8FAFC] border-b border-[#D9E2EC] flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-[#14213D] text-base">
                  Incident Reference: #{selectedIncidentDetail.id}
                </h3>
                <p className="text-xs text-[#52616B] font-mono">
                  {selectedIncidentDetail.department}
                </p>
              </div>

              <button
                onClick={() => setSelectedIncidentDetail(null)}
                className="p-2 rounded-xl bg-[#F1F5F9] hover:bg-[#EAF1F8] text-[#52616B] font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 bg-white">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#52616B] uppercase tracking-wider">
                  Bilingual Official Memorandum
                </span>

                <div className="flex bg-[#F1F5F9] p-1 rounded-xl border border-[#D9E2EC] text-xs font-semibold">
                  <button
                    onClick={() => setActiveLangTab('ta')}
                    className={`px-3 py-1 rounded-lg ${activeLangTab === 'ta' ? 'bg-[#1769E0] text-white' : 'text-[#52616B]'}`}
                  >
                    தமிழ் (Tamil)
                  </button>
                  <button
                    onClick={() => setActiveLangTab('en')}
                    className={`px-3 py-1 rounded-lg ${activeLangTab === 'en' ? 'bg-[#1769E0] text-white' : 'text-[#52616B]'}`}
                  >
                    English
                  </button>
                </div>
              </div>

              <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-[#D9E2EC] font-mono text-xs text-[#14213D] whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
                {activeLangTab === 'ta'
                  ? translationService.generateFormalGrievance(selectedIncidentDetail).tamil
                  : translationService.generateFormalGrievance(selectedIncidentDetail).english}
              </div>
            </div>

            <div className="px-6 py-4 bg-[#F8FAFC] border-t border-[#D9E2EC] flex justify-end">
              <button
                onClick={() => setSelectedIncidentDetail(null)}
                className="px-4 py-2 rounded-xl bg-[#1769E0] text-white font-bold text-xs"
              >
                Close Memo
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
