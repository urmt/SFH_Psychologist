# SFH Psychologist - Vercel Deployment Guide

## Prerequisites

1. **Vercel Account** - Sign up at https://vercel.com
2. **API Keys** - You'll need at least one LLM provider API key:
   - Groq API Key (recommended, free tier available): https://console.groq.com/
   - Grok API Key (optional): https://console.x.ai/

## Deployment Steps

### Step 1: Install Vercel CLI (Already Done)

The Vercel CLI is already installed in this project.

### Step 2: Login to Vercel

```bash
npx vercel login
```

This will open your browser and ask you to authenticate with Vercel.

### Step 3: Set Environment Variables

You need to add your API keys as environment variables in Vercel. You can do this in two ways:

#### Option A: Via Vercel Dashboard (Recommended)

1. Deploy first (Step 4 below)
2. Go to your project at https://vercel.com/dashboard
3. Click on your project → Settings → Environment Variables
4. Add these variables:
   - `GROQ_API_KEY` = your Groq API key
   - `GROK_API_KEY` = your Grok API key (optional)

#### Option B: Via CLI

```bash
npx vercel env add GROQ_API_KEY
# When prompted, paste your Groq API key
# Select: Production, Preview, Development (all three)

npx vercel env add GROK_API_KEY
# When prompted, paste your Grok API key (if you have one)
# Select: Production, Preview, Development (all three)
```

### Step 4: Deploy to Vercel

#### Preview Deployment (Test First)

```bash
npm run vercel:preview
```

This creates a preview URL you can test before going live.

#### Production Deployment

```bash
npm run deploy:vercel
```

Or manually:

```bash
npx vercel --prod
```

### Step 5: Get Your Live URL

After deployment, Vercel will provide you with a URL like:

```
https://sentient-field-psychologist.vercel.app
```

Or a custom subdomain you chose during setup.

## Sharing Your App

Once deployed, you can share the URL with anyone! They can:

1. Visit the URL in any browser
2. Start chatting immediately
3. Get AI-powered psychological support specializing in:
   - Attachment theory and relationship patterns
   - Psychedelic integration
   - Evidence-based therapeutic techniques

### Important Notes for Users

**Privacy**: 
- Sessions are ephemeral (not permanently stored on the server)
- Each browser session gets a unique ID
- Messages are not logged permanently

**Limitations**:
- This is an AI assistant, NOT a replacement for professional therapy
- For emergencies, always contact crisis services (988 in US)
- High-risk topics trigger automatic referral suggestions

**How It Works**:
- Responses are validated against SFH (Sentient-Field Hypothesis) axioms
- Coherence scores measure response quality (70%+ pass threshold)
- Educational explanations help users understand psychological concepts

## Managing Your Deployment

### View Logs

```bash
npx vercel logs <deployment-url>
```

### Check Deployment Status

Visit: https://vercel.com/dashboard

### Redeploy

Just run the deployment command again:

```bash
npm run deploy:vercel
```

### Environment Variables

To update API keys:

1. Go to https://vercel.com/dashboard
2. Select your project
3. Settings → Environment Variables
4. Edit the keys
5. Redeploy for changes to take effect

## Troubleshooting

### "Module not found" errors

Run build locally first to check for issues:

```bash
npm run build
```

### API Key not working

1. Check environment variables in Vercel dashboard
2. Make sure you selected "Production" when adding the variable
3. Redeploy after adding/changing variables

### Slow responses

- Groq is typically fast (1-2 seconds)
- Grok requires API credits
- If both fail, check API key validity

### Sessions not persisting

This is expected behavior in the MVP. Sessions are stored in memory and reset when:
- The serverless function cold-starts
- After periods of inactivity
- On redeployment

For persistent sessions, you'd need to add:
- Vercel KV (Redis)
- PostgreSQL
- Or another database

## Cost Considerations

### Vercel
- **Free tier**: 100GB bandwidth/month, serverless function executions
- Should be sufficient for personal/small-scale use
- No credit card required for hobby tier

### Groq API
- **Free tier**: Generous token limits
- Fast inference (llama-3.3-70b)
- Best option for starting out

### Grok API (xAI)
- Requires credits
- Can be added later if needed
- System automatically falls back to Groq

## Custom Domain (Optional)

1. Buy a domain (e.g., from Namecheap, GoDaddy)
2. In Vercel dashboard → Settings → Domains
3. Add your domain
4. Update DNS records as instructed
5. Vercel handles SSL certificates automatically

## GitHub Integration (Optional)

For automatic deployments on git push:

1. Push this repo to GitHub
2. Import project in Vercel dashboard
3. Connect to your GitHub repo
4. Add environment variables
5. Every push to main branch auto-deploys!

## Support

- Vercel Docs: https://vercel.com/docs
- Groq Docs: https://console.groq.com/docs
- Issues with this app: Check the logs and session info

## Next Steps

After deployment, consider:

1. **Testing** - Try various conversation types
2. **Monitoring** - Check Vercel analytics
3. **Feedback** - Gather user feedback
4. **Scaling** - Add persistent storage if needed
5. **Enhancement** - Add remaining 30 SFH axioms
