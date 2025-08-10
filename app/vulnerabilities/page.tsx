import Link from "next/link"
import { fetchVulnerabilities } from "@/lib/vuln-list"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { SeverityBadge } from "@/components/severity-badge"
import type { Vulnerability } from "@/lib/vuln-list"

export const revalidate = 60

function SourceBadge({ source }: { source: Vulnerability["source"] }) {
  const cls =
    source === "ghsa"
      ? "bg-purple-500/15 text-purple-500 border-purple-500/30"
      : source === "nvd"
        ? "bg-blue-500/15 text-blue-500 border-blue-500/30"
        : source === "osv"
          ? "bg-indigo-500/15 text-indigo-500 border-indigo-500/30"
          : "bg-muted text-foreground/70 border-border"
  return (
    <Badge variant="outline" className={cls}>
      {source.toUpperCase()}
    </Badge>
  )
}

export default async function VulnerabilitiesPage({
  searchParams,
}: {
  searchParams?: { source?: "ghsa" | "nvd" | "osv"; page?: string; perPage?: string }
}) {
  const source = (searchParams?.source as any) || "ghsa"
  const page = Number(searchParams?.page || "1")
  const perPage = Number(searchParams?.perPage || "20")

  const items = await fetchVulnerabilities(source, page, perPage)

  return (
    <main className="container mx-auto px-4 py-8">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Vulnerabilities</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-3">
          <span className="text-sm text-muted-foreground">Source:</span>
          <div className="flex gap-2">
            <Link href={`/vulnerabilities?source=ghsa`} className="text-sm">
              <Badge variant={source === "ghsa" ? "default" : "outline"}>GHSA</Badge>
            </Link>
            <Link href={`/vulnerabilities?source=nvd`} className="text-sm">
              <Badge variant={source === "nvd" ? "default" : "outline"}>NVD</Badge>
            </Link>
            <Link href={`/vulnerabilities?source=osv`} className="text-sm">
              <Badge variant={source === "osv" ? "default" : "outline"}>OSV</Badge>
            </Link>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[220px]">ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="w-[120px]">Severity</TableHead>
                <TableHead className="w-[110px]">Source</TableHead>
                <TableHead className="w-[180px]">Published</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((v) => (
                <TableRow key={`${v.source}-${v.id}`}>
                  <TableCell className="font-medium">
                    <Link href={`/vulnerability/${encodeURIComponent(v.id)}`} className="hover:underline">
                      {v.id}
                    </Link>
                  </TableCell>
                  <TableCell className="pr-6">
                    <div className="line-clamp-2">{v.title}</div>
                  </TableCell>
                  <TableCell>
                    <SeverityBadge score={v.severity} />
                  </TableCell>
                  <TableCell>
                    <SourceBadge source={v.source} />
                  </TableCell>
                  <TableCell>
                    <time dateTime={v.published || v.updated}>
                      {(v.published || v.updated || "").replace("T", " ").replace("Z", "")}
                    </time>
                  </TableCell>
                </TableRow>
              ))}
              {items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                    No vulnerabilities found for source {source.toUpperCase()}.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between mt-6">
        <Link
          href={`/vulnerabilities?source=${source}&page=${Math.max(page - 1, 1)}&perPage=${perPage}`}
          className="text-sm underline-offset-4 hover:underline"
          aria-disabled={page <= 1}
        >
          Previous
        </Link>
        <div className="text-sm text-muted-foreground">Page {page}</div>
        <Link
          href={`/vulnerabilities?source=${source}&page=${page + 1}&perPage=${perPage}`}
          className="text-sm underline-offset-4 hover:underline"
        >
          Next
        </Link>
      </div>
    </main>
  )
}
