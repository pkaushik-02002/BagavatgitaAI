"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/use-auth"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { GitaAILogo } from "@/components/hero-section"
import { ChatSidebar } from "@/components/ui/chat-sidebar"
import { UserProfile } from "@/components/ui/user-profile"
import { BookOpen, ChevronRight, Menu, X } from "lucide-react"
import Link from "next/link"

interface Chapter {
  chapter_number: number
  name: string
  name_meaning: string
  chapter_summary: string
  verses_count: number
}

export default function BrowseChaptersPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const response = await fetch("/api/gita-chapters")
        if (!response.ok) {
          throw new Error("Failed to fetch chapters")
        }
        const data = await response.json()
        setChapters(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load chapters")
      } finally {
        setIsLoading(false)
      }
    }

    fetchChapters()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-700">
        Loading...
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Mobile header */}
      <header className="w-full flex items-center justify-between bg-white border-b border-gray-200 p-4 md:hidden">
        <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-md hover:bg-gray-100 focus:outline-none">
          <Menu className="h-6 w-6 text-amber-600" />
        </button>
        <Link href="/" className="flex items-center space-x-2">
          <GitaAILogo className="h-8" />
        </Link>
        <UserProfile />
      </header>

      {/* Sidebar for desktop */}
      <div className="hidden md:block h-full">
        <ChatSidebar />
      </div>

      {/* Sidebar drawer for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-black/30" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-72 max-w-full h-full bg-white border-r border-gray-200 shadow-lg z-50 animate-slideInLeft">
            <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100">
              <span className="sr-only">Close sidebar</span>
              <X className="h-6 w-6 text-amber-600" />
            </button>
            <ChatSidebar mobile onSelectChat={() => setSidebarOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Desktop header */}
        <header className="w-full bg-white border-b border-gray-200 p-4 items-center justify-between shadow-sm hidden md:flex">
          <Link href="/" className="flex items-center space-x-2">
            <GitaAILogo className="h-8" />
          </Link>
          <UserProfile />
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-8">
              <BookOpen className="h-8 w-8 text-amber-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Browse Chapters</h1>
            </div>

            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-600">Loading chapters...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-600">{error}</p>
                <Button onClick={() => window.location.reload()} className="mt-4">
                  Try Again
                </Button>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2">
                {chapters.map((chapter) => (
                  <div
                    key={chapter.chapter_number}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 hover:border-amber-300 transition-colors p-6"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Chapter {chapter.chapter_number}: {chapter.name}
                        </h3>
                        <p className="text-sm text-gray-600 italic">{chapter.name_meaning}</p>
                      </div>
                      <span className="text-sm text-amber-600 bg-amber-50 px-2 py-1 rounded">
                        {chapter.verses_count} verses
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{chapter.chapter_summary}</p>
                    <Link
                      href={`/browse/chapter/${chapter.chapter_number}`}
                      className="inline-flex items-center text-amber-600 hover:text-amber-700 text-sm font-medium"
                    >
                      Read Chapter
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
