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
