"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Code, Play, Loader2 } from "lucide-react"

interface ApiEndpoint {
  method: "GET" | "POST" | "PUT" | "DELETE"
  path: string
  description: string
  parameters?: {
    name: string
    type: "path" | "query" | "body"
    required: boolean
    description: string
  }[]
  requestBody?: {
    contentType: string
    schema: any
  }
  responses: {
    status: number
    description: string
    example: any
  }[]
}

const endpoints: Record<string, ApiEndpoint[]> = {
  vulnerabilities: [
    {
      method: "GET",
      path: "/api/v1/vulnerabilities",
      description: "List all vulnerabilities with pagination and filtering options",
      parameters: [
        {
          name: "page",
          type: "query",
          required: false,
          description: "Page number for pagination",
        },
        {
          name: "limit",
          type: "query",
          required: false,
          description: "Number of items per page",
        },
        {
          name: "severity",
          type: "query",
          required: false,
          description: "Filter by severity (low, medium, high, critical)",
        },
      ],
      responses: [
        {
          status: 200,
          description: "Successful response",
          example: {
            data: [
              {
                id: "CVE-2023-1234",
                title: "SQL Injection in PostgreSQL",
                description: "A vulnerability in PostgreSQL allows an attacker to execute arbitrary SQL commands.",
                severity: 3.4,
                affected_packages: ["postgresql"],
                published_at: "2023-05-11T14:30:00Z",
              },
            ],
            total: 1,
            page: 1,
            limit: 20,
          },
        },
      ],
    },
    {
      method: "GET",
      path: "/api/v1/vulnerabilities/{id}",
      description: "Get detailed information about a specific vulnerability",
      parameters: [
        {
          name: "id",
          type: "path",
          required: true,
          description: "Vulnerability ID (e.g., CVE-2023-1234)",
        },
      ],
      responses: [
        {
          status: 200,
          description: "Successful response",
          example: {
            id: "CVE-2023-1234",
            title: "SQL Injection in PostgreSQL",
            description: "A vulnerability in PostgreSQL allows an attacker to execute arbitrary SQL commands.",
            severity: 3.4,
            cvss: "CVSS:3.1/AV:N/AC:H/PR:L/UI:N/S:U/C:H/I:L/A:L",
            cwe: "CWE-89",
            affected_packages: ["postgresql"],
            affected_versions: ["13.19", "[14.0,14.16)", "[15.0,15.11)", "[16.0,16.7)", "[17.0,17.3)"],
            published_at: "2023-05-11T14:30:00Z",
            updated_at: "2023-05-18T09:15:00Z",
            references: [
              {
                title: "PostgreSQL Security Advisory",
                url: "https://www.postgresql.org/support/security/",
              },
            ],
            remediation: "Upgrade postgresql to version 13.19, 14.16, 15.11, 16.7, 17.3 or higher.",
          },
        },
        {
          status: 404,
          description: "Vulnerability not found",
          example: {
            error: "Vulnerability not found",
          },
        },
      ],
    },
    {
      method: "POST",
      path: "/api/v1/vulnerabilities/search",
      description: "Search for vulnerabilities with advanced filtering options",
      requestBody: {
        contentType: "application/json",
        schema: {
          query: "string",
          severity: ["string"],
          affected_packages: ["string"],
          from_date: "string",
          to_date: "string",
        },
      },
      responses: [
        {
          status: 200,
          description: "Successful response",
          example: {
            data: [
              {
                id: "CVE-2023-1234",
                title: "SQL Injection in PostgreSQL",
                description: "A vulnerability in PostgreSQL allows an attacker to execute arbitrary SQL commands.",
                severity: 3.4,
                affected_packages: ["postgresql"],
                published_at: "2023-05-11T14:30:00Z",
              },
            ],
            total: 1,
            page: 1,
            limit: 20,
          },
        },
      ],
    },
  ],
  advisories: [
    {
      method: "GET",
      path: "/api/v1/advisories",
      description: "List all security advisories with pagination and filtering options",
      parameters: [
        {
          name: "page",
          type: "query",
          required: false,
          description: "Page number for pagination",
        },
        {
          name: "limit",
          type: "query",
          required: false,
          description: "Number of items per page",
        },
        {
          name: "source",
          type: "query",
          required: false,
          description: "Filter by source (github, gitlab, nvd, etc.)",
        },
      ],
      responses: [
        {
          status: 200,
          description: "Successful response",
          example: {
            data: [
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
            ],
            total: 1,
            page: 1,
            limit: 20,
          },
        },
      ],
    },
  ],
  packages: [
    {
      method: "GET",
      path: "/api/v1/packages/{name}/vulnerabilities",
      description: "Get all vulnerabilities affecting a specific package",
      parameters: [
        {
          name: "name",
          type: "path",
          required: true,
          description: "Package name (e.g., lodash)",
        },
      ],
      responses: [
        {
          status: 200,
          description: "Successful response",
          example: {
            package: "lodash",
            vulnerabilities: [
              {
                id: "CVE-2021-23337",
                title: "Prototype Pollution in lodash",
                severity: 4.2,
                affected_versions: ["<4.17.21"],
                published_at: "2021-02-15T14:30:00Z",
              },
            ],
          },
        },
      ],
    },
    {
      method: "POST",
      path: "/api/v1/packages/check",
      description: "Check multiple packages for known vulnerabilities",
      requestBody: {
        contentType: "application/json",
        schema: {
          packages: [
            {
              name: "string",
              version: "string",
            },
          ],
        },
      },
      responses: [
        {
          status: 200,
          description: "Successful response",
          example: {
            "lodash@4.17.15": [
              {
                id: "CVE-2021-23337",
                title: "Prototype Pollution in lodash",
                severity: 4.2,
                affected_versions: ["<4.17.21"],
                published_at: "2021-02-15T14:30:00Z",
              },
            ],
            "express@4.17.1": [],
          },
        },
      ],
    },
  ],
}

