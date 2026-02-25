// --- STAGE 4 & 5: AI Integration & Knowledge Base ---

// 1. Configuration 
const GEMINI_API_KEY = "AIzaSyAYWP8mspdL65RuLBxMhdT6BngzehWPrhc";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${GEMINI_API_KEY}`;

// 2. Knowledge Base (Fictional Coffee Shop: Bean & Brew)
const KNOWLEDGE_BASE = `
You are the virtual barista for "Bean & Brew", a cozy, professional coffee shop. 
Your goal is to help customers with their questions politely and warmly.

SHOP INFORMATION:
- Name: Bean & Brew
- Location: 123 Main Street
- Hours: Mon-Fri 7am-7pm, Sat-Sun 8am-8pm
- WiFi: Password is "CoffeeLover2024"

MENU:
- Espresso: $3.50
- Latte: $4.50 (Oat/Almond milk available for +$0.50)
- Cappuccino: $4.50
- Cold Brew: $4.00
- Blueberry Muffin: $3.50
- Butter Croissant: $3.00

OFFERS:
- Loyalty Program: Buy 9 drinks, get the 10th one free!

INSTRUCTIONS:
- Keep responses concise and friendly.
- Use coffee-related emojis occasionally.
- If you don't know the answer, politely ask them to visit the shop or call us.
- Only talk about Bean & Brew related topics.
`;

/**
 * Fallback responses if the AI API is down or quota hit
 * This ensures your portfolio demo ALWAYS works for clients!
 */
function getFallbackResponse(userMessage) {
    const msg = userMessage.toLowerCase().trim();

    // 1. Specific Info Queries (PRIORITY)
    // We check these first because if a user says "Thank you, what is on the menu?", 
    // we want to prioritize the menu answer over the generic "you're welcome".
    if (msg.includes("wifi") || msg.includes("password")) return "Our WiFi password is **CoffeeLover2024**. Enjoy your browsing! 📶";
    if (msg.includes("pastry") || msg.includes("muffin") || msg.includes("croissant") || msg.includes("bakery")) return "Our pastries are freshly baked! We have Blueberry Muffins ($3.50) and Butter Croissants ($3.00). Would you like to add one to your order? 🥐";
    if (msg.includes("menu") || msg.includes("coffee") || msg.includes("drink")) return "We have delicious Espressos ($3.50), Lattes ($4.50), and Cappuccinos ($4.50). Would you like to see our pastry menu too? ☕";
    if (msg.includes("hour") || msg.includes("open") || msg.includes("close")) return "We are open Mon-Fri 7am-7pm, and weekends 8am-8pm. Stop by anytime! 🕒";
    if (msg.includes("location") || msg.includes("where") || msg.includes("address")) return "You can find us at 123 Main Street. We can't wait to see you! 📍";
    if (msg.includes("loyalty") || msg.includes("free") || msg.includes("point")) return "Our loyalty program is simple: Buy 9 drinks, and your 10th one is on the house! 🎁";

    // 2. Greetings (Strict match or starts with)
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
    return "I'd be happy to help with that! While I'm still learning some complex requests, I can tell you all about our menu, hours, and location. What would you like to know? ☕";
}


const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const chatMessages = document.getElementById('chat-messages');
const resetBtn = document.getElementById('clear-chat');

/**
 * Adds a message bubble to the chat area
 */
function appendMessage(text, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.classList.add(isUser ? 'user-message' : 'bot-message');

    const contentDiv = document.createElement('div');
    contentDiv.classList.add('message-content');
    contentDiv.textContent = text;

    const timestamp = document.createElement('span');
    timestamp.classList.add('timestamp');
    const now = new Date();
    timestamp.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    messageDiv.appendChild(contentDiv);
    messageDiv.appendChild(timestamp);
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
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
    if (GEMINI_API_KEY === "YOUR_API_KEY_HERE" || GEMINI_API_KEY === "") {
        return "I'm almost ready! Please add your Gemini API key in `app.js` to start chatting with me.";
    }

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

// Reset chat
resetBtn.addEventListener('click', () => {
    chatMessages.innerHTML = '';
    appendMessage("Welcome back to Bean & Brew! How can I help you today? ☕", false);
});
