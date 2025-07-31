"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Clock, Zap } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

// Mock workout data with calorie burn rates (per minute)
const workoutTypes = [
  { name: "Walking (Slow)", caloriesPerMin: 3.5, category: "Cardio" },
  { name: "Walking (Brisk)", caloriesPerMin: 5, category: "Cardio" },
  { name: "Running (6 mph)", caloriesPerMin: 10, category: "Cardio" },
  { name: "Running (8 mph)", caloriesPerMin: 13, category: "Cardio" },
  { name: "Cycling (Moderate)", caloriesPerMin: 8, category: "Cardio" },
  { name: "Cycling (Vigorous)", caloriesPerMin: 12, category: "Cardio" },
  { name: "Swimming", caloriesPerMin: 11, category: "Cardio" },
  { name: "Yoga", caloriesPerMin: 3, category: "Flexibility" },
  { name: "Pilates", caloriesPerMin: 4, category: "Flexibility" },
  { name: "Weight Training", caloriesPerMin: 6, category: "Strength" },
  { name: "Bodyweight Exercises", caloriesPerMin: 8, category: "Strength" },
  { name: "CrossFit", caloriesPerMin: 15, category: "HIIT" },
  { name: "HIIT Training", caloriesPerMin: 12, category: "HIIT" },
  { name: "Dancing", caloriesPerMin: 5, category: "Fun" },
  { name: "Badminton", caloriesPerMin: 7, category: "Sports" },
  { name: "Cricket", caloriesPerMin: 5, category: "Sports" },
  { name: "Football", caloriesPerMin: 9, category: "Sports" },
  { name: "Basketball", caloriesPerMin: 8, category: "Sports" },
]

export default function LogWorkoutPage() {
  const router = useRouter()
  const [selectedWorkout, setSelectedWorkout] = useState("")
  const [duration, setDuration] = useState("")
  const [intensity, setIntensity] = useState("moderate")
  const [notes, setNotes] = useState("")

  const selectedWorkoutData = workoutTypes.find((w) => w.name === selectedWorkout)

  const calculateCalories = () => {
    if (!selectedWorkoutData || !duration) return 0

    let multiplier = 1
    if (intensity === "low") multiplier = 0.8
    if (intensity === "high") multiplier = 1.2

    return Math.round(selectedWorkoutData.caloriesPerMin * Number.parseInt(duration) * multiplier)
  }

  const estimatedCalories = calculateCalories()

  const handleSubmit = () => {
    if (!selectedWorkout || !duration) {
      alert("Please select workout type and duration")
      return
    }

    // In real app, this would be sent to backend
    const workoutLog = {
      workout: selectedWorkout,
      duration: Number.parseInt(duration),
      intensity,
      caloriesBurned: estimatedCalories,
      notes,
      timestamp: new Date().toISOString(),
    }

    console.log("Logging workout:", workoutLog)
    alert("Workout logged successfully!")
    router.push("/dashboard")
  }

  const groupedWorkouts = workoutTypes.reduce(
    (acc, workout) => {
      if (!acc[workout.category]) {
        acc[workout.category] = []
      }
      acc[workout.category].push(workout)
      return acc
    },
    {} as Record<string, typeof workoutTypes>,
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Log Your Workout</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Workout Selection */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Select Workout Type</CardTitle>
                <CardDescription>Choose from popular exercise options</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {Object.entries(groupedWorkouts).map(([category, workouts]) => (
                    <div key={category}>
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                        {category}
                        <Badge variant="outline" className="ml-2">
                          {workouts.length}
                        </Badge>
                      </h3>
                      <div className="grid md:grid-cols-2 gap-2">
                        {workouts.map((workout) => (
                          <div
                            key={workout.name}
                            className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                              selectedWorkout === workout.name
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                            }`}
                            onClick={() => setSelectedWorkout(workout.name)}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-gray-900">{workout.name}</span>
                              <Badge variant="secondary" className="text-xs">
                                {workout.caloriesPerMin} cal/min
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Workout Details */}
          <div className="space-y-6">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Workout Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="duration"
                      type="number"
                      placeholder="30"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Intensity Level</Label>
                  <Select value={intensity} onValueChange={setIntensity}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low Intensity</SelectItem>
                      <SelectItem value="moderate">Moderate Intensity</SelectItem>
                      <SelectItem value="high">High Intensity</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Input
                    id="notes"
                    placeholder="How did it feel?"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>

                {selectedWorkout && duration && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Zap className="h-5 w-5 text-blue-600 mr-2" />
                      <p className="font-medium text-blue-900">Estimated Calories Burned</p>
                    </div>
                    <p className="text-3xl font-bold text-blue-800">{estimatedCalories}</p>
                    <p className="text-sm text-blue-600">
                      {selectedWorkout} • {duration} min • {intensity} intensity
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Quick Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-gray-600">
                  <p>• Stay hydrated during your workout</p>
                  <p>• Listen to your body and rest when needed</p>
                  <p>• Consistency is more important than intensity</p>
                  <p>• Track your progress over time</p>
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={handleSubmit}
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={!selectedWorkout || !duration}
            >
              Log Workout ({estimatedCalories} calories burned)
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
