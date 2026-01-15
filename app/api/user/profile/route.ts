import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    console.log("Profile API called");
    const session = await getServerSession(authOptions)
    console.log("Session from getServerSession:", session ? { 
      hasUser: !!session.user, 
      hasEmail: !!session.user?.email,
      email: session.user?.email 
    } : "No session");
    
    if (!session?.user?.email) {
      console.log("No session or email, returning 401");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("Fetching profile for user:", session.user.email);
    const { db } = await connectToDatabase()
    
    // Get user profile data including onboarding information
    const user = await db.collection("users").findOne(
      { email: session.user.email },
      { 
        projection: { 
          name: 1,
          email: 1,
          image: 1,
          onboardingCompleted: 1, 
          profile: 1,
          createdAt: 1,
          updatedAt: 1
        } 
      }
    )

    console.log("User found in DB:", user ? "Yes" : "No");

    if (!user) {
      console.log("User not found, returning empty profile");
      // Return default profile if user doesn't have one yet
      return NextResponse.json({
        user: {
          name: session.user.name || "User",
          email: session.user.email,
          image: session.user.image || "/placeholder-user.jpg",
          onboardingCompleted: false,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        profile: {
          skinType: "Not specified",
          concerns: [],
          sensitivity: "Not specified",
          location: "Not specified",
          routine: []
        },
        stats: {
          routineProgress: 0,
          recentSkinScore: 0,
          totalAnalyses: 0,
          totalRoutines: 0
        },
        recentAnalyses: []
      })
    }

    // Get additional user data for profile - handle missing collections gracefully
    let skinAnalyses: any[] = []
    let routineCompletions: any[] = []
    
    try {
      skinAnalyses = await db.collection("skinAnalyses")
        .find({ userId: user._id })
        .sort({ createdAt: -1 })
        .limit(5)
        .toArray()
    } catch (e) {
      console.log("skinAnalyses collection not found or error accessing it");
    }

    try {
      routineCompletions = await db.collection("routineCompletions")
        .find({ userId: user._id })
        .sort({ date: -1 })
        .limit(7)
        .toArray()
    } catch (e) {
      console.log("routineCompletions collection not found or error accessing it");
    }

    // Calculate routine progress
    const routineProgress = routineCompletions.length > 0
      ? (routineCompletions.filter(r => r.completed).length / routineCompletions.length) * 100
      : 0

    // Get recent skin health score
    const recentSkinScore = skinAnalyses.length > 0 
      ? skinAnalyses[0].score || 0
      : 0

    const profileData = {
      user: {
        name: user.name || "User",
        email: user.email,
        image: user.image || "/placeholder-user.jpg",
        onboardingCompleted: user.onboardingCompleted || false,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      profile: user.profile || {
        skinType: "Not specified",
        concerns: [],
        sensitivity: "Not specified",
        location: "Not specified",
        routine: []
      },
      stats: {
        routineProgress: Math.round(routineProgress),
        recentSkinScore,
        totalAnalyses: skinAnalyses.length,
        totalRoutines: routineCompletions.length
      },
      recentAnalyses: skinAnalyses.map(analysis => ({
        id: analysis._id,
        score: analysis.score,
        condition: analysis.condition || "Normal",
        date: analysis.createdAt
      }))
    }

    return NextResponse.json(profileData)
  } catch (error) {
    console.error("Profile API error:", error)
    // Return a default empty profile instead of 500 error
    return NextResponse.json({
      user: {
        name: "User",
        email: "unknown@example.com",
        image: "/placeholder-user.jpg",
        onboardingCompleted: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      profile: {
        skinType: "Not specified",
        concerns: [],
        sensitivity: "Not specified",
        location: "Not specified",
        routine: []
      },
      stats: {
        routineProgress: 0,
        recentSkinScore: 0,
        totalAnalyses: 0,
        totalRoutines: 0
      },
      recentAnalyses: [],
      error: "Could not fetch profile, showing defaults"
    })
  }
}
