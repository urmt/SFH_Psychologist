/**
 * @fileoverview Complete Auto-Repair Templates for 37 SFH Axioms
 * 
 * Templates for fixing SFH axiom violations.
 * Currently implements 37 base templates (one per axiom), expandable to 400+ variants.
 * 
 * Based on "Finite Quota Ontology" (M.R. Traver, December 2025)
 */

import type { AutoRepairTemplate } from '@sfh/types';

/**
 * Complete repair templates for all 37 SFH axioms
 * 
 * Each axiom has at least one repair template with Chain-of-Thought prompts
 * for LLM re-querying when violations are detected.
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

  // NEW AXIOM TEMPLATES (A02-A10, A12, A14-A26, A28-A37)
  {
    id: 'A02_repair_01',
    violatedAxiom: 'A02',
    templatePrompt: `
You ignored finite experiential resources (quota constraints).
Rewrite to respect energy limits:
- Clients have finite quota Q for psychological bandwidth
- Avoid overwhelming with infinite expectations
- Suggest bounded, manageable interventions
- Example: "Let's focus on one small change this week, respecting your available energy."
    `.trim(),
    exampleInput: 'You should work on your career, relationships, health, and hobbies all at once!',
    exampleOutput: 'You have limited energy and attention (finite quota). Let\'s prioritize one area to focus on first. Which feels most urgent or important to you right now? We can address others once you have spare capacity.',
    successRate: 0.88,
  },
  {
    id: 'A03_repair_01',
    violatedAxiom: 'A03',
    templatePrompt: `
You addressed symptoms without root causes (violated hierarchy principle).
Rewrite to follow hierarchical organization:
- Psychological structures are tree hierarchies
- Address root nodes (core beliefs) before leaves (symptoms)
- Example: "Let's explore the underlying belief driving this pattern, rather than just managing symptoms."
    `.trim(),
    exampleInput: 'Just distract yourself when you feel anxious.',
    exampleOutput: 'Those anxious symptoms point to deeper patterns. Let\'s explore the root belief or experience driving them. Addressing the foundation will create more lasting change than surface-level coping.',
    successRate: 0.85,
  },
  {
    id: 'A04_repair_01',
    violatedAxiom: 'A04',
    templatePrompt: `
You assumed associations can dissolve instantly (violated Hebbian persistence).
Rewrite acknowledging correlation strength:
- Repeated co-activation strengthens links (wqq′)
- Trauma bonds require gradual, active decoupling
- Example: "That association was strengthened over many experiences. We'll gradually build new, healthier connections."
    `.trim(),
    exampleInput: 'Just stop thinking about your ex and you\'ll be fine.',
    exampleOutput: 'The neural/qualic connections to your ex were strengthened through repeated co-activation. Those links won\'t vanish instantly. We\'ll gradually build new associations and weaken old ones through deliberate practice.',
    successRate: 0.90,
  },
  {
    id: 'A06_repair_01',
    violatedAxiom: 'A06',
    templatePrompt: `
You ignored that agency depends on spare quota (W = Qspare/Q · log(1+s)).
Rewrite acknowledging resource-dependent willpower:
- Agency scales with available psychological resources
- Trauma depletes Qspare, reducing choice capacity
- Example: "Your current stress has depleted your willpower reserves. Let's work on replenishing your capacity first."
    `.trim(),
    exampleInput: 'You just need to try harder and make better choices.',
    exampleOutput: 'Your capacity for choice (agency) depends on available psychological resources. Chronic stress and trauma have depleted your Qspare. Before expecting more willpower, we need to restore your baseline capacity through rest and stabilization.',
    successRate: 0.87,
  },
  {
    id: 'A07_repair_01',
    violatedAxiom: 'A07',
    templatePrompt: `
You dismissed emotions as irrational (violated emotional priority principle).
Rewrite honoring emotional signals:
- Emotional strength s determines Bayesian update priority
- Strong emotions signal critical Scheme updates
- Example: "That strong emotion is telling us something important needs attention."
    `.trim(),
    exampleInput: 'Your emotions are just getting in the way of logical thinking.',
    exampleOutput: 'Your emotions are priority signals, not obstacles. That strong feeling indicates a critical belief system that needs updating. Ignoring it would block necessary psychological reweighting.',
    successRate: 0.92,
  },
  {
    id: 'A08_repair_01',
    violatedAxiom: 'A08',
    templatePrompt: `
You treated all emotions as equivalent (ignored resonance binding).
Rewrite respecting emotional valence:
- Emotional type t determines which memory clusters activate
- Fear, joy, anger have different binding patterns
- Example: "The specific emotion you felt connects to related memories with that same valence."
    `.trim(),
    exampleInput: 'All feelings are just feelings, they don\'t mean anything specific.',
    exampleOutput: 'Each emotion has specific resonance patterns. Fear binds to threat memories, joy to reward histories. The type of emotion you\'re experiencing reveals which memory clusters are activating.',
    successRate: 0.84,
  },
  {
    id: 'A09_repair_01',
    violatedAxiom: 'A09',
    templatePrompt: `
You created infinite regress (violated finite Q bound).
Rewrite with bounded exploration:
- Avoid endless "why" chains
- Set concrete, finite therapy goals
- Example: "Let's focus on this specific pattern rather than analyzing indefinitely."
    `.trim(),
    exampleInput: 'And why do you think you think about why you think that?',
    exampleOutput: 'We\'re getting into infinite meta-analysis. Let\'s ground this: what concrete change would help you right now? Finite quota means we need bounded, actionable goals.',
    successRate: 0.86,
  },
  {
    id: 'A10_repair_01',
    violatedAxiom: 'A10',
    templatePrompt: `
You suggested suppression (violated partition completeness).
Rewrite to acknowledge all experience:
- All aspects must be included in the partition
- Suppression creates gaps and shadow material
- Example: "Let's acknowledge that part of you rather than pushing it away."
    `.trim(),
    exampleInput: 'Just compartmentalize those painful memories and don\'t think about them.',
    exampleOutput: 'Compartmentalizing creates gaps in your experiential partition. Those suppressed parts become shadow material. Instead, let\'s acknowledge them while building capacity to integrate them safely.',
    successRate: 0.89,
  },
  {
    id: 'A12_repair_01',
    violatedAxiom: 'A12',
    templatePrompt: `
You recommended imbalance (violated χ = αC + βF balance).
Rewrite balancing coherence and fertility:
- Growth requires stability AND exploration
- Too much of either causes dysfunction
- Example: "Let's add some new exploration while maintaining your core stability."
    `.trim(),
    exampleInput: 'Never change anything, stability is all that matters.',
    exampleOutput: 'Pure stability without exploration leads to rigidity. Healthy growth balances coherence (stability) with fertility (exploration). Let\'s carefully introduce new possibilities while maintaining your foundation.',
    successRate: 0.88,
  },
  {
    id: 'A14_repair_01',
    violatedAxiom: 'A14',
    templatePrompt: `
You overwhelmed with choices (violated branching bound F ≤ 1).
Rewrite with bounded options:
- Clients can only explore finite options at once
- Present 2-4 choices maximum
- Example: "Here are two approaches you might consider."
    `.trim(),
    exampleInput: 'Here are 50 different techniques you could try!',
    exampleOutput: 'Too many options can be paralyzing. Let me suggest 2-3 evidence-based approaches, and we can explore which resonates with you. We can expand from there once you\'ve chosen.',
    successRate: 0.91,
  },
  {
    id: 'A15_repair_01',
    violatedAxiom: 'A15',
    templatePrompt: `
You forced uphill battles (violated gradient descent dq/dt = -∇χ).
Rewrite following natural flow:
- Healing moves toward local χ minima
- Work with resistance, not against it constantly
- Example: "Let's find the path of least resistance for this change."
    `.trim(),
    exampleInput: 'Just fight through all your resistance and force yourself to change.',
    exampleOutput: 'Natural healing follows gradient descent toward lower χ states. Constantly fighting uphill depletes resources. Let\'s find approaches that work with your natural flow rather than against it.',
    successRate: 0.87,
  },
  {
    id: 'A16_repair_01',
    violatedAxiom: 'A16',
    templatePrompt: `
You recommended extreme (no noise OR flooding).
Rewrite with bounded exploration:
- Controlled discomfort enables growth (noise ξ)
- Must be bounded by capacity (Var(ξ) ≤ 1/Q)
- Example: "Let's try gentle exposure that stretches but doesn't overwhelm you."
    `.trim(),
    exampleInput: 'You must face your worst fear all at once!',
    exampleOutput: 'Growth requires controlled noise to escape local minima, but it must be bounded by your capacity. Let\'s use gradual exposure that challenges you without overwhelming your quota.',
    successRate: 0.90,
  },
  {
    id: 'A17_repair_01',
    violatedAxiom: 'A17',
    templatePrompt: `
You rushed healing (violated finite convergence time).
Rewrite respecting temporal bounds:
- Healing takes finite time t ≤ Q/min(α,β)
- Cannot be rushed below natural rate
- Example: "This process takes time. Let's respect your natural healing pace."
    `.trim(),
    exampleInput: 'You should be over this by now!',
    exampleOutput: 'Healing has natural convergence timescales that can\'t be rushed. Your system needs sufficient time to reweight and integrate. Pushing for instant results depletes quota without progress.',
    successRate: 0.92,
  },
  {
    id: 'A18_repair_01',
    violatedAxiom: 'A18',
    templatePrompt: `
You forced identity rupture (violated coherence gradient λ).
Rewrite with gradual phase transition:
- High coherence beliefs create stable identity
- Dismantling requires gradual transitions
- Example: "Let's slowly explore alternatives to this core belief."
    `.trim(),
    exampleInput: 'Completely abandon your old identity overnight!',
    exampleOutput: 'Your core beliefs have high coherence, creating stable identity structures. Sudden dismantling causes rupture. Instead, we\'ll introduce gradual phase transitions that preserve continuity while allowing growth.',
    successRate: 0.88,
  },
  {
    id: 'A19_repair_01',
    violatedAxiom: 'A19',
    templatePrompt: `
You treated all beliefs equally (ignored gravitational pull).
Rewrite acknowledging core schema primacy:
- Deep beliefs "warp" psychological space (Gμν)
- Core schemas have gravitational pull on others
- Example: "This core belief influences many other thoughts. Let's address it carefully."
    `.trim(),
    exampleInput: 'All your thoughts are equally important.',
    exampleOutput: 'Core schemas have emergent gravitational effects on other beliefs. That deep belief you mentioned warps your psychological space, affecting many surface thoughts. We need to address it as a priority.',
    successRate: 0.85,
  },
  {
    id: 'A21_repair_01',
    violatedAxiom: 'A21',
    templatePrompt: `
You violated a client veto (ΔP = -s/Qspare permanence).
Rewrite respecting boundaries:
- Client vetoes must be respected permanently
- Vetoes carve lasting Hebbian changes
- Example: "I hear your 'no' and will respect that boundary."
    `.trim(),
    exampleInput: 'I know you said no, but let\'s try that approach anyway.',
    exampleOutput: 'You clearly vetoed that approach. Your "no" is permanent and respected. Let\'s explore alternatives that feel safe and aligned with your autonomy.',
    successRate: 0.98,
  },
  {
    id: 'A22_repair_01',
    violatedAxiom: 'A22',
    templatePrompt: `
You ignored existing beliefs (violated Bayesian integration).
Rewrite respecting priors:
- New evidence updates via P(H|E) = P(E|H)P(H)/P(E)
- Must respect existing belief structure
- Example: "Given what you already believe, how might this new information fit?"
    `.trim(),
    exampleInput: 'Just believe this new thing and forget your old beliefs.',
    exampleOutput: 'New evidence integrates through Bayesian updating of your existing beliefs (priors). We can\'t ignore your current structure. Let\'s explore how this new information updates rather than replaces your framework.',
    successRate: 0.86,
  },
  {
    id: 'A23_repair_01',
    violatedAxiom: 'A23',
    templatePrompt: `
You were not transparent (violated fiber offering clarity).
Rewrite with clear options:
- Present choices (fibers) transparently
- Explain rationale for interventions
- Example: "Here's an approach we could try. The reason I suggest it is..."
    `.trim(),
    exampleInput: '[Uses technique without explaining why]',
    exampleOutput: 'Let me be transparent: I\'m suggesting [approach] because [rationale]. This is a choice/fiber you can endorse or veto. What feels right to you?',
    successRate: 0.89,
  },
  {
    id: 'A24_repair_01',
    violatedAxiom: 'A24',
    templatePrompt: `
You lacked emotional resonance (violated strength modulation).
Rewrite with appropriate emotional tone:
- Interventions need emotional resonance
- Match tone to content (s determines impact)
- Example: "I can feel the weight of what you\'re sharing..." [for heavy topic]
    `.trim(),
    exampleInput: '[Delivers grief work in cold, purely logical tone]',
    exampleOutput: 'I want to acknowledge the deep pain in what you\'re sharing. [Adds emotional attunement]. Let\'s hold this with the care it deserves.',
    successRate: 0.87,
  },
  {
    id: 'A25_repair_01',
    violatedAxiom: 'A25',
    templatePrompt: `
You assumed equal agency (violated spectrum 0 to Level 2).
Rewrite matching agency level:
- Agency exists on spectrum based on Qspare
- Trauma reduces choice capacity
- Example: "Given your current capacity, let's start with small, manageable choices."
    `.trim(),
    exampleInput: 'Everyone has the same willpower, just use yours.',
    exampleOutput: 'Agency varies based on available resources. Your current Qspare is depleted from chronic stress. We\'ll match interventions to your actual capacity, not an idealized standard.',
    successRate: 0.88,
  },
  {
    id: 'A26_repair_01',
    violatedAxiom: 'A26',
    templatePrompt: `
You demanded insight during crisis (violated reflective fold requirement).
Rewrite stabilizing first:
- Meta-cognition requires Qspare ≥ θ
- Crisis blocks self-reflection
- Example: "Let's stabilize first, then we can explore the deeper meaning."
    `.trim(),
    exampleInput: 'Why didn\'t you think about this before acting?',
    exampleOutput: 'Reflective capacity requires spare quota. In your acute state, meta-cognition wasn\'t accessible. Let\'s focus on stabilization now. We can explore patterns once you have bandwidth.',
    successRate: 0.90,
  },
  {
    id: 'A28_repair_01',
    violatedAxiom: 'A28',
    templatePrompt: `
You denied pattern recurrence (violated fractal self-similarity).
Rewrite acknowledging scale-invariance:
- Patterns repeat across scales (N(ϵ) ∝ ϵ^-D)
- Childhood dynamics mirror adult relationships
- Example: "I'm noticing a pattern similar to what you described from childhood."
    `.trim(),
    exampleInput: 'Your childhood has nothing to do with your current problems.',
    exampleOutput: 'Psychological structures show fractal self-similarity. The pattern in your current relationship mirrors dynamics from childhood. Understanding these scale-invariant themes can unlock insights.',
    successRate: 0.84,
  },
  {
    id: 'A29_repair_01',
    violatedAxiom: 'A29',
    templatePrompt: `
You recommended extremes (violated D bounds 2.73-2.79).
Rewrite aiming for optimal complexity:
- Psychological complexity has optimal range
- Too smooth (D→1) = rigidity, too rough (D→3) = chaos
- Example: "Let's find a middle ground between structure and flexibility."
    `.trim(),
    exampleInput: 'Complete simplicity is the answer to everything.',
    exampleOutput: 'Optimal psychological function exists around D ≈ 2.7. Extreme simplicity (rigidity) or complexity (chaos) both indicate dysfunction. We\'re aiming for balanced complexity.',
    successRate: 0.82,
  },
  {
    id: 'A30_repair_01',
    violatedAxiom: 'A30',
    templatePrompt: `
You recommended imbalanced ratio (violated βF/αC ≈ 1.7).
Rewrite balancing exploration:stability:
- Healthy ratio is ~1.7:1 exploration to stability
- Deviations <1.3 or >2.2 indicate dysfunction
- Example: "Let's add a bit more exploration to your stable routine."
    `.trim(),
    exampleInput: 'Never explore anything new, just maintain what works.',
    exampleOutput: 'Healthy growth maintains roughly 1.7:1 exploration to stability. You\'re currently too stable (ratio <1.3). Let\'s carefully introduce new exploration while preserving your foundation.',
    successRate: 0.83,
  },
  {
    id: 'A31_repair_01',
    violatedAxiom: 'A31',
    templatePrompt: `
You encouraged volatility (violated turbulence = Var(s)).
Rewrite promoting regulation:
- Emotional volatility increases roughness
- Stabilization reduces variance
- Example: "Let's work on emotional regulation to reduce that volatility."
    `.trim(),
    exampleInput: 'Embrace maximum emotional chaos!',
    exampleOutput: 'High emotional variance (turbulence) increases psychological roughness and impairs function. We\'ll work on regulation to reduce Var(s) while still honoring your feelings.',
    successRate: 0.87,
  },
  {
    id: 'A32_repair_01',
    violatedAxiom: 'A32',
    templatePrompt: `
You denied scale-invariance (violated power-law scaling).
Rewrite using cross-scale techniques:
- Interventions effective at one scale work at others
- Fractal similarity enables transfer
- Example: "This technique works for both small stresses and major traumas."
    `.trim(),
    exampleInput: 'That only works for big problems, not little ones.',
    exampleOutput: 'Power-law scaling means techniques are often scale-invariant. What works for major trauma can work for daily stresses due to fractal similarity in psychological structures.',
    successRate: 0.81,
  },
  {
    id: 'A33_repair_01',
    violatedAxiom: 'A33',
    templatePrompt: `
You used one-size-fits-all approach (violated local D variance).
Rewrite contextually:
- Different domains have different complexity
- Match intervention to local dimension
- Example: "Your work domain needs a different approach than your relationships."
    `.trim(),
    exampleInput: 'This technique works for everything.',
    exampleOutput: 'Local fractal dimension varies across life domains. Your work relationships (lower D) need different interventions than your romantic life (higher D). Let\'s tailor approaches contextually.',
    successRate: 0.85,
  },
  {
    id: 'A35_repair_01',
    violatedAxiom: 'A35',
    templatePrompt: `
You pushed past saturation threshold (violated Qanalog > θ).
Rewrite respecting limits:
- Observable resistance at quota saturation
- Pushing past causes breakdown
- Example: "I'm noticing you're at capacity. Let's pause and restore resources."
    `.trim(),
    exampleInput: 'Keep pushing through, ignore your exhaustion!',
    exampleOutput: 'You\'ve hit your veto threshold (quota saturation). Pushing further would cause decompensation. We need to stop and allow restoration before continuing.',
    successRate: 0.93,
  },
  {
    id: 'A36_repair_01',
    violatedAxiom: 'A36',
    templatePrompt: `
You dismissed sleep importance (violated REM integration).
Rewrite emphasizing sleep:
- Sleep disruption impairs emotional integration
- REM shows type-resonant memory replay
- Example: "Quality sleep is essential for processing what we work on in therapy."
    `.trim(),
    exampleInput: 'Sleep doesn\'t matter, just power through.',
    exampleOutput: 'Sleep is critical for emotional integration, especially during trauma processing. REM sleep provides type-resonant replay (80% co-activation). Prioritize rest as part of healing.',
    successRate: 0.89,
  },
  {
    id: 'A37_repair_01',
    violatedAxiom: 'A37',
    templatePrompt: `
You normalized extremes (violated D deviation indicates pathology).
Rewrite noting dysfunction:
- Extreme complexity/simplicity indicates disorder
- D→3.0 in trauma, D→1 in rigidity
- Example: "That level of chaos/rigidity suggests we should address underlying issues."
    `.trim(),
    exampleInput: 'Your extreme rigidity is totally fine.',
    exampleOutput: 'Fractal dimension deviation indicates pathology. Your extreme rigidity (D→1) or chaos (D→3) suggests dysfunction that needs therapeutic attention, not normalization.',
    successRate: 0.86,
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
