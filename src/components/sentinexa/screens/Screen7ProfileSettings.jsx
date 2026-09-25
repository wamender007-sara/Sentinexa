import React, { useState } from 'react';
import { 
  Globe, Bell, Shield, Award, ChevronRight, Smartphone, MapPin, 
  Zap, Play, Copy, Check, RefreshCw, Mail, MessageSquare, Send
} from 'lucide-react';
import { useCivicStore } from '../../../store/useCivicStore';
import { n8nService } from '../../../services/n8nService';

const N8N_WORKFLOW_TEMPLATE = {
  "name": "Sentinexa Autonomous Civic & Emergency Response Mesh",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "sentinexa-dispatch",
        "responseMode": "responseNode",
        "options": {}
      },
      "id": "sentinexa-webhook-input",
      "name": "Sentinexa Webhook",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 2,
      "position": [240, 300],
      "webhookId": "sentinexa-dispatch"
    },
    {
      "parameters": {
        "conditions": {
          "options": {
            "caseSensitive": true,
            "leftValue": "",
            "typeValidation": "strict"
          },
          "conditions": [
            {
              "id": "check-emergency-condition",
              "leftValue": "={{ $json.body?.type || $json.type }}",
              "rightValue": "EMERGENCY",
              "operator": { "type": "string", "operation": "equals" }
            }
          ],
          "combinator": "and"
        },
        "options": {}
      },
      "id": "if-emergency-filter",
      "name": "Is Priority 1 Emergency?",
      "type": "n8n-nodes-base.if",
      "typeVersion": 2,
      "position": [480, 240]
    },
    {
      "parameters": {
        "toEmail": "={{ $json.body?.recipientEmail || $json.body?.secondaryEmail || 'saravanprasanna007@gmail.com' }}",
        "subject": "={{ $json.body?.emailSubject || '[SENTINEXA ALERT] Problem Reported' }}",
        "text": "={{ $json.body?.emailMessage || 'Incident report dispatched' }}",
        "html": "={{ $json.body?.emailHtml || '<p>Problem reported via Sentinexa</p>' }}",
        "options": {}
      },
      "id": "send-email-secondary-node",
      "name": "Send Alert to Secondary Mail",
      "type": "n8n-nodes-base.emailSend",
      "typeVersion": 2.1,
      "position": [480, 440]
    },
    {
      "parameters": {
        "respondWith": "json",
        "responseBody": "={{ JSON.stringify({ success: true, status: 'DISPATCHED_TO_EMERGENCY_MESH', ticketId: $json.body?.ticketId || $json.ticketId, targetHospital: 'Coimbatore Medical College Hospital (CMCH)', eta: '3 mins', secondaryEmailAlertSent: true, timestamp: new Date().toISOString() }) }}",
        "options": {}
      },
      "id": "respond-emergency-ack",
      "name": "Respond SOS Dispatched",
      "type": "n8n-nodes-base.respondToWebhook",
      "typeVersion": 1.1,
      "position": [760, 160]
    },
    {
      "parameters": {
        "respondWith": "json",
        "responseBody": "={{ JSON.stringify({ success: true, status: 'ROUTED_TO_MUNICIPAL_WARD_SLA_48H', ticketId: $json.body?.ticketId || $json.ticketId, department: $json.body?.department || $json.department || 'CCMC Infrastructure & Roads Wing', slaHours: 48, secondaryEmailAlertSent: true, escalationDate: new Date(Date.now() + 48*3600*1000).toISOString(), timestamp: new Date().toISOString() }) }}",
        "options": {}
      },
      "id": "respond-civic-ack",
      "name": "Respond Civic Grievance Routed",
      "type": "n8n-nodes-base.respondToWebhook",
      "typeVersion": 1.1,
      "position": [760, 320]
    }
  ],
  "connections": {
    "Sentinexa Webhook": {
      "main": [
        [
          { "node": "Is Priority 1 Emergency?", "type": "main", "index": 0 },
          { "node": "Send Alert to Secondary Mail", "type": "main", "index": 0 }
        ]
      ]
    },
    "Is Priority 1 Emergency?": {
      "main": [
        [{ "node": "Respond SOS Dispatched", "type": "main", "index": 0 }],
        [{ "node": "Respond Civic Grievance Routed", "type": "main", "index": 0 }]
      ]
    }
  },
  "active": false,
  "settings": { "executionOrder": "v1" }
};

