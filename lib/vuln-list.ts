// Server-only module to read and normalize vulnerabilities from
// https://github.com/khulnasoft-lab/vuln-list using the GitHub Contents API.
//
// It supports multiple sources (ghsa, nvd, osv) and normalizes fields into a
// common Vulnerability shape. Uses the server-side GITHUB_TOKEN when available
// to avoid rate limits.

import { Octokit } from "octokit"

const OWNER = "khulnasoft-lab"
const REPO = "vuln-list"

export type Reference = { title: string; url: string }

export interface Vulnerability {
  id: string
  title: string
  description: string
  severity: number
  affects: string[]
  published: string
  updated: string
  references: Reference[]
  source: "ghsa" | "nvd" | "osv" | "unknown"
  cve?: string
  cvss?: string
  cwe?: string
  path?: string
}

type SourceKey = "ghsa" | "nvd" | "osv"

// simple server memory cache
const cache = new Map<string, any>()
const CACHE_TTL_MS = 60_000

function getOctokit() {
  const auth = process.env.GITHUB_TOKEN || process.env.GITHUB_PERSONAL_ACCESS_TOKEN
  return new Octokit(auth ? { auth } : {})
}

function setCache<T>(key: string, value: T) {
  cache.set(key, { value, at: Date.now() })
}
function getCache<T>(key: string): T | null {
  const hit = cache.get(key)
  if (!hit) return null
  if (Date.now() - hit.at > CACHE_TTL_MS) {
    cache.delete(key)
    return null
  }
  return hit.value as T
}

async function getContent(path: string) {
  const key = `content:${path}`
  const memo = getCache<any>(key)
  if (memo) return memo
  const octokit = getOctokit()
  const res = await octokit.rest.repos.getContent({ owner: OWNER, repo: REPO, path })
  setCache(key, res.data)
  return res.data
}

async function getJson(path: string) {
  const key = `json:${path}`
  const memo = getCache<any>(key)
  if (memo) return memo
  const octokit = getOctokit()
  try {
    const res = await octokit.rest.repos.getContent({ owner: OWNER, repo: REPO, path })
    if (Array.isArray(res.data)) throw new Error("Expected file content")
    const contentBase64 = res.data.content || ""
    const json = JSON.parse(Buffer.from(contentBase64, "base64").toString())
    setCache(key, json)
    return json
  } catch (err: any) {
    if (err?.status === 404) return null
    throw err
  }
}

function firstString(...vals: Array<any>): string {
  for (const v of vals) {
    if (!v) continue
    if (typeof v === "string" && v.trim().length > 0) return v
  }
  return ""
}

function parseNumberFromText(txt?: string): number | null {
  if (!txt) return null
  const m = txt.match(/(\d+(\.\d+)?)/)
  if (m) return Number.parseFloat(m[1])
  return null
}

function extractCvssScore(obj: any): number | null {
  if (!obj) return null
  if (typeof obj === "number") return obj
  if (typeof obj?.score === "number") return obj.score
  if (typeof obj?.baseScore === "number") return obj.baseScore
  if (typeof obj?.baseSeverity === "string") {
    const map: Record<string, number> = { LOW: 2.5, MEDIUM: 5.0, HIGH: 7.5, CRITICAL: 9.5 }
    return map[obj.baseSeverity.toUpperCase()] ?? null
  }
  if (typeof obj === "string") return parseNumberFromText(obj)
  return null
}

function normalizeReferences(refs: any): Reference[] {
  if (!refs) return []
  if (Array.isArray(refs)) {
    return refs
      .map((r: any) => {
        if (!r) return null
        if (typeof r === "string") return { title: r, url: r }
        if (typeof r.url === "string") return { title: r.title || r.url, url: r.url }
        if (typeof r.link === "string") return { title: r.title || r.link, url: r.link }
        return null
      })
      .filter(Boolean) as Reference[]
  }
  if (typeof refs === "object" && typeof refs.url === "string") {
    return [{ title: refs.title || refs.url, url: refs.url }]
  }
  return []
}

function normalizeAffects(aff: any): string[] {
  if (!aff) return []
  if (Array.isArray(aff)) {
    return aff
      .map((a) => {
        if (!a) return null
        if (typeof a === "string") return a
        return a.package || a.name || a.module || a.ecosystem || null
      })
      .filter(Boolean) as string[]
  }
  if (typeof aff === "object") {
    const candidates = [aff.package, aff.name, aff.module, aff.ecosystem]
    return candidates.filter(Boolean) as string[]
  }
  return []
}

