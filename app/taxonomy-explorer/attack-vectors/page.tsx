'use client'

import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Search, 
  ChevronDown, 
  ChevronUp, 
  Filter, 
  Download,
  ExternalLink 
} from 'lucide-react'
import TaxonomyNavigation from '@/components/taxonomy/taxonomy-navigation'
import attackVectorsData from '@/app/taxonomy/data/attackvectors.json'
import referencesData from '@/app/taxonomy/data/references.json'
import safeguardsData from '@/app/taxonomy/data/safeguards.json'

interface AttackVector {
  avId: string
  name: string
  description: string
  tactic?: string[]
  technique?: string[]
  examples?: string[]
  weakness?: string[]
  safeguards?: string[]
}

export default function AttackVectorsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [selectedTactics, setSelectedTactics] = useState<Set<string>>(new Set())

  const vectors = (attackVectorsData as any[]) || []

  // Get all unique tactics for filtering
  const allTactics = useMemo(() => {
    const tactics = new Set<string>()
    vectors.forEach(vector => {
      vector.tactic?.forEach(t => tactics.add(t))
    })
    return Array.from(tactics).sort()
  }, [vectors])

  // Filter vectors based on search and tactics
  const filteredVectors = useMemo(() => {
    return vectors.filter(vector => {
      const matchesSearch = !searchTerm || 
        vector.avId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vector.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vector.description.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesTactics = selectedTactics.size === 0 ||
        (vector.tactic && vector.tactic.some(t => selectedTactics.has(t)))

      return matchesSearch && matchesTactics
    })
  }, [searchTerm, selectedTactics, vectors])

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedRows(newExpanded)
  }

  const toggleTactic = (tactic: string) => {
    const newTactics = new Set(selectedTactics)
    if (newTactics.has(tactic)) {
      newTactics.delete(tactic)
    } else {
      newTactics.add(tactic)
    }
    setSelectedTactics(newTactics)
  }

  return (
    <div className="min-h-screen bg-background">
      <TaxonomyNavigation />

      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Attack Vectors</h1>
          <p className="text-muted-foreground">
            Detailed view of {vectors.length} attack vectors with descriptions, real-world examples, and mapped safeguards
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
                placeholder="Search by vector ID, name, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {allTactics.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Filter by Tactic</label>
                <div className="flex flex-wrap gap-2">
                  {allTactics.map(tactic => (
                    <Button
                      key={tactic}
                      variant={selectedTactics.has(tactic) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => toggleTactic(tactic)}
                      className="text-xs"
                    >
                      {tactic}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Showing {filteredVectors.length} of {vectors.length} vectors</span>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Attack Vectors Table */}
        <div className="space-y-2">
          {filteredVectors.length > 0 ? (
            filteredVectors.map(vector => {
              const isExpanded = expandedRows.has(vector.avId)
              const relatedReferences = (referencesData as any[])?.filter(ref =>
                ref.vectors?.some((v: any) => v.avId === vector.avId)
              ) || []
              const relatedSafeguards = vector.safeguards || []

              return (
                <Card key={vector.avId} className="overflow-hidden">
                  <div className="flex items-start gap-4 p-6 cursor-pointer hover:bg-muted/50 transition"
                       onClick={() => toggleExpanded(vector.avId)}>
                    <button className="mt-1 text-muted-foreground hover:text-primary transition">
                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-3 mb-2">
                        <Badge variant="outline" className="mt-0.5">
                          {vector.avId}
                        </Badge>
                        {vector.tactic && (
                          <div className="flex flex-wrap gap-1">
                            {vector.tactic.map(tactic => (
                              <Badge key={tactic} variant="secondary" className="text-xs">
                                {tactic}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <h3 className="font-semibold text-lg mb-1">{vector.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {vector.description}
                      </p>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="border-t bg-muted/30 p-6 space-y-6">
                      {/* Description */}
                      <div>
                        <h4 className="font-semibold mb-2">Description</h4>
                        <p className="text-sm text-muted-foreground">{vector.description}</p>
                      </div>

                      {/* Techniques */}
                      {vector.technique && vector.technique.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-2">Techniques</h4>
                          <ul className="space-y-1">
                            {vector.technique.map(tech => (
                              <li key={tech} className="text-sm text-muted-foreground flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                {tech}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Real-world Examples */}
                      {vector.examples && vector.examples.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-2">Real-world Examples</h4>
                          <ul className="space-y-1">
                            {vector.examples.map(example => (
                              <li key={example} className="text-sm text-muted-foreground flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                {example}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Related References */}
                      {relatedReferences.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-2">Related References ({relatedReferences.length})</h4>
                          <div className="space-y-1 max-h-40 overflow-y-auto">
                            {relatedReferences.slice(0, 5).map(ref => (
                              <a
                                key={ref.id}
                                href={ref.link}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-2 text-sm text-primary hover:underline"
                              >
                                <ExternalLink className="h-3.5 w-3.5" />
                                {ref.title}
                              </a>
                            ))}
                            {relatedReferences.length > 5 && (
                              <p className="text-xs text-muted-foreground">
                                +{relatedReferences.length - 5} more references
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Related Safeguards */}
                      {relatedSafeguards.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-2">Related Safeguards ({relatedSafeguards.length})</h4>
                          <div className="flex flex-wrap gap-2">
                            {relatedSafeguards.slice(0, 5).map(sg => (
                              <Badge key={sg} variant="outline">
                                {sg}
                              </Badge>
                            ))}
                            {relatedSafeguards.length > 5 && (
                              <Badge variant="outline" className="text-xs">
                                +{relatedSafeguards.length - 5} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              )
            })
          ) : (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">
                  No attack vectors found matching your criteria
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
