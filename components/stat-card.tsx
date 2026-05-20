"use client"

import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"

export interface StatCardProps {
  label: string
  value: string | number
  trend?: number
  icon?: React.ReactNode
  className?: string
}

export default function StatCard({ label, value, trend, icon, className = "" }: StatCardProps) {
  return (
    <Card className={`card-hover bg-background/60 backdrop-blur-sm border-primary/10 ${className}`}>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            {trend !== undefined && (
              <div className="flex items-center gap-1 text-xs font-medium text-primary">
                <TrendingUp className="h-3.5 w-3.5" />
                {trend > 0 ? "+" : ""}{trend}% this week
              </div>
            )}
          </div>
          {icon && (
            <div className="rounded-full bg-primary/10 p-3 text-primary">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
