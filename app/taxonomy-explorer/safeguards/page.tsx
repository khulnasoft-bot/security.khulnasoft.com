'use client'

import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Search, 
  ChevronDown, 
  ChevronUp,
  Filter,
  Shield,
  Target
} from 'lucide-react'
import TaxonomyNavigation from '@/components/taxonomy/taxonomy-navigation'
import safeguardsData from '@/app/taxonomy/data/safeguards.json'
import attackVectorsData from '@/app/taxonomy/data/attackvectors.json'

interface Safeguard {
  sgId: string
  name: string
  description: string
  type?: string[]
  category?: string
  vectors?: string[]
  references?: string[]
}

export default function SafeguardsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(new Set())

  const safeguards = (safeguardsData as any[]) || []
  const vectors = (attackVectorsData as any[]) || []

  // Get all unique safeguard types
  const allTypes = useMemo(() => {
    const types = new Set<string>()
    safeguards.forEach(sg => {
      sg.type?.forEach((t: string) => types.add(t))
    })
    return Array.from(types).sort()
  }, [safeguards])

  // Filter safeguards
  const filteredSafeguards = useMemo(() => {
    return safeguards.filter(sg => {
      const matchesSearch = !searchTerm ||
        sg.sgId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sg.description.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesTypes = selectedTypes.size === 0 ||
        (sg.type && sg.type.some((t: string) => selectedTypes.has(t)))

      return matchesSearch && matchesTypes
    })
  }, [searchTerm, selectedTypes, safeguards])

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedRows(newExpanded)
  }

  const toggleType = (type: string) => {
    const newTypes = new Set(selectedTypes)
    if (newTypes.has(type)) {
      newTypes.delete(type)
    } else {
      newTypes.add(type)
    }
    setSelectedTypes(newTypes)
  }

  const getMitigatedVectorsCount = (sgId: string): number => {
    return vectors.filter(v => v.safeguards?.includes(sgId)).length
  }

  return (
    <div className="min-h-screen bg-background">
      <TaxonomyNavigation />

      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Safeguards</h1>
          <p className="text-muted-foreground">
            Countermeasures that fully or partially mitigate identified attacks
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
                placeholder="Search safeguards by ID, name, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {allTypes.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Filter by Type</label>
                <div className="flex flex-wrap gap-2">
                  {allTypes.map(type => (
                    <Button
                      key={type}
                      variant={selectedTypes.has(type) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => toggleType(type)}
                      className="text-xs"
                    >
                      {type}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Showing {filteredSafeguards.length} of {safeguards.length} safeguards</span>
            </div>
          </CardHeader>
        </Card>

        {/* Safeguards List */}
        <div className="space-y-3">
          {filteredSafeguards.length > 0 ? (
            filteredSafeguards.map(safeguard => {
              const isExpanded = expandedRows.has(safeguard.sgId)
              const mitigatedCount = getMitigatedVectorsCount(safeguard.sgId)

              return (
                <Card key={safeguard.sgId} className="overflow-hidden">
                  <div
                    className="flex items-start gap-4 p-6 cursor-pointer hover:bg-muted/50 transition"
                    onClick={() => toggleExpanded(safeguard.sgId)}
                  >
                    <button className="mt-1 text-muted-foreground hover:text-primary transition">
                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-3 mb-2">
                        <div className="rounded-full bg-primary/10 p-2">
                          <Shield className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <Badge variant="outline" className="mb-1">
                            {safeguard.sgId}
                          </Badge>
                          <h3 className="font-semibold text-lg mb-1">{safeguard.name}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {safeguard.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Target className="h-4 w-4" />
                          <span>Mitigates {mitigatedCount} vectors</span>
                        </div>
                        {safeguard.type && safeguard.type.length > 0 && (
                          <div className="flex items-center gap-2">
                            {safeguard.type.slice(0, 2).map(type => (
                              <Badge key={type} variant="secondary" className="text-xs">
                                {type}
                              </Badge>
                            ))}
                            {safeguard.type.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{safeguard.type.length - 2}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="border-t bg-muted/30 p-6 space-y-6">
                      {/* Full Description */}
                      <div>
                        <h4 className="font-semibold mb-2">Description</h4>
                        <p className="text-sm text-muted-foreground">{safeguard.description}</p>
                      </div>

                      {/* Type/Category */}
                      {safeguard.type && safeguard.type.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-2">Types</h4>
                          <div className="flex flex-wrap gap-2">
                            {safeguard.type.map(type => (
                              <Badge key={type}>{type}</Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Mitigated Attack Vectors */}
                      {mitigatedCount > 0 && (
                        <div>
                          <h4 className="font-semibold mb-2">
                            Mitigates {mitigatedCount} Attack Vector{mitigatedCount !== 1 ? 's' : ''}
                          </h4>
                          <div className="space-y-1 max-h-48 overflow-y-auto">
                            {vectors
                              .filter(v => v.safeguards?.includes(safeguard.sgId))
                              .map(vector => (
                                <div
                                  key={vector.avId}
                                  className="text-sm bg-background/50 p-2 rounded border border-border/50 hover:border-primary/30 transition"
                                >
                                  <div className="font-medium">{vector.avId}</div>
                                  <div className="text-xs text-muted-foreground">{vector.name}</div>
                                </div>
                              ))}
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
                  No safeguards found matching your criteria
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
