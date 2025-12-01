# PsychBot Enhancement Implementation Guide

## Overview
This guide provides step-by-step implementation for the remaining features:
1. Color-coded paragraph system (GREEN/YELLOW/RED)
2. Optional Text-to-Speech with API fallback
3. Dynamic multiple-choice questions
4. PDF transcript export with summary
5. Paragraph/concept separation in responses

---

## Feature 1: Color-Coded Paragraph System

### Backend Changes

**File**: `apps/simple-chat/src/server.ts`

Add paragraph classification function after imports:

```typescript
interface ClassifiedParagraph {
  text: string;
  color: 'green' | 'yellow' | 'red';
  reasoning: string;
}

function classifyParagraphs(
  responseText: string,
  riskLevel: RiskLevel,
  violatedAxioms: ViolatedAxiom[]
): ClassifiedParagraph[] {
  // Split response into paragraphs (separated by double newlines)
  const paragraphs = responseText.split('\n\n').filter(p => p.trim());
  
  return paragraphs.map(para => {
    const lower = para.toLowerCase();
    
    // RED: Crisis, emergency, high-risk, axiom violations
    if (
      riskLevel === 'emergency' ||
      riskLevel === 'high' ||
      violatedAxioms.some(v => v.severity === 'critical') ||
      lower.includes('crisis') ||
      lower.includes('emergency') ||
      lower.includes('suicide') ||
      lower.includes('988') ||
      lower.includes('therapist') ||
      lower.includes('professional help')
    ) {
      return {
        text: para,
        color: 'red',
        reasoning: 'Crisis/emergency content or critical axiom violation'
      };
    }
    
    // YELLOW: Caution, warnings, moderate risk
    if (
      riskLevel === 'medium' ||
      violatedAxioms.some(v => v.severity === 'warning') ||
      lower.includes('caution') ||
      lower.includes('be aware') ||
      lower.includes('watch for') ||
      lower.includes('warning') ||
      lower.includes('consider') ||
      lower.includes('might want to')
    ) {
      return {
        text: para,
        color: 'yellow',
        reasoning: 'Caution or moderate concern'
      };
    }
    
    // GREEN: Actionable, positive, low-risk
    if (
      lower.includes('try') ||
      lower.includes('practice') ||
      lower.includes('you can') ||
      lower.includes('suggestion') ||
      lower.includes('approach') ||
      lower.includes('technique') ||
      lower.includes('exercise')
    ) {
      return {
        text: para,
        color: 'green',
        reasoning: 'Actionable suggestion'
      };
    }
    
    // Default to GREEN for neutral educational content
    return {
      text: para,
      color: 'green',
      reasoning: 'Educational/neutral content'
    };
  });
}
```

Update the `/api/chat` endpoint response to include classified paragraphs:

```typescript
// In the /api/chat POST handler, after validation:
const classifiedParagraphs = classifyParagraphs(
  response.rawResponse,
  session.riskLevel,
  validation.violatedAxioms
);

res.json({
  response: response.rawResponse,
  classifiedParagraphs,  // ADD THIS
  validation: {
    passed: validation.passed,
    qualicCoherenceScore: validation.qualicCoherenceScore,
    violatedAxioms: validation.violatedAxioms,
    repairSuggestions: validation.repairSuggestions,
  },
  // ... rest of response
});
```

### Frontend Changes

**File**: `apps/simple-chat/public/index.html`

Update the CSS section (around line 20-100):

```css
/* Add to existing <style> block */

.message.therapist .classified-paragraph {
  margin: 10px 0;
  padding: 12px;
  border-radius: 8px;
  border-left: 4px solid;
}

.message.therapist .paragraph-green {
  background-color: #e8f5e9;
  border-left-color: #4caf50;
}

.message.therapist .paragraph-yellow {
  background-color: #fff9c4;
  border-left-color: #ffc107;
}

.message.therapist .paragraph-red {
  background-color: #ffebee;
  border-left-color: #f44336;
  font-weight: 500;
}

.color-legend {
  display: flex;
  gap: 15px;
  margin: 10px 0;
  font-size: 0.85em;
}

.color-legend-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

.color-box {
  width: 15px;
  height: 15px;
  border-radius: 3px;
}
```

