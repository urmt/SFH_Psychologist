/**
 * @fileoverview Core TypeScript interfaces for Sentient-Field Psychologist
 * This file defines the contract layer for ALL module boundaries.
 * 
 * Every interface is documented with comments for novice programmers.
 */

// ============================================
// LLM Orchestration Interfaces
// ============================================

/**
 * Represents a single LLM provider (e.g., Grok, Claude, Gemini)
 */
export interface LLMProvider {
  /** Provider name (e.g., "grok-2", "claude-3.5-sonnet") */
  name: string;
  /** API key for authentication */
  apiKey: string;
  /** Base URL for API endpoint */
  endpoint: string;
  /** Rate limits to prevent API bans */
  rateLimit: { 
    requestsPerMinute: number; 
    tokensPerMinute: number;
  };
  /** What this LLM is good at */
  capabilities: LLMCapability[];
}

/**
 * What types of therapeutic topics an LLM can handle
 */
export enum LLMCapability {
  ATTACHMENT_THEORY = 'attachment',
  PSYCHEDELIC_INTEGRATION = 'psychedelic',
  SOCIAL_PSYCHOLOGY = 'social',
  CRISIS_INTERVENTION = 'crisis',
  WORKSHOP_GENERATION = 'workshop'
}

/**
 * A request to query one or more LLMs
 */
export interface LLMRequest {
  /** The user's message */
  prompt: string;
  /** Conversation history and metadata */
  context: TherapeuticSession;
  /** Maximum tokens to generate */
  maxTokens: number;
  /** Creativity level (0.0 = deterministic, 1.0 = very creative) */
  temperature: number;
  /** What topics this message is about */
  topicTags: TopicTag[];
}

/**
 * Response from a single LLM
 */
export interface LLMResponse {
  /** Which LLM generated this response */
  provider: string;
  /** The actual response text */
  rawResponse: string;
  /** How long it took (milliseconds) */
  latencyMs: number;
  /** Approximate token count */
  tokenCount: number;
  /** When this was generated */
  timestamp: Date;
}

// ============================================
// SFH Compliance Engine Interfaces
// ============================================

/**
 * Result of validating a response against SFH theory
 */
export interface SFHValidationResult {
  /** Did it pass all checks? */
  passed: boolean;
  /** Qualic coherence score (0.0 to 1.0, must be ≥ 0.91 to pass) */
  qualicCoherenceScore: number;
  /** Which axioms were violated (empty if passed) */
  violatedAxioms: ViolatedAxiom[];
  /** Suggestions for repair (empty if passed) */
  repairSuggestions: string[];
  /** Theta-resonance calculation (null if not computed) */
  tensorResonance: ThetaResonance | null;
}

/**
 * Details about a violated SFH axiom
 */
export interface ViolatedAxiom {
  /** Axiom ID (e.g., "A13", "A27", "A34") */
  axiomId: string;
  /** Human-readable description */
  description: string;
  /** How serious is this violation? */
  severity: 'critical' | 'warning';
  /** Specific details about what was wrong */
  violationDetails: string;
}

/**
 * Qualic coherence score calculation details
 */
export interface QualicCoherenceScore {
  /** Raw score from embedding similarity */
  rawScore: number;
  /** Normalized to 0.0-1.0 range */
  normalizedScore: number;
  /** The 2048-dimensional embedding vector */
  embeddingVector: Float32Array;
  /** Computation method and timing */
  computation: {
    method: 'simd_cosine' | 'fallback';
    executionTimeMs: number;
  };
}

/**
 * Theta-resonance calculation for attachment field dynamics
 */
export interface ThetaResonance {
  /** Client's field strength */
  clientField: number;
  /** Therapist's field strength */
  therapistField: number;
  /** Resonance between the two fields */
  dyadResonance: number;
  /** Overall attachment coherence */
  attachmentCoherence: number;
}

// ============================================
// Therapeutic Session Interfaces
// ============================================

/**
 * A complete therapeutic session
 */
export interface TherapeuticSession {
  /** Unique session identifier */
  sessionId: string;
  /** User ID (anonymous or wallet address) */
  userId: string;
  /** All messages in this session */
  messages: SessionMessage[];
  /** What topics have been discussed */
  topicTags: TopicTag[];
  /** Current risk level */
  riskLevel: RiskLevel;
  /** History of coherence scores */
  coherenceHistory: number[];
  /** Is this session encrypted? */
  encrypted: boolean;
}

