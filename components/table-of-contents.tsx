"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import type { Heading } from "@/lib/extract-headings"
// ChevronRight import removed - no longer needed

interface TableOfContentsProps {
  headings: Heading[]
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeHeading, setActiveHeading] = React.useState<string>("")

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((entry) => entry.isIntersecting)
        if (visibleEntries.length > 0) {
          // Get the first visible heading
          const firstVisibleEntry = visibleEntries[0]
          setActiveHeading(firstVisibleEntry.target.id)
        }
      },
      {
        rootMargin: "-80px 0px -80% 0px", // Adjust for fixed header
        threshold: 0,
      }
    )

    // Observe all heading elements
    headings.forEach((heading) => {
      const element = document.getElementById(heading.id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => {
      headings.forEach((heading) => {
        const element = document.getElementById(heading.id)
        if (element) {
          observer.unobserve(element)
        }
      })
    }
  }, [headings])

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const element = document.getElementById(id)
    if (element) {
      // More reliable scrolling with IntersectionObserver compensation
      const yOffset = -100 // Increased offset for better visibility
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
      
      // Use requestAnimationFrame for smoother scrolling
      requestAnimationFrame(() => {
        window.scrollTo({ top: y, behavior: "smooth" })
      })
      
      // Update URL without causing navigation
      window.history.replaceState(null, "", `#${id}`)
      
      // Set active heading immediately for better UX
      setActiveHeading(id)
      
      // Set focus for accessibility after scroll
      setTimeout(() => {
        element.setAttribute("tabindex", "-1")
        element.focus({ preventScroll: true })
      }, 500)
    }
  }

  if (headings.length === 0) {
    return null
  }

  return (
    <nav aria-label="목차" className="space-y-0.5">
      <h2 className="mb-3 text-base font-semibold">목차</h2>
      <ul className="space-y-0 text-xs" role="list">
        {headings.map((heading) => {
          const isActive = activeHeading === heading.id
          const paddingLeft = (heading.level - 2) * 12 // Indent based on heading level
          
          return (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                onClick={(e) => handleClick(e, heading.id)}
                className={cn(
                  "group block py-1.5 pr-2 text-muted-foreground transition-all duration-300 hover:text-foreground relative rounded-r-md",
                  isActive && "text-primary font-semibold bg-primary/5 dark:bg-primary/10"
                )}
                style={{
                  paddingLeft: `${paddingLeft + 12}px`,
                  borderLeft: isActive ? "3px solid hsl(var(--primary))" : "3px solid transparent",
                  transform: isActive ? "translateX(2px)" : "translateX(0)"
                }}
                aria-current={isActive ? "location" : undefined}
              >
                <span className="truncate">{heading.text}</span>
                {isActive && (
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-primary">
                    <svg width="4" height="4" viewBox="0 0 4 4" fill="currentColor">
                      <circle cx="2" cy="2" r="2" />
                    </svg>
                  </span>
                )}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}