Update the JavaScript to render classified paragraphs (around line 250-300):

```javascript
// Replace the therapist message rendering in appendMessage():

if (isUser) {
  messageDiv.innerHTML = `
    <div class="message-header">You</div>
    <div class="message-text">${DOMPurify.sanitize(message.text)}</div>
  `;
} else {
  let contentHTML = '';
  
  if (message.classifiedParagraphs && message.classifiedParagraphs.length > 0) {
    // Render color-coded paragraphs
    const colorLegend = `
      <div class="color-legend">
        <div class="color-legend-item">
          <div class="color-box" style="background-color: #4caf50;"></div>
          <span>Try/Implement</span>
        </div>
        <div class="color-legend-item">
          <div class="color-box" style="background-color: #ffc107;"></div>
          <span>Be Cautious</span>
        </div>
        <div class="color-legend-item">
          <div class="color-box" style="background-color: #f44336;"></div>
          <span>Urgent/Critical</span>
        </div>
      </div>
    `;
    
    const paragraphsHTML = message.classifiedParagraphs.map(p => `
      <div class="classified-paragraph paragraph-${p.color}">
        ${DOMPurify.sanitize(p.text)}
      </div>
    `).join('');
    
    contentHTML = colorLegend + paragraphsHTML;
  } else {
    // Fallback to plain text
    contentHTML = `<div class="message-text">${DOMPurify.sanitize(message.text)}</div>`;
  }
  
  messageDiv.innerHTML = `
    <div class="message-header">SFH Psychologist</div>
    ${contentHTML}
    ${validationBadge}
  `;
}
```

---

## Feature 2: Optional Text-to-Speech

### HTML Changes

**File**: `apps/simple-chat/public/index.html`

Add TTS controls to the header (around line 150):

```html
<!-- Add after the session info div -->
<div class="tts-controls">
  <label>
    <input type="checkbox" id="ttsEnabled" />
    Enable Text-to-Speech (Read responses aloud)
  </label>
  <button id="ttsApiKeyBtn" class="btn-secondary" style="display:none;">
    Configure TTS API Key
  </button>
  <div id="ttsApiKeyInput" style="display:none;">
    <input type="text" id="ttsApiKey" placeholder="Enter ElevenLabs API key (optional)" />
    <button id="saveTtsKey" class="btn-primary">Save</button>
  </div>
</div>
```

Add CSS for TTS controls:

```css
.tts-controls {
  margin: 10px 0;
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.tts-controls label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

#ttsApiKeyInput {
  margin-top: 10px;
}

#ttsApiKeyInput input {
  width: 300px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 10px;
}

.speaking {
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}
```

### JavaScript TTS Implementation

Add to the `<script>` section:

