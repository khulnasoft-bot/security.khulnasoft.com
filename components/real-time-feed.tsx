"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Clock, DatabaseZap } from "lucide-react"
import Link from "next/link"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { VulnerabilityRow } from "@/lib/types"

type FeedItem = VulnerabilityRow

function getSeverityClass(severity: number) {
  if (severity < 3.0) return "bg-green-500/20 text-green-500 border-green-500/30"
  if (severity < 7.0) return "bg-amber-500/20 text-amber-500 border-amber-500/30"
  return "bg-red-500/20 text-red-500 border-red-500/30"
}

function formatRelativeTime(iso: string) {
  const now = new Date().getTime()
  const ts = new Date(iso).getTime()
  const diff = Math.max(0, Math.floor((now - ts) / 1000))
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

export default function RealTimeFeed() {
  const [items, setItems] = useState<FeedItem[]>([])
  const supabase = useMemo(() => {
    try {
      return getSupabaseBrowserClient()
    } catch {
      return null
    }
  }, [])

  // Initial fetch (server API), then realtime subscribe
  useEffect(() => {
    let unsubscribe = () => {}

    async function bootstrap() {
      try {
        const res = await fetch("/api/v1/vulnerabilities?limit=20", { cache: "no-store" })
        if (res.ok) {
          const { items: initial } = (await res.json()) as { items: FeedItem[] }
          setItems(initial)
        }
      } catch {
        // ignore - API might not be configured yet
      }

      if (supabase) {
        const channel = supabase
          .channel("vulnerabilities-inserts")
          .on("postgres_changes", { event: "INSERT", schema: "public", table: "vulnerabilities" }, (payload: any) => {
            const row = payload.new as FeedItem
            setItems((prev) => [row, ...prev.filter((i) => i.id !== row.id)].slice(0, 20))
          })
          .subscribe()

        unsubscribe = () => {
          supabase.removeChannel(channel)
        }
      }
    }

    bootstrap()
    return () => {
      unsubscribe()
    }
  }, [supabase])

  const noRealtime = !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  return (
    <Card className="bg-background/40 backdrop-blur-sm border-primary/20 overflow-hidden">
      <CardHeader className="bg-primary/5 pb-4 border-b border-primary/20">
        <CardTitle className="flex items-center gap-2">
          <DatabaseZap className="h-5 w-5 text-primary" aria-hidden="true" />
          Real-time Vulnerability Feed
          {noRealtime && (
            <span className="ml-2 text-xs text-muted-foreground">
              (demo mode — configure Supabase to enable realtime)
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 max-h-[500px] overflow-y-auto">
        {items.length === 0 ? (
          <div className="flex items-center justify-center p-8">
            <div className="text-muted-foreground">No items yet.</div>
          </div>
        ) : (
          <ul className="divide-y divide-border/40">
            {items.map((vuln) => (
              <li key={vuln.id} className="p-4 hover:bg-primary/5">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle className="h-4 w-4 text-amber-500" aria-hidden="true" />
                      <span className="font-medium">{vuln.title}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Link href={`/vulnerability/${encodeURIComponent(vuln.id)}`} className="hover:underline">
                        {vuln.id}
                      </Link>
                      {vuln.package_name && (
                        <>
                          <span>•</span>
                          <span>{vuln.package_name}</span>
                        </>
                      )}
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" aria-hidden="true" />
                        {formatRelativeTime(vuln.created_at)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={getSeverityClass(vuln.severity)}>
                      {vuln.severity.toFixed(1)}
                    </Badge>
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                      {vuln.source}
                    </Badge>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
