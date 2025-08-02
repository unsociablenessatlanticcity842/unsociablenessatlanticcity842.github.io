"use client"

import { useState, useMemo, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Post } from "@/lib/mdx"
import { PostCard } from "@/components/post-card"
import { SearchBar } from "@/components/search-bar"
import { filterPosts } from "@/lib/search-utils"
import { motion, AnimatePresence } from "framer-motion"

interface PostsSearchProps {
  posts: Post[]
}

export function PostsSearch({ posts }: PostsSearchProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const searchParams = useSearchParams()

  // Check if we should auto-focus search on mount
  useEffect(() => {
    if (searchParams.get('search') === 'true') {
      // Small delay to ensure the search input is rendered
      const timer = setTimeout(() => {
        const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement
        if (searchInput) {
          searchInput.focus()
          searchInput.select()
        }
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [searchParams])

  // Extract all unique tags
  const availableTags = useMemo(() => {
    const tagSet = new Set<string>()
    posts.forEach(post => {
      post.tags?.forEach(tag => tagSet.add(tag))
    })
    return Array.from(tagSet).sort()
  }, [posts])

  // Filter posts based on search term and selected tags
  const filteredPosts = useMemo(() => {
    return filterPosts(posts, searchTerm, selectedTags)
  }, [posts, searchTerm, selectedTags])

  const hasActiveFilters = searchTerm.length > 0 || selectedTags.length > 0

  return (
    <div className="space-y-8">
      <SearchBar
        onSearchChange={setSearchTerm}
        onTagsChange={setSelectedTags}
        availableTags={availableTags}
        selectedTags={selectedTags}
      />

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          {hasActiveFilters ? (
            <>
              {filteredPosts.length}개의 포스트를 찾았습니다
              {searchTerm && (
                <span className="text-foreground font-medium ml-1">
                  (&quot;{searchTerm}&quot; 검색 결과)
                </span>
              )}
            </>
          ) : (
            <>총 {posts.length}개의 포스트가 있습니다</>
          )}
        </p>
      </div>

      {/* Posts Grid with Animation */}
      <AnimatePresence mode="popLayout">
        {filteredPosts.length > 0 ? (
          <motion.div
            layout
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filteredPosts.map((post) => (
              <motion.div
                key={post.slug}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <PostCard 
                  post={post} 
                  highlightTitle={searchTerm}
                  highlightTags={selectedTags}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-muted-foreground text-lg">
              검색 결과가 없습니다
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              다른 검색어나 태그를 시도해보세요
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}