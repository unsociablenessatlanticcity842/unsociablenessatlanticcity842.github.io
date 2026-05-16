import Link from 'next/link'
import Image from 'next/image'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { Post } from '@/lib/mdx'

interface HorizontalPostCardProps {
  post: Post
  featured?: boolean
  className?: string
}

export function HorizontalPostCard({ post, featured = false, className }: HorizontalPostCardProps) {
  const firstTag = post.tags?.[0]

  return (
    <Link href={`/posts/${post.slug}`}>
      <article className={cn('group cursor-pointer', className)}>
        <div className="flex gap-4 sm:gap-6">
          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3
              className={cn(
                'font-bold text-foreground transition-colors duration-200 line-clamp-2 group-hover:text-primary',
                featured ? 'text-xl md:text-2xl tracking-tight' : 'text-lg tracking-tight',
              )}
            >
              {post.title}
            </h3>

            {post.description && (
              <p className="mt-2 text-muted-foreground text-sm line-clamp-2 leading-relaxed">
                {post.description}
              </p>
            )}

            <div className="mt-3 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-muted-foreground">
              <time>{formatDate(post.date)}</time>
              <span aria-hidden="true">·</span>
              <span>{post.readingTime}</span>
              {firstTag && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="inline-flex items-center rounded-full bg-highlight-bg px-2 py-0.5 text-xs font-medium text-highlight-foreground">
                    {firstTag}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Thumbnail */}
          {post.coverImage ? (
            <div className="relative flex-shrink-0 w-24 h-24 sm:w-32 sm:h-24 overflow-hidden rounded-lg bg-muted">
              <Image
                src={post.coverImage}
                alt={post.title}
                width={128}
                height={96}
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-[1.06]"
                unoptimized
              />
            </div>
          ) : (
            <div className="relative hidden sm:flex flex-shrink-0 w-32 h-24 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-primary/10 via-accent/8 to-primary/5">
              <span className="font-mono text-xl font-bold text-primary/25 select-none">
                {firstTag ?? '#'}
              </span>
            </div>
          )}
        </div>
      </article>
    </Link>
  )
}
