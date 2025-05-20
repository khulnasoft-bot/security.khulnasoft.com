import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Database, Search, GitBranch, RefreshCw, Users } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="container py-8">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2 max-w-3xl">
          <h1 className="text-3xl font-bold">About KhulnaSoft Vulnerability Database</h1>
          <p className="text-muted-foreground text-lg">
            A comprehensive database of security vulnerabilities and advisories from multiple sources
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-muted-foreground mb-4">
              The KhulnaSoft Vulnerability Database aims to provide developers, security researchers, and organizations
              with a comprehensive, up-to-date, and easily accessible database of security vulnerabilities across
              multiple platforms and technologies.
            </p>
            <p className="text-muted-foreground">
              By aggregating data from various sources including NVD, GitHub Security Advisories, GitLab Advisory
              Database, and vendor-specific security advisories, we provide a single source of truth for vulnerability
              information, helping organizations better understand and mitigate security risks in their software supply
              chain.
            </p>
          </div>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Data Sources</CardTitle>
              <CardDescription>Our vulnerability data is aggregated from multiple trusted sources</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary"></span>
                  National Vulnerability Database (NVD)
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary"></span>
                  GitHub Security Advisories
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary"></span>
                  GitLab Advisory Database
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary"></span>
                  Alpine Security Advisories
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary"></span>
                  Ubuntu Security Notices
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary"></span>
                  Amazon Linux Security Center
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary"></span>
                  Oracle Linux Security Advisories
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary"></span>
                  And many more...
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          <Card>
            <CardHeader>
              <Shield className="h-12 w-12 text-primary mb-2" />
              <CardTitle>Comprehensive Coverage</CardTitle>
              <CardDescription>Access vulnerability data from multiple sources in one place</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Our database aggregates vulnerability information from NVD, GitHub, GitLab, and vendor-specific security
                advisories, providing comprehensive coverage across multiple platforms and technologies.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Database className="h-12 w-12 text-primary mb-2" />
              <CardTitle>Detailed Information</CardTitle>
              <CardDescription>Get detailed vulnerability information and remediation steps</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Each vulnerability entry includes detailed information about affected versions, severity scores, exploit
                status, and remediation steps to help you understand and address security risks.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Search className="h-12 w-12 text-primary mb-2" />
              <CardTitle>Easy to Search</CardTitle>
              <CardDescription>Find vulnerabilities by package name, CVE ID, or keyword</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Our powerful search functionality allows you to quickly find vulnerabilities by package name, CVE ID, or
                keyword, making it easy to check if your dependencies are affected by known vulnerabilities.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <GitBranch className="h-12 w-12 text-primary mb-2" />
              <CardTitle>Open Source</CardTitle>
              <CardDescription>Built on open source data and tools</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Our vulnerability database is built on open source data and tools, making it transparent and
                community-driven. The underlying data is available in our GitHub repository for anyone to use and
                contribute to.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <RefreshCw className="h-12 w-12 text-primary mb-2" />
              <CardTitle>Regular Updates</CardTitle>
              <CardDescription>Stay informed with regularly updated vulnerability data</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Our database is updated regularly to ensure you have access to the latest vulnerability information. New
                vulnerabilities are added as they are discovered and published by our data sources.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Users className="h-12 w-12 text-primary mb-2" />
              <CardTitle>Community Driven</CardTitle>
              <CardDescription>Benefit from community contributions and feedback</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Our vulnerability database benefits from community contributions and feedback. If you find an issue with
                a vulnerability entry or have additional information to share, you can contribute to improve the
                database for everyone.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">How to Contribute</h2>
          <p className="text-muted-foreground mb-4">
            We welcome contributions from the community to help improve our vulnerability database. Here are some ways
            you can contribute:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>Report issues with vulnerability entries</li>
            <li>Provide additional information about vulnerabilities</li>
            <li>Suggest new data sources to include</li>
            <li>Contribute code to improve the database or website</li>
            <li>Help with documentation and examples</li>
          </ul>
          <p className="mt-4 text-muted-foreground">
            Visit our GitHub repository at{" "}
            <a href="https://github.com/khulnasoft-lab/vuln-list" className="text-primary hover:underline">
              github.com/khulnasoft-lab/vuln-list
            </a>{" "}
            to learn more about how to contribute.
          </p>
        </div>
      </div>
    </div>
  )
}
