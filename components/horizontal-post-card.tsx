import Link from "next/link"
import { formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Post } from "@/lib/mdx"

interface HorizontalPostCardProps {
  post: Post
  featured?: boolean
  className?: string
}

export function HorizontalPostCard({ post, featured = false, className }: HorizontalPostCardProps) {
  return (
    <Link href={`/posts/${post.slug}`}>
      <article className={cn(
        "group cursor-pointer transition-all duration-300",
        className
      )}>
        <div className={cn(
          "flex gap-4 sm:gap-6",
          featured ? "flex-col md:flex-row" : "flex-col sm:flex-row"
        )}>
          {/* Content Section */}
          <div className="flex-1 space-y-2 sm:space-y-3">
            {/* Category Badge */}
            {post.category && (
              <Badge 
                variant="secondary" 
                className="mb-2 text-xs font-normal"
              >
                {post.category}
              </Badge>
            )}

            {/* Title */}
            <h3 className={cn(
              "font-bold text-foreground group-hover:text-primary transition-colors",
              featured ? "text-xl sm:text-2xl md:text-3xl line-clamp-2 sm:line-clamp-3" : "text-lg sm:text-xl line-clamp-2"
            )}>
              {post.title}
            </h3>

            {/* Excerpt */}
            <p className={cn(
              "text-muted-foreground",
              featured ? "line-clamp-2 sm:line-clamp-3 text-sm sm:text-base" : "hidden sm:block line-clamp-2 text-sm"
            )}>
              {post.description}
            </p>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
              {post.author && (
                <span className="font-medium text-foreground">
                  {post.author}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span className="hidden sm:inline">{formatDate(post.date)}</span>
                <span className="sm:hidden">{new Date(post.date).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}</span>
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {post.readingTime}
              </span>
            </div>

            {/* Tags - Hidden on mobile for non-featured posts */}
            {post.tags && post.tags.length > 0 && (
              <div className={cn(
                "flex flex-wrap gap-2 pt-1 sm:pt-2",
                !featured && "hidden sm:flex"
              )}>
                {post.tags.slice(0, 3).map((tag) => (
                  <Badge 
                    key={tag} 
                    variant="outline" 
                    className="text-xs font-normal"
                  >
                    {tag}
                  </Badge>
                ))}
                {post.tags.length > 3 && (
                  <span className="text-xs text-muted-foreground">
                    +{post.tags.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Optional Image Section */}
          {post.coverImage && (
            <div className={cn(
              "relative overflow-hidden rounded-lg bg-muted flex-shrink-0",
              featured ? "w-full md:w-72 h-48 md:h-48" : "w-full sm:w-40 md:w-48 h-32 sm:h-28 md:h-32"
            )}>
              <img
                src={post.coverImage}
                alt={post.title}
                className="object-cover w-full h-full"
              />
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="mt-4 sm:mt-6 border-b border-border/40" />
      </article>
    </Link>
  )
}