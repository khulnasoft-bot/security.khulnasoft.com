import { Badge } from "@/components/ui/badge"
import { AlertOctagon, AlertTriangle, AlertCircle } from "lucide-react"

export function SeverityBadge({ score }: { score: number }) {
  let badgeClass = "badge-low"
  let Icon = AlertCircle
  
  if (score >= 9) {
    badgeClass = "badge-critical"
    Icon = AlertOctagon
  } else if (score >= 7) {
    badgeClass = "badge-high"
    Icon = AlertTriangle
  } else if (score >= 4) {
    badgeClass = "badge-medium"
    Icon = AlertTriangle
  }
  
  return (
    <Badge 
      className={`${badgeClass} inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border-0`}
      aria-label={`Severity ${score.toFixed(1)}`}
    >
      <Icon className="h-3.5 w-3.5" />
      {score.toFixed(1)}
    </Badge>
  )
}
