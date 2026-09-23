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
  Filter, 
  ShieldCheck, 
  ChevronRight,
  ExternalLink,
  Zap,
  Activity,
  Compass,
  Camera
} from 'lucide-react';

// Marker Icon Generator
const createCivicIcon = (type, severity, status) => {
  let bg = '#1769E0';
  let iconEmoji = '📍';
  let pulse = false;

  if (type === 'EMERGENCY' || severity >= 5) {
    bg = '#C62828';
    iconEmoji = '🚨';
    pulse = true;
  } else if (type === 'WEATHER') {
    bg = '#0EA5C6';
    iconEmoji = '🌧️';
  } else if (status === 'SOLVED') {
    bg = '#16803C';
    iconEmoji = '✅';
  } else if (type === 'CIVIC') {
    bg = '#C97700';
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
        background-color: ${bg}35;
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

function MapResizer() {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
    const t1 = setTimeout(() => map.invalidateSize(), 150);
    const t2 = setTimeout(() => map.invalidateSize(), 500);
    const handleResize = () => map.invalidateSize();
    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener('resize', handleResize);
    };
  }, [map]);
  return null;
}

// Automatically pans / fits bounds to relevant filtered incidents
function MapAutoFitter({ incidents, categoryFilter }) {
  const map = useMap();
  useEffect(() => {
    if (categoryFilter !== 'all' && incidents.length > 0) {
      if (incidents.length === 1) {
        map.flyTo([incidents[0].lat, incidents[0].long], 13.5, { duration: 1.2 });
      } else {
        const bounds = L.latLngBounds(incidents.map(i => [i.lat, i.long]));
        map.flyToBounds(bounds, { padding: [60, 60], maxZoom: 14, duration: 1.2 });
      }
    }
  }, [categoryFilter]);
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
    openGeoCam,
    triggerEmergencyModal,
    language 
  } = useCivicStore();

  const [searchQuery, setSearchQuery] = useState('');

  // Live tile URLs
  const getTileConfig = () => {
    if (mapType === 'satellite') {
      return {
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        attribution: '&copy; Esri &mdash; World Imagery Satellite',
        maxNativeZoom: 18,
        maxZoom: 19
      };
    } else if (mapType === 'terrain') {
      return {
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
        attribution: '&copy; Esri &mdash; Topographic Basemap',
        maxNativeZoom: 18,
        maxZoom: 19
      };
    }
    // Standard OpenStreetMap
    return {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxNativeZoom: 19,
      maxZoom: 19
    };
  };

  // Counts by category
  const emergencyCount = incidents.filter(i => i.type === 'EMERGENCY').length;
  const civicCount = incidents.filter(i => i.type === 'CIVIC').length;
  const weatherCount = incidents.filter(i => i.type === 'WEATHER').length;

  // Filtered incidents
  const filteredIncidents = incidents.filter(inc => {
    // Verified only filter
    if (verifiedOnly && inc.status !== 'VERIFIED' && inc.status !== 'DISPATCHED' && inc.status !== 'SOLVED') {
      return false;
    }

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

  const tileConfig = getTileConfig();

  return (
    <div className="relative w-full h-full min-h-[450px] flex-1 overflow-hidden bg-[#F1F5F9] flex flex-col font-sans">
      
      {/* Top Map Control Bar */}
      <div className="absolute top-3 left-3 right-3 z-[1000] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        
        {/* Left Controls: Map Layer, Category Filters, Verified Toggle */}
        <div className="pointer-events-auto bg-white border border-[#D9E2EC] p-1.5 rounded-2xl shadow-md flex flex-wrap items-center gap-2">
          
          {/* Map Layer Selector */}
          <div className="flex bg-[#F1F5F9] p-0.5 rounded-xl border border-[#D9E2EC] text-xs font-semibold">
            <button
              onClick={() => setMapType('standard')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${mapType === 'standard' ? 'bg-white text-[#0B2E59] shadow-xs font-bold' : 'text-[#52616B]'}`}
            >
              Standard
            </button>
            <button
              onClick={() => setMapType('satellite')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${mapType === 'satellite' ? 'bg-white text-[#0B2E59] shadow-xs font-bold' : 'text-[#52616B]'}`}
            >
              Satellite
            </button>
            <button
              onClick={() => setMapType('terrain')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${mapType === 'terrain' ? 'bg-white text-[#0B2E59] shadow-xs font-bold' : 'text-[#52616B]'}`}
            >
              Terrain
            </button>
          </div>

          <div className="h-4 w-px bg-[#D9E2EC]"></div>

          {/* Category Filter Buttons with Count Badges */}
          <div className="flex items-center space-x-1 text-xs font-semibold">
            <button
              onClick={() => setCategoryFilter('all')}
              className={`px-2.5 py-1 rounded-xl uppercase font-bold text-[11px] transition-colors flex items-center space-x-1 ${
                categoryFilter === 'all'
                  ? 'bg-[#0B2E59] text-white shadow-xs'
                  : 'bg-[#F1F5F9] text-[#52616B] hover:text-[#14213D]'
              }`}
            >
              <span>ALL</span>
              <span className="opacity-80">({incidents.length})</span>
            </button>

            <button
              onClick={() => setCategoryFilter('EMERGENCY')}
              className={`px-2.5 py-1 rounded-xl uppercase font-bold text-[11px] transition-colors flex items-center space-x-1 ${
                categoryFilter === 'EMERGENCY'
                  ? 'bg-[#C62828] text-white shadow-xs'
                  : 'bg-[#FFF0F0] text-[#C62828] hover:bg-[#C62828] hover:text-white'
              }`}
            >
              <span>EMERGENCY</span>
              <span className="opacity-80">({emergencyCount})</span>
            </button>

            <button
              onClick={() => setCategoryFilter('CIVIC')}
              className={`px-2.5 py-1 rounded-xl uppercase font-bold text-[11px] transition-colors flex items-center space-x-1 ${
                categoryFilter === 'CIVIC'
                  ? 'bg-[#C97700] text-white shadow-xs'
                  : 'bg-[#FFF5DF] text-[#C97700] hover:bg-[#C97700] hover:text-white'
              }`}
            >
              <span>CIVIC</span>
              <span className="opacity-80">({civicCount})</span>
            </button>

            <button
              onClick={() => setCategoryFilter('WEATHER')}
              className={`px-2.5 py-1 rounded-xl uppercase font-bold text-[11px] transition-colors flex items-center space-x-1 ${
                categoryFilter === 'WEATHER'
                  ? 'bg-[#0EA5C6] text-white shadow-xs'
                  : 'bg-[#E0F2FE] text-[#0EA5C6] hover:bg-[#0EA5C6] hover:text-white'
              }`}
            >
              <span>WEATHER</span>
              <span className="opacity-80">({weatherCount})</span>
            </button>
          </div>

          <div className="h-4 w-px bg-[#D9E2EC] hidden sm:block"></div>

          {/* Verified Only Toggle */}
          <label className="hidden sm:flex items-center space-x-1.5 text-xs font-semibold text-[#14213D] cursor-pointer px-2 py-1 bg-[#F1F5F9] rounded-xl border border-[#D9E2EC]">
            <input
              type="checkbox"
              checked={verifiedOnly}
              onChange={(e) => setVerifiedOnly(e.target.checked)}
              className="rounded border-[#D9E2EC] text-[#1769E0]"
            />
            <span className="text-[11px]">Verified only</span>
          </label>
        </div>

        {/* Right Controls: Search Field & Reset */}
        <div className="pointer-events-auto flex items-center space-x-2">
          
          <div className="relative bg-white border border-[#D9E2EC] rounded-2xl shadow-md overflow-hidden flex items-center px-3 py-1.5 w-44 sm:w-60">
            <Search className="w-3.5 h-3.5 text-[#52616B] mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Search incidents or street..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs text-[#14213D] placeholder-[#94A3B8] focus:outline-none bg-transparent"
            />
          </div>

          {/* Geo-Cam Shutter Button on Map */}
          <button
            onClick={openGeoCam}
            className="px-3 py-1.5 rounded-2xl bg-[#0B2E59] hover:bg-[#14213D] text-white text-xs font-bold shadow-md flex items-center space-x-1.5 transition-all active:scale-95 shrink-0"
            title="Open Geo-Cam with live GPS Latitude & Longitude stamp"
          >
            <Camera className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Geo-Cam</span>
          </button>

          <button
            onClick={() => {
              setMapCenter([13.0827, 80.2707], 12);
              setCategoryFilter('all');
              setVerifiedOnly(false);
              setSearchQuery('');
            }}
            className="p-2 rounded-2xl bg-white border border-[#D9E2EC] text-[#52616B] hover:text-[#14213D] shadow-md transition-colors"
            title="Reset Map to Chennai View"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

        </div>
      </div>

      {/* Zero Incidents Match Notification Banner */}
      {filteredIncidents.length === 0 && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-[1000] bg-white border border-[#C97700] rounded-2xl px-4 py-2 shadow-lg flex items-center space-x-3 text-xs">
          <span className="text-[#C97700] font-bold">No active pins match the current filter selection.</span>
          <button
            onClick={() => {
              setCategoryFilter('all');
              setVerifiedOnly(false);
            }}
            className="px-2.5 py-1 rounded-lg bg-[#F1F5F9] hover:bg-[#EAF1F8] text-[#1769E0] font-bold"
          >
            Show All Incidents
          </button>
        </div>
      )}

      {/* Leaflet Map Container */}
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        style={{ width: '100%', height: '100%', minHeight: '100%' }}
        zoomControl={false}
      >
        <MapResizer />
        <MapRecenter center={mapCenter} zoom={mapZoom} />
        <MapAutoFitter incidents={filteredIncidents} categoryFilter={categoryFilter} />

        {/* Primary Base Tile Layer */}
        <TileLayer
          key={mapType}
          url={tileConfig.url}
          attribution={tileConfig.attribution}
          maxNativeZoom={tileConfig.maxNativeZoom}
          maxZoom={tileConfig.maxZoom}
        />

        {/* Satellite Mode: Location, Area Names, Road & Boundary Overlays */}
        {mapType === 'satellite' && (
          <>
            <TileLayer
              key="sat-roads"
              url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}"
              maxNativeZoom={18}
              maxZoom={19}
              opacity={0.85}
              pane="overlayPane"
            />
            <TileLayer
              key="sat-labels"
              url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
              maxNativeZoom={18}
              maxZoom={19}
              opacity={1}
              pane="overlayPane"
            />
          </>
        )}

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
                    inc.type === 'WEATHER' ? 'bg-[#E0F2FE] text-[#0EA5C6] border border-[#0EA5C6]/20' :
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
                    alt="Evidence"
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

      {/* Floating Selected Incident Drawer */}
      {selectedIncident && (
        <div className="absolute bottom-4 right-4 z-[1000] w-full max-w-sm bg-white border border-[#D9E2EC] rounded-2xl p-4 shadow-xl animate-fade-in font-sans">
          <div className="flex items-start justify-between mb-2">
            <div>
              <span className="text-[10px] font-mono font-bold text-[#1769E0] uppercase tracking-wider">
                Active Incident #{selectedIncident.id}
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

          <div className="flex items-center space-x-2 mb-3 text-xs font-mono">
            <span className="px-2 py-0.5 rounded-md bg-[#FFF5DF] text-[#C97700] font-bold text-[10px]">
              Severity {selectedIncident.severity || 3}/5
            </span>
            <span className="px-2 py-0.5 rounded-md bg-[#EAF7EE] text-[#16803C] font-bold text-[10px]">
              Conf: {selectedIncident.truthScore || 94}%
            </span>
            <span className="px-2 py-0.5 rounded-md bg-[#F1F5F9] text-[#0B2E59] font-bold text-[10px]">
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
              View Full Incident File
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
      <div className="absolute bottom-4 left-4 z-[1000] bg-white border border-[#D9E2EC] p-2.5 rounded-2xl shadow-md text-xs font-semibold text-[#14213D] hidden md:flex items-center space-x-3.5">
        <span className="text-[10px] font-bold uppercase text-[#52616B] tracking-wider">Legend:</span>
        <span className="flex items-center text-[#C62828] text-[11px]"><span className="w-2 h-2 rounded-full bg-[#C62828] mr-1.5"></span> Emergency SOS</span>
        <span className="flex items-center text-[#C97700] text-[11px]"><span className="w-2 h-2 rounded-full bg-[#C97700] mr-1.5"></span> Civic Hazard</span>
        <span className="flex items-center text-[#0EA5C6] text-[11px]"><span className="w-2 h-2 rounded-full bg-[#0EA5C6] mr-1.5"></span> Weather Risk</span>
        <span className="flex items-center text-[#16803C] text-[11px]"><span className="w-2 h-2 rounded-full bg-[#16803C] mr-1.5"></span> Verified Solved</span>
      </div>

    </div>
  );
}
