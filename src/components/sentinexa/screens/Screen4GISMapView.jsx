import React, { useState } from 'react';
import GISMap from '../../GISMap';
import { useCivicStore } from '../../../store/useCivicStore';
import { AlertOctagon, FileText, MapPin, ChevronDown, ChevronUp } from 'lucide-react';

export default function Screen4GISMapView({ onSelectTicket }) {
  const { incidents, userLocation, setMapType, mapType, setCategoryFilter, categoryFilter } = useCivicStore();
  const [showStats, setShowStats] = useState(false);

  const emergencyCount = incidents.filter(i => i.type === 'EMERGENCY').length;
  const civicCount = incidents.filter(i => i.type === 'CIVIC').length;
  const resolvedCount = incidents.filter(i => i.status === 'SOLVED' || i.status === 'RESOLVED').length;

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden bg-slate-900">

      {/* ── TOP CONTROL BAR ── */}
      <div className="absolute top-0 left-0 right-0 z-[1100] px-3 pt-2.5 pb-2 flex flex-col gap-2 pointer-events-none">

        {/* Row 1: Map type + Stats toggle */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Map Style */}
          <div className="flex bg-white/95 backdrop-blur p-0.5 rounded-xl border border-slate-200 shadow-md gap-0.5">
            {[
              { val: 'standard', label: '🗺️ Street' },
              { val: 'satellite', label: '🛰️ Satellite' }
            ].map(({ val, label }) => (
              <button key={val} onClick={() => setMapType(val)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                  mapType === val ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600'
                }`}>
                {label}
              </button>
            ))}
          </div>

          {/* Filter chips */}
          <div className="flex bg-white/95 backdrop-blur p-0.5 rounded-xl border border-slate-200 shadow-md gap-0.5 overflow-x-auto">
            {[
              { val: 'all', label: `All (${incidents.length})`, active: 'bg-slate-800 text-white', inactive: 'text-slate-600' },
              { val: 'EMERGENCY', label: `🚨 SOS (${emergencyCount})`, active: 'bg-red-600 text-white', inactive: 'text-red-600 bg-red-50' },
              { val: 'CIVIC', label: `📋 Civic (${civicCount})`, active: 'bg-blue-600 text-white', inactive: 'text-blue-600 bg-blue-50' }
            ].map(({ val, label, active, inactive }) => (
              <button key={val} onClick={() => setCategoryFilter(val)}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all flex-shrink-0 ${
                  categoryFilter === val ? active : inactive
                }`}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Row 2: Stats panel toggle */}
        <div className="pointer-events-auto">
          <button
            onClick={() => setShowStats(!showStats)}
            className="flex items-center gap-1.5 bg-white/95 backdrop-blur px-3 py-1.5 rounded-xl border border-slate-200 shadow-md text-[11px] font-bold text-slate-700"
          >
            <MapPin className="w-3.5 h-3.5 text-blue-600" />
            {userLocation?.city || 'Coimbatore'} — {incidents.length} incidents
            {showStats ? <ChevronUp className="w-3.5 h-3.5 ml-1" /> : <ChevronDown className="w-3.5 h-3.5 ml-1" />}
          </button>

          {/* Expandable stats panel */}
          {showStats && (
            <div className="mt-1.5 bg-white/97 backdrop-blur rounded-2xl border border-slate-200 shadow-xl p-3 grid grid-cols-3 gap-2">
              <div className="bg-red-50 border border-red-100 rounded-xl p-2.5 text-center">
                <p className="text-lg font-black text-red-600">{emergencyCount}</p>
                <p className="text-[10px] text-red-500 font-semibold">Emergency</p>
              </div>
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-2.5 text-center">
                <p className="text-lg font-black text-blue-600">{civicCount}</p>
                <p className="text-[10px] text-blue-500 font-semibold">Civic</p>
              </div>
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-2.5 text-center">
                <p className="text-lg font-black text-emerald-600">{resolvedCount}</p>
                <p className="text-[10px] text-emerald-500 font-semibold">Resolved</p>
              </div>

              {/* Mini incident list inside stats */}
              <div className="col-span-3 mt-1 space-y-1.5 max-h-36 overflow-y-auto">
                {incidents.slice(0, 5).map(inc => (
                  <div key={inc.id} className="flex items-center gap-2 bg-slate-50 rounded-xl px-2.5 py-2 border border-slate-100">
                    <span className={`w-2 h-6 rounded-full flex-shrink-0 ${inc.type === 'EMERGENCY' ? 'bg-red-400' : 'bg-blue-400'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-semibold text-slate-800 truncate">{inc.title}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{inc.id}</p>
                    </div>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 ${
                      inc.status === 'RESOLVED' || inc.status === 'SOLVED'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {inc.status === 'ROUTED_WARD' ? 'Routed' : inc.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── FULL GIS MAP ── */}
      <div className="flex-1 relative">
        <GISMap onSelectTicket={onSelectTicket} />
      </div>
    </div>
  );
}
