import Link from "next/link"
import { Shield } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t border-border/40 py-6 md:py-8 relative z-10">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex flex-col items-center gap-4 md:flex-row md:gap-6">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
            <Shield className="h-6 w-6 text-primary" />
            <span>KhulnaSoft Security</span>
          </Link>
          <nav className="flex gap-4 md:gap-6">
            <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Terms
            </Link>
            <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Privacy
            </Link>
            <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Contact
            </Link>
          </nav>
        </div>
        <div className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} KhulnaSoft Security. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
