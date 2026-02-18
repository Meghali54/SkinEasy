import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Camera, BarChart3, Calendar, MessageCircle } from "lucide-react"
import Link from "next/link"
import { ChanseyMascot } from "@/components/chansey-mascot"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
      
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <ChanseyMascot size="lg" />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Skinsey</h1>
              <p className="text-sm text-gray-600 font-medium">
                Your gentle skin health companion
              </p>
            </div>
          </div>

          {/* Auth Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="border-pink-200 text-pink-700 hover:bg-pink-50 rounded-full px-6"
              asChild
            >
              <Link href="/login">Login</Link>
            </Button>

            <Button
              className="bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-white rounded-full px-6 shadow-lg"
              asChild
            >
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="border-pink-100 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <Badge className="bg-pink-100 text-pink-700 px-4 py-1 rounded-full">
                  <Sparkles className="w-4 h-4 mr-1" />
                  AI-Powered Dermatology
                </Badge>
              </div>

              <div className="flex justify-center mb-4">
                <ChanseyMascot size="xl" />
              </div>

              <CardTitle className="text-4xl font-bold text-gray-800 mb-4">
                Join Skinsey Today
              </CardTitle>

              <CardDescription className="text-lg text-gray-600 max-w-2xl mx-auto">
                Experience personalized skin care with advanced AI technology.
                Meet Chansey AI, your friendly dermatology companion.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Button
                size="lg"
                className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-full px-8 py-3 text-lg font-semibold shadow-lg transform hover:scale-105 transition-all duration-200"
                asChild
              >
                <Link href="/signup">Start Your Skin Journey</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Comprehensive Skin Care Features
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Everything you need to maintain healthy, beautiful skin with AI guidance.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">

          {/* Dashboard */}
          <Link href="/login" className="block">
            <Card className="border-pink-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white/90 cursor-pointer">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-pink-600" />
                </div>
                <CardTitle>Skin Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Track your skin health progress with insights and analytics.
                </CardDescription>
              </CardContent>
            </Card>
          </Link>

          {/* Analyzer */}
          <Link href="/login" className="block">
            <Card className="border-pink-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white/90 cursor-pointer">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Camera className="w-8 h-8 text-pink-600" />
                </div>
                <CardTitle>Skin Analyzer</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  AI-powered skin analysis using your photos.
                </CardDescription>
              </CardContent>
            </Card>
          </Link>

          {/* Scheduling */}
          <Link href="/login" className="block">
            <Card className="border-pink-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white/90 cursor-pointer">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-pink-600" />
                </div>
                <CardTitle>Smart Scheduling</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Book dermatologist appointments and set reminders.
                </CardDescription>
              </CardContent>
            </Card>
          </Link>

          {/* AI Chat */}
          <Link href="/login" className="block">
            <Card className="border-pink-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white/90 cursor-pointer">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-pink-600" />
                </div>
                <CardTitle>Chansey AI Chat</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Get personalized skincare advice instantly.
                </CardDescription>
              </CardContent>
            </Card>
          </Link>

        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-pink-100">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <ChanseyMascot size="sm" />
            <span className="text-gray-600">
              © 2025 Skinsey. All rights reserved.
            </span>
          </div>

          <div className="flex gap-6 text-sm text-gray-500">
            <Link href="#" className="hover:text-pink-600">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-pink-600">
              Terms of Service
            </Link>
            <Link href="#" className="hover:text-pink-600">
              Contact
            </Link>
          </div>
        </div>
      </footer>

    </div>
  )
}
