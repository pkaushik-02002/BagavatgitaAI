import { NextResponse } from "next/server"
import { getFirestore } from "firebase-admin/firestore"
import { app } from "@/lib/firebase-admin"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")

    if (!query) {
      return NextResponse.json({ error: "Search query is required" }, { status: 400 })
    }

    const db = getFirestore(app)
    const versesRef = db.collection("verses")
    
    // Use Firestore's built-in text search capabilities
    const snapshot = await versesRef
      .where("searchableText", ">=", query.toLowerCase())
      .where("searchableText", "<=", query.toLowerCase() + "\uf8ff")
      .limit(20)
      .get()

    const verses = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    return NextResponse.json(verses)
  } catch (error) {
    console.error("Failed to search verses:", error)
    return NextResponse.json({ error: "Failed to search verses" }, { status: 500 })
  }
}
