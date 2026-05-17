import { Metadata } from 'next'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Hash } from 'lucide-react'
import { getAllProjectTags, getAllProjects } from '@/lib/projects'
import { tagToSlug } from '@/lib/slug'

export const metadata: Metadata = {
  title: '프로젝트 태그',
  description: '프로젝트 태그 목록',
  alternates: {
    canonical: '/projects/tags/',
  },
  openGraph: {
    title: '프로젝트 태그 | Kaameo Dev Blog',
    description: '프로젝트 태그 목록',
    url: 'https://kaameo.github.io/projects/tags/',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: '프로젝트 태그 | Kaameo Dev Blog',
    description: '프로젝트 태그 목록',
  },
}

export default async function ProjectTagsPage() {
  const allProjects = await getAllProjects()
  const tags = await getAllProjectTags()

  const tagCounts = tags
    .map((tag) => {
      const count = allProjects.filter((p) => p.tags?.includes(tag)).length
      return { name: tag, count, slug: tagToSlug(tag) }
    })
    .sort((a, b) => b.count - a.count)

  return (
    <div className="container py-10">
      <div className="space-y-4 pb-8">
        <h1 className="text-4xl font-bold flex items-center gap-2">
          <Hash className="h-8 w-8" />
          프로젝트 태그
        </h1>
        <p className="text-muted-foreground">총 {tags.length}개의 태그가 있습니다.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tagCounts.map((tag) => (
          <Link
            key={tag.name}
            href={`/projects/tags/${tag.slug}`}
            className="group relative overflow-hidden rounded-lg border bg-card p-6 transition-all hover:shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-xl font-semibold group-hover:text-primary transition-colors">
                  #{tag.name}
                </h2>
                <p className="text-sm text-muted-foreground">{tag.count}개의 프로젝트</p>
              </div>
              <Badge variant="secondary" className="text-lg px-3 py-1">
                {tag.count}
              </Badge>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        ))}
      </div>
    </div>
  )
}
