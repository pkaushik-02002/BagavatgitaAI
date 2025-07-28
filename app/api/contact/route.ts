import { db } from "@/lib/firebase"
import { collection, addDoc } from "firebase/firestore"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = body

    // Validate the input
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Add timestamp to the data
    const contactData = {
      name,
      email,
      subject,
      message,
      createdAt: new Date().toISOString(),
      status: "new" // You can use this to track message status (new, read, replied, etc.)
    }

    // Add to Firestore
    const docRef = await addDoc(collection(db, "contact_messages"), contactData)

    return NextResponse.json({ 
      success: true, 
      message: "Message sent successfully",
      id: docRef.id 
    })
  } catch (error) {
    console.error("Error saving contact message:", error)
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    )
  }
}
