import { Metadata } from 'next'
import Link from 'next/link'
import { getAllTags, getAllPosts } from '@/lib/mdx'
import { tagToSlug } from '@/lib/slug'
import { Badge } from '@/components/ui/badge'
import { Hash } from 'lucide-react'

export const metadata: Metadata = {
  title: '태그 목록',
  description: '모든 태그 목록',
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
    <div className="container py-10">
      <div className="space-y-4 pb-8">
        <h1 className="text-4xl font-bold flex items-center gap-2">
          <Hash className="h-8 w-8" />
          태그 목록
        </h1>
        <p className="text-muted-foreground">총 {tags.length}개의 태그가 있습니다.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tagCounts.map((tag) => (
          <Link
            key={tag.name}
            href={`/tags/${tag.slug}`}
            className="group relative overflow-hidden rounded-lg border bg-card p-6 transition-all hover:shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-xl font-semibold group-hover:text-primary transition-colors">
                  #{tag.name}
                </h2>
                <p className="text-sm text-muted-foreground">{tag.count}개의 포스트</p>
              </div>
              <Badge variant="secondary" className="text-lg px-3 py-1">
                {tag.count}
              </Badge>
            </div>

            {/* Hover effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        ))}
      </div>
    </div>
  )
}
