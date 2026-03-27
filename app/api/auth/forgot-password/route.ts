import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import { connectToDatabase } from "@/lib/mongodb"
import { sendPasswordResetEmail } from "@/lib/email"

// Always return the same response to prevent email enumeration
const GENERIC_RESPONSE = {
  message: "If an account with that email exists, we've sent a password reset link.",
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const normalizedEmail = email.toLowerCase().trim()

    const { db } = await connectToDatabase()
    const user = await db.collection("users").findOne({ email: normalizedEmail })

    // Return generic response whether user exists or not (prevents enumeration)
    if (!user) {
      return NextResponse.json(GENERIC_RESPONSE)
    }

    // Generate a cryptographically secure random token (32 bytes → 64 hex chars)
    const rawToken = crypto.randomBytes(32).toString("hex")

    // Store the SHA-256 hash of the token in the database
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex")

    const expiresAt = new Date(Date.now() + 30 * 60 * 1000) // 30 minutes

    await db.collection("users").updateOne(
      { email: normalizedEmail },
      {
        $set: {
          passwordResetToken: hashedToken,
          passwordResetExpires: expiresAt,
          updatedAt: new Date(),
        },
      }
    )

    // Send the raw (unhashed) token in the email link
    await sendPasswordResetEmail(normalizedEmail, rawToken)

    return NextResponse.json(GENERIC_RESPONSE)
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
