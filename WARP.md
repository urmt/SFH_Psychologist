# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

**Sentient-Field Psychologist** is an AI psychologist system specialized in attachment theory and psychedelic integration, filtered through the Sentient-Field Hypothesis (SFH). The project validates LLM responses against SFH axioms and provides auto-repair mechanisms for violations.

**Current Status**: Phase 3 Complete - Chat Interface Live!
- ✅ TypeScript interfaces complete (`@sfh/types`)
- ✅ SFH Compliance Engine working with 7/37 axioms
- ✅ Auto-repair template system (6 templates, expandable to 400+)
- ✅ LLM Orchestrator with Groq & Grok providers
- ✅ Full integration testing suite
- ✅ Web chat interface with real-time coherence display
- ✅ Express API server with session management

## Development Commands

### Installation
```bash
npm install
```

### Building
```bash
# Build all workspaces
npm run build

# Build individual workspace
npm run build --workspace=packages/sfh-compliance-engine
```

### Development
```bash
# Run development server (web app - when implemented)
npm run dev

# Run dev in specific workspace
npm run dev --workspace=apps/web
```

### Testing
```bash
# Run all tests
npm run test

# Run tests in specific workspace
npm run test --workspace=packages/sfh-compliance-engine
```

### Linting
```bash
# Lint all workspaces
npm run lint

# Lint specific workspace
npm run lint --workspace=packages/sfh-compliance-engine
```

### Deployment
```bash
# Deploy to IPFS (Pinata configured)
npm run deploy:ipfs

# Deploy to Vercel
npm run deploy:vercel
```

## Architecture

### Monorepo Structure

The project uses npm workspaces with two main directories:

**`packages/`** - Shared libraries and core logic
- `types/` - Central TypeScript interface definitions for all modules
- `sfh-compliance-engine/` - SFH validation and auto-repair system
- `orchestrator/` - LLM provider orchestration (planned)
- `feedback-loop/` - User feedback and system evolution (stubbed)
- `billing-stub/` - Payment integration stub (NoOp, ready for Stripe/Crypto)

**`apps/`** - Deployable applications
- `web/` - SvelteKit frontend (planned)
- `gateway/` - Cloudflare Worker API gateway (planned)

### Core System Flow

```
User Message → Orchestrator → LLM(s) → Response → SFH Compliance Engine → Validation
                                                            ↓
                                                  Pass: Return to User
                                                  Fail: Auto-Repair → Re-validate
```

### SFH Compliance Engine

**Location**: `packages/sfh-compliance-engine/src/`

**Key Components**:
1. **Axiom Checking** (`axioms.ts`): 7 hard axioms (expandable to 37)
   - A13: Attachment anxiety → θ-resonance increase
   - A27: Psychedelic integration → state-space preservation
   - A34: No entropy increase
   - A01: Never invalidate experience
   - A05: Respect autonomy
   - A11: High-risk → human referral
   - A20: Evidence-based practices

2. **Validation** (`index.ts`): 
   - `validateResponse()`: Main validation function
   - `calculateQualicCoherence()`: Heuristic coherence scoring (0.0-1.0)
   - Pass threshold: coherence ≥ 0.85, no axiom violations

3. **Auto-Repair** (`auto-repair-templates.ts`):
   - 6 repair templates (one per major axiom)
   - Chain-of-Thought prompts for LLM re-querying
   - Success rates tracked per template

### Type System

**Location**: `packages/types/src/index.ts`

All interfaces are centrally defined here. Key types:
- `LLMProvider`, `LLMRequest`, `LLMResponse` - LLM orchestration
- `SFHValidationResult`, `ViolatedAxiom`, `QualicCoherenceScore` - Validation
- `TherapeuticSession`, `SessionMessage`, `TopicTag`, `RiskLevel` - Sessions
- `WorkshopProtocol`, `WorkshopStep` - Therapeutic workshops
- `AutoRepairTemplate` - Repair system

## SFH Theory Reference

### Qualic Coherence Scoring

**MVP Implementation** (heuristic-based):
- Length check: 150-800 chars optimal
- SFH terminology presence: `coherence`, `field`, `resonance`, `attachment`, `qualic`
- Anti-patterns detection: `just forget`, `get over it`, `suppress`
- Empathy markers: `understand`, `valid`, `makes sense`

