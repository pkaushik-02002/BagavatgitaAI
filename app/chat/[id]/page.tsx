"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { useChatStore } from "@/lib/chat-history"
import { useAuth } from "@/lib/use-auth"
import { Loader2 } from "lucide-react"

export default function ChatIdPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const chatId = searchParams.get("id")
  const { user, loading } = useAuth()
  const { sessions, getSessionMessages, setCurrentSessionId, fetchUserSessions, isLoading } = useChatStore()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      fetchUserSessions()
    }
  }, [user, fetchUserSessions])

  useEffect(() => {
    if (chatId) {
      setCurrentSessionId(chatId)
    }
  }, [chatId, setCurrentSessionId])

  if (!user || loading) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <Loader2 className="animate-spin mr-2" />
        Loading...
      </div>
    )
  }

  const messages = chatId ? getSessionMessages(chatId) : []
  const session = sessions.find(s => s.id === chatId)

  return (
    <div className="flex flex-col h-full w-full p-6">
      <h2 className="text-xl font-bold mb-4">Chat History</h2>
      {session && (
        <div className="mb-2 text-lg font-semibold">{session.title}</div>
      )}
      <div className="flex-1 overflow-y-auto bg-gray-50 rounded-lg p-4 border">
        {messages.length === 0 ? (
          <div className="text-gray-500 text-center">No messages in this chat.</div>
        ) : (
          <ul className="space-y-4">
            {messages.map((msg) => (
              <li key={msg.id} className={msg.role === "user" ? "text-right" : "text-left"}>
                <div className={`inline-block px-4 py-2 rounded-lg max-w-[70%] ${msg.role === "user" ? "bg-amber-100 text-amber-900" : "bg-white text-gray-800 border"}`}>
                  <span className="block text-xs text-gray-400 mb-1">{msg.role === "user" ? "You" : "GitaAI"}</span>
                  <span>{msg.content}</span>
                  <div className="text-[10px] text-gray-400 mt-1">{msg.timestamp.toLocaleString()}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
