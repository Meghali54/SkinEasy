import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import bcrypt from "bcryptjs"
import { connectToDatabase } from "@/lib/mongodb"

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json()

    if (!token || !password) {
      return NextResponse.json(
        { error: "Token and password are required" },
        { status: 400 }
      )
    }

    if (typeof token !== "string" || typeof password !== "string") {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      )
    }

    // Hash the incoming token to compare against the stored hash
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex")

    const { db } = await connectToDatabase()

    const user = await db.collection("users").findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: new Date() }, // token must not be expired
    })

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired password reset token" },
        { status: 400 }
      )
    }

    // Hash the new password before storing
    const hashedPassword = await bcrypt.hash(password, 12)

    // Update password and clear reset token fields
    await db.collection("users").updateOne(
      { _id: user._id },
      {
        $set: {
          password: hashedPassword,
          updatedAt: new Date(),
        },
        $unset: {
          passwordResetToken: "",
          passwordResetExpires: "",
        },
      }
    )

    return NextResponse.json({ message: "Password reset successfully" })
  } catch (error) {
    console.error("Reset password error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
