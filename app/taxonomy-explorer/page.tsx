'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { 
  GitBranch, 
  ListIcon, 
  ShieldIcon, 
  BookOpen, 
  Github, 
  ExternalLink,
  ArrowRight,
  GitCompare,
  BarChart3
} from 'lucide-react'
import TaxonomyNavigation from '@/components/taxonomy/taxonomy-navigation'

export default function TaxonomyHome() {
  const [selectedTaxonomy, setSelectedTaxonomy] = useState('opensource-supply-chain')

  const taxonomies = [
    {
      id: 'opensource-supply-chain',
      name: 'Open Source Supply Chain Attacks',
      description: 'A comprehensive taxonomy of 100+ attack vectors targeting open-source software supply chains based on real-world incidents and scientific literature.',
      icon: '🔗',
      vectors: 134,
      safeguards: 87,
      references: 300,
    },
  ]

  const features = [
    {
      title: 'Attack Tree',
      description: 'Hierarchical organization of attack vectors and techniques',
      icon: GitBranch,
      href: '/taxonomy-explorer/attack-tree',
    },
    {
      title: 'Attack Vectors',
      description: 'Detailed tabular view with descriptions and real-world examples',
      icon: ListIcon,
      href: '/taxonomy-explorer/attack-vectors',
    },
    {
      title: 'Safeguards',
      description: 'Countermeasures that mitigate identified attacks',
      icon: ShieldIcon,
      href: '/taxonomy-explorer/safeguards',
    },
    {
      title: 'References',
      description: '300+ resources linked to attack vectors and safeguards',
      icon: BookOpen,
      href: '/taxonomy-explorer/references',
    },
  ]

  const advancedFeatures = [
    {
      title: 'Taxonomy Comparison',
      description: 'Compare different versions or instances of your taxonomies side-by-side',
      icon: GitCompare,
      href: '/taxonomy-explorer/compare',
      badge: 'Phase 4',
    },
    {
      title: 'Dashboards & Analytics',
      description: 'Visualize severity distributions, coverage metrics, and growth trends',
      icon: BarChart3,
      href: '/taxonomy-explorer/compare',
      badge: 'Phase 6',
    },
    {
      title: 'Version Control',
      description: 'Track changes, rollback versions, and collaborate with your team',
      icon: GitBranch,
      href: '/admin/taxonomies',
      badge: 'Phase 5',
    },
  ]

  const useCases = [
    'Security Training & Awareness',
    'Threat Modeling',
    'Risk Assessments',
    'Penetration Testing Scoping',
    'Supply Chain Risk Management',
    'Security Policy Development',
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <TaxonomyNavigation />

      {/* Hero Section */}
      <section className="container py-12 md:py-16 lg:py-20">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="text-5xl">🎯</div>
          <h1 className="text-4xl md:text-5xl font-bold text-balance">
            Open Source Supply Chain Attack Taxonomy
          </h1>
          <p className="text-lg text-muted-foreground text-balance">
            Explore a comprehensive hierarchy of attack vectors, safeguards, and references for securing open-source software supply chains.
            Based on 100+ real-world incidents and scientific literature.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Link href="/taxonomy-explorer/attack-tree">
              <Button size="lg">
                Explore Attack Tree <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <a href="https://github.com/neopilotai/security.khulnasoft.com" target="_blank" rel="noreferrer">
              <Button variant="outline" size="lg">
                <Github className="mr-2 h-5 w-5" />
                View on GitHub
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container py-12">
        <h2 className="text-2xl font-bold mb-8 text-center">Explore the Taxonomy</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <Link key={feature.href} href={feature.href}>
                <Card className="card-hover h-full cursor-pointer">
                  <CardHeader className="space-y-4">
                    <div className="bg-primary/10 w-fit p-3 rounded-lg">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Taxonomy Info */}
      <section className="container py-12">
        <h2 className="text-2xl font-bold mb-8 text-center">Current Taxonomies</h2>
        <div className="max-w-4xl mx-auto">
          {taxonomies.map((taxonomy) => (
            <Card key={taxonomy.id} className="border-primary/20">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-3xl mb-2">{taxonomy.icon}</div>
                    <CardTitle className="text-2xl">{taxonomy.name}</CardTitle>
                    <CardDescription className="mt-2">{taxonomy.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-6 mb-6">
                  <div>
                    <div className="text-3xl font-bold text-primary">{taxonomy.vectors}</div>
                    <div className="text-sm text-muted-foreground">Attack Vectors</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary">{taxonomy.safeguards}</div>
                    <div className="text-sm text-muted-foreground">Safeguards</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary">{taxonomy.references}</div>
                    <div className="text-sm text-muted-foreground">References</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Use Cases</h4>
                    <ul className="grid grid-cols-2 gap-2">
                      {useCases.map((useCase) => (
                        <li key={useCase} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                          {useCase}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Advanced Features */}
      <section className="container py-12">
        <h2 className="text-2xl font-bold mb-8 text-center">Advanced Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {advancedFeatures.map((feature) => {
            const Icon = feature.icon
            return (
              <Link key={feature.href} href={feature.href}>
                <Card className="card-hover h-full cursor-pointer">
                  <CardHeader className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="bg-primary/10 w-fit p-3 rounded-lg">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="text-xs font-semibold px-2 py-1 bg-primary/10 text-primary rounded">
                        {feature.badge}
                      </div>
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-12 border-t">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h2 className="text-2xl font-bold">Ready to explore?</h2>
          <p className="text-muted-foreground">
            Start with the attack tree for a hierarchical view, or dive directly into specific attack vectors and safeguards.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/taxonomy-explorer/attack-tree">
              <Button>Start Exploring</Button>
            </Link>
            <Link href="/taxonomy-explorer/compare">
              <Button variant="outline">Compare Taxonomies</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
