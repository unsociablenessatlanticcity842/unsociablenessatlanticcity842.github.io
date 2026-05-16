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
}

export function BlogLayout({ header, children, headings = [] }: BlogLayoutProps) {
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
                <TableOfContents headings={headings} onItemClick={() => setTocOpen(false)} />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      )}

      {/* Content + TOC — symmetric grid keeps main perfectly centered */}
      <div
        className={
          hasToc
            ? 'mx-auto grid w-full max-w-[1360px] grid-cols-1 gap-10 px-4 md:px-6 pt-16 xl:grid-cols-[260px_minmax(0,800px)_260px]'
            : 'mx-auto w-full max-w-[800px] px-4 md:px-6 pt-16'
        }
      >
        {/* Left spacer — keeps body centered (symmetric with right TOC) */}
        {hasToc && <div aria-hidden="true" className="hidden xl:block" />}

        {/* Main Content */}
        <div className="min-w-0 w-full">{children}</div>

        {/* Desktop TOC - sticky */}
        {hasToc && (
          <aside className="hidden xl:block">
            <div
              data-toc-scroll
              className="sticky top-20 max-h-[calc(100vh-12rem)] overflow-y-auto scroll-smooth"
            >
              <TableOfContents headings={headings} />
            </div>
          </aside>
        )}
      </div>
    </>
  )
}
