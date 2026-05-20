'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface DashboardStats {
  totalVectors: number
  totalSafeguards: number
  totalReferences: number
  vectorsBySeverity: Array<{ severity: string; count: number }>
  safeguardsCoverage: Array<{ vector: string; coverage: number }>
  growthTrend: Array<{ date: string; vectors: number; safeguards: number }>
}

interface DashboardProps {
  taxonomyId: string
}

export default function TaxonomyDashboard({ taxonomyId }: DashboardProps) {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await fetch(`/api/taxonomies/${taxonomyId}/dashboard`)
        if (!response.ok) throw new Error('Failed to fetch dashboard data')
        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error('Error fetching dashboard:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [taxonomyId])

  if (loading || !stats) {
    return <div className="animate-pulse">Loading dashboard...</div>
  }

  const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4']

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-effect">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Attack Vectors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalVectors}</div>
          </CardContent>
        </Card>

        <Card className="glass-effect">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Safeguards
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalSafeguards}</div>
          </CardContent>
        </Card>

        <Card className="glass-effect">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              References
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalReferences}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Severity Distribution */}
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle>Severity Distribution</CardTitle>
            <CardDescription>Attack vectors by severity level</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.vectorsBySeverity}
                  dataKey="count"
                  nameKey="severity"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {stats.vectorsBySeverity.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Coverage Analysis */}
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle>Safeguard Coverage</CardTitle>
            <CardDescription>Protection coverage by attack vector</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.safeguardsCoverage.slice(0, 8)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="vector" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="coverage" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Growth Trend */}
        <Card className="glass-effect lg:col-span-2">
          <CardHeader>
            <CardTitle>Growth Trend</CardTitle>
            <CardDescription>Vectors and safeguards added over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.growthTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="vectors"
                  stroke="#ef4444"
                  strokeWidth={2}
                  name="Attack Vectors"
                />
                <Line
                  type="monotone"
                  dataKey="safeguards"
                  stroke="#22c55e"
                  strokeWidth={2}
                  name="Safeguards"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
