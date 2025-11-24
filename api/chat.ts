import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getOrchestrator } from './_lib/orchestrator';
import type { TherapeuticSession, RiskLevel, TopicTag } from '../packages/types/src/index';

// In-memory session storage (ephemeral in serverless)
const sessions = new Map<string, TherapeuticSession>();

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
  }
  return sessions.get(sessionId)!;
}

function detectTopicTags(message: string): TopicTag[] {
  const tags: TopicTag[] = [];
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.match(/anxious|anxiety|attachment|partner|relationship|abandon/)) {
    tags.push('attachment_anxiety' as TopicTag);
  }
  if (lowerMessage.match(/distance|avoid|close|intimacy/)) {
    tags.push('attachment_avoidance' as TopicTag);
  }
  if (lowerMessage.match(/psychedelic|trip|mushroom|lsd|dmt|integration|journey/)) {
    tags.push('psychedelic' as TopicTag);
  }
  if (lowerMessage.match(/friends|social|lonely|isolated|disconnect/)) {
    tags.push('social' as TopicTag);
  }
  if (lowerMessage.match(/suicid|kill myself|end it all|want to die/)) {
    tags.push('suicidal' as TopicTag);
  }
  if (lowerMessage.match(/dissociat|unreal|detach|derealization/)) {
    tags.push('dissociation' as TopicTag);
  }
  
  return tags;
}

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
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
    
    const orchestrator = getOrchestrator();
    const session = getOrCreateSession(sessionId, userId);
    
    session.messages = messages.map((msg: any) => ({
      role: msg.role,
      content: msg.content,
      timestamp: new Date(msg.timestamp),
      coherenceScore: msg.coherenceScore,
    }));
    
    const newTags = detectTopicTags(message);
    for (const tag of newTags) {
      if (!session.topicTags.includes(tag)) {
        session.topicTags.push(tag);
      }
    }
    
    session.riskLevel = determineRiskLevel(session.topicTags);
    
    const result = await orchestrator.processMessage(message, session);
    
    session.coherenceHistory.push(result.validation.qualicCoherenceScore);
    
    return res.json({
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
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : String(error)
    });
  }
}
