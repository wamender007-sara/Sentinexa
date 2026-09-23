import React from 'react';
import { useCivicStore } from '../../../store/useCivicStore';
import HomeMiniMap from '../HomeMiniMap';
import { AlertOctagon, FileText, MapPin, ChevronRight, Clock } from 'lucide-react';

export default function Screen1HomeDashboard({ onNavigate, onOpenGeoCam }) {
  const { incidents, streakDays, solvedCount, userLocation } = useCivicStore();

  const pending = incidents.filter(i => i.status !== 'SOLVED' && i.status !== 'RESOLVED').length;
  const recent = incidents.slice(0, 3);

  const cityName = userLocation?.city || 'Coimbatore';

  return (
    <div className="flex flex-col h-full bg-gray-50 overflow-y-auto pb-20">

      {/* ── Header ── */}
      <div className="bg-white px-4 pt-3 pb-3 shadow-sm flex items-center justify-between sticky top-0 z-20">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider">{cityName}</span>
          </div>
          <h1 className="text-lg font-black text-slate-900 tracking-tight leading-tight">
            SENTIN<span className="text-blue-600">EXA</span>
          </h1>
        </div>
        {/* Stats pill */}
        <div className="flex gap-2">
          <div className="flex flex-col items-center bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100">
            <span className="text-sm font-black text-blue-700">{solvedCount || 12}</span>
            <span className="text-[9px] text-blue-500 font-semibold uppercase">Solved</span>
          </div>
          <div className="flex flex-col items-center bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-100">
            <span className="text-sm font-black text-amber-700">{pending}</span>
            <span className="text-[9px] text-amber-500 font-semibold uppercase">Active</span>
          </div>
        </div>
      </div>

      {/* ── Two Big Hero Buttons ── */}
      <div className="px-4 pt-4 grid grid-cols-2 gap-3">
        {/* Emergency */}
        <button
          onClick={() => onOpenGeoCam?.('emergency')}
          className="flex flex-col items-center justify-center gap-2 bg-red-600 hover:bg-red-700 active:scale-95 text-white rounded-2xl py-6 shadow-lg shadow-red-200 transition-all"
        >
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
            <AlertOctagon className="w-7 h-7 text-white" />
          </div>
          <div className="text-center">
            <p className="font-black text-sm tracking-tight uppercase">Emergency</p>
            <p className="text-[10px] text-red-100">SOS — 108 / 100</p>
          </div>
        </button>

        {/* Complaint */}
        <button
          onClick={() => onOpenGeoCam?.('complaint')}
          className="flex flex-col items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-2xl py-6 shadow-lg shadow-blue-200 transition-all"
        >
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
            <FileText className="w-7 h-7 text-white" />
          </div>
          <div className="text-center">
            <p className="font-black text-sm tracking-tight uppercase">Report Issue</p>
            <p className="text-[10px] text-blue-100">Civic Complaint</p>
          </div>
        </button>
      </div>

      {/* ── Mini Map ── */}
      <div className="px-4 pt-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-blue-500" /> Live Area Map
          </span>
          <button
            onClick={() => onNavigate?.('map')}
            className="text-[11px] text-blue-600 font-semibold flex items-center gap-0.5"
          >
            Expand <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm" style={{ height: 180 }}>
          <HomeMiniMap />
        </div>
      </div>

      {/* ── Recent Reports ── */}
      <div className="px-4 pt-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-700">Recent Reports</span>
          <button
            onClick={() => onNavigate?.('tickets')}
            className="text-[11px] text-blue-600 font-semibold flex items-center gap-0.5"
          >
            See all <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="space-y-2">
          {recent.map((inc) => (
            <div
              key={inc.id}
              className="bg-white rounded-xl border border-slate-100 shadow-xs px-3 py-2.5 flex items-center gap-3"
            >
              <div className={`w-2 h-10 rounded-full flex-shrink-0 ${
                inc.type === 'EMERGENCY' ? 'bg-red-400' : 'bg-blue-400'
              }`} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-800 truncate">{inc.title}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span className="text-[10px] text-slate-400 font-mono">
                    {inc.id}
                  </span>
                </div>
              </div>
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                inc.status === 'RESOLVED' || inc.status === 'SOLVED'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : inc.status === 'DISPATCHED'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}>
                {inc.status === 'ROUTED_WARD' ? 'Routed' : inc.status || 'Active'}
              </span>
            </div>
          ))}
          {recent.length === 0 && (
            <div className="bg-white rounded-xl border border-dashed border-slate-200 py-6 text-center">
              <p className="text-xs text-slate-400">No reports yet. Tap a button above to report.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
