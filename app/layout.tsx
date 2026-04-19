import type React from "react"
import { Inter, Geist_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/header"
import Footer from "@/components/footer"

const inter = Inter({ subsets: ["latin"] })
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" })

export const metadata = {
  title: "KhulnaSoft Security Database",
  description: "A comprehensive database of security vulnerabilities across multiple platforms",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="bg-background">
      <body className={`${inter.className} ${geistMono.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-background/95">
            <div className="absolute inset-0 bg-[url('/grid.png')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
            <Header />
            <main className="flex-1 relative z-10">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
