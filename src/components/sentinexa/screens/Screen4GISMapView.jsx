import React from 'react';
import GISMap from '../../GISMap';

export default function Screen4GISMapView({ onSelectTicket }) {
  return (
    <div className="relative w-full h-full flex-1 flex flex-col font-sans select-none overflow-hidden bg-slate-900">
      <GISMap onSelectTicket={onSelectTicket} />
    </div>
  );
}
