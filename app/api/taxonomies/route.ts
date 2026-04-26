import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET all taxonomies or a specific one
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')
    const slug = searchParams.get('slug')

    let query = supabase.from('taxonomies').select('*')

    if (id) {
      query = query.eq('id', id).single()
    } else if (slug) {
      query = query.eq('slug', slug).single()
    } else {
      query = query.eq('is_active', true)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching taxonomies:', error)
    return NextResponse.json(
      { error: 'Failed to fetch taxonomies' },
      { status: 500 }
    )
  }
}

// POST create new taxonomy
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { data, error } = await supabase
      .from('taxonomies')
      .insert({
        name: body.name,
        description: body.description,
        slug: body.slug,
        icon: body.icon,
        is_active: body.is_active ?? true,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Error creating taxonomy:', error)
    return NextResponse.json(
      { error: 'Failed to create taxonomy' },
      { status: 500 }
    )
  }
}
