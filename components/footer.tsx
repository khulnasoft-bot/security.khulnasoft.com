"use client"

// English: Simple footer with copyright and quick links.
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t">
      <div className="container py-8 text-sm text-muted-foreground flex flex-col md:flex-row items-center justify-between gap-4">
        <p>
          {"© "} {new Date().getFullYear()} {"KhulnaSoft. All rights reserved."}
        </p>
        <nav className="flex items-center gap-4">
          <Link href="/about" className="hover:text-foreground">
            About
          </Link>
          <Link href="/resources" className="hover:text-foreground">
            Resources
          </Link>
          <Link href="/api-docs" className="hover:text-foreground">
            API Docs
          </Link>
        </nav>
      </div>
    </footer>
  )
}
