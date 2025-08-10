import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { Search, Shield, Database, RefreshCw, Code, Zap } from "lucide-react"
import PlatformIcons from "@/components/platform-icons"
import FeaturedVulnerability from "@/components/featured-vulnerability"
import VulnerabilityCard from "@/components/vulnerability-card"
import RealTimeFeed from "@/components/real-time-feed"
import IconCard from "@/components/icon-card"
import SeedControls from "@/components/seed-controls"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="container py-10 md:py-16 lg:py-20 hero-gradient">
        <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-16 w-16 text-primary shadow-glow shadow-primary" />
          </div>
          <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-6xl glow-text shadow-primary">
            KhulnaSoft Security Database
          </h1>
          <p className="max-w-[700px] text-lg text-muted-foreground md:text-xl">
            The leading database for open source vulnerabilities and security advisories
          </p>
          <div className="relative w-full max-w-2xl mt-4">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by package name, CVE, or keyword..."
              className="w-full pl-10 pr-4 py-6 text-base bg-background/60 backdrop-blur-sm border-primary/20 search-glow"
            />
          </div>
        </div>
      </section>

      <section className="container py-8">
        <PlatformIcons />
      </section>

      <section className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-primary" />
              Vulnerabilities from the last week
            </h2>
            <Tabs defaultValue="application">
              <TabsList className="mb-4 bg-muted/50">
                <TabsTrigger value="application">Application</TabsTrigger>
                <TabsTrigger value="os">Operating System</TabsTrigger>
                <TabsTrigger value="cloud">Cloud</TabsTrigger>
              </TabsList>
              <TabsContent value="application" className="space-y-4">
                <VulnerabilityCard
                  id="GHSA-xvch-r4wf-h8w9"
                  title="Command Injection in express-fileupload"
                  severity={3.8}
                  affects={["express-fileupload"]}
                  type="application"
                />
                <VulnerabilityCard
                  id="GHSA-7rqg-2h9m-v13r"
                  title="Prototype Pollution in lodash"
                  severity={4.2}
                  affects={["lodash"]}
                  type="application"
                />
                <VulnerabilityCard
                  id="GHSA-p6mc-m468-83gw"
                  title="Path Traversal in adm-zip"
                  severity={3.5}
                  affects={["adm-zip"]}
                  type="application"
                />
              </TabsContent>
              <TabsContent value="os" className="space-y-4">
                <VulnerabilityCard
                  id="CVE-2023-4863"
                  title="Heap Buffer Overflow in WebP"
                  severity={4.0}
                  affects={["libwebp", "chromium"]}
                  type="os"
                />
                <VulnerabilityCard
                  id="CVE-2023-5129"
                  title="Privilege Escalation in Linux Kernel"
                  severity={3.7}
                  affects={["linux-kernel"]}
                  type="os"
                />
              </TabsContent>
              <TabsContent value="cloud" className="space-y-4">
                <VulnerabilityCard
                  id="CVE-2023-3676"
                  title="Container Escape in Docker"
                  severity={3.9}
                  affects={["docker-engine"]}
                  type="cloud"
                />
                <VulnerabilityCard
                  id="CVE-2023-2878"
                  title="Privilege Escalation in Kubernetes"
                  severity={4.1}
                  affects={["kubernetes"]}
                  type="cloud"
                />
              </TabsContent>
            </Tabs>
            <div className="mt-6">
              <Button asChild variant="outline" className="border-primary/40 hover:bg-primary/10 bg-transparent">
                <Link href="/vulnerabilities">View all vulnerabilities</Link>
              </Button>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Featured Vulnerability
            </h2>
            <FeaturedVulnerability />
          </div>
        </div>
      </section>

      <section className="container py-8">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          Real-time Vulnerability Feed
        </h2>
        <RealTimeFeed />
        <div className="mt-4">
          <SeedControls />
        </div>
      </section>

      <section className="container py-8">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Code className="h-5 w-5 text-primary" />
          API Integration
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <IconCard
            icon={Database}
            title="Comprehensive API"
            description="Access our entire vulnerability database through our RESTful API"
            href="/api-docs"
          />
          <IconCard
            icon={Zap}
            title="Real-time Updates"
            description="Get notified about new vulnerabilities as soon as they're discovered"
            href="/api-docs#webhooks"
          />
          <IconCard
            icon={Code}
            title="Developer SDKs"
            description="Integrate with our API using our official client libraries"
            href="/api-docs#sdks"
          />
        </div>
        <div className="mt-6 flex justify-center">
          <Button asChild className="bg-primary hover:bg-primary/90 shadow-glow shadow-primary/20">
            <Link href="/api-docs">View API Documentation</Link>
          </Button>
        </div>
      </section>

      <section className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-background/40 backdrop-blur-sm border-primary/20 card-hover">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center gap-2">
                <div className="rounded-full bg-primary/10 p-3 shadow-glow shadow-primary">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Comprehensive Coverage</h3>
                <p className="text-muted-foreground">
                  Access vulnerability data from multiple sources including NVD, GitHub, GitLab, and more.
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-background/40 backdrop-blur-sm border-primary/20 card-hover">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center gap-2">
                <div className="rounded-full bg-primary/10 p-3 shadow-glow shadow-primary">
                  <Database className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Detailed Advisories</h3>
                <p className="text-muted-foreground">
                  Get detailed information about vulnerabilities including affected versions and remediation steps.
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-background/40 backdrop-blur-sm border-primary/20 card-hover">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center gap-2">
                <div className="rounded-full bg-primary/10 p-3 shadow-glow shadow-primary">
                  <RefreshCw className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Regular Updates</h3>
                <p className="text-muted-foreground">
                  Stay informed with regularly updated vulnerability data from trusted sources.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
