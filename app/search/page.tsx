"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/use-auth"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { GitaAILogo } from "@/components/hero-section"
import { ChatSidebar } from "@/components/ui/chat-sidebar"
import { UserProfile } from "@/components/ui/user-profile"
import { Search, Menu, X } from "lucide-react"
import Link from "next/link"

export default function SearchPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  const handleSearch = async () => {
    if (!query.trim()) return

    setIsSearching(true)
    setError(null)

    try {
      const response = await fetch(`/api/search-gita?q=${encodeURIComponent(query)}`)
      if (!response.ok) {
        throw new Error("Failed to search")
      }
      const data = await response.json()
      setSearchResults(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to perform search")
    } finally {
      setIsSearching(false)
    }
  }

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
              <Search className="h-8 w-8 text-amber-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Search Texts</h1>
            </div>

            <div className="mb-8">
              <div className="flex gap-4">
                <Input
                  type="text"
                  placeholder="Search verses, commentaries, and keywords..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="flex-1"
                />
                <Button onClick={handleSearch} disabled={isSearching}>
                  {isSearching ? "Searching..." : "Search"}
                </Button>
              </div>

              {error && (
                <p className="mt-4 text-red-600 text-center">{error}</p>
              )}

              {isSearching ? (
                <div className="text-center py-12">
                  <div className="animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-600">Searching...</p>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="mt-8 space-y-6">
                  {searchResults.map((result, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Chapter {result.chapter}, Verse {result.verse}
                        </h3>
                        <span className="text-sm text-amber-600 bg-amber-50 px-2 py-1 rounded">
                          {result.type}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4">{result.text}</p>
                      {result.translation && (
                        <p className="text-gray-700 italic mb-4">{result.translation}</p>
                      )}
                      <Link
                        href={`/browse/chapter/${result.chapter}#verse-${result.verse}`}
                        className="text-amber-600 hover:text-amber-700 text-sm font-medium"
                      >
                        View in context
                      </Link>
                    </div>
                  ))}
                </div>
              ) : query && !isSearching && (
                <p className="text-center text-gray-600 mt-8">
                  No results found for "{query}"
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
