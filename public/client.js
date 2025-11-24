/**
 * SFH Psychologist Chat Client
 */

// State management
const state = {
    messages: [],
    sessionId: 'session-' + Date.now(),
    userId: 'user-' + Math.random().toString(36).substr(2, 9),
    isLoading: false,
    coherenceScores: []
};

// DOM elements
const messagesContainer = document.getElementById('messagesContainer');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const avgCoherenceDisplay = document.getElementById('avgCoherence');
const riskLevelDisplay = document.getElementById('riskLevel');
const messageCountDisplay = document.getElementById('messageCount');
const topicTagsDisplay = document.getElementById('topicTags');

/**
 * Add a message to the chat
 */
function addMessage(role, content, meta = {}) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.textContent = content;
    
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
        
        // Add therapist response
        addMessage('therapist', data.response, {
            validation: data.validation
        });
        
        state.messages.push({
            role: 'therapist',
            content: data.response,
            timestamp: new Date(),
            coherenceScore: data.validation.qualicCoherenceScore
        });
        
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
 * Event listeners
 */
sendButton.addEventListener('click', sendMessage);

messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

// Focus input on load
messageInput.focus();

console.log('SFH Psychologist Chat Client initialized');
console.log('Session ID:', state.sessionId);
