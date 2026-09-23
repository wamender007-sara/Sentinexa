import React, { useState } from 'react';
import GISMap from '../../GISMap';
import { useCivicStore } from '../../../store/useCivicStore';
import { 
  Globe, 
  MapPin, 
  Filter, 
  ShieldCheck, 
  ChevronUp, 
  ChevronDown, 
  AlertOctagon, 
  FileText, 
  CloudRain, 
  CheckCircle2,
  X
} from 'lucide-react';

export default function Screen4GISMapView({ onSelectTicket }) {
  const { 
    selectedRegion, 
    setSelectedRegion, 
    selectedIncident, 
    setSelectedIncident, 
    setMapCenter,
    language 
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
    <div className="relative w-full h-[660px] sm:h-[720px] rounded-3xl overflow-hidden font-sans">
      
      {/* Embedded Fullscreen Map */}
      <div className="w-full h-full">
        <GISMap onSelectTicket={onSelectTicket} />
      </div>

      {/* Floating Region Filter Pill Bar */}
      <div className="absolute top-16 left-3 right-3 z-[1000] flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto bg-white/95 backdrop-blur-md p-1 rounded-2xl border border-[#D9E2EC] shadow-md flex items-center space-x-1 overflow-x-auto max-w-full scrollbar-none text-xs">
          <span className="px-2 font-mono text-[10px] uppercase font-bold text-[#52616B] shrink-0">Region:</span>
          {regionHierarchy.slice(0, 4).map(reg => (
            <button
              key={reg.label}
              onClick={() => handleSelectRegion(reg)}
              className={`px-2.5 py-1 rounded-xl font-bold whitespace-nowrap transition-all ${
                selectedRegion === reg.label
                  ? 'bg-[#0B2E59] text-white shadow-xs'
                  : 'bg-[#F1F5F9] text-[#52616B] hover:text-[#14213D]'
              }`}
            >
              {reg.label}
            </button>
          ))}
          <button
            onClick={() => setIsFilterSheetOpen(!isFilterSheetOpen)}
            className="p-1.5 rounded-xl bg-[#F1F5F9] text-[#0B2E59] hover:bg-[#EAF1F8]"
            title="All Regions Drilldown"
          >
            <Filter className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Bottom Sheet Filter Modal */}
      {isFilterSheetOpen && (
        <div className="absolute inset-x-0 bottom-0 z-[1100] bg-white border-t border-[#D9E2EC] rounded-t-3xl p-5 shadow-2xl space-y-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-sm text-[#14213D] flex items-center space-x-1.5">
              <Globe className="w-4 h-4 text-[#1769E0]" />
              <span>Geographic Hierarchy Drill-Down</span>
            </h4>
            <button onClick={() => setIsFilterSheetOpen(false)} className="text-slate-400 font-bold p-1">✕</button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
            {regionHierarchy.map(reg => (
              <button
                key={reg.label}
                onClick={() => handleSelectRegion(reg)}
                className={`p-2.5 rounded-xl text-left border flex items-center justify-between ${
                  selectedRegion === reg.label
                    ? 'bg-[#EAF1F8] border-[#1769E0] text-[#1769E0] font-bold'
                    : 'bg-[#F8FAFC] border-[#D9E2EC] text-[#52616B]'
                }`}
              >
                <span>{reg.label}</span>
                {selectedRegion === reg.label && <CheckCircle2 className="w-4 h-4 text-[#1769E0]" />}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Pin Detail Bottom Sheet */}
      {selectedIncident && (
        <div className="absolute inset-x-3 bottom-3 z-[1100] bg-white border border-[#D9E2EC] rounded-3xl p-4 shadow-2xl space-y-3 animate-fade-in">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold uppercase ${
                  selectedIncident.type === 'EMERGENCY' ? 'bg-[#FFF0F0] text-[#C62828]' : 'bg-[#FFF5DF] text-[#C97700]'
                }`}>
                  {selectedIncident.type}
                </span>
                <span className="text-[10px] font-mono text-[#16803C] font-bold flex items-center">
                  <ShieldCheck className="w-3 h-3 mr-1" />
                  ✓ Verified by Truth Agent ({selectedIncident.truthScore}%)
                </span>
              </div>
              <h4 className="font-extrabold text-sm text-[#14213D] mt-1 leading-snug">
                {selectedIncident.title}
              </h4>
            </div>

            <button onClick={() => setSelectedIncident(null)} className="text-slate-400 font-bold p-1">✕</button>
          </div>

          <p className="text-xs text-[#52616B] font-mono line-clamp-1">
            📍 {selectedIncident.address}
          </p>

          <div className="flex items-center space-x-2 pt-1">
            <button
              onClick={() => onSelectTicket(selectedIncident)}
              className="flex-1 py-2 rounded-xl bg-[#1769E0] hover:bg-[#1253B3] text-white font-bold text-xs shadow-xs text-center"
            >
              Open Full Incident Record
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
