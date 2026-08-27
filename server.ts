import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Lazy-initialized Gemini API client
let aiInstance: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  if (!aiInstance && process.env.GEMINI_API_KEY) {
    try {
      aiInstance = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    } catch (e) {
      console.warn('Failed to initialize GoogleGenAI client:', e);
    }
  }
  return aiInstance;
}

// 1. Context-Aware Chat Assistant Route
app.post('/api/gemini/chat', async (req, res) => {
  try {
    const { message, event } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const ai = getGeminiClient();
    if (!ai) {
      // Graceful fallback response
      return res.json({
        reply: `I received your message: "${message}". The active event is "${event?.name || 'Party'}". You can navigate to Budget, Guests, Shopping List, Venue, or Calendar using the navigation bar.`,
        suggestedPrompts: ['Show my budget', 'Show my guests', 'Where is my venue?', 'Show my shopping list'],
      });
    }

    const systemPrompt = `You are the CymbalMart AI Party Planner & Shopping Assistant Application Controller.
You help hosts plan, budget, shop, and organize events.
Current Active Event Context:
- Name: ${event?.name || 'Celebration'}
- Type: ${event?.type || 'Party'}
- Theme: ${event?.theme || 'Fun'}
- Guests: ${event?.guestCount || 20}
- Date: ${event?.eventDate || 'Upcoming'}
- Budget: ₹${event?.budget || 10000}
- Items Count: ${event?.shoppingItems?.length || 0}
- Venue: ${event?.venue?.name || 'Private Venue'} (${event?.venue?.city || 'Mumbai'})

Respond concisely, helpfully, and with clear event domain knowledge.
If the host is asking to view or edit specific data, recommend the canonical section.
Return a JSON object matching this schema:
{
  "reply": "Conversational helpful answer or operational confirmation",
  "targetTab": "dashboard" | "planner" | "shopping" | "budget" | "guests" | "invitations" | "venue" | "calendar" | "final-review" | null,
  "suggestedPrompts": ["string", "string", "string"]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: message,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      },
    });

    const text = response.text?.trim() || '{}';
    let parsed: any;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = { reply: text };
    }

    return res.json(parsed);
  } catch (error: any) {
    console.error('Gemini chat error:', error);
    return res.json({
      reply: "I'm currently assisting with your party plan. You can ask me to navigate to budget, guests, shopping list, or venue.",
      suggestedPrompts: ['Show my budget', 'Show my guests', 'Where is my venue?', 'Show my shopping list'],
    });
  }
});

// 2. AI Structured Party Builder Route
app.post('/api/gemini/parse-plan', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.json({
        name: prompt.slice(0, 40) + ' Celebration',
        type: 'Birthday Party',
        theme: prompt.slice(0, 30),
        guestCount: 20,
        budget: 10000,
        ageGroup: 'All Ages',
        isOutdoor: false,
        dietaryPreferences: ['Vegetarian'],
      });
    }

    const systemPrompt = `Extract structured party parameters from user's event description.
Return a JSON object with:
- name (string)
- type (one of: 'Birthday Party', "Children's Birthday Party", 'Corporate Team Event', 'Wedding Reception', 'Anniversary', 'Baby Shower', 'Housewarming', 'Graduation Party', 'Festival Celebration', 'Outdoor BBQ / Picnic', 'Custom Celebration')
- theme (string)
- guestCount (number)
- budget (number in INR)
- ageGroup (one of: 'Kids (0-12)', 'Teens (13-17)', 'Adults (18+)', 'All Ages', 'Corporate')
- isOutdoor (boolean)
- dietaryPreferences (array of strings)`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    return res.json(parsed);
  } catch (error) {
    console.error('Gemini parse plan error:', error);
    return res.status(500).json({ error: 'Failed to parse plan' });
  }
});

// 3. AI Personalized Invitation Generator Route
app.post('/api/gemini/personalized-invitation', async (req, res) => {
  try {
    const { guestName, event } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        invitationText: `🎉 You're Invited!\n\nDear ${guestName},\n\nYou are warmly invited to celebrate ${event.name} on ${event.eventDate} at ${event.startTime} at ${event.venue?.name || 'our venue'}.\n\nTheme: ${event.theme}\n\nPlease RSVP to confirm your attendance!`,
      });
    }

    const prompt = `Write an elegant, warm, highly personalized event invitation message for guest "${guestName}".
Event Details:
- Name: ${event.name}
- Theme: ${event.theme}
- Date: ${event.eventDate}
- Time: ${event.startTime} - ${event.endTime}
- Venue: ${event.venue?.name} (${event.venue?.address || event.venue?.city || ''})

Include friendly host enthusiasm, date, time, venue address, and clear RSVP request. Return JSON with key "invitationText".`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    return res.json(parsed);
  } catch (error) {
    console.error('Gemini invite generator error:', error);
    return res.json({
      invitationText: `Dear ${req.body.guestName},\n\nYou are cordially invited to ${req.body.event?.name || 'our celebration'}!`,
    });
  }
});

// Production / Dev Vite static integration
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
} else {
  // In development, let Vite handle frontend routing
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`CymbalMart AI Party Planner server running on port ${PORT}`);
});
