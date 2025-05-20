import { Card, CardContent } from "@/components/ui/card"

export default function PlatformIcons() {
  const platforms = [
    { name: "Node.js", icon: "nodejs" },
    { name: "Python", icon: "python" },
    { name: "Java", icon: "java" },
    { name: "Ruby", icon: "ruby" },
    { name: "PHP", icon: "php" },
    { name: "Go", icon: "go" },
    { name: "Docker", icon: "docker" },
    { name: "Kubernetes", icon: "kubernetes" },
    { name: "AWS", icon: "aws" },
    { name: "Azure", icon: "azure" },
    { name: "Google Cloud", icon: "gcp" },
    { name: "Linux", icon: "linux" },
    { name: "Alpine", icon: "alpine" },
    { name: "Ubuntu", icon: "ubuntu" },
    { name: "Debian", icon: "debian" },
    { name: "CentOS", icon: "centos" },
    { name: "Oracle", icon: "oracle" },
    { name: "MySQL", icon: "mysql" },
    { name: "PostgreSQL", icon: "postgresql" },
    { name: "MongoDB", icon: "mongodb" },
  ]

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardContent className="p-4">
        <div className="grid grid-cols-5 md:grid-cols-10 gap-6">
          {platforms.map((platform) => (
            <div key={platform.name} className="flex flex-col items-center justify-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center border border-primary/30 shadow-glow shadow-primary/20">
                <span className="text-xs font-medium text-primary">{platform.icon.charAt(0).toUpperCase()}</span>
              </div>
              <span className="mt-2 text-xs text-muted-foreground">{platform.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
