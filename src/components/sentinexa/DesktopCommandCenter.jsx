import React, { useState } from 'react';
import { 
  Shield, AlertTriangle, Activity, Cpu, MapPin, Search, Filter, 
  ChevronRight, Phone, CheckCircle2, Clock, Globe, Terminal, 
  Layers, RefreshCw, Send, AlertCircle, Sparkles, Eye
} from 'lucide-react';
import GISMap from '../GISMap';

export default function DesktopCommandCenter() {
  const [selectedIncident, setSelectedIncident] = useState({
    id: 'TN-SOS-9042',
    type: 'Multi-Vehicle Collision',
    category: 'Accident / Medical Trauma',
    priority: 'CRITICAL',
    time: '3m ago',
    location: 'Anna Flyover, Mount Road, Chennai',
    lat: 13.0531,
    lng: 80.2518,
    status: 'DISPATCHING',
    eta: '6 mins (108 Unit #04)',
    hospital: 'Government General Hospital (2.1 km)',
    confidence: '98.4%',
    routingDept: '108 Ambulance & Traffic Police Control',
    assignedAgent: 'Agent-01 (Triage & Tensors)',
    slaExpiry: '04:12 mins remaining',
    image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&auto=format&fit=crop&q=80'
  });

  const [activeTab, setActiveTab] = useState('detail'); // 'detail' | 'telemetry' | 'n8n'
  const [filterType, setFilterType] = useState('all');

  const incidents = [
    {
      id: 'TN-SOS-9042',
      type: 'Multi-Vehicle Collision',
      category: 'Accident / Medical Trauma',
      priority: 'CRITICAL',
      time: '3m ago',
      location: 'Anna Flyover, Mount Road, Chennai',
      lat: 13.0531,
      lng: 80.2518,
      status: 'DISPATCHING',
      eta: '6 mins',
      hospital: 'Government General Hospital (2.1 km)',
      confidence: '98.4%',
      routingDept: '108 Ambulance & Traffic Police',
      assignedAgent: 'Agent-01 (Triage)',
      slaExpiry: '04:12 mins remaining',
      image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'CIVIC-8821',
      type: 'Deep Pothole & Road Cave-in',
      category: 'Roads & Bridges',
      priority: 'MEDIUM',
      time: '18m ago',
      location: 'Velachery Bypass Rd, Chennai',
      lat: 12.9815,
      lng: 80.2180,
      status: 'ROUTED_WARD',
      eta: 'SLA: 48 hrs',
      hospital: 'N/A',
      confidence: '94.2%',
      routingDept: 'Greater Chennai Corp - Ward 178',
      assignedAgent: 'Agent-04 (Gov Routing)',
      slaExpiry: '1d 21h remaining',
      image: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'CIVIC-8819',
      type: 'Overflowing Sewage Drain',
      category: 'Sanitation & Sewage',
      priority: 'HIGH',
      time: '42m ago',
      location: 'T. Nagar Ranganathan St, Chennai',
      lat: 13.0418,
      lng: 80.2337,
      status: 'ACKNOWLEDGED',
      eta: 'SLA: 24 hrs',
      hospital: 'N/A',
      confidence: '91.8%',
      routingDept: 'CMWSSB (Metro Water & Sewerage)',
      assignedAgent: 'Agent-02 (Computer Vision)',
      slaExpiry: '22h remaining',
      image: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'TN-SOS-9039',
      type: 'Transformer Fire Hazard',
      category: 'Fire & Electrical',
      priority: 'CRITICAL',
      time: '1h ago',
      location: 'Adyar Canal Bank Rd, Chennai',
      lat: 13.0067,
      lng: 80.2575,
      status: 'ON_SCENE',
      eta: 'TNEB Unit On Site',
      hospital: 'Apollo First Med on standby',
      confidence: '99.1%',
      routingDept: 'TANGEDCO & 101 Fire Control',
      assignedAgent: 'Agent-03 (Geo-Spatial)',
      slaExpiry: 'Resolved',
      image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&auto=format&fit=crop&q=80'
    }
  ];

  const mapIncidents = incidents.map(inc => ({
    id: inc.id,
    title: inc.type,
    category: inc.category,
    severity: inc.priority === 'CRITICAL' ? 'critical' : inc.priority === 'HIGH' ? 'high' : 'medium',
    lat: inc.lat,
    lng: inc.lng,
    status: inc.status,
    timestamp: inc.time,
    location: inc.location,
    photoUrl: inc.image
  }));

  return (
    <div className="w-full h-full flex flex-col bg-[#F8FAFC] text-slate-800 overflow-hidden select-none font-sans">
      
      {/* Top Desktop App Bar - Clean Light UI */}
      <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 z-30 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/20 text-white">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-black tracking-wider text-slate-900">SENTINEXA</h1>
              <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded font-mono font-bold">
                COMMAND CENTER v2.4 (LIGHT)
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-mono">Autonomous Multi-Agent Civic &amp; Emergency Grid · Tamil Nadu</p>
          </div>
        </div>

        {/* Global Status Telemetry Strip */}
        <div className="flex items-center gap-6 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-slate-500">n8n Engine:</span>
            <span className="text-emerald-700 font-bold">ACTIVE (142ms)</span>
          </div>
          <div className="flex items-center gap-2 border-l border-slate-200 pl-6">
            <Cpu className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-slate-500">Trained Agents:</span>
            <span className="text-blue-700 font-bold">5 Autonomous</span>
          </div>
          <div className="flex items-center gap-2 border-l border-slate-200 pl-6">
            <Activity className="w-3.5 h-3.5 text-amber-600" />
            <span className="text-slate-500">Active Queue:</span>
            <span className="text-amber-700 font-bold">14 Live</span>
          </div>
          <div className="flex items-center gap-2 border-l border-slate-200 pl-6">
            <Globe className="w-3.5 h-3.5 text-indigo-600" />
            <span className="text-slate-500">Region:</span>
            <span className="text-slate-800 font-semibold">Tamil Nadu / Chennai</span>
          </div>
        </div>
      </header>

      {/* 3-Column Layout Workspace */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* COLUMN 1: LEFT NAVIGATION & INCIDENT QUEUE (320px) */}
        <div className="w-[320px] bg-white border-r border-slate-200 flex flex-col shrink-0">
          
          {/* Filter Toolbar */}
          <div className="p-3 border-b border-slate-100 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wide">
                <Filter className="w-3.5 h-3.5 text-blue-600" /> Incident Queue
              </span>
              <span className="text-[10px] font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200 font-bold">
                {incidents.length} Pending
              </span>
            </div>
            
            {/* Filter buttons */}
            <div className="flex gap-1">
              <button 
                onClick={() => setFilterType('all')}
                className={`text-[10px] px-2.5 py-1 rounded font-medium transition-colors ${filterType === 'all' ? 'bg-blue-600 text-white font-bold' : 'bg-slate-100 text-slate-600 hover:text-slate-900'}`}
              >
                All
              </button>
              <button 
                onClick={() => setFilterType('critical')}
                className={`text-[10px] px-2.5 py-1 rounded font-medium transition-colors ${filterType === 'critical' ? 'bg-red-600 text-white font-bold' : 'bg-slate-100 text-slate-600 hover:text-slate-900'}`}
              >
                SOS (108/100)
              </button>
              <button 
                onClick={() => setFilterType('civic')}
                className={`text-[10px] px-2.5 py-1 rounded font-medium transition-colors ${filterType === 'civic' ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-100 text-slate-600 hover:text-slate-900'}`}
              >
                Civic
              </button>
            </div>
          </div>

          {/* Incidents Scrollable List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-2 bg-slate-50">
            {incidents
              .filter(i => filterType === 'all' || (filterType === 'critical' ? i.priority === 'CRITICAL' : i.priority !== 'CRITICAL'))
              .map((inc) => (
                <div
                  key={inc.id}
                  onClick={() => setSelectedIncident(inc)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedIncident?.id === inc.id
                      ? inc.priority === 'CRITICAL'
                        ? 'bg-red-50 border-red-400 ring-1 ring-red-400 shadow-sm'
                        : 'bg-blue-50 border-blue-400 ring-1 ring-blue-400 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                      inc.priority === 'CRITICAL' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {inc.priority}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">{inc.time}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{inc.type}</h4>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" /> {inc.location}
                  </p>
                  <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-500">
                    <span className="text-blue-600 font-bold">{inc.id}</span>
                    <span className="text-amber-600 font-bold">{inc.slaExpiry}</span>
                  </div>
                </div>
              ))}
          </div>

          {/* Quick Dispatch Bottom Bar */}
          <div className="p-3 bg-white border-t border-slate-200">
            <div className="text-[10px] font-mono text-slate-500 mb-2 uppercase font-bold">One-Tap Directives</div>
            <div className="grid grid-cols-2 gap-2">
              <button className="p-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm">
                <Phone className="w-3.5 h-3.5" /> 108 AMBULANCE
              </button>
              <button className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm">
                <Shield className="w-3.5 h-3.5" /> 100 POLICE
              </button>
            </div>
          </div>
        </div>

        {/* COLUMN 2: CENTER GIS FULL MAP & LIVE EVENT TICKER (flex-1) */}
        <div className="flex-1 flex flex-col relative overflow-hidden bg-slate-100">
          
          {/* Top Bar for Map Controls */}
          <div className="h-10 bg-white/95 border-b border-slate-200 px-4 flex items-center justify-between text-xs text-slate-700 z-10 shrink-0 shadow-xs">
            <div className="flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              <span className="font-mono text-[11px] text-blue-700 font-bold">GIS LAYERS:</span>
              <span className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">Real-Time OpenStreetMap</span>
              <span className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">Tamil Nadu District Mesh</span>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-mono">
              <span className="text-slate-500">Focus: <strong className="text-slate-900">Chennai CMA</strong></span>
              <span className="text-slate-300">·</span>
              <span className="text-slate-500">GPS Stream: <strong className="text-emerald-600">Active</strong></span>
            </div>
          </div>

          {/* Fullscreen Interactive Leaflet GIS Map */}
          <div className="flex-1 relative">
            <GISMap incidents={mapIncidents} selectedIncident={selectedIncident} />
          </div>

          {/* Bottom Live Agent Event Ticker */}
          <div className="h-10 bg-white border-t border-slate-200 px-4 flex items-center justify-between text-xs shrink-0 font-mono z-10 shadow-xs">
            <div className="flex items-center gap-2 text-blue-700">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              <span className="font-bold">AGENT STREAM:</span>
              <span className="text-slate-700 text-[11px] truncate max-w-xl">
                [Agent-03] Classified road cave-in on Velachery Bypass. Ward 178 ticket dispatched to GCC Engineer Portal. Auto-escalation scheduled in 48 hrs.
              </span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-slate-500">
              <span>n8n Webhook: 200 OK</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            </div>
          </div>
        </div>

        {/* COLUMN 3: RIGHT INCIDENT DETAIL & AGENT TELEMETRY (360px) */}
        <div className="w-[360px] bg-white border-l border-slate-200 flex flex-col shrink-0">
          
          {/* Tab navigation */}
          <div className="p-2 border-b border-slate-200 flex gap-1 bg-slate-50">
            <button
              onClick={() => setActiveTab('detail')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                activeTab === 'detail' ? 'bg-white text-blue-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5" /> Detail
            </button>
            <button
              onClick={() => setActiveTab('telemetry')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                activeTab === 'telemetry' ? 'bg-white text-blue-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Activity className="w-3.5 h-3.5" /> Telemetry
            </button>
            <button
              onClick={() => setActiveTab('n8n')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                activeTab === 'n8n' ? 'bg-white text-blue-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" /> n8n Schema
            </button>
          </div>

          {/* Tab Content Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F8FAFC]">
            {activeTab === 'detail' && selectedIncident && (
              <>
                {/* Incident Photo with Live Geo Overlay */}
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 aspect-video bg-slate-100 shadow-sm">
                  <img src={selectedIncident.image} alt="Incident" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none"></div>
                  
                  {/* Watermark GPS */}
                  <div className="absolute bottom-2 left-2 right-2 bg-slate-900/80 backdrop-blur text-[9px] font-mono text-cyan-300 px-2 py-1 rounded border border-cyan-500/30 flex justify-between items-center">
                    <span>LAT: {selectedIncident.lat.toFixed(4)}° N, LNG: {selectedIncident.lng.toFixed(4)}° E</span>
                    <span className="text-emerald-400 font-bold">CONF: {selectedIncident.confidence}</span>
                  </div>
                </div>

                {/* Details Card */}
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{selectedIncident.type}</span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      selectedIncident.priority === 'CRITICAL' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}>
                      {selectedIncident.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">{selectedIncident.location}</p>
                </div>

                {/* Assigned Hospital / ETA or Department */}
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
                  <div className="text-[10px] font-mono text-slate-500 uppercase font-bold">Autonomous Dispatch Breakdown</div>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Routing Dept:</span>
                      <span className="text-blue-700 font-bold">{selectedIncident.routingDept}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Active Agent:</span>
                      <span className="text-slate-800 font-mono font-semibold">{selectedIncident.assignedAgent}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Calculated SLA / ETA:</span>
                      <span className="text-emerald-700 font-bold">{selectedIncident.eta}</span>
                    </div>
                    {selectedIncident.hospital !== 'N/A' && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">Nearest Trauma Center:</span>
                        <span className="text-red-600 font-semibold">{selectedIncident.hospital}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* SLA Auto-Retry Countdown */}
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1 shadow-sm">
                  <div className="flex items-center gap-2 font-bold">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span>Auto-Escalation Countdown</span>
                  </div>
                  <p className="text-sm font-mono font-black text-amber-700">
                    {selectedIncident.slaExpiry}
                  </p>
                  <p className="text-[10px] text-amber-800 mt-1">
                    If unacknowledged by ward supervisor, auto-escalates to Tamil Nadu Principal Secretary Municipal Admin.
                  </p>
                </div>
              </>
            )}

            {activeTab === 'telemetry' && (
              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <span className="text-[10px] font-mono text-blue-700 uppercase font-bold">Agent-01 (Triage)</span>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="text-xl font-bold font-mono text-slate-900">99.82%</span>
                    <span className="text-[10px] text-emerald-700 font-mono font-semibold">14,281 inferences</span>
                  </div>
                </div>
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <span className="text-[10px] font-mono text-slate-500 uppercase font-bold">Mean Time to Dispatch</span>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="text-xl font-bold font-mono text-blue-700">18.4 sec</span>
                    <span className="text-[10px] text-emerald-700 font-mono font-semibold">-72% vs manual</span>
                  </div>
                </div>
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <span className="text-[10px] font-mono text-slate-500 uppercase font-bold">API Ingestion Rate</span>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="text-xl font-bold font-mono text-emerald-700">842 req/min</span>
                    <span className="text-[10px] text-blue-700 font-mono font-semibold">Zero drop</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'n8n' && (
              <div className="p-3.5 rounded-2xl bg-slate-900 text-emerald-400 font-mono text-[10px] space-y-1 overflow-x-auto shadow-sm">
                <div>// SENTINEXA n8n ORCHESTRATION PAYLOAD</div>
                <div>{`{`}</div>
                <div className="pl-3">"event": "INCIDENT_CLASSIFIED",</div>
                <div className="pl-3">"incident_id": "{selectedIncident?.id}",</div>
                <div className="pl-3">"coordinates": [{selectedIncident?.lat}, {selectedIncident?.lng}],</div>
                <div className="pl-3">"agent_consensus": true,</div>
                <div className="pl-3">"priority_score": 0.984,</div>
                <div className="pl-3">"forward_endpoints": [</div>
                <div className="pl-6">"webhook://gcc.gov.in/v1/triage",</div>
                <div className="pl-6">"webhook://108emergency.tn.gov/sos"</div>
                <div className="pl-3">],</div>
                <div className="pl-3">"audit_hmac_sha256": "e3b0c44298fc1c149afbf4c8..."</div>
                <div>{`}`}</div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
