import { NextResponse } from "next/server"
import { db } from "@/lib/firebase-admin"

export async function GET() {
  try {
    const chaptersRef = db.collection("chapters")
    const snapshot = await chaptersRef.orderBy("chapter_number").get()

    if (snapshot.empty) {
      return NextResponse.json([])
    }

    const chapters = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }))

    return NextResponse.json(chapters)
  } catch (error) {
    console.error("Failed to fetch chapters:", error)
    return NextResponse.json(
      { error: "Failed to fetch chapters" },
      { status: 500 }
    )
  }
}
