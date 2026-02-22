// app/onboarding/page.tsx
"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { ChanseyMascot } from "@/components/chansey-mascot"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"
import { toast } from "sonner"

function OnboardingContent() {
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useSearchParams()
  const emailParam = params.get("email")

  const [userData, setUserData] = useState({
    email: emailParam || session?.user?.email || "",
    skinType: "",
    concerns: [] as string[],
    sensitivity: 50,
    location: "",
    routine: "",
  })

  // Redirect if not logged in
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  // Check if already onboarded
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const res = await fetch("/api/onboarding")
        if (res.ok) {
          const data = await res.json()
          if (data.onboardingCompleted) {
            router.replace("/dashboard")
          }
        }
      } catch (err) {
        console.error("Onboarding status check failed", err)
      }
    }
    if (status === "authenticated") {
      checkOnboardingStatus()
    }
  }, [status, router])

  // Ensure sensitivity is always number
  useEffect(() => {
    if (typeof userData.sensitivity !== "number") {
      setUserData((prev) => ({ ...prev, sensitivity: 50 }))
    }
  }, [userData.sensitivity])

  const handleNext = () => {
    if (step < 4) {
      if (step === 1 && !userData.skinType) {
        toast.error("Please select your skin type")
        return
      }
      if (step === 2 && userData.concerns.length === 0) {
        toast.error("Select at least one concern")
        return
      }
      if (step === 3 && userData.sensitivity === undefined) {
        toast.error("Set your sensitivity level")
        return
      }
      if (step === 4 && !userData.location) {
        toast.error("Please describe your climate")
        return
      }
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      })

      if (res.ok) {
        localStorage.setItem("skinseyProfile", JSON.stringify(userData))
        toast.success("Profile saved! Redirecting...")
        setTimeout(() => router.push("/dashboard"), 1500)
      } else {
        toast.error("Failed to save profile")
      }
    } catch (err) {
      console.error("Onboarding error:", err)
      toast.error("Error saving profile")
    } finally {
      setIsLoading(false)
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-rose-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4 transition-colors duration-500">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md">
        <Card className="border-pink-100 dark:border-pink-900/30 shadow-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm glow-card">
          <CardHeader className="text-center pb-6">
            <ChanseyMascot size="lg" />
            <CardTitle className="text-2xl font-bold text-gray-800 dark:text-pink-100">
              {step === 1 ? "Skin Profile Setup" :
                step === 2 ? "Skin Concerns" :
                  step === 3 ? "Sensitivity Level" :
                    "Environment & Routine"}
            </CardTitle>
            <CardDescription className="dark:text-slate-400">
              {step === 1 ? "What's your skin type?" :
                step === 2 ? "What concerns do you want to address?" :
                  step === 3 ? "How sensitive is your skin?" :
                    "Tell us about your environment"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* Progress bar */}
            <div className="mb-6 bg-pink-100 rounded-full h-2">
              <div
                className="bg-pink-500 h-2 rounded-full transition-all"
                style={{ width: `${(step / 4) * 100}%` }}
              />
            </div>

            {/* Step 1 */}
            {step === 1 && (
              <div className="space-y-4">
                <RadioGroup
                  value={userData.skinType}
                  onValueChange={(value) => setUserData({ ...userData, skinType: value })}
                  className="grid gap-3"
                >
                  {["Dry", "Oily", "Combination", "Normal", "Sensitive"].map((type) => (
                    <div key={type} className="flex items-center space-x-3">
                      <RadioGroupItem value={type.toLowerCase()} id={type.toLowerCase()} className="border-pink-300 dark:border-pink-900/50" />
                      <Label htmlFor={type.toLowerCase()} className="dark:text-slate-300">{type}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div className="space-y-3">
                {["Acne", "Aging", "Dark Spots", "Redness", "Dryness", "Oiliness"].map((c) => (
                  <div key={c} className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id={c.toLowerCase()}
                      checked={userData.concerns.includes(c.toLowerCase())}
                      onChange={(e) => {
                        const newConcerns = e.target.checked
                          ? [...userData.concerns, c.toLowerCase()]
                          : userData.concerns.filter(x => x !== c.toLowerCase())
                        setUserData({ ...userData, concerns: newConcerns })
                      }}
                    />
                    <Label htmlFor={c.toLowerCase()}>{c}</Label>
                  </div>
                ))}
              </div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <div>
                <Label className="dark:text-slate-300">Sensitivity: {userData.sensitivity}/100</Label>
                <Slider
                  value={[userData.sensitivity]}
                  onValueChange={(val) => setUserData({ ...userData, sensitivity: val[0] })}
                  max={100}
                  step={1}
                />
              </div>
            )}

            {/* Step 4 */}
            {step === 4 && (
              <div className="space-y-3">
                <Input
                  placeholder="Your Climate (e.g. Humid, Dry, Cold)"
                  value={userData.location}
                  onChange={(e) => setUserData({ ...userData, location: e.target.value })}
                  className="border-pink-200 dark:border-pink-900/50 bg-white dark:bg-slate-900"
                />
                <textarea
                  placeholder="Your skincare routine (optional)"
                  value={userData.routine}
                  onChange={(e) => setUserData({ ...userData, routine: e.target.value })}
                  className="w-full border border-pink-200 dark:border-pink-900/50 rounded-md p-2 bg-white dark:bg-slate-900 dark:text-slate-100"
                />
              </div>
            )}

            {/* Buttons */}
            <div className="mt-6 flex justify-between">
              {step > 1 && (
                <Button type="button" onClick={handleBack} variant="outline">
                  Back
                </Button>
              )}
              {step < 4 ? (
                <Button type="button" onClick={handleNext}>
                  Next
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={isLoading}>
                  {isLoading ? "Saving..." : "Complete Onboarding"}
                </Button>
              )}
            </div>

            {/* Skip link */}
            <div className="mt-6 text-center text-sm">
              <button
                onClick={async () => {
                  await fetch("/api/onboarding/skip", {
                    method: "POST",
                  })
                  router.push("/dashboard")
                }}
                className="text-pink-600 dark:text-pink-400 hover:underline"
              >
                Skip for now
              </button>


            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OnboardingContent />
    </Suspense>
  )
}
