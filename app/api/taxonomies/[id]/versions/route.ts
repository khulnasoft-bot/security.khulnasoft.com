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

    // Fetch version history from audit_log table
    const { data: versions, error } = await supabase
      .from('audit_log')
      .select('*')
      .eq('taxonomy_id', taxonomyId)
      .order('timestamp', { ascending: false })

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch versions' },
        { status: 500 }
      )
    }

    return NextResponse.json(versions || [])
  } catch (error) {
    console.error('Error fetching versions:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
