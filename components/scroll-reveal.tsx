"use client"

import { useEffect, useRef, ReactNode } from "react"

export interface ScrollRevealProps {
  children: ReactNode
  delay?: number
  className?: string
}

export default function ScrollReveal({ children, delay = 0, className = "" }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            element.classList.add("opacity-100")
            element.classList.remove("opacity-0", "translate-y-10")
          }, delay)
          observer.unobserve(element)
        }
      },
      { threshold: 0.1, margin: "0px 0px -50px 0px" }
    )

    element.classList.add("opacity-0", "translate-y-10", "transition-all", "duration-700")
    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [delay])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
