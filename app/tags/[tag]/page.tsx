import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getPostsByTag, getAllTags } from "@/lib/mdx"
import { PostCard } from "@/components/post-card"
import { tagToSlug, slugToTag } from "@/lib/slug"

interface TagPageProps {
  params: Promise<{
    tag: string
  }>
}

export async function generateStaticParams() {
  const tags = getAllTags()
  return tags.map((tag) => ({
    tag: tagToSlug(tag),
  }))
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { tag } = await params
  const allTags = getAllTags()
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
  }
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params
  const allTags = getAllTags()
  const actualTag = slugToTag(tag, allTags)

  if (!actualTag) {
    notFound()
  }

  const posts = getPostsByTag(actualTag)

  if (posts.length === 0) {
    notFound()
  }

  return (
    <div className="container py-10">
      <div className="space-y-4 pb-8">
        <h1 className="text-4xl font-bold">#{actualTag}</h1>
        <p className="text-muted-foreground">
          총 {posts.length}개의 포스트가 있습니다.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  )
}
