'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Minus, Equal } from 'lucide-react'

interface TaxonomyComparisonProps {
  taxonomyId1: string
  taxonomyId2: string
  onTaxonomyChange?: (id: string, position: 1 | 2) => void
}

interface ComparisonStats {
  name: string
  version: string
  vectorCount: number
  safeguardCount: number
  referenceCount: number
  newItems: number
  removedItems: number
  modifiedItems: number
}

export default function TaxonomyComparison({
  taxonomyId1,
  taxonomyId2,
  onTaxonomyChange,
}: TaxonomyComparisonProps) {
  const [stats1, setStats1] = useState<ComparisonStats | null>(null)
  const [stats2, setStats2] = useState<ComparisonStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [res1, res2] = await Promise.all([
          fetch(`/api/taxonomies/${taxonomyId1}/stats`),
          fetch(`/api/taxonomies/${taxonomyId2}/stats`),
        ])
        
        if (!res1.ok || !res2.ok) throw new Error('Failed to fetch taxonomy stats')
        
        const data1 = await res1.json()
        const data2 = await res2.json()
        
        setStats1(data1)
        setStats2(data2)
      } catch (error) {
        console.error('Error fetching comparison stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [taxonomyId1, taxonomyId2])

  if (loading || !stats1 || !stats2) {
    return <div className="animate-pulse">Loading comparison...</div>
  }

  const statComparison = [
    {
      label: 'Attack Vectors',
      value1: stats1.vectorCount,
      value2: stats2.vectorCount,
    },
    {
      label: 'Safeguards',
      value1: stats1.safeguardCount,
      value2: stats2.safeguardCount,
    },
    {
      label: 'References',
      value1: stats1.referenceCount,
      value2: stats2.referenceCount,
    },
  ]

  return (
    <Card className="glass-effect">
      <CardHeader>
        <CardTitle>Taxonomy Comparison</CardTitle>
        <CardDescription>Compare two taxonomies side by side</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="overview">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="changes">Changes</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {statComparison.map(stat => {
              const diff = stat.value2 - stat.value1
              const isDifferent = diff !== 0

              return (
                <div key={stat.label} className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="bg-muted rounded-md p-3 text-center">
                        <p className="text-lg font-bold">{stat.value1}</p>
                        <p className="text-xs text-muted-foreground">{stats1.name}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      {isDifferent ? (
                        <>
                          {diff > 0 ? (
                            <Plus className="h-4 w-4 text-green-600" />
                          ) : (
                            <Minus className="h-4 w-4 text-red-600" />
                          )}
                          <span className={`text-xs font-semibold ${diff > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {diff > 0 ? '+' : ''}{diff}
                          </span>
                        </>
                      ) : (
                        <Equal className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="bg-muted rounded-md p-3 text-center">
                        <p className="text-lg font-bold">{stat.value2}</p>
                        <p className="text-xs text-muted-foreground">{stats2.name}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </TabsContent>

          <TabsContent value="changes" className="space-y-4">
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground">New Items</p>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  {stats2.newItems}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Removed Items</p>
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                  {stats2.removedItems}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Modified Items</p>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  {stats2.modifiedItems}
                </Badge>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