function normalizeFromGHSA(json: any, path: string): Vulnerability {
  const id = json?.id || json?.ghsa || json?.advisory_id || path.replace(/^ghsa\//, "").replace(/\.json$/i, "")
  const title =
    firstString(json?.title, json?.summary, json?.advisorySummary, json?.shortDescription) || "GitHub Security Advisory"
  const description = firstString(json?.description, json?.details, json?.overview)
  const cvssScore =
    extractCvssScore(json?.cvss) ||
    extractCvssScore(json?.cvss_v3) ||
    extractCvssScore(json?.cvss_v2) ||
    parseNumberFromText(json?.severity)
  const severity = typeof cvssScore === "number" ? cvssScore : 0
  const published = firstString(json?.published, json?.published_at, json?.datePublished)
  const updated = firstString(json?.updated, json?.updated_at, json?.last_modified)
  const references = normalizeReferences(json?.references || json?.references_url || json?.urls)
  const affects = normalizeAffects(json?.affected_packages || json?.affected || json?.packages)
  const cve =
    json?.cve || (typeof json?.aliases?.find === "function" && json.aliases.find((s: string) => s.startsWith("CVE-")))
  const cvss =
    json?.cvss?.vector || json?.cvss_v3?.vector || json?.cvss_v2?.vector || json?.cvss?.vectorString || json?.metrics
  const cwe =
    json?.cwe ||
    (Array.isArray(json?.weaknesses) && json.weaknesses[0]?.description) ||
    (Array.isArray(json?.cwe_ids) && json.cwe_ids[0])

  return {
    id,
    title,
    description,
    severity,
    affects,
    published,
    updated,
    references,
    source: "ghsa",
    cve: typeof cve === "string" ? cve : undefined,
    cvss: typeof cvss === "string" ? cvss : undefined,
    cwe: typeof cwe === "string" ? cwe : undefined,
    path,
  }
}

function normalizeFromNVD(json: any, path: string): Vulnerability {
  // NVD entries vary; attempt to pull common fields robustly.
  const id =
    json?.id || json?.cve?.id || json?.cve?.CVE_data_meta?.ID || path.replace(/^nvd\//, "").replace(/\.json$/i, "")
  const title = firstString(
    json?.title,
    json?.cve?.description,
    json?.cve?.description?.description_data?.[0]?.value,
    id,
  )
  const description =
    firstString(
      json?.description,
      json?.cve?.description?.description_data?.[0]?.value,
      json?.cnaContainer?.descriptions?.[0]?.value,
    ) || ""
  const cvssScore =
    extractCvssScore(json?.cvss) ||
    extractCvssScore(json?.impact?.baseMetricV3?.cvssV3) ||
    extractCvssScore(json?.impact?.baseMetricV2)
  const severity = typeof cvssScore === "number" ? cvssScore : 0
  const published = firstString(json?.published, json?.publishedDate, json?.published_at)
  const updated = firstString(json?.lastModifiedDate, json?.updated, json?.last_modified)
  const refsRaw =
    json?.references || json?.cve?.references?.reference_data || json?.cnaContainer?.references || json?.references_data
  const references = normalizeReferences(
    Array.isArray(refsRaw) ? refsRaw.map((r: any) => ({ title: r?.name || r?.url, url: r?.url || r })) : refsRaw,
  )
  const affects = normalizeAffects(json?.affected || json?.cnaContainer?.affected)
  const cve = firstString(json?.cve?.CVE_data_meta?.ID, json?.cve?.id, id)
  const cvss = firstString(json?.metrics?.cvssMetricV31?.[0]?.cvssData?.vectorString, json?.cvss?.vectorString)
  const cwe =
    json?.cwe ||
    (Array.isArray(json?.problemtype?.problemtype_data?.[0]?.description) &&
      json.problemtype.problemtype_data[0].description[0]?.value)

  return {
    id,
    title,
    description,
    severity,
    affects,
    published,
    updated,
    references,
    source: "nvd",
    cve,
    cvss,
    cwe,
    path,
  }
}

function normalizeFromOSV(json: any, path: string): Vulnerability {
  const id = json?.id || path.replace(/^osv\//, "").replace(/\.json$/i, "")
  const title = firstString(json?.summary, json?.title, id)
  const description = firstString(json?.details, json?.description)
  const cvssScore =
    extractCvssScore(json?.cvss) || (Array.isArray(json?.severity) ? extractCvssScore(json?.severity[0]?.score) : null)
  const severity = typeof cvssScore === "number" ? cvssScore : 0
  const published = firstString(json?.published, json?.published_at)
  const updated = firstString(json?.modified, json?.updated)
  const references = normalizeReferences(json?.references)
  const affects = Array.isArray(json?.affected) ? json.affected.map((a: any) => a?.package?.name).filter(Boolean) : []
  const cve = (Array.isArray(json?.aliases) && json.aliases.find((s: string) => s.startsWith("CVE-"))) || undefined
  const cvss = typeof json?.cvss === "string" ? json.cvss : undefined
  const cwe = (Array.isArray(json?.database_specific?.cwe_ids) && json.database_specific.cwe_ids[0]) || json?.cwe

  return {
    id,
    title,
    description,
    severity,
    affects,
    published,
    updated,
    references,
    source: "osv",
    cve,
    cvss,
    cwe,
    path,
  }
}

function normalize(json: any, path: string, source: SourceKey | "unknown"): Vulnerability {
  if (source === "ghsa") return normalizeFromGHSA(json, path)
  if (source === "nvd") return normalizeFromNVD(json, path)
  if (source === "osv") return normalizeFromOSV(json, path)
  // fallback: try to infer
  if (/^ghsa\//i.test(path)) return normalizeFromGHSA(json, path)
  if (/^nvd\//i.test(path)) return normalizeFromNVD(json, path)
  if (/^osv\//i.test(path)) return normalizeFromOSV(json, path)
  // last resort minimal mapping
  return {
    id: json?.id || path.replace(/\.json$/i, ""),
    title: firstString(json?.title, json?.summary) || "Vulnerability",
    description: firstString(json?.description, json?.details),
    severity: extractCvssScore(json?.cvss) ?? 0,
    affects: normalizeAffects(json?.affected),
    published: firstString(json?.published, json?.published_at),
    updated: firstString(json?.updated, json?.modified),
    references: normalizeReferences(json?.references),
    source: "unknown",
    cve: json?.cve,
    cvss: json?.cvss,
    cwe: json?.cwe,
    path,
  }
}

async function listJsonFilesUnder(path: string, limit = 50): Promise<string[]> {
  const data = await getContent(path)
  if (!Array.isArray(data)) return []
  const files = data.filter((i: any) => i.type === "file" && i.name.endsWith(".json")).map((i: any) => i.path as string)
  if (files.length > 0) return files.slice(0, limit)

  // If there are subdirectories, peek into a few of them to accumulate files.
  const dirs = data.filter((i: any) => i.type === "dir").slice(0, 5)
  const aggregated: string[] = []
  for (const dir of dirs) {
    const sub = await listJsonFilesUnder(dir.path as string, limit - aggregated.length)
    aggregated.push(...sub)
    if (aggregated.length >= limit) break
  }
  return aggregated
}

export async function fetchVulnerabilities(
  source: SourceKey = "ghsa",
  page = 1,
  perPage = 20,
): Promise<Vulnerability[]> {
  const basePath = source
  const pageSize = Math.min(Math.max(perPage, 1), 50)
  const files = await listJsonFilesUnder(basePath, page * pageSize)
  const slice = files.slice((page - 1) * pageSize, page * pageSize)

  const jsons = await Promise.all(slice.map((p) => getJson(p)))
  const vulns = jsons.map((j, idx) => (j ? normalize(j, slice[idx], source) : null)).filter(Boolean) as Vulnerability[]

  // Sort by published or updated desc if available
  vulns.sort(
    (a, b) => (new Date(b.published || b.updated).getTime() || 0) - (new Date(a.published || a.updated).getTime() || 0),
  )
  return vulns
}

export async function fetchVulnerabilityById(id: string): Promise<Vulnerability | null> {
  const candidates = [
    `ghsa/${id}.json`,
    `nvd/${id}.json`,
    `osv/${id}.json`,
    `oval/debian/${id}.json`, // legacy path support
  ]
  for (const path of candidates) {
    const json = await getJson(path)
    if (json) {
      const src: SourceKey | "unknown" = path.startsWith("ghsa")
        ? "ghsa"
        : path.startsWith("nvd")
          ? "nvd"
          : path.startsWith("osv")
            ? "osv"
            : "unknown"
      return normalize(json, path, src as any)
    }
  }
  return null
}
