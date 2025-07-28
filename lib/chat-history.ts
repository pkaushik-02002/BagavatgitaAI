// @/lib/chat-history.ts
// Real implementation of chat history using Firebase Firestore

import { create, createStore } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where, orderBy, Timestamp, getDoc, setDoc } from 'firebase/firestore'
import { getFirestore } from 'firebase/firestore'
import { app } from './firebase'
import { useAuth } from './use-auth'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface ChatSession {
  id: string
  title: string
  messages: ChatMessage[]
  createdAt: Date
  updatedAt: Date
  userId: string // Add userId to associate sessions with users
}

interface ChatStore {
  sessions: ChatSession[]
  currentSessionId: string | null
  currentUserId: string | null
  isLoading: boolean
  error: string | null
  createSession: (title?: string) => Promise<string>
  deleteSession: (id: string) => Promise<void>
  addMessage: (sessionId: string, message: Omit<ChatMessage, 'id' | 'timestamp'>) => Promise<void>
  setCurrentSessionId: (id: string | null) => void
  setCurrentUserId: (id: string | null) => void
  getCurrentSession: () => ChatSession | null
  updateSessionTitle: (id: string, title: string) => Promise<void>
  fetchUserSessions: () => Promise<void>
  getSessionMessages: (sessionId: string) => ChatMessage[]
}

// Generate a random ID for client-side use before Firebase assigns one
const generateId = () => Math.random().toString(36).substring(2, 10)

