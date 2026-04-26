import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET safeguards
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const taxonomyId = searchParams.get('taxonomyId')
    const safeguardId = searchParams.get('safeguardId')
    const type = searchParams.get('type')

    let query = supabase.from('safeguards').select('*')

    if (taxonomyId) query = query.eq('taxonomy_id', taxonomyId)
    if (safeguardId) query = query.eq('safeguard_id', safeguardId)
    if (type) query = query.contains('type', [type])

    const { data, error } = await query
    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching safeguards:', error)
    return NextResponse.json({ error: 'Failed to fetch safeguards' }, { status: 500 })
  }
}

// POST create safeguard
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { data, error } = await supabase
      .from('safeguards')
      .insert({
        taxonomy_id: body.taxonomyId,
        safeguard_id: body.safeguardId,
        name: body.name,
        description: body.description,
        type: body.type || [],
        category: body.category,
      })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Error creating safeguard:', error)
    return NextResponse.json({ error: 'Failed to create safeguard' }, { status: 500 })
  }
}
