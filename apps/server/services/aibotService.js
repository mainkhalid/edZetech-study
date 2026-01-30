const axios = require('axios');
const Programme = require('../models/Programme');
const Faq = require('../models/Faq');

class AIBotService {
  constructor() {
    this.apiKey = process.env.OPENROUTER_API_KEY;
    this.apiUrl = 'https://openrouter.ai/api/v1/chat/completions';
    this.model = "tngtech/deepseek-r1t2-chimera:free";
  }


  async getProgrammes() {
    try {
      return await Programme.find({ isActive: true })
        .populate('school', 'name code')
        .lean();
    } catch (err) {
      console.error('Programme error:', err);
      return [];
    }
  }

  async getFaqs() {
    try {
      return await Faq.find({ status: 'published' })
        .limit(10)
        .lean();
    } catch (err) {
      console.error('FAQ error:', err);
      return [];
    }
  }

 
  formatArray(field) {
    if (!field) return 'N/A';
    if (Array.isArray(field)) return field.join(', ');
    return String(field);
  }

  /* system prompt */
  createSystemPrompt(programmes, faqs) {

    const programmeList = programmes.slice(0, 12).map(p => `
${p.name} (${p.code})
- Level: ${p.level}
- School: ${p.school?.name || 'N/A'}
- Duration: ${p.duration?.years || 'N/A'} Years
- Study Modes: ${this.formatArray(p.studyMode)}
- Campuses: ${this.formatArray(p.campuses)}
- Entry Grade: ${p.entryRequirements?.minimumGrade || 'N/A'}
    `.trim()).join('\n\n');

    const faqList = faqs.map(f =>
      `Q: ${f.question}\nA: ${f.answer}`
    ).join('\n\n');

    return `
You are **Zetech AI Assistant**, an official academic advisor for Zetech University, Kenya.

====================================
YOUR ROLE
====================================

- Guide students in choosing the right programme
- Explain admission requirements
- Provide accurate programme information
- Assist with application guidance
- Answer frequently asked questions

====================================
AVAILABLE PROGRAMMES
====================================

${programmeList}

====================================
FREQUENTLY ASKED QUESTIONS
====================================

${faqList}

====================================
COMMUNICATION GUIDELINES
====================================

Tone:
- Friendly
- Professional
- Supportive
- Encouraging

Clarity Rules (VERY IMPORTANT):
- Always answer in a simple, structured way
- Never mix different topics in one reply
- Never give incomplete instructions
- Avoid long paragraphs

Response Format:

For "How to" questions:
1. Start with a clear title
2. Give step-by-step instructions
3. End with where to get help

Example:
Title: How to Sync Units

Steps:
1. Log in to the Student Portal
2. Go to the Units section
3. Click "Sync Units"
4. Wait for confirmation

If it fails, contact ICT support.

For Information questions:
- Give the main answer first
- Then list extra details in bullets

For Programme Recommendations:
- List 2–4 programmes
- Include name, code, and level
- Give a short reason for each

Style:
- Keep replies clear and short
- Use bullet points for lists
- Highlight programme names in bold
- Use emojis sparingly (🎓 📚 📝)
- Do NOT use unnecessary symbols or filler text

INFORMATION RULES
====================================

- Only use information from the database
- Never guess or invent data
- If info is missing, say so clearly
- Always mention programme codes
- Do not guarantee admission

====================================
RESPONSE BEHAVIOUR
====================================

- Recommend 2–4 relevant programmes
- Ask at most 1 clarifying question
- Offer help with application steps
- Suggest alternatives if few results

====================================
SPECIAL INSTRUCTIONS
====================================

For "Apply" questions:
- Explain steps clearly
- List required documents
- Encourage contacting admissions

For Grade questions:
- Match student grades correctly
- Suggest progression routes

For Career questions:
- Focus on practical outcomes

====================================

Remember: Help students make confident academic decisions.
`;
  }

  /*chat*/
  async chat(message, history = []) {
    try {

      const [programmes, faqs] = await Promise.all([
        this.getProgrammes(),
        this.getFaqs()
      ]);

      const systemPrompt = this.createSystemPrompt(programmes, faqs);

      const messages = [
        { role: 'system', content: systemPrompt },
        ...history,
        { role: 'user', content: message }
      ];

      const response = await axios.post(
        this.apiUrl,
        {
          model: this.model,
          messages,
          temperature: 0.7,
          max_tokens: 900
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        response: response.data.choices[0].message.content,
        programmes: programmes.slice(0, 5),
        faqs: faqs.slice(0, 3)
      };

    } catch (err) {
      console.error('AI Error:', err.response?.data || err.message);

      return {
        response:
          "I'm currently experiencing technical difficulties. Please try again shortly.",
        error: true
      };
    }
  }

 /*quickk actions*/
   async getQuickActions() {
    return [
      { id: 'cert', text: 'Certificates', query: 'Show certificate programmes' },
      { id: 'dip', text: ' Diplomas', query: 'Show diploma programmes' },
      { id: 'deg', text: ' Degrees', query: 'Show degree programmes' },
      { id: 'apply', text: ' How to Apply', query: 'How do I apply?' },
      { id: 'req', text: 'Requirements', query: 'Entry requirements' },
      { id: 'contact', text: ' Contact', query: 'How can I contact admissions?' }
    ];
  }
}

module.exports = new AIBotService();
