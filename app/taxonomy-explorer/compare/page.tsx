'use client'

import { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import TaxonomyComparison from '@/components/taxonomy/taxonomy-comparison'
import TaxonomyDashboard from '@/components/taxonomy/taxonomy-dashboard'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function TaxonomyComparePage() {
  const [taxonomy1, setTaxonomy1] = useState('default')
  const [taxonomy2, setTaxonomy2] = useState('v2')
  const [activeTab, setActiveTab] = useState('comparison')

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Taxonomy Comparison</h1>
          <p className="text-muted-foreground">Compare different versions or instances of your attack vector taxonomies</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="comparison">Comparison</TabsTrigger>
            <TabsTrigger value="dashboard1">Taxonomy 1 Dashboard</TabsTrigger>
            <TabsTrigger value="dashboard2">Taxonomy 2 Dashboard</TabsTrigger>
          </TabsList>

          <TabsContent value="comparison" className="space-y-6 mt-6">
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle>Select Taxonomies</CardTitle>
                <CardDescription>Choose which taxonomies to compare</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">First Taxonomy</label>
                  <Select value={taxonomy1} onValueChange={setTaxonomy1}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Open Source Supply Chain (v1.0)</SelectItem>
                      <SelectItem value="v2">Open Source Supply Chain (v2.0)</SelectItem>
                      <SelectItem value="custom">Custom Taxonomy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Second Taxonomy</label>
                  <Select value={taxonomy2} onValueChange={setTaxonomy2}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Open Source Supply Chain (v1.0)</SelectItem>
                      <SelectItem value="v2">Open Source Supply Chain (v2.0)</SelectItem>
                      <SelectItem value="custom">Custom Taxonomy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <TaxonomyComparison taxonomyId1={taxonomy1} taxonomyId2={taxonomy2} />
          </TabsContent>

          <TabsContent value="dashboard1" className="mt-6">
            <TaxonomyDashboard taxonomyId={taxonomy1} />
          </TabsContent>

          <TabsContent value="dashboard2" className="mt-6">
            <TaxonomyDashboard taxonomyId={taxonomy2} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
