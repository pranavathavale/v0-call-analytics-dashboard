"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CallDurationChart } from "@/components/call-duration-chart"
import { SentimentChart } from "@/components/sentiment-chart"
import { EditableMetricsCard } from "@/components/editable-metrics-card"

export function CallAnalyticsDashboard() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-semibold text-foreground text-balance">Call Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-2 text-pretty">
            Monitor and analyze your voice agent performance in real-time
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:gap-8">
          {/* Stats Overview */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="border-border/50 shadow-sm">
              <CardHeader className="pb-3">
                <CardDescription className="text-xs uppercase tracking-wide text-muted-foreground">
                  Total Calls
                </CardDescription>
                <CardTitle className="text-3xl font-semibold">12,483</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  <span className="text-primary font-medium">+12.5%</span> from last month
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm">
              <CardHeader className="pb-3">
                <CardDescription className="text-xs uppercase tracking-wide text-muted-foreground">
                  Avg Duration
                </CardDescription>
                <CardTitle className="text-3xl font-semibold">4:32</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  <span className="text-primary font-medium">+8.2%</span> from last month
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm">
              <CardHeader className="pb-3">
                <CardDescription className="text-xs uppercase tracking-wide text-muted-foreground">
                  Success Rate
                </CardDescription>
                <CardTitle className="text-3xl font-semibold">94.2%</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  <span className="text-primary font-medium">+2.1%</span> from last month
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm">
              <CardHeader className="pb-3">
                <CardDescription className="text-xs uppercase tracking-wide text-muted-foreground">
                  Satisfaction
                </CardDescription>
                <CardTitle className="text-3xl font-semibold">4.8/5</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  <span className="text-primary font-medium">+0.3</span> from last month
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Call Duration Chart */}
          <CallDurationChart />

          <SentimentChart />

          {/* Editable Metrics - This one allows custom values */}
          <EditableMetricsCard />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Voice Agent Analytics Platform &copy; 2025</p>
        </div>
      </footer>
    </div>
  )
}
