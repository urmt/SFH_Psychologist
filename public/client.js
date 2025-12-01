/**
 * SFH Psychologist Chat Client
 */

// State management
const state = {
    messages: [],
    sessionId: 'session-' + Date.now(),
    userId: 'user-' + Math.random().toString(36).substr(2, 9),
    isLoading: false,
    coherenceScores: [],
    ttsEnabled: false,
    elevenLabsApiKey: null,
    currentUtterance: null,
    currentAudio: null,
    pendingMcq: null
};

// DOM elements
const messagesContainer = document.getElementById('messagesContainer');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const avgCoherenceDisplay = document.getElementById('avgCoherence');
const riskLevelDisplay = document.getElementById('riskLevel');
const messageCountDisplay = document.getElementById('messageCount');
const topicTagsDisplay = document.getElementById('topicTags');
const ttsToggle = document.getElementById('ttsToggle');
const elevenLabsKeyInput = document.getElementById('elevenLabsKey');
const exportPdfButton = document.getElementById('exportPdfButton');

/**
 * Add a message to the chat
 */
function addMessage(role, content, meta = {}) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    // Render color-coded paragraphs for therapist messages
    if (role === 'therapist' && meta.classifiedParagraphs && meta.classifiedParagraphs.length > 0) {
        // Add color legend
        const legend = document.createElement('div');
        legend.className = 'color-legend';
        legend.innerHTML = `
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
        `;
        contentDiv.appendChild(legend);
        
        // Render each classified paragraph
        meta.classifiedParagraphs.forEach(para => {
            const paraDiv = document.createElement('div');
            paraDiv.className = `classified-paragraph paragraph-${para.color}`;
            paraDiv.textContent = para.text;
            contentDiv.appendChild(paraDiv);
        });
        
        // Text-to-Speech for therapist response
        if (state.ttsEnabled) {
            speakText(content, contentDiv);
        }
    } else {
        // Plain text for user messages or fallback
        contentDiv.textContent = content;
    }
    
    const metaDiv = document.createElement('div');
    metaDiv.className = 'message-meta';
    
    // Add validation info for therapist messages
    if (role === 'therapist' && meta.validation) {
        const badge = document.createElement('span');
        badge.className = `validation-badge ${meta.validation.passed ? 'pass' : 'fail'}`;
        badge.textContent = meta.validation.passed ? '✓ SFH Compliant' : '✗ Failed';
        metaDiv.appendChild(badge);
        
        const coherence = document.createElement('span');
        coherence.className = 'coherence-score';
        coherence.textContent = `Coherence: ${meta.validation.qualicCoherenceScore.toFixed(3)}`;
        metaDiv.appendChild(coherence);
        
        // Track coherence scores
        state.coherenceScores.push(meta.validation.qualicCoherenceScore);
        updateAverageCoherence();
    }
    
    messageDiv.appendChild(contentDiv);
    if (metaDiv.children.length > 0) {
        messageDiv.appendChild(metaDiv);
    }
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    return messageDiv;
}

/**
 * Show loading indicator
 */
