'use client'

import { useEffect, useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Copy, Trash2, Settings } from 'lucide-react'
import Link from 'next/link'

interface Taxonomy {
  id: string
  name: string
  description: string
  version: string
  createdAt: string
  updatedAt: string
  itemCount: number
  author?: string
}

interface TaxonomySelectorProps {
  onTaxonomyChange?: (taxonomyId: string) => void
  currentTaxonomyId?: string
}

export default function TaxonomySelector({ onTaxonomyChange, currentTaxonomyId }: TaxonomySelectorProps) {
  const [taxonomies, setTaxonomies] = useState<Taxonomy[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState(currentTaxonomyId || '')

  useEffect(() => {
    const fetchTaxonomies = async () => {
      try {
        const response = await fetch('/api/taxonomies')
        if (!response.ok) throw new Error('Failed to fetch taxonomies')
        const data = await response.json()
        setTaxonomies(data)
        if (!selectedId && data.length > 0) {
          setSelectedId(data[0].id)
        }
      } catch (error) {
        console.error('Error fetching taxonomies:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTaxonomies()
  }, [selectedId])

  const handleTaxonomyChange = (id: string) => {
    setSelectedId(id)
    onTaxonomyChange?.(id)
  }

  const handleCloneTaxonomy = async (taxonomyId: string) => {
    try {
      const response = await fetch(`/api/taxonomies/${taxonomyId}/clone`, {
        method: 'POST',
      })
      if (!response.ok) throw new Error('Failed to clone taxonomy')
      const newTaxonomy = await response.json()
      setTaxonomies([...taxonomies, newTaxonomy])
      setSelectedId(newTaxonomy.id)
    } catch (error) {
      console.error('Error cloning taxonomy:', error)
    }
  }

  const selectedTaxonomy = taxonomies.find(t => t.id === selectedId)

  if (loading) {
    return <div className="animate-pulse">Loading taxonomies...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <label className="text-sm font-medium">Active Taxonomy</label>
          <Select value={selectedId} onValueChange={handleTaxonomyChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a taxonomy" />
            </SelectTrigger>
            <SelectContent>
              {taxonomies.map(taxonomy => (
                <SelectItem key={taxonomy.id} value={taxonomy.id}>
                  {taxonomy.name} (v{taxonomy.version})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Link href="/admin/taxonomies/new">
          <Button variant="outline" size="icon" title="Create new taxonomy">
            <Plus className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {selectedTaxonomy && (
        <Card className="glass-effect">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>{selectedTaxonomy.name}</CardTitle>
                <CardDescription>{selectedTaxonomy.description}</CardDescription>
              </div>
              <Badge variant="secondary">v{selectedTaxonomy.version}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Items</p>
                <p className="font-semibold">{selectedTaxonomy.itemCount}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Last updated</p>
                <p className="font-semibold">
                  {new Date(selectedTaxonomy.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCloneTaxonomy(selectedTaxonomy.id)}
                className="flex-1"
              >
                <Copy className="h-3.5 w-3.5 mr-1" />
                Clone
              </Button>
              <Link href={`/admin/taxonomies/${selectedTaxonomy.id}`} className="flex-1">
                <Button variant="outline" size="sm" className="w-full">
                  <Settings className="h-3.5 w-3.5 mr-1" />
                  Edit
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
