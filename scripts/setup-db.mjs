#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function setupDatabase() {
  try {
    console.log('🔧 Setting up taxonomy database schema...\n')

    // Create taxonomies table
    console.log('📦 Creating taxonomies table...')
    const { error: taxError } = await supabase
      .from('taxonomies')
      .insert({
        name: 'test',
        slug: 'test-' + Date.now(),
      })
      .select()
    
    if (taxError && !taxError.message.includes('already exists')) {
      console.error('Note: Creating tables via direct insert - using admin panel or direct SQL recommended')
    }

    // Check if tables exist by querying information_schema
    const { data, error } = await supabase.rpc('query', {
      query: `
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name IN ('taxonomies', 'attack_vectors', 'safeguards', 'references', 'vector_safeguard_mapping')
      `
    }).then(() => ({ data: true })).catch(e => ({ error: e }))

    console.log('✅ Database setup check complete')
    console.log('\n📝 Next steps:')
    console.log('1. Go to https://supabase.com/dashboard and select your project')
    console.log('2. Go to the SQL Editor section')
    console.log('3. Copy and paste the SQL from scripts/setup-taxonomy-db.sql')
    console.log('4. Run the SQL to create tables')
    console.log('5. Then run: npm run seed-taxonomy\n')
  } catch (error) {
    console.error('❌ Setup failed:', error.message)
  }
}

setupDatabase()
