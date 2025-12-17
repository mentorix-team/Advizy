import Groq from "groq-sdk";
import axios from "axios";
import { ExpertBasics } from "../config/model/expert/expertfinal.model.js";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const NODE_ENV = process.env.NODE_ENV || "development";
const FASTAPI_BASE_URL =
  NODE_ENV === "production"
    ? process.env.FASTAPI_BASE_URL
    : "http://localhost:8000";

export const testFastApi = async (req, res) => {
  try {
    const response = await axios.get(`${FASTAPI_BASE_URL}/ping`, {
      timeout: 5000
    });

    res.json({
      success: true,
      fastapi_response: response.data,
    });
  } catch (error) {
    console.error("FastAPI error:", error.message);
    res.status(500).json({
      success: false,
      error: "Unable to reach FastAPI service",
    });
  }
};

export const recommendExperts = async (req, res) => {
  try {
    const { query } = req.body;

    /* 1️⃣ Get vector similarity results from FastAPI */
    const fastapiRes = await axios.post(
      `${FASTAPI_BASE_URL}/search-experts`,
      { query, top_k: 3 },
      { timeout: 10000 }
    );

    const matches = fastapiRes.data.matches || [];

    if (!matches.length) {
      return res.json({
        success: true,
        experts: [],
        aiRecommendation: "No suitable experts found for your query."
      });
    }

    const mongoIds = matches.map(m => m.mongoId);

    /* 2️⃣ Fetch experts from MongoDB */
    const expertsRaw = await ExpertBasics.find({
      _id: { $in: mongoIds }
    });

    /* 3️⃣ Preserve ranking from Qdrant */
    const experts = mongoIds
      .map(id => expertsRaw.find(e => e._id.toString() === id))
      .filter(Boolean);

    /* 4️⃣ Prepare prompt data */
    const expertDescriptions = experts.map(ex => ({
      name: `${ex.firstName} ${ex.lastName}`,
      domain: ex.credentials?.domain,
      niche: ex.credentials?.niche,
      experience: ex.credentials?.experienceYears,
      services: ex.credentials?.services?.map(s => ({
        title: s.title,
        price: s.price || s.hourlyRate,
      })),
      bio: ex.bio,
    }));

    /* 5️⃣ LLM Prompt */
    const prompt = `
You are an expert recommendation engine.

User query:
"${query}"

Matched experts:
${JSON.stringify(expertDescriptions, null, 2)}

INSTRUCTIONS:
- First line: "Found <N> mentors matching your criteria"
- Then list each expert on a new line
- Each expert must be ONE line only
- Format strictly as:

Found <N> mentors matching your criteria
• <Name> – <domain/niche>, <experience> yrs, from ₹<starting price>

RULES:
- No extra text
- No emojis
- No explanations
- No marketing language
- Keep it concise and factual
`;


    /* 6️⃣ Call Groq Llama */
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    });

    const aiResponse = completion.choices[0].message.content;

    /* 7️⃣ Final response */
    res.json({
      success: true,
      experts,
      aiRecommendation: aiResponse,
    });

  } catch (error) {
    console.error("Recommendation error:", error.message);
    res.status(500).json({
      success: false,
      error: "Failed to generate expert recommendation",
    });
  }
};