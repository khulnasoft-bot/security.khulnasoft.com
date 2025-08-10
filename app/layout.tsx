import type React from "react"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "KhulnaSoft Security Database",
  description: "Open source vulnerabilities and security advisories",
    generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900">
        <header className="border-b">
          <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Simple shield emoji as a logo placeholder */}
              <span aria-hidden="true">🛡️</span>
              <span className="font-semibold">KhulnaSoft Security</span>
            </div>
            <nav className="text-sm">
              <a href="/" className="hover:underline">
                Home
              </a>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
        <footer className="border-t">
          <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-gray-600">
            {"© "} {new Date().getFullYear()} {"KhulnaSoft. All rights reserved."}
          </div>
        </footer>
      </body>
    </html>
  )
}
