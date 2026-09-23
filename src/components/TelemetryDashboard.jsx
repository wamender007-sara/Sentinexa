import React, { useState } from 'react';
import { useCivicStore } from '../store/useCivicStore';
import { telemetryAgent } from '../agents/TelemetryAgent';
import { 
  Activity, 
  ShieldCheck, 
  Clock, 
  Flame, 
  Radio, 
  Code2, 
  Copy, 
  Check, 
  BarChart3, 
  TrendingUp, 
  Layers, 
  CheckCircle2 
} from 'lucide-react';
import YAML from 'yaml';

export default function TelemetryDashboard() {
  const store = useCivicStore();
  const metrics = telemetryAgent.getTelemetryMetrics(store);
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
    <div className="max-w-[1600px] mx-auto p-4 sm:p-6 space-y-6 font-sans animate-fade-in">
      
      {/* Header Banner */}
      <div className="bg-white border border-[#D9E2EC] p-6 rounded-2xl shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-[#E0F2FE] text-[#0EA5C6] flex items-center justify-center font-extrabold border border-[#0EA5C6]/20">
            <Activity className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-[#14213D] tracking-tight">
              Operational Analytics & Telemetry Engine
            </h2>
            <p className="text-xs text-[#52616B] font-mono">
              Grafana-grade telemetry schemas, response performance & workload analytics
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono px-3 py-1.5 rounded-full bg-[#EAF7EE] text-[#16803C] border border-[#16803C]/20 font-bold">
          <span className="w-2 h-2 rounded-full bg-[#16803C] animate-ping"></span>
          <span>HEALTH: OPERATIONAL (64ms Latency)</span>
        </div>
      </div>

      {/* Analytics Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        <div className="bg-white border border-[#D9E2EC] p-5 rounded-2xl shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between text-[#52616B] text-xs font-bold uppercase tracking-wider">
            <span>Operational Streak</span>
            <Flame className="w-4 h-4 text-[#C97700]" />
          </div>
          <div>
            <div className="text-3xl font-extrabold text-[#C97700] font-mono">
              {metrics.streakDays} <span className="text-sm font-sans font-semibold text-[#52616B]">Days</span>
            </div>
            <p className="text-[11px] text-[#52616B] mt-1">Zero unhandled high-priority hazards</p>
          </div>
          <div className="pt-2 border-t border-[#D9E2EC] text-[10px] font-mono text-[#16803C]">
            Total Resolved: {metrics.solvedCount} Complaints
          </div>
        </div>

        <div className="bg-white border border-[#D9E2EC] p-5 rounded-2xl shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between text-[#52616B] text-xs font-bold uppercase tracking-wider">
            <span>Verified Accuracy Index</span>
            <ShieldCheck className="w-4 h-4 text-[#16803C]" />
          </div>
          <div>
            <div className="text-3xl font-extrabold text-[#16803C] font-mono">
              {metrics.avgTruthScore}%
            </div>
            <p className="text-[11px] text-[#52616B] mt-1">GPS & image evidence verification rating</p>
          </div>
          <div className="pt-2 border-t border-[#D9E2EC] text-[10px] font-mono text-[#1769E0]">
            Total Tracked: {metrics.totalTickets} Incidents
          </div>
        </div>

        <div className="bg-white border border-[#D9E2EC] p-5 rounded-2xl shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between text-[#52616B] text-xs font-bold uppercase tracking-wider">
            <span>2-3 Day Auto Retries</span>
            <Clock className="w-4 h-4 text-[#C97700]" />
          </div>
          <div>
            <div className="text-3xl font-extrabold text-[#C97700] font-mono">
              {metrics.pendingRetries} <span className="text-sm font-sans font-semibold text-[#52616B]">Active</span>
            </div>
            <p className="text-[11px] text-[#52616B] mt-1">Unacknowledged municipal complaints</p>
          </div>
          <div className="pt-2 border-t border-[#D9E2EC] text-[10px] font-mono text-[#C62828]">
            Escalated to Tier 2 Collectorate
          </div>
        </div>

        <div className="bg-white border border-[#D9E2EC] p-5 rounded-2xl shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between text-[#52616B] text-xs font-bold uppercase tracking-wider">
            <span>n8n Webhook Latency</span>
            <Radio className="w-4 h-4 text-[#1769E0]" />
          </div>
          <div>
            <div className="text-3xl font-extrabold text-[#1769E0] font-mono">
              {metrics.avgResponseLatencyMs} <span className="text-sm font-sans font-semibold text-[#52616B]">ms</span>
            </div>
            <p className="text-[11px] text-[#52616B] mt-1">Average workflow trigger roundtrip</p>
          </div>
          <div className="pt-2 border-t border-[#D9E2EC] text-[10px] font-mono text-[#16803C]">
            Success Rate: {metrics.n8nSuccessRate}
          </div>
        </div>

      </div>

      {/* Analytics Breakdown Visual Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Visual Chart Card 1: Category Distribution */}
        <div className="bg-white border border-[#D9E2EC] p-6 rounded-2xl shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#D9E2EC] pb-3">
            <h3 className="font-extrabold text-sm text-[#14213D] flex items-center space-x-2">
              <BarChart3 className="w-4 h-4 text-[#1769E0]" />
              <span>Incidents by Category & Urgency</span>
            </h3>
            <span className="text-xs font-mono text-[#52616B]">Citywide Distribution</span>
          </div>

          <div className="space-y-3">
            {[
              { label: 'Emergency SOS & Accidents', count: 18, pct: '25%', color: 'bg-[#C62828]' },
              { label: 'Storm Drains & Water Leaks', count: 34, pct: '45%', color: 'bg-[#C97700]' },
              { label: 'Monsoon Weather Surge', count: 14, pct: '20%', color: 'bg-[#0EA5C6]' },
              { label: 'TNEB Cable & Potholes', count: 8, pct: '10%', color: 'bg-[#1769E0]' }
            ].map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-[#14213D]">
                  <span>{item.label}</span>
                  <span className="font-mono text-[#52616B]">{item.count} ({item.pct})</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#F1F5F9] overflow-hidden">
                  <div className={`h-full ${item.color}`} style={{ width: item.pct }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Visual Chart Card 2: Resolution Success Rate */}
        <div className="bg-white border border-[#D9E2EC] p-6 rounded-2xl shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#D9E2EC] pb-3">
            <h3 className="font-extrabold text-sm text-[#14213D] flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-[#16803C]" />
              <span>Closed-Loop Resolution Performance</span>
            </h3>
            <span className="text-xs font-mono text-[#52616B]">Weekly Trend</span>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-[#F8FAFC] border border-[#D9E2EC] rounded-xl space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#52616B]">Resolved</span>
              <div className="text-xl font-extrabold text-[#16803C] font-mono">184</div>
            </div>
            <div className="p-3 bg-[#F8FAFC] border border-[#D9E2EC] rounded-xl space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#52616B]">Open</span>
              <div className="text-xl font-extrabold text-[#1769E0] font-mono">12</div>
            </div>
            <div className="p-3 bg-[#F8FAFC] border border-[#D9E2EC] rounded-xl space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#52616B]">Escalated</span>
              <div className="text-xl font-extrabold text-[#C62828] font-mono">3</div>
            </div>
          </div>

          <p className="text-xs text-[#52616B] font-mono leading-relaxed pt-2">
            Closed-loop validation ensures complaints are marked resolved only when verified by ground evidence. Unacknowledged tickets trigger Tier 2 n8n escalations every 2-3 days.
          </p>
        </div>

      </div>

      {/* JSON/YAML Grafana Configuration View */}
      <div className="bg-white border border-[#D9E2EC] rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#D9E2EC] pb-3">
          <div className="flex items-center space-x-2">
            <Code2 className="w-5 h-5 text-[#6D4CCB]" />
            <h3 className="font-extrabold text-[#14213D] text-sm">
              Grafana Dashboard Telemetry Schema View
            </h3>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex bg-[#F1F5F9] p-1 rounded-xl border border-[#D9E2EC] text-xs font-semibold">
              <button
                onClick={() => setConfigFormat('json')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  configFormat === 'json' ? 'bg-[#1769E0] text-white' : 'text-[#52616B]'
                }`}
              >
                JSON
              </button>
              <button
                onClick={() => setConfigFormat('yaml')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  configFormat === 'yaml' ? 'bg-[#1769E0] text-white' : 'text-[#52616B]'
                }`}
              >
                YAML
              </button>
            </div>

            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-xl bg-[#F1F5F9] hover:bg-[#EAF1F8] text-[#14213D] text-xs font-bold border border-[#D9E2EC] flex items-center space-x-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#16803C]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Schema'}</span>
            </button>
          </div>
        </div>

        <div className="bg-[#F8FAFC] border border-[#D9E2EC] rounded-2xl p-4 font-mono text-xs text-[#0B2E59] overflow-x-auto max-h-96">
          <pre>{formattedConfig}</pre>
        </div>
      </div>

    </div>
  );
}
