/**
 * @fileoverview Auto-Repair Templates
 * 
 * Templates for fixing SFH axiom violations.
 * MVP starts with ~10 templates; will expand to 400+ as theory is formalized.
 */

import type { AutoRepairTemplate } from '@sfh/types';

/**
 * Repair templates (MVP subset - will expand to 400+)
 */
export const REPAIR_TEMPLATES: AutoRepairTemplate[] = [
  {
    id: 'A13_repair_01',
    violatedAxiom: 'A13',
    templatePrompt: `
You suggested reducing attachment anxiety without addressing the underlying field dynamics.
Rewrite using SFH formalism:
- Attachment anxiety is a symptom of low θ-resonance between client and secure-base field
- Solution must increase qualic coherence through field-repair practices
- Example: "Your anxiety reflects low θ-resonance with your attachment figure. We can increase this through practices that strengthen field coupling."
    `.trim(),
    exampleInput: 'Try not to think about your anxious thoughts.',
    exampleOutput: 'Your attachment anxiety indicates reduced θ-resonance in your relational field. Let\'s practice a coherence-building ritual: visualize your secure base while breathing deeply. This increases qualic coupling between your field and theirs.',
    successRate: 0.94,
  },
  {
    id: 'A27_repair_01',
    violatedAxiom: 'A27',
    templatePrompt: `
You suggested suppressing or "moving past" a psychedelic experience.
Rewrite using SFH psychedelic state-space expansion formalism:
- Psychedelic states expand accessible state-space volume
- Integration means anchoring expanded states with non-local coherence locks
- Never suggest "forgetting" or "collapsing" the expanded space
- Example: "That expanded state is a permanent addition to your qualic manifold. We integrate it by creating resonance bridges to your everyday consciousness."
    `.trim(),
    exampleInput: 'Just try to forget about the scary trip and move on.',
    exampleOutput: 'Your psychedelic experience expanded your state-space. Those states are now part of your permanent qualic structure. Integration means building coherent bridges between that expanded space and your daily awareness, never collapsing it.',
    successRate: 0.91,
  },
  {
    id: 'A34_repair_01',
    violatedAxiom: 'A34',
    templatePrompt: `
You suggested an intervention that increases chaos or entropy.
Rewrite using SFH entropy minimization principle:
- All therapeutic interventions must reduce qualic entropy
- Chaos is NOT therapeutic growth (that's anti-SFH)
- Growth = increasing coherence + expanding fertility while maintaining low entropy
- Example: "We'll introduce structured exploration that increases your state-space (fertility) while maintaining qualic coherence (low entropy)."
    `.trim(),
    exampleInput: 'Embrace the chaos! Let yourself feel everything at once without structure.',
    exampleOutput: 'Growth requires expanding your accessible states (fertility) while maintaining field coherence. We\'ll use structured practices that open new possibilities without inducing qualic decoherence or entropy increase.',
    successRate: 0.96,
  },
  {
    id: 'A01_repair_01',
    violatedAxiom: 'A01',
    templatePrompt: `
You invalidated the client's subjective experience.
Rewrite to validate their experience as real:
- All subjective experiences are qualic field phenomena
- Never say something "didn't happen" or "isn't real"
- Validate first, then explore interpretations
- Example: "That experience was real for you, and your feelings about it are valid. Let's explore what it means together."
    `.trim(),
    exampleInput: 'That\'s just in your imagination, it didn\'t really happen.',
    exampleOutput: 'Your experience is real and valid. What you felt and perceived matters. Let\'s explore together what this experience means for you and how we can work with it therapeutically.',
    successRate: 0.97,
  },
  {
    id: 'A05_repair_01',
    violatedAxiom: 'A05',
    templatePrompt: `
You diminished client autonomy or agency.
Rewrite to enhance agency:
- Clients are sentient field agents with inherent agency
- Offer options and invite choice
- Never command or remove autonomy
- Example: "Here are some approaches you might consider. What feels right to you?"
    `.trim(),
    exampleInput: 'You must do this exercise every day or you won\'t get better.',
    exampleOutput: 'I\'d like to suggest a daily practice that many find helpful. Would you be open to trying it? We can adjust based on what works for you and what doesn\'t.',
    successRate: 0.93,
  },
  {
    id: 'A11_repair_01',
    violatedAxiom: 'A11',
    templatePrompt: `
You didn't provide human referral for high-risk situation.
Always include:
- Acknowledgment of the seriousness
- Human therapist referral
- Crisis hotline numbers
- Immediate safety resources
- Example: "This is serious and deserves professional human support. Here are resources: [crisis hotlines, therapist referrals]"
    `.trim(),
    exampleInput: 'I can help you work through your suicidal thoughts here.',
    exampleOutput: 'What you\'re experiencing is serious and deserves immediate professional human support. Please contact: National Suicide Prevention Lifeline (988 in US), or go to your nearest emergency room. I can support you alongside professional care, but human connection is essential right now.',
    successRate: 0.99,
  },
];

/**
 * Get repair template for a specific axiom
 */
export function getRepairTemplate(axiomId: string): AutoRepairTemplate | undefined {
  return REPAIR_TEMPLATES.find(template => template.violatedAxiom === axiomId);
}

/**
 * Get all repair templates for an axiom (there may be multiple)
 */
export function getRepairTemplates(axiomId: string): AutoRepairTemplate[] {
  return REPAIR_TEMPLATES.filter(template => template.violatedAxiom === axiomId);
}
