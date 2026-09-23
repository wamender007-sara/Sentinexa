import React, { useState } from 'react';
import { useCivicStore } from '../store/useCivicStore';
import { n8nService } from '../services/n8nService';
import { Settings, Save, Zap, Play, Terminal, CheckCircle2, AlertCircle, Key, Link } from 'lucide-react';

export default function N8nConfigModal() {
  const { n8nConfig, updateN8nConfig, n8nLogs, addN8nLog } = useCivicStore();
  const [formConfig, setFormConfig] = useState(n8nConfig);
  const [isSaved, setIsSaved] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const handleSave = (e) => {
    e.preventDefault();
    updateN8nConfig(formConfig);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleTestWebhook = async () => {
    setIsTesting(true);
    setTestResult(null);

    const testPayload = {
      event: 'TEST_N8N_ACCOUNT_CONNECTIVITY',
      timestamp: new Date().toISOString(),
      platform: 'CivicPulse AGY Multi-Agent Platform',
      environment: 'Production Integration'
    };

    const res = await n8nService.triggerWebhook(formConfig.emergencyWebhookUrl, testPayload, formConfig);
    
    addN8nLog({
      endpoint: formConfig.emergencyWebhookUrl,
      type: 'TEST_TRIGGER',
      status: res.success ? 200 : 500,
      mode: res.simulated ? 'SIMULATED' : 'LIVE',
      response: res.data
    });

    setIsTesting(false);
    setTestResult(res);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Zap className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              n8n External Account Integration
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Configure Webhook endpoints & API triggers for automated workflows
            </p>
          </div>
        </div>

        <button
          onClick={handleTestWebhook}
          disabled={isTesting}
          className="px-4 py-2.5 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold text-xs shadow-lg shadow-cyan-600/30 flex items-center space-x-2 transition-transform active:scale-95 disabled:opacity-50"
        >
          <Play className="w-4 h-4" />
          <span>{isTesting ? 'TESTING...' : 'TEST n8n WEBHOOK'}</span>
        </button>
      </div>

      {/* Form Grid */}
      <form onSubmit={handleSave} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
        
        {/* Simulation Mode Toggle */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-100 text-sm">Simulation Mode Fallback</h3>
            <p className="text-xs text-slate-400">
              When enabled or if live n8n webhooks are offline, payload deliveries will seamlessly simulate execution logs.
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formConfig.simulationMode}
              onChange={(e) => setFormConfig({ ...formConfig, simulationMode: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>

        <div className="space-y-4">
          
          {/* Emergency Webhook */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center space-x-1.5">
              <Link className="w-3.5 h-3.5 text-red-400" />
              <span>Priority Emergency Webhook Endpoint</span>
            </label>
            <input
              type="url"
              value={formConfig.emergencyWebhookUrl}
              onChange={(e) => setFormConfig({ ...formConfig, emergencyWebhookUrl: e.target.value })}
              placeholder="https://n8n.example.com/webhook/civic-emergency-priority"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-cyan-300 font-mono focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          {/* Complaint Webhook */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center space-x-1.5">
              <Link className="w-3.5 h-3.5 text-indigo-400" />
              <span>Municipal Grievance Complaint Webhook Endpoint</span>
            </label>
            <input
              type="url"
              value={formConfig.complaintWebhookUrl}
              onChange={(e) => setFormConfig({ ...formConfig, complaintWebhookUrl: e.target.value })}
              placeholder="https://n8n.example.com/webhook/civic-complaint-dispatch"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-cyan-300 font-mono focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          {/* 2-3 Day Retry Escalation Webhook */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center space-x-1.5">
              <Link className="w-3.5 h-3.5 text-amber-400" />
              <span>2-3 Day Auto Escalation Retry Webhook Endpoint</span>
            </label>
            <input
              type="url"
              value={formConfig.retryEscalationWebhookUrl}
              onChange={(e) => setFormConfig({ ...formConfig, retryEscalationWebhookUrl: e.target.value })}
              placeholder="https://n8n.example.com/webhook/civic-2day-escalation"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-cyan-300 font-mono focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          {/* API Header / Authorization Key */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center space-x-1.5">
              <Key className="w-3.5 h-3.5 text-amber-400" />
              <span>n8n Account API Key / Header Auth (Optional)</span>
            </label>
            <input
              type="password"
              value={formConfig.apiKey}
              onChange={(e) => setFormConfig({ ...formConfig, apiKey: e.target.value })}
              placeholder="Enter X-N8N-API-KEY or Bearer Secret Token"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>

        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          {isSaved ? (
            <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>n8n Configuration Saved Successfully!</span>
            </span>
          ) : (
            <span className="text-xs text-slate-400 font-mono">
              Changes apply instantly across all multi-agent dispatch triggers.
            </span>
          )}

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 flex items-center space-x-2 transition-transform active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>SAVE n8n CONFIGURATION</span>
          </button>
        </div>

      </form>

      {/* n8n Webhook Execution Log History */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center space-x-2">
          <Terminal className="w-5 h-5 text-cyan-400" />
          <h3 className="font-bold text-slate-100 text-sm">
            n8n Webhook Delivery Audit Log ({n8nLogs.length})
          </h3>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 font-mono text-xs text-slate-300 space-y-3 max-h-80 overflow-y-auto scrollbar-thin">
          {n8nLogs.length === 0 ? (
            <p className="text-slate-500 italic">No webhook calls dispatched yet. Trigger an emergency or complaint!</p>
          ) : (
            n8nLogs.map(log => (
              <div key={log.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-cyan-400 font-bold">[{log.mode}] {log.type}</span>
                  <span className="text-slate-500">{log.timestamp}</span>
                </div>
                <p className="text-slate-400 text-[10px] truncate">{log.endpoint}</p>
                <div className="bg-slate-950 p-2 rounded-lg text-[10px] text-emerald-400">
                  <pre>{JSON.stringify(log.response, null, 2)}</pre>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