export default function Screen7ProfileSettings({ onBack }) {
  const userLocation = useCivicStore(state => state.userLocation);
  const n8nConfig = useCivicStore(state => state.n8nConfig);
  const updateN8nConfig = useCivicStore(state => state.updateN8nConfig);
  const addN8nLog = useCivicStore(state => state.addN8nLog);
  const prototypeSettings = useCivicStore(state => state.prototypeSettings);
  const setPrototypeSettings = useCivicStore(state => state.setPrototypeSettings);

  const [lang, setLang] = useState('en');
  const [notifs, setNotifs] = useState({
    emergency: true,
    civic: true,
    agents: false
  });
  const [offlineSync, setOfflineSync] = useState(true);

  // Prototype Email & Phone settings
  const [secondaryEmail, setSecondaryEmail] = useState(prototypeSettings?.secondaryEmail || '');
  const [secondaryPhone, setSecondaryPhone] = useState(prototypeSettings?.secondaryPhone || '');
  const [protoSaved, setProtoSaved] = useState(false);
  const [protoTestSent, setProtoTestSent] = useState(false);

  // n8n states
  const [webhookUrl, setWebhookUrl] = useState(n8nConfig?.complaintWebhookUrl || 'https://n8n.example.com/webhook/civic-complaint-dispatch');
  const [simulationMode, setSimulationMode] = useState(n8nConfig?.simulationMode ?? true);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [copiedWorkflow, setCopiedWorkflow] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const Toggle = ({ checked, onChange }) => (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`w-10 h-5.5 rounded-full transition-colors flex items-center px-0.5 ${checked ? 'bg-blue-600' : 'bg-slate-200'}`}
    >
      <span className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-4.5' : 'translate-x-0'}`} />
    </button>
  );

  const city = userLocation?.city || 'Coimbatore';
  const district = userLocation?.district || 'Coimbatore';
  const isTamil = lang === 'ta';

  const handleSavePrototype = () => {
    setPrototypeSettings({
      secondaryEmail,
      secondaryPhone
    });
    setProtoSaved(true);
    setTimeout(() => setProtoSaved(false), 2500);
  };

  const handleSendTestProtoAlert = async () => {
    setProtoTestSent(true);

    const testPayload = {
      event: 'TEST_PROTOTYPE_ALERT',
      type: 'CIVIC',
      ticketId: 'TEST-' + Math.floor(1000 + Math.random() * 9000),
      title: 'Road Damage & Pothole Alert (Prototype Test)',
      description: 'Prototype test incident: Pothole detected in Coimbatore. Forwarded to secondary mail.',
      recipientEmail: secondaryEmail || 'saravanprasanna007@gmail.com',
      secondaryEmail: secondaryEmail || 'saravanprasanna007@gmail.com',
      secondaryPhone: secondaryPhone || '',
      emailSubject: '[SENTINEXA PROTOTYPE TEST] Problem Dispatched to Secondary Mail',
      emailMessage: `Test incident report successfully generated and sent to: ${secondaryEmail || 'your secondary mail'}`,
      timestamp: new Date().toISOString()
    };

    await n8nService.triggerWebhook(webhookUrl, testPayload, {
      ...n8nConfig,
      simulationMode
    });

    setTimeout(() => setProtoTestSent(false), 3000);
  };

  const handleSaveN8n = () => {
    updateN8nConfig({
      complaintWebhookUrl: webhookUrl,
      emergencyWebhookUrl: webhookUrl,
      simulationMode
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleTestN8n = async () => {
    setIsTesting(true);
    setTestResult(null);

    const testPayload = {
      event: 'TEST_N8N_ACCOUNT_CONNECTIVITY',
      type: 'CIVIC',
      ticketId: 'TEST-' + Math.floor(1000 + Math.random() * 9000),
      title: 'Connectivity Ping from Sentinexa',
      recipientEmail: secondaryEmail || 'saravanprasanna007@gmail.com',
      secondaryEmail: secondaryEmail || 'saravanprasanna007@gmail.com',
      emailSubject: '[SENTINEXA ALERT] Connectivity Test Ping',
      timestamp: new Date().toISOString()
    };

    const res = await n8nService.triggerWebhook(webhookUrl, testPayload, {
      ...n8nConfig,
      simulationMode
    });

    addN8nLog({
      endpoint: webhookUrl,
      type: 'TEST_PING',
      status: res.success ? 200 : 500,
      mode: res.simulated ? 'SIMULATED' : 'LIVE',
      response: res.data
    });

    setIsTesting(false);
    setTestResult(res);
  };

  const handleCopyWorkflow = () => {
    navigator.clipboard.writeText(JSON.stringify(N8N_WORKFLOW_TEMPLATE, null, 2));
    setCopiedWorkflow(true);
    setTimeout(() => setCopiedWorkflow(false), 2500);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 overflow-y-auto pb-20">

      {/* Header */}
      <div className="bg-white px-4 pt-3 pb-3 shadow-sm border-b border-slate-100">
        <div className="flex items-center justify-between">
          <h2 className="font-black text-slate-900 text-base flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-600" />
            {isTamil ? 'அமைப்புகள் & அஞ்சல் வழிநடத்தல்' : 'Settings & Alert Routing'}
          </h2>
          <button onClick={onBack}
            className="text-xs bg-slate-100 text-slate-700 px-3 py-1.5 rounded-xl font-bold border border-slate-200">
            Done
          </button>
        </div>
      </div>

      <div className="p-4 space-y-3">

        {/* Profile Badge */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-4 flex items-center gap-3 shadow-lg shadow-blue-200">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
            <Award className="w-7 h-7 text-white" />
          </div>
          <div>
            <p className="text-white font-black text-sm">Verified Civic Scout</p>
            <p className="text-blue-100 text-[11px]">Level 4 · 42 Reports Resolved</p>
            <div className="flex items-center gap-1.5 mt-1">
              <MapPin className="w-3 h-3 text-blue-200" />
              <span className="text-blue-100 text-[11px]">{city}, {district}</span>
            </div>
          </div>
          <span className="ml-auto px-2.5 py-1 rounded-full bg-white/20 text-white text-[10px] font-bold">
            🔥 42d
          </span>
        </div>

        {/* ── PROTOTYPE SECONDARY MAIL & MESSAGE ROUTING CARD ── */}
        <div className="bg-white rounded-2xl border border-blue-200 shadow-sm overflow-hidden">
          <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Prototype Secondary Mail & Alerts
                </h3>
                <p className="text-[10px] text-slate-500">Auto-routes all problem reports & photo evidence</p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
              Prototype Mode
            </span>
          </div>

          <div className="p-3.5 space-y-3">
            {/* Secondary Email Input */}
            <div>
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-blue-600" />
                Secondary Email Address (Where alerts will be sent)
              </label>
              <input
                type="email"
                value={secondaryEmail}
                onChange={(e) => setSecondaryEmail(e.target.value)}
                placeholder="your-secondary-mail@gmail.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                Every problem report (photo, GPS coordinates, department, AI diagnosis) will be sent to this email.
              </p>
            </div>

            {/* Secondary Phone Input */}
            <div>
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1 flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                Secondary Phone / SMS (Optional)
              </label>
              <input
                type="tel"
                value={secondaryPhone}
                onChange={(e) => setSecondaryPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Save & Test Buttons */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleSavePrototype}
                className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{protoSaved ? 'Saved Successfully! ✓' : 'Save Secondary Mail'}</span>
              </button>

              <button
                type="button"
                onClick={handleSendTestProtoAlert}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-200 flex items-center gap-1 transition-colors"
                title="Send a sample problem alert to your secondary mail"
              >
                <Send className="w-3.5 h-3.5 text-blue-600" />
                <span>{protoTestSent ? 'Test Alert Sent! ✓' : 'Test Alert'}</span>
              </button>
            </div>

            {/* Quick Mailto Direct Link */}
            {secondaryEmail && (
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-center justify-between">
                <span>Active Target: <strong className="text-blue-700">{secondaryEmail}</strong></span>
                <a
                  href={`mailto:${secondaryEmail}?subject=${encodeURIComponent('[SENTINEXA ALERT] Prototype Problem Notification')}&body=${encodeURIComponent('This is a verified prototype problem report from Sentinexa Civic Intelligence Mesh.')}`}
                  className="text-blue-600 font-bold hover:underline"
                >
                  Send Direct Mail ↗
                </a>
              </div>
            )}
          </div>
        </div>

        {/* ── n8n Automation Engine Card ── */}
        <div className="bg-white rounded-2xl border border-indigo-100 shadow-sm overflow-hidden">
          <div className="px-4 py-3 bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-indigo-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  n8n Automation Engine
                </h3>
                <p className="text-[10px] text-slate-500 font-mono">Live Webhooks & Workflow Triggers</p>
              </div>
            </div>
            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
              simulationMode
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}>
              {simulationMode ? 'Simulation Mode' : 'Live Webhooks Active'}
            </span>
          </div>

          <div className="p-3.5 space-y-3">
            {/* Simulation Mode Toggle */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <p className="text-xs font-bold text-slate-800">Simulation Fallback</p>
                <p className="text-[10px] text-slate-400">Simulate response if live n8n webhook is offline</p>
              </div>
              <Toggle checked={simulationMode} onChange={setSimulationMode} />
            </div>

            {/* Webhook URL Input */}
            <div>
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1 block">
                n8n Webhook URL
              </label>
              <input
                type="text"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://your-n8n-instance.com/webhook/sentinexa-dispatch"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Point this to your n8n Webhook node endpoint (POST method).
              </p>
            </div>

            {/* Test Connection Button & Status */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleTestN8n}
                disabled={isTesting}
                className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all disabled:opacity-50"
              >
                {isTesting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isTesting ? 'Pinging n8n...' : 'Test n8n Webhook'}</span>
              </button>

              <button
                type="button"
                onClick={handleSaveN8n}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-200 transition-colors"
              >
                {isSaved ? 'Saved! ✓' : 'Save'}
              </button>
            </div>

            {/* Test Result Message */}
            {testResult && (
              <div className={`p-2.5 rounded-xl border text-xs font-mono flex items-start gap-2 ${
                testResult.success
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}>
                <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-bold">
                    {testResult.simulated ? 'Simulated Connection 200 OK' : 'Live n8n Webhook Connected! 200 OK'}
                  </p>
                  <p className="text-[10px] text-slate-600 mt-0.5">
                    Execution ID: {testResult.data?.executionId || 'n8n_exec_verified'}
                  </p>
                </div>
              </div>
            )}

            {/* Ready-Made n8n Workflow Export */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-800">Ready n8n Workflow JSON</p>
                <p className="text-[10px] text-slate-400">Includes Send Email to Secondary Mail node</p>
              </div>
              <button
                type="button"
                onClick={handleCopyWorkflow}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-indigo-700 border border-indigo-200 font-bold text-xs flex items-center gap-1 transition-colors"
              >
                {copiedWorkflow ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedWorkflow ? 'Copied JSON!' : 'Copy Workflow'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Language */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-50">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" /> Language
            </h3>
          </div>
          <div className="px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900">App Language</p>
              <p className="text-[11px] text-slate-400">English / தமிழ்</p>
            </div>
            <div className="flex bg-slate-100 p-0.5 rounded-xl gap-0.5 text-xs font-bold">
              <button onClick={() => setLang('en')}
                className={`px-3 py-1.5 rounded-lg transition-all ${lang === 'en' ? 'bg-blue-600 text-white shadow' : 'text-slate-600'}`}>
                EN
              </button>
              <button onClick={() => setLang('ta')}
                className={`px-3 py-1.5 rounded-lg transition-all ${lang === 'ta' ? 'bg-blue-600 text-white shadow' : 'text-slate-600'}`}>
                தமிழ்
              </button>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-50">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5" /> Notifications
            </h3>
          </div>
          {[
            { key: 'emergency', label: 'Emergency Alerts', sub: 'Critical 108 / 100 dispatches', color: 'text-red-600' },
            { key: 'civic', label: 'Civic Updates', sub: 'SLA alerts & ticket updates', color: 'text-blue-600' },
            { key: 'agents', label: 'AI Agent Activity', sub: 'Pipeline steps & telemetry', color: 'text-indigo-600' }
          ].map(({ key, label, sub, color }) => (
            <div key={key} className="flex items-center justify-between px-4 py-3 border-b border-slate-50 last:border-0">
              <div>
                <p className={`text-sm font-semibold ${color}`}>{label}</p>
                <p className="text-[11px] text-slate-400">{sub}</p>
              </div>
              <Toggle
                checked={notifs[key]}
                onChange={v => setNotifs(prev => ({ ...prev, [key]: v }))}
              />
            </div>
          ))}
        </div>

        {/* Device & Sync */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-50">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5" /> Device & Sync
            </h3>
          </div>
          <div className="flex items-center justify-between px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">Offline Queue</p>
              <p className="text-[11px] text-slate-400">Auto-sync when reconnected</p>
            </div>
            <Toggle checked={offlineSync} onChange={setOfflineSync} />
          </div>
        </div>

        {/* Quick Dial */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-50">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Emergency Contacts</h3>
          </div>
          {[
            { label: 'Police Control Room', number: '100' },
            { label: 'Ambulance Service', number: '108' },
            { label: 'Fire & Rescue', number: '101' }
          ].map(({ label, number }) => (
            <a key={number} href={`tel:${number}`}
              className="flex items-center justify-between px-4 py-3 border-b border-slate-50 last:border-0 hover:bg-slate-50 active:bg-slate-100">
              <div>
                <p className="text-sm font-semibold text-slate-900">{label}</p>
                <p className="text-xs font-mono text-blue-600">{number}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </a>
          ))}
        </div>

        {/* App Info */}
        <div className="text-center pt-1 space-y-0.5">
          <p className="text-xs font-black text-slate-400">SENTIN<span className="text-blue-500">EXA</span></p>
          <p className="text-[10px] text-slate-300 font-mono">v2.1.0 · Tamil Nadu Civic Intelligence Mesh</p>
        </div>
      </div>
    </div>
  );
}
