# SFH Psychologist - Local Installation Guide

Run your own AI psychologist specialized in attachment theory and psychedelic integration on your local machine!

## 🎯 What You Get

- **AI Psychological Support**: Chat interface with educational SFH-based responses
- **Attachment Theory Specialist**: Help with relationship patterns and emotional regulation
- **Psychedelic Integration**: Support for processing and integrating psychedelic experiences
- **Real-time Validation**: Responses scored for quality and coherence
- **Topic Tracking**: Automatic detection of conversation themes and risk levels
- **Privacy**: Everything runs on your machine, no data sent to third parties (except LLM API)

## 📋 Requirements

### System Requirements
- **Node.js**: Version 18 or higher
- **npm**: Version 9 or higher (comes with Node.js)
- **Operating System**: Windows, macOS, or Linux
- **Memory**: 2GB RAM minimum
- **Disk Space**: 500MB for installation

### Check Your Versions
```bash
node --version  # Should show v18.x.x or higher
npm --version   # Should show 9.x.x or higher
```

### Don't Have Node.js?
Download and install from: https://nodejs.org/ (choose LTS version)

## 🚀 Quick Start (5 Minutes)

### Step 1: Download the Project

**Option A: Using Git**
```bash
git clone https://github.com/urmt/SFH_Psychologist.git
cd SFH_Psychologist
```

**Option B: Download ZIP**
1. Download the ZIP file from the repository
2. Extract it to a folder
3. Open terminal/command prompt in that folder

### Step 2: Install Dependencies

```bash
npm install
```

This will take 1-2 minutes and install all required packages.

### Step 3: Configure API Key

1. **Get a free Groq API key:**
   - Visit https://console.groq.com/
   - Sign up (free)
   - Go to API Keys section
   - Create a new key
   - Copy it

2. **Create your .env file:**
   ```bash
   cp .env.example .env
   ```

3. **Add your API key:**
   - Open `.env` in any text editor
   - Replace `your_groq_api_key_here` with your actual key
   - Save the file

   Example:
   ```
   GROQ_API_KEY=gsk_abc123xyz456...
   ```

### Step 4: Start the Server

```bash
npm run chat
```

You should see:
```
═══════════════════════════════════════════════════
  🧠 SFH Psychologist Chat Server
═══════════════════════════════════════════════════
  Server running at: http://localhost:3000
  Health check: http://localhost:3000/api/health
═══════════════════════════════════════════════════
```

### Step 5: Open in Browser

Open your web browser and go to:
```
http://localhost:3000
```

**You're ready to chat!** 🎉

## 💬 Using the Chat Interface

### Starting a Conversation

Simply type your message and hit Send. Examples:

- *"I get anxious when my partner doesn't text back quickly"*
- *"I had a mushroom experience last month and I'm trying to integrate it"*
- *"I feel disconnected from my friends lately"*

### What to Expect

The AI will:
1. **Ask clarifying questions** to understand your situation
2. **Explain SFH concepts** in plain, beginner-friendly language
3. **Connect theory to your experience** with specific examples
4. **Suggest practical actions** based on psychological principles

### Understanding the Interface

- **Coherence Score**: Quality measure of AI responses (70%+ is good)
- **Risk Level**: Automatic assessment (Low/Medium/High/Emergency)
- **Topic Tags**: Detected themes in your conversation
- **Message Count**: Number of exchanges in current session

### High-Risk Topics

If you mention suicidal thoughts or severe dissociation:
- Risk level automatically elevates
- System provides crisis resources
- Recommends professional help

**Remember**: This is an AI assistant, NOT a replacement for licensed therapy!

## 🛠️ Troubleshooting

### "Command not found: npm"
- Install Node.js from https://nodejs.org/

### "GROQ_API_KEY is not defined"
- Make sure you created the `.env` file
- Check that your API key is correctly pasted
- No spaces around the `=` sign

