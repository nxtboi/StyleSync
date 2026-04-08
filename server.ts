import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // API Routes
  app.post("/api/gemini", async (req, res) => {
    try {
      const { type, payload } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        return res.status(500).json({ error: "GEMINI_API_KEY is not configured" });
      }

      const ai = new GoogleGenAI({ apiKey });

      if (type === 'analyze-style') {
        const { image } = payload;
        const base64Data = image.split(',')[1];

        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: [
            {
              parts: [
                {
                  inlineData: {
                    mimeType: "image/jpeg",
                    data: base64Data,
                  },
                },
                {
                  text: `Analyze this person's physical characteristics (skin tone, body shape, face shape) and suggest the best-suited clothes and accessories. 
                  Provide suggestions from different platforms like Myntra, Ajio, Amazon, Flipkart, and Nykaa.
                  Return the response in JSON format with the following structure:
                  {
                    "skinTone": "description",
                    "bodyShape": "description",
                    "faceShape": "description",
                    "styleProfile": "overall style recommendation",
                    "suggestions": [
                      {
                        "item": "name of item",
                        "reason": "why it suits them",
                        "platform": "Myntra/Ajio/Amazon/Flipkart/Nykaa",
                        "url": "a search URL on that platform for that item",
                        "category": "Clothing/Accessory"
                      }
                    ]
                  }`,
                },
              ],
            },
          ],
          config: {
            responseMimeType: "application/json",
          },
        });

        const text = response.text || "";
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        return res.json(JSON.parse(jsonMatch ? jsonMatch[0] : text));
      }

      if (type === 'studio-generate') {
        const { prompt, baseImage } = payload;
        
        const parts: any[] = [{ text: prompt }];
        if (baseImage) {
          parts.unshift({
            inlineData: {
              data: baseImage.data,
              mimeType: baseImage.mimeType
            }
          });
        }

        const response = await ai.models.generateContent({
          model: "gemini-3.1-flash-image-preview",
          contents: { parts },
          config: {
            imageConfig: {
              aspectRatio: "1:1",
              imageSize: "1K"
            }
          }
        });
        
        let generatedImage = null;
        if (response.candidates?.[0]?.content?.parts) {
          for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
              generatedImage = part.inlineData.data;
            }
          }
        }

        return res.json({ 
          text: response.text,
          image: generatedImage 
        });
      }

      if (type === 'try-on') {
        const { userImage, outfitImage } = payload;

        const tryOnResponse = await ai.models.generateContent({
          model: "gemini-2.5-flash-image",
          contents: {
            parts: [
              { inlineData: { data: userImage.data, mimeType: userImage.mimeType } },
              { inlineData: { data: outfitImage.data, mimeType: outfitImage.mimeType } },
              { text: "Generate a realistic image of the person wearing this outfit. Add matching accessories." }
            ]
          }
        });

        let generatedImage = null;
        if (tryOnResponse.candidates?.[0]?.content?.parts) {
          for (const part of tryOnResponse.candidates[0].content.parts) {
            if (part.inlineData) {
              generatedImage = part.inlineData.data;
            }
          }
        }

        const analysisResponse = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: [
            {
              parts: [
                { inlineData: { data: outfitImage.data, mimeType: outfitImage.mimeType } },
                { text: "Identify the clothing and suggest accessories. Return JSON with 'items' array." }
              ]
            }
          ],
          config: { responseMimeType: "application/json" }
        });

        return res.json({
          image: generatedImage,
          analysis: JSON.parse(analysisResponse.text || "{}")
        });
      }

      res.status(400).json({ error: "Invalid request type" });
    } catch (error) {
      console.error("Gemini API error:", error);
      res.status(500).json({ error: "Failed to process request" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
