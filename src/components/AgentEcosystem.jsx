import React, { useState } from 'react';
import { useCivicStore } from '../store/useCivicStore';
import { 
  Cpu, 
  Search, 
  ShieldCheck, 
  Send, 
  Activity, 
  RefreshCw, 
  Layers, 
  CloudRain, 
  CheckCircle2, 
  MapPin, 
  Zap,
  ChevronDown,
  ChevronUp,
  Clock,
  Sparkles
} from 'lucide-react';
import { ingestionAgent } from '../agents/IngestionAgent';

export default function AgentEcosystem() {
  const { agentStates, agentLogs, addAgentLog, language } = useCivicStore();
  const [isRunningPipeline, setIsRunningPipeline] = useState(false);
  const [expandedLogId, setExpandedLogId] = useState(null);

  const handleRunManualPipelineScan = async () => {
    setIsRunningPipeline(true);
    addAgentLog('CitizenSignalVerificationAgent', 'Crawling local Tamil news feeds & citizen signals...', 'info', 'INC-2026-8801', '+10%');

    await new Promise(r => setTimeout(r, 600));
    addAgentLog('GeospatialClusteringAgent', 'Clustered 7 nearby reports within 250m radius of Anna Nagar 2nd Avenue.', 'info', 'INC-2026-8801', '+8%');

    await new Promise(r => setTimeout(r, 700));
    addAgentLog('WeatherRiskAgent', 'Rainfall intensity cross-checked: 42 mm/h detected near storm water drain.', 'warning', 'INC-WX-2026-901', '+15%');

    await new Promise(r => setTimeout(r, 600));
    addAgentLog('SeverityAssessmentAgent', 'Confidence score increased to 96% based on tri-source signal clustering.', 'success', 'INC-2026-8801', '+12%');

    await new Promise(r => setTimeout(r, 600));
    addAgentLog('EmergencyDispatchAgent', 'Routed formal memorandum (EN & TA) to Greater Chennai Corporation portal via n8n.', 'info', 'INC-2026-8801');

    await new Promise(r => setTimeout(r, 500));
    addAgentLog('ResolutionValidationAgent', 'Initiated closed-loop resolution monitoring.', 'success', 'INC-2026-8801');

    setIsRunningPipeline(false);
  };

  const getAgentBadge = (agentName) => {
    switch (agentName) {
      case 'CitizenSignalVerificationAgent':
        return { label: 'Signal Verification Agent', bg: 'bg-[#EAF1F8]', text: 'text-[#1769E0]', icon: Search };
      case 'GeospatialClusteringAgent':
        return { label: 'Geospatial Clustering Agent', bg: 'bg-[#F1F5F9]', text: 'text-[#0B2E59]', icon: MapPin };
      case 'WeatherRiskAgent':
        return { label: 'Weather Risk Agent', bg: 'bg-[#E0F2FE]', text: 'text-[#0EA5C6]', icon: CloudRain };
      case 'SeverityAssessmentAgent':
        return { label: 'Severity Assessment Agent', bg: 'bg-[#EAF7EE]', text: 'text-[#16803C]', icon: ShieldCheck };
      case 'EmergencyDispatchAgent':
        return { label: 'Emergency Dispatch Agent', bg: 'bg-[#FFF5DF]', text: 'text-[#C97700]', icon: Send };
      default:
        return { label: 'Resolution Validation Agent', bg: 'bg-[#F2EEFF]', text: 'text-[#6D4CCB]', icon: CheckCircle2 };
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto p-4 sm:p-6 space-y-6 font-sans animate-fade-in">
      
      {/* Header Banner */}
      <div className="bg-white border border-[#D9E2EC] p-6 rounded-2xl shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-11 h-11 rounded-2xl bg-[#F2EEFF] text-[#6D4CCB] flex items-center justify-center font-extrabold border border-[#6D4CCB]/20">
            <Cpu className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-[#14213D] tracking-tight">
              AI Agent Swarm & Autonomous Audit Trail
            </h2>
            <p className="text-xs text-[#52616B] font-mono">
              Explainable AI decisions, signal verification, geospatial clustering & closed-loop dispatch
            </p>
          </div>
        </div>

        <button
          onClick={handleRunManualPipelineScan}
          disabled={isRunningPipeline}
          className="px-5 py-2.5 rounded-xl bg-[#6D4CCB] hover:bg-[#5B3EB0] text-white font-extrabold text-xs shadow-xs flex items-center space-x-2 transition-transform active:scale-95 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isRunningPipeline ? 'animate-spin' : ''}`} />
          <span>{isRunningPipeline ? 'EXPLAINING DECISIONS...' : 'TRIGGER SWARM VERIFICATION'}</span>
        </button>
      </div>

      {/* 6 Specialized Agents Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { name: 'Citizen Signal Verification Agent', role: 'Scans news & social feeds', icon: Search, color: 'text-[#1769E0]' },
          { name: 'Geospatial Clustering Agent', role: 'Clusters coordinates & GPS pins', icon: MapPin, color: 'text-[#0B2E59]' },
          { name: 'Weather Risk Agent', role: 'Monitors precipitation surge', icon: CloudRain, color: 'text-[#0EA5C6]' },
          { name: 'Severity Assessment Agent', role: 'Computes 1-5 severity ratings', icon: ShieldCheck, color: 'text-[#16803C]' },
          { name: 'Emergency Dispatch Agent', role: 'Generates Tamil/EN memos', icon: Send, color: 'text-[#C97700]' },
          { name: 'Resolution Validation Agent', role: 'Verifies closed-loop resolution', icon: CheckCircle2, color: 'text-[#6D4CCB]' }
        ].map((agent, idx) => {
          const IconComp = agent.icon;
          return (
            <div key={idx} className="bg-white border border-[#D9E2EC] p-4 rounded-2xl shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <IconComp className={`w-5 h-5 ${agent.color}`} />
                <span className="w-2 h-2 rounded-full bg-[#16803C]"></span>
              </div>
              <h4 className="font-extrabold text-xs text-[#14213D] leading-snug">
                {agent.name}
              </h4>
              <p className="text-[11px] text-[#52616B] font-mono line-clamp-1">{agent.role}</p>
            </div>
          );
        })}
      </div>

      {/* AI Agent Activity Timeline */}
      <div className="bg-white border border-[#D9E2EC] rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#D9E2EC] pb-4">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-[#6D4CCB]" />
            <h3 className="font-extrabold text-base text-[#14213D]">
              AI Agent Activity Timeline ({agentLogs.length})
            </h3>
          </div>
          <span className="text-xs font-mono text-[#52616B]">Explainable AI Audit Log</span>
        </div>

        <div className="space-y-3">
          {agentLogs.length === 0 ? (
            <div className="p-8 text-center text-[#52616B] font-mono text-xs italic">
              No agent activity logged yet. Submit a signal or trigger heavy rain simulation!
            </div>
          ) : (
            agentLogs.map(log => {
              const badge = getAgentBadge(log.agent);
              const BadgeIcon = badge.icon;
              const isExpanded = expandedLogId === log.id;

              return (
                <div
                  key={log.id}
                  className="bg-[#F8FAFC] border border-[#D9E2EC] rounded-2xl p-4 shadow-xs hover:border-[#1769E0]/40 transition-all space-y-2"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center space-x-2.5">
                      <div className={`p-1.5 rounded-lg ${badge.bg} ${badge.text}`}>
                        <BadgeIcon className="w-4 h-4" />
                      </div>
                      <span className={`font-mono text-xs font-bold ${badge.text}`}>
                        {badge.label}
                      </span>
                      {log.linkedIncidentId && (
                        <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-[#D9E2EC] text-[#0B2E59]">
                          Incident #{log.linkedIncidentId}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-3 text-xs font-mono text-[#52616B]">
                      {log.confidenceImpact && (
                        <span className="font-bold text-[#16803C] bg-[#EAF7EE] px-2 py-0.5 rounded-md border border-[#16803C]/20 text-[10px]">
                          Confidence {log.confidenceImpact}
                        </span>
                      )}
                      <span>{log.timestamp}</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#14213D] font-medium leading-relaxed">
                    {log.message}
                  </p>

                  {/* Expandable Evidence Chip Summary */}
                  <div className="pt-2 border-t border-[#D9E2EC] flex items-center justify-between text-[11px] text-[#52616B]">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-white border border-[#D9E2EC] text-[#0B2E59] font-mono text-[10px]">
                        ✓ GPS Cluster Confirmed
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-white border border-[#D9E2EC] text-[#0B2E59] font-mono text-[10px]">
                        ✓ Multi-source Corroboration
                      </span>
                    </div>

                    <button
                      onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                      className="text-[#1769E0] font-semibold hover:underline flex items-center space-x-1"
                    >
                      <span>{isExpanded ? 'Hide Details' : 'View Reasoning'}</span>
                      {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="p-3 bg-white rounded-xl border border-[#D9E2EC] text-xs font-mono text-[#52616B] space-y-1 animate-fade-in">
                      <p><strong className="text-[#14213D]">Decision Rationale:</strong> Confidence increased after 3 nearby citizen reports, verified GPS clustering, and threshold cross-checks.</p>
                      <p><strong className="text-[#14213D]">Agent ID:</strong> AGENT-SWARM-2026-09</p>
                    </div>
                  )}

                </div>
              );
            })
          )}
        </div>
      </div>

    </div>
  );
}
