'use client'

import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Post } from '@/lib/mdx'
import { HorizontalPostCard } from '@/components/horizontal-post-card'
import { SearchBar } from '@/components/search-bar'
import { filterPosts } from '@/lib/search-utils'
import { motion, AnimatePresence } from 'framer-motion'

interface PostsSearchProps {
  posts: Post[]
}

export function PostsSearch({ posts }: PostsSearchProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const searchParams = useSearchParams()

  useEffect(() => {
    if (searchParams.get('search') === 'true') {
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

  const availableTags = useMemo(() => {
    const tagSet = new Set<string>()
    posts.forEach((post) => {
      post.tags?.forEach((tag) => tagSet.add(tag))
    })
    return Array.from(tagSet).sort()
  }, [posts])

  const filteredPosts = useMemo(() => {
    return filterPosts(posts, searchTerm, selectedTags)
  }, [posts, searchTerm, selectedTags])

  const hasActiveFilters = searchTerm.length > 0 || selectedTags.length > 0

  return (
    <div className="space-y-6">
      <SearchBar
        onSearchChange={setSearchTerm}
        onTagsChange={setSelectedTags}
        availableTags={availableTags}
        selectedTags={selectedTags}
      />

      <p className="text-sm text-muted-foreground">
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
          <>총 {posts.length}개의 포스트</>
        )}
      </p>

      <AnimatePresence mode="popLayout">
        {filteredPosts.length > 0 ? (
          <motion.div layout className="divide-y">
            {filteredPosts.map((post) => (
              <motion.div
                key={post.slug}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <HorizontalPostCard post={post} className="py-5" />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-muted-foreground text-lg">검색 결과가 없습니다</p>
            <p className="text-sm text-muted-foreground mt-2">다른 검색어나 태그를 시도해보세요</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
