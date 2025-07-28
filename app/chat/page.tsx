"use client"

import { useAuth } from "@/lib/use-auth"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { GitaAILogo } from "@/components/hero-section"
import Link from "next/link"
import { Loader2, Menu, X } from "lucide-react"
import { ClaudeChatInput, type FileWithPreview, type PastedContent } from "@/components/ui/claude-style-ai-input"
import { ChatSidebar } from "@/components/ui/chat-sidebar"
import { UserProfile } from "@/components/ui/user-profile"
import { useChatStore } from "@/lib/chat-history"

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

export default function ChatPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const searchParams = useSearchParams()
  const initialPrompt = searchParams.get("prompt")
  const chatIdParam = searchParams.get("id")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isAiLoading, setIsAiLoading] = useState(false)
  const [aiError, setAiError] = useState<Error | null>(null)
  const [aiMessages, setAiMessages] = useState<Array<{ role: string; content: string; id: string }>>([])
  
  // Get chat store functions and state
  const { 
    sessions,
    currentSessionId,
    setCurrentSessionId,
    getCurrentSession,
    createSession,
    addMessage,
    setCurrentUserId,
    fetchUserSessions
  } = useChatStore()

  // Initialize chat session based on URL parameter
  useEffect(() => {
    const initializeSession = async () => {
      if (!user) return;
      
      if (chatIdParam && sessions.some(s => s.id === chatIdParam)) {
        await setCurrentSessionId(chatIdParam)
      } else if (sessions.length > 0 && !currentSessionId) {
        await setCurrentSessionId(sessions[0].id)
      } else if (sessions.length === 0) {
        const newId = await createSession()
        await setCurrentSessionId(newId)
      }
    }
    
    initializeSession()
  }, [chatIdParam, sessions, currentSessionId, setCurrentSessionId, createSession, user])

  // Load messages from current session
  useEffect(() => {
    const loadMessages = async () => {
      if (!user) return;
      
      const currentSession = getCurrentSession()
      if (currentSession) {
        setAiMessages(currentSession.messages.map(m => ({
          role: m.role,
          content: m.content,
          id: m.id
        })))
      } else {
        setAiMessages([])
      }
    }
    
    loadMessages()
  }, [currentSessionId, getCurrentSession, user])

  // Authentication check
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])
  
  // Set current user ID and fetch sessions when authenticated
  useEffect(() => {
    if (user) {
      setCurrentUserId(user.uid)
      fetchUserSessions()
    }
  }, [user, setCurrentUserId, fetchUserSessions])

  // Scroll to the bottom of the chat messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [aiMessages])

  // Handler for sending messages
  const handleClaudeSendMessage = async (textMessage: string, files: FileWithPreview[], pastedContent: PastedContent[]) => {
    if (!currentSessionId || !user) return
    
    let fullMessageContent = textMessage.trim()

    if (pastedContent.length > 0) {
      const pastedText = pastedContent.map((pc) => `Pasted Content:\n${pc.content}`).join("\n\n")
      fullMessageContent += `\n\n${pastedText}`
    }

    if (files.length > 0) {
      const fileDetails = files
        .map((file) => {
          let detail = `File: ${file.file.name} (${file.type}, ${formatFileSize(file.file.size)})`
          if (file.textContent) {
            detail += `\nContent:\n${file.textContent.slice(0, 500)}...`
          }
          return detail
        })
        .join("\n\n")
      fullMessageContent += `\n\nAttached Files:\n${fileDetails}`
    }

    if (fullMessageContent) {
      setIsAiLoading(true)
      setAiError(null)
      
      try {
        // Add user message to messages state first
        const userMessage = { role: "user" as const, content: fullMessageContent, id: String(Date.now()) }
        setAiMessages(prev => [...prev, userMessage])
        
        // Add to chat store
        await addMessage(currentSessionId, {
          role: "user",
          content: fullMessageContent,
        })
        
        const response = await fetch("/api/gita-chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: [...aiMessages, { role: "user", content: fullMessageContent }],
          }),
        })
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
        }
        
        const data = await response.json()
        
        // Add AI response to chat store and messages state
        const aiResponse = data.choices[0].message.content
        
        // Add to chat store
        await addMessage(currentSessionId, {
          role: "assistant",
          content: aiResponse
        })
        
        // Then update UI
        const aiMessage = {
          role: "assistant" as const,
          content: aiResponse,
          id: String(Date.now() + 1)
        }
        setAiMessages(prev => [...prev, aiMessage])
        
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err)
        setAiError(new Error(errorMessage))
        console.error("Chat error:", errorMessage)
        
        setAiMessages(prev => [
          ...prev,
          {
            role: "assistant" as const,
            content: `I apologize, but I encountered an error: ${errorMessage}. Please try again.`,
            id: String(Date.now())
          }
        ])
      } finally {
        setIsAiLoading(false)
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-700">
        Loading chat interface...
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
        
        <div className="flex-1 overflow-y-auto p-2 sm:p-4 md:p-6 flex flex-col">
          {aiMessages.length === 0 ? (
            <div className="text-center text-gray-600 py-8 max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold mb-2">Start your spiritual conversation</h2>
              <p>Ask a question about the Bhagavad Gita, life's purpose, or any spiritual query.</p>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-4 w-full">
              {aiMessages.map((m) => (
                <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`p-3 rounded-lg max-w-[90vw] sm:max-w-[80%] ${
                      m.role === "user"
                        ? "bg-amber-500 text-white rounded-br-none"
                        : "bg-gray-100 text-gray-800 rounded-bl-none"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {isAiLoading && (
                <div className="flex justify-start">
                  <div className="p-3 rounded-lg bg-gray-100 text-gray-800 rounded-bl-none">
                    <Loader2 className="h-5 w-5 animate-spin inline-block mr-2" />
                    GitaAI is thinking...
                  </div>
                </div>
              )}
              {aiError && <div className="text-center text-red-600 mt-4">Error: {aiError.message}. Please try again.</div>}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
        
        {/* Chat input area */}
        <div className="border-t border-gray-200 bg-white p-2 sm:p-4">
          <div className="max-w-3xl mx-auto">
            <ClaudeChatInput
              onSendMessage={handleClaudeSendMessage}
              disabled={isAiLoading}
              placeholder="Ask about life's purpose, seek guidance on relationships, or explore Gita wisdom..."
              maxFiles={10}
              maxFileSize={10 * 1024 * 1024}
              acceptedFileTypes={[
                "text/",
                "application/json",
                "application/xml",
                "application/javascript",
                "application/typescript",
                "image/",
                "video/",
                "audio/",
                ".txt",
                ".md",
                ".py",
                ".js",
                ".ts",
                ".jsx",
                ".tsx",
                ".html",
                ".css",
                ".json",
                ".xml",
                ".yaml",
                ".csv",
                ".sql",
                ".zip",
                ".rar",
                ".tar"
              ]}
              initialMessage=""
              key={currentSessionId}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
