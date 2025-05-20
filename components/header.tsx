import Link from "next/link"
import { ModeToggle } from "./mode-toggle"
import { Button } from "@/components/ui/button"
import { Search, Shield, Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-8 w-8">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <span className="font-bold text-xl text-primary glow-text shadow-primary">KhulnaSoft</span>
            <span className="text-muted-foreground">SECURITY</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex gap-6">
            <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/vulnerabilities" className="text-sm font-medium hover:text-primary transition-colors">
              Vulnerabilities
            </Link>
            <Link href="/advisories" className="text-sm font-medium hover:text-primary transition-colors">
              Advisories
            </Link>
            <Link href="/resources" className="text-sm font-medium hover:text-primary transition-colors">
              Resources
            </Link>
            <Link href="/blog" className="text-sm font-medium hover:text-primary transition-colors">
              Blog
            </Link>
            <Link href="/malware" className="text-sm font-medium hover:text-primary transition-colors">
              Malware
            </Link>
            <Link href="/exploitdb" className="text-sm font-medium hover:text-primary transition-colors">
              ExploitDB
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">
              About
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="hover:text-primary transition-colors">
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
            <ModeToggle />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="flex flex-col gap-4 mt-8">
                  <Link href="/" className="text-lg font-medium hover:text-primary transition-colors">
                    Home
                  </Link>
                  <Link href="/vulnerabilities" className="text-lg font-medium hover:text-primary transition-colors">
                    Vulnerabilities
                  </Link>
                  <Link href="/advisories" className="text-lg font-medium hover:text-primary transition-colors">
                    Advisories
                  </Link>
                  <Link href="/resources" className="text-lg font-medium hover:text-primary transition-colors">
                    Resources
                  </Link>
                  <Link href="/blog" className="text-lg font-medium hover:text-primary transition-colors">
                    Blog
                  </Link>
                  <Link href="/malware" className="text-lg font-medium hover:text-primary transition-colors">
                    Malware
                  </Link>
                  <Link href="/exploitdb" className="text-lg font-medium hover:text-primary transition-colors">
                    ExploitDB
                  </Link>
                  <Link href="/about" className="text-lg font-medium hover:text-primary transition-colors">
                    About
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
