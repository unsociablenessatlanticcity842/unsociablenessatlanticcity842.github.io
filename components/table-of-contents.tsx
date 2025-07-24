"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import type { Heading } from "@/lib/extract-headings"
import { ChevronRight } from "lucide-react"

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
      const yOffset = -80 // Fixed header offset
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: "smooth" })
      
      // Update URL without causing navigation
      window.history.pushState(null, "", `#${id}`)
      
      // Set focus for accessibility
      element.setAttribute("tabindex", "-1")
      element.focus()
    }
  }

  if (headings.length === 0) {
    return null
  }

  return (
    <nav aria-label="목차" className="space-y-1">
      <h2 className="mb-4 text-lg font-semibold">목차</h2>
      <ul className="space-y-1 text-sm" role="list">
        {headings.map((heading) => {
          const isActive = activeHeading === heading.id
          const paddingLeft = (heading.level - 2) * 12 // Indent based on heading level
          
          return (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                onClick={(e) => handleClick(e, heading.id)}
                className={cn(
                  "group flex items-center py-1 pr-3 text-muted-foreground transition-colors hover:text-foreground",
                  isActive && "text-foreground font-medium"
                )}
                style={{ paddingLeft: `${paddingLeft}px` }}
                aria-current={isActive ? "location" : undefined}
              >
                <ChevronRight
                  className={cn(
                    "mr-1 h-3 w-3 transition-transform",
                    isActive && "rotate-90"
                  )}
                />
                <span className="truncate">{heading.text}</span>
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}