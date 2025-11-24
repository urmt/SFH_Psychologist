import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getOrchestrator } from './_lib/orchestrator';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const orchestrator = getOrchestrator();
    
    return res.json({
      status: 'ok',
      providers: orchestrator.getAvailableProviders(),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error instanceof Error ? error.message : String(error)
    });
  }
}
