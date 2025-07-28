"use client"

import { useParams } from "next/navigation"
import { useState, useEffect } from "react"

export default function ChapterPage() {
  const params = useParams()
  const chapterNumber = params.number
  const [chapter, setChapter] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchChapter() {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(`/api/chapters/${chapterNumber}`)
        const data = await response.json()

        if (!response.ok) {
          if (response.status === 429) {
            throw new Error("Please wait a moment before trying again.")
          } else {
            throw new Error(data.error || "Failed to fetch chapter")
          }
        }

        if (data.error) {
          throw new Error(data.error)
        }

        setChapter(data)
      } catch (error: any) {
        console.error("Error fetching chapter:", error)
        setError(error.message || "Failed to load chapter")
      } finally {
        setLoading(false)
      }
    }

    if (chapterNumber) {
      fetchChapter()
    }
  }, [chapterNumber])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-amber-600 animate-spin h-8 w-8 border-4 border-current border-t-transparent rounded-full"></div>
      </div>
    )
  }

  if (error || !chapter) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error || `Failed to load chapter ${chapterNumber}`}</p>
          {error?.includes("API key") && (
            <p className="mt-2 text-sm text-red-600">
              Please ensure NEXT_RAPID_API_KEY is set in your .env.local file and restart the dev server.
            </p>
          )}
          {error?.includes("wait") && (
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-md transition-colors"
            >
              Retry
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Chapter {chapter.chapter_number}: {chapter.name}
        </h1>
        <p className="text-gray-600 mb-6">{chapter.chapter_summary}</p>
        
        <div className="prose prose-amber max-w-none">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Description
          </h2>
          <div className="bg-white border border-amber-200 rounded-lg p-6 shadow-sm">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {chapter.chapter_summary}
            </p>
          </div>

          {/* Add more sections for verses, translations, etc. */}
        </div>
      </div>
    </div>
  )
}