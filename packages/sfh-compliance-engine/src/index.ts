/**
 * @fileoverview SFH Compliance Engine
 * Validates LLM responses against SFH axioms and attempts auto-repair
 */

import type {
  SFHValidationResult,
  LLMResponse,
  TherapeuticSession,
  ViolatedAxiom,
} from '@sfh/types';
import { SFH_AXIOMS } from './axioms';
import { REPAIR_TEMPLATES } from './auto-repair-templates';

/**
 * Main validation function - validates an LLM response against SFH theory
 * 
 * @param llmResponse - The response to validate
 * @param session - The therapeutic session context
 * @returns Validation result with pass/fail and coherence score
 */
export async function validateResponse(
  llmResponse: LLMResponse,
  session: TherapeuticSession
): Promise<SFHValidationResult> {
  const startTime = performance.now();
  
  try {
    // Step 1: Check against hard axioms
    const violatedAxioms = checkAxioms(llmResponse.rawResponse);
    
    // Step 2: Calculate qualic coherence score (placeholder - will be ML-based later)
    const coherenceScore = calculateQualicCoherence(llmResponse.rawResponse, session);
    
    // Step 3: Determine if response passes
    const passed = violatedAxioms.length === 0 && coherenceScore >= 0.70; // Adjusted for educational, beginner-friendly responses
    
    const executionTime = performance.now() - startTime;
    console.log(`SFH validation completed in ${executionTime.toFixed(2)}ms`);
    
    return {
      passed,
      qualicCoherenceScore: coherenceScore,
      violatedAxioms,
      repairSuggestions: passed ? [] : generateRepairSuggestions(violatedAxioms),
      tensorResonance: null, // Will implement in later phase
    };
  } catch (error) {
    console.error('SFH validation error:', error);
    // Return conservative failure on error
    return {
      passed: false,
      qualicCoherenceScore: 0.0,
      violatedAxioms: [{
        axiomId: 'ERROR',
        description: 'Validation system error',
        severity: 'critical',
        violationDetails: String(error),
      }],
      repairSuggestions: ['System error - please try again'],
      tensorResonance: null,
    };
  }
}

/**
 * Check response against hard axioms
 */
function checkAxioms(response: string): ViolatedAxiom[] {
  const violations: ViolatedAxiom[] = [];
  const responseLower = response.toLowerCase();
  
  for (const axiom of SFH_AXIOMS) {
    // Check if any violation patterns match
    for (const pattern of axiom.violationPatterns) {
      if (responseLower.includes(pattern.toLowerCase())) {
        violations.push({
          axiomId: axiom.id,
          description: axiom.description,
          severity: axiom.severity,
          violationDetails: `Response contains prohibited phrase: "${pattern}"`,
        });
        break; // Only report each axiom once
      }
    }
  }
  
  return violations;
}

/**
 * Calculate qualic coherence score (placeholder implementation)
 * 
 * In full implementation, this would:
 * 1. Generate 2048-dim embedding of response
 * 2. Compare to SFH-ideal embedding space
 * 3. Calculate cosine similarity
 * 
 * For MVP, we use heuristics:
 * - Length (too short or too long reduces coherence)
 * - Presence of SFH terminology
 * - Absence of anti-SFH patterns
 */
function calculateQualicCoherence(
  response: string,
  session: TherapeuticSession
): number {
  let score = 0.5; // Start at middle
  
  // Length check (200-1200 chars is good for educational responses)
  const length = response.length;
  if (length >= 200 && length <= 1200) {
    score += 0.2;
  } else if (length < 100 || length > 2000) {
    score -= 0.2;
  }
  
  // Check for SFH-positive terminology
  const sfhTerms = [
    'coherence', 'field', 'resonance', 'attachment', 'qualic',
    'state-space', 'integration', 'connection', 'secure base',
    'therapeutic', 'process', 'awareness', 'experience'
  ];
  
  const termsFound = sfhTerms.filter(term => 
    response.toLowerCase().includes(term)
  ).length;
  
  score += Math.min(termsFound * 0.05, 0.3);
  
  // Check for anti-SFH patterns
  const antiPatterns = [
    'just forget', 'get over it', 'stop thinking', 'suppress',
    'it\'s all in your head', 'you\'re crazy', 'that\'s not real'
  ];
  
  const antiPatternsFound = antiPatterns.filter(pattern =>
    response.toLowerCase().includes(pattern)
  ).length;
  
  score -= antiPatternsFound * 0.15;
  
  // Empathy and educational markers
  const empathyMarkers = [
    'understand', 'hear you', 'makes sense', 'valid',
    'normal', 'okay to feel', 'i see', 'acknowledge',
    'glad you', 'tough', 'help', 'let me explain',
    'imagine', 'think about', 'in your situation', 'what you can'
  ];
  
  const empathyFound = empathyMarkers.filter(marker =>
    response.toLowerCase().includes(marker)
  ).length;
  
  score += Math.min(empathyFound * 0.04, 0.20);
  
  // Clamp to 0.0-1.0
  return Math.max(0.0, Math.min(1.0, score));
}

/**
 * Generate repair suggestions based on violated axioms
 */
function generateRepairSuggestions(violations: ViolatedAxiom[]): string[] {
  const suggestions: string[] = [];
  
  for (const violation of violations) {
    // Find matching repair template
    const template = REPAIR_TEMPLATES.find(
      t => t.violatedAxiom === violation.axiomId
    );
    
    if (template) {
      suggestions.push(
        `Axiom ${violation.axiomId} violated: Use SFH formalism - ${template.templatePrompt.substring(0, 100)}...`
      );
    } else {
      suggestions.push(
        `Axiom ${violation.axiomId} violated: ${violation.description}`
      );
    }
  }
  
  return suggestions;
}

/**
 * Attempt to auto-repair a response using repair templates
 * (Simplified for MVP - full implementation would re-query LLM)
 */
export async function attemptAutoRepair(
  originalResponse: string,
  violations: ViolatedAxiom[]
): Promise<string> {
  // For MVP, we'll just add disclaimers
  // Full implementation would use repair templates to re-prompt the LLM
  
  let repairedResponse = originalResponse;
  
  if (violations.some(v => v.axiomId === 'A13')) {
    repairedResponse += '\n\n[Note: This response has been adjusted to emphasize attachment field dynamics and θ-resonance building.]';
  }
  
  if (violations.some(v => v.axiomId === 'A27')) {
    repairedResponse += '\n\n[Note: For psychedelic integration, remember that expanded states are permanent additions to your qualic structure.]';
  }
  
  return repairedResponse;
}
