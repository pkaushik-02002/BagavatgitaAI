// @/lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app"
import type { Auth } from "firebase/auth" // Import types only
import type { Analytics } from "firebase/analytics" // Import types only

// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || process.env.FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || process.env.FIREBASE_MEASUREMENT_ID,
}

// Initialize Firebase app only once
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()

// Export functions to get Auth and Analytics instances using dynamic imports
export async function getFirebaseAuth(): Promise<Auth | null> {
  if (typeof window !== "undefined") {
    try {
      const { getAuth } = await import("firebase/auth")
      return getAuth(app)
    } catch (e) {
      console.error("Error getting Firebase Auth instance:", e)
      return null
    }
  }
  return null
}

export async function getFirebaseAnalytics(): Promise<Analytics | null> {
  if (typeof window !== "undefined") {
    try {
      const { getAnalytics } = await import("firebase/analytics")
      return getAnalytics(app)
    } catch (e) {
      console.error("Error getting Firebase Analytics instance:", e)
      return null
    }
  }
  return null
}
