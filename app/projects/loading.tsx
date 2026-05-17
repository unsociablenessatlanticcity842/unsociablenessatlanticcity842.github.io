import { Skeleton } from '@/components/ui/skeleton'
import { ProjectCardSkeleton } from '@/components/project-card-skeleton'

export default function ProjectsLoading() {
  return (
    <div className="mx-auto max-w-[960px] px-4 md:px-6 py-10 md:py-14">
      <Skeleton className="h-9 md:h-10 w-32 mb-3" />
      <Skeleton className="h-5 w-2/3 mb-8" />
      <Skeleton className="h-12 w-full rounded-lg mb-6" />
      <Skeleton className="h-5 w-32 mb-6" />
      <div className="grid gap-6 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <ProjectCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
