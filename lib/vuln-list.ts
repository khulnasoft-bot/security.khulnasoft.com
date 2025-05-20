import { Octokit } from "octokit"

const octokit = new Octokit()

export interface Vulnerability {
  id: string
  title: string
  description: string
  severity: number
  affects: string[]
  published: string
  updated: string
  references: Array<{
    title: string
    url: string
  }>
  cve?: string
  cvss?: string
  cwe?: string
}

export async function fetchVulnerabilities(page = 1, perPage = 10): Promise<Vulnerability[]> {
  try {
    const response = await octokit.rest.repos.getContent({
      owner: "khulnasoft-lab",
      repo: "vuln-list",
      path: "oval/debian",
    })

    if (!Array.isArray(response.data)) {
      throw new Error("Expected array of files")
    }

    // Get the latest 10 vulnerability files
    const vulnFiles = response.data
      .filter((file: any) => file.type === "file" && file.name.endsWith(".json"))
      .slice((page - 1) * perPage, page * perPage)

    const vulnerabilities = await Promise.all(
      vulnFiles.map(async (file: any) => {
        const content = await octokit.rest.repos.getContent({
          owner: "khulnasoft-lab",
          repo: "vuln-list",
          path: file.path,
        })

        if (Array.isArray(content.data)) {
          throw new Error("Expected file content")
        }

        const decodedContent = Buffer.from(content.data.content, "base64").toString()
        const vulnData = JSON.parse(decodedContent)

        return {
          id: vulnData.id || file.name.replace(".json", ""),
          title: vulnData.title || "Unknown Vulnerability",
          description: vulnData.description || "",
          severity: vulnData.severity || calculateSeverity(vulnData.cvss),
          affects: vulnData.affected_packages || [],
          published: vulnData.published_date || "",
          updated: vulnData.last_modified_date || "",
          references: vulnData.references || [],
          cve: vulnData.cve,
          cvss: vulnData.cvss,
          cwe: vulnData.cwe,
        }
      })
    )

    return vulnerabilities
  } catch (error) {
    console.error("Error fetching vulnerabilities:", error)
    return []
  }
}

function calculateSeverity(cvss?: string): number {
  if (!cvss) return 0
  const match = cvss.match(/\d+\.\d+/)
  return match ? parseFloat(match[0]) : 0
}

export async function fetchVulnerabilityById(id: string): Promise<Vulnerability | null> {
  try {
    const response = await octokit.rest.repos.getContent({
      owner: "khulnasoft-lab",
      repo: "vuln-list",
      path: `oval/debian/${id}.json`,
    })

    if (Array.isArray(response.data)) {
      throw new Error("Expected file content")
    }

    const decodedContent = Buffer.from(response.data.content, "base64").toString()
    const vulnData = JSON.parse(decodedContent)

    return {
      id: vulnData.id || id,
      title: vulnData.title || "Unknown Vulnerability",
      description: vulnData.description || "",
      severity: vulnData.severity || calculateSeverity(vulnData.cvss),
      affects: vulnData.affected_packages || [],
      published: vulnData.published_date || "",
      updated: vulnData.last_modified_date || "",
      references: vulnData.references || [],
      cve: vulnData.cve,
      cvss: vulnData.cvss,
      cwe: vulnData.cwe,
    }
  } catch (error) {
    console.error("Error fetching vulnerability:", error)
    return null
  }
}