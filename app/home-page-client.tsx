'use client'

import Link from 'next/link'
import { HorizontalPostCard } from '@/components/horizontal-post-card'
import { ArrowRight } from 'lucide-react'
import type { Post } from '@/lib/mdx'

interface HomePageClientProps {
  posts: Post[]
}

export default function HomePageClient({ posts }: HomePageClientProps) {
  const featuredPost = posts[0]
  const recentPosts = posts.slice(1, 7)

  return (
    <div className="mx-auto max-w-[720px] px-4 md:px-6">
      {/* Minimal Hero */}
      <section className="pt-10 md:pt-14 pb-8 border-b">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Kaameo Dev Blog</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          다양한 기술 스택에 대한 경험과 인사이트를 나눕니다.
        </p>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="py-8 border-b">
          <Link href={`/posts/${featuredPost.slug}`} className="group block">
            <span className="text-xs font-medium uppercase tracking-wider text-primary">
              Featured
            </span>
            <h2 className="mt-2 text-2xl md:text-3xl font-bold group-hover:text-primary transition-colors duration-200">
              {featuredPost.title}
            </h2>
            {featuredPost.description && (
              <p className="mt-3 text-muted-foreground line-clamp-2 text-base md:text-lg">
                {featuredPost.description}
              </p>
            )}
            <div className="mt-4 flex items-center gap-3 text-sm text-muted-foreground">
              <time>
                {new Date(featuredPost.date).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
              <span>·</span>
              <span>{featuredPost.readingTime}</span>
              {featuredPost.tags && featuredPost.tags.length > 0 && (
                <>
                  <span>·</span>
                  <span className="text-primary">{featuredPost.tags[0]}</span>
                </>
              )}
            </div>
          </Link>
        </section>
      )}

      {/* Recent Posts */}
      <section className="py-10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold">최근 포스트</h2>
          <Link
            href="/posts"
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
          >
            모두 보기
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="divide-y">
          {recentPosts.map((post) => (
            <HorizontalPostCard key={post.slug} post={post} className="py-6" />
          ))}
        </div>
      </section>
    </div>
  )
}
