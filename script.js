// Mobile Navbar Toggle
let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('nav');

if (menuIcon && navbar) {
    menuIcon.onclick = () => {
        menuIcon.classList.toggle('fa-xmark');
        navbar.classList.toggle('active');
    };
}

// Scroll Sections Active Link & Sticky Navbar
let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('header nav a');

window.onscroll = () => {
    let top = window.scrollY;

    sections.forEach(sec => {
        let offset = sec.offsetTop - 150;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');

        if (top >= offset && top < offset + height) {
            navLinks.forEach(links => {
                links.classList.remove('active');
                let targetLink = document.querySelector('header nav a[href*=' + id + ']');
                if (targetLink) {
                    targetLink.classList.add('active');
                }
            });
        }
    });

    // Sticky Navbar
    let header = document.querySelector('header');
    if (header) {
        header.classList.toggle('sticky', window.scrollY > 100);
    }

    // Close mobile navbar on nav link click
    if (menuIcon && navbar) {
        menuIcon.classList.remove('fa-xmark');
        navbar.classList.remove('active');
    }
};

// Dynamic Typing Effect
const typedTextSpan = document.querySelector(".typed-text");
const cursorSpan = document.querySelector(".cursor");

const textArray = [
    "Web Developer",
    "Software Developer",
    "Web Designer",
    "SQL & Data Analyst",
    "Full-Stack Engineer"
];

const typingDelay = 100;
const erasingDelay = 60;
const newTextDelay = 1800;
let textArrayIndex = 0;
let charIndex = 0;

function type() {
    if (!typedTextSpan) return;
    if (charIndex < textArray[textArrayIndex].length) {
        if (cursorSpan && !cursorSpan.classList.contains("typing")) {
            cursorSpan.classList.add("typing");
        }
        typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
        charIndex++;
        setTimeout(type, typingDelay);
    } else {
        if (cursorSpan) cursorSpan.classList.remove("typing");
        setTimeout(erase, newTextDelay);
    }
}

