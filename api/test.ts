import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  return res.json({
    status: 'ok',
    message: 'Simple test endpoint working',
    env: {
      hasGroqKey: !!process.env.GROQ_API_KEY,
      hasGrokKey: !!process.env.GROK_API_KEY,
    }
  });
}
