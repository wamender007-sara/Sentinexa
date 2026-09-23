import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useCivicStore } from '../store/useCivicStore';
import { 
  AlertOctagon, 
  MapPin, 
  CloudRain, 
  CheckCircle2, 
  Search, 
  RotateCcw, 
  Plus, 
  Minus, 
  Filter, 
  ShieldCheck, 
  Truck, 
  Stethoscope, 
  ChevronRight,
  ExternalLink,
  Zap,
  Activity
} from 'lucide-react';

// Marker Icon Generator following Light CIVICLOOP palette
const createCivicIcon = (type, severity, status) => {
  let bg = '#1769E0'; // primary brand blue
  let iconEmoji = '📍';
  let pulse = false;

  if (type === 'EMERGENCY' || severity >= 5) {
    bg = '#C62828'; // emergency red
    iconEmoji = '🚨';
    pulse = true;
  } else if (type === 'WEATHER') {
    bg = '#0EA5C6'; // info cyan
    iconEmoji = '🌧️';
  } else if (status === 'SOLVED') {
    bg = '#16803C'; // success green
    iconEmoji = '✅';
  } else if (type === 'CIVIC') {
    bg = '#C97700'; // warning amber
    iconEmoji = '⚠️';
  }

  const html = `
    <div style="
      position: relative;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      ${pulse ? `<div style="
        position: absolute;
        width: 44px;
        height: 44px;
        border-radius: 50%;
        background-color: ${bg}30;
        animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
      "></div>` : ''}
      <div style="
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background: ${bg};
        border: 2px solid #FFFFFF;
        box-shadow: 0 4px 10px ${bg}50;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 13px;
      ">
        ${iconEmoji}
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-civic-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  });
};

function MapRecenter({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, { animate: true });
  }, [center, zoom, map]);
  return null;
}

