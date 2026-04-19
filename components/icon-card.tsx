"use client"

// English: Small icon card with title/description and optional link.
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import type { LucideIcon } from "lucide-react"

export interface IconCardProps {
  icon: LucideIcon
  title: string
  description: string
  href?: string
}

export default function IconCard({ icon: Icon, title, description, href }: IconCardProps) {
  const content = (
    <Card className="card-hover bg-background/60 backdrop-blur-sm border-primary/20 h-full transition-all duration-300">
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-primary/10 p-2.5 group-hover:bg-primary/20 transition-colors shrink-0">
            <Icon className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" aria-hidden="true" />
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground group-hover:text-foreground/70 transition-colors">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return href ? (
    <Link href={href} className="block h-full hover:no-underline group">
      {content}
    </Link>
  ) : (
    <div className="group">
      {content}
    </div>
  )
}
