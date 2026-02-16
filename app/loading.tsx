import { Skeleton } from '@/components/ui/skeleton'
import { HorizontalPostCardSkeleton } from '@/components/horizontal-post-card-skeleton'

export default function Loading() {
  return (
    <div className="mx-auto max-w-[720px] px-4 md:px-6">
      {/* Hero Skeleton */}
      <section className="pt-10 md:pt-14 pb-8 border-b">
        <Skeleton className="h-9 md:h-10 w-2/3" />
        <Skeleton className="mt-3 h-6 w-4/5" />
      </section>

      {/* Featured Post Skeleton */}
      <section className="py-8 border-b">
        <Skeleton className="h-3 w-16 mb-2" />
        <Skeleton className="h-8 md:h-9 w-full mt-2" />
        <Skeleton className="h-8 md:h-9 w-3/4 mt-1" />
        <Skeleton className="mt-3 h-5 w-full" />
        <Skeleton className="mt-1 h-5 w-2/3" />
        <div className="mt-4 flex items-center gap-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-14" />
        </div>
      </section>

      {/* Recent Posts Skeleton */}
      <section className="py-10">
        <div className="flex items-center justify-between mb-8">
          <Skeleton className="h-7 w-28" />
          <Skeleton className="h-5 w-20" />
        </div>
        <div className="divide-y">
          {Array.from({ length: 6 }).map((_, i) => (
            <HorizontalPostCardSkeleton key={i} className="py-6" />
          ))}
        </div>
      </section>
    </div>
  )
}