function showLoading() {
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'loading';
    loadingDiv.id = 'loadingIndicator';
    loadingDiv.textContent = 'Therapist is thinking';
    messagesContainer.appendChild(loadingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

/**
 * Remove loading indicator
 */
function hideLoading() {
    const loading = document.getElementById('loadingIndicator');
    if (loading) {
        loading.remove();
    }
}

/**
 * Show error message
 */
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = `Error: ${message}`;
    messagesContainer.appendChild(errorDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Auto-remove after 5 seconds
    setTimeout(() => errorDiv.remove(), 5000);
}

/**
 * Update average coherence display
 */
function updateAverageCoherence() {
    if (state.coherenceScores.length === 0) return;
    
    const avg = state.coherenceScores.reduce((a, b) => a + b, 0) / state.coherenceScores.length;
    avgCoherenceDisplay.textContent = `Avg. Coherence: ${avg.toFixed(3)}`;
    
    // Color code based on coherence
    if (avg >= 0.9) {
        avgCoherenceDisplay.style.background = 'rgba(76, 175, 80, 0.3)';
    } else if (avg >= 0.85) {
        avgCoherenceDisplay.style.background = 'rgba(255, 193, 7, 0.3)';
    } else {
        avgCoherenceDisplay.style.background = 'rgba(244, 67, 54, 0.3)';
    }
}

/**
 * Update risk level display
 */
function updateRiskLevel(riskLevel) {
    riskLevelDisplay.textContent = `Risk: ${riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)}`;
    riskLevelDisplay.className = 'info-badge risk-' + riskLevel;
}

/**
 * Update message count
 */
function updateMessageCount() {
    messageCountDisplay.textContent = `Messages: ${state.messages.length}`;
}

/**
 * Update topic tags display
 */
function updateTopicTags(tags) {
    if (!tags || tags.length === 0) {
        topicTagsDisplay.innerHTML = '';
        return;
    }
    
    const tagNames = {
        'attachment_anxiety': '🔗 Attachment Anxiety',
        'attachment_avoidance': '🚪 Attachment Avoidance',
        'psychedelic': '🍄 Psychedelic',
        'social': '👥 Social',
        'suicidal': '⚠️ Crisis',
        'dissociation': '🌀 Dissociation'
    };
    
    topicTagsDisplay.innerHTML = tags.map(tag => 
        `<span class="topic-tag">${tagNames[tag] || tag}</span>`
    ).join('');
}

/**
 * Send a message to the backend
 */
async function sendMessage() {
    const message = messageInput.value.trim();
    if (!message || state.isLoading) return;
    
    // Clear input and disable controls
    messageInput.value = '';
    state.isLoading = true;
    sendButton.disabled = true;
    messageInput.disabled = true;
    
    // Add user message to chat
    addMessage('user', message);
    state.messages.push({ role: 'client', content: message, timestamp: new Date() });
    
    // Show loading
    showLoading();
    
    try {
        // Send to backend API
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message,
                sessionId: state.sessionId,
                userId: state.userId,
                messages: state.messages
            })
        });
        
        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Hide loading
        hideLoading();
        
        // Add therapist response with classified paragraphs
        addMessage('therapist', data.response, {
            validation: data.validation,
            classifiedParagraphs: data.classifiedParagraphs
        });
        
        state.messages.push({
            role: 'therapist',
            content: data.response,
            timestamp: new Date(),
            coherenceScore: data.validation.qualicCoherenceScore
        });
        
        // Check for MCQ
        if (data.mcq) {
            renderMCQ(data.mcq);
        }
        
        // Update session info displays
        if (data.metadata) {
            if (data.metadata.riskLevel) {
                updateRiskLevel(data.metadata.riskLevel);
            }
            if (data.metadata.topicTags) {
                updateTopicTags(data.metadata.topicTags);
            }
        }
        updateMessageCount();
        
        // Show warning if validation failed
        if (!data.validation.passed) {
            console.warn('Response failed SFH validation:', data.validation);
        }
        
    } catch (error) {
        hideLoading();
        showError(error.message);
        console.error('Failed to send message:', error);
    } finally {
        // Re-enable controls
        state.isLoading = false;
        sendButton.disabled = false;
        messageInput.disabled = false;
        messageInput.focus();
    }
}

/**
 * Text-to-Speech functions
 */
function speakText(text, containerDiv) {
    // Stop any current speech
    stopSpeech();
    
    // Add audio indicator
    const audioIndicator = document.createElement('span');
    audioIndicator.className = 'audio-playing';
    audioIndicator.textContent = '🔊 Playing...';
    containerDiv.appendChild(audioIndicator);
    
    // Try ElevenLabs API first if key is provided
    if (state.elevenLabsApiKey) {
        speakWithElevenLabs(text, audioIndicator);
    } else {
        // Fallback to browser Web Speech API
        speakWithWebSpeechAPI(text, audioIndicator);
    }
}

