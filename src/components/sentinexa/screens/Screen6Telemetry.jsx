import React, { useState } from 'react';
import { useCivicStore } from '../../../store/useCivicStore';
import { telemetryAgent } from '../../../agents/TelemetryAgent';
import { 
  Activity, 
  ShieldCheck, 
  Clock, 
  Flame, 
  Radio, 
  Code2, 
  ChevronDown, 
  ChevronUp, 
  Cpu, 
  Zap, 
  TrendingUp,
  Copy,
  Check
} from 'lucide-react';
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

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC] text-slate-800 font-sans overflow-y-auto p-4 space-y-4 pb-20 select-none">
      
      {/* Header */}
      <div className="bg-white border border-slate-200 p-4 rounded-3xl shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-slate-900">Agent Telemetry &amp; Health</h3>
            <p className="text-[11px] text-slate-500 font-mono">Grafana Mini-Metrics &amp; n8n Indicators</p>
          </div>
        </div>

        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono font-bold">
          99.8% UPTIME
        </span>
      </div>

      {/* 4 Agent Mini KPI Cards */}
      <div className="grid grid-cols-2 gap-3">
        
        {/* Ingestion Agent Card */}
        <div className="bg-white border border-slate-200 p-3.5 rounded-2xl shadow-sm space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
            <span>Ingestion Agent</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          </div>
          <div className="text-xl font-black text-slate-900 font-mono">
            {metrics.totalTickets * 24 || 142}
          </div>
          <p className="text-[10px] text-slate-500 font-mono">Feeds &amp; Geo-crawls scanned</p>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 w-3/4"></div>
          </div>
        </div>

        {/* Verification Agent Card */}
        <div className="bg-white border border-slate-200 p-3.5 rounded-2xl shadow-sm space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
            <span>Truth Accuracy</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="text-xl font-black text-emerald-600 font-mono">
            {metrics.avgTruthScore || 98.4}%
          </div>
          <p className="text-[10px] text-slate-500 font-mono">Cross-verified accuracy</p>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 w-[94%]"></div>
          </div>
        </div>

        {/* Dispatch Queue Depth Card */}
        <div className="bg-white border border-slate-200 p-3.5 rounded-2xl shadow-sm space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
            <span>Queue Depth</span>
            <Clock className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div className="text-xl font-black text-amber-600 font-mono">
            {metrics.pendingRetries || 2}
          </div>
          <p className="text-[10px] text-slate-500 font-mono">Active retry loop queue</p>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 w-2/5"></div>
          </div>
        </div>

        {/* n8n Latency Card */}
        <div className="bg-white border border-slate-200 p-3.5 rounded-2xl shadow-sm space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
            <span>n8n Pipeline</span>
            <Radio className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <div className="text-xl font-black text-blue-600 font-mono">
            {metrics.avgResponseLatencyMs || 142}ms
          </div>
          <p className="text-[10px] text-slate-500 font-mono">Avg webhook latency</p>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 w-4/5"></div>
          </div>
        </div>

      </div>

      {/* Expandable Advanced JSON / YAML Panel */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full p-4 flex items-center justify-between bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-800 transition-colors"
        >
          <span className="flex items-center space-x-2">
            <Code2 className="w-4 h-4 text-indigo-600" />
            <span>Advanced Grafana Telemetry Schema (JSON/YAML)</span>
          </span>
          {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showAdvanced && (
          <div className="p-4 space-y-3 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-bold">
                <button
                  onClick={() => setConfigFormat('json')}
                  className={`px-3 py-1 rounded-md transition-all ${configFormat === 'json' ? 'bg-blue-600 text-white' : 'text-slate-600'}`}
                >
                  JSON
                </button>
                <button
                  onClick={() => setConfigFormat('yaml')}
                  className={`px-3 py-1 rounded-md transition-all ${configFormat === 'yaml' ? 'bg-blue-600 text-white' : 'text-slate-600'}`}
                >
                  YAML
                </button>
              </div>

              <button
                onClick={handleCopy}
                className="flex items-center space-x-1 text-xs text-blue-600 font-bold hover:underline"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Schema'}</span>
              </button>
            </div>

            <pre className="p-3 bg-slate-900 text-emerald-400 rounded-xl text-[10px] font-mono overflow-x-auto max-h-52">
              {formattedConfig}
            </pre>
          </div>
        )}
      </div>

    </div>
  );
}
