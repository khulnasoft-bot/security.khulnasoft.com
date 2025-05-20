import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Code, Database, Key, Shield, Zap } from "lucide-react"
import IconCard from "@/components/icon-card"
import CopyButton from "@/components/copy-button"
import ApiPlayground from "@/components/api-playground"

export default function ApiDocsPage() {
  return (
    <div className="container py-8">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Code className="h-6 w-6 text-primary" />
            API Documentation
          </h1>
          <p className="text-muted-foreground max-w-3xl">
            Integrate KhulnaSoft vulnerability data directly into your security tools and workflows with our
            comprehensive API. Access real-time vulnerability intelligence to enhance your security posture.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <IconCard
            icon={Database}
            title="Comprehensive Data"
            description="Access our entire database of vulnerabilities from multiple sources"
          />
          <IconCard
            icon={Zap}
            title="Real-time Updates"
            description="Get notified about new vulnerabilities as soon as they're discovered"
          />
          <IconCard
            icon={Shield}
            title="Security Intelligence"
            description="Enhance your security tools with actionable vulnerability data"
          />
        </div>

        <section id="playground">
          <h2 className="text-2xl font-bold mb-4">Interactive API Playground</h2>
          <ApiPlayground />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <h2 className="text-xl font-bold mb-4">Contents</h2>
              <nav className="space-y-2">
                <a
                  href="#authentication"
                  className="block p-2 rounded-md hover:bg-primary/10 text-muted-foreground hover:text-foreground"
                >
                  Authentication
                </a>
                <a
                  href="#endpoints"
                  className="block p-2 rounded-md hover:bg-primary/10 text-muted-foreground hover:text-foreground"
                >
                  API Endpoints
                </a>
                <a
                  href="#rate-limits"
                  className="block p-2 rounded-md hover:bg-primary/10 text-muted-foreground hover:text-foreground"
                >
                  Rate Limits
                </a>
                <a
                  href="#examples"
                  className="block p-2 rounded-md hover:bg-primary/10 text-muted-foreground hover:text-foreground"
                >
                  Code Examples
                </a>
                <a
                  href="#webhooks"
                  className="block p-2 rounded-md hover:bg-primary/10 text-muted-foreground hover:text-foreground"
                >
                  Webhooks
                </a>
                <a
                  href="#sdks"
                  className="block p-2 rounded-md hover:bg-primary/10 text-muted-foreground hover:text-foreground"
                >
                  SDKs & Libraries
                </a>
              </nav>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-8">
            <section id="authentication">
              <Card className="bg-background/40 backdrop-blur-sm border-primary/20">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Key className="h-5 w-5 text-primary" />
                    <CardTitle>Authentication</CardTitle>
                  </div>
                  <CardDescription>
                    Secure your API requests with API keys for authentication and authorization
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    All API requests require authentication using an API key. You can generate an API key in your
                    account dashboard.
                  </p>

                  <div className="bg-muted/50 p-4 rounded-md border border-primary/20">
                    <h4 className="font-medium mb-2">API Key Authentication</h4>
                    <p className="text-sm mb-3">Include your API key in the request headers for all API calls:</p>
                    <pre className="bg-background/60 p-3 rounded-md overflow-x-auto border border-primary/20">
                      <code className="text-sm text-primary">{`Authorization: Bearer YOUR_API_KEY`}</code>
                    </pre>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-md border border-primary/20">
                    <h4 className="font-medium mb-2">API Key Management</h4>
                    <p className="text-sm">
                      You can create, rotate, and revoke API keys from your account dashboard. We recommend rotating
                      your API keys periodically for enhanced security.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </section>

            <section id="endpoints">
              <Card className="bg-background/40 backdrop-blur-sm border-primary/20">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Code className="h-5 w-5 text-primary" />
                    <CardTitle>API Endpoints</CardTitle>
                  </div>
                  <CardDescription>
                    Explore the available API endpoints for accessing vulnerability data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="vulnerabilities">
                    <TabsList className="mb-4 bg-muted/50">
                      <TabsTrigger value="vulnerabilities">Vulnerabilities</TabsTrigger>
                      <TabsTrigger value="advisories">Advisories</TabsTrigger>
                      <TabsTrigger value="packages">Packages</TabsTrigger>
                    </TabsList>

                    <TabsContent value="vulnerabilities" className="space-y-4">
                      <div className="bg-muted/50 p-4 rounded-md border border-primary/20">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30">
                              GET
                            </Badge>
                            <h4 className="font-medium">/api/v1/vulnerabilities</h4>
                          </div>
                          <CopyButton text="curl -X GET https://api.khulnasoft.com/v1/vulnerabilities -H 'Authorization: Bearer YOUR_API_KEY'" />
                        </div>
                        <p className="text-sm mb-3">List all vulnerabilities with pagination and filtering options.</p>
                        <pre className="bg-background/60 p-3 rounded-md overflow-x-auto border border-primary/20">
                          <code className="text-sm text-primary">
                            {`GET /api/v1/vulnerabilities?page=1&limit=20&severity=high`}
                          </code>
                        </pre>
                      </div>

                      <div className="bg-muted/50 p-4 rounded-md border border-primary/20">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30">
                              GET
                            </Badge>
                            <h4 className="font-medium">/api/v1/vulnerabilities/{"{id}"}</h4>
                          </div>
                          <CopyButton text="curl -X GET https://api.khulnasoft.com/v1/vulnerabilities/CVE-2023-1234 -H 'Authorization: Bearer YOUR_API_KEY'" />
                        </div>
                        <p className="text-sm mb-3">Get detailed information about a specific vulnerability.</p>
                        <pre className="bg-background/60 p-3 rounded-md overflow-x-auto border border-primary/20">
                          <code className="text-sm text-primary">{`GET /api/v1/vulnerabilities/CVE-2023-1234`}</code>
                        </pre>
                      </div>

                      <div className="bg-muted/50 p-4 rounded-md border border-primary/20">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/30">
                              POST
                            </Badge>
                            <h4 className="font-medium">/api/v1/vulnerabilities/search</h4>
                          </div>
                          <CopyButton
                            text={`curl -X POST https://api.khulnasoft.com/v1/vulnerabilities/search -H "Authorization: Bearer YOUR_API_KEY" -H "Content-Type: application/json" -d '{"query": "sql injection", "severity": ["high", "critical"]}'`}
                          />
                        </div>
                        <p className="text-sm mb-3">Search for vulnerabilities with advanced filtering options.</p>
                        <pre className="bg-background/60 p-3 rounded-md overflow-x-auto border border-primary/20">
                          <code className="text-sm text-primary">
                            {`POST /api/v1/vulnerabilities/search
Content-Type: application/json

{
  "query": "sql injection",
  "severity": ["high", "critical"],
  "affected_packages": ["postgresql"],
  "from_date": "2023-01-01",
  "to_date": "2023-12-31"
}`}
                          </code>
                        </pre>
                      </div>
                    </TabsContent>

                    <TabsContent value="advisories" className="space-y-4">
                      <div className="bg-muted/50 p-4 rounded-md border border-primary/20">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30">
                              GET
                            </Badge>
                            <h4 className="font-medium">/api/v1/advisories</h4>
                          </div>
                          <CopyButton text="curl -X GET https://api.khulnasoft.com/v1/advisories -H 'Authorization: Bearer YOUR_API_KEY'" />
                        </div>
                        <p className="text-sm mb-3">
                          List all security advisories with pagination and filtering options.
                        </p>
                        <pre className="bg-background/60 p-3 rounded-md overflow-x-auto border border-primary/20">
                          <code className="text-sm text-primary">
                            {`GET /api/v1/advisories?page=1&limit=20&source=github`}
                          </code>
                        </pre>
                      </div>

                      <div className="bg-muted/50 p-4 rounded-md border border-primary/20">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30">
                              GET
                            </Badge>
                            <h4 className="font-medium">/api/v1/advisories/{"{id}"}</h4>
                          </div>
                          <CopyButton text="curl -X GET https://api.khulnasoft.com/v1/advisories/GHSA-abcd-1234-5678 -H 'Authorization: Bearer YOUR_API_KEY'" />
                        </div>
                        <p className="text-sm mb-3">Get detailed information about a specific advisory.</p>
                        <pre className="bg-background/60 p-3 rounded-md overflow-x-auto border border-primary/20">
                          <code className="text-sm text-primary">{`GET /api/v1/advisories/GHSA-abcd-1234-5678`}</code>
                        </pre>
                      </div>
                    </TabsContent>

                    <TabsContent value="packages" className="space-y-4">
                      <div className="bg-muted/50 p-4 rounded-md border border-primary/20">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30">
                              GET
                            </Badge>
                            <h4 className="font-medium">/api/v1/packages/{"{name}"}/vulnerabilities</h4>
                          </div>
                          <CopyButton text="curl -X GET https://api.khulnasoft.com/v1/packages/lodash/vulnerabilities -H 'Authorization: Bearer YOUR_API_KEY'" />
                        </div>
                        <p className="text-sm mb-3">Get all vulnerabilities affecting a specific package.</p>
                        <pre className="bg-background/60 p-3 rounded-md overflow-x-auto border border-primary/20">
                          <code className="text-sm text-primary">{`GET /api/v1/packages/lodash/vulnerabilities`}</code>
                        </pre>
                      </div>

                      <div className="bg-muted/50 p-4 rounded-md border border-primary/20">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/30">
                              POST
                            </Badge>
                            <h4 className="font-medium">/api/v1/packages/check</h4>
                          </div>
                          <CopyButton
                            text={`curl -X POST https://api.khulnasoft.com/v1/packages/check -H "Authorization: Bearer YOUR_API_KEY" -H "Content-Type: application/json" -d '{"packages": [{"name": "lodash", "version": "4.17.15"}, {"name": "express", "version": "4.17.1"}]}'`}
                          />
                        </div>
                        <p className="text-sm mb-3">Check multiple packages for known vulnerabilities.</p>
                        <pre className="bg-background/60 p-3 rounded-md overflow-x-auto border border-primary/20">
                          <code className="text-sm text-primary">
                            {`POST /api/v1/packages/check
Content-Type: application/json

{
  "packages": [
    {
      "name": "lodash",
      "version": "4.17.15"
    },
    {
      "name": "express",
      "version": "4.17.1"
    }
  ]
}`}
                          </code>
                        </pre>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </section>

            <section id="rate-limits">
              <Card className="bg-background/40 backdrop-blur-sm border-primary/20">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    <CardTitle>Rate Limits</CardTitle>
                  </div>
                  <CardDescription>
                    Understand the API rate limits to ensure reliable service for all users
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    To ensure fair usage and maintain service quality, our API implements rate limiting. Rate limits
                    vary based on your subscription plan.
                  </p>

                  <div className="relative overflow-x-auto rounded-md border border-primary/20">
                    <table className="w-full text-sm">
                      <thead className="bg-primary/10 text-xs uppercase">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left">
                            Plan
                          </th>
                          <th scope="col" className="px-6 py-3 text-left">
                            Rate Limit
                          </th>
                          <th scope="col" className="px-6 py-3 text-left">
                            Burst Limit
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-primary/10">
                          <td className="px-6 py-4 font-medium">Free</td>
                          <td className="px-6 py-4">100 requests/hour</td>
                          <td className="px-6 py-4">10 requests/second</td>
                        </tr>
                        <tr className="border-b border-primary/10">
                          <td className="px-6 py-4 font-medium">Developer</td>
                          <td className="px-6 py-4">1,000 requests/hour</td>
                          <td className="px-6 py-4">20 requests/second</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 font-medium">Enterprise</td>
                          <td className="px-6 py-4">10,000 requests/hour</td>
                          <td className="px-6 py-4">50 requests/second</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-md border border-primary/20">
                    <h4 className="font-medium mb-2">Rate Limit Headers</h4>
                    <p className="text-sm mb-3">
                      Each API response includes headers to help you track your rate limit usage:
                    </p>
                    <pre className="bg-background/60 p-3 rounded-md overflow-x-auto border border-primary/20">
                      <code className="text-sm text-primary">
                        {`X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 950
X-RateLimit-Reset: 1620000000`}
                      </code>
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </section>

            <section id="examples">
              <Card className="bg-background/40 backdrop-blur-sm border-primary/20">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Code className="h-5 w-5 text-primary" />
                    <CardTitle>Code Examples</CardTitle>
                  </div>
                  <CardDescription>
                    Learn how to integrate our API with code examples in various programming languages
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="javascript">
                    <TabsList className="mb-4 bg-muted/50">
                      <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                      <TabsTrigger value="python">Python</TabsTrigger>
                      <TabsTrigger value="go">Go</TabsTrigger>
                    </TabsList>

                    <TabsContent value="javascript" className="space-y-4">
                      <div className="bg-muted/50 p-4 rounded-md border border-primary/20">
                        <h4 className="font-medium mb-2">Fetch Vulnerabilities</h4>
                        <pre className="bg-background/60 p-3 rounded-md overflow-x-auto border border-primary/20">
                          <code className="text-sm text-primary">
                            {`// Using fetch API
const fetchVulnerabilities = async () => {
  const response = await fetch('https://api.khulnasoft.com/v1/vulnerabilities', {
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY'
    }
  });
  
  if (!response.ok) {
    throw new Error(\`API error: \${response.status}\`);
  }
  
  const data = await response.json();
  return data;
};

// Using axios
import axios from 'axios';

const client = axios.create({
  baseURL: 'https://api.khulnasoft.com/v1',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  }
});

const fetchVulnerabilities = async () => {
  const response = await client.get('/vulnerabilities');
  return response.data;
};`}
                          </code>
                        </pre>
                      </div>

                      <div className="bg-muted/50 p-4 rounded-md border border-primary/20">
                        <h4 className="font-medium mb-2">Check Package Vulnerabilities</h4>
                        <pre className="bg-background/60 p-3 rounded-md overflow-x-auto border border-primary/20">
                          <code className="text-sm text-primary">
                            {`import axios from 'axios';

const checkPackages = async (packages) => {
  const client = axios.create({
    baseURL: 'https://api.khulnasoft.com/v1',
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY',
      'Content-Type': 'application/json'
    }
  });

  const response = await client.post('/packages/check', {
    packages: packages
  });
  
  return response.data;
};

// Example usage
const packages = [
  { name: 'lodash', version: '4.17.15' },
  { name: 'express', version: '4.17.1' }
];

checkPackages(packages)
  .then(results => console.log(results))
  .catch(error => console.error('Error checking packages:', error));`}
                          </code>
                        </pre>
                      </div>
                    </TabsContent>

                    <TabsContent value="python" className="space-y-4">
                      <div className="bg-muted/50 p-4 rounded-md border border-primary/20">
                        <h4 className="font-medium mb-2">Fetch Vulnerabilities</h4>
                        <pre className="bg-background/60 p-3 rounded-md overflow-x-auto border border-primary/20">
                          <code className="text-sm text-primary">
                            {`import requests

def fetch_vulnerabilities(api_key, page=1, limit=20):
    url = f"https://api.khulnasoft.com/v1/vulnerabilities"
    headers = {
        "Authorization": f"Bearer {api_key}"
    }
    params = {
        "page": page,
        "limit": limit
    }
    
    response = requests.get(url, headers=headers, params=params)
    response.raise_for_status()  # Raise exception for 4XX/5XX responses
    
    return response.json()

# Example usage
api_key = "YOUR_API_KEY"
try:
    vulnerabilities = fetch_vulnerabilities(api_key)
    print(f"Found {len(vulnerabilities['data'])} vulnerabilities")
except requests.exceptions.RequestException as e:
    print(f"Error fetching vulnerabilities: {e}")`}
                          </code>
                        </pre>
                      </div>

                      <div className="bg-muted/50 p-4 rounded-md border border-primary/20">
                        <h4 className="font-medium mb-2">Check Package Vulnerabilities</h4>
                        <pre className="bg-background/60 p-3 rounded-md overflow-x-auto border border-primary/20">
                          <code className="text-sm text-primary">
                            {`import requests

def check_packages(api_key, packages):
    url = "https://api.khulnasoft.com/v1/packages/check"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    payload = {
        "packages": packages
    }
    
    response = requests.post(url, headers=headers, json=payload)
    response.raise_for_status()
    
    return response.json()

# Example usage
api_key = "YOUR_API_KEY"
packages = [
    {"name": "lodash", "version": "4.17.15"},
    {"name": "express", "version": "4.17.1"}
]

try:
    results = check_packages(api_key, packages)
    for package, vulnerabilities in results.items():
        print(f"{package}: {len(vulnerabilities)} vulnerabilities found")
except requests.exceptions.RequestException as e:
    print(f"Error checking packages: {e}")`}
                          </code>
                        </pre>
                      </div>
                    </TabsContent>

                    <TabsContent value="go" className="space-y-4">
                      <div className="bg-muted/50 p-4 rounded-md border border-primary/20">
                        <h4 className="font-medium mb-2">Fetch Vulnerabilities</h4>
                        <pre className="bg-background/60 p-3 rounded-md overflow-x-auto border border-primary/20">
                          <code className="text-sm text-primary">
                            {`package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

type Vulnerability struct {
	ID          string  \`json:"id"\`
	Title       string  \`json:"title"\`
	Description string  \`json:"description"\`
	Severity    float64 \`json:"severity"\`
}

type VulnerabilityResponse struct {
	Data  []Vulnerability \`json:"data"\`
	Total int            \`json:"total"\`
	Page  int            \`json:"page"\`
	Limit int            \`json:"limit"\`
}

func fetchVulnerabilities(apiKey string) (*VulnerabilityResponse, error) {
	client := &http.Client{}
	req, err := http.NewRequest("GET", "https://api.khulnasoft.com/v1/vulnerabilities", nil)
	if err != nil {
		return nil, err
	}

	req.Header.Add("Authorization", "Bearer "+apiKey)

	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("API returned non-200 status: %d", resp.StatusCode)
	}

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	var vulnResp VulnerabilityResponse
	err = json.Unmarshal(body, &vulnResp)
	if err != nil {
		return nil, err
	}

	return &vulnResp, nil
}

func main() {
	apiKey := "YOUR_API_KEY"
	
	vulns, err := fetchVulnerabilities(apiKey)
	if err != nil {
		fmt.Printf("Error fetching vulnerabilities: %v\\n", err)
		return
	}
	
	fmt.Printf("Found %d vulnerabilities\\n", vulns.Total)
	for _, vuln := range vulns.Data {
		fmt.Printf("- %s (Severity: %.1f)\\n", vuln.Title, vuln.Severity)
	}
}`}
                          </code>
                        </pre>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </section>

            <section id="webhooks">
              <Card className="bg-background/40 backdrop-blur-sm border-primary/20">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    <CardTitle>Webhooks</CardTitle>
                  </div>
                  <CardDescription>
                    Receive real-time notifications about new vulnerabilities via webhooks
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    Webhooks allow you to receive real-time notifications when new vulnerabilities are discovered or
                    existing vulnerabilities are updated. This enables you to take immediate action to protect your
                    systems.
                  </p>

                  <div className="bg-muted/50 p-4 rounded-md border border-primary/20">
                    <h4 className="font-medium mb-2">Setting Up Webhooks</h4>
                    <p className="text-sm mb-3">
                      You can configure webhooks in your account dashboard. Specify the URL where you want to receive
                      webhook events and select the event types you're interested in.
                    </p>
                    <pre className="bg-background/60 p-3 rounded-md overflow-x-auto border border-primary/20">
                      <code className="text-sm text-primary">
                        {`// Example webhook payload
{
  "event_type": "vulnerability.created",
  "timestamp": "2023-05-11T14:30:00Z",
  "data": {
    "id": "CVE-2023-1234",
    "title": "SQL Injection in PostgreSQL",
    "severity": 3.4,
    "affected_packages": ["postgresql"],
    "url": "https://khulnasoft.com/vulnerability/CVE-2023-1234"
  }
}`}
                      </code>
                    </pre>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-md border border-primary/20">
                    <h4 className="font-medium mb-2">Webhook Event Types</h4>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <strong>vulnerability.created</strong> - Triggered when a new vulnerability is added to the
                        database
                      </li>
                      <li>
                        <strong>vulnerability.updated</strong> - Triggered when an existing vulnerability is updated
                      </li>
                      <li>
                        <strong>advisory.published</strong> - Triggered when a new security advisory is published
                      </li>
                      <li>
                        <strong>package.vulnerable</strong> - Triggered when a new vulnerability is found in a package
                        you're monitoring
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </section>

            <section id="sdks">
              <Card className="bg-background/40 backdrop-blur-sm border-primary/20">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Code className="h-5 w-5 text-primary" />
                    <CardTitle>SDKs & Libraries</CardTitle>
                  </div>
                  <CardDescription>
                    Official client libraries to help you integrate with our API more easily
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-muted/50 p-4 rounded-md border border-primary/20">
                      <h4 className="font-medium mb-2">JavaScript SDK</h4>
                      <p className="text-sm mb-3">
                        Official JavaScript/TypeScript SDK for Node.js and browser applications.
                      </p>
                      <pre className="bg-background/60 p-3 rounded-md overflow-x-auto border border-primary/20 mb-3">
                        <code className="text-sm text-primary">{`npm install @khulnasoft/security-sdk`}</code>
                      </pre>
                      <Button variant="outline" className="w-full border-primary/40 hover:bg-primary/10">
                        View Documentation
                      </Button>
                    </div>

                    <div className="bg-muted/50 p-4 rounded-md border border-primary/20">
                      <h4 className="font-medium mb-2">Python SDK</h4>
                      <p className="text-sm mb-3">
                        Official Python SDK for integrating with the KhulnaSoft Security API.
                      </p>
                      <pre className="bg-background/60 p-3 rounded-md overflow-x-auto border border-primary/20 mb-3">
                        <code className="text-sm text-primary">{`pip install khulnasoft-security`}</code>
                      </pre>
                      <Button variant="outline" className="w-full border-primary/40 hover:bg-primary/10">
                        View Documentation
                      </Button>
                    </div>

                    <div className="bg-muted/50 p-4 rounded-md border border-primary/20">
                      <h4 className="font-medium mb-2">Go SDK</h4>
                      <p className="text-sm mb-3">Official Go SDK for integrating with the KhulnaSoft Security API.</p>
                      <pre className="bg-background/60 p-3 rounded-md overflow-x-auto border border-primary/20 mb-3">
                        <code className="text-sm text-primary">{`go get github.com/khulnasoft/security-sdk-go`}</code>
                      </pre>
                      <Button variant="outline" className="w-full border-primary/40 hover:bg-primary/10">
                        View Documentation
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
