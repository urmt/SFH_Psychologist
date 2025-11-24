/**
 * @fileoverview Express API Server for SFH Psychologist Chat
 * Connects the frontend to the LLM orchestrator
 */

// Load environment variables from project root  
import dotenv from 'dotenv';
import path from 'path';
const envPath = path.join(process.cwd(), '../../.env');
console.log('Loading .env from:', envPath);
const result = dotenv.config({ path: envPath });
if (result.error) {
  console.error('Error loading .env:', result.error);
} else {
  console.log('Environment loaded successfully');
  console.log('GROQ_API_KEY present:', !!process.env.GROQ_API_KEY);
  console.log('GROK_API_KEY present:', !!process.env.GROK_API_KEY);
}

import express from 'express';
import cors from 'cors';
import { createOrchestratorFromEnv } from '../../../packages/orchestrator/src/index';
import type { TherapeuticSession, RiskLevel, TopicTag } from '../../../packages/types/src/index';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('/home/student/SFH_Psychologist/apps/simple-chat/public'));

// Initialize orchestrator
console.log('Initializing LLM orchestrator...');
const orchestrator = createOrchestratorFromEnv();
console.log('Orchestrator initialized with providers:', orchestrator.getAvailableProviders());

/**
 * In-memory session storage
 * In production, this would be Redis/PostgreSQL
 */
const sessions = new Map<string, TherapeuticSession>();

/**
 * Get or create a session
 */
function getOrCreateSession(sessionId: string, userId: string): TherapeuticSession {
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, {
      sessionId,
      userId,
      messages: [],
      topicTags: [],
      riskLevel: 'low' as RiskLevel,
      coherenceHistory: [],
      encrypted: false,
    });
    console.log(`Created new session: ${sessionId}`);
  }
  return sessions.get(sessionId)!;
}

/**
 * Detect topic tags from message content
 * Simple keyword-based detection for MVP
 */
function detectTopicTags(message: string): TopicTag[] {
  const tags: TopicTag[] = [];
  const lowerMessage = message.toLowerCase();
  
  // Attachment-related
  if (lowerMessage.match(/anxious|anxiety|attachment|partner|relationship|abandon/)) {
    tags.push('attachment_anxiety' as TopicTag);
  }
  if (lowerMessage.match(/distance|avoid|close|intimacy/)) {
    tags.push('attachment_avoidance' as TopicTag);
  }
  
  // Psychedelic-related
  if (lowerMessage.match(/psychedelic|trip|mushroom|lsd|dmt|integration|journey/)) {
    tags.push('psychedelic' as TopicTag);
  }
  
  // Social-related
  if (lowerMessage.match(/friends|social|lonely|isolated|disconnect/)) {
    tags.push('social' as TopicTag);
  }
  
  // High-risk topics
  if (lowerMessage.match(/suicid|kill myself|end it all|want to die/)) {
    tags.push('suicidal' as TopicTag);
  }
  if (lowerMessage.match(/dissociat|unreal|detach|derealization/)) {
    tags.push('dissociation' as TopicTag);
  }
  
  return tags;
}

/**
 * Determine risk level from topic tags
 */
function determineRiskLevel(tags: TopicTag[]): RiskLevel {
  if (tags.includes('suicidal' as TopicTag)) {
    return 'emergency' as RiskLevel;
  }
  if (tags.includes('dissociation' as TopicTag)) {
    return 'high' as RiskLevel;
  }
  if (tags.includes('attachment_anxiety' as TopicTag) || 
      tags.includes('psychedelic' as TopicTag)) {
    return 'medium' as RiskLevel;
  }
  return 'low' as RiskLevel;
}

/**
 * POST /api/chat - Main chat endpoint
 */
app.post('/api/chat', async (req, res) => {
  try {
    const { message, sessionId, userId, messages = [] } = req.body;
    
    if (!message || !sessionId || !userId) {
      return res.status(400).json({ 
        error: 'Missing required fields: message, sessionId, userId' 
      });
    }
    
    console.log(`\n[${sessionId}] Received message from ${userId}`);
    console.log(`Message: ${message.substring(0, 100)}${message.length > 100 ? '...' : ''}`);
    
    // Get or create session
    const session = getOrCreateSession(sessionId, userId);
    
    // Update session with client messages
    session.messages = messages.map((msg: any) => ({
      role: msg.role,
      content: msg.content,
      timestamp: new Date(msg.timestamp),
      coherenceScore: msg.coherenceScore,
    }));
    
    // Detect topic tags and update session
    const newTags = detectTopicTags(message);
    for (const tag of newTags) {
      if (!session.topicTags.includes(tag)) {
        session.topicTags.push(tag);
      }
    }
    
    // Update risk level
    session.riskLevel = determineRiskLevel(session.topicTags);
    
    console.log(`Topic tags: ${session.topicTags.join(', ') || 'none'}`);
    console.log(`Risk level: ${session.riskLevel}`);
    
    // Process message through orchestrator
    const result = await orchestrator.processMessage(
      message,
      session
    );
    
    // Update coherence history
    session.coherenceHistory.push(result.validation.qualicCoherenceScore);
    
    // Log result
    console.log(`Response generated: ${result.passed ? '✓ PASSED' : '✗ FAILED'}`);
    console.log(`Coherence: ${result.validation.qualicCoherenceScore.toFixed(3)}`);
    
    // Return response
    res.json({
      response: result.response.rawResponse,
      validation: {
        passed: result.validation.passed,
        qualicCoherenceScore: result.validation.qualicCoherenceScore,
        violatedAxioms: result.validation.violatedAxioms,
        repairSuggestions: result.validation.repairSuggestions,
      },
      metadata: {
        provider: result.response.provider,
        latencyMs: result.response.latencyMs,
        tokenCount: result.response.tokenCount,
        riskLevel: session.riskLevel,
        topicTags: session.topicTags,
      }
    });
    
  } catch (error) {
    console.error('Chat API error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : String(error)
    });
  }
});

/**
 * GET /api/session/:sessionId - Get session info
 */
app.get('/api/session/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  const session = sessions.get(sessionId);
  
  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }
  
  res.json({
    sessionId: session.sessionId,
    messageCount: session.messages.length,
    topicTags: session.topicTags,
    riskLevel: session.riskLevel,
    averageCoherence: session.coherenceHistory.length > 0
      ? session.coherenceHistory.reduce((a, b) => a + b, 0) / session.coherenceHistory.length
      : null,
  });
});

/**
 * GET /api/health - Health check
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    providers: orchestrator.getAvailableProviders(),
    sessions: sessions.size,
    uptime: process.uptime(),
  });
});

/**
 * Serve frontend for root and catch-all
 */
app.get('/', (req, res) => {
  res.sendFile('/home/student/SFH_Psychologist/apps/simple-chat/public/index.html');
});

/**
 * Start server
 */
app.listen(PORT, () => {
  console.log('\n═══════════════════════════════════════════════════');
  console.log('  🧠 SFH Psychologist Chat Server');
  console.log('═══════════════════════════════════════════════════');
  console.log(`  Server running at: http://localhost:${PORT}`);
  console.log(`  Health check: http://localhost:${PORT}/api/health`);
  console.log('═══════════════════════════════════════════════════\n');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});
