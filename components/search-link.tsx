"use client"

import Link from "next/link"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSearchNavigation } from "@/hooks/use-search-navigation"

interface SearchLinkProps {
  showShortcut?: boolean
  enableKeyboardNavigation?: boolean
}

export function SearchLink({ 
  showShortcut = false,
  enableKeyboardNavigation = false 
}: SearchLinkProps) {
  // Always call the hook, but it only adds event listeners when enabled
  useSearchNavigation(enableKeyboardNavigation)
  
  return (
    <Link href="/posts">
      <Button size="lg" variant="outline" className="group relative">
        <Search className="mr-2 h-4 w-4" />
        <span>포스트 검색</span>
        {showShortcut && (
          <kbd className="ml-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium opacity-60 group-hover:opacity-100 sm:inline-flex">
            /
          </kbd>
        )}
      </Button>
    </Link>
  )
}