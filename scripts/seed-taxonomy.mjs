#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Initialize Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function seed() {
  try {
    console.log('🌱 Starting taxonomy data seeding...')

    // Load JSON data
    const taxonomyPath = path.join(__dirname, '../app/taxonomy/data/taxonomy.json')
    const vectorsPath = path.join(__dirname, '../app/taxonomy/data/attackvectors.json')
    const safeguardsPath = path.join(__dirname, '../app/taxonomy/data/safeguards.json')
    const referencesPath = path.join(__dirname, '../app/taxonomy/data/references.json')

    const taxonomyData = JSON.parse(fs.readFileSync(taxonomyPath, 'utf-8'))
    const vectorsData = JSON.parse(fs.readFileSync(vectorsPath, 'utf-8'))
    const safeguardsData = JSON.parse(fs.readFileSync(safeguardsPath, 'utf-8'))
    const referencesData = JSON.parse(fs.readFileSync(referencesPath, 'utf-8'))

    // 1. Create base taxonomy
    console.log('📊 Creating base taxonomy...')
    const { data: taxonomy, error: taxonomyError } = await supabase
      .from('taxonomies')
      .insert({
        name: 'Open Source Supply Chain Attacks',
        description: 'A comprehensive taxonomy of 100+ attack vectors targeting open-source software supply chains',
        slug: 'opensource-supply-chain',
        icon: '🔗',
        is_active: true,
      })
      .select()
      .single()

    if (taxonomyError) throw taxonomyError
    console.log(`✓ Created taxonomy: ${taxonomy.id}`)

    // 2. Insert attack vectors
    console.log('🎯 Inserting attack vectors...')
    const vectorBatch = (Array.isArray(vectorsData) ? vectorsData : [vectorsData]).map((v) => ({
      taxonomy_id: taxonomy.id,
      vector_id: v.avId || v.id,
      name: v.name,
      description: v.description,
      tactic: v.tactic || [],
      technique: v.technique || [],
      examples: v.examples || [],
      weakness: v.weakness || [],
    }))

    const { error: vectorError } = await supabase.from('attack_vectors').insert(vectorBatch)
    if (vectorError) throw vectorError
    console.log(`✓ Inserted ${vectorBatch.length} attack vectors`)

    // 3. Insert safeguards
    console.log('🛡️ Inserting safeguards...')
    const safeguardBatch = (Array.isArray(safeguardsData) ? safeguardsData : [safeguardsData]).map((s) => ({
      taxonomy_id: taxonomy.id,
      safeguard_id: s.sgId || s.id,
      name: s.name,
      description: s.description,
      type: s.type || [],
      category: s.category,
    }))

    const { error: safeguardError } = await supabase.from('safeguards').insert(safeguardBatch)
    if (safeguardError) throw safeguardError
    console.log(`✓ Inserted ${safeguardBatch.length} safeguards`)

    // 4. Insert references
    console.log('📚 Inserting references...')
    const referenceBatch = (Array.isArray(referencesData) ? referencesData : [referencesData]).map((r) => ({
      taxonomy_id: taxonomy.id,
      reference_id: r.id,
      title: r.title,
      link: r.link,
      year: r.year,
      authors: r.authors || [],
      tags: r.tags || {},
    }))

    const { error: referenceError } = await supabase.from('references').insert(referenceBatch)
    if (referenceError) throw referenceError
    console.log(`✓ Inserted ${referenceBatch.length} references`)

    console.log('✅ Seeding completed successfully!')
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    process.exit(1)
  }
}

seed()
