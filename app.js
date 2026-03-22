// --- STAGE 4 & 5: AI Integration & Knowledge Base ---

// 1. Configuration (API Key is loaded from localStorage)

// 2. Knowledge Base (Fictional Coffee Shop: Bean & Brew)
const KNOWLEDGE_BASE = `
You are the virtual barista for "Bean & Brew", a cozy, professional coffee shop. 

PRICING LIST:
- Espresso: $3.50
- Latte: $4.50
- Cappuccino: $4.50
- Cold Brew: $4.00
- Blueberry Muffin: $3.50
- Butter Croissant: $3.00
- Milk Alternatives (Oat/Almond): +$0.50

ORDERING INSTRUCTIONS:
1. If a customer wants to order, calculate the TOTAL price.
2. If they ask for milk alternatives (Oat/Almond), add $0.50 to that specific drink.
3. Always provide a "Ready Time" estimate:
   - 1-2 items: 5 minutes.
   - 3-5 items: 10 minutes.
   - 6+ items: 15 minutes.
4. Confirm the order details clearly (e.g., "That will be one Latte and one Muffin. Your total is $8.00").
5. Use a warm, barista-like tone with emojis. ☕🥐
`;

/**
 * Fallback responses if the AI API is down or quota hit
 */
function getFallbackResponse(userMessage) {
    const msg = userMessage.toLowerCase().trim();

    // --- SPECIAL ORDER DETECTION (SIMULATED CALCULATION) ---
    if (msg.includes("order") || msg.includes("want") || msg.includes("buy") || msg.includes("get")) {
        let total = 0;
        let items = [];

        if (msg.includes("latte")) { total += 4.50; items.push("Latte"); }
        if (msg.includes("espresso")) { total += 3.50; items.push("Espresso"); }
        if (msg.includes("cappuccino")) { total += 4.50; items.push("Cappuccino"); }
        if (msg.includes("cold brew")) { total += 4.00; items.push("Cold Brew"); }
        if (msg.includes("muffin")) { total += 3.50; items.push("Blueberry Muffin"); }
        if (msg.includes("croissant")) { total += 3.00; items.push("Butter Croissant"); }

        if (items.length > 0) {
            const time = items.length > 2 ? "10 minutes" : "5 minutes";
            return `I've noted your order for: ${items.join(", ")}. Your total is $${total.toFixed(2)}. It will be ready for pickup in about ${time}! ☕🥐`;
        }
    }

    // 1. Specific Info Queries (PRIORITY)
    if (msg.includes("wifi") || msg.includes("password")) return "Our WiFi password is **CoffeeLover2024**. Enjoy your browsing! 📶";
    if (msg.includes("pastry") || msg.includes("muffin") || msg.includes("croissant") || msg.includes("bakery")) return "Our pastries are freshly baked! We have Blueberry Muffins ($3.50) and Butter Croissants ($3.00). Would you like to add one to your order? 🥐";
    if (msg.includes("menu") || msg.includes("coffee") || msg.includes("drink")) return "We have delicious Espressos ($3.50), Lattes ($4.50), and Cappuccinos ($4.50). Would you like to see our pastry menu too? ☕";
    if (msg.includes("hour") || msg.includes("open") || msg.includes("close")) return "We are open Mon-Fri 7am-7pm, and weekends 8am-8pm. Stop by anytime! 🕒";
    if (msg.includes("location") || msg.includes("where") || msg.includes("address")) return "You can find us at 123 Main Street. We can't wait to see you! 📍";
    if (msg.includes("loyalty") || msg.includes("free") || msg.includes("point")) return "Our loyalty program is simple: Buy 9 drinks, and your 10th one is on the house! 🎁";

    // 2. Greetings
    if (msg === "hello" || msg === "hi" || msg === "hey" || msg === "good morning" || msg.startsWith("hello ")) {
        return "Hi there! Welcome to Bean & Brew. ☕ I'm your virtual barista. How can I help you today?";
    }

    // 3. Affirmations / Affirmative "Yes"
    if (msg.includes("yes") || msg.includes("sure") || msg.includes("ok") || msg.includes("please")) {
        return "Perfect! What else can I assist you with today? ☕";
    }

    // 4. Thanks
    if (msg.includes("thanks") || msg.includes("thank you")) {
        return "You're very welcome! Enjoy your coffee and have a great day at Bean & Brew! 😊";
    }

    // 5. Default Catch-all
    return "I'd be happy to help with that! You can place an order, or ask me about our menu, hours, and location. What can I get started for you? ☕";
}



const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const chatMessages = document.getElementById('chat-messages');
const resetBtn = document.getElementById('clear-chat');
const suggestionBtns = document.querySelectorAll('.suggestion-btn');
const themeToggle = document.getElementById('theme-toggle');

/**
 * Saves the current chat messages to LocalStorage
 */
function saveChatToLocal() {
    const messages = [];
    document.querySelectorAll('.message').forEach(msg => {
        messages.push({
            text: msg.querySelector('.message-content')?.textContent || "",
            isUser: msg.classList.contains('user-message'),
            timestamp: msg.querySelector('.timestamp')?.textContent || ""
        });
    });
    localStorage.setItem('bean_brew_chat', JSON.stringify(messages));
}

/**
 * Loads chat messages and theme from LocalStorage
 */
