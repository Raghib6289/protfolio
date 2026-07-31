const { GoogleGenerativeAI } = require('@google/generative-ai');

// Personal profile context for Gemini API
const personalDataText = `
Md Raghib - Personal Profile & Background

[Personal Information]
Name: Md Raghib
Age: 22 years old
Date of Birth: December 17, 2003
Email: kraghib123@gmail.com
Phone Number: +91 6289007171
Address: Kolkata, West Bengal, India
Career Objective: To leverage AI engineering expertise to build high-performance, user-centric web applications and microservices in a forward-thinking dev team.
Languages: English (Native) and Hindi (Conversational)

[Education]
Degree: Bachelor of Technology in Information Technology
Institution: Narula Institute of Technology
Timeline: 2024-Present
GPA: 8.5/10

[Skills]
- Frontend Development: React, TypeScript, TailwindCSS, HTML5, CSS3, JavaScript (ES6+)
- Backend Development: Node.js, Express.js, Python, PostgreSQL, MySQL, REST APIs, WebSockets (Socket.io)
- DevOps & Cloud: Docker, Azure, Git, GitHub

[Highlight Projects]
1. Personal Portfolio Web Application (Responsive layout, dark-crimson theme, scrollSpy, dynamic typewriter animation, AI Assistant)
2. SQL Data Analytics System (Relational DB, complex JOINs, query indexing, data reports)
3. DevSphere (Real-time developer collaboration workspace built with React & WebSockets)

[Certifications]
- SQL AI Certified Developer – Associate (2026)
- Azure AI Fundamentals (2025)

[Social Media Links]
- LinkedIn: linkedin.com/in/md~raghib
- GitHub: github.com/raghib6289
`;

const personalDataFallback = {
  name: "Md Raghib",
  age: "22 years old",
  dob: "December 17, 2003",
  email: "kraghib123@gmail.com",
  phone: "+91 6289007171",
  address: "Kolkata, West Bengal, India",
  education: "Bachelor of Technology in Information Technology from Narula Institute of Technology (2024-Present, GPA: 8.5/10)",
  skills: "Frontend: HTML5, CSS3, JavaScript, React, TypeScript, TailwindCSS\nBackend: SQL, PostgreSQL, MySQL, Node.js, Express, Python\nTools: Git, GitHub, Docker, Azure",
  projects: "1. Personal Portfolio Web App with AI Assistant\n2. SQL Data Analytics & Query System\n3. DevSphere Real-time Workspace",
  socials: "LinkedIn: linkedin.com/in/md~raghib | GitHub: github.com/raghib6289"
};

function findAnswerLocal(query) {
  const cleanQuery = query.toLowerCase().trim().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "");

  const greetings = ['hi', 'hello', 'hey', 'greetings', 'sup', 'yo'];
  if (greetings.some(greet => cleanQuery.startsWith(greet) || cleanQuery === greet)) {
    return "Hi there! 👋 I am Md Raghib's Assistant. Ask me about Md Raghib's skills, projects, contact details, or education!";
  }

  const keywordMappings = [
    { keys: ['name', 'who are you', 'identity', 'who is raghib'], answer: `My name is **${personalDataFallback.name}**. I am a Software Developer & Web Designer.` },
    { keys: ['age', 'how old'], answer: `I am **${personalDataFallback.age}**.` },
    { keys: ['email', 'mail'], answer: `You can reach me via email at **${personalDataFallback.email}**.` },
    { keys: ['phone', 'call', 'number', 'mobile'], answer: `My phone number is **${personalDataFallback.phone}**.` },
    { keys: ['address', 'location', 'live', 'city'], answer: `I am currently based in **${personalDataFallback.address}**.` },
    { keys: ['education', 'university', 'college', 'degree', 'study'], answer: `I am studying **${personalDataFallback.education}**.` },
    { keys: ['skills', 'skill', 'technologies', 'programming', 'stack'], answer: `Here are my core technical skills:\n${personalDataFallback.skills}` },
    { keys: ['projects', 'project', 'portfolio', 'built'], answer: `Here are my recent highlight projects:\n${personalDataFallback.projects}` },
    { keys: ['contact', 'reach me', 'touch'], answer: `You can reach me via email at **${personalDataFallback.email}** or call **${personalDataFallback.phone}**.\nSocials: ${personalDataFallback.socials}` }
  ];

  for (const mapping of keywordMappings) {
    if (mapping.keys.some(k => cleanQuery.includes(k))) {
      return mapping.answer;
    }
  }

  return "Sorry, I can only answer questions related to Md Raghib's personal background, skills, projects, and contact details!";
}

