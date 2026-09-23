// Dispatch & Escalation Agent: Formats complaints, tracks lifecycle, retries unacknowledged tickets every 2-3 days, and supports Tamil & English.

import { translationService } from '../services/translationService';

export class DispatchEscalationAgent {
  /**
   * Generates dispatch package with English and Tamil memo
   */
  prepareDispatchPackage(incident) {
    const memos = translationService.generateFormalGrievance(incident);

    return {
      ticketId: incident.id,
      department: incident.department,
      routingPortal: incident.routingPortal,
      englishMemorandum: memos.english,
      tamilMemorandum: memos.tamil,
      escalationTimeline: {
        day0: 'Initial Webhook Dispatch to Municipal / EB Portal',
        day2: 'First Reminder & Escalation Alert (Tier 1)',
        day3: 'Tier 2 Collectorate & CM Special Cell Escalation'
      }
    };
  }

  /**
   * Evaluates tickets due for 2-3 day retry escalation
   */
  checkEscalationEligibility(ticket) {
    const ageMs = Date.now() - new Date(ticket.createdAt).getTime();
    const daysOld = ageMs / (1000 * 60 * 60 * 24);
    
    return {
      isEligible: (ticket.status === 'PENDING_ACK' || ticket.status === 'DISPATCHED') && daysOld >= 2.0,
      daysUnacknowledged: Math.floor(daysOld),
      nextStage: daysOld >= 3.0 ? 'Tier 2 (Collectorate / CM Cell)' : 'Tier 1 (Zone Officer Reminder)'
    };
  }
}

export const dispatchEscalationAgent = new DispatchEscalationAgent();
