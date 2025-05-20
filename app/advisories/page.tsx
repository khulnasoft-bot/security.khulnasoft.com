import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, ExternalLink } from "lucide-react"
import Link from "next/link"

export default function AdvisoriesPage() {
  const advisories = [
    {
      id: "GHSA-abcd-1234-5678",
      title: "May 2023 Security Advisory for PostgreSQL",
      source: "PostgreSQL",
      date: "2023-05-11",
      severity: "High",
      vulnerabilities: ["CVE-2023-1234", "CVE-2023-5678"],
      summary:
        "This advisory addresses multiple security issues in PostgreSQL including SQL injection and privilege escalation vulnerabilities.",
    },
    {
      id: "GHSA-efgh-5678-9012",
      title: "April 2023 Security Advisory for Node.js",
      source: "Node.js",
      date: "2023-04-18",
      severity: "Critical",
      vulnerabilities: ["CVE-2023-2345", "CVE-2023-6789"],
      summary:
        "This advisory addresses critical security vulnerabilities in Node.js including a remote code execution vulnerability.",
    },
    {
      id: "GHSA-ijkl-9012-3456",
      title: "March 2023 Security Advisory for Alpine Linux",
      source: "Alpine",
      date: "2023-03-22",
      severity: "Medium",
      vulnerabilities: ["CVE-2023-3456", "CVE-2023-7890"],
      summary:
        "This advisory addresses multiple security issues in Alpine Linux packages including buffer overflow and privilege escalation vulnerabilities.",
    },
    {
      id: "GHSA-mnop-3456-7890",
      title: "February 2023 Security Advisory for Docker",
      source: "Docker",
      date: "2023-02-15",
      severity: "High",
      vulnerabilities: ["CVE-2023-4567", "CVE-2023-8901"],
      summary:
        "This advisory addresses multiple security issues in Docker including container escape and privilege escalation vulnerabilities.",
    },
    {
      id: "GHSA-qrst-7890-1234",
      title: "January 2023 Security Advisory for Kubernetes",
      source: "Kubernetes",
      date: "2023-01-10",
      severity: "Medium",
      vulnerabilities: ["CVE-2023-5678", "CVE-2023-9012"],
      summary:
        "This advisory addresses multiple security issues in Kubernetes including authentication bypass and privilege escalation vulnerabilities.",
    },
  ]

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Security Advisories</h1>
          <p className="text-muted-foreground">Browse security advisories from various sources</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input type="search" placeholder="Search advisories..." className="pl-9" />
          </div>
          <div className="flex gap-2">
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="postgresql">PostgreSQL</SelectItem>
                <SelectItem value="nodejs">Node.js</SelectItem>
                <SelectItem value="alpine">Alpine</SelectItem>
                <SelectItem value="docker">Docker</SelectItem>
                <SelectItem value="kubernetes">Kubernetes</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              More Filters
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="critical">Critical</TabsTrigger>
            <TabsTrigger value="high">High</TabsTrigger>
            <TabsTrigger value="medium">Medium</TabsTrigger>
            <TabsTrigger value="low">Low</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="space-y-4 mt-4">
            {advisories.map((advisory) => (
              <Card key={advisory.id}>
                <CardHeader className="p-4 pb-2">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline">{advisory.id}</Badge>
                        <Badge
                          variant={
                            advisory.severity === "Critical"
                              ? "destructive"
                              : advisory.severity === "High"
                                ? "destructive"
                                : advisory.severity === "Medium"
                                  ? "secondary"
                                  : "outline"
                          }
                        >
                          {advisory.severity}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{advisory.title}</CardTitle>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Published: {advisory.date} by {advisory.source}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <p className="mb-3">{advisory.summary}</p>
                  <div>
                    <h4 className="text-sm font-medium mb-1">Related Vulnerabilities</h4>
                    <div className="flex flex-wrap gap-2">
                      {advisory.vulnerabilities.map((vuln) => (
                        <Link
                          key={vuln}
                          href={`/vulnerability/${vuln}`}
                          className="inline-flex items-center gap-1 text-primary hover:underline text-sm"
                        >
                          {vuln}
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
          <TabsContent value="critical" className="space-y-4 mt-4">
            {advisories
              .filter((adv) => adv.severity === "Critical")
              .map((advisory) => (
                <Card key={advisory.id}>
                  <CardHeader className="p-4 pb-2">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline">{advisory.id}</Badge>
                          <Badge variant="destructive">{advisory.severity}</Badge>
                        </div>
                        <CardTitle className="text-lg">{advisory.title}</CardTitle>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Published: {advisory.date} by {advisory.source}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-2">
                    <p className="mb-3">{advisory.summary}</p>
                    <div>
                      <h4 className="text-sm font-medium mb-1">Related Vulnerabilities</h4>
                      <div className="flex flex-wrap gap-2">
                        {advisory.vulnerabilities.map((vuln) => (
                          <Link
                            key={vuln}
                            href={`/vulnerability/${vuln}`}
                            className="inline-flex items-center gap-1 text-primary hover:underline text-sm"
                          >
                            {vuln}
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </TabsContent>
          <TabsContent value="high" className="space-y-4 mt-4">
            {advisories
              .filter((adv) => adv.severity === "High")
              .map((advisory) => (
                <Card key={advisory.id}>
                  <CardHeader className="p-4 pb-2">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline">{advisory.id}</Badge>
                          <Badge variant="destructive">{advisory.severity}</Badge>
                        </div>
                        <CardTitle className="text-lg">{advisory.title}</CardTitle>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Published: {advisory.date} by {advisory.source}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-2">
                    <p className="mb-3">{advisory.summary}</p>
                    <div>
                      <h4 className="text-sm font-medium mb-1">Related Vulnerabilities</h4>
                      <div className="flex flex-wrap gap-2">
                        {advisory.vulnerabilities.map((vuln) => (
                          <Link
                            key={vuln}
                            href={`/vulnerability/${vuln}`}
                            className="inline-flex items-center gap-1 text-primary hover:underline text-sm"
                          >
                            {vuln}
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </TabsContent>
          <TabsContent value="medium" className="space-y-4 mt-4">
            {advisories
              .filter((adv) => adv.severity === "Medium")
              .map((advisory) => (
                <Card key={advisory.id}>
                  <CardHeader className="p-4 pb-2">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline">{advisory.id}</Badge>
                          <Badge variant="secondary">{advisory.severity}</Badge>
                        </div>
                        <CardTitle className="text-lg">{advisory.title}</CardTitle>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Published: {advisory.date} by {advisory.source}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-2">
                    <p className="mb-3">{advisory.summary}</p>
                    <div>
                      <h4 className="text-sm font-medium mb-1">Related Vulnerabilities</h4>
                      <div className="flex flex-wrap gap-2">
                        {advisory.vulnerabilities.map((vuln) => (
                          <Link
                            key={vuln}
                            href={`/vulnerability/${vuln}`}
                            className="inline-flex items-center gap-1 text-primary hover:underline text-sm"
                          >
                            {vuln}
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </TabsContent>
          <TabsContent value="low" className="space-y-4 mt-4">
            {advisories
              .filter((adv) => adv.severity === "Low")
              .map((advisory) => (
                <Card key={advisory.id}>
                  <CardHeader className="p-4 pb-2">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline">{advisory.id}</Badge>
                          <Badge variant="outline">{advisory.severity}</Badge>
                        </div>
                        <CardTitle className="text-lg">{advisory.title}</CardTitle>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Published: {advisory.date} by {advisory.source}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-2">
                    <p className="mb-3">{advisory.summary}</p>
                    <div>
                      <h4 className="text-sm font-medium mb-1">Related Vulnerabilities</h4>
                      <div className="flex flex-wrap gap-2">
                        {advisory.vulnerabilities.map((vuln) => (
                          <Link
                            key={vuln}
                            href={`/vulnerability/${vuln}`}
                            className="inline-flex items-center gap-1 text-primary hover:underline text-sm"
                          >
                            {vuln}
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </TabsContent>
        </Tabs>

        <div className="flex justify-center mt-4">
          <Button variant="outline">Load more</Button>
        </div>
      </div>
    </div>
  )
}
