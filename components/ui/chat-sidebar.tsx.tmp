"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle, MessageSquare, Trash2, Loader2, BookOpen, Search, Calendar, Users, Settings, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter, usePathname } from "next/navigation"
import { useChatStore, getLastMessage } from "@/lib/chat-history"
import Image from "next/image"
import Link from "next/link"
import { GitaAILogo } from "@/components/hero-section"
import { useAuth } from "@/lib/use-auth"

export function ChatSidebar({ mobile = false, onSelectChat }: { mobile?: boolean, onSelectChat?: () => void } = {}) {
  const { sessions, createSession, deleteSession, setCurrentSessionId, setCurrentUserId, currentSessionId, isLoading, error, fetchUserSessions } = useChatStore()
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (user && user.uid) {
      setCurrentUserId(user.uid)
    }
  }, [user, setCurrentUserId])

  const startNewChat = async () => {
    try {
      const newSessionId = await createSession()
      router.push(`/chat?id=${newSessionId}`)
      if (mobile && onSelectChat) onSelectChat()
    } catch (error) {
      console.error("Failed to create new chat:", error)
    }
  }

  const deleteChat = async (id: string, e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      await deleteSession(id)
    } catch (error) {
      console.error("Failed to delete chat:", error)
    }
  }

  const handleChatSelect = (id: string, e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    setCurrentSessionId(id)
    router.push(`/chat?id=${id}`)
    if (mobile && onSelectChat) onSelectChat()
  }

  useEffect(() => {
    if (user) {
      fetchUserSessions()
    }
  }, [user, fetchUserSessions])

  useEffect(() => {
    if (sessions.length === 0 && user && !isLoading) {
      createSession()
    }
  }, [sessions.length, user, isLoading, createSession])

  const handleSignOut = async () => {
    try {
      const result = await logout()
      if (result.success) {
        router.push("/login")
      }
    } catch (error) {
      console.error("Failed to sign out:", error)
    }
  }

  return (
    <aside className="w-72 h-screen bg-white border-r border-gray-200 flex flex-col justify-between shadow-sm">
      <div>
        <div className="flex flex-col items-center pt-6 pb-2">
          <GitaAILogo className="h-10 w-auto mb-1" />
          <div className="text-lg font-semibold text-amber-700">Gita AI</div>
          <div className="text-xs text-gray-500 mb-2">Divine Wisdom</div>
        </div>

        {typeof window !== 'undefined' && !user && (
          <div className="flex flex-col items-center gap-1 px-4 pb-4">
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-xl font-bold animate-pulse">
              <Loader2 size={24} className="animate-spin" />
            </div>
            <div className="font-medium text-gray-400 text-sm truncate w-full text-center">Loading user...</div>
          </div>
        )}
        
        {user && (
          <div className="flex flex-col items-center gap-1 px-4 pb-4">
            {user.photoURL ? (
              <Image src={user.photoURL} alt="User" width={48} height={48} className="rounded-full border" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center text-white text-xl font-bold">
                {user.displayName ? user.displayName[0].toUpperCase() : user.email ? user.email[0].toUpperCase() : "U"}
              </div>
            )}
            <div className="font-medium text-gray-900 text-sm truncate w-full text-center">{user.displayName || 'No Name'}</div>
            <div className="text-xs text-gray-500 truncate w-full text-center">{user.email || 'No Email'}</div>
          </div>
        )}

        <nav className="px-3 pb-3">
          <Button
            onClick={startNewChat}
            className="w-full justify-start mb-4"
            disabled={isLoading}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            New Chat
          </Button>

          <div className="space-y-1 mb-4">
            <Link
              href="/browse"
              className={cn(
                "flex items-center py-2 px-3 text-sm rounded-md transition-colors",
                pathname === "/browse"
                  ? "bg-amber-100 text-amber-900"
                  : "hover:bg-gray-100 text-gray-700"
              )}
            >
              <BookOpen className="mr-2 h-4 w-4" />
              Browse Chapters
            </Link>
            <Link
              href="/search"
              className={cn(
                "flex items-center py-2 px-3 text-sm rounded-md transition-colors",
                pathname === "/search"
                  ? "bg-amber-100 text-amber-900"
                  : "hover:bg-gray-100 text-gray-700"
              )}
            >
              <Search className="mr-2 h-4 w-4" />
              Search Texts
            </Link>
            <Link
              href="/daily"
              className={cn(
                "flex items-center py-2 px-3 text-sm rounded-md transition-colors",
                pathname === "/daily"
                  ? "bg-amber-100 text-amber-900"
                  : "hover:bg-gray-100 text-gray-700"
              )}
            >
              <Calendar className="mr-2 h-4 w-4" />
              Daily Shloka
            </Link>
            <Link
              href="/community"
              className={cn(
                "flex items-center py-2 px-3 text-sm rounded-md transition-colors",
                pathname === "/community"
                  ? "bg-amber-100 text-amber-900"
                  : "hover:bg-gray-100 text-gray-700"
              )}
            >
              <Users className="mr-2 h-4 w-4" />
              Community
            </Link>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between px-3 mb-2">
              <p className="text-xs font-medium text-gray-500">Recent Chats</p>
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4"
                onClick={() => fetchUserSessions()}
                title="Refresh chats"
              >
                <Loader2 className="h-3 w-3" />
              </Button>
            </div>
            
            {isLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
              </div>
            ) : error ? (
              <div className="text-center py-4 text-sm text-red-500">Failed to load chats</div>
            ) : sessions.length === 0 ? (
              <div className="text-center py-4 text-sm text-gray-500">No chats yet</div>
            ) : (
              sessions.map((session) => {
                const lastMessage = getLastMessage(session)
                return (
                  <Link
                    key={session.id}
                    href={`/chat?id=${session.id}`}
                    onClick={(e) => handleChatSelect(session.id, e)}
                    className={cn(
                      "flex items-center justify-between py-2 px-3 text-sm rounded-md hover:bg-gray-100 transition-colors group",
                      session.id === currentSessionId && "bg-amber-100 hover:bg-amber-100 text-amber-900"
                    )}
                  >
                    <div className="flex items-center min-w-0">
                      <MessageSquare className="h-4 w-4 mr-2 shrink-0" />
                      <span className="truncate">
                        {lastMessage?.content?.slice(0, 30) || "New Chat"}
                      </span>
                    </div>
                    {session.id === currentSessionId && (
                      <button
                        onClick={(e) => deleteChat(session.id, e)}
                        className="hidden group-hover:block p-1 hover:text-red-600"
                        title="Delete chat"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </Link>
                )
              })
            )}
          </div>
        </nav>
      </div>

      {/* Bottom: Account actions */}
      <div className="p-3 border-t">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </aside>
  )
}
