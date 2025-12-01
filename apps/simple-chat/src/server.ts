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
import type { TherapeuticSession, RiskLevel, TopicTag, ViolatedAxiom, LLMRequest } from '../../../packages/types/src/index';

/**
 * Classified paragraph for color-coded display
 */
interface ClassifiedParagraph {
  text: string;
  color: 'green' | 'yellow' | 'red' | 'neutral';
  reasoning: string;
}

/**
 * Multiple choice question structure
 */
interface MCQData {
  question: string;
  options: string[];
  context: string;
}

/**
 * Classify response paragraphs by urgency/type based on SFH axioms and risk
 */
function classifyParagraphs(
  responseText: string,
  riskLevel: RiskLevel,
  violatedAxioms: ViolatedAxiom[]
): ClassifiedParagraph[] {
  // Split response into paragraphs (separated by double newlines)
  const paragraphs = responseText.split('\n\n').filter(p => p.trim());
  
  return paragraphs.map(para => {
    const lower = para.toLowerCase();
    
    // RED: Crisis, emergency, high-risk content ONLY
    // Very conservative - only for true emergencies
    if (
      lower.includes('crisis') ||
      lower.includes('emergency') ||
      lower.includes('suicid') ||
      lower.includes('988') ||
      lower.includes('self-harm') ||
      lower.includes('immediate danger') ||
      (lower.includes('seek') && lower.includes('professional help')) ||
      (lower.includes('contact') && (lower.includes('therapist') || lower.includes('emergency')))
    ) {
      return {
        text: para,
        color: 'red',
        reasoning: 'Crisis/emergency content'
      };
    }
    
    // YELLOW: Explicit warnings and cautions ONLY
    // Must have clear warning language
    if (
      lower.includes('caution') ||
      lower.includes('be careful') ||
      lower.includes('warning') ||
      (lower.includes('important') && lower.includes('note')) ||
      lower.includes('be aware that') ||
      lower.includes('watch out for')
    ) {
      return {
        text: para,
        color: 'yellow',
        reasoning: 'Explicit caution/warning'
      };
    }
    
    // GREEN: Clear actionable advice ONLY
    // Must be direct suggestions/techniques
    const hasActionVerb = 
      lower.match(/\b(try|practice|do|use)\s+(this|these|the|a)\s+(technique|exercise|practice|approach)/) ||
      lower.match(/\bhere's (how|what) (you can|to)/) ||
      lower.match(/\byou can (try|practice|do)/) ||
      lower.match(/\b(one|an?) (approach|technique|way|method) (is|would be)/);
    
    if (hasActionVerb) {
      return {
        text: para,
        color: 'green',
        reasoning: 'Actionable advice'
      };
    }
    
    // DEFAULT: No color (neutral/educational content)
    return {
      text: para,
      color: 'neutral',
      reasoning: 'Educational/explanatory content'
    };
  });
}

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files FIRST
// Handle both direct run and workspace run
let publicPath: string;
if (process.cwd().endsWith('simple-chat')) {
  // Direct run from apps/simple-chat
  publicPath = path.join(process.cwd(), 'public');
} else {
  // Workspace run from project root
  publicPath = path.join(process.cwd(), 'apps/simple-chat/public');
}
console.log('Serving static files from:', publicPath);
app.use(express.static(publicPath));

// Fallback: serve index.html for root
app.get('/', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

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
 * Generate MCQ for clarification based on conversation context
 * Uses LLM to create context-aware multiple choice questions
 */
async function generateMCQ(
  session: TherapeuticSession,
  messageCount: number
): Promise<MCQData | null> {
  // Generate MCQ every 3-4 messages, but not on first message
  if (messageCount < 2 || messageCount % 3 !== 0) {
    return null;
  }
  
  // Build context from recent messages
  const recentMessages = session.messages.slice(-4);
  const context = recentMessages
    .map(m => `${m.role === 'client' ? 'Client' : 'Therapist'}: ${m.content}`)
    .join('\n\n');
  
  // Request MCQ from LLM
  const mcqPrompt = `Based on this therapeutic conversation, generate ONE multiple choice question to clarify the client's situation or feelings. The question should help deepen understanding.

Recent conversation:
${context}

Generate a JSON response with this exact structure:
{
  "question": "[Your clarifying question]",
  "options": ["Option A", "Option B", "Option C", "Option D"]
}

Make the question specific, empathetic, and relevant to what was just discussed. Keep options concise (5-10 words each).`;
  
  try {
    const request: LLMRequest = {
      messages: [
        {
          role: 'system',
          content: 'You are an expert psychologist creating clarifying questions. Return ONLY valid JSON, no other text.'
        },
        {
          role: 'user',
          content: mcqPrompt
        }
      ],
      temperature: 0.7,
      maxTokens: 200
    };
    
    const response = await orchestrator.sendRequest('groq', request);
    
    // Parse JSON response
    const cleaned = response.rawResponse.trim().replace(/```json\n?/g, '').replace(/```/g, '');
    const mcqData = JSON.parse(cleaned);
    
    if (mcqData.question && Array.isArray(mcqData.options) && mcqData.options.length >= 3) {
      return {
        question: mcqData.question,
        options: mcqData.options,
        context: context
      };
    }
    
    return null;
  } catch (error) {
    console.error('MCQ generation failed:', error);
    return null;
  }
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
    
    // Classify paragraphs for color-coded display
    const classifiedParagraphs = classifyParagraphs(
      result.response.rawResponse,
      session.riskLevel,
      result.validation.violatedAxioms
    );
    
    // Generate MCQ if appropriate
    const mcq = await generateMCQ(session, session.messages.length);
    
    // Return response
    res.json({
      response: result.response.rawResponse,
      classifiedParagraphs,
      mcq: mcq,
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
 * POST /api/export-summary - Generate session summary for PDF export
 */
app.post('/api/export-summary', async (req, res) => {
  try {
    const { sessionId, messages, coherenceScores } = req.body;
    
    if (!messages || messages.length === 0) {
      return res.status(400).json({ error: 'No messages to summarize' });
    }
    
    console.log(`\nGenerating summary for session ${sessionId}...`);
    
    // Build conversation context
    const conversationText = messages
      .map((msg: any) => `${msg.role === 'client' ? 'Client' : 'Therapist'}: ${msg.content}`)
      .join('\n\n');
    
    // Calculate average coherence
    const avgCoherence = coherenceScores.length > 0
      ? coherenceScores.reduce((a: number, b: number) => a + b, 0) / coherenceScores.length
      : 0;
    
    // Generate summary using LLM
    const summaryPrompt = `You are an expert psychologist. Summarize this therapeutic session in 3-4 paragraphs. Focus on:
1. Main themes and concerns discussed
2. Client's emotional state and attachment patterns (if relevant)
3. Progress and insights gained
4. Overall session quality (avg coherence: ${avgCoherence.toFixed(3)})

Session transcript:
${conversationText}

Provide a professional, compassionate summary.`;
    
    const recommendationsPrompt = `Based on this therapeutic session, provide 4-6 specific, actionable recommendations for the client's continued growth. Use SFH and attachment theory principles.

Session transcript:
${conversationText}

Format as a numbered list. Be specific and practical.`;
    
    const summaryRequest: LLMRequest = {
      messages: [
        { role: 'system', content: 'You are an expert psychologist writing session summaries.' },
        { role: 'user', content: summaryPrompt }
      ],
      temperature: 0.7,
      maxTokens: 500
    };
    
    const recommendationsRequest: LLMRequest = {
      messages: [
        { role: 'system', content: 'You are an expert psychologist providing therapeutic recommendations.' },
        { role: 'user', content: recommendationsPrompt }
      ],
      temperature: 0.7,
      maxTokens: 400
    };
    
    // Generate both in parallel
    const [summaryResponse, recResponse] = await Promise.all([
      orchestrator.sendRequest('groq', summaryRequest),
      orchestrator.sendRequest('groq', recommendationsRequest)
    ]);
    
    console.log('Summary generated successfully');
    
    res.json({
      summary: summaryResponse.rawResponse,
      recommendations: recResponse.rawResponse
    });
    
  } catch (error) {
    console.error('Export summary error:', error);
    res.status(500).json({ 
      error: 'Failed to generate summary',
      message: error instanceof Error ? error.message : String(error)
    });
  }
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
