import { GoogleGenAI, Type } from "@google/genai";
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
      return res.status(200).json(JSON.parse(jsonMatch ? jsonMatch[0] : text));
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

      return res.status(200).json({ 
        text: response.text,
        image: generatedImage 
      });
    }

    if (type === 'try-on') {
      const { userImage, outfitImage } = payload;

      // Step 1: Try-on
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

      // Step 2: Analysis
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

      return res.status(200).json({
        image: generatedImage,
        analysis: JSON.parse(analysisResponse.text || "{}")
      });
    }

    return res.status(400).json({ error: "Invalid request type" });
  } catch (error) {
    console.error("Gemini API error:", error);
    res.status(500).json({ error: "Failed to process request" });
  }
}
