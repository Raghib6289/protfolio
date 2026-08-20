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
Hobbies: Cricket, playing indie video games, espresso brewing, and digital illustration.

[Education]
Degree: Bachelor of Technology in Information Technology
Institution: Narula Institute of Technology
Timeline: 2024-Present
GPA: 8.5/10

[Skills]
- Frontend Development: React, TypeScript, TailwindCSS, HTML5, CSS3, JavaScript (ES6+)
- Backend & Database: SQL, PostgreSQL, MySQL, Node.js, Express.js, Python, REST APIs, WebSockets (Socket.io)
- DevOps & Cloud: Docker, Azure, Git, GitHub

[Highlight Projects]
1. Personal Portfolio Web Application (Responsive layout, dark-crimson theme, scrollSpy, dynamic typewriter animation, AI Assistant)
2. SQL Data Analytics System (Relational DB, complex JOINs, query indexing, data reports)
3. DevSphere (Real-time developer collaboration workspace built with React & WebSockets)

[Certifications]
1. SQL AI Certified Developer – Associate (2026) - Core competencies in database schemas, indexing, and complex queries.
2. Microsoft Certified: Azure AI Fundamentals (2025) - AI workloads, machine learning models, computer vision, and NLP.
3. Data Analytics Professional Certification - Data pipeline processing, visualization dashboards, and statistical modeling.
4. Deloitte Consulting Data Analytics Virtual Experience - Technology consulting business intelligence case study work.
5. GeeksforGeeks Generative AI & LLM Engineering Specialization - Large Language Models (LLMs), prompt engineering, RAG, and AI architecture.

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
  certifications: "1. SQL AI Certified Developer – Associate (2026)\n2. Azure AI Fundamentals (2025)\n3. Data Analytics Professional Certification\n4. Deloitte Consulting Data Analytics\n5. GeeksforGeeks Generative AI & LLM Engineering Specialization",
  socials: "LinkedIn: linkedin.com/in/md~raghib | GitHub: github.com/raghib6289"
};

function findAnswerLocal(query) {
  const cleanQuery = query.toLowerCase().trim().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "");

  const greetings = ['hi', 'hello', 'hey', 'greetings', 'sup', 'yo'];
  if (greetings.some(greet => cleanQuery.startsWith(greet) || cleanQuery === greet)) {
    return "Hi there! 👋 I am Md Raghib's Assistant. Ask me about Md Raghib's skills, projects, certifications, contact details, or education!";
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
    { keys: ['certif', 'certifications', 'certificate', 'credential'], answer: `Here are my 5 certifications:\n${personalDataFallback.certifications}` },
    { keys: ['contact', 'reach me', 'touch'], answer: `You can reach me via email at **${personalDataFallback.email}** or call **${personalDataFallback.phone}**.\nSocials: ${personalDataFallback.socials}` }
  ];

  for (const mapping of keywordMappings) {
    if (mapping.keys.some(k => cleanQuery.includes(k))) {
      return mapping.answer;
    }
  }

  return "Sorry, I can only answer questions related to Md Raghib's personal background, skills, projects, certifications, and contact details!";
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

  // Gemini API for Text Response
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey && apiKey.trim() !== "") {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const systemInstruction = `You are a helpful, professional AI assistant for Md Raghib.
Answer questions about Md Raghib's personal background, portfolio, education, skills, certifications, and experience.
Database:
${personalDataText}

If question is unrelated, reply: "Sorry, I can only answer questions related to Md Raghib's personal information."`;

      const geminiModel = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
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
