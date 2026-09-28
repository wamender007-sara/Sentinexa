import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, ChevronRight, Grid, Monitor, Layout, 
  Check, ArrowRight, ShieldCheck, Clock, MapPin, 
  FileText, Activity, AlertCircle, Database, Server
} from 'lucide-react';

export default function HeroPitchShowcase() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [viewMode, setViewMode] = useState('slide'); // 'slide' | 'grid'

  const slides = [
    {
      id: 1,
      category: 'EXECUTIVE OVERVIEW',
      title: 'SENTINEXA',
      subtitle: 'Autonomous Municipal Dispatch and Emergency Response Operating System',
      description: 'An intelligent multi-agent platform connecting citizens directly with municipal departments and emergency services with verifiable geotagged evidence and automated workflow orchestration.',
      type: 'title',
      metrics: [
        { label: 'Dispatch Latency', value: '< 4.0 Seconds', detail: 'Instant automated department routing' },
        { label: 'Municipal SLA', value: '48 Hours', detail: 'Guaranteed citizen resolution escalation' },
        { label: 'Vision Accuracy', value: '98.4%', detail: 'Automated civic issue categorization' },
        { label: 'Emergency Triage', value: '< 3 Minutes', detail: 'Integrated 108 and 100 protocol execution' }
      ]
    },
    {
      id: 2,
      category: 'PROBLEM STATEMENT',
      title: 'Structural Municipal Service Inefficiencies',
      subtitle: 'Current Challenges in Citizen Complaint Redressal and Emergency Response',
      type: 'problem',
      points: [
        {
          num: '01',
          title: 'Absence of Verifiable Geotagged Proof',
          desc: 'Citizen complaints frequently lack precise GPS coordinates and photographic proof, leading to field verification delays, false reports, and administrative confusion regarding ward jurisdiction.'
        },
        {
          num: '02',
          title: 'Manual Routing Bottlenecks and Delays',
          desc: 'Grievances submitted through conventional portals pass through several administrative intermediaries, causing average response times of 7 to 14 days before reaching the responsible ward engineer.'
        },
        {
          num: '03',
          title: 'Siloed Emergency Dispatch Systems',
          desc: 'Medical trauma, police, and civic emergency lines function in separate operational silos without centralized geographic visualization, slowing down coordination during critical incidents.'
        }
      ],
      takeaway: 'Key Takeaway: The delay between incident occurrence and municipal dispatch can be reduced by over 90% through automated geographic verification and direct webhook orchestration.'
    },
    {
      id: 3,
      category: 'PROPOSED SOLUTION',
      title: 'The Sentinexa Autonomous Civic Mesh',
      subtitle: 'End-to-End Autonomous Platform Connecting Citizens to Municipal Engineers',
      type: 'solution',
      pillars: [
        {
          title: 'Cryptographic Geo-Cam',
          desc: 'Burn-in optical watermarking captures exact latitude, longitude, timestamp, and SHA-256 HMAC authentication into the evidence image directly at capture time.'
        },
        {
          title: 'Autonomous Multi-Agent Routing',
          desc: 'Intelligent routing agents parse the complaint, detect incident type (Road, Water, Sanitation, Electrical), identify the municipal ward, and assign target engineer credentials.'
        },
        {
          title: 'Real-Time Webhook Gateway',
          desc: 'Autonomous n8n cloud workflows dispatch high-priority notifications, structured email packets, and department tickets within four seconds of citizen submission.'
        },
        {
          title: 'Escalation and SLA Enforcement',
          desc: 'Guaranteed 48-hour service level agreement monitoring with automated escalation triggers ensuring accountability across all civic wards.'
        }
      ]
    },
    {
      id: 4,
      category: 'OPERATIONAL WORKFLOW',
      title: 'Citizen-to-Resolution Lifecycle',
      subtitle: 'Systematic Step-by-Step Architecture for Municipal Redressal',
      type: 'workflow',
      steps: [
        {
          step: 'Step 1',
          phase: 'Citizen Capture',
          action: 'Geotagged Photo Evidence',
          detail: 'Citizen photographs civic issue. The camera bakes in GPS coordinates, district, and cryptographic timestamp.'
        },
        {
          step: 'Step 2',
          phase: 'Classification',
          action: 'Multi-Category Verification',
          detail: 'System matches the incident to Road Infrastructure, Water Pipeline, Garbage Sanitation, or Electrical Grid.'
        },
        {
          step: 'Step 3',
          phase: 'Dispatch',
          action: 'Automated n8n Webhook',
          detail: 'Dispatches structured municipal payload to ward officers, department emails, and administrative dashboards.'
        },
        {
          step: 'Step 4',
          phase: 'Audit & SLA',
          action: '48-Hour Resolution SLA',
          detail: 'Ticket is tracked with live state updates (Routed, Dispatched, Resolved) with automatic civic mesh escalation.'
        }
      ]
    },
    {
      id: 5,
      category: 'EMERGENCY RESPONSE PROTOCOL',
      title: 'High-Priority Emergency SOS Framework',
      subtitle: 'Unified Rapid Response for Ambulance (108) and Police (100) Dispatches',
      type: 'emergency',
      features: [
        {
          title: 'Immediate Geolocation Beacon',
          desc: 'Locks high-accuracy GPS coordinates (down to 4 meters) and identifies the exact district and road intersection.'
        },
        {
          title: 'Nearest Trauma Care Routing',
          desc: 'Calculates real-time proximity and estimated transit time to the three closest accredited medical facilities.'
        },
        {
          title: 'Multi-Agency Alert Broadcast',
          desc: 'Simultaneously alerts ambulance control rooms and police district monitors with patient/incident summary.'
        },
        {
          title: 'Sub-3 Minute Triage Target',
          desc: 'Eliminates voice call ambiguity by transmitting verified coordinates and incident data straight to field responders.'
        }
      ]
    },
    {
      id: 6,
      category: 'TECHNICAL ARCHITECTURE',
      title: 'Enterprise Architecture & Tech Stack',
      subtitle: 'Scalable, High-Availability Technology Stack for Municipal Deployments',
      type: 'tech',
      layers: [
        {
          layer: 'Presentation Layer',
          tech: 'React 18, Vite, Tailwind CSS',
          description: 'Responsive mobile-first application adapting seamlessly between mobile smartphones and desktop command displays.'
        },
        {
          layer: 'Geospatial Intelligence',
          tech: 'Leaflet Engine, OpenStreetMap, GIS Mesh',
          description: 'Completely open-source, watermark-free basemaps with real-time district coordinate bounds and user GPS tracking.'
        },
        {
          layer: 'Workflow Orchestration',
          tech: 'n8n Cloud, REST Webhook APIs, SMTP Relay',
          description: 'Autonomous micro-workflows running continuous 5-hour public grievance monitoring and sub-second dispatch triggers.'
        },
        {
          layer: 'Data & Security Layer',
          tech: 'Zustand Reactive Store, SHA-256 HMAC',
          description: 'Client-side reactive state management with cryptographically verified evidence generation and offline tolerance.'
        }
      ]
    },
    {
      id: 7,
      category: 'PILOT METRICS & EXPANSION',
      title: 'Pilot Results and State-Wide Scalability',
      subtitle: 'Demonstrated Performance in Coimbatore / Kinathukadavu Pilot Zone',
      type: 'results',
      metrics: [
        { number: '184+', title: 'Verified Incidents Resolved', note: 'Tracked across pilot municipal wards' },
        { number: '3.8s', title: 'Average Dispatch Latency', note: 'From citizen tap to department webhook' },
        { number: '94.2%', title: 'SLA Compliance Rate', note: 'Issues resolved within 48-hour threshold' },
        { number: '38', title: 'Districts Deployment Ready', note: 'Standardized Tamil Nadu municipal schema' }
      ],
      roadmap: [
        { phase: 'Phase 1: Pilot Validation', status: 'Completed', detail: 'Kinathukadavu and Coimbatore municipal zone deployment with live n8n webhook and email alerts.' },
        { phase: 'Phase 2: District Integration', status: 'In Progress', detail: 'Direct API connectors to municipal corporation grievance portals and department CRM systems.' },
        { phase: 'Phase 3: State-Wide Mesh', status: 'Planned', detail: 'Centralized command center integration across all municipal corporations in Tamil Nadu.' }
      ]
    }
  ];

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        setCurrentSlide((prev) => Math.max(prev - 1, 0));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [slides.length]);

  const slide = slides[currentSlide];

  return (
    <div className="w-full min-h-screen bg-[#FBFBFA] text-[#0F172A] font-sans flex flex-col select-none">
      
      {/* ── TOP EXECUTIVE PRESENTATION CONTROLS ── */}
      <header className="bg-white border-b border-[#E5E7EB] px-6 py-3 flex items-center justify-between shrink-0 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold tracking-widest text-[#1E3A8A] uppercase">
              EXECUTIVE PRESENTATION
            </span>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-semibold text-slate-600">
              Sentinexa Platform Overview
            </span>
          </div>
        </div>

        {/* Slide Counter & Mode Toggle */}
        <div className="flex items-center gap-4">
          <span className="text-xs font-mono font-bold text-slate-500">
            Slide {String(currentSlide + 1).padStart(2, '0')} of {String(slides.length).padStart(2, '0')}
          </span>

          <div className="flex items-center bg-[#F3F4F6] p-1 rounded-lg border border-[#E5E7EB]">
            <button
              type="button"
              onClick={() => setViewMode('slide')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                viewMode === 'slide' ? 'bg-white text-[#0F172A] shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Slide View
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                viewMode === 'grid' ? 'bg-white text-[#0F172A] shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              All Slides Grid
            </button>
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT AREA ── */}
      <main className="flex-1 flex flex-col justify-center items-center p-4 md:p-8 overflow-y-auto">
        
        {viewMode === 'slide' ? (
          /* SINGLE 16:9 PRESENTATION SLIDE CARD */
          <div className="w-full max-w-5xl bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-8 md:p-14 flex flex-col justify-between min-h-[580px] transition-all">
            
            {/* Top Slide Header */}
            <div>
              <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3 mb-6">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#1E40AF]">
                  {slide.category}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  CONFIDENTIAL / FOR MUNICIPAL REVIEW
                </span>
              </div>

              <h2 className="text-2xl md:text-3xl font-black text-[#0F172A] tracking-tight">
                {slide.title}
              </h2>
              {slide.subtitle && (
                <p className="text-sm md:text-base font-medium text-slate-500 mt-1">
                  {slide.subtitle}
                </p>
              )}
            </div>

            {/* Slide Body Content by Type */}
            <div className="my-8 flex-1 flex flex-col justify-center">
              
              {/* Type: Title Slide */}
              {slide.type === 'title' && (
                <div className="space-y-8">
                  <p className="text-base text-slate-700 leading-relaxed max-w-3xl">
                    {slide.description}
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-[#F1F5F9]">
                    {slide.metrics.map((m, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                        <span className="text-xs font-mono font-semibold text-slate-500 uppercase block">
                          {m.label}
                        </span>
                        <span className="text-xl md:text-2xl font-black text-[#1E3A8A] block mt-1">
                          {m.value}
                        </span>
                        <span className="text-xs text-slate-600 block mt-1">
                          {m.detail}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Type: Problem Statement */}
              {slide.type === 'problem' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {slide.points.map((p, idx) => (
                      <div key={idx} className="p-5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex flex-col justify-between">
                        <div>
                          <span className="text-xs font-mono font-bold text-[#1E40AF] block mb-2">
                            SECTION {p.num}
                          </span>
                          <h3 className="text-sm font-bold text-[#0F172A] mb-2 leading-snug">
                            {p.title}
                          </h3>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            {p.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE]">
                    <p className="text-xs font-semibold text-[#1E40AF]">
                      {slide.takeaway}
                    </p>
                  </div>
                </div>
              )}

              {/* Type: Solution Pillars */}
              {slide.type === 'solution' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {slide.pillars.map((pil, idx) => (
                    <div key={idx} className="p-5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-2 h-2 rounded-full bg-[#1E40AF]"></span>
                        <h3 className="text-sm font-bold text-[#0F172A]">
                          {pil.title}
                        </h3>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed pl-4">
                        {pil.desc}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Type: Operational Workflow */}
              {slide.type === 'workflow' && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {slide.steps.map((st, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] relative">
                      <span className="text-xs font-mono font-bold text-[#1E40AF] block mb-1">
                        {st.step} · {st.phase}
                      </span>
                      <h4 className="text-sm font-bold text-[#0F172A] mb-2">
                        {st.action}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {st.detail}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Type: Emergency SOS */}
              {slide.type === 'emergency' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {slide.features.map((f, idx) => (
                    <div key={idx} className="p-5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-2 h-2 rounded-full bg-[#DC2626]"></span>
                        <h3 className="text-sm font-bold text-[#0F172A]">
                          {f.title}
                        </h3>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed pl-4">
                        {f.desc}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Type: Tech Stack */}
              {slide.type === 'tech' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {slide.layers.map((l, idx) => (
                    <div key={idx} className="p-5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                      <span className="text-xs font-mono font-bold text-slate-500 uppercase block">
                        {l.layer}
                      </span>
                      <h3 className="text-sm font-bold text-[#1E3A8A] mt-1 mb-2">
                        {l.tech}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {l.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Type: Pilot Results */}
              {slide.type === 'results' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {slide.metrics.map((m, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-center">
                        <span className="text-2xl font-black text-[#1E3A8A] block">
                          {m.number}
                        </span>
                        <span className="text-xs font-bold text-[#0F172A] block mt-1">
                          {m.title}
                        </span>
                        <span className="text-[11px] text-slate-500 block mt-0.5">
                          {m.note}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2 pt-2">
                    <span className="text-xs font-mono font-bold text-slate-500 uppercase block">
                      Deployment Roadmap:
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {slide.roadmap.map((r, idx) => (
                        <div key={idx} className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold text-[#0F172A]">{r.phase}</span>
                            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                              {r.status}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 leading-normal">
                            {r.detail}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Bottom Slide Footer */}
            <div className="border-t border-[#F1F5F9] pt-4 flex items-center justify-between text-xs text-slate-500 font-mono">
              <span>SENTINEXA · CIVIC INTELLIGENCE PLATFORM</span>
              <span>SLIDE {String(currentSlide + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}</span>
            </div>

          </div>
        ) : (
          /* GRID VIEW: ALL 7 SLIDES OVERVIEW */
          <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6">
            {slides.map((s, idx) => (
              <div
                key={s.id}
                onClick={() => {
                  setCurrentSlide(idx);
                  setViewMode('slide');
                }}
                className={`p-5 rounded-2xl border transition-all cursor-pointer bg-white ${
                  currentSlide === idx 
                    ? 'border-[#1E3A8A] ring-2 ring-[#1E3A8A]/20 shadow-md' 
                    : 'border-[#E2E8F0] hover:border-slate-400 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between mb-3 text-xs font-mono text-slate-400">
                  <span className="font-bold text-[#1E40AF]">SLIDE {String(idx + 1).padStart(2, '0')}</span>
                  <span>{s.category}</span>
                </div>
                <h4 className="text-sm font-bold text-[#0F172A] mb-1">
                  {s.title}
                </h4>
                <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                  {s.subtitle || s.description}
                </p>
              </div>
            ))}
          </div>
        )}

      </main>

      {/* ── BOTTOM PRESENTATION NAVIGATION DOCK ── */}
      <footer className="bg-white border-t border-[#E5E7EB] px-6 py-3 flex items-center justify-between shrink-0 shadow-xs">
        <button
          type="button"
          onClick={() => setCurrentSlide(prev => Math.max(prev - 1, 0))}
          disabled={currentSlide === 0}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border border-[#E5E7EB] bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-slate-800"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous Slide</span>
        </button>

        {/* Slide Indicator Dots */}
        <div className="flex items-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentSlide(idx)}
              className={`transition-all rounded-full ${
                currentSlide === idx 
                  ? 'w-6 h-2 bg-[#1E3A8A]' 
                  : 'w-2 h-2 bg-slate-300 hover:bg-slate-400'
              }`}
              title={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => setCurrentSlide(prev => Math.min(prev + 1, slides.length - 1))}
          disabled={currentSlide === slides.length - 1}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border border-[#E5E7EB] bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-slate-800"
        >
          <span>Next Slide</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </footer>

    </div>
  );
}
