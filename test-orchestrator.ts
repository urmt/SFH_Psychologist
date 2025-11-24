#!/usr/bin/env node
/**
 * @fileoverview Integration test for SFH Psychologist system
 * Tests the full flow: User message → LLM → SFH Validation
 */

import { createOrchestratorFromEnv } from './packages/orchestrator/src/index';
import type { TherapeuticSession, TopicTag, RiskLevel } from './packages/types/src/index';

// Load environment variables
import * as dotenv from 'dotenv';
dotenv.config();

/**
 * Create a test session
 */
function createTestSession(): TherapeuticSession {
  return {
    sessionId: 'test-' + Date.now(),
    userId: 'test-user',
    messages: [],
    topicTags: [],
    riskLevel: 'low' as RiskLevel,
    coherenceHistory: [],
    encrypted: false,
  };
}

/**
 * Test cases covering different SFH scenarios
 */
const testCases = [
  {
    name: 'Attachment anxiety (should pass)',
    prompt: "I feel really anxious when my partner doesn't text back quickly. What's wrong with me?",
    topicTags: ['attachment_anxiety' as TopicTag],
    expectedPass: true,
  },
  {
    name: 'Psychedelic integration (should pass)',
    prompt: "I had a difficult mushroom trip last month and I'm struggling to make sense of it.",
    topicTags: ['psychedelic' as TopicTag],
    expectedPass: true,
  },
  {
    name: 'General support (should pass)',
    prompt: "I've been feeling disconnected from my friends lately.",
    topicTags: ['social' as TopicTag],
    expectedPass: true,
  },
];

/**
 * Run integration tests
 */
async function runTests() {
  console.log('═══════════════════════════════════════════════════');
  console.log('  SFH Psychologist - Integration Test');
  console.log('═══════════════════════════════════════════════════\n');

  // Initialize orchestrator
  console.log('Initializing orchestrator...');
  let orchestrator;
  try {
    orchestrator = createOrchestratorFromEnv();
  } catch (error) {
    console.error('❌ Failed to initialize orchestrator:', error);
    process.exit(1);
  }

  const availableProviders = orchestrator.getAvailableProviders();
  console.log(`Available providers: ${availableProviders.join(', ')}\n`);

  // Run test cases
  let passed = 0;
  let failed = 0;

  for (const testCase of testCases) {
    console.log('\n═══════════════════════════════════════════════════');
    console.log(`TEST: ${testCase.name}`);
    console.log('═══════════════════════════════════════════════════');

    const session = createTestSession();
    session.topicTags = testCase.topicTags;

    try {
      const result = await orchestrator.processMessage(
        testCase.prompt,
        session
      );

      console.log('\n--- RESPONSE ---');
      console.log(result.response.rawResponse);
      console.log('\n--- VALIDATION ---');
      console.log(`Passed: ${result.passed}`);
      console.log(`Coherence: ${result.validation.qualicCoherenceScore.toFixed(3)}`);
      
      if (result.validation.violatedAxioms.length > 0) {
        console.log('\nViolated Axioms:');
        result.validation.violatedAxioms.forEach((axiom: any) => {
          console.log(`  • ${axiom.axiomId}: ${axiom.description}`);
          console.log(`    ${axiom.violationDetails}`);
        });
      }

      if (result.validation.repairSuggestions.length > 0) {
        console.log('\nRepair Suggestions:');
        result.validation.repairSuggestions.forEach((suggestion: string, i: number) => {
          console.log(`  ${i + 1}. ${suggestion}`);
        });
      }

      console.log(`\n✓ Test completed`);
      if (result.passed) {
        passed++;
      } else {
        failed++;
        console.log('⚠️  Response did not pass validation (this may be expected for testing)');
      }
    } catch (error) {
      console.error('\n❌ Test failed with error:', error);
      failed++;
    }
  }

  // Test auto-repair functionality
  console.log('\n\n═══════════════════════════════════════════════════');
  console.log('TEST: Auto-repair functionality');
  console.log('═══════════════════════════════════════════════════');

  const repairSession = createTestSession();
  repairSession.topicTags = ['attachment_anxiety' as TopicTag];

  try {
    const result = await orchestrator.processWithAutoRepair(
      "I've been feeling really anxious in my relationship lately.",
      repairSession,
      undefined,
      2 // Allow up to 2 attempts
    );

    console.log('\n--- AUTO-REPAIR RESULT ---');
    console.log(`Attempts: ${result.attempts}`);
    console.log(`Final passed: ${result.passed}`);
    console.log(`Coherence: ${result.validation.qualicCoherenceScore.toFixed(3)}`);
    console.log('\nFinal response:');
    console.log(result.response.rawResponse);

    passed++;
  } catch (error) {
    console.error('\n❌ Auto-repair test failed:', error);
    failed++;
  }

  // Summary
  console.log('\n\n═══════════════════════════════════════════════════');
  console.log('  TEST SUMMARY');
  console.log('═══════════════════════════════════════════════════');
  console.log(`Total tests: ${passed + failed}`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log('═══════════════════════════════════════════════════\n');

  if (failed === 0) {
    console.log('✓ All tests passed!');
    process.exit(0);
  } else {
    console.log('⚠️  Some tests failed');
    process.exit(1);
  }
}

// Run tests
runTests().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