function speakWithWebSpeechAPI(text, indicator) {
    if (!('speechSynthesis' in window)) {
        console.warn('Web Speech API not supported');
        if (indicator) indicator.remove();
        return;
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    utterance.onend = () => {
        if (indicator) indicator.remove();
        state.currentUtterance = null;
    };
    
    utterance.onerror = (e) => {
        console.error('Speech synthesis error:', e);
        if (indicator) indicator.remove();
        state.currentUtterance = null;
    };
    
    state.currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
}

async function speakWithElevenLabs(text, indicator) {
    try {
        const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM', {
            method: 'POST',
            headers: {
                'Accept': 'audio/mpeg',
                'Content-Type': 'application/json',
                'xi-api-key': state.elevenLabsApiKey
            },
            body: JSON.stringify({
                text: text,
                model_id: 'eleven_monolingual_v1',
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.75
                }
            })
        });
        
        if (!response.ok) {
            throw new Error('ElevenLabs API error');
        }
        
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        
        audio.onended = () => {
            if (indicator) indicator.remove();
            state.currentAudio = null;
            URL.revokeObjectURL(audioUrl);
        };
        
        audio.onerror = () => {
            console.error('Audio playback error');
            if (indicator) indicator.remove();
            state.currentAudio = null;
        };
        
        state.currentAudio = audio;
        audio.play();
        
    } catch (error) {
        console.error('ElevenLabs TTS failed, falling back to Web Speech API:', error);
        speakWithWebSpeechAPI(text, indicator);
    }
}

function stopSpeech() {
    // Stop Web Speech API
    if (state.currentUtterance && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        state.currentUtterance = null;
    }
    
    // Stop ElevenLabs audio
    if (state.currentAudio) {
        state.currentAudio.pause();
        state.currentAudio = null;
    }
}

/**
 * Multiple Choice Question rendering
 */
function renderMCQ(mcqData) {
    const mcqContainer = document.createElement('div');
    mcqContainer.className = 'mcq-container';
    
    const question = document.createElement('div');
    question.className = 'mcq-question';
    question.textContent = mcqData.question;
    mcqContainer.appendChild(question);
    
    const optionsDiv = document.createElement('div');
    optionsDiv.className = 'mcq-options';
    
    mcqData.options.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'mcq-option';
        optionDiv.textContent = option;
        optionDiv.dataset.index = index;
        
        optionDiv.addEventListener('click', () => {
            // Remove previous selection
            optionsDiv.querySelectorAll('.mcq-option').forEach(o => {
                o.classList.remove('selected');
            });
            
            // Mark selected
            optionDiv.classList.add('selected');
            
            // Send MCQ response after brief delay
            setTimeout(() => {
                handleMCQResponse(mcqData.question, option, mcqData.context);
                mcqContainer.remove();
            }, 500);
        });
        
        optionsDiv.appendChild(optionDiv);
    });
    
    mcqContainer.appendChild(optionsDiv);
    messagesContainer.appendChild(mcqContainer);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

async function handleMCQResponse(question, selectedAnswer, context) {
    const mcqMessage = `[MCQ Response] Question: "${question}" - Selected: "${selectedAnswer}"`;
    
    // Add to chat as user message
    addMessage('user', `Selected: "${selectedAnswer}"`);
    state.messages.push({ 
        role: 'client', 
        content: mcqMessage,
        timestamp: new Date() 
    });
    
    // Get follow-up response from therapist
    state.isLoading = true;
    sendButton.disabled = true;
    messageInput.disabled = true;
    showLoading();
    
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: mcqMessage,
                sessionId: state.sessionId,
                userId: state.userId,
                messages: state.messages,
                mcqContext: context
            })
        });
        
        const data = await response.json();
        hideLoading();
        
        addMessage('therapist', data.response, {
            validation: data.validation,
            classifiedParagraphs: data.classifiedParagraphs
        });
        
        state.messages.push({
            role: 'therapist',
            content: data.response,
            timestamp: new Date(),
            coherenceScore: data.validation.qualicCoherenceScore
        });
        
        // Check for new MCQ
        if (data.mcq) {
            renderMCQ(data.mcq);
        }
        
        if (data.metadata) {
            if (data.metadata.riskLevel) updateRiskLevel(data.metadata.riskLevel);
            if (data.metadata.topicTags) updateTopicTags(data.metadata.topicTags);
        }
        updateMessageCount();
        
    } catch (error) {
        hideLoading();
        showError(error.message);
    } finally {
        state.isLoading = false;
        sendButton.disabled = false;
        messageInput.disabled = false;
        messageInput.focus();
    }
}

/**
 * PDF Export function
 */
