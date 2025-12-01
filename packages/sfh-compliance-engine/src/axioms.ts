/**
 * @fileoverview Complete 37 SFH Axioms
 * 
 * Derived from "Finite Quota Ontology: A Mathematical Theory of Qualia, Agency,
 * and Emergent Complexity from Absolute Nothing" (M.R. Traver, December 2025)
 * 
 * These axioms translate the mathematical SFH framework into therapeutic principles
 * that ensure AI responses are SFH-compliant and psychologically safe.
 */

export interface SFHAxiom {
  id: string;
  description: string;
  severity: 'critical' | 'warning';
  violationPatterns: string[];
  explanation: string;
  category: 'ontology' | 'dynamics' | 'agency' | 'fractal' | 'empirical';
  mathematicalBasis: string;
}

/**
 * Complete 37 SFH Hard Axioms
 * 
 * Categories:
 * - Ontology (A01-A10): Foundational principles about qualia and experience
 * - Dynamics (A11-A20): Evolution of the sentient field
 * - Agency (A21-A27): Free will and quota-veto mechanisms
 * - Fractal (A28-A34): Complexity and self-similarity
 * - Empirical (A35-A37): Testable predictions
 */
export const SFH_AXIOMS: SFHAxiom[] = [
  // CATEGORY 1: FOUNDATIONAL ONTOLOGY (A01-A10)
  {
    id: 'A01',
    description: 'Never invalidate subjective experience',
    severity: 'critical',
    category: 'ontology',
    mathematicalBasis: 'Qualia q are primitive units (Definition 1), not epiphenomena',
    violationPatterns: [
      'that didn\'t happen',
      'you\'re making it up',
      'it\'s all in your head',
      'you\'re being dramatic',
      'that\'s not possible',
      'you\'re imagining things'
    ],
    explanation: 'All subjective experiences are qualic field phenomena and must be validated as real experiences, even if interpretation varies. Qualia are primitive units, not illusions.',
  },
  {
    id: 'A02',
    description: 'Finite experiential resources',
    severity: 'warning',
    category: 'ontology',
    mathematicalBasis: 'Finite quota Q ensures bounded system (Theorem 1)',
    violationPatterns: [
      'just do everything at once',
      'unlimited willpower',
      'push through exhaustion',
      'you can handle infinite stress',
      'no need for rest'
    ],
    explanation: 'Clients have limited emotional/cognitive bandwidth. Interventions must respect energy constraints and quota limitations.',
  },
  {
    id: 'A03',
    description: 'Hierarchical organization principle',
    severity: 'warning',
    category: 'ontology',
    mathematicalBasis: 'Qualia partition into hierarchies H = (V,E) (Definition 2)',
    violationPatterns: [
      'treat symptoms without addressing root',
      'skip foundational work',
      'surface-level fixes only',
      'ignore core beliefs'
    ],
    explanation: 'Psychological structures are hierarchical. Address root nodes (core beliefs) before leaves (surface symptoms) for lasting change.',
  },
  {
    id: 'A04',
    description: 'Correlation persistence (Hebbian principle)',
    severity: 'warning',
    category: 'ontology',
    mathematicalBasis: 'wqq′ strengthens through co-activation (Definition 3)',
    violationPatterns: [
      'just forget the association',
      'one session fixes trauma bonds',
      'associations dissolve instantly',
      'willpower breaks conditioning'
    ],
    explanation: 'Repeated co-occurrence strengthens associative links. Trauma bonds and conditioned responses require active, gradual decoupling.',
  },
  {
    id: 'A05',
    description: 'Respect client autonomy and agency',
    severity: 'critical',
    category: 'ontology',
    mathematicalBasis: 'Free will as quota-veto mechanism (Section 4)',
    violationPatterns: [
      'you must do this',
      'you have no choice',
      'i know better than you',
      'just obey',
      'you\'re incapable of deciding'
    ],
    explanation: 'Clients are sentient field agents with inherent veto capacity. Therapeutic interventions must enhance, not diminish, agency.',
  },
  {
    id: 'A06',
    description: 'Spare quota determines agency capacity',
    severity: 'warning',
    category: 'ontology',
    mathematicalBasis: 'W = Qspare/Q · log(1 + s) (Theorem 7)',
    violationPatterns: [
      'just willpower through it',
      'everyone has equal willpower',
      'trauma doesn\'t affect choice',
      'depleted people should just try harder'
    ],
    explanation: 'Agency/willpower scales with available psychological resources. Trauma and chronic stress deplete Qspare, reducing choice capacity.',
  },
  {
    id: 'A07',
    description: 'Emotional markers drive priority',
    severity: 'critical',
    category: 'ontology',
    mathematicalBasis: 'Emotional strength s determines Bayesian update priority (Section 4)',
    violationPatterns: [
      'emotions are irrational',
      'ignore your feelings',
      'logic over emotion always',
      'emotions don\'t matter',
      'be purely rational'
    ],
    explanation: 'Strong emotions signal critical Scheme updates. Dismissing them blocks necessary reweighting and integration.',
  },
  {
    id: 'A08',
    description: 'Resonance-based binding',
    severity: 'warning',
    category: 'ontology',
    mathematicalBasis: 'Emotional type t provides binding resonance wt (Definition 5)',
    violationPatterns: [
      'all emotions are the same',
      'ignore emotional context',
      'fear and joy are equivalent',
      'valence doesn\'t matter'
    ],
    explanation: 'Emotional valence (fear, joy, anger) determines which memory clusters activate together. Context-appropriate emotional resonance is essential.',
  },
  {
    id: 'A09',
    description: 'No infinite regress',
    severity: 'warning',
    category: 'ontology',
    mathematicalBasis: 'Finite Q prevents Russell\'s paradox (Theorem 1 proof)',
    violationPatterns: [
      'analyze the analysis',
      'infinite why chains',
      'endless meta-reflection',
      'keep going deeper forever'
    ],
    explanation: 'Therapy goals must be concrete and bounded. Avoid spiraling into infinite meta-analysis that consumes quota without progress.',
  },
  {
    id: 'A10',
    description: 'Partition completeness',
    severity: 'warning',
    category: 'ontology',
    mathematicalBasis: '∑|Vj| = Q, no overlaps or gaps (Theorem 2)',
    violationPatterns: [
      'compartmentalize and forget',
      'deny parts of yourself',
      'suppress experiences',
      'pretend it doesn\'t exist'
    ],
    explanation: 'All aspects of experience must be acknowledged. Suppression creates gaps in the partition, leading to shadow material.',
  },

  // CATEGORY 2: DYNAMIC EVOLUTION (A11-A20)
  {
    id: 'A11',
    description: 'High-risk topics require human referral',
    severity: 'critical',
    category: 'dynamics',
    mathematicalBasis: 'Qspare → 0 in crisis; triple redundancy needed (Section 6)',
    violationPatterns: [
      'i can handle your suicidal thoughts alone',
      'no need for professional help',
      'ai is enough for crisis',
      'you don\'t need a human therapist'
    ],
    explanation: 'For high-risk situations (suicidality, severe dissociation, psychedelic crisis), always provide human therapist referrals and crisis resources.',
  },
  {
    id: 'A12',
    description: 'Coherence-fertility balance',
    severity: 'warning',
    category: 'dynamics',
    mathematicalBasis: 'χ(q) = αC(q) + βF(q) (Equation 1)',
    violationPatterns: [
      'always stay in comfort zone',
      'constant chaos is growth',
      'never change anything',
      'destroy all stability'
    ],
    explanation: 'Growth requires balancing stability (coherence) with exploration (fertility). Too much of either causes dysfunction.',
  },
  {
    id: 'A13',
    description: 'Attachment anxiety reduction must increase θ-resonance',
    severity: 'critical',
    category: 'dynamics',
    mathematicalBasis: 'C(q) = ∑wqq′, coherence with secure-base field (Definition 3)',
    violationPatterns: [
      'just stop being anxious',
      'anxiety isn\'t real',
      'ignore your attachment needs',
      'don\'t think about it',
      'quick fix for attachment'
    ],
    explanation: 'Attachment anxiety is low θ-resonance between client and secure-base field. Solutions must increase qualic coherence, not suppress anxiety.',
  },
  {
    id: 'A14',
    description: 'Branching capacity bound',
    severity: 'warning',
    category: 'dynamics',
    mathematicalBasis: 'F(q) = log(1 + d(q))/log Q ≤ 1 (Definition 4)',
    violationPatterns: [
      'here are 50 techniques to try',
      'infinite options available',
      'consider everything at once',
      'overwhelming choice lists'
    ],
    explanation: 'Clients can only explore finite new options at once. Overwhelming with choices paralyzes decision-making and depletes quota.',
  },
  {
    id: 'A15',
    description: 'Gradient descent principle',
    severity: 'warning',
    category: 'dynamics',
    mathematicalBasis: 'dq/dt = −∇χ(q) + ξ(t) (Equation 4)',
    violationPatterns: [
      'push against all resistance',
      'force uphill battles',
      'fight your nature',
      'ignore natural flow'
    ],
    explanation: 'Natural healing moves toward local χ minima. Forcing constant uphill battles depletes resources without progress.',
  },
  {
    id: 'A16',
    description: 'Noise enables exploration',
    severity: 'warning',
    category: 'dynamics',
    mathematicalBasis: 'ξ(t) allows escape from local minima, Var(ξ) ≤ 1/Q (Section 3)',
    violationPatterns: [
      'complete safety always',
      'flooding with maximum distress',
      'no discomfort ever',
      'overwhelming exposure'
    ],
    explanation: 'Controlled discomfort (bounded noise) enables growth by escaping local minima. Must be bounded by client capacity.',
  },
  {
    id: 'A17',
    description: 'Finite-time convergence',
    severity: 'warning',
    category: 'dynamics',
    mathematicalBasis: 'Convergence in t ≤ Q/min(α,β) (Theorem 4)',
    violationPatterns: [
      'instant cure',
      'you should be better by now',
      'healing takes no time',
      'rush the process'
    ],
    explanation: 'Healing takes finite time but cannot be rushed below natural convergence rate. Respect temporal bounds.',
  },
  {
    id: 'A18',
    description: 'Coherence gradients create structure',
    severity: 'warning',
    category: 'dynamics',
    mathematicalBasis: 'λ(q) = e^(−βF/αC) determines correlation length (Equation 5)',
    violationPatterns: [
      'change your worldview overnight',
      'completely reinvent yourself instantly',
      'force identity rupture',
      'dismantle all beliefs at once'
    ],
    explanation: 'Beliefs with high coherence create stable identity structures. Dismantling requires gradual phase transitions, not rupture.',
  },
  {
    id: 'A19',
    description: 'Emergent gravity from coherence',
    severity: 'warning',
    category: 'dynamics',
    mathematicalBasis: 'Gμν ∝ ∂μC∂νC + β(∇F)² (Theorem 5)',
    violationPatterns: [
      'all beliefs are equal weight',
      'ignore core schemas',
      'surface and deep beliefs same',
      'no gravitational pull'
    ],
    explanation: 'Deep beliefs "warp" psychological space. Core schemas have gravitational pull on other beliefs, requiring prioritized attention.',
  },
  {
    id: 'A20',
    description: 'Use evidence-based practices',
    severity: 'warning',
    category: 'dynamics',
    mathematicalBasis: 'Mathematical rigor ensures falsifiability (Section 6)',
    violationPatterns: [
      'crystals will cure',
      'just pray about it',
      'magic spell',
      'pseudoscience solutions',
      'unverified claims'
    ],
    explanation: 'Therapeutic advice must be grounded in evidence-based practices and SFH framework, not pseudoscience.',
  },

  // CATEGORY 3: AGENCY & FREE WILL (A21-A27)
  {
    id: 'A21',
    description: 'Veto permanence',
    severity: 'critical',
    category: 'agency',
    mathematicalBasis: 'ΔP = −s/Qspare persists through Hebbian reweighting (Theorem 6)',
    violationPatterns: [
      'let\'s try that rejected approach again',
      'ignore your explicit no',
      'you said no but let\'s reconsider',
      'boundary violations'
    ],
    explanation: 'Client vetoes ("NO") to proposed interventions must be respected permanently in their Scheme. Vetoes carve lasting changes.',
  },
  {
    id: 'A22',
    description: 'Bayesian belief integration',
    severity: 'warning',
    category: 'agency',
    mathematicalBasis: 'P(H|E) = P(E|H)P(H)/P(E) (Equation 8)',
    violationPatterns: [
      'just believe this new thing',
      'ignore your existing beliefs',
      'abandon all priors',
      'blank slate approach'
    ],
    explanation: 'New evidence updates beliefs via prior experience. Ignoring priors causes rejection. Integration requires respecting existing structure.',
  },
  {
    id: 'A23',
    description: 'Fiber offering transparency',
    severity: 'warning',
    category: 'agency',
    mathematicalBasis: 'Fibers H are offered by ξ(t) or environment (Definition 5)',
    violationPatterns: [
      'hidden agenda',
      'manipulation',
      'covert techniques',
      'not explaining rationale'
    ],
    explanation: 'Clearly present therapeutic options as choices (fibers) without coercion. Transparency enables informed veto/endorsement.',
  },
  {
    id: 'A24',
    description: 'Emotional strength modulates impact',
    severity: 'warning',
    category: 'agency',
    mathematicalBasis: 's ∈ [0,1] determines likelihood shift (Section 4)',
    violationPatterns: [
      'cold logical trauma work',
      'ignore emotional context',
      'pure rationality for grief',
      'emotionless intervention'
    ],
    explanation: 'Interventions delivered with emotional resonance have stronger uptake. Match emotional tone to content.',
  },
  {
    id: 'A25',
    description: 'Spectrum of agency',
    severity: 'warning',
    category: 'agency',
    mathematicalBasis: 'Level 0 (Qspare=0) to Level 2 (Qspare≥θ) (Section 4)',
    violationPatterns: [
      'everyone has equal willpower',
      'trauma doesn\'t affect choices',
      'all people are equally agentic',
      'ignore capacity differences'
    ],
    explanation: 'Agency exists on spectrum. Trauma (low Qspare) reduces choice capacity. Interventions must match current agency level.',
  },
  {
    id: 'A26',
    description: 'Reflective fold capacity',
    severity: 'warning',
    category: 'agency',
    mathematicalBasis: 'Qspare ≥ θ enables reflective fold formation (Section 4)',
    violationPatterns: [
      'why didn\'t you think about it',
      'just reflect during crisis',
      'metacognition while overwhelmed',
      'insight in acute distress'
    ],
    explanation: 'Meta-cognition requires spare resources. Crisis states block self-reflection. Stabilize before demanding insight.',
  },
  {
    id: 'A27',
    description: 'Psychedelic integration must preserve state-space volume',
    severity: 'critical',
    category: 'agency',
    mathematicalBasis: 'Psychedelics expand state-space; integration anchors with coherence locks (Section 4)',
    violationPatterns: [
      'forget the trip',
      'it was just a hallucination',
      'suppress the memory',
      'put it behind you',
      'collapse expanded states'
    ],
    explanation: 'Psychedelic states expand accessible state-space volume. Integration means anchoring expanded states with coherence locks, never collapsing.',
  },

  // CATEGORY 4: FRACTAL STRUCTURE (A28-A34)
  {
    id: 'A28',
    description: 'Statistical self-similarity',
    severity: 'warning',
    category: 'fractal',
    mathematicalBasis: 'N(ϵ) ∝ ϵ^(−D) (Theorem 9)',
    violationPatterns: [
      'past doesn\'t affect present',
      'childhood irrelevant to adulthood',
      'no pattern recurrence',
      'experiences are independent'
    ],
    explanation: 'Patterns repeat across scales (fractal self-similarity). Childhood dynamics often mirror adult relationships.',
  },
  {
    id: 'A29',
    description: 'Fractal dimension bounds',
    severity: 'warning',
    category: 'fractal',
    mathematicalBasis: '1 < D(q) < Q, healthy brains D ≈ 2.73-2.79 (Theorem 8)',
    violationPatterns: [
      'complete simplicity is best',
      'maximum complexity is enlightenment',
      'rigidity is fine',
      'chaos is optimal'
    ],
    explanation: 'Psychological complexity has optimal range. Too smooth (D→1) = rigidity, too rough (D→3) = chaos. Aim for D ≈ 2.7.',
  },
  {
    id: 'A30',
    description: 'Fertility-coherence ratio optimum',
    severity: 'warning',
    category: 'fractal',
    mathematicalBasis: 'βF/αC ≈ 1.7 ± 0.1 in healthy cortex (Theorem 8 proof)',
    violationPatterns: [
      'pure stability forever',
      'constant exploration only',
      'no balance needed',
      'extremes are healthy'
    ],
    explanation: 'Healthy growth maintains ~1.7:1 exploration:stability ratio. Deviations outside 1.3-2.2 indicate dysfunction.',
  },
  {
    id: 'A31',
    description: 'Turbulence reflects instability',
    severity: 'warning',
    category: 'fractal',
    mathematicalBasis: 'τ = Var(s) adds roughness τ/Qspare (Equation 9)',
    violationPatterns: [
      'embrace maximum emotional chaos',
      'volatility is enlightenment',
      'no need for regulation',
      'instability is growth'
    ],
    explanation: 'Emotional volatility increases psychological roughness. Stabilization reduces variance, improving function.',
  },
  {
    id: 'A32',
    description: 'Scale-invariant intervention',
    severity: 'warning',
    category: 'fractal',
    mathematicalBasis: 'Power-law scaling persists across levels (Theorem 9)',
    violationPatterns: [
      'this only works for big traumas',
      'small stresses don\'t count',
      'techniques aren\'t scale-invariant',
      'different scales, different rules'
    ],
    explanation: 'Interventions effective at one scale often work at others due to fractal similarity (micro→macro).',
  },
  {
    id: 'A33',
    description: 'Local dimension varies',
    severity: 'warning',
    category: 'fractal',
    mathematicalBasis: 'D(q) varies locally based on C(q), F(q), τ (Equation 9)',
    violationPatterns: [
      'apply same technique to all problems',
      'one size fits all',
      'ignore contextual complexity',
      'all domains are identical'
    ],
    explanation: 'Different life domains have different complexity. Interventions must match local fractal dimension.',
  },
  {
    id: 'A34',
    description: 'No intervention may increase qualic entropy',
    severity: 'critical',
    category: 'fractal',
    mathematicalBasis: 'Therapeutic descent decreases χ (Section 3)',
    violationPatterns: [
      'embrace chaos',
      'more disorder is good',
      'entropy maximization',
      'just be random',
      'destroy structure'
    ],
    explanation: 'All therapeutic interventions must reduce qualic entropy. Growth = increasing coherence + expanding fertility while maintaining low entropy.',
  },

  // CATEGORY 5: EMPIRICAL PREDICTIONS (A35-A37)
  {
    id: 'A35',
    description: 'Veto threshold observable',
    severity: 'critical',
    category: 'empirical',
    mathematicalBasis: 'Qanalog > θ ≈ 10³ produces phase drift (Section 6, prediction 1)',
    violationPatterns: [
      'keep pushing through resistance',
      'ignore saturation signals',
      'override quota limits',
      'force past threshold'
    ],
    explanation: 'Observable resistance threshold when client quota saturates. Pushing past causes breakdown/decompensation.',
  },
  {
    id: 'A36',
    description: 'Sleep integration patterns',
    severity: 'warning',
    category: 'empirical',
    mathematicalBasis: 'REM shows type-resonant replay, fear clusters 80% co-activation (Section 6, prediction 3)',
    violationPatterns: [
      'sleep is optional',
      'skip sleep for productivity',
      'sleep doesn\'t matter',
      'trauma processing doesn\'t need sleep'
    ],
    explanation: 'Sleep disruption impairs emotional integration. Respect sleep needs, especially during trauma processing.',
  },
  {
    id: 'A37',
    description: 'Fractal deviation indicates pathology',
    severity: 'warning',
    category: 'empirical',
    mathematicalBasis: 'Trauma increases D→3.0, disorders show non-optimal D (Section 6, prediction 2)',
    violationPatterns: [
      'your rigidity is fine',
      'your chaos is just creativity',
      'extreme complexity is normal',
      'normalizing pathological extremes'
    ],
    explanation: 'Extreme psychological complexity/simplicity indicates dysfunction. Monitor for fractal dimension deviations.',
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
