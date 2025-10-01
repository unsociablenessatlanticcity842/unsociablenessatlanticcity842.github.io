import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

interface HorizontalPostCardSkeletonProps {
  featured?: boolean
  className?: string
}

export function HorizontalPostCardSkeleton({
  featured = false,
  className
}: HorizontalPostCardSkeletonProps) {
  return (
    <article className={cn(
      "transition-all duration-300",
      className
    )}>
      <div className={cn(
        "flex gap-4 sm:gap-6",
        featured ? "flex-col md:flex-row" : "flex-col sm:flex-row"
      )}>
        {/* Content Section */}
        <div className="flex-1 space-y-2 sm:space-y-3">
          {/* Category Badge */}
          <Skeleton className="h-5 w-20 mb-2" />

          {/* Title */}
          <Skeleton className={cn(
            featured ? "h-8 w-full mb-2" : "h-6 w-full mb-2"
          )} />
          <Skeleton className={cn(
            featured ? "h-8 w-3/4" : "h-6 w-2/3"
          )} />

          {/* Excerpt */}
          {featured && (
            <>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/2" />
            </>
          )}

          {/* Meta Information */}
          <div className="flex gap-4 pt-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>

          {/* Tags */}
          <div className="flex gap-2 pt-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-16" />
          </div>
        </div>
      </div>

      {/* Divider */}
      <Skeleton className="h-px w-full mt-6" />
    </article>
  )
}
