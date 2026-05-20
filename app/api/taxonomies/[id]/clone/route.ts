import { getSupabaseServerClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

const supabase = getSupabaseServerClient()

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
  }
  try {
    const sourceTaxonomyId = params.id

    // Fetch the source taxonomy
    const { data: sourceTaxonomy, error: fetchError } = await supabase
      .from('taxonomies')
      .select('*')
      .eq('id', sourceTaxonomyId)
      .single()

    if (fetchError || !sourceTaxonomy) {
      return NextResponse.json(
        { error: 'Taxonomy not found' },
        { status: 404 }
      )
    }

    // Create a new taxonomy
    const newTaxonomy = {
      name: `${sourceTaxonomy.name} (Copy)`,
      description: sourceTaxonomy.description,
      version: '1.0',
      parent_id: sourceTaxonomy.id,
    }

    const { data: createdTaxonomy, error: createError } = await supabase
      .from('taxonomies')
      .insert([newTaxonomy])
      .select()
      .single()

    if (createError || !createdTaxonomy) {
      return NextResponse.json(
        { error: 'Failed to create taxonomy' },
        { status: 500 }
      )
    }

    // Clone all attack vectors
    const { data: vectors } = await supabase
      .from('attack_vectors')
      .select('*')
      .eq('taxonomy_id', sourceTaxonomyId)

    if (vectors && vectors.length > 0) {
      const newVectors = vectors.map(v => ({
        ...v,
        id: undefined,
        taxonomy_id: createdTaxonomy.id,
      }))

      await supabase
        .from('attack_vectors')
        .insert(newVectors)
    }

    // Clone all safeguards
    const { data: safeguards } = await supabase
      .from('safeguards')
      .select('*')
      .eq('taxonomy_id', sourceTaxonomyId)

    if (safeguards && safeguards.length > 0) {
      const newSafeguards = safeguards.map(s => ({
        ...s,
        id: undefined,
        taxonomy_id: createdTaxonomy.id,
      }))

      await supabase
        .from('safeguards')
        .insert(newSafeguards)
    }

    return NextResponse.json(createdTaxonomy, { status: 201 })
  } catch (error) {
    console.error('Error cloning taxonomy:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
