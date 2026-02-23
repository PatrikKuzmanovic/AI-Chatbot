// --- STAGE 2 & 3: Chat Interactivity Logic ---

// 1. Select DOM elements
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const chatMessages = document.getElementById('chat-messages');
const resetBtn = document.getElementById('clear-chat');

/**
 * Adds a message bubble to the chat area
 * @param {string} text - The message content
 * @param {boolean} isUser - Whether the message is from the user
 */
function appendMessage(text, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.classList.add(isUser ? 'user-message' : 'bot-message');

    // Create the message content
    const contentDiv = document.createElement('div');
    contentDiv.classList.add('message-content');
    contentDiv.textContent = text;

    // Create the timestamp
    const timestamp = document.createElement('span');
    timestamp.classList.add('timestamp');
    const now = new Date();
    timestamp.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    messageDiv.appendChild(contentDiv);
    messageDiv.appendChild(timestamp);

    chatMessages.appendChild(messageDiv);

    // Auto-scroll to the bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

/**
 * Simulates a typing indicator or bot thinking
 */
function showBotLoading() {
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'bot-loading';
    loadingDiv.classList.add('message', 'bot-message');
    loadingDiv.innerHTML = `<div class="typing-indicator"><span></span><span></span><span></span></div>`;
    chatMessages.appendChild(loadingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeBotLoading() {
    const loading = document.getElementById('bot-loading');
    if (loading) loading.remove();
}

/**
 * Handles the form submission
 */
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const message = userInput.value.trim();
    if (!message) return;

    // 1. Display user message
    appendMessage(message, true);

    // 2. Clear input
    userInput.value = '';

    // 3. Simulate bot response (Phase 4 will replace this with real AI)
    handleBotResponse(message);
});

async function handleBotResponse(userMessage) {
    showBotLoading();

    // Simulate 1.5s delay for "thinking"
    setTimeout(() => {
        removeBotLoading();

        // Mock logic for demo purposes
        let response = "That's a great question! I'm still learning about Bean & Brew, but I'll be fully trained in the next phase.";

        if (userMessage.toLowerCase().includes('hello') || userMessage.toLowerCase().includes('hi')) {
            response = "Hi there! Welcome to Bean & Brew. How can I help you with your coffee needs today?";
        } else if (userMessage.toLowerCase().includes('menu')) {
            response = "We have a wonderful selection of coffees! Would you like to hear about our Espressos or Cold Brews?";
        }

        appendMessage(response, false);
    }, 1500);
}

// Reset chat
resetBtn.addEventListener('click', () => {
    chatMessages.innerHTML = '';
    appendMessage("Chat reset. How can I help you today?", false);
});

