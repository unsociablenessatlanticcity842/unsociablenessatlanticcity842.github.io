'use client'

import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import type { Project } from '@/lib/projects'
import { filterProjects } from '@/lib/project-filter'
import { ProjectCard } from '@/components/project-card'
import { SearchBar } from '@/components/search-bar'
import { motion, AnimatePresence } from 'framer-motion'

interface ProjectsSearchProps {
  projects: Project[]
}

export function ProjectsSearch({ projects }: ProjectsSearchProps) {
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
    projects.forEach((project) => {
      project.tags?.forEach((tag) => tagSet.add(tag))
    })
    return Array.from(tagSet).sort()
  }, [projects])

  const filtered = useMemo(() => {
    return filterProjects(projects, searchTerm, selectedTags)
  }, [projects, searchTerm, selectedTags])

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
            {filtered.length}개의 프로젝트를 찾았습니다
            {searchTerm && (
              <span className="text-foreground font-medium ml-1">
                (&quot;{searchTerm}&quot; 검색 결과)
              </span>
            )}
          </>
        ) : (
          <>총 {projects.length}개의 프로젝트</>
        )}
      </p>

      <AnimatePresence mode="popLayout">
        {filtered.length > 0 ? (
          <motion.div layout className="grid gap-6 sm:grid-cols-2">
            {filtered.map((project) => (
              <motion.div
                key={project.slug}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <ProjectCard project={project} />
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
