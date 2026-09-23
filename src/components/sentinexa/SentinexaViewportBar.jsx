import React from 'react';
import { Smartphone, Monitor, Award, Shield } from 'lucide-react';
import SentinexaLogo from './SentinexaLogo';

export default function SentinexaViewportBar({ activeMode, onSelectMode }) {
  return (
    <header className="bg-white border-b border-slate-200 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shrink-0 z-[3000] sticky top-0 shadow-xs">
      {/* Brand Identity with Modern Logo */}
      <SentinexaLogo size="sm" />

      {/* Breakpoint / Viewport Switcher */}
      <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200 shadow-inner">
        <button
          onClick={() => onSelectMode('mobile')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeMode === 'mobile'
              ? 'bg-white text-blue-600 shadow-sm font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Mobile (375×812)</span>
        </button>

        <button
          onClick={() => onSelectMode('desktop')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeMode === 'desktop'
              ? 'bg-white text-blue-600 shadow-sm font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>Desktop (1440×900+)</span>
        </button>

        <button
          onClick={() => onSelectMode('pitch')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeMode === 'pitch'
              ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-sm font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>Hero Pitch Slide</span>
        </button>
      </div>

      {/* Live System Badge */}
      <div className="hidden lg:flex items-center gap-3 text-xs font-mono">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-emerald-700 font-semibold text-[11px]">GIS LIVE MESH</span>
        </div>
        <div className="text-[11px] bg-slate-100 border border-slate-200 text-slate-700 px-2.5 py-1 rounded">
          Tamil Nadu / Chennai
        </div>
      </div>
    </header>
  );
}
