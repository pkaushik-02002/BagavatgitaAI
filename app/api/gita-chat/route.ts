import OpenAI from "openai"
import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize the Gemini client
const geminiApiKey = process.env.GOOGLE_AI_API_KEY;
if (!geminiApiKey) {
  console.warn("GOOGLE_AI_API_KEY environment variable is not set. Gemini model will not be available.");
}
const gemini = new GoogleGenerativeAI(geminiApiKey || "");

export async function POST(req: Request) {
  const { messages } = await req.json()

  // Fetch Bhagavad Gita chapters from RapidAPI
  let gitaContext = ""
  try {
    const rapidApiKey = process.env.NEXT_RAPID_API_KEY
    if (!rapidApiKey) {
      throw new Error("RAPIDAPI_KEY environment variable is not set.")
    }

    const options = {
      method: "GET",
      headers: {
        "x-rapidapi-key": rapidApiKey,
        "x-rapidapi-host": "bhagavad-gita3.p.rapidapi.com",
      },
    }

    // Fetch all 18 chapters. For a production app, consider fetching only relevant chapters/verses
    // based on the user's query to optimize token usage and response time.
    const response = await fetch("https://bhagavad-gita3.p.rapidapi.com/v2/chapters/?skip=0&limit=18", options)
    if (!response.ok) {
      throw new Error(`Failed to fetch Gita chapters: ${response.statusText}`)
    }
    const chapters = await response.json()

    // Concatenate chapter summaries or relevant information to provide context to the AI
    gitaContext = chapters
      .map((chapter: any) => `Chapter ${chapter.chapter_number}: ${chapter.name} - ${chapter.chapter_summary}`)
      .join("\n\n")
  } catch (error) {
    console.error("Error fetching Bhagavad Gita data:", error)
    gitaContext = "Could not retrieve Bhagavad Gita context. Please answer based on general knowledge."
  }

  // Prepare prompt for the AI models, including the Gita context
  const systemPrompt = `I want you to act as GitaAI, an AI-powered spiritual guide based on the Bhagavad Gita.
  When responding, provide guidance, interpretations, and wisdom from the Bhagavad Gita.
  Use the following chapter summaries as context, but avoid direct quotes unless necessary.
  Your responses should be insightful, compassionate, and aligned with the Gita's teachings.
  When asked about topics not directly related to the Gita, provide general guidance while connecting it to relevant spiritual principles.

  Here is the Bhagavad Gita context to inform your responses:
  ${gitaContext}

  Remember to maintain a respectful and contemplative tone in your responses.
  `

  try {
    // Get the selected model, defaulting to GPT-4
    const selectedModel = messages[0]?.model || "gpt-4";
    
    // Remove the model selection message and prepare chat messages
    const chatMessages = messages.filter(m => !m.model);

    let response;

    if (selectedModel === "gemini") {
      // Handle Gemini chat
      const model = gemini.getGenerativeModel({ model: "gemini-pro" });
      
      // Convert chat history to Gemini format
      const history = chatMessages.map(msg => ({
        role: msg.role === "user" ? "user" : "model",
        parts: msg.content
      }));

      // Start a chat
      const chat = model.startChat({
        history,
        generationConfig: {
          temperature: 0.7,
          topP: 1,
          topK: 1,
          maxOutputTokens: 2048,
        },
      });

      // Generate response
      const result = await chat.sendMessage(systemPrompt);
      const text = result.response.text();

      response = {
        choices: [{
          message: {
            content: text
          }
        }]
      };
    } else {
      // Handle OpenAI chat
      const completion = await openai.chat.completions.create({
        model: selectedModel,
        messages: [
          { role: "system", content: systemPrompt },
          ...chatMessages
        ],
      });

      response = {
        choices: [{
          message: {
            content: completion.choices[0]?.message?.content || "I apologize, but I couldn't generate a response."
          }
        }]
      };
    }

    return new Response(JSON.stringify(response), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('API error:', error);
    let errorMessage = 'An error occurred';

    if (error.response) {
      // OpenAI error
      errorMessage = error.response.data?.error?.message || error.message;
    } else if (error.message) {
      // General or Gemini error
      errorMessage = error.message;
    }

    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
