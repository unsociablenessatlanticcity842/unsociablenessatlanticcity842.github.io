import { getAllPosts } from '@/lib/mdx'
import { tagToSlug } from '@/lib/slug'
import HomePageClient from './home-page-client'
import { WebSiteStructuredData } from '@/components/structured-data'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  alternates: {
    canonical: '/',
  },
}

export default async function HomePage() {
  const posts = await getAllPosts()

  // Top tags by post count (max 10)
  const tagCounts = new Map<string, number>()
  for (const post of posts) {
    for (const tag of post.tags ?? []) {
      tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1)
    }
  }
  const topTags = Array.from(tagCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, count]) => ({ name, count, slug: tagToSlug(name) }))

  return (
    <>
      <WebSiteStructuredData />
      <HomePageClient posts={posts} topTags={topTags} />
    </>
  )
}
