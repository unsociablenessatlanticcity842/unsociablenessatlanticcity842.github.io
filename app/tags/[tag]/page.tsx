import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPostsByTag, getAllTags } from '@/lib/mdx'
import { PostCard } from '@/components/post-card'
import { tagToSlug, slugToTag } from '@/lib/slug'

interface TagPageProps {
  params: Promise<{
    tag: string
  }>
}

export async function generateStaticParams() {
  const tags = await getAllTags()
  return tags.map((tag) => ({
    tag: tagToSlug(tag),
  }))
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { tag } = await params
  const allTags = await getAllTags()
  const actualTag = slugToTag(tag, allTags)

  if (!actualTag) {
    return {}
  }

  return {
    title: `${actualTag} 태그`,
    description: `${actualTag} 태그가 포함된 포스트 목록`,
    alternates: {
      canonical: `/tags/${tag}/`,
    },
    openGraph: {
      title: `${actualTag} 태그 | Kaameo Dev Blog`,
      description: `${actualTag} 태그가 포함된 포스트 목록`,
      url: `https://kaameo.github.io/tags/${tag}/`,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: `${actualTag} 태그 | Kaameo Dev Blog`,
      description: `${actualTag} 태그가 포함된 포스트 목록`,
    },
  }
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params
  const allTags = await getAllTags()
  const actualTag = slugToTag(tag, allTags)

  if (!actualTag) {
    notFound()
  }

  const posts = await getPostsByTag(actualTag)

  if (posts.length === 0) {
    notFound()
  }

  return (
    <div className="mx-auto max-w-[800px] px-4 md:px-6 py-12 md:py-16">
      <div className="mb-10 md:mb-12">
        <div className="mb-3 flex items-center gap-2">
          <span className="h-px w-8 bg-accent" />
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            Tag
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          <span className="text-muted-foreground">#</span>
          {actualTag}
        </h1>
        <p className="mt-3 text-muted-foreground">총 {posts.length}개의 포스트가 있습니다.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  )
}
