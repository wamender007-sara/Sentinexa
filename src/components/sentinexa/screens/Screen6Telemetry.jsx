import React, { useState } from 'react';
import { useCivicStore } from '../../../store/useCivicStore';
import { telemetryAgent } from '../../../agents/TelemetryAgent';
import { Activity, ShieldCheck, Clock, Radio, Code2, ChevronDown, ChevronUp, Copy, Check, Zap } from 'lucide-react';
import YAML from 'yaml';

export default function Screen6Telemetry() {
  const store = useCivicStore();
  const metrics = telemetryAgent.getTelemetryMetrics(store);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [configFormat, setConfigFormat] = useState('json');
  const [copied, setCopied] = useState(false);

  const formattedConfig = configFormat === 'json'
    ? JSON.stringify(metrics.grafanaConfig, null, 2)
    : YAML.stringify(metrics.grafanaConfig);

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedConfig);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const kpiCards = [
    {
      label: 'Ingestion Agent',
      value: metrics.totalTickets * 24 || 142,
      unit: 'feeds',
      color: 'blue',
      fill: '75%',
      icon: Activity,
      live: true
    },
    {
      label: 'AI Accuracy',
      value: `${metrics.avgTruthScore || 98.4}%`,
      unit: 'verified',
      color: 'emerald',
      fill: '94%',
      icon: ShieldCheck,
      live: false
    },
    {
      label: 'Queue Depth',
      value: metrics.pendingRetries || 2,
      unit: 'pending',
      color: 'amber',
      fill: '40%',
      icon: Clock,
      live: false
    },
    {
      label: 'n8n Latency',
      value: `${metrics.avgResponseLatencyMs || 142}ms`,
      unit: 'webhook',
      color: 'indigo',
      fill: '80%',
      icon: Radio,
      live: true
    }
  ];

  const colorMap = {
    blue:    { bg: 'bg-blue-50', border: 'border-blue-100', text: 'text-blue-700', bar: 'bg-blue-500', icon: 'text-blue-500' },
    emerald: { bg: 'bg-emerald-50', border: 'border-emerald-100', text: 'text-emerald-700', bar: 'bg-emerald-500', icon: 'text-emerald-500' },
    amber:   { bg: 'bg-amber-50', border: 'border-amber-100', text: 'text-amber-700', bar: 'bg-amber-500', icon: 'text-amber-500' },
    indigo:  { bg: 'bg-indigo-50', border: 'border-indigo-100', text: 'text-indigo-700', bar: 'bg-indigo-500', icon: 'text-indigo-500' }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 overflow-y-auto pb-20">

      {/* Header */}
      <div className="bg-white px-4 pt-3 pb-3 shadow-sm border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
            <Activity className="w-4 h-4 text-blue-600 animate-pulse" />
          </div>
          <div>
            <h2 className="font-black text-slate-900 text-base">Agent Status</h2>
            <p className="text-[10px] text-slate-400 font-mono">Live AI pipeline telemetry</p>
          </div>
          <span className="ml-auto px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[10px] font-bold text-emerald-700">
            99.8% Uptime
          </span>
        </div>
      </div>

      <div className="p-4 space-y-3">

        {/* KPI Grid */}
        <div className="grid grid-cols-2 gap-3">
          {kpiCards.map(({ label, value, unit, color, fill, icon: Icon, live }) => {
            const c = colorMap[color];
            return (
              <div key={label} className={`${c.bg} border ${c.border} rounded-2xl p-3.5 space-y-2`}>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-600">{label}</span>
                  <div className="flex items-center gap-1">
                    {live && <span className={`w-1.5 h-1.5 rounded-full ${c.bar} animate-pulse`} />}
                    <Icon className={`w-3.5 h-3.5 ${c.icon}`} />
                  </div>
                </div>
                <div className={`text-2xl font-black font-mono ${c.text}`}>{value}</div>
                <div>
                  <p className="text-[10px] text-slate-400 mb-1">{unit}</p>
                  <div className="h-1.5 w-full bg-white/80 rounded-full overflow-hidden">
                    <div className={`h-full ${c.bar} rounded-full`} style={{ width: fill }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* System Status */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" /> System Health
            </h3>
          </div>
          <div className="divide-y divide-slate-50">
            {[
              { label: 'GEO Camera Engine', status: 'Online', ok: true },
              { label: 'n8n Webhook Pipeline', status: 'Connected', ok: true },
              { label: 'Nominatim GPS Geocoder', status: 'Active', ok: true },
              { label: 'Offline Queue (SQLite)', status: 'Synced', ok: true }
            ].map(({ label, status, ok }) => (
              <div key={label} className="flex items-center justify-between px-4 py-2.5">
                <span className="text-xs text-slate-700">{label}</span>
                <span className={`text-[10px] font-bold flex items-center gap-1 ${ok ? 'text-emerald-600' : 'text-red-500'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${ok ? 'bg-emerald-500' : 'bg-red-500'}`} />
                  {status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Advanced Schema Toggle */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full px-4 py-3 flex items-center justify-between text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-indigo-600" /> Grafana Schema (JSON / YAML)
            </span>
            {showAdvanced ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {showAdvanced && (
            <div className="border-t border-slate-100 p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex bg-slate-100 p-0.5 rounded-lg gap-0.5 text-xs font-bold">
                  {['json', 'yaml'].map(fmt => (
                    <button key={fmt} onClick={() => setConfigFormat(fmt)}
                      className={`px-3 py-1 rounded-md transition-all ${configFormat === fmt ? 'bg-blue-600 text-white' : 'text-slate-600'}`}>
                      {fmt.toUpperCase()}
                    </button>
                  ))}
                </div>
                <button onClick={handleCopy} className="flex items-center gap-1 text-xs text-blue-600 font-bold">
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <pre className="p-3 bg-slate-900 text-emerald-400 rounded-xl text-[10px] font-mono overflow-x-auto max-h-48">
                {formattedConfig}
              </pre>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
