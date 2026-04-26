'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RotateCcw, Eye } from 'lucide-react'

interface VersionRecord {
  id: string
  version: string
  timestamp: string
  author: string
  changeType: 'created' | 'updated' | 'published' | 'rolled_back'
  changes: {
    vectorsAdded?: number
    vectorsModified?: number
    vectorsRemoved?: number
    safeguardsAdded?: number
    safeguardsModified?: number
    safeguardsRemoved?: number
  }
  description?: string
}

interface VersionHistoryProps {
  taxonomyId: string
  onRollback?: (versionId: string) => void
}

export default function TaxonomyVersionHistory({
  taxonomyId,
  onRollback,
}: VersionHistoryProps) {
  const [versions, setVersions] = useState<VersionRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedVersion, setSelectedVersion] = useState<VersionRecord | null>(null)

  useEffect(() => {
    const fetchVersions = async () => {
      try {
        const response = await fetch(`/api/taxonomies/${taxonomyId}/versions`)
        if (!response.ok) throw new Error('Failed to fetch versions')
        const data = await response.json()
        setVersions(data)
        if (data.length > 0) {
          setSelectedVersion(data[0])
        }
      } catch (error) {
        console.error('Error fetching versions:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchVersions()
  }, [taxonomyId])

  const getChangeTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'created':
        return 'bg-green-100 text-green-800'
      case 'updated':
        return 'bg-blue-100 text-blue-800'
      case 'published':
        return 'bg-purple-100 text-purple-800'
      case 'rolled_back':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleRollback = async (versionId: string) => {
    if (confirm('Are you sure you want to rollback to this version?')) {
      try {
        const response = await fetch(`/api/taxonomies/${taxonomyId}/rollback`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ versionId }),
        })
        if (!response.ok) throw new Error('Failed to rollback')
        onRollback?.(versionId)
        // Refetch versions
        const versionsResponse = await fetch(`/api/taxonomies/${taxonomyId}/versions`)
        const data = await versionsResponse.json()
        setVersions(data)
      } catch (error) {
        console.error('Error rolling back version:', error)
      }
    }
  }

  if (loading) {
    return <div className="animate-pulse">Loading version history...</div>
  }

  return (
    <Card className="glass-effect">
      <CardHeader>
        <CardTitle>Version History</CardTitle>
        <CardDescription>Track all changes and collaborate on taxonomy updates</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="timeline">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>

          <TabsContent value="timeline" className="space-y-4 mt-4">
            <div className="space-y-3">
              {versions.map((version, index) => (
                <div
                  key={version.id}
                  onClick={() => setSelectedVersion(version)}
                  className="relative p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold">v{version.version}</span>
                        <Badge className={getChangeTypeBadgeColor(version.changeType)}>
                          {version.changeType.replace('_', ' ')}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {new Date(version.timestamp).toLocaleString()}
                      </p>
                      <p className="text-sm mt-1">By {version.author}</p>
                      {version.description && (
                        <p className="text-sm text-muted-foreground mt-2">{version.description}</p>
                      )}
                    </div>
                    {index > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRollback(version.id)
                        }}
                        title="Rollback to this version"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  {index === 0 && (
                    <div className="absolute -left-3 top-1/2 w-5 h-5 bg-green-500 rounded-full -translate-y-1/2" />
                  )}
                  {index > 0 && (
                    <div className="absolute -left-2.5 top-1/2 w-4 h-4 border-2 border-border rounded-full bg-background -translate-y-1/2" />
                  )}

                  {index < versions.length - 1 && (
                    <div className="absolute -left-1 top-1/2 w-0.5 h-12 bg-border" />
                  )}
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="details" className="space-y-4 mt-4">
            {selectedVersion && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Change Summary</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedVersion.changes.vectorsAdded !== undefined && (
                      <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                        <p className="text-xs text-muted-foreground">Vectors Added</p>
                        <p className="text-lg font-bold text-green-700 dark:text-green-400">
                          {selectedVersion.changes.vectorsAdded}
                        </p>
                      </div>
                    )}
                    {selectedVersion.changes.vectorsModified !== undefined && (
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                        <p className="text-xs text-muted-foreground">Vectors Modified</p>
                        <p className="text-lg font-bold text-blue-700 dark:text-blue-400">
                          {selectedVersion.changes.vectorsModified}
                        </p>
                      </div>
                    )}
                    {selectedVersion.changes.vectorsRemoved !== undefined && (
                      <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                        <p className="text-xs text-muted-foreground">Vectors Removed</p>
                        <p className="text-lg font-bold text-red-700 dark:text-red-400">
                          {selectedVersion.changes.vectorsRemoved}
                        </p>
                      </div>
                    )}
                    {selectedVersion.changes.safeguardsAdded !== undefined && (
                      <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                        <p className="text-xs text-muted-foreground">Safeguards Added</p>
                        <p className="text-lg font-bold text-green-700 dark:text-green-400">
                          {selectedVersion.changes.safeguardsAdded}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
