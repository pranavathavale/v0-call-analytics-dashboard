"use client"

import { Cell, Pie, PieChart } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const sentimentData = [
  { name: "Positive", value: 6842, fill: "rgb(196, 181, 253)" },
  { name: "Neutral", value: 3921, fill: "rgb(167, 139, 250)" },
  { name: "Negative", value: 1720, fill: "rgb(124, 58, 237)" },
]

export function SentimentChart() {
  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-foreground">Call Sentiment Analysis</CardTitle>
        <CardDescription className="text-pretty">Distribution of customer sentiment across all calls</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[280px] w-full flex items-center justify-center">
          <PieChart width={400} height={280}>
            <Pie
              data={sentimentData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
              nameKey="name"
            >
              {sentimentData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          {sentimentData.map((item) => (
            <div key={item.name}>
              <div className="flex items-center justify-center gap-2">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.fill }} />
                <span className="text-sm font-medium text-foreground">{item.name}</span>
              </div>
              <p className="text-xl font-semibold mt-1 text-foreground">{item.value.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
