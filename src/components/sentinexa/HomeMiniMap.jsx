import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useCivicStore } from '../../store/useCivicStore';
import { Maximize2, MapPin, Layers, Radio } from 'lucide-react';

// Marker generator for mini map
const createMiniIcon = (type, severity) => {
  const isEmergency = type === 'EMERGENCY' || severity >= 5;
  const bg = isEmergency ? '#DC2626' : '#D97706';
  const emoji = isEmergency ? '🚨' : '⚠️';

  const html = `
    <div style="
      position: relative;
      width: 26px;
      height: 26px;
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      ${isEmergency ? `<div style="
        position: absolute;
        width: 34px;
        height: 34px;
        border-radius: 50%;
        background-color: rgba(220, 38, 38, 0.3);
        animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
      "></div>` : ''}
      <div style="
        width: 22px;
        height: 22px;
        border-radius: 50%;
        background: ${bg};
        border: 2px solid #ffffff;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 11px;
      ">
        ${emoji}
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-mini-marker',
    iconSize: [26, 26],
    iconAnchor: [13, 13]
  });
};

const createUserMiniIcon = () => {
  const html = `
    <div style="position: relative; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;">
      <div style="position: absolute; width: 32px; height: 32px; border-radius: 50%; background: rgba(37, 99, 235, 0.35); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
      <div style="width: 14px; height: 14px; border-radius: 50%; background: #2563eb; border: 2.5px solid #ffffff; box-shadow: 0 2px 6px rgba(0,0,0,0.35);"></div>
    </div>
  `;
  return L.divIcon({
    html,
    className: 'custom-mini-user',
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

function MiniMapController({ center }) {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
    const t = setTimeout(() => map.invalidateSize(), 150);
    return () => clearTimeout(t);
  }, [map]);

  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, 13, { animate: true });
    }
  }, [center, map]);

  return null;
}

export default function HomeMiniMap({ onExpand }) {
  const { incidents, userLocation, mapType } = useCivicStore();
  const [miniTileType, setMiniTileType] = useState('street'); // 'street' | 'satellite'

  const centerLat = userLocation?.lat || 11.0168;
  const centerLong = userLocation?.long || 76.9558;
  const center = [centerLat, centerLong];

  const cityLabel = userLocation?.city || 'Coimbatore';
  const areaLabel = userLocation?.address 
    ? userLocation.address.split(',')[0]
    : 'Gandhipuram Central';

  const displayedIncidents = incidents.slice(0, 6);

  return (
    <div className="relative w-full h-44 rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm bg-slate-100 group">
      
      {/* Real Live Leaflet Map Container */}
      <MapContainer
        center={center}
        zoom={13}
        style={{ width: '100%', height: '100%', minHeight: '100%' }}
        zoomControl={false}
        attributionControl={false}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        touchZoom={true}
        dragging={true}
      >
        <MiniMapController center={center} />

        {/* Primary Tiles: Clean CartoDB or Esri Satellite */}
        {miniTileType === 'street' ? (
          <TileLayer
            key="mini-street"
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            maxNativeZoom={19}
            maxZoom={19}
          />
        ) : (
          <>
            <TileLayer
              key="mini-satellite"
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              maxNativeZoom={18}
              maxZoom={19}
            />
            <TileLayer
              key="mini-labels"
              url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
              maxNativeZoom={18}
              maxZoom={19}
              opacity={0.9}
            />
          </>
        )}

        {/* User's Live GPS Beacon */}
        {userLocation?.lat != null && (
          <Marker position={[userLocation.lat, userLocation.long]} icon={createUserMiniIcon()} />
        )}

        {/* Nearby Incidents Pins */}
        {displayedIncidents.map(inc => (
          <Marker
            key={inc.id}
            position={[inc.lat, inc.long]}
            icon={createMiniIcon(inc.type, inc.severity)}
          />
        ))}
      </MapContainer>

      {/* Floating Top Header Overlay: Location & Satellite Toggle */}
      <div className="absolute top-2.5 left-2.5 right-2.5 z-[1000] flex items-center justify-between pointer-events-auto">
        <div className="px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md shadow-xs border border-slate-200/80 flex items-center space-x-1.5 text-[11px] font-semibold text-slate-800">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-bold text-slate-900">{cityLabel}</span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-600 font-mono text-[10px] truncate max-w-[120px]">{areaLabel}</span>
        </div>

        <div className="flex items-center space-x-1.5">
          {/* Street / Satellite Mini Switcher */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setMiniTileType(prev => prev === 'street' ? 'satellite' : 'street');
            }}
            className="px-2 py-1 rounded-full bg-white/95 backdrop-blur-md shadow-xs border border-slate-200 text-slate-700 hover:text-slate-900 text-[10px] font-bold"
            title="Toggle Map Style"
          >
            {miniTileType === 'street' ? '🛰️ Satellite' : '🗺️ Map'}
          </button>

          {/* Expand to Fullscreen GIS Map Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onExpand) onExpand();
            }}
            className="p-1.5 rounded-full bg-blue-600 text-white shadow-md hover:bg-blue-700 flex items-center justify-center active:scale-95 transition-transform"
            title="Open Full GIS Map"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Floating Bottom Bar: Quick Incident Count & Tap CTA */}
      <div 
        onClick={() => onExpand && onExpand()}
        className="absolute bottom-2 left-2.5 right-2.5 z-[1000] py-1 px-2.5 rounded-xl bg-white/95 backdrop-blur-md shadow-xs border border-slate-200/80 flex items-center justify-between cursor-pointer hover:bg-white transition-colors"
      >
        <div className="flex items-center space-x-1.5 text-[10px] font-mono text-slate-700">
          <Radio className="w-3 h-3 text-red-500 animate-pulse" />
          <span className="font-bold text-slate-900">{displayedIncidents.length} geocoded incidents</span>
          <span className="text-slate-400">within 5 km</span>
        </div>
        <span className="text-[10px] font-bold text-blue-600 hover:underline">
          Explore Map &rarr;
        </span>
      </div>

    </div>
  );
}
