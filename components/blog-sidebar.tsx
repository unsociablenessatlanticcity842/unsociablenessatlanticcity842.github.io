"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { cn } from "@/lib/utils"
import { tagToSlug } from "@/lib/slug"
import { Folder, Tag, FileText } from "lucide-react"

interface BlogSidebarProps {
  categories: Array<{
    name: string
    count: number
  }>
  tags: Array<{
    name: string
    count: number
  }>
  currentCategory?: string
  currentTag?: string
}

export function BlogSidebar({
  categories,
  tags,
  currentCategory,
  currentTag,
}: BlogSidebarProps) {
  return (
    <nav
      className="space-y-6"
      aria-label="블로그 네비게이션"
    >
      {/* Categories Section */}
      <div>
        <h2 className="mb-4 text-lg font-semibold flex items-center gap-2">
          <Folder className="h-5 w-5" />
          카테고리
        </h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="categories">
            <AccordionTrigger className="text-sm">
              모든 카테고리 ({categories.reduce((acc, cat) => acc + cat.count, 0)})
            </AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-1" role="list">
                {categories.map((category) => {
                  const isActive = currentCategory === category.name
                  return (
                    <li key={category.name}>
                      <Link
                        href={`/categories/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                        className={cn(
                          "flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                          isActive && "bg-accent text-accent-foreground font-medium"
                        )}
                        aria-current={isActive ? "page" : undefined}
                      >
                        <span className="flex items-center gap-2">
                          <FileText className="h-3 w-3" />
                          {category.name}
                        </span>
                        <Badge variant="secondary" className="ml-auto">
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
        <h2 className="mb-4 text-lg font-semibold flex items-center gap-2">
          <Tag className="h-5 w-5" />
          태그
        </h2>
        <div className="flex flex-wrap gap-2" role="list">
          {tags.map((tag) => {
            const isActive = currentTag === tag.name
            return (
              <Link
                key={tag.name}
                href={`/tags/${tagToSlug(tag.name)}`}
                aria-current={isActive ? "page" : undefined}
              >
                <Badge
                  variant={isActive ? "default" : "outline"}
                  className="cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  {tag.name} ({tag.count})
                </Badge>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Skip to main content link for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-background text-foreground p-2 rounded-md"
      >
        메인 콘텐츠로 건너뛰기
      </a>
    </nav>
  )
}