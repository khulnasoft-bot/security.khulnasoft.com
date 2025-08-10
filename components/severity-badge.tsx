import { Badge } from "@/components/ui/badge"

export function SeverityBadge({ score }: { score: number }) {
  let cls = "bg-green-500/20 text-green-600 border-green-500/30"
  if (score >= 7) cls = "bg-red-500/20 text-red-600 border-red-500/30"
  else if (score >= 4) cls = "bg-amber-500/20 text-amber-600 border-amber-500/30"
  return (
    <Badge variant="outline" className={cls} aria-label={`Severity ${score.toFixed(1)}`}>
      {score.toFixed(1)}
    </Badge>
  )
}