function erase() {
    if (!typedTextSpan) return;
    if (charIndex > 0) {
        if (cursorSpan && !cursorSpan.classList.contains("typing")) {
            cursorSpan.classList.add("typing");
        }
        typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
        charIndex--;
        setTimeout(erase, erasingDelay);
    } else {
        if (cursorSpan) cursorSpan.classList.remove("typing");
        textArrayIndex++;
        if (textArrayIndex >= textArray.length) textArrayIndex = 0;
        setTimeout(type, typingDelay + 300);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    if (typedTextSpan) {
        setTimeout(type, 500);
    }

    // AI Assistant Chatbot Toggle & Interactive Functionality
    const aiToggleBtn = document.getElementById("ai-toggle-btn");
    const aiChatWindow = document.getElementById("ai-chat-window");
    const aiCloseBtn = document.getElementById("ai-close-btn");
    const aiChatForm = document.getElementById("ai-chat-form");
    const aiChatInput = document.getElementById("ai-chat-input");
    const aiChatBody = document.getElementById("ai-chat-body");
    const suggestionBtns = document.querySelectorAll(".suggestion-btn");

    if (aiToggleBtn && aiChatWindow) {
        aiToggleBtn.addEventListener("click", () => {
            aiChatWindow.classList.toggle("active");
            if (aiChatWindow.classList.contains("active")) {
                aiChatInput.focus();
            }
        });
    }

    if (aiCloseBtn && aiChatWindow) {
        aiCloseBtn.addEventListener("click", () => {
            aiChatWindow.classList.remove("active");
        });
    }

    // Quick Suggestions handling
    suggestionBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const query = btn.getAttribute("data-query") || btn.textContent.trim();
            handleUserMessage(query);
        });
    });

    if (aiChatForm) {
        aiChatForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const message = aiChatInput.value.trim();
            if (message) {
                handleUserMessage(message);
                aiChatInput.value = "";
            }
        });
    }

    async function handleUserMessage(message) {
        // Append user message bubble
        appendMessage(message, "user");

        // Scroll to bottom
        scrollToBottom();

        // Create thinking indicator
        const thinkingId = appendThinkingIndicator();

        try {
            // Attempt API call to local server
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: message })
            });

            removeThinkingIndicator(thinkingId);

            if (response.ok) {
                const data = await response.json();
                appendMessage(data.response, "bot", data.image);
            } else {
                // Fallback to local heuristic engine
                const fallbackReply = generateLocalResponse(message);
                if (typeof fallbackReply === 'object') {
                    appendMessage(fallbackReply.text, "bot", fallbackReply.image);
                } else {
                    appendMessage(fallbackReply, "bot");
                }
            }
        } catch (err) {
            console.log("Server API offline. Using local client fallback AI engine.");
            removeThinkingIndicator(thinkingId);
            const fallbackReply = generateLocalResponse(message);
            if (typeof fallbackReply === 'object') {
                appendMessage(fallbackReply.text, "bot", fallbackReply.image);
            } else {
                appendMessage(fallbackReply, "bot");
            }
        }

        scrollToBottom();
    }

    function appendMessage(text, sender, imageUrl = null) {
        const msgDiv = document.createElement("div");
        msgDiv.classList.add("chat-message", `${sender}-message`);

        let formattedText = formatMarkdown(text);

        if (sender === "bot") {
            let imgHTML = imageUrl ? `<img src="${imageUrl}" alt="Generated Image" class="chat-img-preview">` : "";
            msgDiv.innerHTML = `
                <i class="fa-solid fa-wand-magic-sparkles bot-icon"></i>
                <div class="message-content">
                    <p>${formattedText}</p>
                    ${imgHTML}
                </div>
            `;
        } else {
            msgDiv.innerHTML = `
                <div class="message-content">
                    <p>${escapeHTML(text)}</p>
                </div>
            `;
        }

        aiChatBody.appendChild(msgDiv);
    }

    function appendThinkingIndicator() {
        const id = "thinking-" + Date.now();
        const thinkingDiv = document.createElement("div");
        thinkingDiv.id = id;
        thinkingDiv.classList.add("chat-message", "bot-message");
        thinkingDiv.innerHTML = `
            <i class="fa-solid fa-wand-magic-sparkles bot-icon"></i>
            <div class="message-content">
                <p><em>Thinking...</em></p>
            </div>
        `;
        aiChatBody.appendChild(thinkingDiv);
        scrollToBottom();
        return id;
    }

    function removeThinkingIndicator(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    }

    function scrollToBottom() {
        aiChatBody.scrollTop = aiChatBody.scrollHeight;
    }

    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
        );
    }

    function formatMarkdown(text) {
        let formatted = escapeHTML(text);
        // Bold: **text**
        formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        // Newlines to linebreaks
        formatted = formatted.replace(/\n/g, '<br>');
        return formatted;
    }

    // Client-side Heuristic Knowledge Engine (Fallbacks when server endpoint is offline)
    function generateLocalResponse(query) {
        const q = query.toLowerCase().trim();

        // Check for image/visual keywords
        const visualKeywords = ['image', 'photo', 'picture', 'pic', 'visual', 'draw', 'paint', 'illustration', 'artwork', 'sketch', 'render', 'wallpaper', 'generate'];
        if (visualKeywords.some(kw => q.includes(kw)) && !q.includes('how to')) {
            const prompt = q.replace(/generate|image|photo|picture|pic|draw|paint|illustration|artwork|sketch|render|wallpaper|show me|an|a|of/g, '').trim() || 'futuristic cyberpunk city';
            const imgUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=800&height=600&seed=${Math.floor(Math.random() * 1000000)}`;
            return {
                text: `Here is your generated visual for prompt: "**${prompt}**"`,
                image: imgUrl
            };
        }

        if (q.includes("hi") || q.includes("hello") || q.includes("hey")) {
            return "Hi there! 👋 How can I help you regarding **Md Raghib's** background, skills, or portfolio?";
        }
        if (q.includes("who is") || q.includes("name") || q.includes("about") || q.includes("raghib")) {
            return "<strong>Md Raghib</strong> is a 22-year-old **Software Developer, Web Developer, Web Designer & SQL Data Analyst** based in Kolkata, India. He builds responsive, scalable web applications and data-driven solutions.";
        }
        if (q.includes("skill") || q.includes("tech") || q.includes("stack") || q.includes("code")) {
            return "Here are Raghib's primary skills:\n- **Frontend**: HTML5, CSS3, JavaScript (ES6+), React, TypeScript, TailwindCSS\n- **Backend & Database**: SQL, PostgreSQL, MySQL, Node.js, Express, Python\n- **Tools**: Git, GitHub, Docker, Azure";
        }
        if (q.includes("education") || q.includes("college") || q.includes("degree") || q.includes("study")) {
            return "Raghib is currently pursuing his **B.Tech in Information Technology** at Narula Institute of Technology (2024-Present, GPA: 8.5/10).";
        }
        if (q.includes("project") || q.includes("portfolio") || q.includes("work")) {
            return "Highlight Projects by Raghib:\n1. **Personal Portfolio**: Modern responsive portfolio with dark-crimson aesthetics and AI chatbot.\n2. **SQL Data Analytics System**: Complex queries, indexing, and data modeling.\n3. **DevSphere**: Real-time developer workspace built with React & WebSockets.";
        }
        if (q.includes("contact") || q.includes("email") || q.includes("phone") || q.includes("reach")) {
            return "You can reach Md Raghib at:\n- **Email**: kraghib123@gmail.com\n- **Phone**: +91 6289007171\n- **LinkedIn**: linkedin.com/in/md~raghib\n- **GitHub**: github.com/raghib6289";
        }
        if (q.includes("certif")) {
            return "Raghib's Certifications:\n- **SQL AI Certified Developer – Associate (2026)**\n- **Azure AI Fundamentals (2025)**";
        }

        return "Sorry, I can only answer questions related to **Md Raghib's** personal background, skills, projects, and contact info! (You can also ask me to generate images by typing words like 'image', 'picture', or 'draw'!)";
    }
});

