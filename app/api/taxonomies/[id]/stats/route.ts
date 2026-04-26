import { getSupabaseServerClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

const supabase = getSupabaseServerClient()

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
  }
  try {
    const taxonomyId = params.id

    // Fetch taxonomy info
    const { data: taxonomy, error: taxError } = await supabase
      .from('taxonomies')
      .select('name, version')
      .eq('id', taxonomyId)
      .single()

    if (taxError || !taxonomy) {
      return NextResponse.json(
        { error: 'Taxonomy not found' },
        { status: 404 }
      )
    }

    // Count attack vectors
    const { count: vectorCount, error: vectorError } = await supabase
      .from('attack_vectors')
      .select('*', { count: 'exact', head: true })
      .eq('taxonomy_id', taxonomyId)

    // Count safeguards
    const { count: safeguardCount, error: safeguardError } = await supabase
      .from('safeguards')
      .select('*', { count: 'exact', head: true })
      .eq('taxonomy_id', taxonomyId)

    // Count references
    const { count: referenceCount, error: referenceError } = await supabase
      .from('references')
      .select('*', { count: 'exact', head: true })
      .eq('taxonomy_id', taxonomyId)

    const stats = {
      name: taxonomy.name,
      version: taxonomy.version,
      vectorCount: vectorCount || 0,
      safeguardCount: safeguardCount || 0,
      referenceCount: referenceCount || 0,
      newItems: 0,
      removedItems: 0,
      modifiedItems: 0,
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching taxonomy stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
