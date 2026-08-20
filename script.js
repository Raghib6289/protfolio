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

    // Contact Form Submission to kraghib123@gmail.com & Thank You Modal
    const contactForm = document.getElementById("contact-form");
    const thankyouModal = document.getElementById("thankyou-modal");
    const contactSubmitBtn = document.getElementById("contact-submit-btn");

    if (contactForm) {
        contactForm.addEventListener("submit", function (e) {
            e.preventDefault();

            if (contactSubmitBtn) {
                contactSubmitBtn.value = "Sending...";
                contactSubmitBtn.disabled = true;
            }

            const formData = new FormData(contactForm);

            fetch("https://formsubmit.co/ajax/kraghib123@gmail.com", {
                method: "POST",
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
                .then(response => response.json())
                .then(data => {
                    showThankYouModal();
                    contactForm.reset();
                })
                .catch(error => {
                    showThankYouModal();
                    contactForm.reset();
                })
                .finally(() => {
                    if (contactSubmitBtn) {
                        contactSubmitBtn.value = "Send Message";
                        contactSubmitBtn.disabled = false;
                    }
                });
        });
    }

    function showThankYouModal() {
        if (thankyouModal) {
            thankyouModal.classList.add("active");
            setTimeout(() => {
                thankyouModal.classList.remove("active");
            }, 3000); // Auto close within 3 seconds
        }
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
                appendMessage(data.response, "bot");
            } else {
                // Fallback to local heuristic engine
                const fallbackReply = generateLocalResponse(message);
                appendMessage(fallbackReply, "bot");
            }
        } catch (err) {
            console.log("Server API offline. Using local client fallback AI engine.");
            removeThinkingIndicator(thinkingId);
            const fallbackReply = generateLocalResponse(message);
            appendMessage(fallbackReply, "bot");
        }

        scrollToBottom();
    }

    function appendMessage(text, sender) {
        const msgDiv = document.createElement("div");
        msgDiv.classList.add("chat-message", `${sender}-message`);

        let formattedText = text ? formatMarkdown(text) : "";

        if (sender === "bot") {
            let textHTML = formattedText.trim() ? `<p>${formattedText}</p>` : "";
            msgDiv.innerHTML = `
                <i class="fa-solid fa-wand-magic-sparkles bot-icon"></i>
                <div class="message-content">
                    ${textHTML}
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
        if (!str) return "";
        return str.replace(/[&<>'"]/g, 
            tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
        );
    }

    function formatMarkdown(text) {
        if (!text) return "";
        let formatted = escapeHTML(text);
        // Bold: **text**
        formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        // Newlines to linebreaks
        formatted = formatted.replace(/\n/g, '<br>');
        return formatted;
    }

    // Client-side Heuristic Knowledge Engine (Fallbacks when server endpoint is offline)
    function generateLocalResponse(query) {
        const q = query.toLowerCase().trim().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "");

        // Guardrail: Private / Dating / Relationship / Salary / Off-limits
        const offLimits = [
            'gf', 'girlfriend', 'bf', 'boyfriend', 'dating', 'relationship', 
            'single', 'married', 'marry', 'marriage', 'wife', 'husband', 'crush', 'lover', 
            'partner', 'love', 'affair', 'private', 'personal life', 'salary', 
            'income', 'net worth', 'networth', 'earn', 'earning', 'secret', 'password'
        ];

        const words = q.split(/\s+/);
        if (offLimits.some(key => q.includes(key) || words.includes(key))) {
            return "I can only provide information about Md Raghib's professional profile, technical skills, highlight projects, certifications, and public contact details.";
        }

        if (q === "hi" || q === "hello" || q === "hey" || q.startsWith("hi ") || q.startsWith("hello ")) {
            return "Hi there! 👋 How can I help you regarding **Md Raghib's** background, skills, or portfolio?";
        }
        if (q.includes("skill") || q.includes("tech") || q.includes("stack") || q.includes("code") || q.includes("programming")) {
            return "Here are Raghib's primary skills:\n- **Frontend**: HTML5, CSS3, JavaScript (ES6+), React, TypeScript, TailwindCSS\n- **Backend & Database**: SQL, PostgreSQL, MySQL, Node.js, Express, Python\n- **Tools**: Git, GitHub, Docker, Azure";
        }
        if (q.includes("education") || q.includes("college") || q.includes("degree") || q.includes("study") || q.includes("studied")) {
            return "Raghib is currently pursuing his **B.Tech in Information Technology** at Narula Institute of Technology (2024-Present, GPA: 8.5/10).";
        }
        if (q.includes("project") || q.includes("portfolio") || q.includes("built") || q.includes("apps")) {
            return "Highlight Projects by Raghib:\n1. **Personal Portfolio**: Modern responsive portfolio with dark-crimson aesthetics and AI chatbot.\n2. **SQL Data Analytics System**: Complex queries, indexing, and data modeling.\n3. **DevSphere**: Real-time developer workspace built with React & WebSockets.";
        }
        if (q.includes("contact") || q.includes("email") || q.includes("phone") || q.includes("reach") || q.includes("linkedin") || q.includes("github")) {
            return "You can reach Md Raghib at:\n- **Email**: kraghib123@gmail.com\n- **Phone**: +91 6289007171\n- **LinkedIn**: linkedin.com/in/md~raghib\n- **GitHub**: github.com/raghib6289";
        }
        if (q.includes("certif")) {
            return "Raghib's 5 Certifications:\n1. **SQL AI Certified Developer – Associate (2026)**\n2. **Microsoft Certified: Azure AI Fundamentals (2025)**\n3. **Data Analytics Professional Certification**\n4. **Deloitte Consulting Data Analytics Virtual Experience**\n5. **GeeksforGeeks Generative AI & LLM Engineering Specialization**";
        }
        if (q.includes("who") || q.includes("raghib") || q.includes("md") || q.includes("about") || q.includes("name") || q.includes("background") || q.includes("bio")) {
            return "<strong>Md Raghib</strong> is a 22-year-old **Software Developer, Web Developer & Web Designer** based in Kolkata, India. He builds responsive, scalable web applications and user-centered solutions.";
        }

        return "I can only provide information about Md Raghib's professional profile, technical skills, highlight projects, certifications, and public contact details.";
    }

    // Certifications Continuous Floating Horizontal Slider Logic
    const certiTrack = document.getElementById("certi-track");
    const certiCards = document.querySelectorAll(".certi-card");
    const prevBtn = document.getElementById("certi-prev-btn");
    const nextBtn = document.getElementById("certi-next-btn");
    const sliderContainer = document.getElementById("certi-slider-container");

    if (certiTrack && certiCards.length > 0) {
        let currentCertiIndex = 0;
        let autoSlideInterval = null;
        const slideDelay = 3000; // 3 seconds continuous float

        function getVisibleCardsCount() {
            if (window.innerWidth <= 768) return 1;
            if (window.innerWidth <= 1100) return 2;
            return 3;
        }

        function getMaxIndex() {
            const visible = getVisibleCardsCount();
            return Math.max(0, certiCards.length - visible);
        }

        function updateSliderPosition() {
            const maxIndex = getMaxIndex();
            if (currentCertiIndex > maxIndex) {
                currentCertiIndex = 0;
            } else if (currentCertiIndex < 0) {
                currentCertiIndex = maxIndex;
            }

            const visible = getVisibleCardsCount();
            if (visible === 1) {
                certiTrack.style.transform = `translateX(-${currentCertiIndex * 100}%)`;
            } else {
                const firstCard = certiCards[0];
                const cardWidth = firstCard.offsetWidth;
                const style = window.getComputedStyle(certiTrack);
                const gap = parseFloat(style.gap) || 25;
                const moveDistance = currentCertiIndex * (cardWidth + gap);
                certiTrack.style.transform = `translateX(-${moveDistance}px)`;
            }
        }

        function nextSlide() {
            const maxIndex = getMaxIndex();
            if (currentCertiIndex >= maxIndex) {
                currentCertiIndex = 0;
            } else {
                currentCertiIndex++;
            }
            updateSliderPosition();
        }

        function prevSlide() {
            const maxIndex = getMaxIndex();
            if (currentCertiIndex <= 0) {
                currentCertiIndex = maxIndex;
            } else {
                currentCertiIndex--;
            }
            updateSliderPosition();
        }

        function startAutoSlide() {
            if (!autoSlideInterval) {
                autoSlideInterval = setInterval(nextSlide, slideDelay);
            }
        }

        function stopAutoSlide() {
            if (autoSlideInterval) {
                clearInterval(autoSlideInterval);
                autoSlideInterval = null;
            }
        }

        if (nextBtn) {
            nextBtn.addEventListener("click", () => {
                nextSlide();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener("click", () => {
                prevSlide();
            });
        }

        // Auto pause on hover for easy reading
        if (sliderContainer) {
            sliderContainer.addEventListener("mouseenter", () => {
                stopAutoSlide();
            });

            sliderContainer.addEventListener("mouseleave", () => {
                startAutoSlide();
            });
        }

        window.addEventListener("resize", () => {
            updateSliderPosition();
        });

        // Initialize Continuous Floating Slider
        startAutoSlide();
    }
});

