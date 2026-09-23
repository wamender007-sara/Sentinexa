import React from 'react';
import GISMap from '../../GISMap';

export default function Screen4GISMapView({ onSelectTicket }) {
  return (
    <div className="relative w-full h-full min-h-[500px] flex-1 flex flex-col font-sans select-none overflow-hidden bg-[#F1F5F9]">
      {/* Fullscreen Interactive Leaflet Map with integrated clean controls */}
      <GISMap onSelectTicket={onSelectTicket} />
    </div>
  );
}
