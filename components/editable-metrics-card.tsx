"use client"

import { useState, useEffect } from "react"
import { Pencil, Save, X } from "lucide-react"
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { EmailCaptureDialog } from "@/components/email-capture-dialog"
import { OverwriteConfirmDialog } from "@/components/overwrite-confirm-dialog"
import { saveUserAnalytics, getUserAnalytics } from "@/app/actions/analytics"
import { useToast } from "@/hooks/use-toast"

const defaultData = [
  { hour: "9 AM", responseTime: 2.3 },
  { hour: "10 AM", responseTime: 2.8 },
  { hour: "11 AM", responseTime: 3.2 },
  { hour: "12 PM", responseTime: 2.9 },
  { hour: "1 PM", responseTime: 2.5 },
  { hour: "2 PM", responseTime: 2.7 },
  { hour: "3 PM", responseTime: 3.1 },
  { hour: "4 PM", responseTime: 3.4 },
  { hour: "5 PM", responseTime: 2.8 },
]

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900/95 border border-gray-700 rounded-lg p-3 shadow-lg">
        <p className="text-white text-sm font-medium">{`Hour: ${payload[0].payload.hour}`}</p>
        <p className="text-purple-300 text-sm">{`Response Time: ${payload[0].value}s`}</p>
      </div>
    )
  }
  return null
}

export function EditableMetricsCard() {
  const [chartData, setChartData] = useState(defaultData)
  const [isEditing, setIsEditing] = useState(false)
  const [editValues, setEditValues] = useState(defaultData)
  const [showEmailDialog, setShowEmailDialog] = useState(false)
  const [showOverwriteDialog, setShowOverwriteDialog] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [previousValues, setPreviousValues] = useState<typeof defaultData | null>(null)
  const [pendingValues, setPendingValues] = useState<typeof defaultData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const savedEmail = localStorage.getItem("userEmail")

    if (savedEmail) {
      setUserEmail(savedEmail)
      loadDataFromSupabase(savedEmail)
    }
  }, [])

  const loadDataFromSupabase = async (email: string) => {
    setIsLoading(true)
    try {
      const result = await getUserAnalytics(email)
      if (result.error) {
        toast({
          title: "Error loading data",
          description: result.error,
          variant: "destructive",
        })
      } else if (result.data) {
        // Convert metrics back to chart data format
        const metricsArray = [
          result.data.successRate,
          result.data.avgHandlingTime,
          result.data.totalCalls,
          result.data.satisfactionScore,
        ]

        const loadedData = defaultData.map((item, index) => ({
          ...item,
          responseTime: metricsArray[index] || item.responseTime,
        }))
        setChartData(loadedData)
        setEditValues(loadedData)
      }
    } catch (error) {
      console.error("[v0] Error loading from Supabase:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
    setEditValues([...chartData])
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditValues([...chartData])
  }

  const handleSave = () => {
    // If no email, show email capture dialog
    if (!userEmail) {
      setPendingValues(editValues)
      setShowEmailDialog(true)
      return
    }

    // If email exists and data is different, show overwrite confirmation
    const dataChanged = JSON.stringify(chartData) !== JSON.stringify(editValues)
    if (dataChanged) {
      setPreviousValues(chartData)
      setPendingValues(editValues)
      setShowOverwriteDialog(true)
    } else {
      setIsEditing(false)
    }
  }

  const handleEmailSubmit = async (email: string) => {
    setUserEmail(email)
    localStorage.setItem("userEmail", email)

    if (pendingValues) {
      await saveDataToSupabase(email, pendingValues)
    }

    setShowEmailDialog(false)
  }

  const handleOverwriteConfirm = async () => {
    if (pendingValues && userEmail) {
      await saveDataToSupabase(userEmail, pendingValues)
    }
    setShowOverwriteDialog(false)
  }

  const saveDataToSupabase = async (email: string, data: typeof defaultData) => {
    setIsLoading(true)
    try {
      // Convert chart data to metrics format - using first 4 values
      const metrics = {
        successRate: data[0]?.responseTime || 0,
        avgHandlingTime: data[1]?.responseTime || 0,
        totalCalls: data[2]?.responseTime || 0,
        satisfactionScore: data[3]?.responseTime || 0,
      }

      const result = await saveUserAnalytics(email, metrics)

      if (result.error) {
        toast({
          title: "Error saving data",
          description: result.error,
          variant: "destructive",
        })
      } else {
        setChartData(data)
        localStorage.setItem("chartData", JSON.stringify(data))
        setIsEditing(false)
        setPendingValues(null)
        toast({
          title: "Data saved successfully",
          description: "Your custom analytics have been saved to the cloud.",
        })
      }
    } catch (error) {
      console.error("[v0] Error saving to Supabase:", error)
      toast({
        title: "Error",
        description: "Failed to save data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleValueChange = (index: number, value: string) => {
    const numValue = Number.parseFloat(value)
    if (!isNaN(numValue) && numValue >= 0) {
      const newValues = [...editValues]
      newValues[index] = { ...newValues[index], responseTime: numValue }
      setEditValues(newValues)
    }
  }

  return (
    <>
      <Card className="border-border/50 shadow-sm">
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle className="text-2xl font-semibold">Response Time Metrics</CardTitle>
            <CardDescription className="text-pretty">
              Average response time per hour (in seconds) - Customize this data
            </CardDescription>
          </div>
          {!isEditing ? (
            <Button
              onClick={handleEdit}
              variant="outline"
              size="sm"
              className="gap-2 bg-transparent"
              disabled={isLoading}
            >
              <Pencil className="h-4 w-4" />
              Edit Values
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                onClick={handleCancel}
                variant="outline"
                size="sm"
                className="gap-2 bg-transparent"
                disabled={isLoading}
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
              <Button onClick={handleSave} size="sm" className="gap-2" disabled={isLoading}>
                <Save className="h-4 w-4" />
                {isLoading ? "Saving..." : "Save"}
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {isEditing && (
            <div className="mb-6 grid grid-cols-3 md:grid-cols-5 gap-4">
              {editValues.map((item, index) => (
                <div key={`edit-${index}`} className="space-y-1">
                  <Label htmlFor={`value-${index}`} className="text-xs text-foreground">
                    {item.hour}
                  </Label>
                  <Input
                    id={`value-${index}`}
                    type="number"
                    step="0.1"
                    min="0"
                    value={item.responseTime}
                    onChange={(e) => handleValueChange(index, e.target.value)}
                    className="h-9"
                  />
                </div>
              ))}
            </div>
          )}

          <div className="h-[300px] w-full">
            <LineChart
              width={800}
              height={300}
              data={isEditing ? editValues : chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
              <XAxis dataKey="hour" stroke="#737373" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis
                stroke="#737373"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}s`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="responseTime"
                stroke="rgb(196, 181, 253)"
                strokeWidth={2}
                dot={{ fill: "rgb(196, 181, 253)", r: 4 }}
              />
            </LineChart>
          </div>

          {userEmail && (
            <p className="mt-4 text-sm text-muted-foreground">
              Saving data for: <span className="font-medium text-foreground">{userEmail}</span>
            </p>
          )}
        </CardContent>
      </Card>

      <EmailCaptureDialog open={showEmailDialog} onOpenChange={setShowEmailDialog} onSubmit={handleEmailSubmit} />

      <OverwriteConfirmDialog
        open={showOverwriteDialog}
        onOpenChange={setShowOverwriteDialog}
        previousValues={previousValues || defaultData}
        newValues={pendingValues || defaultData}
        onConfirm={handleOverwriteConfirm}
      />
    </>
  )
}
