"use client"

import { useState, useCallback, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSearchKeyboardShortcuts } from "@/hooks/use-search-keyboard-shortcuts"

interface SearchBarProps {
  onSearchChange: (searchTerm: string) => void
  onTagsChange: (tags: string[]) => void
  availableTags: string[]
  selectedTags: string[]
  className?: string
}

export function SearchBar({
  onSearchChange,
  onTagsChange,
  availableTags,
  selectedTags,
  className
}: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const searchInputRef = useRef<HTMLInputElement>(null)

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    onSearchChange(value)
  }, [onSearchChange])

  const handleTagToggle = useCallback((tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter(t => t !== tag))
    } else {
      onTagsChange([...selectedTags, tag])
    }
  }, [selectedTags, onTagsChange])

  const clearFilters = useCallback(() => {
    setSearchTerm("")
    onSearchChange("")
    onTagsChange([])
  }, [onSearchChange, onTagsChange])

  const hasActiveFilters = searchTerm.length > 0 || selectedTags.length > 0

  // Keyboard shortcuts
  useSearchKeyboardShortcuts({
    searchInputRef,
    onClearFilters: clearFilters
  })

  return (
    <div className={cn("space-y-4", className)}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={searchInputRef}
          type="search"
          placeholder="포스트 제목으로 검색..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="pl-10 pr-24"
          aria-label="포스트 제목 검색"
        />
        {/* Keyboard shortcut hint */}
        <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium opacity-60 sm:flex">
          /
        </kbd>
      </div>

      {/* Tag Filters */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">태그 필터</h3>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-auto p-1 text-xs"
            >
              <X className="mr-1 h-3 w-3" />
              필터 초기화
            </Button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {availableTags.map((tag) => {
            const isSelected = selectedTags.includes(tag)
            return (
              <Badge
                key={tag}
                variant={isSelected ? "default" : "outline"}
                className={cn(
                  "cursor-pointer transition-colors",
                  isSelected && "bg-primary text-primary-foreground",
                  !isSelected && "hover:bg-accent hover:text-accent-foreground"
                )}
                onClick={() => handleTagToggle(tag)}
                role="checkbox"
                aria-checked={isSelected}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    handleTagToggle(tag)
                  }
                }}
              >
                {tag}
              </Badge>
            )
          })}
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="rounded-md bg-muted p-2 text-sm">
          <span className="text-muted-foreground">활성 필터: </span>
          {searchTerm && (
            <span className="font-medium">
              &quot;{searchTerm}&quot; 검색
            </span>
          )}
          {searchTerm && selectedTags.length > 0 && <span className="text-muted-foreground"> + </span>}
          {selectedTags.length > 0 && (
            <span className="font-medium">
              {selectedTags.length}개 태그 선택됨
            </span>
          )}
        </div>
      )}
    </div>
  )
}