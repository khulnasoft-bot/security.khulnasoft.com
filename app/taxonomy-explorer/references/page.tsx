'use client'

import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Search, 
  ExternalLink,
  Filter,
  BookOpen,
  FileText,
  Globe
} from 'lucide-react'
import TaxonomyNavigation from '@/components/taxonomy/taxonomy-navigation'
import referencesData from '@/app/taxonomy/data/references.json'

interface Reference {
  id: string
  title: string
  link: string
  year?: number
  authors?: string[]
  tags?: {
    contents?: string[]
  }
  vectors?: Array<{
    avId: string
    name?: string
  }>
}

export default function ReferencesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set())

  const references = (referencesData as any[]) || []

  // Get all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>()
    references.forEach(ref => {
      ref.tags?.contents?.forEach((tag: string) => tags.add(tag))
    })
    return Array.from(tags).sort()
  }, [references])

  // Filter references
  const filteredReferences = useMemo(() => {
    return references.filter(ref => {
      const matchesSearch = !searchTerm ||
        ref.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ref.authors?.some((a: string) => a.toLowerCase().includes(searchTerm.toLowerCase())) ||
        ref.tags?.contents?.some((t: string) => t.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesTags = selectedTags.size === 0 ||
        (ref.tags?.contents && ref.tags.contents.some((t: string) => selectedTags.has(t)))

      return matchesSearch && matchesTags
    })
  }, [searchTerm, selectedTags, references])

  const toggleTag = (tag: string) => {
    const newTags = new Set(selectedTags)
    if (newTags.has(tag)) {
      newTags.delete(tag)
    } else {
      newTags.add(tag)
    }
    setSelectedTags(newTags)
  }

  const getTagColor = (tag: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
    if (tag === 'attack') return 'destructive'
    if (tag === 'peer-reviewed') return 'default'
    if (tag === 'cwe') return 'secondary'
    return 'outline'
  }

  const getTypeIcon = (url: string) => {
    if (url.includes('github.com')) return <Globe className="h-4 w-4" />
    if (url.includes('pdf')) return <FileText className="h-4 w-4" />
    return <BookOpen className="h-4 w-4" />
  }

  return (
    <div className="min-h-screen bg-background">
      <TaxonomyNavigation />

      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">References</h1>
          <p className="text-muted-foreground">
            300+ resources related to supply chain security, tagged and linked to attack vectors and safeguards
          </p>
        </div>

        {/* Search and Filter */}
        <Card className="mb-6">
          <CardHeader className="space-y-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Search & Filter
              </CardTitle>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by title, author, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {allTags.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Filter by Tag</label>
                <div className="flex flex-wrap gap-2">
                  {allTags.map(tag => (
                    <Button
                      key={tag}
                      variant={selectedTags.has(tag) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => toggleTag(tag)}
                      className="text-xs"
                    >
                      {tag}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="text-sm text-muted-foreground">
              Showing {filteredReferences.length} of {references.length} references
            </div>
          </CardHeader>
        </Card>

        {/* References Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredReferences.length > 0 ? (
            filteredReferences.map(ref => (
              <Card key={ref.id} className="flex flex-col overflow-hidden hover:shadow-lg transition">
                <CardHeader className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2 flex-1 min-w-0">
                      <div className="rounded-lg bg-primary/10 p-2 mt-0.5 shrink-0">
                        {getTypeIcon(ref.link)}
                      </div>
                      <div className="min-w-0">
                        <a
                          href={ref.link}
                          target="_blank"
                          rel="noreferrer"
                          className="font-semibold text-base hover:text-primary transition line-clamp-3"
                        >
                          {ref.title}
                        </a>
                      </div>
                    </div>
                    <a
                      href={ref.link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary hover:text-primary/80 transition shrink-0"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>

                  {ref.authors && ref.authors.length > 0 && (
                    <div className="text-xs text-muted-foreground">
                      {ref.authors.slice(0, 2).join(', ')}
                      {ref.authors.length > 2 && ` +${ref.authors.length - 2}`}
                    </div>
                  )}

                  {ref.year && (
                    <div className="text-xs text-muted-foreground">
                      Published: {ref.year}
                    </div>
                  )}
                </CardHeader>

                <CardContent className="flex-1 space-y-4">
                  {/* Tags */}
                  {ref.tags?.contents && ref.tags.contents.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {ref.tags.contents.slice(0, 3).map(tag => (
                        <Badge
                          key={tag}
                          variant={getTagColor(tag)}
                          className="text-xs cursor-pointer hover:opacity-80 transition"
                          onClick={() => toggleTag(tag)}
                        >
                          {tag}
                        </Badge>
                      ))}
                      {ref.tags.contents.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{ref.tags.contents.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Related Vectors */}
                  {ref.vectors && ref.vectors.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-muted-foreground mb-1">
                        Related Vectors ({ref.vectors.length})
                      </h4>
                      <div className="space-y-1 max-h-20 overflow-y-auto">
                        {ref.vectors.slice(0, 3).map(vector => (
                          <div key={vector.avId} className="text-xs bg-muted/50 p-1.5 rounded">
                            <div className="font-medium">{vector.avId}</div>
                          </div>
                        ))}
                        {ref.vectors.length > 3 && (
                          <p className="text-xs text-muted-foreground px-1.5">
                            +{ref.vectors.length - 3} more
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">
                    No references found matching your criteria
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
