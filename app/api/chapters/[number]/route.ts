"use server"

import { NextRequest } from "next/server"

// Simple in-memory cache
const CACHE_DURATION = 1000 * 60 * 60 // 1 hour
const cache = new Map<string, { data: any; timestamp: number }>()

// Rate limiting delay (1 second between requests)
const RATE_LIMIT_DELAY = 1000
let lastRequestTime = 0

async function rateLimit() {
  const now = Date.now()
  const timeSinceLastRequest = now - lastRequestTime
  if (timeSinceLastRequest < RATE_LIMIT_DELAY) {
    await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY - timeSinceLastRequest))
  }
  lastRequestTime = Date.now()
}

export async function GET(request: NextRequest, { params }: { params: { number: string } }) {
  const chapterNumber = params.number

  try {
    // Check cache first
    const cacheKey = `chapter-${chapterNumber}`
    const cached = cache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return Response.json(cached.data)
    }

    // Apply rate limiting
    await rateLimit()

    // Validate API key
    const apiKey = process.env.NEXT_RAPID_API_KEY
    if (!apiKey) {
      return Response.json(
        { error: "API key not configured (NEXT_RAPID_API_KEY)" },
        { status: 500 }
      )
    }

    const options = {
      method: "GET",
      headers: {
        "x-rapidapi-key": apiKey,
        "x-rapidapi-host": "bhagavad-gita3.p.rapidapi.com",
      }
    }

    const response = await fetch(
      `https://bhagavad-gita3.p.rapidapi.com/v2/chapters/${chapterNumber}/?skip=0&limit=18`,
      options
    )

    if (!response.ok) {
      const responseBody = await response.text();
      console.error('API Response:', {
        status: response.status,
        statusText: response.statusText,
        body: responseBody,
        headers: Object.fromEntries(response.headers.entries())
      });

      if (response.status === 429) {
        return Response.json(
          { error: "Rate limit exceeded. Please try again in a few moments." },
          { status: 429 }
        )
      } else if (response.status === 403) {
        return Response.json(
          { 
            error: "API access forbidden. Please verify your RapidAPI subscription and key.",
            details: responseBody
          },
          { status: 403 }
        )
      }
      return Response.json(
        { 
          error: `API request failed: ${response.statusText}`,
          details: responseBody
        },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    // Update cache
    cache.set(cacheKey, {
      data,
      timestamp: Date.now()
    })

    return Response.json(data)
  } catch (error: any) {
    console.error("Error fetching chapter:", error)
    return Response.json(
      { 
        error: error.message || "Failed to fetch chapter data",
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}
