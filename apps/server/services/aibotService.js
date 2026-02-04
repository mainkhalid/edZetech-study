const axios = require('axios');
const Programme = require('../models/Programme');
const Faq = require('../models/Faq');
const Timetable = require('../models/Timetable');

class AIBotService {
  constructor() {
    this.apiKey = process.env.OPENROUTER_API_KEY;
    this.apiUrl = 'https://openrouter.ai/api/v1/chat/completions';
    this.model = "tngtech/deepseek-r1t2-chimera:free"
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

  async getTimetableInfo() {
    try {
      // Get all published timetables with metadata
      const timetables = await Timetable.find({ status: 'published' })
        .select('school schoolName academicYear semester metadata uploadDate')
        .lean();

      // Get unique schools and their timetable availability
      const timetableAvailability = timetables.map(t => ({
        school: t.schoolName,
        academicYear: t.academicYear,
        semester: t.semester,
        totalSessions: t.metadata?.totalSessions || 0,
        uniqueUnits: t.metadata?.uniqueUnits?.length || 0,
        lecturers: t.metadata?.lecturers?.length || 0,
        rooms: t.metadata?.rooms?.length || 0
      }));

      return {
        available: timetables.length > 0,
        timetables: timetableAvailability,
        schools: [...new Set(timetables.map(t => t.schoolName))]
      };
    } catch (err) {
      console.error('Timetable info error:', err);
      return { available: false, timetables: [], schools: [] };
    }
  }

  async searchTimetable(query) {
    try {
      
      const queryLower = query.toLowerCase();

      const unitCodeMatch = query.match(/\b([A-Z]{2,3})\s*(\d{2,3})\b/i);
      
      let searchResults = [];

      if (unitCodeMatch) {
        const unitCode = `${unitCodeMatch[1].toUpperCase()} ${unitCodeMatch[2]}`;
        const timetables = await Timetable.find({ 
          status: 'published',
          'sessions.unitCode': unitCode
        }).lean();

        timetables.forEach(tt => {
          const sessions = tt.sessions.filter(s => s.unitCode === unitCode);
          searchResults.push(...sessions.map(s => ({
            ...s,
            school: tt.schoolName,
            academicYear: tt.academicYear,
            semester: tt.semester
          })));
        });
      } else if (queryLower.includes('lecturer') || queryLower.includes('teacher')) {
        // Try to extract lecturer name
        const nameMatch = query.match(/(?:lecturer|teacher|dr\.|prof\.|mr\.|mrs\.|ms\.)\s+([a-z\s]+)/i);
        if (nameMatch) {
          const lecturerName = nameMatch[1].trim();
          const timetables = await Timetable.find({ status: 'published' }).lean();
          
          timetables.forEach(tt => {
            const sessions = tt.sessions.filter(s => 
              s.lecName.toLowerCase().includes(lecturerName.toLowerCase())
            );
            searchResults.push(...sessions.slice(0, 5).map(s => ({
              ...s,
              school: tt.schoolName,
              academicYear: tt.academicYear,
              semester: tt.semester
            })));
          });
        }
      } else if (queryLower.includes('room') || queryLower.includes('venue')) {
        // Try to extract room
        const roomMatch = query.match(/\b([AL]\d+)\b/i);
        if (roomMatch) {
          const room = roomMatch[1].toUpperCase();
          const timetables = await Timetable.find({ 
            status: 'published',
            'sessions.room': room
          }).lean();
          
          timetables.forEach(tt => {
            const sessions = tt.sessions.filter(s => s.room === room);
            searchResults.push(...sessions.slice(0, 5).map(s => ({
              ...s,
              school: tt.schoolName,
              academicYear: tt.academicYear,
              semester: tt.semester
            })));
          });
        }
      }

      return searchResults;
    } catch (err) {
      console.error('Timetable search error:', err);
      return [];
    }
  }
 
  formatArray(field) {
    if (!field) return 'N/A';
    if (Array.isArray(field)) return field.join(', ');
    return String(field);
  }

  /* system prompt */
  async createSystemPrompt(programmes, faqs, timetableInfo) {
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

    // Format timetable 
    let timetableSection = '';
    if (timetableInfo.available) {
      const timetableSummary = timetableInfo.timetables.map(t => 
        `- ${t.school}: ${t.academicYear}, ${t.semester} (${t.totalSessions} sessions, ${t.uniqueUnits} units)`
      ).join('\n');

      timetableSection = `
====================================
AVAILABLE TIMETABLES
====================================

Timetable data is available for the following:

${timetableSummary}

Schools with timetables: ${timetableInfo.schools.join(', ')}

You can help students:
- Find class schedules by unit code (e.g., "When is BAC 111?")
- Check lecturer schedules (e.g., "Show Dr. Smith's classes")
- Find room schedules (e.g., "What's in room A103?")
- Check specific day schedules (e.g., "My Monday classes")
`;
    } else {
      timetableSection = `
====================================
TIMETABLES
====================================

Timetable information is currently not available. Advise students to:
1. Check the student portal
2. Contact their department
3. Visit the academic office
`;
    }

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
- Help students find their class schedules quickly
- Provide timetable information for units, lecturers, and rooms

====================================
AVAILABLE PROGRAMMES
====================================

${programmeList}

====================================
FREQUENTLY ASKED QUESTIONS
====================================

${faqList}

${timetableSection}

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

For Timetable Questions:
- Recognize queries about class schedules
- Format: "**Unit Code**: Day, Time (Room)"
- Example: "**BAC 111**: Monday, 11:00-14:00 (Room A103)"
- Show lecturer name when relevant
- Group by day if multiple sessions
- If no results, suggest checking unit code spelling

Style:
- Keep replies clear and short
- Use bullet points for lists
- Highlight programme names in bold
- Use emojis sparingly (🎓 📚 📅 🏫 ⏰)
- Do NOT use unnecessary symbols or filler text

====================================
TIMETABLE QUERY EXAMPLES
====================================

Student: "When is my BAC 111 class?"
You: "**BAC 111** (Financial Accounting 1)
📅 Monday: 11:00-14:00 (Room A103)
👨‍🏫 Lecturer: Phineas Mutwiri"

Student: "Show me Dr. Smith's schedule"
You: "**Dr. Smith's Classes:**
📅 Monday: BAC 111, 11:00-14:00 (A103)
📅 Wednesday: BAC 121, 14:00-17:00 (L205)"

Student: "What classes are in room A103?"
You: "**Room A103 Schedule:**
📅 Monday: BAC 111 (11:00-14:00)
📅 Thursday: BEC 111 (08:00-11:00)"

====================================
INFORMATION RULES
====================================

- Only use information from the database
- Never guess or invent data
- If info is missing, say so clearly
- Always mention programme codes
- Do not guarantee admission
- For timetables, always verify unit codes are exact
- Suggest portal if timetable not found

====================================
RESPONSE BEHAVIOUR
====================================

- Recommend 2–4 relevant programmes
- Ask at most 1 clarifying question
- Offer help with application steps
- Suggest alternatives if few results
- For timetable queries, be quick and precise
- If timetable unavailable, guide to alternative resources

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

For Timetable questions:
- Show day, time, room clearly
- Include lecturer name
- Format times as HH:MM
- Use 24-hour format
- Group multiple sessions by day

====================================

Remember: Help students make confident academic decisions and find their classes quickly.
`;
  }

  /*chat*/
  async chat(message, history = []) {
    try {
      const isTimetableQuery = /\b(class|lesson|timetable|schedule|unit|lecturer|teacher|room|venue|when|where|time)\b/i.test(message);
      
      let timetableResults = [];
      if (isTimetableQuery) {
        timetableResults = await this.searchTimetable(message);
      }

      const [programmes, faqs, timetableInfo] = await Promise.all([
        this.getProgrammes(),
        this.getFaqs(),
        this.getTimetableInfo()
      ]);

      const systemPrompt = await this.createSystemPrompt(programmes, faqs, timetableInfo);

      // Add timetable results to the message if found
      let enhancedMessage = message;
      if (timetableResults.length > 0) {
        const resultsText = timetableResults.map(s => 
          `${s.unitCode} (${s.unitTitle}) - ${s.day}, ${s.startTime}-${s.endTime}, Room: ${s.room}, Lecturer: ${s.lecName}`
        ).join('\n');
        enhancedMessage = `${message}\n\n[Timetable Search Results Found]:\n${resultsText}`;
      }

      const messages = [
        { role: 'system', content: systemPrompt },
        ...history,
        { role: 'user', content: enhancedMessage }
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
        faqs: faqs.slice(0, 3),
        timetableResults: timetableResults.slice(0, 5) 
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

  /*quick actions*/
  async getQuickActions() {
    return [
      { id: 'cert', text: 'Certificates', query: 'Show certificate programmes' },
      { id: 'dip', text: 'Diplomas', query: 'Show diploma programmes' },
      { id: 'deg', text: 'Degrees', query: 'Show degree programmes' },
      { id: 'apply', text: 'How to Apply', query: 'How do I apply?' },
      { id: 'req', text: 'Requirements', query: 'Entry requirements' },
      { id: 'timetable', text: '📅 My Timetable', query: 'Show my class schedule' },
      { id: 'contact', text: 'Contact', query: 'How can I contact admissions?' }
    ];
  }
}

module.exports = new AIBotService();