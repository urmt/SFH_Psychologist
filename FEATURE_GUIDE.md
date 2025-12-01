# SFH Psychologist - Feature Guide

## New Features Implemented

This guide covers the three major features added to the SFH Psychologist chat interface:

1. **Text-to-Speech (TTS)** - Therapist responses read aloud
2. **Multiple Choice Questions (MCQ)** - Context-aware clarification questions
3. **PDF Export** - Session transcript with AI-generated summary

---

## 1. Text-to-Speech (TTS)

### Overview
The TTS feature reads therapist responses aloud to the client, reducing the need to read long text passages.

### How to Use

#### Browser Mode (Free - Default)
1. Click the **"🔊 TTS: Off"** button in the header
2. Button turns green: **"🔊 TTS: On"**
3. All new therapist responses will be spoken using your browser's built-in speech synthesis
4. A "🔊 Playing..." indicator appears while audio is playing
5. Click the button again to turn TTS off and stop playback

#### ElevenLabs Mode (Premium - Optional)
1. Get an API key from [ElevenLabs](https://elevenlabs.io/)
2. Paste your API key in the **"ElevenLabs API Key"** input field
3. Toggle TTS on
4. The system will automatically use ElevenLabs for higher-quality voice synthesis
5. If ElevenLabs fails, it falls back to browser mode

### Technical Details

**Browser Web Speech API:**
- Free, no API key needed
- Works in most modern browsers (Chrome, Edge, Safari, Firefox)
- Voice quality varies by browser and OS
- Rate: 0.9 (slightly slower for clarity)
- Pitch: 1.0 (neutral)
- Volume: 1.0 (full)

**ElevenLabs API:**
- Requires paid API key
- High-quality, natural-sounding voices
- Uses voice ID: `21m00Tcm4TlvDq8ikWAM` (Rachel - conversational female voice)
- Model: `eleven_monolingual_v1`
- Settings: stability 0.5, similarity_boost 0.75

**Code Location:**
- Frontend: `apps/simple-chat/public/client.js` (lines 289-398)
  - `speakText()` - Main TTS function
  - `speakWithWebSpeechAPI()` - Browser TTS
  - `speakWithElevenLabs()` - Premium TTS
  - `stopSpeech()` - Stop playback

---

## 2. Multiple Choice Questions (MCQ)

### Overview
The system automatically generates context-aware multiple choice questions every 3 messages to clarify the client's situation and deepen understanding.

### How It Works

1. **Automatic Generation:** After every 3rd therapist response (starting from message 2), the LLM generates an MCQ based on recent conversation context
2. **Display:** Question appears in a blue highlighted box with 3-4 options
3. **Selection:** Click any option to select it (turns purple)
4. **Auto-Submit:** After 0.5 seconds, the selection is sent to the therapist
5. **Follow-up:** Therapist responds based on your selection, tailoring advice accordingly

### Example MCQ

```
📋 Multiple Choice Question:

Which of these best describes how you're feeling about your partner right now?

[ ] I feel anxious when they don't respond quickly
[ ] I'm comfortable giving them space  
[ ] I feel frustrated by their emotional distance
[ ] I'm not sure how I feel yet
```

### Technical Details

**MCQ Generation Logic:**
- Triggered every 3 messages (messageCount % 3 === 0)
- Uses last 4 messages as context
- LLM generates JSON with:
  - `question`: Clarifying question (empathetic, specific)
  - `options`: 3-4 answer choices (5-10 words each)
  - `context`: Conversation history used

**MCQ Structure:**
```typescript
interface MCQData {
  question: string;
  options: string[];
  context: string;
}
```

**Code Location:**
- Backend: `apps/simple-chat/src/server.ts` (lines 214-282)
  - `generateMCQ()` - Creates MCQ using LLM
- Frontend: `apps/simple-chat/public/client.js` (lines 400-510)
  - `renderMCQ()` - Displays question and options
  - `handleMCQResponse()` - Sends selection to server

**CSS Styling:**
- `.mcq-container` - Blue highlighted box
- `.mcq-question` - Bold question text
- `.mcq-option` - White background buttons
- `.mcq-option:hover` - Purple border on hover
- `.mcq-option.selected` - Purple background when selected

---

## 3. PDF Export

### Overview
Export the entire conversation as a professional PDF document with AI-generated summary and recommendations.

### How to Use

1. Have a conversation with the therapist (at least 2-3 messages)
2. Click the **"📄 Export PDF"** button in the header
3. Button changes to **"⏳ Generating..."**
4. Wait 5-15 seconds while the LLM generates summary
5. PDF automatically downloads with filename: `SFH_Session_[sessionId]_[timestamp].pdf`

### PDF Contents

**Page 1: Header + Transcript**
- Title: "SFH Psychologist Session Transcript"
- Session ID
- Date and time
- Message count
- Average coherence score
- Full conversation history (Client and Therapist messages)

**Page 2+: Transcript continuation**
- Text automatically wraps and pages as needed

**Final Page: Summary + Recommendations**
- **Session Summary** (3-4 paragraphs)
  - Main themes and concerns
  - Client's emotional state
  - Progress and insights
  - Session quality assessment
- **Recommendations** (4-6 numbered items)
  - Specific, actionable advice
  - Based on SFH and attachment theory
  - Practical next steps

### Technical Details

**Summary Generation:**
- Uses LLM (Groq) to analyze full conversation
- Two prompts run in parallel:
  1. `summaryPrompt` - Generate 3-4 paragraph summary
  2. `recommendationsPrompt` - Generate 4-6 recommendations
- Temperature: 0.7 (balanced creativity/consistency)
- Max tokens: 500 (summary), 400 (recommendations)

**PDF Generation:**
- Uses [jsPDF](https://github.com/parallax/jsPDF) library (v2.5.1)
- Loaded from CDN: `cdnjs.cloudflare.com`
- Page size: A4 (210mm x 297mm)
- Margins: 20mm
- Font: Helvetica (bold for headings, normal for body)
- Text wrapping: Automatic (`doc.splitTextToSize()`)

**Code Location:**
- Backend: `apps/simple-chat/src/server.ts` (lines 399-479)
  - `POST /api/export-summary` - Generates summary and recommendations
- Frontend: `apps/simple-chat/public/client.js` (lines 512-655)
  - `exportToPDF()` - Requests summary, builds PDF, triggers download
- HTML: `apps/simple-chat/public/index.html` (line 496)
  - jsPDF library script tag

---

## Feature Integration

### Conservative Color Coding
All features work alongside the existing color-coded paragraph system:

- **NEUTRAL (most paragraphs):** Plain white, educational content
- **GREEN:** Actionable advice (try this technique, practice this)
- **YELLOW:** Explicit warnings (caution, be careful)
- **RED:** Crisis content (suicide, 988, emergency)

### Risk Level Display
- **Low (green):** General conversation
- **Medium (yellow):** Attachment/psychedelic topics
- **High (orange):** Dissociation mentions
- **Emergency (red):** Suicidal ideation

### Session Tracking
- Message count updates automatically
- Coherence scores tracked and averaged
- Topic tags detected and displayed
- All data included in PDF export

---

## Testing the Features

### Test TTS
1. Start server: `npm run chat`
2. Open http://localhost:3000
3. Send message: "I'm feeling anxious about my relationship"
4. Toggle TTS on
5. Wait for response to be spoken

### Test MCQ
1. Have a 2-3 message conversation about attachment or relationships
2. After 3rd therapist response, MCQ should appear
3. Click an option
4. See therapist's tailored follow-up

### Test PDF Export
1. Have a 4-5 message conversation
2. Click "Export PDF" button
3. Wait for generation (check browser console for logs)
4. PDF downloads automatically
5. Open PDF to verify contents

---

## Troubleshooting

### TTS Not Working
- **Check browser support:** Open browser console, type `'speechSynthesis' in window`
- **ElevenLabs error:** Check API key is correct, account has credits
- **No audio:** Check system volume, browser audio permissions

### MCQ Not Appearing
- **Too few messages:** Need at least 2 messages before first MCQ
- **Wrong timing:** MCQs appear every 3 messages (3, 6, 9, etc.)
- **Generation failed:** Check server logs for LLM errors

### PDF Export Fails
- **jsPDF not loaded:** Check browser console for CDN errors
- **Summary generation timeout:** Groq API may be slow, wait longer
- **No messages:** Need at least 1 message to export
- **Browser blocks download:** Check popup/download permissions

### Server Issues
- **Port 3000 in use:** Run `lsof -ti:3000 | xargs kill -9`
- **Missing API keys:** Check `.env` file has `GROQ_API_KEY`
- **TypeScript errors:** Run `npm install` to ensure dependencies

---

## Future Enhancements

### TTS
- Voice selection (male/female, accent)
- Speed control slider
- Auto-pause between paragraphs
- Highlight text as it's spoken

### MCQ
- MCQ difficulty adjustment
- Track answer patterns over time
- Therapeutic assessment scores
- Skip button (optional MCQs)

### PDF
- Custom styling/themes
- Include color-coded paragraphs
- Attachment style assessment graph
- Coherence score chart

---

## API Costs

### Free Features
- Browser Web Speech API: **$0**
- PDF generation (jsPDF): **$0**
- Groq API (LLM for MCQ/summaries): **Free tier available**

### Paid Features (Optional)
- ElevenLabs TTS: ~$0.30 per 1000 characters (~$0.50 per session)
- Groq Pro: $0.10 per 1M tokens (if free tier exceeded)

**Estimated cost per session (if using ElevenLabs):** $0.50-$1.00

---

## Code Structure Summary

```
apps/simple-chat/
├── public/
│   ├── index.html          # UI + TTS/MCQ/PDF controls
│   └── client.js           # Frontend logic
│       ├── speakText()             [TTS]
│       ├── renderMCQ()             [MCQ]
│       └── exportToPDF()           [PDF]
└── src/
    └── server.ts           # Backend API
        ├── generateMCQ()           [MCQ]
        └── /api/export-summary     [PDF]
```

---

## Summary

All three features are now **fully implemented and tested**:

✅ **TTS:** Browser mode (free) + ElevenLabs fallback (optional)  
✅ **MCQ:** Auto-generated every 3 messages, context-aware  
✅ **PDF:** Full transcript + AI summary + recommendations

Ready for deployment and user testing!
