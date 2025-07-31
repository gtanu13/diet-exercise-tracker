"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Activity, Apple, Target, TrendingUp, Camera, Plus, Bell, Users, Brain, LogOut } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import Link from "next/link"
import { useRouter } from "next/navigation"

// Mock data
const weightData = [
  { date: "2024-01-01", weight: 75 },
  { date: "2024-01-08", weight: 74.5 },
  { date: "2024-01-15", weight: 74.2 },
  { date: "2024-01-22", weight: 73.8 },
  { date: "2024-01-29", weight: 73.5 },
]

const todayMeals = [
  { name: "Oats with Banana", calories: 320, time: "8:00 AM", type: "Breakfast" },
  { name: "Dal Rice with Vegetables", calories: 450, time: "1:00 PM", type: "Lunch" },
  { name: "Green Tea", calories: 5, time: "4:00 PM", type: "Snack" },
]

const recentWorkouts = [
  { name: "Morning Walk", duration: 30, calories: 150, date: "Today" },
  { name: "Yoga Session", duration: 45, calories: 180, date: "Yesterday" },
  { name: "Strength Training", duration: 60, calories: 300, date: "2 days ago" },
]

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [caloriesConsumed, setCaloriesConsumed] = useState(775)
  const [calorieGoal] = useState(2000)
  const [workoutsThisWeek] = useState(4)

  useEffect(() => {
    const userData = localStorage.getItem("currentUser")
    if (!userData) {
      router.push("/login")
      return
    }
    setUser(JSON.parse(userData))
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    router.push("/")
  }

  if (!user) {
    return <div>Loading...</div>
  }

  const calorieProgress = (caloriesConsumed / calorieGoal) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="border-b border-white/20 backdrop-blur-sm bg-white/50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Activity className="h-8 w-8 text-green-600" />
            <span className="text-2xl font-bold text-gray-900">FitTracker</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">Welcome, {user.name}!</span>
            <Button variant="ghost" onClick={handleLogout} className="text-gray-700">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Calories Today</p>
                  <p className="text-2xl font-bold text-gray-900">{caloriesConsumed}</p>
                  <p className="text-xs text-gray-500">of {calorieGoal} goal</p>
                </div>
                <Apple className="h-8 w-8 text-green-600" />
              </div>
              <Progress value={calorieProgress} className="mt-3" />
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Workouts This Week</p>
                  <p className="text-2xl font-bold text-gray-900">{workoutsThisWeek}</p>
                  <p className="text-xs text-gray-500">Great progress!</p>
                </div>
                <Activity className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Current Weight</p>
                  <p className="text-2xl font-bold text-gray-900">73.5 kg</p>
                  <p className="text-xs text-green-600">-1.5 kg this month</p>
                </div>
                <Target className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Streak</p>
                  <p className="text-2xl font-bold text-gray-900">12 days</p>
                  <p className="text-xs text-gray-500">Keep it up!</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Logging */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="meals" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm">
                <TabsTrigger value="meals">Meals</TabsTrigger>
                <TabsTrigger value="workouts">Workouts</TabsTrigger>
                <TabsTrigger value="weight">Weight</TabsTrigger>
                <TabsTrigger value="photos">Photos</TabsTrigger>
              </TabsList>

              <TabsContent value="meals" className="space-y-4">
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Today's Meals</CardTitle>
                      <CardDescription>Track your daily nutrition</CardDescription>
                    </div>
                    <Link href="/log-meal">
                      <Button className="bg-green-600 hover:bg-green-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Log Meal
                      </Button>
                    </Link>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {todayMeals.map((meal, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">{meal.name}</p>
                            <p className="text-sm text-gray-600">
                              {meal.time} • {meal.type}
                            </p>
                          </div>
                          <Badge variant="secondary">{meal.calories} cal</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="workouts" className="space-y-4">
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Recent Workouts</CardTitle>
                      <CardDescription>Your exercise history</CardDescription>
                    </div>
                    <Link href="/log-workout">
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Log Workout
                      </Button>
                    </Link>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentWorkouts.map((workout, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">{workout.name}</p>
                            <p className="text-sm text-gray-600">
                              {workout.duration} min • {workout.date}
                            </p>
                          </div>
                          <Badge variant="secondary">{workout.calories} cal burned</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="weight" className="space-y-4">
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Weight Progress</CardTitle>
                      <CardDescription>Track your weight over time</CardDescription>
                    </div>
                    <Link href="/log-weight">
                      <Button className="bg-purple-600 hover:bg-purple-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Log Weight
                      </Button>
                    </Link>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={weightData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="weight" stroke="#8b5cf6" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="photos" className="space-y-4">
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Progress Photos</CardTitle>
                      <CardDescription>Visual progress tracking</CardDescription>
                    </div>
                    <Button className="bg-orange-600 hover:bg-orange-700">
                      <Camera className="h-4 w-4 mr-2" />
                      Add Photo
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                        <Camera className="h-8 w-8 text-gray-400" />
                      </div>
                      <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                        <Camera className="h-8 w-8 text-gray-400" />
                      </div>
                      <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                        <Camera className="h-8 w-8 text-gray-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Insights & Features */}
          <div className="space-y-6">
            {/* AI Suggestions */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="h-5 w-5 mr-2 text-purple-600" />
                  Smart Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm font-medium text-purple-900">Meal Suggestion</p>
                  <p className="text-sm text-purple-700">
                    Try quinoa salad with vegetables for lunch - perfect for your weight loss goal!
                  </p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-900">Workout Tip</p>
                  <p className="text-sm text-blue-700">Add 15 minutes of cardio to boost your calorie burn today.</p>
                </div>
              </CardContent>
            </Card>

            {/* Reminders */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2 text-orange-600" />
                  Reminders
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Meal Reminders</p>
                    <p className="text-xs text-gray-600">8:00 AM, 1:00 PM, 8:00 PM</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Workout Reminders</p>
                    <p className="text-xs text-gray-600">6:00 AM, 6:00 PM</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Coming Soon Features */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Coming Soon</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start bg-transparent" disabled>
                  <Users className="h-4 w-4 mr-2" />
                  Connect with Friends
                  <Badge variant="secondary" className="ml-auto">
                    Soon
                  </Badge>
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent" disabled>
                  <Brain className="h-4 w-4 mr-2" />
                  AI Meal Plans
                  <Badge variant="secondary" className="ml-auto">
                    Soon
                  </Badge>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
