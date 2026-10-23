import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // Setup Gemini AI client on server side if key is present
  const apiKey = process.env.GEMINI_API_KEY;
  let ai: GoogleGenAI | null = null;
  if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }

  // POST /api/generate-portrait
  // Generates a cartoon/video-game-style fantasy portrait matching character's name and class
  app.post('/api/generate-portrait', async (req, res) => {
    try {
      const { characterName, characterClass, race, variation } = req.body;
      const variationNum = Number(variation) || 1;

      console.log(`Generating portrait for ${characterName} (${characterClass}), variation ${variationNum}`);

      if (ai) {
        try {
          const prompt = `Stylized vibrant cartoon video game portrait of a fantasy ${characterClass || 'Hero'} named ${characterName || 'Hero'}, ${race || 'champion'} ancestry, bold colorful outlines, World of Warcraft and Overwatch inspired animated game concept art, dynamic lighting, game icon square avatar, variation ${variationNum}`;

          const response = await ai.models.generateContent({
            model: 'gemini-3.1-flash-lite-image',
            contents: {
              parts: [{ text: prompt }],
            },
            config: {
              imageConfig: {
                aspectRatio: '1:1',
              },
            },
          });

          if (response.candidates?.[0]?.content?.parts) {
            for (const part of response.candidates[0].content.parts) {
              if (part.inlineData?.data) {
                const mimeType = part.inlineData.mimeType || 'image/png';
                const base64Url = `data:${mimeType};base64,${part.inlineData.data}`;
                return res.json({
                  success: true,
                  source: 'gemini',
                  imageUrl: base64Url,
                  variation: variationNum,
                });
              }
            }
          }
        } catch (geminiError: any) {
          console.warn('Gemini image generation warning, falling back to curated cartoon art:', geminiError?.message || geminiError);
        }
      }

      // Fallback signal indicating client to use rich curated cartoon video-game asset
      return res.json({
        success: true,
        source: 'curated_cartoon',
        characterClass,
        variation: variationNum,
      });
    } catch (err: any) {
      console.error('Server generate-portrait error:', err);
      return res.status(500).json({ error: err.message || 'Internal error generating portrait' });
    }
  });

  // POST /api/generate-backstory
  // Generates a unique 1-2 sentence origin story for the currently displayed character
  app.post('/api/generate-backstory', async (req, res) => {
    try {
      const { characterName, characterClass, race } = req.body;

      if (!characterName || !characterClass) {
        return res.status(400).json({ error: 'characterName and characterClass are required' });
      }

      if (ai) {
        try {
          const prompt = `Write a compelling, unique one-to-two-sentence fantasy origin backstory for a ${characterClass} named "${characterName}" of ${race || 'mortal'} ancestry.
Rules:
- Must incorporate both the character's name ("${characterName}") and class ("${characterClass}") naturally.
- Strictly 1 to 2 sentences total.
- Rich atmospheric fantasy tone (swords, sorcery, ancient oaths, mysterious ruins, or celestial powers).
- Return only the story text with no quotes, greetings, or prefixes.`;

          const response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: prompt,
          });

          const text = response.text?.trim();
          if (text) {
            return res.json({
              success: true,
              source: 'gemini',
              backstory: text.replace(/^["']|["']$/g, ''),
            });
          }
        } catch (geminiError: any) {
          console.warn('Gemini backstory generation fallback:', geminiError?.message || geminiError);
        }
      }

      return res.json({
        success: false,
        fallbackNeeded: true,
      });
    } catch (err: any) {
      console.error('Backstory generation error:', err);
      return res.status(500).json({ error: err.message || 'Failed to generate backstory' });
    }
  });

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      hasGeminiKey: Boolean(apiKey && apiKey !== 'MY_GEMINI_API_KEY'),
    });
  });

  // Mount Vite or static dist
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Fantasy Character Creator Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
