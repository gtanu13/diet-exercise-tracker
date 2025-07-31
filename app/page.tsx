"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, Apple, Target, Users, Brain, Bell } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const user = localStorage.getItem("currentUser")
    setIsLoggedIn(!!user)
  }, [])

  if (isLoggedIn) {
    window.location.href = "/dashboard"
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="border-b border-white/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Activity className="h-8 w-8 text-green-600" />
            <span className="text-2xl font-bold text-gray-900">FitTracker</span>
          </div>
          <div className="space-x-4">
            <Link href="/login">
              <Button variant="ghost" className="text-gray-700 hover:text-gray-900">
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-green-600 hover:bg-green-700 text-white">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Your Personal
            <span className="text-green-600"> Health </span>
            Companion
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Track your diet, exercise, and progress with intelligent insights. Designed for Indian nutrition and
            lifestyle preferences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg">
                Start Your Journey
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="px-8 py-4 text-lg border-gray-300 bg-transparent">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything You Need</h2>
          <p className="text-xl text-gray-600">Comprehensive health tracking made simple</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <Apple className="h-12 w-12 text-green-600 mb-4" />
              <CardTitle className="text-xl">Smart Meal Logging</CardTitle>
              <CardDescription>
                Track your meals with Indian nutrition data. Veg/non-veg preferences supported.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <Activity className="h-12 w-12 text-blue-600 mb-4" />
              <CardTitle className="text-xl">Workout Tracking</CardTitle>
              <CardDescription>
                Log workouts with automatic calorie burn estimation based on your profile.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <Target className="h-12 w-12 text-purple-600 mb-4" />
              <CardTitle className="text-xl">Progress Monitoring</CardTitle>
              <CardDescription>Track weight, measurements, and progress photos with beautiful charts.</CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <Brain className="h-12 w-12 text-orange-600 mb-4" />
              <CardTitle className="text-xl">AI Recommendations</CardTitle>
              <CardDescription>Get personalized meal and workout suggestions based on your goals.</CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <Bell className="h-12 w-12 text-red-600 mb-4" />
              <CardTitle className="text-xl">Smart Reminders</CardTitle>
              <CardDescription>Never miss a meal or workout with intelligent reminder system.</CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <Users className="h-12 w-12 text-indigo-600 mb-4" />
              <CardTitle className="text-xl">Social Features</CardTitle>
              <CardDescription>
                Connect with friends and share your fitness journey together.
                <Badge variant="secondary" className="ml-2">
                  Coming Soon
                </Badge>
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <Card className="border-0 shadow-2xl bg-gradient-to-r from-green-600 to-blue-600 text-white">
          <CardContent className="py-16">
            <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Health?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of users who are already achieving their fitness goals
            </p>
            <Link href="/signup">
              <Button size="lg" variant="secondary" className="px-8 py-4 text-lg">
                Start Free Today
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8 text-center text-gray-600">
          <p>&copy; 2024 FitTracker. Made with ❤️ for healthier living.</p>
        </div>
      </footer>
    </div>
  )
}
