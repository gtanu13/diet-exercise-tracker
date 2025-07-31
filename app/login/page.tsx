"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Activity } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Simple demo login (in real app, this would authenticate with backend)
    if (formData.email && formData.password) {
      // Create a demo user for login
      const demoUser = {
        id: "1",
        name: "Demo User",
        email: formData.email,
        age: "28",
        height: "170",
        weight: "70",
        gender: "male",
        fitnessGoal: "weight-loss",
        dietPreference: "vegetarian",
        createdAt: new Date().toISOString(),
      }

      localStorage.setItem("currentUser", JSON.stringify(demoUser))
      router.push("/dashboard")
    } else {
      alert("Please enter email and password")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
        <CardHeader className="text-center pb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Activity className="h-8 w-8 text-green-600" />
            <span className="text-2xl font-bold text-gray-900">FitTracker</span>
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900">Welcome Back</CardTitle>
          <CardDescription className="text-lg text-gray-600">Sign in to continue your health journey</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                placeholder="Enter your password"
                required
              />
            </div>

            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg">
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link href="/signup" className="text-green-600 hover:text-green-700 font-medium">
                Sign up here
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
