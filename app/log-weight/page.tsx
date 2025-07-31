"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Scale, Ruler } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function LogWeightPage() {
  const router = useRouter()
  const [measurements, setMeasurements] = useState({
    weight: "",
    waist: "",
    chest: "",
    hips: "",
    arms: "",
    thighs: "",
    notes: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setMeasurements((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    if (!measurements.weight) {
      alert("Please enter your weight")
      return
    }

    // In real app, this would be sent to backend
    const measurementLog = {
      ...measurements,
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleDateString(),
    }

    console.log("Logging measurements:", measurementLog)
    alert("Measurements logged successfully!")
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
          <h1 className="text-3xl font-bold text-gray-900">Log Weight & Measurements</h1>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center">
                <Scale className="h-6 w-6 mr-2 text-purple-600" />
                Track Your Progress
              </CardTitle>
              <CardDescription>
                Record your weight and body measurements to monitor your fitness journey
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Weight */}
              <div className="space-y-2">
                <Label htmlFor="weight" className="flex items-center">
                  <Scale className="h-4 w-4 mr-2 text-purple-600" />
                  Weight (kg) *
                </Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  placeholder="70.5"
                  value={measurements.weight}
                  onChange={(e) => handleInputChange("weight", e.target.value)}
                  className="text-lg"
                />
              </div>

              {/* Body Measurements */}
              <div className="space-y-4">
                <div className="flex items-center mb-3">
                  <Ruler className="h-5 w-5 mr-2 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Body Measurements (cm)</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="waist">Waist</Label>
                    <Input
                      id="waist"
                      type="number"
                      step="0.1"
                      placeholder="80.0"
                      value={measurements.waist}
                      onChange={(e) => handleInputChange("waist", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="chest">Chest</Label>
                    <Input
                      id="chest"
                      type="number"
                      step="0.1"
                      placeholder="95.0"
                      value={measurements.chest}
                      onChange={(e) => handleInputChange("chest", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hips">Hips</Label>
                    <Input
                      id="hips"
                      type="number"
                      step="0.1"
                      placeholder="90.0"
                      value={measurements.hips}
                      onChange={(e) => handleInputChange("hips", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="arms">Arms</Label>
                    <Input
                      id="arms"
                      type="number"
                      step="0.1"
                      placeholder="30.0"
                      value={measurements.arms}
                      onChange={(e) => handleInputChange("arms", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="thighs">Thighs</Label>
                    <Input
                      id="thighs"
                      type="number"
                      step="0.1"
                      placeholder="55.0"
                      value={measurements.thighs}
                      onChange={(e) => handleInputChange("thighs", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Input
                  id="notes"
                  placeholder="How are you feeling today?"
                  value={measurements.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                />
              </div>

              {/* Progress Indicator */}
              {measurements.weight && (
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm font-medium text-purple-900 mb-2">Today's Entry</p>
                  <div className="space-y-1 text-sm text-purple-700">
                    <p>Weight: {measurements.weight} kg</p>
                    {measurements.waist && <p>Waist: {measurements.waist} cm</p>}
                    {measurements.chest && <p>Chest: {measurements.chest} cm</p>}
                    {measurements.hips && <p>Hips: {measurements.hips} cm</p>}
                  </div>
                </div>
              )}

              <Button
                onClick={handleSubmit}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 text-lg"
                disabled={!measurements.weight}
              >
                Save Measurements
              </Button>
            </CardContent>
          </Card>

          {/* Tips Card */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Measurement Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• Measure at the same time each day (preferably morning)</p>
                <p>• Use the same scale and measuring tape consistently</p>
                <p>• Take measurements before eating or drinking</p>
                <p>• Stand straight and breathe normally while measuring</p>
                <p>• Track trends over weeks, not daily fluctuations</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