const RANDOM_PROMPTS = [
  "A futuristic cyberpunk city with neon billboards, flying vehicles, and glowing rain puddles, high detail",
  "A cozy wooden cabin nestled in a snowy mountain pine forest, soft warm light glowing from the windows, starry galaxy sky",
  "A majestic dragon made of crystals perched on a cliff under a full moon, fantasy illustration",
  "An astronaut exploring a vibrant alien jungle with bioluminescent plants, surreal sci-fi art"
];

function getRandomPrompt() {
  return RANDOM_PROMPTS[Math.floor(Math.random() * RANDOM_PROMPTS.length)];
}

function extractPrompt(message) {
  const lower = message.toLowerCase().trim();
  const prefixes = [
    'generate an image of ', 'generate image of ', 'generate a photo of ', 'generate photo of ',
    'show an image of ', 'show me an image of ', 'draw an image of ', 'draw a ', 'draw ',
    'create an image of ', 'generate ', 'picture of ', 'photo of ', 'image of ', 'visual of '
  ];
  let cleaned = lower;
  for (const prefix of prefixes) {
    if (cleaned.startsWith(prefix)) {
      cleaned = cleaned.substring(prefix.length).trim();
      break;
    }
  }
  return cleaned.length > 0 && cleaned !== 'image' && cleaned !== '/image' ? cleaned : getRandomPrompt();
}

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { message } = req.body || {};
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: "Invalid message payload" });
  }

  const lowerMessage = message.toLowerCase().trim();
  const visualKeywords = ['image', 'photo', 'picture', 'pic', 'visual', 'draw', 'paint', 'illustration', 'artwork', 'sketch', 'render', 'wallpaper', 'generate'];
  const isImageRequest = visualKeywords.some(kw => lowerMessage.includes(kw)) && !lowerMessage.includes('how to');

  if (isImageRequest) {
    const rawPrompt = extractPrompt(message);
    const enhancedPrompt = (rawPrompt.toLowerCase().includes('3d') || rawPrompt.toLowerCase().includes('4k'))
      ? `${rawPrompt}, octane render, 4k resolution, ray tracing, ultra detailed`
      : `${rawPrompt}, 3d render, 4k ultra hd, photorealistic, octane render, ray tracing, cinematic lighting, highly detailed`;
    try {
      const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(enhancedPrompt)}?width=1024&height=1024&model=flux&enhance=true&nologo=true&seed=${Math.floor(Math.random() * 1000000)}`;
      return res.status(200).json({
        response: "Here is your 3D 4K ultra high-quality generated image! 🎨✨",
        image: imageUrl
      });
    } catch (err) {
      return res.status(500).json({ error: "Failed to generate image" });
    }
  }

  // Gemini API
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey && apiKey.trim() !== "") {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const systemInstruction = `You are a helpful, professional AI assistant for Md Raghib.
Answer questions about Md Raghib's personal background, portfolio, education, skills, and experience.
Database:
${personalDataText}

If question is unrelated, reply: "Sorry, I can only answer questions related to Md Raghib's personal information."`;

      const geminiModel = genAI.getGenerativeModel({
        model: "gemini-3.1-flash-lite",
        systemInstruction: systemInstruction
      });

      const result = await geminiModel.generateContent(message);
      const responseText = result.response.text();
      return res.status(200).json({ response: responseText.trim() });
    } catch (err) {
      console.error("Gemini Vercel API call failed:", err.message);
    }
  }

  const fallback = findAnswerLocal(message);
  return res.status(200).json({ response: fallback });
};
