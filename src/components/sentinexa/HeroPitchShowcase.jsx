import React from 'react';
import { 
  Shield, Zap, Radio, CheckCircle, Smartphone, Tablet, Monitor, 
  ArrowRight, Activity, Flame, Globe, Sparkles, Cpu
} from 'lucide-react';

import Screen3AEmergencyFlow from './screens/Screen3AEmergencyFlow';
import Screen4GISMapView from './screens/Screen4GISMapView';
import Screen6Telemetry from './screens/Screen6Telemetry';

export default function HeroPitchShowcase() {
  return (
    <div className="w-full min-h-full bg-[#F1F5F9] text-slate-800 p-4 md:p-8 flex flex-col overflow-y-auto font-sans select-none">
      
      {/* Pitch Header Banner */}
      <div className="text-center max-w-4xl mx-auto mb-8 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-mono text-blue-700 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-spin" />
          <span>AUTONOMOUS MULTI-AGENT CIVIC &amp; EMERGENCY RESPONSE SYSTEM</span>
        </div>

        <h1 className="text-2xl md:text-4xl font-black tracking-tight text-slate-900">
          SENTINEXA
        </h1>
        <p className="text-sm md:text-lg font-bold text-blue-700">
          "From Citizen Tap to Multi-Agent Dispatch in Under 4 Seconds"
        </p>

        {/* 4 Key Pillar Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 text-left">
          <div className="p-3.5 rounded-2xl bg-white border border-red-200 shadow-sm">
            <span className="text-xs font-mono text-red-600 font-black block">&lt; 4.0s DISPATCH</span>
            <span className="text-[11px] text-slate-600 font-medium">108/100 automated triage</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white border border-blue-200 shadow-sm">
            <span className="text-xs font-mono text-blue-700 font-black block">98.4% AI ACCURACY</span>
            <span className="text-[11px] text-slate-600 font-medium">Tensor Computer Vision</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white border border-emerald-200 shadow-sm">
            <span className="text-xs font-mono text-emerald-700 font-black block">2-DAY SLA ESCALATION</span>
            <span className="text-[11px] text-slate-600 font-medium">Zero municipal stagnation</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white border border-purple-200 shadow-sm">
            <span className="text-xs font-mono text-purple-700 font-black block">TAMIL + ENGLISH MESH</span>
            <span className="text-[11px] text-slate-600 font-medium">Tamil Nadu ward routing</span>
          </div>
        </div>
      </div>

      {/* 3-Panel Side-by-Side Pitch Composition */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch max-w-7xl mx-auto w-full">
        
        {/* PANEL 1: Mobile Phone - Emergency Flow */}
        <div className="lg:col-span-4 flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-2 text-xs font-mono text-red-700 px-2 font-bold">
            <span className="flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-red-600" /> PANEL 1: MOBILE SOS FLOW
            </span>
            <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded border border-red-200 text-[10px]">
              Screen 3A
            </span>
          </div>
          {/* Mobile phone mock */}
          <div className="w-full max-w-[360px] h-[650px] bg-[#F8FAFC] rounded-[40px] border-[6px] border-slate-300 shadow-xl overflow-hidden flex flex-col relative ring-1 ring-slate-200">
            <Screen3AEmergencyFlow />
          </div>
          <div className="mt-3 text-center px-4">
            <h4 className="text-xs font-black text-slate-900">One-Tap Multi-Agency Dispatch</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Live GPS watermark, nearest 3 hospitals with ETA, and instant 108/100 protocol execution.
            </p>
          </div>
        </div>

        {/* PANEL 2: Tablet/Laptop - Full GIS Map View */}
        <div className="lg:col-span-4 flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-2 text-xs font-mono text-blue-700 px-2 font-bold">
            <span className="flex items-center gap-1.5">
              <Tablet className="w-4 h-4 text-blue-600" /> PANEL 2: GIS MAP INTELLIGENCE
            </span>
            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded border border-blue-200 text-[10px]">
              Screen 4
            </span>
          </div>
          {/* Tablet mock */}
          <div className="w-full h-[650px] bg-[#F8FAFC] rounded-[32px] border-[5px] border-slate-300 shadow-xl overflow-hidden flex flex-col relative ring-1 ring-slate-200">
            <Screen4GISMapView />
          </div>
          <div className="mt-3 text-center px-4">
            <h4 className="text-xs font-black text-slate-900">Tamil Nadu GIS Geospatial Grid</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Drilldown hierarchy (Global &gt; India &gt; TN &gt; Chennai), live incident pins, and bottom sheet telemetry.
            </p>
          </div>
        </div>

        {/* PANEL 3: Desktop Command - Telemetry & n8n Agent Stream */}
        <div className="lg:col-span-4 flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-2 text-xs font-mono text-indigo-700 px-2 font-bold">
            <span className="flex items-center gap-1.5">
              <Monitor className="w-4 h-4 text-indigo-600" /> PANEL 3: AGENT TELEMETRY
            </span>
            <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded border border-indigo-200 text-[10px]">
              Screen 6
            </span>
          </div>
          {/* Desktop panel mock */}
          <div className="w-full h-[650px] bg-[#F8FAFC] rounded-[28px] border-[5px] border-slate-300 shadow-xl overflow-hidden flex flex-col relative ring-1 ring-slate-200">
            <Screen6Telemetry />
          </div>
          <div className="mt-3 text-center px-4">
            <h4 className="text-xs font-black text-slate-900">Grafana Telemetry &amp; n8n Schema</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Live multi-agent consensus, sparkline performance, and verified JSON/YAML payload logs.
            </p>
          </div>
        </div>

      </div>

      {/* Bottom Quote / Mission Footer */}
      <div className="max-w-4xl mx-auto mt-10 pt-6 border-t border-slate-200 text-center text-xs text-slate-500 space-y-2">
        <p className="font-mono text-blue-700 font-bold">
          SENTINEXA · LIGHT EDITION · TAMIL NADU MUNICIPAL &amp; EMERGENCY RESPONSE OPERATING SYSTEM
        </p>
        <p className="text-[11px] text-slate-500">
          Deployed with OpenStreetMap live tiles, Tamil Nadu District Boundaries, and resilient offline SQLite synchronization.
        </p>
      </div>
    </div>
  );
}
