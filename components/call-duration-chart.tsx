"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const durationData = [
  { time: "00:00", duration: 3.2 },
  { time: "02:00", duration: 3.8 },
  { time: "04:00", duration: 4.5 },
  { time: "06:00", duration: 5.2 },
  { time: "08:00", duration: 6.1 },
  { time: "10:00", duration: 5.8 },
  { time: "12:00", duration: 5.4 },
  { time: "14:00", duration: 4.9 },
  { time: "16:00", duration: 4.2 },
  { time: "18:00", duration: 3.6 },
  { time: "20:00", duration: 3.1 },
  { time: "22:00", duration: 2.8 },
]

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900/95 border border-gray-700 rounded-lg p-3 shadow-lg">
        <p className="text-white text-sm font-medium">{`Time: ${payload[0].payload.time}`}</p>
        <p className="text-purple-300 text-sm">{`Duration: ${payload[0].value}m`}</p>
      </div>
    )
  }
  return null
}

export function CallDurationChart() {
  const purpleColor = "rgb(250, 248, 255)"

  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">Call Duration Analysis</CardTitle>
        <CardDescription className="text-pretty">Average call duration throughout the day (in minutes)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <AreaChart width={800} height={300} data={durationData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorDuration" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ffffff" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#ffffff" stopOpacity={0.05} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 5, 255, 0.1)" vertical={false} />
            <XAxis dataKey="time" stroke="rgba(255, 255, 255, 0.7)" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis
              stroke="rgba(255, 255, 255, 0.7)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}m`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="duration" stroke={purpleColor} strokeWidth={2} fill="url(#colorDuration)" />
          </AreaChart>
        </div>
      </CardContent>
    </Card>
  )
}
