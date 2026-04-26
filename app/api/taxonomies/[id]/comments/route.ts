import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const taxonomyId = params.id
    const { searchParams } = new URL(request.url)
    const itemId = searchParams.get('itemId')

    let query = supabase
      .from('comments')
      .select('*')
      .eq('taxonomy_id', taxonomyId)

    if (itemId) {
      query = query.eq('item_id', itemId)
    }

    const { data: comments, error } = await query.order('timestamp', { ascending: false })

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch comments' },
        { status: 500 }
      )
    }

    return NextResponse.json(comments || [])
  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const taxonomyId = params.id
    const body = await request.json()
    const { content, itemId, author } = body

    const { data: comment, error } = await supabase
      .from('comments')
      .insert([
        {
          taxonomy_id: taxonomyId,
          item_id: itemId,
          author,
          content,
          timestamp: new Date().toISOString(),
          resolved: false,
        },
      ])
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Failed to create comment' },
        { status: 500 }
      )
    }

    return NextResponse.json(comment, { status: 201 })
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
