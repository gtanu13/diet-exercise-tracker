"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Search, Plus } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

// Mock Indian food data
const indianFoods = [
  { name: "Roti (Wheat)", calories: 104, category: "Grains", veg: true },
  { name: "Rice (Cooked)", calories: 130, category: "Grains", veg: true },
  { name: "Dal (Moong)", calories: 118, category: "Pulses", veg: true },
  { name: "Dal (Toor)", calories: 115, category: "Pulses", veg: true },
  { name: "Rajma", calories: 127, category: "Pulses", veg: true },
  { name: "Chole", calories: 164, category: "Pulses", veg: true },
  { name: "Paneer", calories: 265, category: "Dairy", veg: true },
  { name: "Chicken Curry", calories: 180, category: "Non-Veg", veg: false },
  { name: "Fish Curry", calories: 150, category: "Non-Veg", veg: false },
  { name: "Egg Curry", calories: 155, category: "Non-Veg", veg: false },
  { name: "Aloo Sabzi", calories: 85, category: "Vegetables", veg: true },
  { name: "Bhindi Sabzi", calories: 35, category: "Vegetables", veg: true },
  { name: "Palak Sabzi", calories: 23, category: "Vegetables", veg: true },
  { name: "Mixed Vegetables", calories: 55, category: "Vegetables", veg: true },
  { name: "Idli (2 pieces)", calories: 58, category: "South Indian", veg: true },
  { name: "Dosa (Plain)", calories: 168, category: "South Indian", veg: true },
  { name: "Upma", calories: 85, category: "South Indian", veg: true },
  { name: "Poha", calories: 76, category: "Breakfast", veg: true },
  { name: "Paratha (Plain)", calories: 126, category: "Grains", veg: true },
  { name: "Biryani (Veg)", calories: 290, category: "Rice", veg: true },
  { name: "Biryani (Chicken)", calories: 350, category: "Rice", veg: false },
]

export default function LogMealPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMeal, setSelectedMeal] = useState("")
  const [mealType, setMealType] = useState("")
  const [quantity, setQuantity] = useState("1")
  const [selectedFoods, setSelectedFoods] = useState<any[]>([])

  const filteredFoods = indianFoods.filter((food) => food.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const addFood = (food: any) => {
    const existingIndex = selectedFoods.findIndex((f) => f.name === food.name)
    if (existingIndex >= 0) {
      const updated = [...selectedFoods]
      updated[existingIndex].quantity += 1
      setSelectedFoods(updated)
    } else {
      setSelectedFoods([...selectedFoods, { ...food, quantity: 1 }])
    }
  }

  const removeFood = (index: number) => {
    setSelectedFoods(selectedFoods.filter((_, i) => i !== index))
  }

  const updateQuantity = (index: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFood(index)
      return
    }
    const updated = [...selectedFoods]
    updated[index].quantity = newQuantity
    setSelectedFoods(updated)
  }

  const totalCalories = selectedFoods.reduce((sum, food) => sum + food.calories * food.quantity, 0)

  const handleSubmit = () => {
    if (selectedFoods.length === 0 || !mealType) {
      alert("Please select foods and meal type")
      return
    }

    // In real app, this would be sent to backend
    const mealLog = {
      foods: selectedFoods,
      mealType,
      totalCalories,
      timestamp: new Date().toISOString(),
    }

    console.log("Logging meal:", mealLog)
    alert("Meal logged successfully!")
    router.push("/dashboard")
  }

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
          <h1 className="text-3xl font-bold text-gray-900">Log Your Meal</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Food Search */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm mb-6">
              <CardHeader>
                <CardTitle>Search Foods</CardTitle>
                <CardDescription>Find and add foods to your meal</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search Indian foods..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="grid gap-2 max-h-96 overflow-y-auto">
                  {filteredFoods.map((food, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">{food.name}</span>
                          {food.veg ? (
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              Veg
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="bg-red-100 text-red-800">
                              Non-Veg
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          {food.category} • {food.calories} cal per serving
                        </p>
                      </div>
                      <Button size="sm" onClick={() => addFood(food)} className="bg-green-600 hover:bg-green-700">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Selected Foods & Meal Details */}
          <div className="space-y-6">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Meal Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Meal Type</Label>
                  <Select value={mealType} onValueChange={setMealType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select meal type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="breakfast">Breakfast</SelectItem>
                      <SelectItem value="lunch">Lunch</SelectItem>
                      <SelectItem value="dinner">Dinner</SelectItem>
                      <SelectItem value="snack">Snack</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm font-medium text-green-900">Total Calories</p>
                  <p className="text-2xl font-bold text-green-800">{totalCalories}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Selected Foods</CardTitle>
                <CardDescription>{selectedFoods.length} items selected</CardDescription>
              </CardHeader>
              <CardContent>
                {selectedFoods.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No foods selected yet</p>
                ) : (
                  <div className="space-y-3">
                    {selectedFoods.map((food, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{food.name}</p>
                          <p className="text-sm text-gray-600">{food.calories * food.quantity} cal</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline" onClick={() => updateQuantity(index, food.quantity - 1)}>
                            -
                          </Button>
                          <span className="w-8 text-center">{food.quantity}</span>
                          <Button size="sm" variant="outline" onClick={() => updateQuantity(index, food.quantity + 1)}>
                            +
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <Button
                  onClick={handleSubmit}
                  className="w-full mt-6 bg-green-600 hover:bg-green-700"
                  disabled={selectedFoods.length === 0 || !mealType}
                >
                  Log Meal ({totalCalories} calories)
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