/**
 * A single message in a session
 */
export interface SessionMessage {
  /** Who sent this message */
  role: 'client' | 'therapist';
  /** Message content */
  content: string;
  /** When it was sent */
  timestamp: Date;
  /** SFH coherence score (only for therapist messages) */
  coherenceScore?: number;
  /** Which LLMs were consulted (only for therapist messages) */
  llmProviders?: string[];
}

/**
 * Topic tags for message classification
 */
export enum TopicTag {
  ATTACHMENT_ANXIETY = 'attachment_anxiety',
  ATTACHMENT_AVOIDANCE = 'attachment_avoidance',
  PSYCHEDELIC_INTEGRATION = 'psychedelic',
  SUICIDALITY = 'suicidal', // HIGH RISK - triggers triple redundancy
  DISSOCIATION = 'dissociation', // HIGH RISK
  SOCIAL_COHERENCE = 'social',
  WORKSHOP_REQUEST = 'workshop'
}

/**
 * Risk level determines validation strictness
 */
export enum RiskLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high', // Triggers triple redundancy (3 LLMs)
  EMERGENCY = 'emergency' // Immediate human referral
}

// ============================================
// Workshop Protocol Interfaces
// ============================================

/**
 * A therapeutic workshop or practice
 */
export interface WorkshopProtocol {
  /** Unique workshop ID */
  id: string;
  /** Workshop title */
  title: string;
  /** Detailed description */
  description: string;
  /** What type of workshop is this? */
  type: 'attachment_ritual' | 'psychedelic_integration' | 'coherence_training';
  /** Duration in minutes */
  duration: number;
  /** Step-by-step instructions */
  steps: WorkshopStep[];
  /** Which SFH axioms this reinforces */
  sfhAxioms: string[];
}

/**
 * A single step in a workshop
 */
export interface WorkshopStep {
  /** Step number (1, 2, 3...) */
  order: number;
  /** What to do */
  instruction: string;
  /** How long this step takes (minutes) */
  duration: number;
  /** What should happen */
  expectedOutcome: string;
  /** Should we check coherence after this step? */
  coherenceCheckpoint?: boolean;
}

// ============================================
// Billing Interfaces
// ============================================

/**
 * Billing provider interface (currently NoOp, ready for Stripe/Crypto)
 */
export interface BillingProvider {
  /** Estimate cost of processing these messages */
  estimateCost(messages: SessionMessage[]): Promise<number>;
  /** Charge a user */
  charge(userId: string, amount: number): Promise<PaymentResult>;
}

/**
 * Result of a payment attempt
 */
export interface PaymentResult {
  /** Did payment succeed? */
  success: boolean;
  /** Transaction ID (if successful) */
  transactionId?: string;
  /** Error message (if failed) */
  error?: string;
}

// ============================================
// Feedback & Evolution Interfaces
// ============================================

/**
 * User feedback on a session
 */
export interface SessionFeedback {
  /** Which session is this feedback for? */
  sessionId: string;
  /** 1-5 star rating */
  rating: number;
  /** Optional written feedback */
  qualitativeNotes?: string;
  /** Was this helpful? */
  wasHelpful: boolean;
  /** Any issues to report */
  reportedIssues: string[];
  /** When feedback was submitted */
  timestamp: Date;
}

/**
 * Metrics for system evolution
 */
export interface EvolutionMetrics {
  /** Average coherence score */
  averageCoherence: number;
  /** How often axioms are violated */
  axiomViolationRate: number;
  /** How often auto-repair succeeds */
  autoRepairSuccessRate: number;
  /** Average user satisfaction */
  clientSatisfaction: number;
  /** Time period these metrics cover */
  timeWindow: { start: Date; end: Date };
}

// ============================================
// Auto-Repair Template Interface
// ============================================

/**
 * A template for repairing SFH violations
 */
export interface AutoRepairTemplate {
  /** Template ID */
  id: string;
  /** Which axiom this repairs */
  violatedAxiom: string;
  /** Chain-of-Thought prompt to fix the violation */
  templatePrompt: string;
  /** Example of a violating response */
  exampleInput: string;
  /** Example of fixed response */
  exampleOutput: string;
  /** How often this template successfully repairs violations */
  successRate: number;
}
