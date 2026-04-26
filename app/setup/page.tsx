'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, CheckCircle2, Copy, ExternalLink } from 'lucide-react'
import { useState } from 'react'

const setupSQL = `-- Taxonomy Database Schema
-- Copy this SQL and run it in your Supabase SQL Editor

-- Create taxonomies table
CREATE TABLE IF NOT EXISTS taxonomies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT,
  version INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID,
  metadata JSONB DEFAULT '{}'::jsonb,
  CONSTRAINT taxonomies_name_unique UNIQUE(name)
);

-- Create attack vectors table
CREATE TABLE IF NOT EXISTS attack_vectors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  taxonomy_id UUID NOT NULL REFERENCES taxonomies(id) ON DELETE CASCADE,
  vector_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  tactic TEXT[],
  technique TEXT[],
  examples TEXT[],
  weakness TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID,
  metadata JSONB DEFAULT '{}'::jsonb,
  CONSTRAINT attack_vectors_unique UNIQUE(taxonomy_id, vector_id)
);

-- Create safeguards table
CREATE TABLE IF NOT EXISTS safeguards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  taxonomy_id UUID NOT NULL REFERENCES taxonomies(id) ON DELETE CASCADE,
  safeguard_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT[],
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID,
  metadata JSONB DEFAULT '{}'::jsonb,
  CONSTRAINT safeguards_unique UNIQUE(taxonomy_id, safeguard_id)
);

-- Create references table
CREATE TABLE IF NOT EXISTS references (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  taxonomy_id UUID NOT NULL REFERENCES taxonomies(id) ON DELETE CASCADE,
  reference_id TEXT NOT NULL,
  title TEXT NOT NULL,
  link TEXT,
  year INTEGER,
  authors TEXT[],
  tags JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID,
  metadata JSONB DEFAULT '{}'::jsonb,
  CONSTRAINT references_unique UNIQUE(taxonomy_id, reference_id)
);

-- Create vector-safeguard mapping table
CREATE TABLE IF NOT EXISTS vector_safeguard_mapping (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vector_id UUID NOT NULL REFERENCES attack_vectors(id) ON DELETE CASCADE,
  safeguard_id UUID NOT NULL REFERENCES safeguards(id) ON DELETE CASCADE,
  mitigation_level TEXT CHECK (mitigation_level IN ('full', 'partial', 'none')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT vector_safeguard_unique UNIQUE(vector_id, safeguard_id)
);

-- Create indexes for performance
CREATE INDEX idx_attack_vectors_taxonomy_id ON attack_vectors(taxonomy_id);
CREATE INDEX idx_safeguards_taxonomy_id ON safeguards(taxonomy_id);
CREATE INDEX idx_references_taxonomy_id ON references(taxonomy_id);
CREATE INDEX idx_vector_safeguard_vector_id ON vector_safeguard_mapping(vector_id);
CREATE INDEX idx_vector_safeguard_safeguard_id ON vector_safeguard_mapping(safeguard_id);`

export default function SetupPage() {
  const [copied, setCopied] = useState(false)

  const copySQL = () => {
    navigator.clipboard.writeText(setupSQL)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 py-12 px-4">
      <div className="container max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Database Setup</h1>
          <p className="text-lg text-muted-foreground">
            Initialize your taxonomy database with the Open Source Supply Chain Attack Taxonomy
          </p>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="setup">Setup Instructions</TabsTrigger>
            <TabsTrigger value="sql">SQL</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>What Gets Set Up?</CardTitle>
                <CardDescription>
                  The database schema for the taxonomy management system
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <span className="font-semibold">5 Database Tables</span>
                    </div>
                    <p className="text-sm text-muted-foreground ml-7">
                      taxonomies, attack_vectors, safeguards, references, vector_safeguard_mapping
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <span className="font-semibold">100+ Attack Vectors</span>
                    </div>
                    <p className="text-sm text-muted-foreground ml-7">
                      Real-world supply chain attack techniques and examples
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <span className="font-semibold">87+ Safeguards</span>
                    </div>
                    <p className="text-sm text-muted-foreground ml-7">
                      Countermeasures and mitigations for supply chain attacks
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <span className="font-semibold">300+ References</span>
                    </div>
                    <p className="text-sm text-muted-foreground ml-7">
                      Scientific papers, advisories, and gray literature
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="font-semibold mb-3">Database Tables</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="font-medium text-sm">taxonomies</p>
                      <p className="text-xs text-muted-foreground">Stores taxonomy definitions with metadata and versioning</p>
                    </div>
                    <div>
                      <p className="font-medium text-sm">attack_vectors</p>
                      <p className="text-xs text-muted-foreground">100+ attack techniques with descriptions, examples, and CWE mappings</p>
                    </div>
                    <div>
                      <p className="font-medium text-sm">safeguards</p>
                      <p className="text-xs text-muted-foreground">87+ countermeasures categorized by type and domain</p>
                    </div>
                    <div>
                      <p className="font-medium text-sm">references</p>
                      <p className="text-xs text-muted-foreground">300+ literature references with tags and URLs</p>
                    </div>
                    <div>
                      <p className="font-medium text-sm">vector_safeguard_mapping</p>
                      <p className="text-xs text-muted-foreground">Links attacks to defenses with mitigation levels</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="setup" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                  Step-by-Step Setup
                </CardTitle>
                <CardDescription>
                  Follow these steps to initialize your taxonomy database
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white font-semibold">
                      1
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">Open Supabase Dashboard</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Go to your Supabase project dashboard
                      </p>
                      <Button variant="outline" size="sm" asChild>
                        <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer">
                          Open Supabase <ExternalLink className="h-3 w-3 ml-2" />
                        </a>
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white font-semibold">
                      2
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">Navigate to SQL Editor</h3>
                      <p className="text-sm text-muted-foreground">
                        Click "SQL Editor" in the left sidebar, then click "+ New Query"
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white font-semibold">
                      3
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">Copy & Paste SQL</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Go to the SQL tab and copy the SQL code. Paste it into the Supabase SQL editor.
                      </p>
                      <Badge>See SQL Tab →</Badge>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white font-semibold">
                      4
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">Execute SQL</h3>
                      <p className="text-sm text-muted-foreground">
                        Click the "Run" button in the Supabase SQL editor to create the tables
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white font-semibold">
                      5
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">Seed Data</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Run this command to populate the taxonomy with attack vectors, safeguards, and references:
                      </p>
                      <div className="bg-muted p-3 rounded font-mono text-sm">
                        npm run seed-taxonomy
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-600 text-white font-semibold">
                      ✓
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">Done!</h3>
                      <p className="text-sm text-muted-foreground">
                        Your taxonomy database is ready. Visit the taxonomy explorer to explore attack vectors.
                      </p>
                      <Button className="mt-2" asChild>
                        <a href="/taxonomy-explorer">Explore Taxonomy</a>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="text-blue-900 dark:text-blue-100">Troubleshooting</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
                <p>
                  <span className="font-semibold">If you see "Table already exists":</span> This is normal and means tables were already created. The script is safe to run again.
                </p>
                <p>
                  <span className="font-semibold">If seeding fails:</span> Make sure you have the environment variables set correctly: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sql" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Database Schema SQL</CardTitle>
                <CardDescription>
                  Copy this SQL and run it in your Supabase SQL Editor
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={copySQL} className="w-full">
                  <Copy className="h-4 w-4 mr-2" />
                  {copied ? 'Copied to clipboard!' : 'Copy SQL to Clipboard'}
                </Button>

                <div className="bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto max-h-96 overflow-y-auto font-mono text-xs">
                  <pre>{setupSQL}</pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
