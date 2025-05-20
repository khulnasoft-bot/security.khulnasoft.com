import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { 
  Code2, 
  Code, 
  Coffee, 
  Gem, 
  Terminal, 
  Container, 
  Server, 
  Cloud, 
  CloudCog, 
  CloudSun, 
  Mountain, 
  Database, 
  DatabaseIcon, 
  DatabaseZap, 
  DatabaseBackup,
  TerminalSquare,
  ServerCog,
  ServerIcon
} from "lucide-react"

export default function PlatformIcons() {
  const platforms = [
    { name: "Node.js", icon: Code2, href: "/vulnerability/npm" },
    { name: "Python", icon: Code, href: "/vulnerability/pypi" },
    { name: "Java", icon: Coffee, href: "/vulnerability/maven" },
    { name: "Ruby", icon: Gem, href: "/vulnerability/rubygems" },
    { name: "PHP", icon: Code, href: "/vulnerability/composer" },
    { name: "Go", icon: Terminal, href: "/vulnerability/go" },
    { name: "Docker", icon: Container, href: "/vulnerability/docker" },
    { name: "Kubernetes", icon: Server, href: "/vulnerability/kubernetes" },
    { name: "AWS", icon: Cloud, href: "/vulnerability/aws" },
    { name: "Azure", icon: CloudCog, href: "/vulnerability/azure" },
    { name: "Google Cloud", icon: CloudSun, href: "/vulnerability/gcp" },
    { name: "Linux", icon: TerminalSquare, href: "/vulnerability/linux" },
    { name: "Alpine", icon: Mountain, href: "/vulnerability/alpine" },
    { name: "Ubuntu", icon: ServerIcon, href: "/vulnerability/ubuntu" },
    { name: "Debian", icon: ServerCog, href: "/vulnerability/debian" },
    { name: "CentOS", icon: Server, href: "/vulnerability/centos" },
    { name: "Oracle", icon: Database, href: "/vulnerability/oracle" },
    { name: "MySQL", icon: DatabaseIcon, href: "/vulnerability/mysql" },
    { name: "PostgreSQL", icon: DatabaseZap, href: "/vulnerability/postgresql" },
    { name: "MongoDB", icon: DatabaseBackup, href: "/vulnerability/mongodb" },
  ]

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardContent className="p-4">
        <div className="grid grid-cols-5 md:grid-cols-10 gap-6">
          {platforms.map((platform) => (
            <Link 
              key={platform.name} 
              href={platform.href}
              className="flex flex-col items-center justify-center group transition-all duration-200 hover:scale-105"
            >
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center border border-primary/30 shadow-glow shadow-primary/20 group-hover:bg-primary/20 group-hover:border-primary/50 transition-all duration-200">
                <platform.icon className="h-6 w-6 text-primary" />
              </div>
              <span className="mt-2 text-xs text-muted-foreground group-hover:text-primary transition-colors duration-200">{platform.name}</span>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
