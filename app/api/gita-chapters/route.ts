import { NextResponse } from "next/server"

export async function GET() {
  try {
    const rapidApiKey = process.env.NEXT_RAPID_API_KEY
    console.log("API Key status:", rapidApiKey ? "Present" : "Missing")
    
    if (!rapidApiKey) {
      throw new Error("NEXT_RAPID_API_KEY environment variable is not set.")
    }

    const options = {
      method: "GET",
      headers: {
        "x-rapidapi-key": rapidApiKey,
        "x-rapidapi-host": "bhagavad-gita3.p.rapidapi.com",
      },
    }

    const response = await fetch(
      "https://bhagavad-gita3.p.rapidapi.com/v2/chapters/?skip=0&limit=18",
      options
    )
    
    if (!response.ok) {
      throw new Error(`Failed to fetch Gita chapters: ${response.statusText}`)
    }
    
    const chapters = await response.json()

    return NextResponse.json(chapters)
  } catch (error: any) {
    console.error("Error fetching chapters:", error.message)
    return NextResponse.json(
      { error: error.message || "Failed to fetch chapters" },
      { status: 500 }
    )
  }
}