async function exportToPDF() {
    if (state.messages.length === 0) {
        alert('No conversation to export yet!');
        return;
    }
    
    exportPdfButton.disabled = true;
    exportPdfButton.textContent = '⏳ Generating...';
    
    try {
        // Request summary from backend
        const response = await fetch('/api/export-summary', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sessionId: state.sessionId,
                messages: state.messages,
                coherenceScores: state.coherenceScores
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to generate summary');
        }
        
        const { summary, recommendations } = await response.json();
        
        // Generate PDF using jsPDF (loaded from CDN)
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Title
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text('SFH Psychologist Session Transcript', 20, 20);
        
        // Session info
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Session ID: ${state.sessionId}`, 20, 30);
        doc.text(`Date: ${new Date().toLocaleString()}`, 20, 35);
        doc.text(`Messages: ${state.messages.length}`, 20, 40);
        
        if (state.coherenceScores.length > 0) {
            const avgCoherence = state.coherenceScores.reduce((a, b) => a + b, 0) / state.coherenceScores.length;
            doc.text(`Avg Coherence: ${avgCoherence.toFixed(3)}`, 20, 45);
        }
        
        let yPos = 55;
        
        // Conversation transcript
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Conversation Transcript', 20, yPos);
        yPos += 10;
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        
        state.messages.forEach((msg, index) => {
            if (yPos > 270) {
                doc.addPage();
                yPos = 20;
            }
            
            const role = msg.role === 'client' ? 'You' : 'Therapist';
            doc.setFont('helvetica', 'bold');
            doc.text(`${role}:`, 20, yPos);
            doc.setFont('helvetica', 'normal');
            
            // Wrap text to fit page width
            const lines = doc.splitTextToSize(msg.content, 170);
            yPos += 5;
            lines.forEach(line => {
                if (yPos > 280) {
                    doc.addPage();
                    yPos = 20;
                }
                doc.text(line, 20, yPos);
                yPos += 5;
            });
            
            yPos += 3;
        });
        
        // Add new page for summary
        doc.addPage();
        yPos = 20;
        
        // Summary section
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Session Summary', 20, yPos);
        yPos += 10;
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        const summaryLines = doc.splitTextToSize(summary, 170);
        summaryLines.forEach(line => {
            if (yPos > 280) {
                doc.addPage();
                yPos = 20;
            }
            doc.text(line, 20, yPos);
            yPos += 5;
        });
        
        yPos += 5;
        
        // Recommendations section
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Recommendations', 20, yPos);
        yPos += 10;
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        const recLines = doc.splitTextToSize(recommendations, 170);
        recLines.forEach(line => {
            if (yPos > 280) {
                doc.addPage();
                yPos = 20;
            }
            doc.text(line, 20, yPos);
            yPos += 5;
        });
        
        // Save PDF
        const filename = `SFH_Session_${state.sessionId}_${Date.now()}.pdf`;
        doc.save(filename);
        
        console.log('PDF exported:', filename);
        
    } catch (error) {
        console.error('PDF export failed:', error);
        alert('Failed to export PDF: ' + error.message);
    } finally {
        exportPdfButton.disabled = false;
        exportPdfButton.textContent = '📄 Export PDF';
    }
}

/**
 * Event listeners
 */
sendButton.addEventListener('click', sendMessage);

messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

// TTS toggle
ttsToggle.addEventListener('click', () => {
    state.ttsEnabled = !state.ttsEnabled;
    ttsToggle.textContent = state.ttsEnabled ? '🔊 TTS: On' : '🔊 TTS: Off';
    ttsToggle.classList.toggle('active', state.ttsEnabled);
    
    if (!state.ttsEnabled) {
        stopSpeech();
    }
});

// ElevenLabs API key input
elevenLabsKeyInput.addEventListener('change', (e) => {
    state.elevenLabsApiKey = e.target.value.trim() || null;
    console.log('ElevenLabs API key', state.elevenLabsApiKey ? 'set' : 'cleared');
});

// PDF export button
exportPdfButton.addEventListener('click', exportToPDF);

// Focus input on load
messageInput.focus();

console.log('SFH Psychologist Chat Client initialized');
console.log('Session ID:', state.sessionId);
