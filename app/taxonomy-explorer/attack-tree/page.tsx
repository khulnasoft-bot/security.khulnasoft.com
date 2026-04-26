'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronRight, Search, ZoomIn, ZoomOut } from 'lucide-react'
import TaxonomyNavigation from '@/components/taxonomy/taxonomy-navigation'
import taxonomyData from '@/app/taxonomy/data/taxonomy.json'

interface TreeNode {
  id: string
  name: string
  description?: string
  vector?: string
  tactics?: string[]
  techniques?: string[]
  children?: TreeNode[]
}

function TreeItem({ 
  node, 
  level = 0, 
  searchTerm,
  onSelectNode 
}: { 
  node: TreeNode
  level?: number
  searchTerm: string
  onSelectNode: (node: TreeNode) => void
}) {
  const [isExpanded, setIsExpanded] = useState(level < 2)
  const hasChildren = node.children && node.children.length > 0
  const matches = !searchTerm || 
    node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    node.description?.toLowerCase().includes(searchTerm.toLowerCase())

  if (!matches && searchTerm) {
    return null
  }

  return (
    <div className="select-none">
      <div
        className="flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-primary/10 cursor-pointer group"
        onClick={() => {
          if (hasChildren) setIsExpanded(!isExpanded)
          onSelectNode(node)
        }}
      >
        {hasChildren ? (
          <button className="text-muted-foreground hover:text-primary transition">
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        ) : (
          <div className="w-4" />
        )}
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm group-hover:text-primary transition truncate">
            {node.name}
          </div>
          {node.description && (
            <div className="text-xs text-muted-foreground truncate">
              {node.description}
            </div>
          )}
        </div>
        {node.tactics && (
          <Badge variant="outline" className="text-xs">
            {node.tactics.length}
          </Badge>
        )}
      </div>
      
      {isExpanded && hasChildren && (
        <div className="ml-4 border-l border-border/50">
          {node.children?.map((child) => (
            <TreeItem
              key={child.id}
              node={child}
              level={level + 1}
              searchTerm={searchTerm}
              onSelectNode={onSelectNode}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function AttackTreePage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null)
  const [zoomLevel, setZoomLevel] = useState(100)

  const root = taxonomyData as TreeNode

  return (
    <div className="min-h-screen bg-background">
      <TaxonomyNavigation />

      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Attack Tree</h1>
          <p className="text-muted-foreground">
            Hierarchical organization of 100+ attack vectors and techniques targeting open-source software supply chains
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tree View */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="space-y-4">
                <div>
                  <CardTitle>Taxonomy Hierarchy</CardTitle>
                  <CardDescription>Click to expand and explore attack vectors</CardDescription>
                </div>
                
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search attacks..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex gap-1 border rounded-lg p-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setZoomLevel(Math.max(80, zoomLevel - 10))}
                    >
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center px-2 text-xs text-muted-foreground min-w-12 text-center">
                      {zoomLevel}%
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setZoomLevel(Math.min(120, zoomLevel + 10))}
                    >
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="max-h-[600px] overflow-y-auto">
                <div style={{ fontSize: `${zoomLevel / 100}rem` }}>
                  <TreeItem
                    node={root}
                    searchTerm={searchTerm}
                    onSelectNode={setSelectedNode}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Details Panel */}
          <div className="lg:col-span-1">
            {selectedNode ? (
              <Card className="sticky top-20">
                <CardHeader>
                  <CardTitle className="text-lg">{selectedNode.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedNode.description && (
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Description</h4>
                      <p className="text-sm text-muted-foreground">{selectedNode.description}</p>
                    </div>
                  )}

                  {selectedNode.tactics && selectedNode.tactics.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Tactics</h4>
                      <div className="space-y-1">
                        {selectedNode.tactics.map((tactic) => (
                          <Badge key={tactic} variant="secondary" className="text-xs">
                            {tactic}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedNode.techniques && selectedNode.techniques.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Techniques</h4>
                      <div className="space-y-1 max-h-48 overflow-y-auto">
                        {selectedNode.techniques.map((technique) => (
                          <div key={technique} className="text-xs bg-muted/50 p-2 rounded">
                            {technique}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {!selectedNode.description && !selectedNode.tactics && !selectedNode.techniques && (
                    <p className="text-sm text-muted-foreground">
                      Select a node to view details. Expand branches to explore more attack vectors.
                    </p>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground text-center">
                    Select a node from the tree to view details
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
