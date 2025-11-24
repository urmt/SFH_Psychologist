/**
 * @fileoverview Vercel Serverless Chat API - Self-contained version
 * All dependencies bundled to avoid monorepo import issues
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

// ============================================
// Type Definitions (bundled from packages/types)
// ============================================

type RiskLevel = 'low' | 'medium' | 'high' | 'emergency';
type TopicTag = 'attachment_anxiety' | 'attachment_avoidance' | 'psychedelic' | 'suicidal' | 'dissociation' | 'social';

interface TherapeuticSession {
  sessionId: string;
  userId: string;
  messages: Array<{
    role: 'client' | 'therapist';
    content: string;
    timestamp: Date;
    coherenceScore?: number;
  }>;
  topicTags: TopicTag[];
  riskLevel: RiskLevel;
  coherenceHistory: number[];
  encrypted: boolean;
}

// ============================================
// Session Management
// ============================================

const sessions = new Map<string, TherapeuticSession>();

function getOrCreateSession(sessionId: string, userId: string): TherapeuticSession {
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, {
      sessionId,
      userId,
      messages: [],
      topicTags: [],
      riskLevel: 'low',
      coherenceHistory: [],
      encrypted: false,
    });
  }
  return sessions.get(sessionId)!;
}

// ============================================
// Topic Detection
// ============================================

function detectTopicTags(message: string): TopicTag[] {
  const tags: TopicTag[] = [];
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.match(/anxious|anxiety|attachment|partner|relationship|abandon/)) {
    tags.push('attachment_anxiety');
  }
  if (lowerMessage.match(/distance|avoid|close|intimacy/)) {
    tags.push('attachment_avoidance');
  }
  if (lowerMessage.match(/psychedelic|trip|mushroom|lsd|dmt|integration|journey/)) {
    tags.push('psychedelic');
  }
  if (lowerMessage.match(/friends|social|lonely|isolated|disconnect/)) {
    tags.push('social');
  }
  if (lowerMessage.match(/suicid|kill myself|end it all|want to die/)) {
    tags.push('suicidal');
  }
  if (lowerMessage.match(/dissociat|unreal|detach|derealization/)) {
    tags.push('dissociation');
  }
  
  return tags;
}

function determineRiskLevel(tags: TopicTag[]): RiskLevel {
  if (tags.includes('suicidal')) return 'emergency';
  if (tags.includes('dissociation')) return 'high';
  if (tags.includes('attachment_anxiety') || tags.includes('psychedelic')) return 'medium';
  return 'low';
}

// ============================================
// LLM Integration (Groq)
// ============================================

function buildSystemPrompt(session: TherapeuticSession): string {
  return `You are a specialized AI psychologist trained in Sentient-Field Hypothesis (SFH), attachment theory, and psychedelic integration.

Your role is to provide educational, accessible psychological support that explains SFH concepts in plain language.

RESPONSE STRUCTURE (Always follow this order):

1. ASK CLARIFYING QUESTIONS (1-2 questions)
   - What specific aspects need more context?
   - When did this start? What triggers it?

2. EXPLAIN SFH CONCEPTS IN PLAIN LANGUAGE
   - Use everyday analogies and examples
   - Translate technical terms: "θ-resonance" → "emotional connection"
   - Make it educational for complete beginners
   
   Example: "Think of emotional connection like two tuning forks vibrating together. When one person's 'fork' gets disrupted (like your partner not texting back), it sends ripples through YOUR emotional field, causing anxiety. That's what we call 'field disruption' in SFH theory."

3. CONNECT TO THEIR EXPERIENCE
   - Apply the concepts to their specific situation
   - Show how SFH explains what they're feeling
   - Validate their experience

4. SUGGEST PRACTICAL ACTIONS
   - Evidence-based techniques they can try
   - Specific, actionable steps
   - Based on attachment theory and SFH principles

PLAIN LANGUAGE TRANSLATIONS:
- θ-resonance → "emotional connection" or "feeling in sync"
- State-space → "range of emotional experiences"
- Field → "emotional atmosphere" or "energy between people"
- Coherence → "stability" or "feeling integrated"
- Attachment patterns → "relationship styles we learned growing up"

TONE: Warm, educational, non-judgmental. Like a knowledgeable friend explaining psychology concepts.

Current session context:
- Risk level: ${session.riskLevel}
- Topics discussed: ${session.topicTags.join(', ') || 'none yet'}
- Messages: ${session.messages.length}

${session.riskLevel === 'emergency' || session.riskLevel === 'high' ? '\n⚠️ HIGH RISK: Include crisis resources (988 in US) and strongly recommend professional help.' : ''}`;
}

async function callGroqAPI(prompt: string, session: TherapeuticSession): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  
  if (!apiKey) {
    throw new Error('GROQ_API_KEY not configured');
  }

  const systemPrompt = buildSystemPrompt(session);
  
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        ...session.messages.slice(-5).map(msg => ({
          role: msg.role === 'client' ? 'user' : 'assistant',
          content: msg.content
        })),
        { role: 'user', content: prompt }
      ],
      max_tokens: 800,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Groq API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// ============================================
// SFH Validation (Simplified)
// ============================================

function calculateCoherence(text: string): number {
  let score = 0.5; // Base score
  
  // Length check (200-1200 chars optimal)
  const length = text.length;
  if (length >= 200 && length <= 1200) {
    score += 0.15;
  } else if (length < 100 || length > 2000) {
    score -= 0.1;
  }
  
  // SFH terminology (both technical and plain language)
  const sfhTerms = [
    'coherence', 'field', 'resonance', 'attachment', 'qualic',
    'emotional connection', 'feeling in sync', 'emotional atmosphere',
    'stability', 'integrated', 'relationship style'
  ];
  const termMatches = sfhTerms.filter(term => 
    text.toLowerCase().includes(term)
  ).length;
  score += Math.min(termMatches * 0.05, 0.2);
  
  // Educational markers
  const eduMarkers = [
    'think of', 'imagine', 'for example', 'like when', 'similar to',
    'this means', 'in other words', 'to put it simply'
  ];
  const eduMatches = eduMarkers.filter(marker =>
    text.toLowerCase().includes(marker)
  ).length;
  score += Math.min(eduMatches * 0.08, 0.15);
  
  // Empathy markers
  const empathyTerms = ['understand', 'makes sense', 'valid', 'natural', 'normal'];
  const empathyMatches = empathyTerms.filter(term =>
    text.toLowerCase().includes(term)
  ).length;
  score += Math.min(empathyMatches * 0.05, 0.15);
  
  // Anti-patterns (reduce score)
  const antiPatterns = ['just forget', 'get over it', 'stop thinking', 'suppress'];
  const antiMatches = antiPatterns.filter(pattern =>
    text.toLowerCase().includes(pattern)
  ).length;
  score -= antiMatches * 0.2;
  
  return Math.max(0, Math.min(1, score));
}

function validateAxioms(text: string, session: TherapeuticSession): string[] {
  const violations: string[] = [];
  
  // A01: Never invalidate experience
  if (text.match(/not a big deal|overreacting|too sensitive/i)) {
    violations.push('A01: Invalidating user experience');
  }
  
  // A11: High-risk requires human referral
  if ((session.riskLevel === 'high' || session.riskLevel === 'emergency') &&
      !text.match(/professional|therapist|counselor|988|crisis/i)) {
    violations.push('A11: High-risk situation without human referral');
  }
  
  return violations;
}

// ============================================
// Main Handler
// ============================================

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const { message, sessionId, userId, messages = [] } = req.body;
    
    if (!message || !sessionId || !userId) {
      return res.status(400).json({ 
        error: 'Missing required fields: message, sessionId, userId' 
      });
    }
    
    // Get/create session
    const session = getOrCreateSession(sessionId, userId);
    
    // Update session with client messages
    session.messages = messages.map((msg: any) => ({
      role: msg.role,
      content: msg.content,
      timestamp: new Date(msg.timestamp),
      coherenceScore: msg.coherenceScore,
    }));
    
    // Detect topics and update risk
    const newTags = detectTopicTags(message);
    for (const tag of newTags) {
      if (!session.topicTags.includes(tag)) {
        session.topicTags.push(tag);
      }
    }
    session.riskLevel = determineRiskLevel(session.topicTags);
    
    // Call LLM
    const startTime = Date.now();
    const llmResponse = await callGroqAPI(message, session);
    const latencyMs = Date.now() - startTime;
    
    // Validate response
    const coherenceScore = calculateCoherence(llmResponse);
    const axiomViolations = validateAxioms(llmResponse, session);
    const passed = coherenceScore >= 0.70 && axiomViolations.length === 0;
    
    // Update session
    session.coherenceHistory.push(coherenceScore);
    
    return res.json({
      response: llmResponse,
      validation: {
        passed,
        qualicCoherenceScore: coherenceScore,
        violatedAxioms: axiomViolations.map(v => ({ description: v })),
        repairSuggestions: [],
      },
      metadata: {
        provider: 'groq',
        latencyMs,
        tokenCount: Math.floor(llmResponse.length / 4),
        riskLevel: session.riskLevel,
        topicTags: session.topicTags,
      }
    });
    
  } catch (error) {
    console.error('Chat API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : String(error)
    });
  }
}
