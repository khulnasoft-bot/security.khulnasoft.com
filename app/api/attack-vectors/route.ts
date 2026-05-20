import { getSupabaseServerClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

const supabase = getSupabaseServerClient()

export async function GET(request: NextRequest) {
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
  }
  try {

    const searchParams = request.nextUrl.searchParams
    const taxonomyId = searchParams.get('taxonomyId')
    const vectorId = searchParams.get('vectorId')
    const tactic = searchParams.get('tactic')

    let query = supabase
      .from('attack_vectors')
      .select('*')

    if (taxonomyId) {
      query = query.eq('taxonomy_id', taxonomyId)
    }

    if (vectorId) {
      query = query.eq('vector_id', vectorId)
    }

    if (tactic) {
      query = query.contains('tactic', [tactic])
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching attack vectors:', error)
    return NextResponse.json(
      { error: 'Failed to fetch attack vectors' },
      { status: 500 }
    )
  }
}

// POST create attack vector
export async function POST(request: NextRequest) {
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
  }
  try {
    const body = await request.json()

    const { data, error } = await supabase
      .from('attack_vectors')
      .insert({
        taxonomy_id: body.taxonomyId,
        vector_id: body.vectorId,
        name: body.name,
        description: body.description,
        tactic: body.tactic || [],
        technique: body.technique || [],
        examples: body.examples || [],
        weakness: body.weakness || [],
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Error creating attack vector:', error)
    return NextResponse.json(
      { error: 'Failed to create attack vector' },
      { status: 500 }
    )
  }
}
