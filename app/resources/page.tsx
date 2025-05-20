import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Code, ExternalLink, Search } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"

// Categories from PayloadsAllTheThings
const categories = [
  {
    name: "Web Attacks",
    items: [
      { name: "SQL Injection", slug: "sql-injection" },
      { name: "XSS Injection", slug: "xss-injection" },
      { name: "CRLF Injection", slug: "crlf-injection" },
      { name: "CSRF Injection", slug: "csrf-injection" },
      { name: "CSV Injection", slug: "csv-injection" },
      { name: "Command Injection", slug: "command-injection" },
      { name: "Directory Traversal", slug: "directory-traversal" },
      { name: "File Inclusion", slug: "file-inclusion" },
      { name: "Open Redirect", slug: "open-redirect" },
      { name: "SSRF", slug: "ssrf" },
      { name: "XML Injection", slug: "xml-injection" },
    ],
  },
  {
    name: "Cloud Security",
    items: [
      { name: "AWS", slug: "aws" },
      { name: "Azure", slug: "azure" },
      { name: "GCP", slug: "gcp" },
      { name: "Kubernetes", slug: "kubernetes" },
      { name: "Docker", slug: "docker" },
    ],
  },
  {
    name: "Authentication",
    items: [
      { name: "OAuth", slug: "oauth" },
      { name: "SAML", slug: "saml" },
      { name: "JWT", slug: "jwt" },
      { name: "LDAP Injection", slug: "ldap-injection" },
      { name: "Kerberos", slug: "kerberos" },
    ],
  },
  {
    name: "Network",
    items: [
      { name: "CORS", slug: "cors" },
      { name: "DNS Rebinding", slug: "dns-rebinding" },
      { name: "WebSockets", slug: "websockets" },
      { name: "HTTP Parameter Pollution", slug: "http-parameter-pollution" },
    ],
  },
  {
    name: "Cryptography",
    items: [
      { name: "Padding Oracle", slug: "padding-oracle" },
      { name: "Hash Length Extension", slug: "hash-length-extension" },
    ],
  },
  {
    name: "Miscellaneous",
    items: [
      { name: "Insecure Deserialization", slug: "insecure-deserialization" },
      { name: "Race Condition", slug: "race-condition" },
      { name: "Template Injection", slug: "template-injection" },
      { name: "XXE Injection", slug: "xxe-injection" },
      { name: "Prototype Pollution", slug: "prototype-pollution" },
    ],
  },
]

// Featured resources
const featuredResources = [
  {
    title: "SQL Injection Cheat Sheet",
    description: "A comprehensive guide to SQL injection techniques and bypasses",
    category: "Web Attacks",
    slug: "sql-injection",
  },
  {
    title: "JWT Security",
    description: "Common vulnerabilities and attack techniques for JSON Web Tokens",
    category: "Authentication",
    slug: "jwt",
  },
  {
    title: "AWS Security",
    description: "Security misconfigurations and attack vectors in AWS environments",
    category: "Cloud Security",
    slug: "aws",
  },
]

export default function ResourcesPage() {
  return (
    <div className="container py-8">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            Security Resources
          </h1>
          <p className="text-muted-foreground max-w-3xl">
            A comprehensive collection of security resources, attack techniques, and payloads for security researchers
            and penetration testers. Content adapted from{" "}
            <a
              href="https://github.com/swisskyrepo/PayloadsAllTheThings"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline inline-flex items-center gap-1"
            >
              PayloadsAllTheThings
              <ExternalLink className="h-3 w-3" />
            </a>
            .
          </p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search resources..."
            className="pl-9 bg-background/60 backdrop-blur-sm border-primary/20 search-glow"
          />
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Featured Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredResources.map((resource) => (
              <Link key={resource.slug} href={`/resources/${resource.slug}`}>
                <Card className="bg-background/40 backdrop-blur-sm border-primary/20 card-hover h-full">
                  <CardHeader className="pb-2">
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 self-start mb-2">
                      {resource.category}
                    </Badge>
                    <CardTitle className="text-lg">{resource.title}</CardTitle>
                    <CardDescription>{resource.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">All Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Card key={category.name} className="bg-background/40 backdrop-blur-sm border-primary/20">
                <CardHeader>
                  <CardTitle>{category.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {category.items.map((item) => (
                      <li key={item.slug}>
                        <Link
                          href={`/resources/${item.slug}`}
                          className="flex items-center gap-2 text-primary hover:underline"
                        >
                          <Code className="h-4 w-4" />
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
