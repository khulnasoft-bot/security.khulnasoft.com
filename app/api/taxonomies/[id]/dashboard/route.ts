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

    // Fetch all data
    const [vectorsRes, safeguardsRes, referencesRes] = await Promise.all([
      supabase.from('attack_vectors').select('severity').eq('taxonomy_id', taxonomyId),
      supabase.from('safeguards').select('*').eq('taxonomy_id', taxonomyId),
      supabase.from('references').select('*').eq('taxonomy_id', taxonomyId),
    ])

    const vectors = vectorsRes.data || []
    const safeguards = safeguardsRes.data || []
    const references = referencesRes.data || []

    // Calculate severity distribution
    const severityMap: Record<string, number> = {}
    vectors.forEach(v => {
      const severity = v.severity || 'unknown'
      severityMap[severity] = (severityMap[severity] || 0) + 1
    })

    const vectorsBySeverity = Object.entries(severityMap).map(([severity, count]) => ({
      severity,
      count,
    }))

    // Mock safeguards coverage
    const safeguardsCoverage = vectors.slice(0, 10).map(v => ({
      vector: v.id?.substring(0, 8) || 'Unknown',
      coverage: Math.floor(Math.random() * 100),
    }))

    // Mock growth trend (last 30 days)
    const growthTrend = Array.from({ length: 30 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (29 - i))
      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        vectors: Math.max(50, vectors.length - Math.random() * 20),
        safeguards: Math.max(30, safeguards.length - Math.random() * 15),
      }
    })

    const dashboardData = {
      totalVectors: vectors.length,
      totalSafeguards: safeguards.length,
      totalReferences: references.length,
      vectorsBySeverity,
      safeguardsCoverage,
      growthTrend,
    }

    return NextResponse.json(dashboardData)
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
