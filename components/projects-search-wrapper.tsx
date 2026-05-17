'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { ProjectCardSkeleton } from '@/components/project-card-skeleton'
import type { Project } from '@/lib/projects'

function ProjectsSearchSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-12 w-full rounded-lg" />
      <Skeleton className="h-5 w-32" />
      <div className="grid gap-6 sm:grid-cols-2">
        {[...Array(4)].map((_, i) => (
          <ProjectCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}

const ProjectsSearch = dynamic(
  () => import('./projects-search').then((mod) => mod.ProjectsSearch),
  {
    loading: () => <ProjectsSearchSkeleton />,
  },
)

interface ProjectsSearchWrapperProps {
  projects: Project[]
}

export function ProjectsSearchWrapper({ projects }: ProjectsSearchWrapperProps) {
  return (
    <Suspense fallback={<ProjectsSearchSkeleton />}>
      <ProjectsSearch projects={projects} />
    </Suspense>
  )
}
