"use client"

// English: Small control to insert demo vulnerabilities via API to test realtime.
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

const samples = [
  {
    id: "CVE-2025-" + Math.floor(Math.random() * 90000 + 10000),
    title: "Remote Code Execution in ExamplePkg",
    severity: 8.7,
    source: "Manual" as const,
    package_name: "example-pkg",
  },
  {
    id: "GHSA-" + Math.random().toString(36).slice(2, 6) + "-abcd-1234",
    title: "Prototype Pollution in lodash",
    severity: 7.5,
    source: "Manual" as const,
    package_name: "lodash",
  },
]

export default function SeedControls() {
  const [loading, setLoading] = useState(false)
  const [lastId, setLastId] = useState<string | null>(null)

  async function insertOne() {
    setLoading(true)
    try {
      const sample = samples[Math.floor(Math.random() * samples.length)]
      const res = await fetch("/api/v1/vulnerabilities", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(sample),
      })
      const data = await res.json()
      if (res.ok) {
        setLastId(data.item?.id ?? null)
      } else {
        console.error("Insert failed", data)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-3">
      <Button onClick={insertOne} disabled={loading} className="gap-2">
        <PlusCircle className="h-4 w-4" aria-hidden="true" />
        {loading ? "Seeding…" : "Insert sample vulnerability"}
      </Button>
      {lastId && <span className="text-sm text-muted-foreground">Last inserted: {lastId}</span>}
    </div>
  )
}
