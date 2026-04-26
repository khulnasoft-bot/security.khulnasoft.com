"use client";

import React from "react";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 md:py-20 lg:py-24">
        <div className="mx-auto max-w-3xl text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Build Faster with Your AI Toolkit
          </h1>

          <p className="text-muted-foreground text-lg md:text-xl">
            A modern developer platform for building, testing, and deploying AI-powered applications.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <button className="px-6 py-3 rounded-xl bg-primary text-white font-medium hover:opacity-90 transition">
              Get Started
            </button>

            <button className="px-6 py-3 rounded-xl border border-border hover:bg-muted transition">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border p-6 hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} KhulnaSoft. All rights reserved.
      </footer>
    </main>
  );
}

/* ---------------- DATA ---------------- */

const features = [
  {
    title: "AI Agents",
    description:
      "Create intelligent agents to automate workflows, debugging, and development tasks.",
  },
  {
    title: "Developer Tools",
    description:
      "Integrated CLI, API playground, and debugging tools for modern development.",
  },
  {
    title: "Deploy Anywhere",
    description:
      "Seamless deployment with Vercel, Netlify, Docker, and custom infrastructure.",
  },
  {
    title: "Modular Architecture",
    description:
      "Highly scalable system with plugins, extensions, and microservices.",
  },
  {
    title: "Secure by Design",
    description:
      "Built-in monitoring, logging, and data protection mechanisms.",
  },
  {
    title: "Blazing Fast",
    description:
      "Optimized performance with modern frameworks and edge computing.",
  },
];