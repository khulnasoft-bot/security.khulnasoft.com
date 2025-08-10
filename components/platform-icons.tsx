"use client"

// English: Display a responsive row of platform badges representing ecosystems/vendors.
import { Badge } from "@/components/ui/badge"
import { DockIcon as Docker, Github, Gitlab, Globe, Layers, Package, Shield } from "lucide-react"

const items = [
  { label: "npm", Icon: Package },
  { label: "PyPI", Icon: Package },
  { label: "Go", Icon: Layers },
  { label: "Maven", Icon: Package },
  { label: "NuGet", Icon: Package },
  { label: "Docker", Icon: Docker },
  { label: "GitHub", Icon: Github },
  { label: "GitLab", Icon: Gitlab },
  { label: "OSV", Icon: Shield },
  { label: "CVE/NVD", Icon: Globe },
]

export default function PlatformIcons() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
      {items.map(({ label, Icon }) => (
        <Badge
          key={label}
          variant="outline"
          className="justify-start gap-2 py-2 text-sm"
          aria-label={`Ecosystem ${label}`}
        >
          <Icon className="h-4 w-4" aria-hidden="true" />
          {label}
        </Badge>
      ))}
    </div>
  )
}
