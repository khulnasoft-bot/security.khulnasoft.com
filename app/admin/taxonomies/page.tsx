'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Plus, Edit2, Trash2, Copy, Download, Upload, Search, AlertTriangle } from 'lucide-react'
import TaxonomyEditor from '@/components/admin/taxonomy-editor'

interface Taxonomy {
  id: string
  name: string
  description: string
  slug: string
  icon: string
  is_active: boolean
  created_at: string
  vector_count?: number
  safeguard_count?: number
  reference_count?: number
}

export default function TaxonomiesAdminPage() {
  const [taxonomies, setTaxonomies] = useState<Taxonomy[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [editingTaxonomy, setEditingTaxonomy] = useState<Taxonomy | null>(null)
  const [showNewDialog, setShowNewDialog] = useState(false)

  useEffect(() => {
    fetchTaxonomies()
  }, [])

  const fetchTaxonomies = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/taxonomies')
      const data = await response.json()
      setTaxonomies(Array.isArray(data) ? data : [data])
    } catch (error) {
      console.error('Error fetching taxonomies:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredTaxonomies = taxonomies.filter(tax =>
    tax.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tax.slug.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this taxonomy?')) {
      try {
        // Implementation would call DELETE endpoint
        setTaxonomies(taxonomies.filter(t => t.id !== id))
      } catch (error) {
        console.error('Error deleting taxonomy:', error)
      }
    }
  }

  const handleExport = (taxonomy: Taxonomy) => {
    // Implementation would export as JSON
    const exportData = {
      ...taxonomy,
      exported_at: new Date().toISOString(),
    }
    const dataStr = JSON.stringify(exportData, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr)
    const exportFileDefaultName = `${taxonomy.slug}-export.json`

    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="mb-8 space-y-4">
          <div>
            <h1 className="text-3xl font-bold">Taxonomy Management</h1>
            <p className="text-muted-foreground">
              Create, edit, and manage attack taxonomies for your organization
            </p>
          </div>

          <div className="flex gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search taxonomies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Taxonomy
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Taxonomy</DialogTitle>
                  <DialogDescription>
                    Define the basic properties of your new attack taxonomy
                  </DialogDescription>
                </DialogHeader>
                <TaxonomyEditor
                  onSave={() => {
                    fetchTaxonomies()
                    setShowNewDialog(false)
                  }}
                  onCancel={() => setShowNewDialog(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Taxonomies List */}
        <div className="space-y-4">
          {loading ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">Loading taxonomies...</p>
              </CardContent>
            </Card>
          ) : filteredTaxonomies.length > 0 ? (
            filteredTaxonomies.map((taxonomy) => (
              <Card key={taxonomy.id} className="overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{taxonomy.icon}</span>
                        <div>
                          <CardTitle className="text-xl">{taxonomy.name}</CardTitle>
                          <code className="text-xs text-muted-foreground">{taxonomy.slug}</code>
                        </div>
                      </div>
                      <CardDescription>{taxonomy.description}</CardDescription>
                    </div>

                    <div className="flex gap-2">
                      <Badge variant={taxonomy.is_active ? 'default' : 'secondary'}>
                        {taxonomy.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <div className="text-2xl font-bold">{taxonomy.vector_count || 0}</div>
                      <div className="text-xs text-muted-foreground">Attack Vectors</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{taxonomy.safeguard_count || 0}</div>
                      <div className="text-xs text-muted-foreground">Safeguards</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{taxonomy.reference_count || 0}</div>
                      <div className="text-xs text-muted-foreground">References</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Edit2 className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Edit Taxonomy</DialogTitle>
                        </DialogHeader>
                        <TaxonomyEditor
                          taxonomy={taxonomy}
                          onSave={() => {
                            fetchTaxonomies()
                          }}
                          onCancel={() => {}}
                        />
                      </DialogContent>
                    </Dialog>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExport(taxonomy)}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Export
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(taxonomy.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>

                  {!taxonomy.is_active && (
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 flex gap-2 items-start">
                      <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 shrink-0" />
                      <div className="text-sm text-yellow-700 dark:text-yellow-600">
                        This taxonomy is currently inactive and will not be visible to users.
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">
                  No taxonomies found. Create your first one to get started.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
