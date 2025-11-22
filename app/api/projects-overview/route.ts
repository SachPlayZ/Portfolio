import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { projectData } = body; // Assuming body has projectData to explain

    if (!projectData) {
        return NextResponse.json({ error: "Project data required" }, { status: 400 });
    }

    const completion = await groq.chat.completions.create({
        messages: [
            {
                role: "system",
                content: "You are a helpful assistant that summarizes project details into small, concise bullet points."
            },
            {
                role: "user",
                content: `Explain this project in small points based on this data: ${JSON.stringify(projectData)}`
            }
        ],
        model: "llama-3.3-70b-versatile", // Or other model
    });

    return NextResponse.json({ 
        overview: completion.choices[0]?.message?.content || "No overview generated." 
    });
  } catch (error) {
    console.error("Groq API error:", error);
    return NextResponse.json({ error: "Failed to generate overview" }, { status: 500 });
  }
}