function loadChatFromLocal() {
    // 1. Load History
    const savedChat = localStorage.getItem('bean_brew_chat');
    if (savedChat) {
        const messages = JSON.parse(savedChat);
        if (messages.length > 0) {
            chatMessages.innerHTML = ''; // Clear initial if we have history
            messages.forEach(msg => {
                appendMessage(msg.text, msg.isUser, false, msg.timestamp);
            });
        }
    }

    // 2. Load Theme
    const savedTheme = localStorage.getItem('bean_brew_theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.textContent = '☀️';
    }
}

/**
 * Adds a message bubble to the chat area
 */
function appendMessage(text, isUser = false, shouldSave = true, forcedTimestamp = null) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.classList.add(isUser ? 'user-message' : 'bot-message');

    const contentDiv = document.createElement('div');
    contentDiv.classList.add('message-content');
    contentDiv.textContent = text;

    const timestamp = document.createElement('span');
    timestamp.classList.add('timestamp');

    if (forcedTimestamp) {
        timestamp.textContent = forcedTimestamp;
    } else {
        const now = new Date();
        timestamp.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    messageDiv.appendChild(contentDiv);
    messageDiv.appendChild(timestamp);
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    if (shouldSave) saveChatToLocal();
}


/**
 * Typing indicator
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
 * Call Gemini API
 */
async function getAIResponse(userMessage) {
    const apiKey = localStorage.getItem('geminiApiKey');
    if (!apiKey) {
        alert("Please enter your API key first!");
        const apiInput = document.getElementById('api-key-input');
        if (apiInput) {
            document.getElementById('api-setup-section').classList.remove('collapsed');
            apiInput.focus();
        }
        return "I need an API key to help you! Please add it in the setup section above.";
    }

    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${apiKey}`;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `${KNOWLEDGE_BASE}\n\nCustomer: ${userMessage}\nBarista:`
                    }]
                }]
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.warn("API Error. Switching to smart fallback mode.", errorData);
            return getFallbackResponse(userMessage);
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error("Connection Error. Using fallback.", error);
        return getFallbackResponse(userMessage);
    }
}

/**
 * Handle form submission
 */
chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const message = userInput.value.trim();
    if (!message) return;

    appendMessage(message, true);
    userInput.value = '';

    showBotLoading();
    const aiResponse = await getAIResponse(message);
    removeBotLoading();

    appendMessage(aiResponse, false);
});

/**
 * Handle Suggestion Button Clicks
 */
suggestionBtns.forEach(btn => {
    btn.addEventListener('click', async () => {
        const query = btn.getAttribute('data-query');
        appendMessage(query, true);

        showBotLoading();
        const aiResponse = await getAIResponse(query);
        removeBotLoading();

        appendMessage(aiResponse, false);
    });
});

// --- API Key Setup Logic ---
const apiSetupSection = document.getElementById('api-setup-section');
const apiKeyInput = document.getElementById('api-key-input');
const saveApiKeyBtn = document.getElementById('save-api-key-btn');
const apiKeyStatus = document.getElementById('api-key-status');

// Check if key exists on load
window.addEventListener('DOMContentLoaded', () => {
    const existingKey = localStorage.getItem('geminiApiKey');
    if (existingKey) {
        apiKeyInput.value = '********'; // Obscure it visually
        apiSetupSection.classList.add('collapsed');
    }
});

saveApiKeyBtn.addEventListener('click', () => {
    const key = apiKeyInput.value.trim();
    if (key && key !== '********') {
        localStorage.setItem('geminiApiKey', key);
        apiKeyStatus.classList.remove('hidden');
        apiKeyInput.value = '********';
        
        setTimeout(() => {
            apiSetupSection.classList.add('collapsed');
            apiKeyStatus.classList.add('hidden'); // Reset status for next time it expands
        }, 1500);
    } else if (key === '********') {
        apiSetupSection.classList.add('collapsed');
    } else {
        alert("Please enter a valid API key.");
    }
});

// Allow expanding the collapsed section
apiSetupSection.addEventListener('click', (e) => {
    // If the click is on the minimize button or its children, ignore it here
    if (e.target.closest('#minimize-api-btn')) return;
    
    if (apiSetupSection.classList.contains('collapsed')) {
        apiSetupSection.classList.remove('collapsed');
        apiKeyInput.value = ''; // Clear placeholder so user can enter new key
        apiKeyInput.focus();
    }
});

// Add minimize button functionality
document.getElementById('minimize-api-btn').addEventListener('click', (e) => {
    e.stopPropagation(); // prevent expanding it immediately again
    apiSetupSection.classList.add('collapsed');
    if (localStorage.getItem('geminiApiKey')) {
        apiKeyInput.value = '********'; // restore mask if a key exists
    } else {
        apiKeyInput.value = '';
    }
});

// Reset chat
const themeToggleListener = themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    themeToggle.textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('bean_brew_theme', isDark ? 'dark' : 'light');
});

resetBtn.addEventListener('click', () => {

    if (confirm("Are you sure you want to clear your chat history?")) {
        chatMessages.innerHTML = '';
        localStorage.removeItem('bean_brew_chat');
        appendMessage("Welcome back to Bean & Brew! How can I help you today? ☕", false);
    }
});

// Load history on startup
loadChatFromLocal();
