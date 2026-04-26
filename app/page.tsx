"use client";

import React from "react";
import Link from "next/link";
import { 
  Bot, 
  Wrench, 
  Rocket, 
  Blocks, 
  ShieldCheck, 
  Zap,
  ArrowRight,
  Terminal,
  Database,
  Lock
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const stats = [
  { label: "Vulnerabilities Tracked", value: "12K+" },
  { label: "Security Advisories", value: "850+" },
  { label: "Exploits Database", value: "45K+" },
  { label: "Taxonomies", value: "50+" },
];

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen bg-background text-foreground">
      <div className="fixed inset-0 grid-bg opacity-50 pointer-events-none" />
      
      <section className="relative container mx-auto px-4 py-24 md:py-32 lg:py-40">
        <div className="mx-auto max-w-4xl text-center space-y-8">
          <Badge variant="outline" className="border-primary/50 text-primary glow-blue">
            <span className="mr-2 h-2 w-2 rounded-full bg-primary animate-pulse" />
            v2.0 Now Available
          </Badge>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            <span className="text-neon-blue">Security</span> for the Modern Web
          </h1>

          <p className="text-muted-foreground text-xl md:text-2xl max-w-2xl mx-auto">
            Comprehensive vulnerability database, exploit tracking, and security taxonomy tooling for developers.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Button asChild size="lg" className="rounded-full glow-blue">
              <Link href="/vulnerabilities">
                Explore Vulnerabilities <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>

            <Button asChild variant="outline" size="lg" className="rounded-full border-primary/30 hover:bg-primary/10">
              <Link href="/api-docs">
                API Docs
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="relative container mx-auto px-4 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-neon-blue">{stat.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="relative container mx-auto px-4 py-12 md:py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Powerful Security Tools</h2>
          <p className="text-muted-foreground">Everything you need to secure your applications</p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Link key={feature.title} href={feature.href}>
              <Card className="group h-full glass hover:bg-primary/5 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary/20 group-hover:glow-blue transition-all">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-neon-blue">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardFooter>
                  <span className="text-sm text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Learn more <ArrowRight className="h-3 w-3" />
                  </span>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="relative container mx-auto px-4 py-16 md:py-20">
        <Card className="glass overflow-hidden">
          <CardContent className="p-0">
            <div className="grid md:grid-cols-2 items-center">
              <div className="p-8 md:p-12">
                <h3 className="text-2xl md:text-3xl font-bold mb-4">
                  Stay Ahead of <span className="text-neon-blue">Threats</span>
                </h3>
                <p className="text-muted-foreground mb-6">
                  Access real-time vulnerability feeds, security advisories, and exploitation data to protect your applications.
                </p>
                <Button asChild className="rounded-full glow-blue">
                  <Link href="/advisories">
                    View Advisories <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <div className="bg-black/50 p-8 md:p-12 border-l border-border/50">
                <div className="space-y-4">
                  {highlights.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <item.icon className="h-5 w-5 text-primary" />
                      <span className="text-sm">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <footer className="mt-auto border-t border-border/50 py-8 text-center">
        <div className="container mx-auto px-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} KhulnaSoft Security. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}

const features = [
  {
    title: "Vulnerability Database",
    description: "Track and monitor Common Vulnerabilities and Exposures with detailed metadata.",
    icon: Database,
    href: "/vulnerabilities",
  },
  {
    title: "Security Advisories",
    description: "Stay informed with security alerts and vulnerability advisories.",
    icon: Lock,
    href: "/advisories",
  },
  {
    title: "Exploit Database",
    description: "Access public exploits and proof-of-concept code for security research.",
    icon: Terminal,
    href: "/exploitdb",
  },
  {
    title: "Security Taxonomy",
    description: "Explore attack patterns and safeguard mappings.",
    icon: Blocks,
    href: "/taxonomy-explorer",
  },
  {
    title: "API Access",
    description: "Programmatic access to all security data via REST API.",
    icon: Wrench,
    href: "/api-docs",
  },
  {
    title: "Real-time Updates",
    description: "Live feeds for emerging threats and vulnerabilities.",
    icon: Zap,
    href: "/resources",
  },
];

const highlights = [
  { label: "CVE Tracking", icon: Database },
  { label: "Exploit Proof-of-Concepts", icon: Terminal },
  { label: "Attack Vectors", icon: Lock },
  { label: "Security Safeguards", icon: ShieldCheck },
];