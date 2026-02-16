import { Skeleton } from '@/components/ui/skeleton'
import { HorizontalPostCardSkeleton } from '@/components/horizontal-post-card-skeleton'

export default function PostsLoading() {
  return (
    <div className="mx-auto max-w-[720px] px-4 md:px-6 py-10 md:py-14">
      {/* "Posts" Title Skeleton */}
      <Skeleton className="h-9 md:h-10 w-24 mb-8" />

      {/* Search Bar Skeleton */}
      <Skeleton className="h-12 w-full rounded-lg mb-6" />

      {/* Result Summary Skeleton */}
      <Skeleton className="h-5 w-32 mb-6" />

      {/* Post List Skeleton */}
      <div className="divide-y">
        {Array.from({ length: 6 }).map((_, i) => (
          <HorizontalPostCardSkeleton key={i} className="py-6" />
        ))}
      </div>
    </div>
  )
}
