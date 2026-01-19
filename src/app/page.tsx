"use client"

import { DashboardShell } from "@/components/layout/shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Users, 
  DollarSign, 
  Activity, 
  CreditCard 
} from "lucide-react"
import { 
  Area, 
  AreaChart, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis,
  Bar,
  BarChart,
  CartesianGrid
} from "recharts"
import * as React from "react"
import { analyticsService, StatData, ChartData, SaleData } from "@/lib/services/analytics-service"

const iconMap: Record<string, any> = {
  "dollar": DollarSign,
  "users": Users,
  "credit-card": CreditCard,
  "activity": Activity
}

export default function DashboardPage() {
  const [stats, setStats] = React.useState<StatData[]>([])
  const [analyticsData, setAnalyticsData] = React.useState<ChartData[]>([])
  const [recentSales, setRecentSales] = React.useState<SaleData[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchData = async () => {
      const [statsData, chartData, salesData] = await Promise.all([
        analyticsService.getDashboardStats(),
        analyticsService.getAnalyticsData(),
        analyticsService.getRecentSales()
      ])
      setStats(statsData)
      setAnalyticsData(chartData)
      setRecentSales(salesData)
      setLoading(false)
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-pulse text-muted-foreground font-medium">Loading dashboard overview...</div>
        </div>
      </DashboardShell>
    )
  }
  return (
    <DashboardShell>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
          <p className="text-muted-foreground">Welcome back to your dashboard overview.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <StatCard 
              key={stat.title}
              title={stat.title} 
              value={stat.value} 
              icon={iconMap[stat.icon] || Activity} 
              trend={stat.trend} 
              trendType={stat.trendType}
            />
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle>Growth Overview</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analyticsData}>
                    <defs>
                      <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="name" 
                      stroke="#888888" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                    />
                    <YAxis 
                      stroke="#888888" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                      tickFormatter={(value) => `$${value}`} 
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))", 
                        borderColor: "hsl(var(--border))",
                        borderRadius: "8px"
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="total" 
                      stroke="hsl(var(--primary))" 
                      fillOpacity={1} 
                      fill="url(#colorTotal)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Recent Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {recentSales.map((sale) => (
                  <div key={sale.email} className="flex items-center gap-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent">
                      <span className="text-xs font-medium">{sale.initial}</span>
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">{sale.name}</p>
                      <p className="text-xs text-muted-foreground">{sale.email}</p>
                    </div>
                    <div className="font-medium">{sale.amount}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  )
}

function StatCard({ title, value, icon: Icon, trend, trendType }: any) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">
          <span className={cn(
            "inline-flex items-center gap-1 font-medium",
            trendType === "up" ? "text-emerald-500" : "text-destructive"
          )}>
            {trendType === "up" ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {trend.split(" ")[0]}
          </span>
          {" "}{trend.split(" ").slice(1).join(" ")}
        </p>
      </CardContent>
    </Card>
  )
}

