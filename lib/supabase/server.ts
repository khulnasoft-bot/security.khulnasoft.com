// English: Server-side Supabase client. Uses service role if available, falls back to anon.
import { createClient } from "@supabase/supabase-js"

const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL

const serviceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!url || !serviceKey) {
  // English: We don't throw here to allow local previews without Supabase; routes should handle null.
  console.warn("Supabase server client not fully configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.")
}

export function getSupabaseServerClient() {
  if (!url || !serviceKey) return null
  return createClient(url, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}
