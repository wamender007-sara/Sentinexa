import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { retryScheduler } from './services/retryScheduler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-memory server ticket store
let tickets = [];
let n8nLogs = [];

// API: Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OPERATIONAL',
    system: 'CivicPulse AGY Multi-Agent Server',
    n8nEngine: 'ACTIVE',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// API: n8n Callback Webhook receiver (for bi-directional n8n responses)
app.post('/api/webhooks/n8n-callback', (req, res) => {
  const payload = req.body;
  console.log('[Server Webhook] Received n8n callback execution payload:', payload);

  const logEntry = {
    id: Date.now(),
    event: payload.event || 'N8N_CALLBACK_RECEIVED',
    ticketId: payload.ticketId,
    status: 'ACKNOWLEDGED',
    timestamp: new Date().toISOString(),
    details: payload
  };
  n8nLogs.unshift(logEntry);

  res.json({
    received: true,
    status: 'PROCESSED',
    executionId: payload.executionId || 'n8n_' + Math.random().toString(36).substr(2, 8)
  });
});

// API: Get all tickets
app.get('/api/tickets', (req, res) => {
  res.json({ success: true, count: tickets.length, tickets });
});

// API: Create new ticket
app.post('/api/tickets', (req, res) => {
  const newTicket = {
    ...req.body,
    createdAt: req.body.createdAt || new Date().toISOString()
  };
  tickets.unshift(newTicket);
  res.status(201).json({ success: true, ticket: newTicket });
});

// Start Autonomous Retry Loop Engine
retryScheduler.startScheduler(() => {
  // Check unacknowledged tickets >2-3 days old
  const now = Date.now();
  const twoDaysMs = 2 * 24 * 60 * 60 * 1000;

  tickets.forEach(ticket => {
    const age = now - new Date(ticket.createdAt).getTime();
    if ((ticket.status === 'PENDING_ACK' || ticket.status === 'DISPATCHED') && age >= twoDaysMs) {
      ticket.status = 'ESCALATED';
      ticket.retryCount = (ticket.retryCount || 0) + 1;
      console.log(`[Autonomous Retry Engine] Auto-escalated unacknowledged ticket #${ticket.id} to Tier 2 (Collectorate / CM Cell).`);
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 CivicPulse Express Multi-Agent & n8n Server running on port ${PORT}`);
});
