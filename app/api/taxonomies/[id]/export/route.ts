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
    const format = searchParams.get('format') || 'json'

    // Fetch all data
    const [taxonomyRes, vectorsRes, safeguardsRes, referencesRes] = await Promise.all([
      supabase.from('taxonomies').select('*').eq('id', taxonomyId).single(),
      supabase.from('attack_vectors').select('*').eq('taxonomy_id', taxonomyId),
      supabase.from('safeguards').select('*').eq('taxonomy_id', taxonomyId),
      supabase.from('references').select('*').eq('taxonomy_id', taxonomyId),
    ])

    const taxonomy = taxonomyRes.data
    const vectors = vectorsRes.data || []
    const safeguards = safeguardsRes.data || []
    const references = referencesRes.data || []

    if (format === 'json') {
      const exportData = {
        taxonomy,
        vectors,
        safeguards,
        references,
        exportDate: new Date().toISOString(),
      }

      return new NextResponse(JSON.stringify(exportData, null, 2), {
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="taxonomy-${taxonomyId}.json"`,
        },
      })
    }

    if (format === 'csv') {
      let csv = 'Type,ID,Name,Description\n'

      vectors.forEach(v => {
        csv += `Vector,${v.id},"${v.name}","${v.description || ''}"\n`
      })

      safeguards.forEach(s => {
        csv += `Safeguard,${s.id},"${s.name}","${s.description || ''}"\n`
      })

      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="taxonomy-${taxonomyId}.csv"`,
        },
      })
    }

    if (format === 'pdf') {
      // For now, return a simple text version
      // In production, use a PDF library like jsPDF
      const textContent = `
TAXONOMY EXPORT
================

Name: ${taxonomy?.name}
Version: ${taxonomy?.version}
Export Date: ${new Date().toISOString()}

ATTACK VECTORS (${vectors.length})
${vectors.map(v => `- ${v.name}: ${v.description}`).join('\n')}

SAFEGUARDS (${safeguards.length})
${safeguards.map(s => `- ${s.name}: ${s.description}`).join('\n')}

REFERENCES (${references.length})
${references.map(r => `- ${r.title}: ${r.url}`).join('\n')}
      `

      return new NextResponse(textContent, {
        headers: {
          'Content-Type': 'text/plain',
          'Content-Disposition': `attachment; filename="taxonomy-${taxonomyId}.txt"`,
        },
      })
    }

    return NextResponse.json(
      { error: 'Invalid format' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error exporting taxonomy:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
