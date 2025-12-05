import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
    const { url } = req.body as { url?: string };
    if (!url) {
      return res.status(400).json({ error: 'Missing url' });
    }
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Gemini API key not configured' });
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `
      Based on information found via Google Search for the website ${url}, provide details about the AI tool in a valid JSON format.
      Do not add any markdown formatting.
      The JSON object must have these keys:
      - "name" (string)
      - "description" (string)
      - "category" (string, one of "Productivity", "Writing", "Creative", "Developer", "Marketing", "Research", "Video", "Audio")
      - "keywords" (array of 5 strings)
      - "freeTier" (boolean)
      - "monthlyCost" (number or null)
      - "notes" (string)
    `;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let jsonString = response.text().trim();
    if (jsonString.startsWith('```')) {
      jsonString = jsonString.replace(/^```json\n?|```$/g, '').trim();
    }
    const data = JSON.parse(jsonString);
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Analysis failed' });
  }
}
