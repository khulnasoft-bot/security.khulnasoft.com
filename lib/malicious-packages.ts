import { Octokit } from "octokit"

const octokit = new Octokit()

export interface MaliciousPackage {
  id: string
  name: string
  ecosystem: string
  summary: string
  details: string
  aliases?: string[]
  modified: string
  published: string
  database_specific?: {
    severity?: string
  }
  affected: Array<{
    package: {
      name: string
      ecosystem: string
    }
    ranges: Array<{
      type: string
      events: Array<{
        introduced?: string
        fixed?: string
      }>
    }>
    versions?: string[]
  }>
  references: Array<{
    type: string
    url: string
  }>
}

export async function fetchMaliciousPackages(page = 1, perPage = 10): Promise<MaliciousPackage[]> {
  try {
    const response = await octokit.rest.repos.getContent({
      owner: "khulnasoft-lab",
      repo: "malicious-packages",
      path: "osv",
    })

    if (!Array.isArray(response.data)) {
      throw new Error("Expected array of files")
    }

    // Get the latest malicious package files
    const packageFiles = response.data
      .filter((file: any) => file.type === "file" && file.name.endsWith(".json"))
      .slice((page - 1) * perPage, page * perPage)

    const packages = await Promise.all(
      packageFiles.map(async (file: any) => {
        const content = await octokit.rest.repos.getContent({
          owner: "khulnasoft-lab",
          repo: "malicious-packages",
          path: file.path,
        })

        if (Array.isArray(content.data)) {
          throw new Error("Expected file content")
        }

        const decodedContent = Buffer.from(content.data.content, "base64").toString()
        const packageData = JSON.parse(decodedContent)

        return {
          id: packageData.id,
          name: packageData.affected?.[0]?.package?.name || "Unknown",
          ecosystem: packageData.affected?.[0]?.package?.ecosystem || "Unknown",
          summary: packageData.summary || "",
          details: packageData.details || "",
          aliases: packageData.aliases || [],
          modified: packageData.modified,
          published: packageData.published,
          database_specific: packageData.database_specific || {},
          affected: packageData.affected || [],
          references: packageData.references || [],
        }
      })
    )

    return packages
  } catch (error) {
    console.error("Error fetching malicious packages:", error)
    return []
  }
}

export async function fetchMaliciousPackageById(id: string): Promise<MaliciousPackage | null> {
  try {
    // Search through the osv directory for the package
    const response = await octokit.rest.repos.getContent({
      owner: "khulnasoft-lab",
      repo: "malicious-packages",
      path: "osv",
    })

    if (!Array.isArray(response.data)) {
      throw new Error("Expected array of files")
    }

    const packageFile = response.data.find((file: any) => 
      file.type === "file" && 
      file.name.endsWith(".json") && 
      file.name.includes(id)
    )

    if (!packageFile) {
      return null
    }

    const content = await octokit.rest.repos.getContent({
      owner: "khulnasoft-lab",
      repo: "malicious-packages",
      path: packageFile.path,
    })

    if (Array.isArray(content.data)) {
      throw new Error("Expected file content")
    }

    const decodedContent = Buffer.from(content.data.content, "base64").toString()
    const packageData = JSON.parse(decodedContent)

    return {
      id: packageData.id,
      name: packageData.affected?.[0]?.package?.name || "Unknown",
      ecosystem: packageData.affected?.[0]?.package?.ecosystem || "Unknown",
      summary: packageData.summary || "",
      details: packageData.details || "",
      aliases: packageData.aliases || [],
      modified: packageData.modified,
      published: packageData.published,
      database_specific: packageData.database_specific || {},
      affected: packageData.affected || [],
      references: packageData.references || [],
    }
  } catch (error) {
    console.error("Error fetching malicious package:", error)
    return null
  }
}
