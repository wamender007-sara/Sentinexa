import React, { useState } from 'react';
import { useCivicStore } from '../../../store/useCivicStore';
import { Search, Clock, CheckCircle2, ChevronRight, Plus, X, MapPin, Check } from 'lucide-react';

export default function Screen5TicketTracker({ onNewReport }) {
  const { incidents, resolveIncident } = useCivicStore();
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'active' | 'resolved'

  const filtered = (incidents || []).filter(i => {
    const q = search.toLowerCase();
    const matchSearch = !search ||
      (i.title || '').toLowerCase().includes(q) ||
      (i.id || '').toLowerCase().includes(q);
    if (!matchSearch) return false;
    if (activeTab === 'active') return i.status !== 'SOLVED' && i.status !== 'RESOLVED';
    if (activeTab === 'resolved') return i.status === 'SOLVED' || i.status === 'RESOLVED';
    return true;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'DISPATCHED':
        return <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200">Dispatched</span>;
      case 'PENDING_ACK':
      case 'ROUTED_WARD':
        return <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-200">Routed</span>;
      case 'ESCALATED':
        return <span className="px-2 py-0.5 rounded-full bg-red-50 text-red-700 text-[10px] font-bold border border-red-200">Escalated</span>;
      case 'SOLVED':
      case 'RESOLVED':
        return <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">Resolved</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold border border-slate-200">Active</span>;
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">

      {/* Header */}
      <div className="bg-white px-4 pt-3 pb-3 shadow-sm border-b border-slate-100 sticky top-0 z-20">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-black text-slate-900 text-base">My Reports</h2>
          <button
            onClick={onNewReport}
            className="flex items-center gap-1.5 bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" /> New
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by ID or keyword..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-400"
          />
        </div>

        {/* Tabs */}
        <div className="flex bg-slate-100 p-0.5 rounded-xl gap-0.5">
          {[['all', 'All'], ['active', 'Active'], ['resolved', 'Resolved']].map(([val, label]) => (
            <button
              key={val}
              onClick={() => setActiveTab(val)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === val ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-4 pb-20 space-y-2.5">
        {filtered.map(item => (
          <button
            key={item.id}
            onClick={() => setSelectedTicket(item)}
            className="w-full text-left bg-white rounded-2xl border border-slate-100 shadow-xs px-3.5 py-3 flex items-center gap-3 hover:border-blue-300 transition-all"
          >
            <div className={`w-1.5 h-12 rounded-full flex-shrink-0 ${
              item.type === 'EMERGENCY' ? 'bg-red-400' : 'bg-blue-400'
            }`} />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-900 truncate">{item.title}</p>
              <p className="text-[10px] font-mono text-slate-400 mt-0.5">{item.id}</p>
              <p className="text-[10px] text-slate-400 truncate">{item.department || 'Municipal Dept'}</p>
            </div>
            <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
              {getStatusBadge(item.status)}
              <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            </div>
          </button>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
              <Search className="w-6 h-6 text-slate-300" />
            </div>
            <p className="text-xs font-semibold">No tickets found</p>
            <p className="text-[11px] mt-1">Try a different search or tab</p>
          </div>
        )}
      </div>

      {/* Ticket Detail Modal */}
      {selectedTicket && (
        <div className="absolute inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end">
          <div className="bg-white rounded-t-3xl w-full max-h-[85vh] overflow-y-auto shadow-2xl">
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-slate-300" />
            </div>

            <div className="px-5 pb-6 pt-2 space-y-4">
              {/* ID + Status */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono font-bold text-blue-600">{selectedTicket.id}</span>
                  <div className="mt-0.5">{getStatusBadge(selectedTicket.status)}</div>
                </div>
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Title + Description */}
              <div>
                <h3 className="font-black text-slate-900 text-base leading-snug">{selectedTicket.title}</h3>
                {selectedTicket.description && (
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{selectedTicket.description}</p>
                )}
              </div>

              {/* Location */}
              {selectedTicket.address && (
                <div className="flex items-start gap-2 bg-slate-50 rounded-xl px-3 py-2.5 border border-slate-200">
                  <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-700">{selectedTicket.address}</p>
                </div>
              )}

              {/* Dept + SLA */}
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2">
                  <p className="text-[10px] text-blue-500 font-bold uppercase">Department</p>
                  <p className="text-xs text-blue-900 font-semibold">{selectedTicket.department || '—'}</p>
                </div>
                <div className="bg-amber-50 border border-amber-100 rounded-xl px-3 py-2">
                  <p className="text-[10px] text-amber-500 font-bold uppercase">SLA</p>
                  <p className="text-xs text-amber-900 font-semibold flex items-center gap-1">
                    <Clock className="w-3 h-3" /> 48h
                  </p>
                </div>
              </div>

              {/* Audit trail */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 space-y-2">
                <p className="text-[10px] font-bold text-slate-500 uppercase">Audit Trail</p>
                {[
                  { done: true, label: 'Geo-Cam captured with GPS lock' },
                  { done: true, label: 'AI Vision reviewed (98% confidence)' },
                  { done: true, label: `Routed to ${selectedTicket.department}` },
                  { done: selectedTicket.status === 'RESOLVED' || selectedTicket.status === 'SOLVED', label: 'Resolved by ward engineer' }
                ].map(({ done, label }, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${done ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                      {done ? <Check className="w-3 h-3 text-white" /> : <span className="text-[9px] text-slate-400">{i + 1}</span>}
                    </div>
                    <span className={`text-xs ${done ? 'text-slate-800 font-medium' : 'text-slate-400'}`}>{label}</span>
                  </div>
                ))}
              </div>

              {/* Resolve + Close */}
              <div className="flex gap-2">
                {selectedTicket.status !== 'RESOLVED' && selectedTicket.status !== 'SOLVED' && (
                  <button
                    onClick={() => { resolveIncident?.(selectedTicket.id); setSelectedTicket(null); }}
                    className="flex-1 py-3 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Mark Resolved
                  </button>
                )}
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
