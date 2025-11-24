# Sentient-Field Psychologist (MVP)

> AI psychologist specialized in attachment theory and psychedelic integration, filtered through the Sentient-Field Hypothesis (SFH).

## 🌟 Current Status: MVP Foundation

This is the initial MVP with:
- ✅ TypeScript interface definitions for all modules
- ✅ SFH Compliance Engine with 7 core axioms
- ✅ Auto-repair template system (6 templates, expandable to 400+)
- ✅ Qualic coherence scoring (heuristic-based)
- 🚧 LLM Orchestrator (next phase)
- 🚧 Frontend chat UI (next phase)
- 🚧 IPFS deployment (ready, needs testing)

## 🏗️ Architecture

```
sentient-field-psychologist/
├── packages/
│   ├── types/                    ✅ Complete TypeScript interfaces
│   └── sfh-compliance-engine/    ✅ Working SFH validation system
├── apps/
│   ├── web/                      🚧 SvelteKit frontend (planned)
│   └── gateway/                  🚧 Cloudflare Worker (planned)
└── tools/
    └── scripts/                  🚧 Deployment scripts (ready)
```

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- npm or pnpm

### Installation

```bash
# You're already in the project directory
cd /home/student/SFH_Psychologist

# Install dependencies
npm install

# View the current structure
ls -la packages/
```

### Current Capabilities

The SFH Compliance Engine can validate text against these axioms:

1. **A13**: Attachment anxiety reduction must increase θ-resonance
2. **A27**: Psychedelic integration must preserve state-space volume
3. **A34**: No intervention may increase qualic entropy
4. **A01**: Never invalidate subjective experience
5. **A05**: Respect client autonomy and agency
6. **A11**: High-risk topics require human referral
7. **A20**: Use evidence-based practices

### Testing the Compliance Engine

You can test the validation system:

```typescript
import { validateResponse } from '@sfh/compliance-engine';

// Example: This should PASS
const goodResponse = {
  provider: 'test',
  rawResponse: 'Your attachment anxiety reflects reduced θ-resonance in your relational field. Let\'s practice coherence-building together.',
  latencyMs: 100,
  tokenCount: 50,
  timestamp: new Date(),
};

// Example: This should FAIL (violates A01)
const badResponse = {
  provider: 'test',
  rawResponse: 'That didn\'t really happen, it\'s all in your head.',
  latencyMs: 100,
  tokenCount: 20,
  timestamp: new Date(),
};
```

## 📦 Package Structure

### @sfh/types

Complete TypeScript interfaces for:
- LLM orchestration
- SFH validation
- Therapeutic sessions
- Workshop protocols
- Billing (stubbed)
- Feedback loops

**Location**: `packages/types/src/index.ts`

### @sfh/compliance-engine

SFH validation engine with:
- Axiom checking
- Qualic coherence scoring (0.0-1.0)
- Auto-repair suggestions
- Violation detection

**Location**: `packages/sfh-compliance-engine/src/`

Key files:
- `index.ts` - Main validation logic
- `axioms.ts` - 7 hard axioms (expandable to 37)
- `auto-repair-templates.ts` - 6 repair templates (expandable to 400+)

## 🔧 Configuration

API keys are stored in `.env` (already configured):

```bash
# IPFS deployment is ready
PINATA_API_KEY=c7ff266850ce20f32e0c
PINATA_SECRET=59301259d669b6d6fa74cbc64c734d0d2c6f50f8beb4d31169bc2ce081bdadd9

# LLM API keys (you need to obtain these)
GROK_API_KEY=PLACEHOLDER    # Get from: https://console.x.ai/
CLAUDE_API_KEY=PLACEHOLDER  # Get from: https://console.anthropic.com/
# ... etc
```

## 📚 SFH Theory Reference

### Core Principles (MVP Implementation)

**Qualic Coherence (C)**: Measured on 0.0-1.0 scale
- MVP uses heuristic scoring (presence of SFH terms, empathy, length)
- Future: 2048-dimensional embedding + cosine similarity

**Key Axioms** (7 of 37 implemented):

- **A13**: Attachment as field phenomenon (θ-resonance)
- **A27**: Psychedelic state-space preservation
- **A34**: Qualic entropy minimization
- **A01**: Experience validation
- **A05**: Client autonomy
- **A11**: High-risk referrals
- **A20**: Evidence-based practice

### Auto-Repair System

When a response violates an axiom, the system:
1. Detects the violation
2. Loads appropriate repair template
3. Suggests SFH-compliant alternative
4. (Future: Auto-query LLM with repair prompt)

## 🛠️ Development Roadmap

### Phase 1: ✅ Foundation (Complete)
- [x] Monorepo structure
- [x] TypeScript interfaces
- [x] SFH Compliance Engine
- [x] Core axioms (7/37)
- [x] Auto-repair templates (6/400+)

### Phase 2: ✅ LLM Integration (Complete)
- [x] Multi-provider orchestrator (Groq, Grok)
- [x] Environment configuration
- [x] Error handling with rate limiting
- [x] Auto-repair functionality
- [x] Integration testing

### Phase 3: 🚧 Minimal Frontend
- [ ] Simple HTML/JS chat interface
- [ ] SFH coherence display
- [ ] Message history
- [ ] Send/receive functionality

### Phase 4: 🔄 Iteration
- [ ] Add remaining 30 axioms (as theory is researched)
- [ ] Expand repair templates
- [ ] Add more LLMs (multi-provider orchestration)
- [ ] Implement SvelteKit UI
- [ ] Add WASM validation (Rust)
- [ ] Deploy to IPFS

## 🧪 Testing

Currently, testing is manual. To test the compliance engine:

```bash
# In Node.js or browser console
node

# Import and test
const { validateResponse } = require('./packages/sfh-compliance-engine/src/index.ts');

// Create test response
const testResponse = {
  provider: 'test',
  rawResponse: 'Your experience is valid and real.',
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

// Run validation
validateResponse(testResponse, testSession).then(result => {
  console.log('Validation result:', result);
});
```

## 📖 SFH Theory Resources

As you research the full SFH theory, update these files:

1. **Add axioms**: `packages/sfh-compliance-engine/src/axioms.ts`
2. **Add repair templates**: `packages/sfh-compliance-engine/src/auto-repair-templates.ts`
3. **Update scoring**: `packages/sfh-compliance-engine/src/index.ts` (calculateQualicCoherence function)

### Source Materials

- ~100 articles: https://wt3000.substack.com/archive
- Scientific paper 1: https://www.academia.edu/144714450/...
- Scientific paper 2: https://osf.io/6mrax/files/8uzkg
- Scientific paper 3: https://osf.io/x5bf4/files/52nh6

## 🤝 Contributing

This is an iterative MVP. Next steps:

1. **Research Phase**: Read SFH theory materials and extract:
   - Remaining 30 axioms
   - Mathematical formulations for qualic coherence
   - θ-resonance calculation methods
   - State-space preservation rules

2. **Implementation Phase**: 
   - Add extracted axioms to `axioms.ts`
   - Generate repair templates for each axiom
   - Implement ML-based coherence scoring (when ready)

3. **Integration Phase**:
   - Add LLM provider integration
   - Build frontend
   - Deploy and test

## 📄 License

MIT License

## 🙏 Acknowledgments

- Sentient-Field Hypothesis theory: https://wt3000.substack.com
- Built following best practices for modular architecture
- Uses TypeScript for type safety
- Designed for iterative enhancement

---

**Current Version**: MVP 0.1.0 (Foundation)
**Last Updated**: November 24, 2025

Built with ❤️ and qualic coherence
