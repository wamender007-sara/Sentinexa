import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useCivicStore } from '../../store/useCivicStore';

const createUserMiniIcon = () => {
  const html = `
    <div style="position:relative;width:20px;height:20px;display:flex;align-items:center;justify-content:center;">
      <div style="position:absolute;width:28px;height:28px;border-radius:50%;background:rgba(37,99,235,0.25);animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite;"></div>
      <div style="width:12px;height:12px;border-radius:50%;background:#2563eb;border:2.5px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.25);"></div>
    </div>`;
  return L.divIcon({ html, className: 'custom-mini-user', iconSize: [20, 20], iconAnchor: [10, 10] });
};

const createMiniIncidentIcon = (type) => {
  const isEmergency = type === 'EMERGENCY';
  const html = `
    <div style="width:16px;height:16px;border-radius:50%;background:${isEmergency ? '#DC2626' : '#D97706'};border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,0.3);"></div>`;
  return L.divIcon({ html, className: '', iconSize: [16, 16], iconAnchor: [8, 8] });
};

function MapFit({ center }) {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
    const t = setTimeout(() => map.invalidateSize(), 100);
    return () => clearTimeout(t);
  }, [map]);
  useEffect(() => {
    if (center?.[0]) map.setView(center, 14, { animate: false });
  }, [center, map]);
  return null;
}

export default function HomeMiniMap({ onExpand }) {
  const { incidents, userLocation } = useCivicStore();

  const centerLat = userLocation?.lat || 11.0168;
  const centerLong = userLocation?.long || 76.9558;
  const center = [centerLat, centerLong];
  const nearby = incidents.slice(0, 5);

  return (
    <div
      className="relative w-full h-full rounded-2xl overflow-hidden bg-slate-100 cursor-pointer"
      onClick={onExpand}
    >
      {/* Leaflet map — no controls, no popups, silent background */}
      <MapContainer
        center={center}
        zoom={14}
        style={{ width: '100%', height: '100%' }}
        zoomControl={false}
        attributionControl={false}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        dragging={false}
        touchZoom={false}
      >
        <MapFit center={center} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />
        {userLocation?.lat && (
          <Marker position={[userLocation.lat, userLocation.long]} icon={createUserMiniIcon()} />
        )}
        {nearby.map(inc => (
          <Marker key={inc.id} position={[inc.lat, inc.long]} icon={createMiniIncidentIcon(inc.type)} />
        ))}
      </MapContainer>

      {/* Simple bottom overlay — just count + tap hint */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top-left: live dot */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 bg-white/90 backdrop-blur rounded-full px-2.5 py-1 shadow-sm border border-slate-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-bold text-slate-800">{userLocation?.city || 'Coimbatore'}</span>
        </div>

        {/* Bottom: incident count + tap */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent px-3 pb-2.5 pt-6 flex items-end justify-between">
          <span className="text-[11px] text-white font-semibold">
            {nearby.length} incident{nearby.length !== 1 ? 's' : ''} nearby
          </span>
          <span className="text-[11px] text-white/80 font-medium">Tap for full map →</span>
        </div>
      </div>
    </div>
  );
}
