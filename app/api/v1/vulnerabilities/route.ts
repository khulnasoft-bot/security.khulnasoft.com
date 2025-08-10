import { NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import type { VulnerabilityRow } from "@/lib/types"

// GET /api/v1/vulnerabilities?limit=20
export async function GET(request: Request) {
  const supabase = getSupabaseServerClient()
  if (!supabase) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 })
  }

  const { searchParams } = new URL(request.url)
  const limit = Math.min(Number(searchParams.get("limit") || 20), 100)

  const { data, error } = await supabase
    .from("vulnerabilities")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ items: data as VulnerabilityRow[] })
}

// POST /api/v1/vulnerabilities
// Body: { id, title, severity, source, package_name?, published_at? }
export async function POST(request: Request) {
  const supabase = getSupabaseServerClient()
  if (!supabase) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 })
  }

  const payload = await request.json().catch(() => null)
  if (!payload || !payload.id || !payload.title || typeof payload.severity !== "number" || !payload.source) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }

  const row = {
    id: String(payload.id),
    title: String(payload.title),
    severity: Number(payload.severity),
    source: payload.source as "NVD" | "GitHub" | "OSV" | "Manual",
    package_name: payload.package_name ? String(payload.package_name) : null,
    published_at: payload.published_at ? String(payload.published_at) : null,
  }

  // Upsert so repeated inserts don't fail
  const { data, error } = await supabase.from("vulnerabilities").upsert(row, { onConflict: "id" }).select().single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ item: data as VulnerabilityRow }, { status: 201 })
}
