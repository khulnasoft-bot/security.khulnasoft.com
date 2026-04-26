import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET references
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const taxonomyId = searchParams.get('taxonomyId')
    const referenceId = searchParams.get('referenceId')
    const tag = searchParams.get('tag')

    let query = supabase.from('references').select('*')

    if (taxonomyId) query = query.eq('taxonomy_id', taxonomyId)
    if (referenceId) query = query.eq('reference_id', referenceId)

    const { data, error } = await query
    if (error) throw error

    // Filter by tag if provided
    if (tag && data) {
      return NextResponse.json(
        data.filter((ref: any) => 
          ref.tags?.contents?.includes(tag)
        )
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching references:', error)
    return NextResponse.json({ error: 'Failed to fetch references' }, { status: 500 })
  }
}

// POST create reference
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { data, error } = await supabase
      .from('references')
      .insert({
        taxonomy_id: body.taxonomyId,
        reference_id: body.referenceId,
        title: body.title,
        link: body.link,
        year: body.year,
        authors: body.authors || [],
        tags: body.tags || {},
      })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Error creating reference:', error)
    return NextResponse.json({ error: 'Failed to create reference' }, { status: 500 })
  }
}