export default function GISMap({ onSelectTicket }) {
  const { 
    incidents, 
    selectedRegion, 
    categoryFilter, 
    setCategoryFilter,
    statusFilter, 
    verifiedOnly,
    setVerifiedOnly,
    mapType,
    setMapType,
    mapCenter, 
    mapZoom, 
    setMapCenter,
    selectedIncident,
    setSelectedIncident, 
    openCitizenSignalModal,
    triggerEmergencyModal,
    language 
  } = useCivicStore();

  const [searchQuery, setSearchQuery] = useState('');

  // Tile layer URL based on map type
  const getTileUrl = () => {
    if (mapType === 'satellite') {
      return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
    } else if (mapType === 'terrain') {
      return 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
    }
    // Standard clean light tile
    return 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
  };

  // Filtering incidents
  const filteredIncidents = incidents.filter(inc => {
    // Verified only filter
    if (verifiedOnly && inc.status !== 'VERIFIED' && inc.status !== 'DISPATCHED' && inc.status !== 'SOLVED') return false;

    // Category filter
    if (categoryFilter !== 'all') {
      if (categoryFilter === 'EMERGENCY' && inc.type !== 'EMERGENCY') return false;
      if (categoryFilter === 'CIVIC' && inc.type !== 'CIVIC') return false;
      if (categoryFilter === 'WEATHER' && inc.type !== 'WEATHER') return false;
    }

    // Search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        inc.title.toLowerCase().includes(q) ||
        inc.id.toLowerCase().includes(q) ||
        inc.address.toLowerCase().includes(q)
      );
    }

    return true;
  });

  return (
    <div className="relative w-full h-[calc(100vh-65px)] overflow-hidden bg-[#F7F9FC] flex flex-col">
      
      {/* Top Map Control Bar */}
      <div className="absolute top-3 left-3 right-3 z-[1000] flex flex-wrap items-center justify-between gap-2.5 pointer-events-none">
        
        {/* Left Controls: Map Type, Filters & Verified Toggle */}
        <div className="pointer-events-auto bg-white/95 backdrop-blur-md border border-[#D9E2EC] p-1.5 rounded-2xl shadow-sm flex flex-wrap items-center gap-2">
          
          {/* Map Type Selector */}
          <div className="flex bg-[#F1F5F9] p-0.5 rounded-xl border border-[#D9E2EC] text-xs font-semibold">
            <button
              onClick={() => setMapType('standard')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${mapType === 'standard' ? 'bg-white text-[#14213D] shadow-xs' : 'text-[#52616B]'}`}
            >
              Standard
            </button>
            <button
              onClick={() => setMapType('satellite')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${mapType === 'satellite' ? 'bg-white text-[#14213D] shadow-xs' : 'text-[#52616B]'}`}
            >
              Satellite
            </button>
            <button
              onClick={() => setMapType('terrain')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${mapType === 'terrain' ? 'bg-white text-[#14213D] shadow-xs' : 'text-[#52616B]'}`}
            >
              Terrain
            </button>
          </div>

          <div className="h-4 w-px bg-[#D9E2EC]"></div>

          {/* Incident Category Filter Buttons */}
          <div className="flex items-center space-x-1 text-xs font-semibold">
            {['all', 'EMERGENCY', 'CIVIC', 'WEATHER'].map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-2.5 py-1 rounded-xl uppercase font-bold text-[11px] transition-colors ${
                  categoryFilter === cat
                    ? 'bg-[#1769E0] text-white'
                    : 'bg-[#F1F5F9] text-[#52616B] hover:text-[#14213D]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="h-4 w-px bg-[#D9E2EC]"></div>

          {/* Verified Only Toggle */}
          <label className="flex items-center space-x-1.5 text-xs font-semibold text-[#14213D] cursor-pointer px-2 py-1 bg-[#F1F5F9] rounded-xl border border-[#D9E2EC]">
            <input
              type="checkbox"
              checked={verifiedOnly}
              onChange={(e) => setVerifiedOnly(e.target.checked)}
              className="rounded border-[#D9E2EC] text-[#1769E0] focus:ring-0"
            />
            <span>Verified only</span>
          </label>
        </div>

        {/* Right Controls: Search Field & Reset */}
        <div className="pointer-events-auto flex items-center space-x-2">
          
          {/* Location Search Input */}
          <div className="relative bg-white border border-[#D9E2EC] rounded-2xl shadow-sm overflow-hidden flex items-center px-3 py-1.5 w-48 sm:w-64">
            <Search className="w-4 h-4 text-[#52616B] mr-2" />
            <input
              type="text"
              placeholder="Search map incidents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs text-[#14213D] placeholder-[#94A3B8] focus:outline-none bg-transparent"
            />
          </div>

          {/* Reset Map View */}
          <button
            onClick={() => setMapCenter([13.0827, 80.2707], 12)}
            className="p-2 rounded-2xl bg-white border border-[#D9E2EC] text-[#52616B] hover:text-[#14213D] shadow-sm"
            title="Reset Map View"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

        </div>
      </div>

      {/* Leaflet Map Container */}
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        style={{ width: '100%', height: '100%' }}
        zoomControl={false}
      >
        <MapRecenter center={mapCenter} zoom={mapZoom} />
        <TileLayer
          url={getTileUrl()}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Render Markers */}
        {filteredIncidents.map(inc => (
          <Marker
            key={inc.id}
            position={[inc.lat, inc.long]}
            icon={createCivicIcon(inc.type, inc.severity, inc.status)}
            eventHandlers={{
              click: () => {
                setSelectedIncident(inc);
              }
            }}
          >
            <Popup>
              <div className="p-1.5 max-w-xs font-sans">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                    inc.type === 'EMERGENCY' ? 'bg-[#FFF0F0] text-[#C62828] border border-[#C62828]/20' :
                    inc.type === 'WEATHER' ? 'bg-[#F1F5F9] text-[#0EA5C6] border border-[#0EA5C6]/20' :
                    'bg-[#FFF5DF] text-[#C97700] border border-[#C97700]/20'
                  }`}>
                    {inc.type} • Severity {inc.severity || 3}/5
                  </span>
                  <span className="text-[10px] font-mono text-[#52616B]">
                    Conf: <strong className="text-[#16803C]">{inc.truthScore}%</strong>
                  </span>
                </div>

                <h3 className="font-extrabold text-sm text-[#14213D] leading-snug mb-1">
                  {language === 'ta' && inc.tamilTitle ? inc.tamilTitle : inc.title}
                </h3>

                <p className="text-xs text-[#52616B] line-clamp-2 mb-2 font-mono">
                  {inc.address}
                </p>

                {inc.imageUri && (
                  <img
                    src={inc.imageUri}
                    alt="Incident evidence photo"
                    className="w-full h-24 object-cover rounded-lg mb-2 border border-[#D9E2EC]"
                  />
                )}

                <div className="flex items-center justify-between pt-2 border-t border-[#D9E2EC] text-xs">
                  <span className="font-mono text-[#52616B] text-[10px]">
                    ID: {inc.id}
                  </span>
                  <button
                    onClick={() => {
                      if (onSelectTicket) onSelectTicket(inc);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-[#1769E0] hover:bg-[#1253B3] text-white font-bold text-[11px] flex items-center space-x-1"
                  >
                    <span>View Ticket</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Floating Incident Detail Drawer (If incident selected) */}
      {selectedIncident && (
        <div className="absolute bottom-4 right-4 z-[1000] w-full max-w-sm bg-white border border-[#D9E2EC] rounded-2xl p-4 shadow-xl animate-fade-in font-sans">
          <div className="flex items-start justify-between mb-2">
            <div>
              <span className="text-[10px] font-mono font-bold text-[#1769E0] uppercase tracking-wider">
                Selected Incident #{selectedIncident.id}
              </span>
              <h4 className="font-extrabold text-sm text-[#14213D] leading-tight">
                {selectedIncident.title}
              </h4>
            </div>
            <button
              onClick={() => setSelectedIncident(null)}
              className="text-[#94A3B8] hover:text-[#14213D] text-xs font-bold p-1"
            >
              ✕
            </button>
          </div>

          <p className="text-xs text-[#52616B] mb-3 line-clamp-2 font-mono">
            {selectedIncident.address}
          </p>

          <div className="flex items-center space-x-3 mb-3 text-xs">
            <span className="px-2 py-0.5 rounded-md bg-[#FFF5DF] text-[#C97700] font-bold font-mono text-[10px]">
              Severity: {selectedIncident.severity || 3}/5
            </span>
            <span className="px-2 py-0.5 rounded-md bg-[#EAF7EE] text-[#16803C] font-bold font-mono text-[10px]">
              Confidence: {selectedIncident.truthScore || 94}%
            </span>
            <span className="px-2 py-0.5 rounded-md bg-[#F1F5F9] text-[#0B2E59] font-bold font-mono text-[10px]">
              Signals: {selectedIncident.corroboratingSignals || 4}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                if (onSelectTicket) onSelectTicket(selectedIncident);
              }}
              className="flex-1 py-1.5 rounded-xl bg-[#1769E0] hover:bg-[#1253B3] text-white font-bold text-xs shadow-xs text-center"
            >
              Open Full Incident File
            </button>
            <button
              onClick={() => triggerEmergencyModal({ lat: selectedIncident.lat, long: selectedIncident.long })}
              className="px-3 py-1.5 rounded-xl bg-[#FFF0F0] text-[#C62828] font-bold text-xs border border-[#C62828]/30"
            >
              Dispatch
            </button>
          </div>
        </div>
      )}

      {/* Map Legend (Bottom Left) */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white/95 backdrop-blur-md border border-[#D9E2EC] p-3 rounded-2xl shadow-sm text-xs font-semibold text-[#14213D] hidden md:flex items-center space-x-4">
        <span className="text-[11px] font-bold uppercase text-[#52616B] tracking-wider">Legend:</span>
        <span className="flex items-center text-[#C62828]"><span className="w-2.5 h-2.5 rounded-full bg-[#C62828] mr-1.5"></span> Emergency SOS</span>
        <span className="flex items-center text-[#C97700]"><span className="w-2.5 h-2.5 rounded-full bg-[#C97700] mr-1.5"></span> Civic Hazard</span>
        <span className="flex items-center text-[#0EA5C6]"><span className="w-2.5 h-2.5 rounded-full bg-[#0EA5C6] mr-1.5"></span> Weather Risk</span>
        <span className="flex items-center text-[#16803C]"><span className="w-2.5 h-2.5 rounded-full bg-[#16803C] mr-1.5"></span> Verified Solved</span>
      </div>

    </div>
  );
}
