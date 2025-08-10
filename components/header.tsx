"use client"

// English: Responsive site header with brand, nav, and theme toggle.
import Link from "next/link"
import { Shield, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import ModeToggle from "@/components/mode-toggle"

const nav = [
  { href: "/vulnerabilities", label: "Vulnerabilities" },
  { href: "/advisories", label: "Advisories" },
  { href: "/exploitdb", label: "ExploitDB" },
  { href: "/resources", label: "Resources" },
  { href: "/api-docs", label: "API Docs" },
]

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" aria-hidden="true" />
          <Link href="/" className="font-semibold hover:opacity-90">
            KhulnaSoft Security
          </Link>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="text-muted-foreground hover:text-foreground">
              {item.label}
            </Link>
          ))}
          <ModeToggle />
        </nav>

        {/* Mobile menu */}
        <div className="md:hidden flex items-center gap-2">
          <ModeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <div className="mt-6 flex flex-col gap-4">
                {nav.map((item) => (
                  <Link key={item.href} href={item.href} className="text-sm text-foreground">
                    {item.label}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
