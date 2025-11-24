/**
 * @fileoverview LLM Orchestrator
 * Manages LLM provider selection and coordinates requests
 */

import type { LLMRequest, LLMResponse, TherapeuticSession } from '@sfh/types';
import { GrokProvider } from './providers/grok';
import { GroqProvider } from './providers/groq';
import { validateResponse } from '@sfh/compliance-engine';

/**
 * Provider type for runtime selection
 */
type ProviderType = 'grok' | 'groq';

/**
 * Orchestrator configuration
 */
interface OrchestratorConfig {
  grokApiKey?: string;
  groqApiKey?: string;
  defaultProvider?: ProviderType;
}

/**
 * LLM Orchestrator
 * Manages multiple LLM providers and coordinates SFH-compliant responses
 */
export class LLMOrchestrator {
  private grokProvider?: GrokProvider;
  private groqProvider?: GroqProvider;
  private defaultProvider: ProviderType;

  constructor(config: OrchestratorConfig) {
    // Initialize available providers
    if (config.grokApiKey) {
      try {
        this.grokProvider = new GrokProvider(config.grokApiKey);
        console.log('✓ Grok provider initialized');
      } catch (error) {
        console.warn('Failed to initialize Grok provider:', error);
      }
    }

    if (config.groqApiKey) {
      try {
        this.groqProvider = new GroqProvider(config.groqApiKey);
        console.log('✓ Groq provider initialized');
      } catch (error) {
        console.warn('Failed to initialize Groq provider:', error);
      }
    }

    // Set default provider (prefer Groq, fall back to Grok)
    this.defaultProvider = config.defaultProvider || 
      (this.groqProvider ? 'groq' : 'grok');

    if (!this.grokProvider && !this.groqProvider) {
      throw new Error('At least one LLM provider must be configured');
    }

    console.log(`Default provider: ${this.defaultProvider}`);
  }

  /**
   * Process a therapeutic message with SFH validation and automatic failover
   * 
   * @param prompt - User's message
   * @param session - Current therapeutic session
   * @param provider - Which provider to use (optional, uses default if not specified)
   * @returns Validated LLM response
   */
  async processMessage(
    prompt: string,
    session: TherapeuticSession,
    provider?: ProviderType
  ): Promise<{
    response: LLMResponse;
    validation: any;
    passed: boolean;
  }> {
    const availableProviders = this.getAvailableProviders();
    const providersToTry = provider 
      ? [provider, ...availableProviders.filter(p => p !== provider)]
      : availableProviders;

    let lastError: Error | null = null;

    // Try each provider with automatic failover
    for (const selectedProvider of providersToTry) {
      try {
        const llmProvider = this.getProvider(selectedProvider);

        if (!llmProvider) {
          console.log(`Provider ${selectedProvider} not available, skipping...`);
          continue;
        }

        console.log(`\n=== Processing message with ${selectedProvider} ===`);
        console.log(`User: ${prompt}`);

        // Build LLM request
        const request: LLMRequest = {
          prompt,
          context: session,
          maxTokens: 800, // Increased for educational, detailed responses
          temperature: 0.7,
          topicTags: session.topicTags,
        };

        // Query LLM
        console.log('Querying LLM...');
        const response = await llmProvider.query(request);
        
        // Check if response contains error
        if (response.rawResponse.startsWith('Error:')) {
          throw new Error(response.rawResponse);
        }

        console.log(`Response received (${response.latencyMs.toFixed(0)}ms, ${response.tokenCount} tokens)`);

        // Validate against SFH axioms
        console.log('Validating against SFH axioms...');
        const validation = await validateResponse(response, session);

        console.log(`Validation result: ${validation.passed ? '✓ PASS' : '✗ FAIL'}`);
        console.log(`Qualic coherence: ${validation.qualicCoherenceScore.toFixed(3)}`);

        if (validation.violatedAxioms.length > 0) {
          console.log('Violated axioms:');
          validation.violatedAxioms.forEach((v: any) => {
            console.log(`  - ${v.axiomId}: ${v.description}`);
          });
        }

        // Success - return result
        return {
          response,
          validation,
          passed: validation.passed,
        };

      } catch (error) {
        lastError = error as Error;
        console.error(`Provider ${selectedProvider} failed:`, error);
        
        // If this was the last provider, throw
        if (selectedProvider === providersToTry[providersToTry.length - 1]) {
          break;
        }
        
        console.log(`Failing over to next provider...`);
      }
    }

    // All providers failed
    throw new Error(`All providers failed. Last error: ${lastError?.message || 'Unknown error'}`);
  }

  /**
   * Process with auto-repair
   * If validation fails, attempts repair and re-validation
   */
  async processWithAutoRepair(
    prompt: string,
    session: TherapeuticSession,
    provider?: ProviderType,
    maxAttempts = 2
  ): Promise<{
    response: LLMResponse;
    validation: any;
    passed: boolean;
    attempts: number;
  }> {
    let attempts = 0;
    let result;

    while (attempts < maxAttempts) {
      attempts++;
      console.log(`\n--- Attempt ${attempts}/${maxAttempts} ---`);

      result = await this.processMessage(prompt, session, provider);

      if (result.passed) {
        console.log('✓ Response passed validation!');
        break;
      }

      if (attempts < maxAttempts) {
        console.log('Response failed validation. Adding repair instructions...');
        // Add repair context to the prompt
        const repairContext = result.validation.repairSuggestions.join('\n');
        prompt = `${prompt}\n\nIMPORTANT: Previous response violated SFH axioms. Please correct:\n${repairContext}`;
      }
    }

    return {
      ...result!,
      attempts,
    };
  }

  /**
   * Get a provider instance
   */
  private getProvider(type: ProviderType): GrokProvider | GroqProvider | null {
    switch (type) {
      case 'grok':
        return this.grokProvider || null;
      case 'groq':
        return this.groqProvider || null;
      default:
        return null;
    }
  }

  /**
   * Get list of available providers
   */
  getAvailableProviders(): ProviderType[] {
    const providers: ProviderType[] = [];
    if (this.grokProvider) providers.push('grok');
    if (this.groqProvider) providers.push('groq');
    return providers;
  }
}

/**
 * Create orchestrator from environment variables
 */
export function createOrchestratorFromEnv(): LLMOrchestrator {
  const config: OrchestratorConfig = {
    grokApiKey: process.env.GROK_API_KEY,
    groqApiKey: process.env.GROQ_API_KEY,
  };

  return new LLMOrchestrator(config);
}
