import React, { useState } from 'react';
import GISMap from '../../GISMap';
import { useCivicStore } from '../../../store/useCivicStore';
import { 
  Globe, 
  MapPin, 
  Filter, 
  ShieldCheck, 
  CheckCircle2,
  X
} from 'lucide-react';

export default function Screen4GISMapView({ onSelectTicket }) {
  const { 
    selectedRegion, 
    setSelectedRegion, 
    selectedIncident, 
    setSelectedIncident, 
    setMapCenter
  } = useCivicStore();

  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  const regionHierarchy = [
    { label: 'Tamil Nadu', center: [11.1271, 78.6569], zoom: 7 },
    { label: 'Chennai', center: [13.0827, 80.2707], zoom: 12 },
    { label: 'Coimbatore', center: [11.0168, 76.9558], zoom: 12 },
    { label: 'Madurai', center: [9.9252, 78.1198], zoom: 12 },
    { label: 'Salem', center: [11.6643, 78.1460], zoom: 12 },
    { label: 'India', center: [20.5937, 78.9629], zoom: 5 },
    { label: 'Global', center: [20.0, 0.0], zoom: 2 }
  ];

  const handleSelectRegion = (reg) => {
    setSelectedRegion(reg.label);
    setMapCenter(reg.center, reg.zoom);
    setIsFilterSheetOpen(false);
  };

  return (
    <div className="relative w-full h-full min-h-[500px] flex-1 flex flex-col font-sans select-none overflow-hidden">
      
      {/* Embedded Fullscreen Map */}
      <div className="w-full h-full flex-1 relative min-h-[450px]">
        <GISMap onSelectTicket={onSelectTicket} />
      </div>

      {/* Floating Region Filter Pill Bar */}
      <div className="absolute top-3 left-3 right-3 z-[1000] flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto bg-white/95 backdrop-blur-md p-1 rounded-2xl border border-slate-200 shadow-md flex items-center space-x-1 overflow-x-auto max-w-full scrollbar-none text-xs">
          <span className="px-2 font-mono text-[10px] uppercase font-bold text-slate-500 shrink-0">Region:</span>
          {regionHierarchy.slice(0, 4).map(reg => (
            <button
              key={reg.label}
              onClick={() => handleSelectRegion(reg)}
              className={`px-2.5 py-1 rounded-xl font-bold whitespace-nowrap transition-all ${
                selectedRegion === reg.label
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              {reg.label}
            </button>
          ))}
          <button
            onClick={() => setIsFilterSheetOpen(!isFilterSheetOpen)}
            className="p-1.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200"
            title="All Regions Drilldown"
          >
            <Filter className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Bottom Sheet Filter Modal */}
      {isFilterSheetOpen && (
        <div className="absolute inset-x-0 bottom-0 z-[1100] bg-white border-t border-slate-200 rounded-t-3xl p-5 shadow-2xl space-y-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-sm text-slate-900 flex items-center space-x-1.5">
              <Globe className="w-4 h-4 text-blue-600" />
              <span>Geographic Hierarchy Drill-Down</span>
            </h4>
            <button onClick={() => setIsFilterSheetOpen(false)} className="text-slate-400 hover:text-slate-700 font-bold p-1">✕</button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
            {regionHierarchy.map(reg => (
              <button
                key={reg.label}
                onClick={() => handleSelectRegion(reg)}
                className={`p-2.5 rounded-xl text-left border flex items-center justify-between transition-all ${
                  selectedRegion === reg.label
                    ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>{reg.label}</span>
                {selectedRegion === reg.label && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Pin Detail Bottom Sheet */}
      {selectedIncident && (
        <div className="absolute inset-x-3 bottom-3 z-[1100] bg-white border border-slate-200 rounded-3xl p-4 shadow-xl space-y-3 animate-fade-in">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold uppercase ${
                  selectedIncident.type === 'EMERGENCY' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}>
                  {selectedIncident.type}
                </span>
                <span className="text-[10px] font-mono text-emerald-600 font-bold flex items-center">
                  <ShieldCheck className="w-3 h-3 mr-1" />
                  ✓ Truth Consensus ({selectedIncident.truthScore || 98}%)
                </span>
              </div>
              <h4 className="font-extrabold text-sm text-slate-900 mt-1 leading-snug">
                {selectedIncident.title}
              </h4>
            </div>

            <button onClick={() => setSelectedIncident(null)} className="text-slate-400 hover:text-slate-700 font-bold p-1">✕</button>
          </div>

          <p className="text-xs text-slate-500 font-mono line-clamp-1">
            📍 {selectedIncident.address}
          </p>

          <div className="flex items-center space-x-2 pt-1">
            <button
              onClick={() => onSelectTicket && onSelectTicket(selectedIncident)}
              className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs text-center transition-colors"
            >
              Open Full Incident Record
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
