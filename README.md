# ☕ Bean & Brew AI Chatbot

A clean, modern, and professional AI-powered customer support chatbot designed for a fictional coffee shop. This project serves as a portfolio piece to demonstrate AI integration, frontend development, and responsive design.

![Chatbot Preview](https://via.placeholder.com/800x450.png?text=Bean+%26+Brew+Chatbot+Demo) <!-- Replace with your actual screenshot later! -->

## 🚀 Features
- **AI-Powered Conversation**: Integrates with Google Gemini API for intelligent, context-aware responses.
- **Coffee Shop Context**: Trained on a specific knowledge base (Menu, Hours, WiFi, Location).
- **Graceful Fallback**: Includes a smart fallback system that ensures the bot remains functional even if API quotas are exceeded.
- **Premium UI/UX**: Uses a coffee-inspired color palette, Google Fonts (Inter & Outfit), and smooth CSS animations.
- **Mobile Responsive**: Fully optimized for desktops, tablets, and mobile phones.
- **Resettable Chat**: Quick reset button to clear conversation history.

## 🛠️ Tech Stack
- **Frontend**: HTML5, CSS3 (Vanilla CSS), JavaScript (ES6+).
- **AI Model**: Google Gemini (via `gemini-flash-latest`).
- **Typography**: Inter & Outfit via Google Fonts.

## 📦 Project Structure
- `index.html`: The core structure and semantic layout.
- `style.css`: Custom styling, CSS variables, and animations.
- `app.js`: Chat logic, API integration, and fallback handling.

## 🚦 Getting Started
1. **Clone the project**:
   ```bash
   git clone [your-repo-link]
   ```
2. **Add your API Key**:
   Open `app.js` and replace `"YOUR_API_KEY_HERE"` with your free key from [Google AI Studio](https://aistudio.google.com/app/apikey).
3. **Run the app**:
   Open `index.html` in any browser, or use the **Live Server** extension in VS Code for the best experience.

## 💡 Learnings
- **Prompt Engineering**: Designing a "Barista" persona with specific constraints.
- **API Integration**: Handling asynchronous fetch requests and JSON responses.
- **Error Handling**: Implementing fallback logic to improve user experience during network or API issues.
- **CSS Architecture**: Using CSS variables for a consistent design system.

## 👨‍💻 Credits
Built by [Your Name] as an AI Portfolio Project.
