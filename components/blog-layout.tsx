"use client"

import * as React from "react"
import { TableOfContents } from "@/components/table-of-contents"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { List } from "lucide-react"
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
    <div className="container relative">
      {/* Mobile TOC Button - Floating */}
      {headings.length > 0 && (
        <div className="fixed top-20 right-4 z-40 xl:hidden">
          <Sheet open={tocOpen} onOpenChange={setTocOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 bg-background shadow-lg hover:shadow-xl transition-shadow"
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

      {/* Desktop Layout */}
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1fr_250px]">
        {/* Main Content */}
        <main className="min-w-0">
          {children}
        </main>

        {/* Right TOC - Desktop Only */}
        {headings.length > 0 && (
          <aside className="hidden xl:block">
            <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto">
              <TableOfContents headings={headings} />
            </div>
          </aside>
        )}
      </div>
    </div>
  )
}