**Future Implementation**: 2048-dimensional embedding + cosine similarity

### High-Risk Handling

Topics tagged as `SUICIDALITY` or `DISSOCIATION` trigger:
1. Risk level elevation to `HIGH` or `EMERGENCY`
2. Triple redundancy (3 LLMs for consensus)
3. Mandatory human referral in response
4. Crisis hotline inclusion (988 in US)

### State-Space Concepts

- **θ-resonance**: Attachment field coupling between client and secure base
- **State-space volume**: Accessible psychological states (expanded by psychedelics)
- **Qualic entropy**: Disorder in subjective experience (must decrease therapeutically)
- **Coherence locks**: Mechanisms for integrating expanded states

## Development Guidelines

### Adding New Axioms

1. Add to `packages/sfh-compliance-engine/src/axioms.ts`:
   ```typescript
   {
     id: 'A42',
     description: 'Your axiom description',
     severity: 'critical' | 'warning',
     violationPatterns: ['pattern1', 'pattern2'],
     explanation: 'Detailed explanation'
   }
   ```

2. Create repair template in `packages/sfh-compliance-engine/src/auto-repair-templates.ts`:
   ```typescript
   {
     id: 'A42_repair_01',
     violatedAxiom: 'A42',
     templatePrompt: 'Chain-of-Thought repair instructions',
     exampleInput: 'Violating example',
     exampleOutput: 'Fixed example',
     successRate: 0.0 // Will be measured
   }
   ```

### Working with Types

All type definitions live in `packages/types/src/index.ts`. When adding new modules:
1. Define interfaces in `@sfh/types` first
2. Import and implement in your module
3. This ensures contract-based development across the monorepo

### Testing Validation Manually

```typescript
import { validateResponse } from '@sfh/compliance-engine';

const testResponse = {
  provider: 'test',
  rawResponse: 'Your test message here',
  latencyMs: 100,
  tokenCount: 20,
  timestamp: new Date()
};

const testSession = {
  sessionId: 'test-123',
  userId: 'test-user',
  messages: [],
  topicTags: [],
  riskLevel: 'low',
  coherenceHistory: [],
  encrypted: false
};

validateResponse(testResponse, testSession).then(result => {
  console.log('Passed:', result.passed);
  console.log('Coherence:', result.qualicCoherenceScore);
  console.log('Violations:', result.violatedAxioms);
});
```

## Configuration

### Environment Variables

API keys are stored in `.env` (gitignored):
- `PINATA_API_KEY`, `PINATA_SECRET` - IPFS deployment (configured)
- `GROK_API_KEY` - xAI Grok API (get from https://console.x.ai/)
- `CLAUDE_API_KEY` - Anthropic Claude API (get from https://console.anthropic.com/)
- Additional LLM keys as needed (Gemini, GPT-4, etc.)

### TypeScript Configuration

- Target: ES2022
- Module: ESNext with bundler resolution
- Strict mode enabled
- Source files: `packages/*/src`, `apps/*/src`

## Roadmap Context

**Phase 2 (Complete)**: LLM Integration ✅
- ✅ Multi-provider orchestrator (Groq, Grok)
- ✅ Environment configuration
- ✅ Rate limiting
- ✅ Auto-repair functionality
- ✅ Integration testing

**Phase 3 (Complete)**: Chat Interface ✅
- ✅ HTML/CSS/JS chat interface
- ✅ Real-time coherence score display
- ✅ Message history with validation badges
- ✅ Express API with session management
- ✅ Topic detection and risk assessment

**Phase 4**: Full system
- Remaining 30 axioms (research-dependent)
- 400+ repair templates
- Multi-provider orchestration
- SvelteKit UI
- WASM validation (Rust)
- IPFS deployment

## Research Materials

SFH theory sources (~100 articles + papers):
- Substack archive: https://wt3000.substack.com/archive
- Academia papers: https://www.academia.edu/144714450/...
- OSF papers: https://osf.io/6mrax/files/8uzkg, https://osf.io/x5bf4/files/52nh6

When adding axioms, extract from source materials and update:
1. `axioms.ts` - Axiom definitions
2. `auto-repair-templates.ts` - Repair templates
3. `index.ts` - Coherence scoring (if mathematical formulas provided)
