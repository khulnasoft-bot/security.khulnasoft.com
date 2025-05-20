import { Card, CardContent } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface IconCardProps {
  icon: LucideIcon
  title: string
  description?: string
  href?: string
  className?: string
  iconClassName?: string
  onClick?: () => void
}

export default function IconCard({
  icon: Icon,
  title,
  description,
  href,
  className,
  iconClassName,
  onClick,
}: IconCardProps) {
  const CardComponent = href ? Link : "div"
  const cardProps = href ? { href } : onClick ? { onClick } : {}

  return (
    <CardComponent {...cardProps}>
      <Card
        className={cn(
          "bg-background/40 backdrop-blur-sm border-primary/20 card-hover transition-all duration-300 h-full",
          href || onClick ? "cursor-pointer" : "",
          className,
        )}
      >
        <CardContent className="p-6 flex flex-col items-center text-center gap-3">
          <div className="rounded-full bg-primary/10 p-3 shadow-glow shadow-primary/20">
            <Icon className={cn("h-6 w-6 text-primary", iconClassName)} />
          </div>
          <h3 className="font-medium text-lg">{title}</h3>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </CardContent>
      </Card>
    </CardComponent>
  )
}
