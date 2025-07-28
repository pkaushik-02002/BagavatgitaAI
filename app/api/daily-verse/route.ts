import { NextResponse } from "next/server"
import { getFirestore } from "firebase-admin/firestore"
import { app } from "@/lib/firebase-admin"

export async function GET() {
  try {
    const db = getFirestore(app)
    const versesRef = db.collection("verses")

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0]

    // Use today's date to seed a random selection
    // This ensures the same verse is shown all day but changes daily
    const snapshot = await versesRef
      .orderBy("chapter")
      .orderBy("verse")
      .get()

    const verses = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    // Use today's date as a seed for random selection
    const dateSeed = parseInt(today.replace(/-/g, ""))
    const selectedIndex = dateSeed % verses.length
    const dailyVerse = verses[selectedIndex]

    return NextResponse.json({
      date: today,
      verse: dailyVerse
    })
  } catch (error) {
    console.error("Failed to fetch daily verse:", error)
    return NextResponse.json({ error: "Failed to fetch daily verse" }, { status: 500 })
  }
}
