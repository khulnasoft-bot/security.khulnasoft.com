"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

const data = [
  { name: "Critical", value: 24, color: "hsl(0 100% 50%)" },
  { name: "High", value: 45, color: "hsl(25 95% 53%)" },
  { name: "Medium", value: 78, color: "hsl(38 92% 50%)" },
  { name: "Low", value: 153, color: "hsl(142 71% 45%)" },
]

export default function SeverityDistributionChart() {
  return (
    <Card className="card-hover bg-background/60 backdrop-blur-sm border-primary/10">
      <CardHeader>
        <CardTitle className="text-lg">Vulnerability Distribution</CardTitle>
        <CardDescription>By severity level</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value, percent }) => `${name} ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`${value} vulnerabilities`, "Count"]}
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.5rem",
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