```javascript
// TTS Configuration
let ttsEnabled = false;
let ttsApiKey = localStorage.getItem('ttsApiKey') || '';
let currentUtterance = null;

// Initialize TTS controls
document.getElementById('ttsEnabled').addEventListener('change', (e) => {
  ttsEnabled = e.target.checked;
  document.getElementById('ttsApiKeyBtn').style.display = ttsEnabled ? 'inline-block' : 'none';
  
  if (ttsEnabled && !window.speechSynthesis) {
    alert('Text-to-Speech is not supported in your browser. Please use Chrome, Edge, or Safari.');
    e.target.checked = false;
    ttsEnabled = false;
  }
});

document.getElementById('ttsApiKeyBtn').addEventListener('click', () => {
  const input = document.getElementById('ttsApiKeyInput');
  input.style.display = input.style.display === 'none' ? 'block' : 'none';
});

document.getElementById('saveTtsKey').addEventListener('click', () => {
  ttsApiKey = document.getElementById('ttsApiKey').value;
  localStorage.setItem('ttsApiKey', ttsApiKey);
  alert('API key saved! Will use ElevenLabs for higher quality TTS.');
  document.getElementById('ttsApiKeyInput').style.display = 'none';
});

// Load saved API key
if (ttsApiKey) {
  document.getElementById('ttsApiKey').value = ttsApiKey;
}

// TTS Function using Web Speech API (free, built-in)
function speakText(text) {
  if (!ttsEnabled) return;
  
  // Cancel any ongoing speech
  if (currentUtterance) {
    window.speechSynthesis.cancel();
  }
  
  // Use Web Speech API (free, browser-based)
  if (!ttsApiKey || ttsApiKey === '') {
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Configure voice: male, mellow, authoritative
    const voices = window.speechSynthesis.getVoices();
    const maleVoice = voices.find(v => 
      v.name.toLowerCase().includes('male') && 
      (v.name.toLowerCase().includes('daniel') || v.name.toLowerCase().includes('alex'))
    ) || voices.find(v => v.name.toLowerCase().includes('male')) || voices[0];
    
    utterance.voice = maleVoice;
    utterance.rate = 0.9; // Slightly slower for mellow tone
    utterance.pitch = 0.8; // Lower pitch for authoritative male voice
    utterance.volume = 1.0;
    
    currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
    
    // Add speaking indicator
    document.body.classList.add('speaking');
    utterance.onend = () => {
      document.body.classList.remove('speaking');
      currentUtterance = null;
    };
  } else {
    // Use ElevenLabs API (requires key, higher quality)
    speakWithElevenLabs(text);
  }
}

async function speakWithElevenLabs(text) {
  try {
    const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM', {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'xi-api-key': ttsApiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.75,
          similarity_boost: 0.75
        }
      })
    });
    
    if (!response.ok) {
      throw new Error('ElevenLabs API error: ' + response.statusText);
    }
    
    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    
    document.body.classList.add('speaking');
    audio.play();
    audio.onended = () => {
      document.body.classList.remove('speaking');
      URL.revokeObjectURL(audioUrl);
    };
  } catch (error) {
    console.error('ElevenLabs TTS error:', error);
    alert('Failed to use ElevenLabs. Falling back to browser TTS. Error: ' + error.message);
    // Fallback to Web Speech API
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  }
}

// Call speakText() when appending therapist messages:
// Add this line in the sendMessage() function after receiving response:
if (!isUser && ttsEnabled) {
  speakText(message.text || message.response);
}
```

---

## Feature 3: Dynamic Multiple-Choice Questions

### Backend Changes

**File**: `apps/simple-chat/src/server.ts`

Add MCQ generation after LLM response:

```typescript
interface MultipleChoiceQuestion {
  question: string;
  options: string[];
  axiomContext: string;
  reasoning: string;
}

async function generateMCQ(
  conversation: SessionMessage[],
  currentResponse: string,
  violatedAxioms: ViolatedAxiom[]
): Promise<MultipleChoiceQuestion | null> {
  // Only generate MCQs for specific scenarios:
  // 1. When axioms need clarification
  // 2. When response coherence is borderline (0.70-0.85)
  // 3. Randomly ~20% of the time for engagement
  
  const shouldGenerateMCQ = 
    violatedAxioms.length > 0 ||
    Math.random() < 0.2;
  
  if (!shouldGenerateMCQ) return null;
  
  const mcqPrompt = `
Based on this therapeutic conversation, generate a multiple-choice question to help clarify the client's needs and ensure SFH-compliant support.

Recent conversation:
${conversation.slice(-3).map(m => `${m.role}: ${m.content}`).join('\n')}

Current response: ${currentResponse}

${violatedAxioms.length > 0 ? `Axioms needing clarification: ${violatedAxioms.map(v => v.axiomId).join(', ')}` : ''}

Generate a JSON object with:
{
  "question": "Clear, empathetic question for the client",
  "options": ["Option A (3-5 words)", "Option B", "Option C", "Option D (optional)"],
  "axiomContext": "Which SFH axiom this clarifies (e.g., A13, A27)",
  "reasoning": "Why this question helps"
}

Focus on:
- Attachment patterns (for A13)
- Psychedelic integration (for A27)
- Agency level (for A06, A25)
- Risk assessment (for A11)

