"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Clock } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

interface Vulnerability {
  id: string
  title: string
  severity: number
  timestamp: string
  source: string
  package: string
}

export default function RealTimeFeed() {
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([])
  const [loading, setLoading] = useState(true)

  // Simulate fetching real-time vulnerability data
  useEffect(() => {
    // Initial data load
    const initialVulnerabilities: Vulnerability[] = [
      {
        id: "CVE-2023-9876",
        title: "Buffer Overflow in OpenSSL",
        severity: 4.2,
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
        source: "NVD",
        package: "openssl",
      },
      {
        id: "GHSA-abcd-1234-5678",
        title: "Path Traversal in Express",
        severity: 3.8,
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
        source: "GitHub",
        package: "express",
      },
      {
        id: "CVE-2023-8765",
        title: "SQL Injection in MySQL Connector",
        severity: 4.5,
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
        source: "NVD",
        package: "mysql-connector",
      },
    ]

    setVulnerabilities(initialVulnerabilities)
    setLoading(false)

    // Simulate new vulnerabilities coming in
    const interval = setInterval(() => {
      const newVulnerability: Vulnerability = {
        id: `CVE-2023-${Math.floor(Math.random() * 10000)}`,
        title: [
          "Remote Code Execution in Node.js",
          "Authentication Bypass in Django",
          "Cross-Site Scripting in React",
          "Privilege Escalation in Linux Kernel",
          "Denial of Service in Nginx",
        ][Math.floor(Math.random() * 5)],
        severity: Number.parseFloat((Math.random() * 5 + 2).toFixed(1)),
        timestamp: new Date().toISOString(),
        source: ["NVD", "GitHub", "GitLab", "OSV"][Math.floor(Math.random() * 4)],
        package: ["node", "django", "react", "linux-kernel", "nginx", "lodash", "express", "axios"][
          Math.floor(Math.random() * 8)
        ],
      }

      setVulnerabilities((prev) => [newVulnerability, ...prev.slice(0, 9)])
    }, 15000) // Add a new vulnerability every 15 seconds

    return () => clearInterval(interval)
  }, [])

  // Format relative time
  const formatRelativeTime = (timestamp: string) => {
    const now = new Date()
    const date = new Date(timestamp)
    const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffSeconds < 60) return `${diffSeconds} seconds ago`
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)} minutes ago`
    if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)} hours ago`
    return `${Math.floor(diffSeconds / 86400)} days ago`
  }

  // Determine severity class
  const getSeverityClass = (severity: number) => {
    if (severity < 3.0) return "bg-green-500/20 text-green-500 border-green-500/30"
    if (severity < 4.0) return "bg-amber-500/20 text-amber-500 border-amber-500/30"
    if (severity < 7.0) return "bg-red-500/20 text-red-500 border-red-500/30"
    return "bg-red-700/20 text-red-700 border-red-700/30"
  }

  return (
    <Card className="bg-background/40 backdrop-blur-sm border-primary/20 overflow-hidden">
      <CardHeader className="bg-primary/5 pb-4 border-b border-primary/20">
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Real-time Vulnerability Feed
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 max-h-[500px] overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-pulse text-muted-foreground">Loading feed...</div>
          </div>
        ) : (
          <AnimatePresence>
            <ul className="divide-y divide-border/40">
              {vulnerabilities.map((vuln, index) => (
                <motion.li
                  key={`${vuln.id}-${index}`}
                  initial={index === 0 ? { opacity: 0, y: -20 } : false}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="p-4 hover:bg-primary/5"
                >
                  <Link href={`/vulnerability/${vuln.id}`} className="block">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <AlertTriangle className="h-4 w-4 text-amber-500" />
                          <span className="font-medium">{vuln.title}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{vuln.id}</span>
                          <span>•</span>
                          <span>{vuln.package}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatRelativeTime(vuln.timestamp)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={getSeverityClass(vuln.severity)}>
                          {vuln.severity.toFixed(1)}
                        </Badge>
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                          {vuln.source}
                        </Badge>
                      </div>
                    </div>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </AnimatePresence>
        )}
      </CardContent>
    </Card>
  )
}
