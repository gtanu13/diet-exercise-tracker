"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Activity } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    height: "",
    weight: "",
    gender: "",
    fitnessGoal: "",
    dietPreference: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Simple validation
    if (!formData.name || !formData.email || !formData.password) {
      alert("Please fill in all required fields")
      return
    }

    // Store user data (in real app, this would be sent to backend)
    const userData = {
      ...formData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }

    localStorage.setItem("currentUser", JSON.stringify(userData))
    router.push("/dashboard")
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
        <CardHeader className="text-center pb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Activity className="h-8 w-8 text-green-600" />
            <span className="text-2xl font-bold text-gray-900">FitTracker</span>
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900">Create Your Account</CardTitle>
          <CardDescription className="text-lg text-gray-600">
            Let's set up your personalized health profile
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                placeholder="Create a secure password"
                required
              />
            </div>

            {/* Physical Info */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleInputChange("age", e.target.value)}
                  placeholder="25"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  value={formData.height}
                  onChange={(e) => handleInputChange("height", e.target.value)}
                  placeholder="170"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={formData.weight}
                  onChange={(e) => handleInputChange("weight", e.target.value)}
                  placeholder="70"
                />
              </div>
            </div>

            {/* Gender */}
            <div className="space-y-3">
              <Label>Gender</Label>
              <RadioGroup
                value={formData.gender}
                onValueChange={(value) => handleInputChange("gender", value)}
                className="flex space-x-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female">Female</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="other" />
                  <Label htmlFor="other">Other</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Fitness Goal */}
            <div className="space-y-2">
              <Label>Fitness Goal</Label>
              <Select value={formData.fitnessGoal} onValueChange={(value) => handleInputChange("fitnessGoal", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your primary goal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weight-loss">Weight Loss</SelectItem>
                  <SelectItem value="weight-gain">Weight Gain</SelectItem>
                  <SelectItem value="muscle-gain">Muscle Gain</SelectItem>
                  <SelectItem value="maintenance">Maintain Current Weight</SelectItem>
                  <SelectItem value="general-fitness">General Fitness</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Diet Preference */}
            <div className="space-y-2">
              <Label>Diet Preference</Label>
              <Select
                value={formData.dietPreference}
                onValueChange={(value) => handleInputChange("dietPreference", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your diet preference" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vegetarian">Vegetarian</SelectItem>
                  <SelectItem value="non-vegetarian">Non-Vegetarian</SelectItem>
                  <SelectItem value="vegan">Vegan</SelectItem>
                  <SelectItem value="eggetarian">Eggetarian</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg">
              Create Account & Start Tracking
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="text-green-600 hover:text-green-700 font-medium">
                Sign in here
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