### "Port 3000 is already in use"
- Another app is using that port
- Kill it: `killall -9 node` (Linux/Mac) or close Node.js processes (Windows)
- Or change port in `.env`: `PORT=3001`

### "Module not found" errors
- Delete `node_modules` folder
- Run `npm install` again

### Slow Responses
- Check your internet connection
- Groq API might be experiencing delays
- Free tier has rate limits (usually generous)

### Want to Stop the Server?
Press `Ctrl+C` in the terminal

## 📁 Project Structure

```
SFH_Psychologist/
├── apps/
│   └── simple-chat/          # Chat server application
│       ├── src/server.ts     # Express API server
│       └── public/           # Frontend HTML/CSS/JS
├── packages/
│   ├── types/                # TypeScript interfaces
│   ├── sfh-compliance-engine/  # SFH validation system
│   └── orchestrator/         # LLM provider management
├── .env                      # Your API keys (create this!)
├── .env.example              # Template
├── package.json              # Dependencies
└── README_LOCAL.md           # This file
```

## 🔐 Privacy & Security

### What Gets Sent to APIs?
- Your chat messages
- Conversation context (for continuity)

### What Stays Local?
- Session data (stored in memory, cleared on restart)
- Your API keys
- All validation logic

### API Providers Used
- **Groq**: Fast, free-tier available, US-based
- **Grok** (optional): xAI's model, requires credits

### Want More Privacy?
- Use a VPN
- Or self-host an LLM (advanced - requires powerful hardware)

## 🎓 Learning Resources

### Understanding SFH Theory
- Substack: https://wt3000.substack.com/archive
- Papers: See `WARP.md` for full bibliography

### Attachment Theory Basics
- "Attached" by Amir Levine (book)
- Look for anxious/avoidant/secure attachment styles

### Psychedelic Integration
- MAPS.org resources
- "How to Change Your Mind" by Michael Pollan

## ⚙️ Advanced Configuration

### Use a Different LLM Provider

Edit `packages/orchestrator/src/index.ts` to add providers.

### Adjust Coherence Threshold

Edit `packages/sfh-compliance-engine/src/index.ts`:
```typescript
const PASS_THRESHOLD = 0.70;  // Lower = more lenient
```

### Change Response Length

Edit `packages/orchestrator/src/providers/groq.ts`:
```typescript
max_tokens: 800,  // Increase for longer responses
```

### Add More Axioms

See `WARP.md` → "Adding New Axioms" section

## 🤝 Sharing with Others

### Running for Friends/Family on Your Network

1. Find your local IP:
   ```bash
   # Linux/Mac
   ip addr show | grep "inet "
   
   # Windows
   ipconfig
   ```

2. Share the URL:
   ```
   http://YOUR_IP:3000
   ```
   Example: `http://192.168.1.100:3000`

3. Make sure your firewall allows port 3000

### Creating a Downloadable Package

Zip the entire folder and share. Recipients follow this guide!

## 📞 Support

### Issues or Questions?
- Check `WARP.md` for project details
- Check `DEPLOYMENT.md` for Vercel deployment (advanced)
- Check GitHub issues (if available)

### Want to Contribute?
- Add more SFH axioms
- Improve the UI
- Add more LLM providers
- Enhance topic detection

## 📜 License

MIT License - Free to use, modify, and share!

## ⚠️ Important Disclaimers

1. **Not Medical Advice**: This is an experimental AI system for educational purposes
2. **Not a Therapist**: Seek licensed professionals for serious mental health issues
3. **Emergency**: Call 988 (US), 999 (UK), or your local crisis hotline
4. **Experimental**: The SFH theory is still being researched and developed
5. **API Costs**: Groq free tier is generous but has limits; Grok requires payment

## 🎉 Enjoy!

You're now running your own AI psychologist! Use it to:
- Explore your attachment patterns
- Process psychedelic experiences
- Understand emotional responses
- Learn about psychological concepts
- Practice self-reflection

**Remember**: This is a tool for growth and understanding, not a replacement for human connection or professional help when needed.

Happy chatting! 🧠💜