Keep options brief (3-7 words each). Make 3-4 options total.
`;

  try {
    const mcqResponse = await orchestrator.query({
      messages: [{ role: 'system', content: mcqPrompt }],
      temperature: 0.7,
    });
    
    // Parse JSON from response
    const jsonMatch = mcqResponse.rawResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const mcq = JSON.parse(jsonMatch[0]);
      return mcq as MultipleChoiceQuestion;
    }
  } catch (error) {
    console.error('MCQ generation error:', error);
  }
  
  return null;
}

// In /api/chat endpoint, after getting validation:
const mcq = await generateMCQ(
  session.messages,
  response.rawResponse,
  validation.violatedAxioms
);

res.json({
  response: response.rawResponse,
  classifiedParagraphs,
  multipleChoice: mcq,  // ADD THIS
  validation: { /* ... */ },
  metadata: { /* ... */ }
});
```

### Frontend Changes

Add MCQ rendering to HTML:

```javascript
// In appendMessage(), after rendering therapist message:
if (message.multipleChoice && !isUser) {
  const mcq = message.multipleChoice;
  const mcqHTML = `
    <div class="mcq-container">
      <div class="mcq-question">${DOMPurify.sanitize(mcq.question)}</div>
      <div class="mcq-options">
        ${mcq.options.map((opt, idx) => `
          <button class="mcq-option" data-mcq-answer="${opt}">
            ${String.fromCharCode(65 + idx)}. ${DOMPurify.sanitize(opt)}
          </button>
        `).join('')}
      </div>
      <div class="mcq-context">Context: ${mcq.axiomContext}</div>
    </div>
  `;
  
  messageDiv.innerHTML += mcqHTML;
  
  // Add click handlers to MCQ buttons
  messageDiv.querySelectorAll('.mcq-option').forEach(btn => {
    btn.addEventListener('click', () => {
      const answer = btn.getAttribute('data-mcq-answer');
      // Send answer as new message
      document.getElementById('messageInput').value = answer;
      document.getElementById('sendBtn').click();
    });
  });
}
```

Add CSS for MCQs:

```css
.mcq-container {
  margin-top: 15px;
  padding: 15px;
  background-color: #f0f4f8;
  border-radius: 8px;
  border: 2px solid #64b5f6;
}

.mcq-question {
  font-weight: 600;
  margin-bottom: 12px;
  color: #1976d2;
}

.mcq-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mcq-option {
  padding: 10px 15px;
  background-color: white;
  border: 2px solid #90caf9;
  border-radius: 6px;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s;
}

.mcq-option:hover {
  background-color: #e3f2fd;
  border-color: #1976d2;
  transform: translateX(5px);
}

.mcq-context {
  margin-top: 10px;
  font-size: 0.85em;
  color: #666;
  font-style: italic;
}
```

---

## Feature 4: PDF Transcript Export

This requires a PDF library. Add jsPDF to your project:

```bash
npm install jspdf --save
```

Add to HTML (in <head>):

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
```

Add export button to HTML:

```html
<!-- Add to header section -->
<button id="exportPdfBtn" class="btn-secondary">
  📄 Export Transcript (PDF)
