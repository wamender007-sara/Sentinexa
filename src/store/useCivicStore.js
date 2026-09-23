import { create } from 'zustand';
import { initialIncidents, mockHospitals } from '../services/mockData';
import { n8nService } from '../services/n8nService';

export const useCivicStore = create((set, get) => ({
  // Language & UI preferences
  language: 'en', // 'en' | 'ta'
  setLanguage: (lang) => set({ language: lang }),

  // Filtering & Viewports
  selectedRegion: 'Tamil Nadu',
  setSelectedRegion: (region) => set({ selectedRegion: region }),
  
  categoryFilter: 'all', // 'all' | 'EMERGENCY' | 'CIVIC' | 'WEATHER' | 'water' | 'drainage' | 'eb' | 'road' | 'sanitation'
  setCategoryFilter: (cat) => set({ categoryFilter: cat }),
  
  statusFilter: 'all', // 'all' | 'VERIFIED' | 'DISPATCHED' | 'PENDING_ACK' | 'ESCALATED' | 'SOLVED'
  setStatusFilter: (status) => set({ statusFilter: status }),

  verifiedOnly: false,
  setVerifiedOnly: (val) => set({ verifiedOnly: val }),

  // Map controls
  mapType: 'standard', // 'standard' | 'satellite' | 'terrain'
  setMapType: (type) => set({ mapType: type }),
  mapCenter: [11.0168, 76.9558], // Active TN Map Center [Lat, Long] (Defaults to Coimbatore/Gandhipuram Hub or User GPS)
  mapZoom: 13,
  setMapCenter: (center, zoom = 13) => set({ mapCenter: center, mapZoom: zoom }),

  // Live GPS User Location State
  userLocation: null,
  setUserLocation: (loc) => {
    if (!loc || !loc.lat || !loc.long) return;
    set(state => ({
      userLocation: loc,
      mapCenter: [loc.lat, loc.long],
      mapZoom: 14
    }));
  },

  // Incidents dataset
  incidents: initialIncidents,
  selectedIncident: null,
  setSelectedIncident: (inc) => set({ selectedIncident: inc }),

  // Geo-Cam Capture State
  isGeoCamOpen: false,
  openGeoCam: () => set({ isGeoCamOpen: true }),
  closeGeoCam: () => set({ isGeoCamOpen: false }),
  capturedGeoPhoto: null,
  setCapturedGeoPhoto: (photo) => set({ capturedGeoPhoto: photo }),

  // Citizen Signal Submission Modal
  isCitizenSignalOpen: false,
  openCitizenSignalModal: () => set({ isCitizenSignalOpen: true }),
  closeCitizenSignalModal: () => set({ isCitizenSignalOpen: false }),

  // Emergency Modal & Hospital Search
  isEmergencyOpen: false,
  nearbyHospitals: [],
  activeEmergencyIncident: null,
  triggerEmergencyModal: (photoData) => {
    const lat = photoData?.location?.lat || photoData?.lat || get().userLocation?.lat || 11.0168;
    const long = photoData?.location?.long || photoData?.long || get().userLocation?.long || 76.9558;
    
    const sortedHospitals = mockHospitals.map(h => {
      const dist = Math.sqrt(Math.pow(h.lat - lat, 2) + Math.pow(h.long - long, 2)) * 111;
      return { ...h, distanceKm: dist.toFixed(1) };
    }).sort((a, b) => parseFloat(a.distanceKm) - parseFloat(b.distanceKm));

    set({
      isEmergencyOpen: true,
      nearbyHospitals: sortedHospitals,
      capturedGeoPhoto: photoData
    });
  },
  closeEmergencyModal: () => set({ isEmergencyOpen: false }),

  // Complaint Creation Modal
  isComplaintOpen: false,
  openComplaintModal: (photoData) => set({ isComplaintOpen: true, capturedGeoPhoto: photoData || get().capturedGeoPhoto }),
  closeComplaintModal: () => set({ isComplaintOpen: false }),

  // n8n Webhook Config
  n8nConfig: {
    emergencyWebhookUrl: 'https://n8n.example.com/webhook/civic-emergency-priority',
    complaintWebhookUrl: 'https://n8n.example.com/webhook/civic-complaint-dispatch',
    retryEscalationWebhookUrl: 'https://n8n.example.com/webhook/civic-2day-escalation',
    apiKey: '',
    simulationMode: true,
  },
  updateN8nConfig: (newConfig) => set(state => ({
    n8nConfig: { ...state.n8nConfig, ...newConfig }
  })),
  n8nLogs: [],
  addN8nLog: (log) => set(state => ({
    n8nLogs: [ { id: Date.now(), timestamp: new Date().toISOString(), ...log }, ...state.n8nLogs ].slice(0, 50)
  })),

  // Multi-Agent Ecosystem State
  agentStates: {
    ingestion: { status: 'idle', totalScraped: 1420 },
    truthVerification: { status: 'idle', avgConfidence: 94.2 },
    dispatch: { status: 'idle', TamilTemplatesGenerated: 112 },
    telemetry: { status: 'idle', apiLatencyMs: 42 }
  },
  agentLogs: [],
  addAgentLog: (agent, message, type = 'info', linkedIncidentId = null, confidenceImpact = null) => set(state => ({
    agentLogs: [{ 
      id: Date.now(), 
      timestamp: new Date().toLocaleTimeString(), 
      agent, 
      message, 
      type,
      linkedIncidentId,
      confidenceImpact
    }, ...state.agentLogs].slice(0, 80)
  })),

  // Stats
  streakDays: 42,
  solvedCount: 184,

  // Action: Add Incident
  addIncident: (newInc) => {
    const updated = [newInc, ...get().incidents];
    set({ incidents: updated });
    get().runPipelineForIncident(newInc);
  },

  // Action: Simulate Heavy Rain Event
  simulateHeavyRain: () => {
    const rainIncident = {
      id: 'INC-WX-2026-901',
      type: 'WEATHER',
      category: 'weather',
      severity: 4,
      title: 'Monsoon Flash Flood Warning & Heavy Rain Surge',
      tamilTitle: 'பருவமழை வெள்ளப்பெருக்கு எச்சரிக்கை மற்றும் மழை தாக்கம்',
      description: 'Weather Risk Agent detected 78.5 mm/h intense precipitation. Storm water drains at critical capacity across Chennai Central.',
      tamilDescription: 'வானிலை ஆபத்து முகவர் 78.5 மிமீ/மணி கனமழையைக் கண்டறிந்துள்ளது. புயல் நீர் வடிகால்கள் ஆபத்தான நிலையை எட்டியுள்ளன.',
      lat: 13.0827,
      long: 80.2707,
      state: 'Tamil Nadu',
      district: 'Chennai',
      address: 'Central Zone, Koyambedu & Anna Nagar Junction, Chennai',
      department: 'Disaster Management Authority & GCC Storm Water Cell',
      routingPortal: 'GCC Flood Warning Cell & CM Special Cell',
      truthScore: 98,
      corroboratingSignals: 14,
      status: 'VERIFIED',
      createdAt: new Date().toISOString(),
      unacknowledgedDays: 0,
      retryCount: 0,
      imageUri: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=600&auto=format&fit=crop&q=60'
    };

    set(state => ({ incidents: [rainIncident, ...state.incidents] }));
    get().addAgentLog('WeatherRiskAgent', 'Heavy precipitation scan triggered (78.5 mm/h). Flood risk severity score increased to 4/5 across Central Zone.', 'warning', 'INC-WX-2026-901', '+15%');
    get().addAgentLog('GeospatialClusteringAgent', 'Clustered 14 citizen signals near Koyambedu junction with satellite radar weather overlay.', 'info', 'INC-WX-2026-901', '+8%');
  },

  // Action: Time Warp for 2-3 Day Escalation
  warpTimeForEscalationDemo: () => {
    const now = Date.now();
    const threeDaysMs = 3 * 24 * 60 * 60 * 1000;
    
    const updatedIncidents = get().incidents.map(inc => {
      if (inc.status === 'DISPATCHED' || inc.status === 'PENDING_ACK' || inc.status === 'NEW') {
        return {
          ...inc,
          createdAt: new Date(now - threeDaysMs - 10000).toISOString(),
          status: 'PENDING_ACK',
          unacknowledgedDays: 3,
          escalationStage: 'Tier 2 Escalation Required (Automated n8n Loop)'
        };
      }
      return inc;
    });

    set({ incidents: updatedIncidents });
    get().addAgentLog('DispatchEscalationAgent', 'Time-warp executed: Tickets advanced by 3 days. Triggering automated n8n feedback loop & retries.', 'warning');
    get().triggerAutonomousRetries();
  },

  // Action: Run Agent Pipeline
  runPipelineForIncident: async (incident) => {
    const { addAgentLog, n8nConfig, addN8nLog } = get();

    addAgentLog('CitizenSignalVerificationAgent', `Signal received & geotagged: ${incident.title} [Lat: ${incident.lat.toFixed(4)}, Long: ${incident.long.toFixed(4)}]`, 'info', incident.id, '+12%');
    
    await new Promise(r => setTimeout(r, 500));
    addAgentLog('GeospatialClusteringAgent', `Location validated. Clustered with nearby historical incident coordinates.`, 'info', incident.id, '+5%');

    await new Promise(r => setTimeout(r, 600));
    const truthScore = Math.floor(88 + Math.random() * 11);
    addAgentLog('SeverityAssessmentAgent', `Multi-source evidence verified. Computed severity score: ${incident.severity || 3}/5 (Confidence: ${truthScore}%).`, 'success', incident.id, '+10%');

    await new Promise(r => setTimeout(r, 700));
    addAgentLog('EmergencyDispatchAgent', `Prepared official memorandum (EN & TA) for ${incident.department}. Portal: ${incident.routingPortal}`, 'info', incident.id);

    const webhookUrl = incident.type === 'EMERGENCY' ? n8nConfig.emergencyWebhookUrl : n8nConfig.complaintWebhookUrl;
    
    const payload = {
      ticketId: incident.id,
      type: incident.type,
      title: incident.title,
      description: incident.description,
      tamilDescription: incident.tamilDescription,
      department: incident.department,
      routingPortal: incident.routingPortal,
      location: { lat: incident.lat, long: incident.long, address: incident.address },
      truthScore,
      timestamp: incident.createdAt
    };

    const res = await n8nService.triggerWebhook(webhookUrl, payload, n8nConfig);
    addN8nLog({
      endpoint: webhookUrl,
      type: incident.type,
      ticketId: incident.id,
      status: res.success ? 200 : 500,
      mode: res.simulated ? 'SIMULATED' : 'LIVE',
      response: res.data
    });

    addAgentLog('ResolutionValidationAgent', `Dispatched ticket #${incident.id} to n8n workflow. Closed-loop validation active.`, 'success', incident.id);
  },

  // Action: Trigger Retries
  triggerAutonomousRetries: async () => {
    const { incidents, n8nConfig, addN8nLog, addAgentLog } = get();
    const now = Date.now();
    const twoDaysMs = 2 * 24 * 60 * 60 * 1000;

    const overdueTickets = incidents.filter(inc => {
      const ageMs = now - new Date(inc.createdAt).getTime();
      return (inc.status === 'PENDING_ACK' || inc.status === 'DISPATCHED') && ageMs >= twoDaysMs;
    });

    if (overdueTickets.length === 0) {
      addAgentLog('ResolutionValidationAgent', 'Autonomous Retry Scan: 0 unacknowledged tickets past 2-3 day window.', 'info');
      return;
    }

    addAgentLog('ResolutionValidationAgent', `Autonomous Feedback Engine: Found ${overdueTickets.length} unacknowledged tickets (>48-72h). Initiating n8n escalation loop!`, 'warning');

    const updatedIncidents = [...incidents];
    for (const ticket of overdueTickets) {
      const idx = updatedIncidents.findIndex(t => t.id === ticket.id);
      if (idx !== -1) {
        updatedIncidents[idx] = {
          ...updatedIncidents[idx],
          status: 'ESCALATED',
          retryCount: (updatedIncidents[idx].retryCount || 0) + 1,
          lastRetriedAt: new Date().toISOString(),
          escalationStage: `Tier ${ (updatedIncidents[idx].retryCount || 0) + 2 } - Collector / CM Special Cell`
        };
      }

      const res = await n8nService.triggerWebhook(n8nConfig.retryEscalationWebhookUrl, {
        event: 'TICKET_ESCALATION_RETRY',
        ticketId: ticket.id,
        title: ticket.title,
        department: ticket.department,
        daysUnacknowledged: 3,
        escalatedTo: 'District Collectorate / CM Grievance Cell',
        timestamp: new Date().toISOString()
      }, n8nConfig);

      addN8nLog({
        endpoint: n8nConfig.retryEscalationWebhookUrl,
        type: 'ESCALATION_RETRY',
        ticketId: ticket.id,
        status: res.success ? 200 : 500,
        mode: res.simulated ? 'SIMULATED' : 'LIVE',
        response: res.data
      });
    }

    set({ incidents: updatedIncidents });
    addAgentLog('ResolutionValidationAgent', `Successfully escalated ${overdueTickets.length} tickets via n8n automation pipeline.`, 'success');
  },

  // Mark ticket as resolved
  resolveIncident: (id) => {
    set(state => ({
      incidents: state.incidents.map(i => i.id === id ? { ...i, status: 'SOLVED', solvedAt: new Date().toISOString() } : i),
      solvedCount: state.solvedCount + 1
    }));
    get().addAgentLog('ResolutionValidationAgent', `Ticket #${id} resolution verified by ground check. Operational streak updated!`, 'success', id);
  }
}));
