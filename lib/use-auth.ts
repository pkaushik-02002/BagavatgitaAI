// @/lib/use-auth.ts
"use client"

import { useState, useEffect } from "react"
import {
  type User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  onAuthStateChanged, // Keep onAuthStateChanged for the listener
  type Auth,
} from "firebase/auth"
import type { Analytics } from "firebase/analytics"
import { getFirebaseAuth, getFirebaseAnalytics } from "@/lib/firebase" // Import the new getter functions

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [authInstance, setAuthInstance] = useState<Auth | null>(null)
  const [analyticsInstance, setAnalyticsInstance] = useState<Analytics | null>(null)

  useEffect(() => {
    const initializeFirebase = async () => {
      const auth = await getFirebaseAuth()
      const analytics = await getFirebaseAnalytics()

      if (auth) {
        setAuthInstance(auth)
        setAnalyticsInstance(analytics)

        // Set up auth state listener once auth instance is available
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          setUser(user)
          setLoading(false)
        })
        return () => unsubscribe() // Cleanup subscription
      } else {
        console.error("Firebase Auth instance could not be obtained.")
        setLoading(false)
      }
    }

    initializeFirebase()
  }, []) // Empty dependency array: runs once on mount

  // All authentication functions now rely on authInstance being set
  const signIn = async (email: string, password: string) => {
    if (!authInstance) {
      console.error("Firebase Auth not initialized during signIn attempt.")
      return { success: false, error: "Authentication service not ready. Please try again." }
    }
    try {
      await signInWithEmailAndPassword(authInstance, email, password)
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  const signUp = async (email: string, password: string) => {
    if (!authInstance) {
      console.error("Firebase Auth not initialized during signUp attempt.")
      return { success: false, error: "Authentication service not ready. Please try again." }
    }
    try {
      await createUserWithEmailAndPassword(authInstance, email, password)
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  const signInWithGoogle = async () => {
    if (!authInstance) {
      console.error("Firebase Auth not initialized during signInWithGoogle attempt.")
      return { success: false, error: "Authentication service not ready. Please try again." }
    }
    try {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(authInstance, provider)
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  const resetPassword = async (email: string) => {
    if (!authInstance) {
      console.error("Firebase Auth not initialized during resetPassword attempt.")
      return { success: false, error: "Authentication service not ready. Please try again." }
    }
    try {
      await sendPasswordResetEmail(authInstance, email)
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  const logout = async () => {
    if (!authInstance) {
      console.error("Firebase Auth not initialized during logout attempt.")
      return { success: false, error: "Authentication service not ready. Please try again." }
    }
    try {
      await signOut(authInstance)
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  return {
    user,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    resetPassword,
    logout,
    analytics: analyticsInstance,
  }
}