export default function ApiPlayground() {
  const [category, setCategory] = useState<string>("vulnerabilities")
  const [endpoint, setEndpoint] = useState<ApiEndpoint | null>(null)
  const [pathParams, setPathParams] = useState<Record<string, string>>({})
  const [queryParams, setQueryParams] = useState<Record<string, string>>({})
  const [requestBody, setRequestBody] = useState<string>("")
  const [response, setResponse] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [apiKey, setApiKey] = useState<string>("")

  const handleCategoryChange = (value: string) => {
    setCategory(value)
    setEndpoint(null)
    setPathParams({})
    setQueryParams({})
    setRequestBody("")
    setResponse("")
  }

  const handleEndpointChange = (index: number) => {
    const selected = endpoints[category][index]
    setEndpoint(selected)
    setPathParams({})
    setQueryParams({})

    if (selected.requestBody) {
      setRequestBody(JSON.stringify(selected.requestBody.schema, null, 2))
    } else {
      setRequestBody("")
    }

    setResponse("")
  }

  const handlePathParamChange = (name: string, value: string) => {
    setPathParams((prev) => ({ ...prev, [name]: value }))
  }

  const handleQueryParamChange = (name: string, value: string) => {
    setQueryParams((prev) => ({ ...prev, [name]: value }))
  }

  const handleRequestBodyChange = (value: string) => {
    setRequestBody(value)
  }

  const handleExecute = () => {
    if (!endpoint) return

    setLoading(true)

    // Replace path parameters in the URL
    let url = endpoint.path
    Object.entries(pathParams).forEach(([key, value]) => {
      url = url.replace(`{${key}}`, value)
    })

    // Add query parameters
    if (Object.keys(queryParams).length > 0) {
      const queryString = Object.entries(queryParams)
        .filter(([_, value]) => value)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join("&")
      url = `${url}?${queryString}`
    }

    // Simulate API call
    setTimeout(() => {
      // Get the first successful response example
      const successResponse = endpoint.responses.find((r) => r.status >= 200 && r.status < 300)
      setResponse(JSON.stringify(successResponse?.example || {}, null, 2))
      setLoading(false)
    }, 1000)
  }

  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET":
        return "bg-green-500/10 text-green-500 border-green-500/30"
      case "POST":
        return "bg-blue-500/10 text-blue-500 border-blue-500/30"
      case "PUT":
        return "bg-amber-500/10 text-amber-500 border-amber-500/30"
      case "DELETE":
        return "bg-red-500/10 text-red-500 border-red-500/30"
      default:
        return "bg-primary/10 text-primary border-primary/30"
    }
  }

  return (
    <Card className="bg-background/40 backdrop-blur-sm border-primary/20">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Code className="h-5 w-5 text-primary" />
          <CardTitle>API Playground</CardTitle>
        </div>
        <CardDescription>Test API endpoints directly in your browser</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="api-key">API Key</Label>
                <Input
                  id="api-key"
                  type="password"
                  placeholder="Enter your API key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Category</Label>
                <Select value={category} onValueChange={handleCategoryChange}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vulnerabilities">Vulnerabilities</SelectItem>
                    <SelectItem value="advisories">Advisories</SelectItem>
                    <SelectItem value="packages">Packages</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Endpoint</Label>
                <Select onValueChange={(value) => handleEndpointChange(Number.parseInt(value))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select endpoint" />
                  </SelectTrigger>
                  <SelectContent>
                    {endpoints[category].map((endpoint, index) => (
                      <SelectItem key={index} value={index.toString()}>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={getMethodColor(endpoint.method)}>
                            {endpoint.method}
                          </Badge>
                          <span>{endpoint.path}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {endpoint && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground">{endpoint.description}</p>
                </div>

                {endpoint.parameters && endpoint.parameters.filter((p) => p.type === "path").length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Path Parameters</h4>
                    <div className="space-y-2">
                      {endpoint.parameters
                        .filter((p) => p.type === "path")
                        .map((param) => (
                          <div key={param.name}>
                            <Label htmlFor={`path-${param.name}`}>
                              {param.name}
                              {param.required && <span className="text-red-500">*</span>}
                            </Label>
                            <Input
                              id={`path-${param.name}`}
                              placeholder={param.description}
                              value={pathParams[param.name] || ""}
                              onChange={(e) => handlePathParamChange(param.name, e.target.value)}
                              className="mt-1"
                            />
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {endpoint.parameters && endpoint.parameters.filter((p) => p.type === "query").length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Query Parameters</h4>
                    <div className="space-y-2">
                      {endpoint.parameters
                        .filter((p) => p.type === "query")
                        .map((param) => (
                          <div key={param.name}>
                            <Label htmlFor={`query-${param.name}`}>
                              {param.name}
                              {param.required && <span className="text-red-500">*</span>}
                            </Label>
                            <Input
                              id={`query-${param.name}`}
                              placeholder={param.description}
                              value={queryParams[param.name] || ""}
                              onChange={(e) => handleQueryParamChange(param.name, e.target.value)}
                              className="mt-1"
                            />
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {endpoint.requestBody && (
                  <div>
                    <h4 className="font-medium mb-2">Request Body</h4>
                    <Textarea
                      value={requestBody}
                      onChange={(e) => handleRequestBodyChange(e.target.value)}
                      className="font-mono text-sm h-40"
                    />
                  </div>
                )}

                <Button
                  onClick={handleExecute}
                  className="w-full bg-primary hover:bg-primary/90 shadow-glow shadow-primary/20"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Executing...
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Execute Request
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>

          <div>
            <h4 className="font-medium mb-2">Response</h4>
            <div className="bg-muted/50 p-4 rounded-md border border-primary/20 h-[500px] overflow-auto">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : response ? (
                <pre className="font-mono text-sm whitespace-pre-wrap">{response}</pre>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <p>Select an endpoint and execute a request to see the response</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
