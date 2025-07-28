// @/lib/firebase-admin.ts
import * as admin from "firebase-admin"

// Initialize Firebase Admin if it hasn't been initialized
function getFirebaseAdmin() {
  if (!admin.apps.length) {
    // Parse the service account key if it's a JSON string
    let serviceAccount
    try {
      serviceAccount = JSON.parse(
        process.env.FIREBASE_SERVICE_ACCOUNT_KEY || "{}"
      )
    } catch (error) {
      console.error("Error parsing Firebase service account:", error)
      serviceAccount = {}
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    })
  }

  return admin
}

// Export the admin instance and app
export const adminAuth = getFirebaseAdmin().auth()
export const app = getFirebaseAdmin().app()

// Export Firestore for use in API routes
export const db = getFirebaseAdmin().firestore()

// Export Storage if needed
export const storage = getFirebaseAdmin().storage()

// Export other Firebase Admin services as needed
export const firebaseAdmin = getFirebaseAdmin()
