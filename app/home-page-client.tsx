'use client'

import Link from 'next/link'
import Image from 'next/image'
import { HorizontalPostCard } from '@/components/horizontal-post-card'
import { AuthorCard } from '@/components/author-card'
import { ArrowRight, Sparkles } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { Post } from '@/lib/mdx'

interface HomePageClientProps {
  posts: Post[]
}

export default function HomePageClient({ posts }: HomePageClientProps) {
  const featuredPost = posts[0]
  const recentPosts = posts.slice(1, 7)

  return (
    <div>
      {/* Hero — full-bleed gradient mesh background */}
      <section className="relative overflow-hidden border-b">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 opacity-70 dark:opacity-50"
        >
          <div className="absolute -top-32 -left-16 h-[360px] w-[360px] rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -top-10 right-0 h-[320px] w-[320px] rounded-full bg-accent/30 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-[280px] w-[280px] rounded-full bg-primary/10 blur-3xl" />
        </div>

        <div className="mx-auto max-w-[800px] px-4 md:px-6 pt-16 pb-12 md:pt-24 md:pb-16">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
            <Sparkles className="h-3 w-3 text-accent" />
            개발 여정을 기록합니다
          </span>
          <h1 className="mt-5 text-4xl md:text-5xl font-bold tracking-tight leading-[1.1]">
            Kaameo
            <span className="text-primary">.</span>
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              dev
            </span>
          </h1>
          <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-[560px] leading-relaxed">
            다양한 기술 스택을 마주하며 얻은 경험과 인사이트를 정리합니다. 백엔드, DevOps,
            프론트엔드, 그리고 그 사이의 모든 것.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-[800px] px-4 md:px-6">
        {/* Featured Post — visual hero card */}
        {featuredPost && (
          <section className="py-10 md:py-12">
            <div className="mb-4 flex items-center gap-2">
              <span className="h-px w-8 bg-accent" />
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                Featured
              </span>
            </div>

            <Link href={`/posts/${featuredPost.slug}`} className="group block">
              <article className="relative overflow-hidden rounded-2xl border bg-card transition-all duration-300 hover:border-primary/40 hover:shadow-[0_20px_60px_-20px_hsl(var(--primary)/0.25)]">
                {/* Cover or gradient header */}
                <div className="relative aspect-[2/1] w-full overflow-hidden bg-gradient-to-br from-primary/15 via-accent/10 to-primary/5">
                  {featuredPost.coverImage ? (
                    <Image
                      src={featuredPost.coverImage}
                      alt={featuredPost.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      unoptimized
                      priority
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-mono text-6xl font-bold text-primary/15">
                        {featuredPost.tags?.[0] ?? '#'}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
                </div>

                <div className="p-6 md:p-8">
                  <h2 className="text-2xl md:text-3xl font-bold leading-tight tracking-tight transition-colors duration-200 group-hover:text-primary">
                    {featuredPost.title}
                  </h2>
                  {featuredPost.description && (
                    <p className="mt-3 line-clamp-2 text-muted-foreground text-base md:text-lg leading-relaxed">
                      {featuredPost.description}
                    </p>
                  )}
                  <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted-foreground">
                    <time>{formatDate(featuredPost.date)}</time>
                    <span aria-hidden="true">·</span>
                    <span>{featuredPost.readingTime}</span>
                    {featuredPost.tags && featuredPost.tags.length > 0 && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="inline-flex items-center rounded-full bg-highlight-bg px-2.5 py-0.5 text-xs font-medium text-highlight-foreground">
                          {featuredPost.tags[0]}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </article>
            </Link>
          </section>
        )}

        {/* Recent Posts */}
        <section className="pb-16">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="text-xl md:text-2xl font-bold tracking-tight">최근 포스트</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                새로 작성된 글을 모아 보세요
              </p>
            </div>
            <Link
              href="/posts"
              className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200"
            >
              모두 보기
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="divide-y divide-border/70">
            {recentPosts.map((post) => (
              <HorizontalPostCard key={post.slug} post={post} className="py-6" />
            ))}
          </div>
        </section>

        <AuthorCard />
      </div>
    </div>
  )
}
