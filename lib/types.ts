// English: Shared types used by API and UI.

export type VulnerabilityRow = {
  id: string // e.g., CVE-2023-4863 or GHSA-xxxx
  title: string
  severity: number // 0-10 CVSS-like
  source: "NVD" | "GitHub" | "OSV" | "Manual"
  package_name: string | null
  created_at: string // ISO timestamp
  published_at: string | null
}
