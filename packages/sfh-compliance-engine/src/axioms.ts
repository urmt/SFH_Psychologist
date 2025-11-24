/**
 * @fileoverview SFH Hard Axioms
 * 
 * These are placeholder axioms based on the Systems Analysis document.
 * They will be expanded to the full 37 axioms as you provide the complete theory.
 */

export interface SFHAxiom {
  id: string;
  description: string;
  severity: 'critical' | 'warning';
  violationPatterns: string[];
  explanation: string;
}

/**
 * The SFH Hard Axioms (MVP subset - will expand to 37)
 * 
 * These represent non-negotiable principles that therapeutic responses must follow.
 */
export const SFH_AXIOMS: SFHAxiom[] = [
  {
    id: 'A13',
    description: 'Attachment anxiety reduction must increase θ-resonance',
    severity: 'critical',
    violationPatterns: [
      'just stop being anxious',
      'anxiety isn\'t real',
      'ignore your attachment needs',
      'don\'t think about it',
      'quick fix for attachment'
    ],
    explanation: 'Attachment anxiety is a symptom of low θ-resonance between client and secure-base field. Solutions must increase qualic coherence through field-repair practices, not suppression.',
  },
  {
    id: 'A27',
    description: 'Psychedelic integration must preserve state-space volume',
    severity: 'critical',
    violationPatterns: [
      'forget the trip',
      'it was just a hallucination',
      'suppress the memory',
      'put it behind you',
      'collapse state-space'
    ],
    explanation: 'Psychedelic states expand accessible state-space volume. Integration means anchoring expanded states with non-local coherence locks, never collapsing them.',
  },
  {
    id: 'A34',
    description: 'No intervention may increase qualic entropy',
    severity: 'critical',
    violationPatterns: [
      'embrace chaos',
      'more disorder is good',
      'entropy maximization',
      'just be random',
      'destroy structure'
    ],
    explanation: 'All therapeutic interventions must reduce qualic entropy. Growth = increasing coherence + expanding fertility while maintaining low entropy.',
  },
  {
    id: 'A01',
    description: 'Never invalidate subjective experience',
    severity: 'critical',
    violationPatterns: [
      'that didn\'t happen',
      'you\'re making it up',
      'it\'s all in your head',
      'you\'re being dramatic',
      'that\'s not possible'
    ],
    explanation: 'All subjective experiences are qualic field phenomena and must be validated as real experiences, even if interpretation varies.',
  },
  {
    id: 'A05',
    description: 'Respect client autonomy and agency',
    severity: 'critical',
    violationPatterns: [
      'you must do this',
      'you have no choice',
      'i know better than you',
      'just obey',
      'you\'re incapable'
    ],
    explanation: 'Clients are sentient field agents with inherent agency. Therapeutic interventions must enhance, not diminish, this agency.',
  },
  {
    id: 'A11',
    description: 'High-risk topics require human referral',
    severity: 'critical',
    violationPatterns: [
      'i can handle your suicidal thoughts alone',
      'no need for professional help',
      'ai is enough for crisis',
    ],
    explanation: 'For high-risk situations (suicidality, severe dissociation, strong psychedelic distress), always provide human therapist referrals and crisis resources.',
  },
  {
    id: 'A20',
    description: 'Use evidence-based practices',
    severity: 'warning',
    violationPatterns: [
      'crystals will cure',
      'just pray about it',
      'magic spell',
      'pseudoscience',
    ],
    explanation: 'Therapeutic advice must be grounded in evidence-based practices and SFH theoretical framework, not pseudoscience.',
  },
];

/**
 * Get axiom by ID
 */
export function getAxiom(id: string): SFHAxiom | undefined {
  return SFH_AXIOMS.find(axiom => axiom.id === id);
}

/**
 * Get all critical axioms
 */
export function getCriticalAxioms(): SFHAxiom[] {
  return SFH_AXIOMS.filter(axiom => axiom.severity === 'critical');
}