// Create a store with Zustand
export const useChatStore = create(
  persist<ChatStore>(
    (set, get) => {
      // Initialize Firestore
      const db = typeof window !== 'undefined' ? getFirestore(app) : null;
      
      return {
        sessions: [],
        currentSessionId: null,
        currentUserId: null,
        isLoading: false,
        error: null,
        
        createSession: async (title = 'New Chat') => {
          set({ isLoading: true, error: null })
          
          try {
            if (!db) throw new Error('Firestore not initialized')
            
            // Get current user from function parameter or localStorage
            const userId = get().currentUserId
            if (!userId) throw new Error('User not authenticated')
            
            const id = generateId() // Temporary client ID
            
            // Create new session object
            const newSession: Omit<ChatSession, 'id'> = {
              title,
              messages: [],
              createdAt: new Date(),
              updatedAt: new Date(),
              userId
            }
            
            // Add to Firestore
            const sessionsRef = collection(db, 'chatSessions')
            const docRef = await addDoc(sessionsRef, {
              ...newSession,
              createdAt: Timestamp.fromDate(newSession.createdAt),
              updatedAt: Timestamp.fromDate(newSession.updatedAt)
            })
            
            const serverSession: ChatSession = {
              ...newSession,
              id: docRef.id,
              messages: []
            }
            
            // Update local state
            set(state => ({
              sessions: [serverSession, ...state.sessions],
              currentSessionId: serverSession.id,
              isLoading: false
            }))
            
            return serverSession.id
          } catch (error: any) {
            console.error('Error creating session:', error)
            set({ error: error.message, isLoading: false })
            throw error
          }
        },
        
        deleteSession: async (id) => {
          set({ isLoading: true, error: null })
          
          try {
            if (!db) throw new Error('Firestore not initialized')
            
            // Delete from Firestore
            await deleteDoc(doc(db, 'chatSessions', id))
            
            // Update local state
            set(state => {
              const newSessions = state.sessions.filter(session => session.id !== id)
              const newCurrentId = state.currentSessionId === id 
                ? (newSessions.length > 0 ? newSessions[0].id : null)
                : state.currentSessionId
                
              return {
                sessions: newSessions,
                currentSessionId: newCurrentId,
                isLoading: false
              }
            })
          } catch (error: any) {
            console.error('Error deleting session:', error)
            set({ error: error.message, isLoading: false })
          }
        },
        
        addMessage: async (sessionId, message) => {
          set({ isLoading: true, error: null })
          
          try {
            if (!db) throw new Error('Firestore not initialized')
            
            const newMessage: ChatMessage = {
              ...message,
              id: generateId(),
              timestamp: new Date()
            }
            
            // Get the session reference
            const sessionRef = doc(db, 'chatSessions', sessionId)
            const sessionSnap = await getDoc(sessionRef)
            
            if (!sessionSnap.exists()) {
              throw new Error('Session not found')
            }
            
            // Add message to the messages subcollection
            const messagesRef = collection(sessionRef, 'messages')
            await addDoc(messagesRef, {
              ...newMessage,
              timestamp: Timestamp.fromDate(newMessage.timestamp)
            })
            
            // Update session's updatedAt timestamp and title if needed
            const sessionData = sessionSnap.data()
            const isDefaultTitle = sessionData.title === 'New Chat'
            const newTitle = isDefaultTitle && message.role === 'user'
              ? message.content.slice(0, 30) + (message.content.length > 30 ? '...' : '')
              : sessionData.title
            
            await updateDoc(sessionRef, {
              updatedAt: Timestamp.fromDate(new Date()),
              title: newTitle
            })
            
            // Update local state
            set(state => {
              const updatedSessions = state.sessions.map(session => {
                if (session.id === sessionId) {
                  return {
                    ...session,
                    messages: [...session.messages, newMessage],
                    updatedAt: new Date(),
                    title: isDefaultTitle && message.role === 'user'
                      ? message.content.slice(0, 30) + (message.content.length > 30 ? '...' : '')
                      : session.title
                  }
                }
                return session
              })
              
              return { 
                sessions: updatedSessions,
                isLoading: false 
              }
            })
          } catch (error: any) {
            console.error('Error adding message:', error)
            set({ error: error.message, isLoading: false })
          }
        },
        
        setCurrentSessionId: (id) => {
          set({ currentSessionId: id })
        },
        
        setCurrentUserId: (id) => {
          set({ currentUserId: id })
        },
        
        getCurrentSession: () => {
          const { sessions, currentSessionId } = get()
          if (!currentSessionId) return null
          return sessions.find(session => session.id === currentSessionId) || null
        },
        
        updateSessionTitle: async (id, title) => {
          set({ isLoading: true, error: null })
          
          try {
            if (!db) throw new Error('Firestore not initialized')
            
            // Update in Firestore
            const sessionRef = doc(db, 'chatSessions', id)
            await updateDoc(sessionRef, { title })
            
            // Update local state
            set(state => ({
              sessions: state.sessions.map(session => 
                session.id === id ? { ...session, title } : session
              ),
              isLoading: false
            }))
          } catch (error: any) {
            console.error('Error updating session title:', error)
            set({ error: error.message, isLoading: false })
          }
        },
        
        fetchUserSessions: async () => {
          set({ isLoading: true, error: null })
          
          try {
            if (!db) throw new Error('Firestore not initialized')
            
            const userId = get().currentUserId
            if (!userId) throw new Error('User not authenticated')
            
            // Query Firestore for user's sessions
            const sessionsRef = collection(db, 'chatSessions')
            const q = query(
              sessionsRef,
              where('userId', '==', userId),
              orderBy('updatedAt', 'desc')
            )
            
            const querySnapshot = await getDocs(q)
            const sessions: ChatSession[] = []
            
            // Process each session
            for (const docSnapshot of querySnapshot.docs) {
              const sessionData = docSnapshot.data()
              
              // Get messages for this session
              const messagesRef = collection(docSnapshot.ref, 'messages')
              const messagesQuery = query(messagesRef, orderBy('timestamp', 'asc'))
              const messagesSnapshot = await getDocs(messagesQuery)
              
              const messages: ChatMessage[] = messagesSnapshot.docs.map(msgDoc => {
                const msgData = msgDoc.data()
                return {
                  id: msgDoc.id,
                  role: msgData.role,
                  content: msgData.content,
                  timestamp: msgData.timestamp.toDate()
                }
              })
              
              sessions.push({
                id: docSnapshot.id,
                title: sessionData.title,
                messages,
                createdAt: sessionData.createdAt.toDate(),
                updatedAt: sessionData.updatedAt.toDate(),
                userId: sessionData.userId
              })
            }
            
            // Update local state
            set({
              sessions,
              currentSessionId: sessions.length > 0 ? sessions[0].id : null,
              isLoading: false
            })
          } catch (error: any) {
            console.error('Error fetching user sessions:', error)
            set({ error: error.message, isLoading: false })
          }
        },
        
        getSessionMessages: (sessionId) => {
          const { sessions } = get()
          const session = sessions.find(s => s.id === sessionId)
          return session ? session.messages : []
        }
      }
    },
    {
      name: 'gita-ai-chat-store',
      // Only persist non-sensitive data
      partialize: (state) => ({
        currentSessionId: state.currentSessionId,
        currentUserId: state.currentUserId
      } as Partial<ChatStore>),
      storage: createJSONStorage(() => {
        return typeof window !== 'undefined' ? localStorage : null as any
      })
    }
  )
)

// Helper function to get the last message from a session
export const getLastMessage = (session: ChatSession): string => {
  if (session.messages.length === 0) return ''
  const lastMessage = session.messages[session.messages.length - 1]
  return lastMessage.role === 'user' ? lastMessage.content : 'GitaAI: ' + lastMessage.content
}

// Helper function to format a date relative to now
export const formatRelativeDate = (date: Date): string => {
  const now = new Date()
  const diffInMs = now.getTime() - new Date(date).getTime()
  const diffInSecs = Math.floor(diffInMs / 1000)
  const diffInMins = Math.floor(diffInSecs / 60)
  const diffInHours = Math.floor(diffInMins / 60)
  const diffInDays = Math.floor(diffInHours / 24)
  
  if (diffInSecs < 60) return 'just now'
  if (diffInMins < 60) return `${diffInMins}m ago`
  if (diffInHours < 24) return `${diffInHours}h ago`
  if (diffInDays < 7) return `${diffInDays}d ago`
  
  return new Date(date).toLocaleDateString()
}