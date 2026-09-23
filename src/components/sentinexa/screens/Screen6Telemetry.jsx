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
    <div className="flex flex-col space-y-4 pb-20 font-sans text-[#14213D] animate-fade-in">
      
      {/* Header */}
      <div className="bg-white border border-[#D9E2EC] p-4 rounded-3xl shadow-xs flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-[#E0F2FE] text-[#0EA5C6]">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-[#14213D]">Agent Telemetry & Health</h3>
            <p className="text-[11px] text-[#52616B] font-mono">Grafana Mini-Metrics & n8n Indicators</p>
          </div>
        </div>

        <span className="px-2 py-0.5 rounded-full bg-[#EAF7EE] text-[#16803C] text-[10px] font-mono font-bold">
          98.4% UPTIME
        </span>
      </div>

      {/* 4 Agent Mini KPI Cards */}
      <div className="grid grid-cols-2 gap-3">
        
        {/* Ingestion Agent Card */}
        <div className="bg-white border border-[#D9E2EC] p-3.5 rounded-2xl shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold text-[#52616B]">
            <span>Ingestion Agent</span>
            <span className="w-2 h-2 rounded-full bg-[#16803C]"></span>
          </div>
          <div className="text-xl font-black text-[#0B2E59] font-mono">
            {metrics.totalTickets * 24}
          </div>
          <p className="text-[10px] text-[#52616B] font-mono">Feeds & Geo-crawls scanned</p>
          {/* Sparkline simulation */}
          <div className="h-1.5 w-full bg-[#F1F5F9] rounded-full overflow-hidden">
            <div className="h-full bg-[#1769E0] w-3/4"></div>
          </div>
        </div>

        {/* Verification Agent Card */}
        <div className="bg-white border border-[#D9E2EC] p-3.5 rounded-2xl shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold text-[#52616B]">
            <span>Truth Accuracy</span>
            <ShieldCheck className="w-3.5 h-3.5 text-[#16803C]" />
          </div>
          <div className="text-xl font-black text-[#16803C] font-mono">
            {metrics.avgTruthScore}%
          </div>
          <p className="text-[10px] text-[#52616B] font-mono">Cross-verified accuracy</p>
          <div className="h-1.5 w-full bg-[#F1F5F9] rounded-full overflow-hidden">
            <div className="h-full bg-[#16803C] w-[94%]"></div>
          </div>
        </div>

        {/* Dispatch Queue Depth Card */}
        <div className="bg-white border border-[#D9E2EC] p-3.5 rounded-2xl shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold text-[#52616B]">
            <span>Queue Depth</span>
            <Clock className="w-3.5 h-3.5 text-[#C97700]" />
          </div>
          <div className="text-xl font-black text-[#C97700] font-mono">
            {metrics.pendingRetries}
          </div>
          <p className="text-[10px] text-[#52616B] font-mono">Active retry loop queue</p>
          <div className="h-1.5 w-full bg-[#F1F5F9] rounded-full overflow-hidden">
            <div className="h-full bg-[#C97700] w-2/5"></div>
          </div>
        </div>

        {/* n8n Latency Card */}
        <div className="bg-white border border-[#D9E2EC] p-3.5 rounded-2xl shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold text-[#52616B]">
            <span>n8n Pipeline</span>
            <Radio className="w-3.5 h-3.5 text-[#0EA5C6]" />
          </div>
          <div className="text-xl font-black text-[#0EA5C6] font-mono">
            {metrics.avgResponseLatencyMs}ms
          </div>
          <p className="text-[10px] text-[#52616B] font-mono">Avg webhook latency</p>
          <div className="h-1.5 w-full bg-[#F1F5F9] rounded-full overflow-hidden">
            <div className="h-full bg-[#0EA5C6] w-4/5"></div>
          </div>
        </div>

      </div>

      {/* Expandable Advanced JSON / YAML Panel */}
      <div className="bg-white border border-[#D9E2EC] rounded-2xl overflow-hidden shadow-xs">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full p-4 flex items-center justify-between bg-[#F8FAFC] text-xs font-bold text-[#0B2E59]"
        >
          <span className="flex items-center space-x-2">
            <Code2 className="w-4 h-4 text-[#6D4CCB]" />
            <span>Advanced Grafana Telemetry Schema (JSON/YAML)</span>
          </span>
          {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showAdvanced && (
          <div className="p-4 space-y-3 border-t border-[#D9E2EC] animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex bg-[#F1F5F9] p-0.5 rounded-lg border border-[#D9E2EC] text-[11px] font-bold">
                <button
                  onClick={() => setConfigFormat('json')}
                  className={`px-2.5 py-0.5 rounded-md ${configFormat === 'json' ? 'bg-[#1769E0] text-white' : 'text-[#52616B]'}`}
                >
                  JSON
                </button>
                <button
                  onClick={() => setConfigFormat('yaml')}
                  className={`px-2.5 py-0.5 rounded-md ${configFormat === 'yaml' ? 'bg-[#1769E0] text-white' : 'text-[#52616B]'}`}
                >
                  YAML
                </button>
              </div>

              <button
                onClick={handleCopy}
                className="px-2.5 py-1 rounded-lg bg-[#F1F5F9] hover:bg-[#EAF1F8] text-[11px] font-mono flex items-center space-x-1"
              >
                {copied ? <Check className="w-3 h-3 text-[#16803C]" /> : <Copy className="w-3 h-3 text-[#52616B]" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="p-3 bg-[#0B2E59] text-cyan-300 font-mono text-[11px] rounded-xl overflow-x-auto max-h-60 scrollbar-thin">
              <pre>{formattedConfig}</pre>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
