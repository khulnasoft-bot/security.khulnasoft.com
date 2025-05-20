import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import VulnerabilityCard from "@/components/vulnerability-card"
import { Search, Filter, Shield } from "lucide-react"

export default function VulnerabilitiesPage() {
  return (
    <div className="container py-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            Vulnerabilities
          </h1>
          <p className="text-muted-foreground">
            Browse and search through our comprehensive database of vulnerabilities
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by CVE, package name, or keyword..."
              className="pl-9 bg-background/60 backdrop-blur-sm border-primary/20 search-glow"
            />
          </div>
          <div className="flex gap-2">
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px] bg-background/60 backdrop-blur-sm border-primary/20">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2 border-primary/40 hover:bg-primary/10">
              <Filter className="h-4 w-4" />
              More Filters
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="application">Application</TabsTrigger>
            <TabsTrigger value="os">Operating System</TabsTrigger>
            <TabsTrigger value="cloud">Cloud</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="space-y-4 mt-4">
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
              id="CVE-2023-4863"
              title="Heap Buffer Overflow in WebP"
              severity={4.0}
              affects={["libwebp", "chromium"]}
              type="os"
            />
            <VulnerabilityCard
              id="GHSA-p6mc-m468-83gw"
              title="Path Traversal in adm-zip"
              severity={3.5}
              affects={["adm-zip"]}
              type="application"
            />
            <VulnerabilityCard
              id="CVE-2023-5129"
              title="Privilege Escalation in Linux Kernel"
              severity={3.7}
              affects={["linux-kernel"]}
              type="os"
            />
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
            <VulnerabilityCard
              id="GHSA-h452-7996-h45h"
              title="SQL Injection in sequelize"
              severity={4.3}
              affects={["sequelize"]}
              type="application"
            />
            <VulnerabilityCard
              id="GHSA-4q6j-m53g-58rp"
              title="Cross-Site Scripting in react-markdown"
              severity={3.2}
              affects={["react-markdown"]}
              type="application"
            />
            <VulnerabilityCard
              id="CVE-2023-6129"
              title="Denial of Service in nginx"
              severity={3.6}
              affects={["nginx"]}
              type="os"
            />
          </TabsContent>
          <TabsContent value="application" className="space-y-4 mt-4">
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
            <VulnerabilityCard
              id="GHSA-h452-7996-h45h"
              title="SQL Injection in sequelize"
              severity={4.3}
              affects={["sequelize"]}
              type="application"
            />
            <VulnerabilityCard
              id="GHSA-4q6j-m53g-58rp"
              title="Cross-Site Scripting in react-markdown"
              severity={3.2}
              affects={["react-markdown"]}
              type="application"
            />
          </TabsContent>
          <TabsContent value="os" className="space-y-4 mt-4">
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
            <VulnerabilityCard
              id="CVE-2023-6129"
              title="Denial of Service in nginx"
              severity={3.6}
              affects={["nginx"]}
              type="os"
            />
          </TabsContent>
          <TabsContent value="cloud" className="space-y-4 mt-4">
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

        <div className="flex justify-center mt-4">
          <Button variant="outline" className="border-primary/40 hover:bg-primary/10">
            Load more
          </Button>
        </div>
      </div>
    </div>
  )
}
