import React from 'react';
import { Smartphone, Monitor, Award, Shield, Sparkles } from 'lucide-react';

export default function SentinexaViewportBar({ activeMode, onSelectMode }) {
  return (
    <header className="bg-[#050811] border-b border-cyan-500/30 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shrink-0 z-[3000] sticky top-0 shadow-lg shadow-black/50">
      {/* Brand Identity */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-md shadow-cyan-500/20">
          <Shield className="w-4 h-4 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xs font-black tracking-wider text-white">SENTINEXA</h1>
            <span className="text-[9px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-500/40 px-1.5 py-0.2 rounded font-bold">
              CIVIC INTEL &amp; SOS
            </span>
          </div>
          <p className="text-[10px] text-slate-400 font-mono hidden sm:block">
            Autonomous Multi-Agent Platform · Responsive Prototype
          </p>
        </div>
      </div>

      {/* Breakpoint / Viewport Switcher */}
      <div className="flex items-center p-1 rounded-xl bg-[#090f1f] border border-slate-700/80 shadow-inner">
        <button
          onClick={() => onSelectMode('mobile')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeMode === 'mobile'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Mobile (375×812)</span>
        </button>

        <button
          onClick={() => onSelectMode('desktop')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeMode === 'desktop'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>Desktop (1440×900+)</span>
        </button>

        <button
          onClick={() => onSelectMode('pitch')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeMode === 'pitch'
              ? 'bg-gradient-to-r from-red-500 to-amber-500 text-white shadow-md shadow-red-500/30 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>Hero Pitch Slide</span>
        </button>
      </div>

      {/* Live System Badge */}
      <div className="hidden lg:flex items-center gap-3 text-xs font-mono">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="text-emerald-400 font-semibold text-[11px]">GIS LIVE MESH</span>
        </div>
        <div className="text-[11px] bg-slate-900 border border-slate-800 text-slate-300 px-2.5 py-1 rounded">
          Tamil Nadu / Chennai
        </div>
      </div>
    </header>
  );
}
