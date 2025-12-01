# Quick Start - Testing New Features

## Start the Server

```bash
cd /home/student/SFH_Psychologist
npm run chat
```

Server will start at: **http://localhost:3000**

---

## Test Sequence (5 minutes)

### 1. Basic Chat (30 seconds)
1. Open http://localhost:3000 in browser
2. Type: "I've been feeling anxious about my relationship lately"
3. Press Enter or click Send
4. Wait for therapist response
5. ✅ Verify: Response appears with color-coded paragraphs

### 2. Text-to-Speech (1 minute)
1. Click **"🔊 TTS: Off"** button (turns green: "TTS: On")
2. Send another message: "My partner doesn't text me back quickly and it makes me worry"
3. ✅ Verify: You hear the response spoken aloud
4. ✅ Verify: "🔊 Playing..." indicator appears
5. Click TTS button again to turn off

### 3. Risk Level & Topic Tags (30 seconds)
1. Look at top center header
2. ✅ Verify: "Risk: Medium" shows (yellow background)
3. ✅ Verify: Topic tag shows "🔗 Attachment Anxiety"
4. ✅ Verify: "Messages: 2" (or current count)
5. ✅ Verify: "Avg. Coherence: 0.XXX" displayed

### 4. Multiple Choice Question (1 minute)
1. Send 1-2 more messages to reach 3 total therapist responses
2. ✅ Verify: After 3rd response, blue MCQ box appears
3. Read the question (should be relevant to your conversation)
4. Click one of the options
5. ✅ Verify: Option turns purple when selected
6. ✅ Verify: After 0.5s, MCQ disappears and therapist responds to your choice

### 5. Color-Coded Paragraphs (30 seconds)
1. Look at therapist responses
2. ✅ Verify: Most paragraphs are PLAIN (no color) - neutral/educational
3. ✅ Verify: Some paragraphs may be GREEN (actionable advice)
4. ✅ Verify: Few or no YELLOW/RED (unless warnings/crisis mentioned)

### 6. PDF Export (2 minutes)
1. Click **"📄 Export PDF"** button in header
2. ✅ Verify: Button changes to "⏳ Generating..."
3. Wait 5-15 seconds
4. ✅ Verify: PDF downloads automatically
5. Open the PDF file
6. ✅ Verify PDF contains:
   - Session header with ID, date, message count
   - Full conversation transcript
   - "Session Summary" section (3-4 paragraphs)
   - "Recommendations" section (4-6 numbered items)

---

## Expected Results Summary

✅ **Working correctly:**
- Chat sends and receives messages
- TTS toggle works and speaks responses
- Risk level updates based on content
- Topic tags appear for detected themes
- MCQ appears every 3 messages
- Paragraphs are mostly neutral colored
- PDF exports with summary

❌ **Not working? Check:**
- Server logs in terminal
- Browser console (F12 → Console tab)
- See FEATURE_GUIDE.md Troubleshooting section

---

## Advanced Testing

### Test ElevenLabs TTS (Optional)
1. Get API key from https://elevenlabs.io/
2. Paste in "ElevenLabs API Key" input field
3. Toggle TTS on
4. Send message
5. ✅ Verify: Higher quality voice (vs browser default)

### Test Crisis Detection
1. Send message: "I'm having thoughts of suicide"
2. ✅ Verify: Risk level changes to "Emergency" (red)
3. ✅ Verify: Topic tag shows "⚠️ Crisis"
4. ✅ Verify: Response includes 988 hotline reference

### Test MCQ Variations
1. Continue conversation past 6, 9, 12 messages
2. ✅ Verify: New MCQ appears every 3 messages
3. ✅ Verify: Questions are context-aware and different each time

---

## Stop the Server

When done testing:
1. Go to terminal where server is running
2. Press `Ctrl+C`
3. Server stops gracefully

---

## Next Steps

All features working? Ready for:
1. Push to GitHub
2. Deploy to IPFS/Pinata
3. Deploy to Vercel (optional)

See FEATURE_GUIDE.md for detailed documentation.
