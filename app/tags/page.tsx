import { Metadata } from 'next'
import Link from 'next/link'
import { getAllTags, getAllPosts } from '@/lib/mdx'
import { tagToSlug } from '@/lib/slug'

export const metadata: Metadata = {
  title: '태그 목록',
  description: '모든 태그 목록',
  alternates: {
    canonical: '/tags/',
  },
  openGraph: {
    title: '태그 목록 | Kaameo Dev Blog',
    description: '모든 태그 목록',
    url: 'https://kaameo.github.io/tags/',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: '태그 목록 | Kaameo Dev Blog',
    description: '모든 태그 목록',
  },
}

export default async function TagsPage() {
  const allPosts = await getAllPosts()
  const tags = await getAllTags()

  // Count posts for each tag
  const tagCounts = tags
    .map((tag) => {
      const count = allPosts.filter((post) => post.tags?.includes(tag)).length
      return { name: tag, count, slug: tagToSlug(tag) }
    })
    .sort((a, b) => b.count - a.count) // Sort by count descending

  return (
    <div className="mx-auto max-w-[800px] px-4 md:px-6 py-12 md:py-16">
      <div className="mb-10 md:mb-12">
        <div className="mb-3 flex items-center gap-2">
          <span className="h-px w-8 bg-accent" />
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            Tags
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">태그 목록</h1>
        <p className="mt-3 text-muted-foreground">총 {tags.length}개의 태그가 있습니다.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {tagCounts.map((tag) => (
          <Link
            key={tag.name}
            href={`/tags/${tag.slug}`}
            className="group flex items-center justify-between rounded-xl border border-border bg-card px-5 py-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-[0_8px_24px_-12px_hsl(var(--accent)/0.25)]"
          >
            <div className="min-w-0">
              <h2 className="truncate text-base font-semibold transition-colors group-hover:text-accent">
                <span className="text-muted-foreground">#</span>
                {tag.name}
              </h2>
              <p className="mt-0.5 text-xs text-muted-foreground">{tag.count}개의 포스트</p>
            </div>
            <span className="ml-3 inline-flex h-7 min-w-[28px] items-center justify-center rounded-full bg-highlight-bg px-2 text-xs font-semibold text-highlight-foreground">
              {tag.count}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
