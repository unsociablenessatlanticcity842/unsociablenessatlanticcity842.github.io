'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import type { Heading } from '@/lib/extract-headings'
// ChevronRight import removed - no longer needed

interface TableOfContentsProps {
  headings: Heading[]
  onItemClick?: () => void
}

export function TableOfContents({ headings, onItemClick }: TableOfContentsProps) {
  const [activeHeading, setActiveHeading] = React.useState<string>('')
  const itemRefs = React.useRef<Map<string, HTMLAnchorElement | null>>(new Map())

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
        rootMargin: '-80px 0px -80% 0px', // Adjust for fixed header
        threshold: 0,
      },
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

  // Keep the active TOC item visible inside the sidebar's scroll container.
  // Scrolls only the marked [data-toc-scroll] ancestor, never the page itself.
  React.useEffect(() => {
    if (!activeHeading) return
    const el = itemRefs.current.get(activeHeading)
    if (!el) return

    const scrollParent = el.closest('[data-toc-scroll]') as HTMLElement | null
    if (!scrollParent) return

    const parentRect = scrollParent.getBoundingClientRect()
    const elRect = el.getBoundingClientRect()
    const buffer = 8 // px — don't trigger when item is right at the edge

    const isAbove = elRect.top < parentRect.top + buffer
    const isBelow = elRect.bottom > parentRect.bottom - buffer

    if (isAbove || isBelow) {
      const targetTop =
        scrollParent.scrollTop +
        (elRect.top - parentRect.top) -
        parentRect.height / 2 +
        elRect.height / 2
      scrollParent.scrollTo({ top: targetTop, behavior: 'smooth' })
    }
  }, [activeHeading])

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()

    const scrollToHeading = () => {
      const element = document.getElementById(id)
      if (element) {
        const yOffset = -100
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
        window.scrollTo({ top: y, behavior: 'smooth' })
        window.history.replaceState(null, '', `#${id}`)
        setActiveHeading(id)
        setTimeout(() => {
          element.setAttribute('tabindex', '-1')
          element.focus({ preventScroll: true })
        }, 500)
      }
    }

    if (onItemClick && window.innerWidth < 768) {
      // Mobile: close Sheet first, then scroll after animation & scroll-lock release
      onItemClick()
      setTimeout(scrollToHeading, 350)
    } else {
      // Desktop: scroll immediately (Sheet stays open)
      requestAnimationFrame(scrollToHeading)
    }
  }

  if (headings.length === 0) {
    return null
  }

  return (
    <nav aria-label="목차" className="space-y-0.5">
      <h2 className="mb-3 text-base font-semibold">목차</h2>
      <ul className="space-y-0 text-xs" role="list">
        {headings.map((heading, index) => {
          const isActive = activeHeading === heading.id
          const paddingLeft = (heading.level - 2) * 12 // Indent based on heading level

          return (
            <li key={`${heading.id}-${index}`}>
              <a
                ref={(el) => {
                  if (el) itemRefs.current.set(heading.id, el)
                  else itemRefs.current.delete(heading.id)
                }}
                href={`#${heading.id}`}
                onClick={(e) => handleClick(e, heading.id)}
                className={cn(
                  'group block py-1.5 pr-2 text-muted-foreground transition-all duration-300 hover:text-foreground relative rounded-r-md',
                  isActive && 'text-primary font-semibold bg-primary/5 dark:bg-primary/10',
                )}
                style={{
                  paddingLeft: `${paddingLeft + 12}px`,
                  borderLeft: isActive ? '3px solid hsl(var(--primary))' : '3px solid transparent',
                }}
                aria-current={isActive ? 'location' : undefined}
              >
                <span>{heading.text}</span>
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
