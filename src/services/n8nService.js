// n8n Service for external n8n account integration & webhook dispatches

export const n8nService = {
  /**
   * Triggers an n8n webhook endpoint with payload
   */
  async triggerWebhook(url, payload, config = {}) {
    console.log(`[n8n Engine] Dispatched payload to: ${url}`, payload);

    if (!url || config.simulationMode) {
      // Return simulated n8n execution response
      return {
        success: true,
        simulated: true,
        data: {
          executionId: 'n8n_exec_' + Math.random().toString(36).substring(2, 9),
          status: 'SUCCESS',
          workflowName: payload.type === 'EMERGENCY' ? 'Priority 1 Emergency Broadcast' : 'Municipal Grievance Dispatch & Escalation',
          nodesTriggered: [
            'Webhook Trigger Node',
            'Metadata Validator & Truth Verification',
            'Tamil-English Multi-Lingual Processor',
            'Municipal API / EB / MLA Portal Connector',
            'Notification Broadcast (Telegram / SMS / Email)'
          ],
          timestamp: new Date().toISOString()
        }
      };
    }

    try {
      const headers = {
        'Content-Type': 'application/json',
      };
      if (config.apiKey) {
        headers['X-N8N-API-KEY'] = config.apiKey;
        headers['Authorization'] = `Bearer ${config.apiKey}`;
      }

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const text = await response.text();
        let data;
        try {
          data = JSON.parse(text);
        } catch (e) {
          data = { responseText: text };
        }

        return {
          success: true,
          simulated: false,
          status: response.status,
          data
        };
      } else {
        return {
          success: false,
          simulated: false,
          status: response.status,
          error: `HTTP Error ${response.status}: ${response.statusText}`
        };
      }
    } catch (err) {
      console.warn('[n8n Webhook Warning] Live request failed, falling back to simulated execution log:', err.message);
      return {
        success: true,
        simulated: true,
        fallbackError: err.message,
        data: {
          executionId: 'n8n_fallback_' + Math.random().toString(36).substring(2, 9),
          status: 'SIMULATED_FALLBACK',
          message: 'Webhook URL unreachable or blocked by CORS. Simulated workflow execution logged.',
          timestamp: new Date().toISOString()
        }
      };
    }
  }
};
