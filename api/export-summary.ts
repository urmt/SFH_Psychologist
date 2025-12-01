/**
 * @fileoverview Vercel Serverless API for PDF Export Summary Generation
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const { sessionId, messages, coherenceScores } = req.body;
    
    if (!messages || messages.length === 0) {
      return res.status(400).json({ error: 'No messages to summarize' });
    }
    
    // Build conversation context
    const conversationText = messages
      .map((msg: any) => `${msg.role === 'client' ? 'Client' : 'Therapist'}: ${msg.content}`)
      .join('\n\n');
    
    // Calculate average coherence
    const avgCoherence = coherenceScores && coherenceScores.length > 0
      ? coherenceScores.reduce((a: number, b: number) => a + b, 0) / coherenceScores.length
      : 0;
    
    // Generate summary using LLM
    const summaryPrompt = `You are an expert psychologist. Summarize this therapeutic session in 3-4 paragraphs. Focus on:
1. Main themes and concerns discussed
2. Client's emotional state and attachment patterns (if relevant)
3. Progress and insights gained
4. Overall session quality (avg coherence: ${avgCoherence.toFixed(3)})

Session transcript:
${conversationText}

Provide a professional, compassionate summary.`;
    
    const recommendationsPrompt = `Based on this therapeutic session, provide 4-6 specific, actionable recommendations for the client's continued growth. Use SFH and attachment theory principles.

Session transcript:
${conversationText}

Format as a numbered list. Be specific and practical.`;
    
    const apiKey = process.env.GROQ_API_KEY;
    
    if (!apiKey) {
      throw new Error('GROQ_API_KEY not configured');
    }
    
    // Generate both in parallel
    const [summaryResponse, recResponse] = await Promise.all([
      fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: 'You are an expert psychologist writing session summaries.' },
            { role: 'user', content: summaryPrompt }
          ],
          max_tokens: 500,
          temperature: 0.7,
        }),
      }),
      fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: 'You are an expert psychologist providing therapeutic recommendations.' },
            { role: 'user', content: recommendationsPrompt }
          ],
          max_tokens: 400,
          temperature: 0.7,
        }),
      })
    ]);
    
    if (!summaryResponse.ok || !recResponse.ok) {
      throw new Error('Failed to generate summary');
    }
    
    const summaryData = await summaryResponse.json();
    const recData = await recResponse.json();
    
    return res.status(200).json({
      summary: summaryData.choices[0].message.content,
      recommendations: recData.choices[0].message.content
    });
    
  } catch (error) {
    console.error('Export summary error:', error);
    return res.status(500).json({ 
      error: 'Failed to generate summary',
      message: error instanceof Error ? error.message : String(error)
    });
  }
}
