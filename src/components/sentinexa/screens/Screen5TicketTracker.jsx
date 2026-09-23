import React, { useState } from 'react';
import { useCivicStore } from '../../../store/useCivicStore';
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
  Check,
  Plus
} from 'lucide-react';

export default function Screen5TicketTracker({ onSelectDetail, onNewReport }) {
  const { incidents, resolveIncident, streakDays, triggerAutonomousRetries } = useCivicStore();
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [activeLang, setActiveLang] = useState('en');
  const [search, setSearch] = useState('');

  const filtered = (incidents || []).filter(i => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (i.title || '').toLowerCase().includes(q) || 
           (i.id || '').toLowerCase().includes(q) || 
           (i.department || '').toLowerCase().includes(q);
  });

  const getStatusChip = (status) => {
    switch (status) {
      case 'DISPATCHED':
        return <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-mono text-[10px] font-bold border border-blue-200">Dispatched</span>;
      case 'PENDING_ACK':
      case 'ROUTED_WARD':
        return <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-mono text-[10px] font-bold border border-amber-200 animate-pulse">Ward Routed</span>;
      case 'ESCALATED':
        return <span className="px-2 py-0.5 rounded-full bg-red-50 text-red-600 font-mono text-[10px] font-bold border border-red-200">Tier 2 Escalated</span>;
      case 'SOLVED':
      case 'RESOLVED':
        return <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-mono text-[10px] font-bold border border-emerald-200">Resolved</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono text-[10px] font-bold border border-slate-200">Active</span>;
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC] text-slate-800 font-sans overflow-y-auto p-4 space-y-4 pb-20 select-none">
      
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 p-4 rounded-3xl shadow-sm flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase text-slate-500">SENTINEXA CIVIC LEDGER</span>
          <h3 className="font-extrabold text-base text-slate-900">Incident Ticket Tracker</h3>
        </div>
        <div className="flex items-center space-x-1.5 px-3 py-1 bg-amber-50 border border-amber-200 rounded-xl text-xs font-mono font-bold text-amber-700">
          <Flame className="w-3.5 h-3.5 text-amber-600" />
          <span>{streakDays || 42}d Streak</span>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by ticket ID, ward, or keyword..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 shadow-sm"
        />
      </div>

      {/* Ticket List */}
      <div className="space-y-2.5">
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedTicket(item)}
            className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-blue-400 cursor-pointer transition-all space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-blue-600">{item.id}</span>
              {getStatusChip(item.status)}
            </div>

            <h4 className="font-bold text-xs text-slate-900 leading-snug line-clamp-1">
              {item.title}
            </h4>

            <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-1 border-t border-slate-100">
              <span className="truncate max-w-[200px]">{item.department || 'GCC Ward Wing'}</span>
              <span className="text-amber-600 font-bold shrink-0">SLA: 48 hrs</span>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-8 text-slate-400 space-y-2">
            <Ticket className="w-8 h-8 mx-auto text-slate-300" />
            <p className="text-xs">No matching tickets found</p>
          </div>
        )}
      </div>

      {/* Selected Ticket Modal / Inspector */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-3 animate-fade-in">
          <div className="bg-white rounded-3xl p-5 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs font-bold text-blue-600">{selectedTicket.id}</span>
                {getStatusChip(selectedTicket.status)}
              </div>
              <button 
                onClick={() => setSelectedTicket(null)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center font-bold text-xs"
              >
                ✕
              </button>
            </div>

            <div>
              <h3 className="font-extrabold text-sm text-slate-900 leading-snug">
                {selectedTicket.title}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {selectedTicket.description}
              </p>
            </div>

            {/* SLA Auto-Retry Countdown */}
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>Auto-Retry &amp; Escalation Engine</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Autonomous agent pings GCC ward supervisor. If unacknowledged within 48h, ticket elevates directly to TN State Principal Secretary.
              </p>
            </div>

            {/* 4-Step Agent Lifecycle Stepper */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-[10px] font-mono text-slate-500 uppercase font-bold">Autonomous Audit Trail</span>
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center space-x-2 text-emerald-700 font-semibold">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Geo-Cam Capture Verified with GPS Lock</span>
                </div>
                <div className="flex items-center space-x-2 text-emerald-700 font-semibold">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Vision Agent Consensus: 98.4% Confidence</span>
                </div>
                <div className="flex items-center space-x-2 text-blue-700 font-semibold">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  <span>Routed to {selectedTicket.department}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedTicket(null)}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
