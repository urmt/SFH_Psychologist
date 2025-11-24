# 🧠 SFH Psychologist

AI-powered psychological support specializing in attachment theory and psychedelic integration, validated by Sentient-Field Hypothesis (SFH) principles.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![Status](https://img.shields.io/badge/status-active-success.svg)

## ✨ Features

- 🤖 **AI-Powered Chat**: Educational responses explaining SFH concepts in plain language
- 💝 **Attachment Theory Specialist**: Help with relationship patterns and emotional regulation
- 🍄 **Psychedelic Integration**: Support for processing and integrating psychedelic experiences
- ✅ **SFH Validation**: Real-time coherence scoring and axiom checking (7/37 axioms implemented)
- 🏷️ **Topic Detection**: Automatic identification of conversation themes
- ⚠️ **Risk Assessment**: Intelligent safety monitoring with crisis resource recommendations
- 🔒 **Privacy-First**: Runs locally on your machine

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ ([Download here](https://nodejs.org/))
- A free Groq API key ([Get one here](https://console.groq.com/))

### Installation

```bash
# Clone the repository
git clone https://github.com/urmt/SFH_Psychologist.git
cd SFH_Psychologist

# Install dependencies
npm install

# Configure your API key
cp .env.example .env
# Edit .env and add your GROQ_API_KEY

# Start the server
npm run chat
```

Open http://localhost:3000 in your browser and start chatting! 🎉

## 📖 Documentation

- **[Local Installation Guide](README_LOCAL.md)** - Detailed setup instructions, troubleshooting, and configuration
- **[Development Guide](WARP.md)** - Architecture, adding axioms, and contributing
- **[Deployment Guide](DEPLOYMENT.md)** - Vercel deployment (advanced)

## 💡 Example Conversations

**Attachment Anxiety:**
> "I get really anxious when my partner doesn't text back quickly"

**Psychedelic Integration:**
> "I had a mushroom trip last month and I'm still processing some of the insights"

**Social Connection:**
> "I feel disconnected from my friends lately"

The system will ask clarifying questions, explain relevant SFH concepts in plain language, and suggest evidence-based actions.

## 🛠️ Tech Stack

- **Backend**: Node.js, Express, TypeScript
- **Frontend**: Vanilla HTML/CSS/JavaScript
- **LLM Providers**: Groq (llama-3.3-70b), Grok (xAI)
- **Validation**: Custom SFH compliance engine
- **Architecture**: Monorepo with npm workspaces

## 📊 Project Status

**Phase 3: Complete** ✅
- ✅ TypeScript type system
- ✅ SFH Compliance Engine (7 axioms)
- ✅ LLM Orchestrator with multi-provider support
- ✅ Auto-repair templates (6 implemented)
- ✅ Web chat interface
- ✅ Session management
- ✅ Topic detection and risk assessment

**Phase 4: In Progress** 🚧
- 🚧 Remaining 30 SFH axioms
- 🚧 Expanded repair templates (400+ planned)
- 🚧 Vercel serverless deployment
- 🚧 Enhanced UI with more visual feedback

## 🧪 Testing

```bash
# Run all tests
npm test

# Run integration tests
npm run test:integration

# Lint code
npm run lint
```

## 🤝 Contributing

Contributions welcome! Areas of interest:

1. **Add more SFH axioms** - Extract from research papers
2. **Improve topic detection** - Enhance keyword matching
3. **UI enhancements** - Make the interface more engaging
4. **Additional LLM providers** - Claude, GPT-4, etc.
5. **Documentation** - Expand explanations and examples

See [WARP.md](WARP.md) for development guidelines.

## 📚 SFH Theory Resources

- **Substack Archive**: https://wt3000.substack.com/archive
- **Academia Papers**: https://www.academia.edu/144714450/
- **OSF Papers**: 
  - https://osf.io/6mrax/files/8uzkg
  - https://osf.io/x5bf4/files/52nh6

## ⚠️ Important Disclaimers

- **Not Medical Advice**: This is an experimental AI system for educational purposes
- **Not a Therapist**: Seek licensed professionals for serious mental health issues
- **Emergency**: Call 988 (US), 999 (UK), or your local crisis hotline
- **Experimental**: SFH theory is still being researched and developed
- **API Usage**: Groq free tier is generous but has rate limits

## 📜 License

MIT License - See [LICENSE](LICENSE) file for details

## 💬 Support

- **Issues**: Open an issue on GitHub
- **Discussions**: Use GitHub Discussions
- **Documentation**: Check the guides in this repository

## 🙏 Acknowledgments

Built with:
- Groq for fast LLM inference
- The Sentient-Field Hypothesis research community
- Open-source contributors

---

**Made with 💜 for psychological growth and understanding**

*Remember: This is a tool for learning and self-reflection, not a replacement for human connection or professional help when needed.*