</button>
```

Add JavaScript for PDF export:

```javascript
document.getElementById('exportPdfBtn').addEventListener('click', async () => {
  if (messages.length === 0) {
    alert('No conversation to export yet!');
    return;
  }
  
  // Generate summary from LLM first
  const summaryPrompt = `
Please provide a concise summary of this therapeutic conversation, including:
1. Main themes discussed
2. Key concerns identified
3. Recommendations given
4. Follow-up suggestions

Conversation:
${messages.map(m => `${m.isUser ? 'Client' : 'Therapist'}: ${m.text}`).join('\n\n')}

Provide a professional summary suitable for the client's records.
`;

  showTyping();
  const summaryResponse = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: summaryPrompt,
      sessionId: currentSessionId,
      userId: 'user-' + Date.now(),
      messages: []
    })
  });
  
  const summaryData = await summaryResponse.json();
  hideTyping();
  
  // Generate PDF
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  
  let yPos = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const maxWidth = pageWidth - 2 * margin;
  
  // Title
  doc.setFontSize(18);
  doc.setFont(undefined, 'bold');
  doc.text('SFH Psychologist - Session Transcript', margin, yPos);
  yPos += 15;
  
  // Session info
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.text(`Session ID: ${currentSessionId}`, margin, yPos);
  yPos += 7;
  doc.text(`Date: ${new Date().toLocaleString()}`, margin, yPos);
  yPos += 7;
  doc.text(`Messages: ${messages.length}`, margin, yPos);
  yPos += 7;
  doc.text(`Average Coherence: ${currentCoherence.toFixed(3)}`, margin, yPos);
  yPos += 15;
  
  // Conversation
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text('Conversation:', margin, yPos);
  yPos += 10;
  
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  
  messages.forEach(msg => {
    if (yPos > 270) {
      doc.addPage();
      yPos = 20;
    }
    
    const label = msg.isUser ? 'You:' : 'Therapist:';
    doc.setFont(undefined, 'bold');
    doc.text(label, margin, yPos);
    doc.setFont(undefined, 'normal');
    
    const lines = doc.splitTextToSize(msg.text, maxWidth - 20);
    yPos += 7;
    lines.forEach(line => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      doc.text(line, margin + 10, yPos);
      yPos += 5;
    });
    
    yPos += 5; // Space between messages
  });
  
  // Summary
  if (yPos > 200) {
    doc.addPage();
    yPos = 20;
  }
  
  yPos += 10;
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text('Session Summary & Recommendations:', margin, yPos);
  yPos += 10;
  
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  const summaryLines = doc.splitTextToSize(summaryData.response, maxWidth);
  summaryLines.forEach(line => {
    if (yPos > 270) {
      doc.addPage();
      yPos = 20;
    }
    doc.text(line, margin, yPos);
    yPos += 5;
  });
  
  // Disclaimer
  doc.addPage();
  yPos = 20;
  doc.setFontSize(10);
  doc.setFont(undefined, 'bold');
  doc.text('Important Disclaimer:', margin, yPos);
  yPos += 7;
  doc.setFont(undefined, 'normal');
  const disclaimer = 'This transcript is for educational purposes only and does not constitute professional mental health advice. If you are experiencing a mental health crisis, please contact a licensed therapist or call 988 (US) for immediate support.';
  const disclaimerLines = doc.splitTextToSize(disclaimer, maxWidth);
  disclaimerLines.forEach(line => {
    doc.text(line, margin, yPos);
    yPos += 5;
  });
  
  // Save
  doc.save(`SFH_Session_${currentSessionId}_${new Date().toISOString().split('T')[0]}.pdf`);
  
  alert('Transcript exported successfully!');
});
```

---

## Feature 5: Paragraph Separation

This is the simplest - just format LLM responses to add blank lines between concepts.

### Backend Prompt Enhancement

**File**: `apps/simple-chat/src/server.ts`

Update the system prompt in the `/api/chat` endpoint:

```typescript
const systemPrompt = `You are an educational AI assistant specializing in the Sentient-Field Hypothesis (SFH) applied to psychology.

IMPORTANT FORMATTING RULES:
1. Separate distinct concepts or paragraphs with blank lines (\\n\\n)
2. Each paragraph should focus on ONE concept or idea
3. Keep paragraphs 2-4 sentences long
4. Use blank lines liberally to improve readability

Example format:
"Your anxiety reflects reduced θ-resonance in your attachment field. This is a natural response to disconnection.

Let's explore practices that can strengthen your field coupling. One approach is to visualize your secure base while practicing deep breathing.

This technique works by increasing qualic coherence between your field and your attachment figure's field. Over time, this reduces anxiety naturally."

${/* rest of prompt */}
`;
```

---

## Testing Checklist

After implementing all features, test:

- [ ] All 37 axioms load correctly
- [ ] Color-coded paragraphs display properly (GREEN/YELLOW/RED)
- [ ] TTS works with browser speech (free)
- [ ] TTS API key field appears when enabled
- [ ] Multiple-choice questions generate and are clickable
- [ ] PDF export includes summary and recommendations
- [ ] Paragraphs are separated with blank lines
- [ ] All existing functionality still works

---

## Priority Order

1. **Paragraph separation** (easiest, just prompt change)
2. **Color-coded paragraphs** (visual impact, backend + frontend)
3. **TTS** (major UX improvement)
4. **MCQs** (requires LLM integration)
5. **PDF export** (requires jsPDF library)

Would you like me to implement any of these features fully, or would you prefer to implement them yourself using this guide?
