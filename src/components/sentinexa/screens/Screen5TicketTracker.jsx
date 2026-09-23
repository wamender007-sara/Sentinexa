import React, { useState } from 'react';
import { useCivicStore } from '../../../store/useCivicStore';
import { translationService } from '../../../services/translationService';
import { 
  Ticket, 
  Search, 
  AlertOctagon, 
  FileText, 
  Clock, 
  CheckCircle2, 
  ChevronRight, 
  ArrowLeft, 
  Languages, 
  ShieldCheck, 
  Cpu, 
  RefreshCw,
  Flame,
  Check
} from 'lucide-react';

export default function Screen5TicketTracker({ onSelectDetail }) {
  const { incidents, resolveIncident, streakDays, triggerAutonomousRetries } = useCivicStore();
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [activeLang, setActiveLang] = useState('ta');
  const [search, setSearch] = useState('');

  const filtered = incidents.filter(i => {
    if (!search) return true;
    const q = search.toLowerCase();
    return i.title.toLowerCase().includes(q) || i.id.toLowerCase().includes(q) || i.department.toLowerCase().includes(q);
  });

  const getStatusChip = (status) => {
    switch (status) {
      case 'DISPATCHED':
        return <span className="px-2 py-0.5 rounded-full bg-[#EAF1F8] text-[#1769E0] font-mono text-[10px] font-bold">Dispatched</span>;
      case 'PENDING_ACK':
        return <span className="px-2 py-0.5 rounded-full bg-[#FFF5DF] text-[#C97700] font-mono text-[10px] font-bold animate-pulse">Pending Ack</span>;
      case 'ESCALATED':
        return <span className="px-2 py-0.5 rounded-full bg-[#FFF0F0] text-[#C62828] font-mono text-[10px] font-bold">Tier 2 Escalated</span>;
      case 'SOLVED':
        return <span className="px-2 py-0.5 rounded-full bg-[#EAF7EE] text-[#16803C] font-mono text-[10px] font-bold">Resolved</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full bg-[#F1F5F9] text-[#0B2E59] font-mono text-[10px] font-bold">Verified</span>;
    }
  };

  return (
    <div className="flex flex-col space-y-4 pb-20 font-sans text-[#14213D] animate-fade-in">
      
      {/* Top Banner */}
      <div className="bg-white border border-[#D9E2EC] p-4 rounded-3xl shadow-xs flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase text-[#52616B]">SENTINEXA CIVIC LEDGER</span>
          <h3 className="font-extrabold text-base text-[#14213D]">Incident Ticket Tracker</h3>
        </div>
        <div className="flex items-center space-x-1.5 px-3 py-1 bg-[#FFF5DF] border border-[#C97700]/30 rounded-xl text-xs font-mono font-bold text-[#C97700]">
          <Flame className="w-3.5 h-3.5" />
          <span>{streakDays}d Streak</span>
        </div>
      </div>

      {selectedTicket ? (
        /* Ticket Timeline & Audit Detail View */
        <div className="bg-white border border-[#D9E2EC] p-5 rounded-3xl shadow-xs space-y-4 animate-fade-in">
          <div className="flex items-center justify-between border-b border-[#D9E2EC] pb-3">
            <button onClick={() => setSelectedTicket(null)} className="flex items-center space-x-1 text-xs font-bold text-[#1769E0]">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Tickets</span>
            </button>
            <span className="font-mono text-xs font-bold text-[#0B2E59]">#{selectedTicket.id}</span>
          </div>

          <div>
            <h4 className="font-black text-base text-[#14213D] leading-snug">
              {selectedTicket.title}
            </h4>
            <p className="text-xs text-[#52616B] font-mono mt-1">📍 {selectedTicket.address}</p>
          </div>

          {/* Auto-retry Countdown Indicator */}
          {selectedTicket.status !== 'SOLVED' && (
            <div className="p-3 bg-[#FFF5DF] border border-[#C97700]/30 rounded-2xl flex items-center justify-between text-xs font-mono">
              <div className="flex items-center space-x-2 text-[#C97700]">
                <Clock className="w-4 h-4" />
                <span className="font-bold">Autonomous Escalation Watcher:</span>
              </div>
              <span className="font-bold text-[#C62828] bg-white px-2 py-0.5 rounded-lg border border-[#C97700]/20">
                Auto-retry in 2 days
              </span>
            </div>
          )}

          {/* Full Agent Action Timeline: Scrape → Verify → Dispatch → Retry */}
          <div className="space-y-3 pt-2">
            <h5 className="font-extrabold text-xs uppercase tracking-wider text-[#52616B]">
              Autonomous Agent Lifecycle Timeline
            </h5>

            <div className="space-y-3 relative pl-4 border-l-2 border-[#D9E2EC] ml-2 text-xs">
              <div className="relative">
                <span className="absolute -left-[23px] top-0 w-3 h-3 rounded-full bg-[#1769E0] ring-4 ring-white"></span>
                <span className="font-bold text-[#0B2E59]">01. Signal Ingestion & Geotag</span>
                <p className="text-[11px] text-[#52616B]">Ingestion Agent parsed citizen coordinates and media evidence.</p>
              </div>

              <div className="relative">
                <span className="absolute -left-[23px] top-0 w-3 h-3 rounded-full bg-[#16803C] ring-4 ring-white"></span>
                <span className="font-bold text-[#16803C]">02. Truth Verification Agent</span>
                <p className="text-[11px] text-[#52616B]">Calculated truth confidence score: {selectedTicket.truthScore}%.</p>
              </div>

              <div className="relative">
                <span className="absolute -left-[23px] top-0 w-3 h-3 rounded-full bg-[#C97700] ring-4 ring-white"></span>
                <span className="font-bold text-[#C97700]">03. Dispatch to {selectedTicket.department}</span>
                <p className="text-[11px] text-[#52616B]">Routed via n8n automated webhook integration.</p>
              </div>

              <div className="relative">
                <span className="absolute -left-[23px] top-0 w-3 h-3 rounded-full bg-[#6D4CCB] ring-4 ring-white"></span>
                <span className="font-bold text-[#6D4CCB]">04. Closed-Loop Validation Active</span>
                <p className="text-[11px] text-[#52616B]">Listening for ground resolution confirmation before ticket closure.</p>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-3 border-t border-[#D9E2EC] flex items-center justify-between">
            {selectedTicket.status !== 'SOLVED' && (
              <button
                onClick={() => {
                  resolveIncident(selectedTicket.id);
                  setSelectedTicket({ ...selectedTicket, status: 'SOLVED' });
                }}
                className="px-4 py-2 rounded-xl bg-[#16803C] text-white font-bold text-xs flex items-center space-x-1.5 shadow-xs"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Mark as Resolved</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Ticket List */
        <div className="space-y-3">
          
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search tickets by ID or department..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white border border-[#D9E2EC] rounded-2xl text-xs focus:outline-none focus:border-[#1769E0]"
            />
          </div>

          {/* Tickets Cards */}
          {filtered.map(inc => (
            <div
              key={inc.id}
              onClick={() => setSelectedTicket(inc)}
              className="bg-white border border-[#D9E2EC] hover:border-[#1769E0]/40 p-4 rounded-2xl shadow-xs transition-all cursor-pointer space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`p-1.5 rounded-lg ${inc.type === 'EMERGENCY' ? 'bg-[#FFF0F0] text-[#C62828]' : 'bg-[#EAF1F8] text-[#1769E0]'}`}>
                    {inc.type === 'EMERGENCY' ? <AlertOctagon className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                  </div>
                  <span className="font-mono text-xs font-bold text-[#0B2E59]">#{inc.id}</span>
                </div>
                {getStatusChip(inc.status)}
              </div>

              <div>
                <h4 className="font-extrabold text-xs text-[#14213D] leading-tight line-clamp-1">
                  {inc.title}
                </h4>
                <p className="text-[11px] text-[#52616B] font-mono truncate mt-0.5">
                  {inc.department}
                </p>
              </div>

              {/* Status and Escalation Strip */}
              <div className="pt-2 border-t border-[#D9E2EC] flex items-center justify-between text-[10px] font-mono text-[#52616B]">
                <span>Truth: <strong className="text-[#16803C]">{inc.truthScore}%</strong></span>
                {inc.status === 'PENDING_ACK' ? (
                  <span className="text-[#C97700] font-bold">⚡ Retry in 2 days</span>
                ) : (
                  <span>Verified Evidence</span>
                )}
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
