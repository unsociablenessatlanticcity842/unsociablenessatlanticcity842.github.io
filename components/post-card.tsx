import Link from 'next/link'
import Image from 'next/image'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { highlightText } from '@/lib/search-utils'
import type { Post } from '@/lib/mdx'

interface PostCardProps {
  post: Post
  highlightTitle?: string
  highlightTags?: string[]
}

export function PostCard({ post, highlightTitle, highlightTags = [] }: PostCardProps) {
  const firstTag = post.tags?.[0]

  return (
    <Link href={`/posts/${post.slug}`} className="group block h-full">
      <article className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-primary/40 group-hover:shadow-[0_12px_40px_-12px_hsl(var(--primary)/0.18)]">
        {/* Cover or gradient */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-gradient-to-br from-primary/12 via-accent/8 to-primary/5">
          {post.coverImage ? (
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              unoptimized
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-mono text-4xl font-bold text-primary/15 select-none">
                {firstTag ?? '#'}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col p-5">
          <h3 className="line-clamp-2 text-lg font-bold leading-snug tracking-tight transition-colors duration-200 group-hover:text-primary">
            {highlightTitle ? highlightText(post.title, highlightTitle) : post.title}
          </h3>

          {post.description && (
            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground leading-relaxed">
              {post.description}
            </p>
          )}

          <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1.5 pt-4 text-xs text-muted-foreground">
            <time>{formatDate(post.date)}</time>
            <span aria-hidden="true">·</span>
            <span>{post.readingTime}</span>
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className={cn(
                    'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
                    highlightTags.includes(tag)
                      ? 'bg-highlight-bg text-highlight-foreground ring-1 ring-highlight/40'
                      : 'bg-secondary text-secondary-foreground/80',
                  )}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>
    </Link>
  )
}
