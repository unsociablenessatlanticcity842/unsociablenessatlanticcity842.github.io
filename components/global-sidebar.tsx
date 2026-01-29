"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { cn } from "@/lib/utils"
import { tagToSlug } from "@/lib/slug"
import { Folder, Tag, FileText, Home, BookOpen, User } from "lucide-react"
import { AdUnit } from "@/components/analytics/adsense"

interface GlobalSidebarProps {
  categories: Array<{
    name: string
    count: number
  }>
  tags: Array<{
    name: string
    count: number
  }>
}

export function GlobalSidebar({ categories, tags }: GlobalSidebarProps) {
  const pathname = usePathname()
  
  // Extract current category or tag from pathname
  const currentCategory = pathname.match(/^\/categories\/(.+)$/)?.[1]
  const currentTag = pathname.match(/^\/tags\/(.+)$/)?.[1]
  
  // Limit tags to prevent overflow
  const displayTags = tags.slice(0, 15)
  const hasMoreTags = tags.length > 15

  return (
    <nav
      className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-[250px] border-r bg-background p-4 space-y-4"
      aria-label="블로그 네비게이션"
    >
      {/* Quick Links */}
      <div className="space-y-1">
        <Link
          href="/"
          className={cn(
            "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
            pathname === "/" && "bg-accent text-accent-foreground font-medium"
          )}
        >
          <Home className="h-4 w-4" />
          홈
        </Link>
        <Link
          href="/posts"
          className={cn(
            "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
            pathname === "/posts" && "bg-accent text-accent-foreground font-medium"
          )}
        >
          <BookOpen className="h-4 w-4" />
          모든 포스트
        </Link>
        <Link
          href="/about"
          className={cn(
            "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
            pathname === "/about" && "bg-accent text-accent-foreground font-medium"
          )}
        >
          <User className="h-4 w-4" />
          About
        </Link>
      </div>

      <div className="border-t pt-4" />

      {/* Categories Section */}
      <div>
        <h2 className="mb-2 text-sm font-semibold flex items-center gap-2">
          <Folder className="h-4 w-4" />
          카테고리
        </h2>
        <Accordion type="single" collapsible defaultValue="categories" className="w-full">
          <AccordionItem value="categories" className="border-none">
            <AccordionTrigger className="py-2 text-xs hover:no-underline">
              전체 ({categories.reduce((acc, cat) => acc + cat.count, 0)})
            </AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-0.5" role="list">
                {categories.map((category) => {
                  const isActive = currentCategory === category.name.toLowerCase().replace(/\s+/g, '-')
                  return (
                    <li key={category.name}>
                      <Link
                        href={`/categories/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                        className={cn(
                          "flex items-center justify-between rounded-md px-2 py-1.5 text-xs transition-colors hover:bg-accent hover:text-accent-foreground",
                          isActive && "bg-accent text-accent-foreground font-medium"
                        )}
                        aria-current={isActive ? "page" : undefined}
                      >
                        <span className="flex items-center gap-1.5">
                          <FileText className="h-3 w-3" />
                          {category.name}
                        </span>
                        <Badge variant="secondary" className="h-5 min-w-[1.25rem] px-1 text-xs">
                          {category.count}
                        </Badge>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Tags Section */}
      <div>
        <h2 className="mb-2 text-sm font-semibold flex items-center gap-2">
          <Tag className="h-4 w-4" />
          태그
        </h2>
        <div className="flex flex-wrap gap-1.5" role="list">
          {displayTags.map((tag) => {
            const tagSlug = tagToSlug(tag.name)
            const isActive = currentTag === tagSlug
            return (
              <Link
                key={tag.name}
                href={`/tags/${tagSlug}`}
                aria-current={isActive ? "page" : undefined}
              >
                <Badge
                  variant={isActive ? "default" : "outline"}
                  className="h-6 text-xs cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  {tag.name} ({tag.count})
                </Badge>
              </Link>
            )
          })}
          {hasMoreTags && (
            <Link href="/tags">
              <Badge variant="outline" className="h-6 text-xs cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors">
                +{tags.length - 15} more
              </Badge>
            </Link>
          )}
        </div>
      </div>

      {/* 사이드바 광고 */}
      <div className="border-t pt-4">
        <AdUnit
          slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR || ''}
          format="vertical"
          className="w-full"
        />
      </div>
    </nav>
  )
}