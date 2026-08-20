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

  // 0. Guardrail: Private, Dating, Relationship, Inappropriate, Salary, Secrets
  const offLimitsKeys = [
    'gf', 'girlfriend', 'bf', 'boyfriend', 'dating', 'relationship', 
    'single', 'married', 'marry', 'marriage', 'wife', 'husband', 'crush', 'lover', 
    'partner', 'love', 'affair', 'private', 'personal life', 'salary', 
    'income', 'net worth', 'networth', 'earn', 'earning', 'secret', 'password'
  ];

  const words = cleanQuery.split(/\s+/);
  if (offLimitsKeys.some(key => cleanQuery.includes(key) || words.includes(key))) {
    return "I can only provide information about Md Raghib's professional profile, technical skills, highlight projects, certifications, and public contact details.";
  }

  const greetings = ['hi', 'hello', 'hey', 'greetings', 'sup', 'yo', 'good morning', 'good afternoon', 'good evening'];
  if (greetings.some(greet => cleanQuery === greet || cleanQuery.startsWith(greet + " "))) {
    return "Hi there! 👋 I am Md Raghib's AI assistant. Ask me about Md Raghib's skills, projects, certifications, contact details, or education!";
  }

  const keywordMappings = [
    // 1. Technical Skills
    { 
      keys: ['skill', 'skills', 'tech', 'stack', 'technology', 'technologies', 'programming', 'languages', 'code', 'coding', 'framework', 'frameworks', 'tools', 'frontend', 'backend', 'database'], 
      answer: `Here are Md Raghib's primary technical skills:\n- **Frontend**: HTML5, CSS3, JavaScript (ES6+), React, TypeScript, TailwindCSS\n- **Backend & Database**: SQL, PostgreSQL, MySQL, Node.js, Express.js, Python, REST APIs, WebSockets\n- **DevOps & Cloud**: Docker, Azure, Git, GitHub` 
    },

    // 2. Highlight Projects
    { 
      keys: ['project', 'projects', 'portfolio', 'built', 'work', 'apps', 'applications', 'devsphere', 'sql analytics'], 
      answer: `Here are Md Raghib's highlight projects:\n1. **Personal Portfolio Web Application**: Modern responsive web app with scrollSpy, typewriter animation, and AI chatbot.\n2. **SQL Data Analytics & Query System**: Relational database schema with multi-table JOINs, indexing, and data reports.\n3. **DevSphere Workspace**: Real-time developer collaboration workspace built with React & WebSockets.` 
    },

    // 3. Education
    { 
      keys: ['education', 'college', 'university', 'degree', 'study', 'studied', 'graduated', 'academic', 'btech', 'nit', 'narula', 'school', 'stream'], 
      answer: `**Education Details**:\n- **Degree**: Bachelor of Technology (B.Tech) in Information Technology\n- **Institution**: Narula Institute of Technology\n- **Timeline**: 2024 - Present (GPA: 8.5/10)` 
    },

    // 4. Certifications
    { 
      keys: ['certif', 'certification', 'certifications', 'certificate', 'credentials', 'azure', 'deloitte', 'geeksforgeeks', 'associate'], 
      answer: `Md Raghib holds 5 key certifications:\n1. **SQL AI Certified Developer – Associate (2026)**\n2. **Microsoft Certified: Azure AI Fundamentals (2025)**\n3. **Data Analytics Professional Certification**\n4. **Deloitte Consulting Data Analytics Virtual Experience**\n5. **GeeksforGeeks Generative AI & LLM Engineering Specialization**` 
    },

    // 5. Contact & Socials
    { 
      keys: ['contact', 'email', 'mail', 'phone', 'call', 'number', 'mobile', 'reach', 'touch', 'linkedin', 'github', 'social', 'socials', 'hire'], 
      answer: `You can reach Md Raghib via:\n- **Email**: kraghib123@gmail.com\n- **Phone**: +91 6289007171\n- **LinkedIn**: linkedin.com/in/md~raghib\n- **GitHub**: github.com/raghib6289` 
    },

    // 6. Experience & Career
    { 
      keys: ['experience', 'job', 'work experience', 'career', 'freelance', 'role', 'history'], 
      answer: `Md Raghib works as an independent **Web Developer, UI Designer & SQL Database Developer** (2025-Present), creating responsive web applications and database solutions for clients and academic projects.` 
    },

    // 7. Age, Location, Hobbies
    { keys: ['location', 'address', 'live', 'city', 'kolkata', 'where'], answer: `Md Raghib is based in **Kolkata, West Bengal, India**.` },
    { keys: ['age', 'how old', 'dob', 'birthday', 'born'], answer: `Md Raghib is **22 years old** (Born December 17, 2003).` },
    { keys: ['hobby', 'hobbies', 'free time', 'leisure', 'fun', 'game', 'cricket'], answer: `Outside coding, Raghib enjoys **Cricket, indie video games, espresso brewing, and digital illustration**.` },

    // 8. Identity & Who is Md Raghib / About (Catches any general questions)
    { 
      keys: ['who is', 'who', 'raghib', 'md', 'name', 'identity', 'about', 'background', 'bio', 'intro', 'person', 'him', 'himself', 'yourself', 'who are you', 'tell me about'], 
      answer: `**Md Raghib** is a 22-year-old **Software Developer, Web Developer & Web Designer** based in Kolkata, India. He specializes in full-stack web application development, SQL database architecture, and user-centered UI/UX design.` 
    }
  ];

  for (const mapping of keywordMappings) {
    if (mapping.keys.some(k => cleanQuery.includes(k))) {
      return mapping.answer;
    }
  }

  return "I can only provide information about Md Raghib's professional profile, technical skills, highlight projects, certifications, and public contact details.";
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
Your ONLY role is to answer questions about Md Raghib's professional background, skills, portfolio projects, certifications, education, and professional contact details.

CRITICAL GUARDRAILS:
1. Do NOT answer any questions about Md Raghib's personal relationships, dating life, girlfriend/boyfriend, relationship status, family details, salary, net worth, or private personal matters.
2. If the user asks about girlfriend, dating, relationship, salary, private life, or anything unrelated to his professional portfolio, reply EXACTLY: "I can only provide information about Md Raghib's professional profile, technical skills, highlight projects, certifications, and public contact details."
3. Keep all responses professional, concise, and structured with Markdown bolding.

Database:
${personalDataText}`;

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
