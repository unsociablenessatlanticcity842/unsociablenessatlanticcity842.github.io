'use client'

import * as React from 'react'
import { TableOfContents } from '@/components/table-of-contents'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { Button } from '@/components/ui/button'
import { List } from 'lucide-react'

import type { Heading } from '@/lib/extract-headings'

interface BlogLayoutProps {
  header?: React.ReactNode
  children: React.ReactNode
  headings?: Heading[]
  leftSidebar?: React.ReactNode
}

export function BlogLayout({ header, children, headings = [], leftSidebar }: BlogLayoutProps) {
  const [tocOpen, setTocOpen] = React.useState(false)
  const hasToc = headings.length > 0

  return (
    <>
      {/* Header - full bleed */}
      {header && header}

      {/* Mobile TOC Button */}
      {hasToc && (
        <div className="fixed top-20 right-4 z-40 xl:hidden">
          <Sheet open={tocOpen} onOpenChange={setTocOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 bg-background shadow-lg"
                aria-label="목차 열기"
              >
                <List className="h-4 w-4" />
                목차
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[350px]">
              <VisuallyHidden>
                <SheetTitle>목차</SheetTitle>
              </VisuallyHidden>
              <div className="mt-6">
                <TableOfContents headings={headings} />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      )}

      {/* Content + TOC */}
      <div className="flex justify-center px-4 md:px-6 pt-16">
        {/* Left Sidebar - ad or spacer to keep main centered */}
        {hasToc && (
          <aside className="hidden xl:block w-[220px] shrink-0 mr-10">
            {leftSidebar && (
              <div className="sticky top-20">
                {leftSidebar}
              </div>
            )}
          </aside>
        )}

        {/* Main Content - centered */}
        <div className="min-w-0 w-full max-w-[800px]">{children}</div>

        {/* Desktop TOC - sticky, scrolls with content */}
        {hasToc && (
          <aside className="hidden xl:block w-[260px] shrink-0 ml-10">
            <div className="sticky top-20 max-h-[calc(100vh-12rem)] overflow-y-auto">
              <TableOfContents headings={headings} />
            </div>
          </aside>
        )}
      </div>
    </>
  )
}
