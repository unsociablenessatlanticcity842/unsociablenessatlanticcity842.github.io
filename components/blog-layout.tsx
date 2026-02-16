"use client"

import * as React from "react"
import { TableOfContents } from "@/components/table-of-contents"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { List } from "lucide-react"
import { AdUnit } from "@/components/analytics/adsense"
import type { Heading } from "@/lib/extract-headings"

interface BlogLayoutProps {
  children: React.ReactNode
  headings?: Heading[]
}

export function BlogLayout({
  children,
  headings = [],
}: BlogLayoutProps) {
  const [tocOpen, setTocOpen] = React.useState(false)

  return (
    <div className="mx-auto max-w-[1100px] px-4 md:px-6">
      {/* Mobile TOC Button */}
      {headings.length > 0 && (
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
              <div className="mt-6">
                <TableOfContents headings={headings} />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      )}

      {/* Desktop: Content + Right Sidebar */}
      <div className="grid grid-cols-1 gap-10 xl:grid-cols-[720px_1fr]">
        {/* Main Content */}
        <main className="min-w-0">
          {children}
        </main>

        {/* Right Sidebar - Desktop Only */}
        <aside className="hidden xl:block">
          <div className="sticky top-20 space-y-8">
            {headings.length > 0 && (
              <div className="max-h-[calc(100vh-12rem)] overflow-y-auto">
                <TableOfContents headings={headings} />
              </div>
            )}
            <AdUnit
              slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR || ''}
              format="vertical"
              className="w-full"
            />
          </div>
        </aside>
      </div>
    </div>
  )
}
