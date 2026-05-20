'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { GitBranch, ListIcon, ShieldIcon, BookOpen, Home } from 'lucide-react'

const navigationItems = [
  { href: '/taxonomy-explorer', label: 'Home', icon: Home },
  { href: '/taxonomy-explorer/attack-tree', label: 'Attack Tree', icon: GitBranch },
  { href: '/taxonomy-explorer/attack-vectors', label: 'Attack Vectors', icon: ListIcon },
  { href: '/taxonomy-explorer/safeguards', label: 'Safeguards', icon: ShieldIcon },
  { href: '/taxonomy-explorer/references', label: 'References', icon: BookOpen },
]

export default function TaxonomyNavigation() {
  const pathname = usePathname()

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/taxonomy-explorer" className="font-bold text-lg">
            🎯 Taxonomy Explorer
          </Link>
          <div className="hidden md:flex items-center gap-6">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary',
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
