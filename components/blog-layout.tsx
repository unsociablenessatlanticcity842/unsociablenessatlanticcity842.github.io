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
    <div className="relative mx-auto max-w-[720px] px-4 md:px-6">
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

      {/* Main Content */}
      <main className="min-w-0">
        {children}
      </main>

      {/* AdSense - Below Content */}
      <div className="mt-10">
        <AdUnit
          slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR || ''}
          format="horizontal"
          className="w-full"
        />
      </div>

      {/* Desktop TOC - Floating Right */}
      {headings.length > 0 && (
        <aside className="absolute top-0 left-full hidden xl:block ml-10">
          <div className="sticky top-20">
            <div className="w-[220px] max-h-[calc(100vh-12rem)] overflow-y-auto">
              <TableOfContents headings={headings} />
            </div>
          </div>
        </aside>
      )}
    </div>
  )
}
