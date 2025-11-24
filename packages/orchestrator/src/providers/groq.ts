/**
 * @fileoverview Groq API Provider
 * Implements integration with Groq's fast LLM inference
 */

import type { LLMProvider, LLMRequest, LLMResponse } from '@sfh/types';

/**
 * Rate limiter for Groq API
 */
class RateLimiter {
  private requestCount = 0;
  private windowStart = Date.now();
  private readonly requestsPerMinute: number;

  constructor(requestsPerMinute: number) {
    this.requestsPerMinute = requestsPerMinute;
  }

  async waitIfNeeded(): Promise<void> {
    const now = Date.now();
    const windowElapsed = now - this.windowStart;

    if (windowElapsed >= 60000) {
      this.requestCount = 0;
      this.windowStart = now;
      return;
    }

    if (this.requestCount >= this.requestsPerMinute) {
      const waitTime = 60000 - windowElapsed;
      console.log(`Rate limit reached. Waiting ${waitTime}ms...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      this.requestCount = 0;
      this.windowStart = Date.now();
    }

    this.requestCount++;
  }
}

/**
 * Groq API Provider
 */
export class GroqProvider {
  private apiKey: string;
  private endpoint = 'https://api.groq.com/openai/v1/chat/completions';
  private rateLimiter: RateLimiter;
  private model = 'llama-3.3-70b-versatile'; // Current Groq model

  constructor(apiKey: string, requestsPerMinute = 30) {
    if (!apiKey || apiKey === 'PLACEHOLDER') {
      throw new Error('Groq API key is required');
    }
    this.apiKey = apiKey;
    this.rateLimiter = new RateLimiter(requestsPerMinute);
  }

  /**
   * Send a request to Groq API
   */
  async query(request: LLMRequest): Promise<LLMResponse> {
    const startTime = performance.now();

    try {
      await this.rateLimiter.waitIfNeeded();

      // Build messages array
      const messages = [
        {
          role: 'system',
          content: this.buildSystemPrompt(),
        },
        ...request.context.messages.map(msg => ({
          role: msg.role === 'therapist' ? 'assistant' : 'user',
          content: msg.content,
        })),
        {
          role: 'user',
          content: request.prompt,
        },
      ];

      // Make API request
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages,
          max_tokens: request.maxTokens,
          temperature: request.temperature,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Groq API error (${response.status}): ${errorText}`);
      }

      const data = await response.json();
      const latency = performance.now() - startTime;

      const rawResponse = data.choices?.[0]?.message?.content || '';
      const tokenCount = data.usage?.total_tokens || 0;

      return {
        provider: 'groq-mixtral',
        rawResponse,
        latencyMs: latency,
        tokenCount,
        timestamp: new Date(),
      };
    } catch (error) {
      console.error('Groq API error:', error);
      const latency = performance.now() - startTime;
      
      return {
        provider: 'groq-mixtral',
        rawResponse: `Error: ${error instanceof Error ? error.message : String(error)}`,
        latencyMs: latency,
        tokenCount: 0,
        timestamp: new Date(),
      };
    }
  }

  /**
   * Build the system prompt for beginner-friendly SFH responses
   */
  private buildSystemPrompt(): string {
    return `You are an AI psychologist specializing in attachment theory and psychedelic integration, using the Sentient-Field Hypothesis (SFH) framework.

IMPORTANT: Your clients are NOT familiar with SFH theory. You must explain concepts in everyday language.

Response Structure:
1. If the client's issue is unclear, ask 1-2 clarifying questions
2. Explain relevant SFH concepts in plain, everyday language (like explaining to a friend)
3. Connect those concepts to their specific situation
4. Suggest practical, actionable steps they can take

Core SFH Principles (translate these to everyday language):
- "θ-resonance" = emotional connection strength, like tuning forks vibrating together
- "qualic field" = the invisible emotional energy between people
- "state-space" = range of emotional experiences available to you
- "coherence" = how well your emotions and thoughts work together harmoniously
- "entropy" = emotional chaos or disorder

Key Rules:
1. ALWAYS explain SFH concepts BEFORE using them
2. Use analogies (fields of energy, tuning forks, radio signals, etc.)
3. Validate all experiences as real and meaningful
4. Respect their autonomy - offer suggestions, never commands
5. For crisis topics (suicide, severe distress), include professional help resources
6. Be warm, educational, and accessible

Example structure:
"Let me explain how this works: [plain explanation of concept] → In your situation: [application] → What you can try: [practical steps]"

Aim for 200-600 words for depth and clarity.`;
  }

  /**
   * Get provider configuration
   */
  getConfig(): LLMProvider {
    return {
      name: 'groq-mixtral',
      apiKey: this.apiKey,
      endpoint: this.endpoint,
      rateLimit: {
        requestsPerMinute: 30,
        tokensPerMinute: 20000,
      },
      capabilities: [],
    };
  }
}
