import Groq from "groq-sdk";
import axios from 'axios';
import { ExpertBasics } from "../config/model/expert/expertfinal.model.js";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const testFastApi = async (req, res) => {
    try {
        const response = await axios.get("http://localhost:8000/ping");
        res.json({
            success: true,
            fastapi_response: response.data,
        });
    } catch (error) {
        console.error("FastAPI error:", error.message);
        res.status(500).json({ success: false, error: "Unable to reach FastAPI" });
    }
}


export const recommendExperts = async (req, res) => {
  try {
    const { query } = req.body;

    // 1️⃣ FastAPI: get vector-similarity matches
    const fastapiRes = await axios.post("http://localhost:8000/search-experts", {
      query,
      top_k: 3
    });

    const matches = fastapiRes.data.matches;
    const mongoIds = matches.map(m => m.mongoId);

    // 2️⃣ Fetch full expert details from MongoDB
    const experts = await ExpertBasics.find({ _id: { $in: mongoIds } });

    // 3️⃣ Prepare data for Llama model
    const expertDescriptions = experts.map((ex, i) => ({
      name: `${ex.firstName} ${ex.lastName}`,
      domain: ex.credentials?.domain,
      niche: ex.credentials?.niche,
      experience: ex.credentials?.experienceYears,
      services: ex.credentials?.services?.map(s => ({
        title: s.title,
        price: s.price,
      })),
      bio: ex.bio
    }));

    // 4️⃣ Call Groq Llama-3.3-70B-Versatile
    const prompt = `
You are an expert recommendation assistant.

User query:
"${query}"

Matched experts:
${JSON.stringify(expertDescriptions, null, 2)}

Write a short, friendly recommendation explaining:
- Which expert is best and why
- Why they match the user’s query
- Mention experience + niche + price
- Provide a supportive tone
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3
    });

    const aiResponse = completion.choices[0].message.content;

    // 5️⃣ Send final combined response to frontend
    res.json({
      success: true,
      experts,
      aiRecommendation: aiResponse
    });

  } catch (error) {
    console.error("Recommendation error:", error.message);
    res.status(500).json({ error: "Failed to generate recommendation" });
  }
};
