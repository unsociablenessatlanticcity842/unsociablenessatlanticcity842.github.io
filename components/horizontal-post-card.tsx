import Link from "next/link"
import Image from "next/image"
import { formatDate } from "@/lib/utils"
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
        "group cursor-pointer",
        className
      )}>
        <div className="flex gap-4 sm:gap-6">
          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className={cn(
              "font-bold text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-2",
              featured ? "text-xl md:text-2xl" : "text-lg"
            )}>
              {post.title}
            </h3>

            <p className="mt-2 text-muted-foreground text-sm line-clamp-2">
              {post.description}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <time>{formatDate(post.date)}</time>
              <span>·</span>
              <span>{post.readingTime}</span>
              {post.tags && post.tags.length > 0 && (
                <>
                  <span>·</span>
                  <span className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-xs font-medium">
                    {post.tags[0]}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Thumbnail */}
          {post.coverImage && (
            <div className="relative flex-shrink-0 w-24 h-24 sm:w-32 sm:h-24 rounded-md overflow-hidden bg-muted">
              <Image
                src={post.coverImage}
                alt={post.title}
                width={128}
                height={96}
                className="object-cover w-full h-full"
                unoptimized
              />
            </div>
          )}
        </div>
      </article>
    </Link>
  )
}
