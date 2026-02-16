import { getRelatedPosts } from '@/lib/mdx'
import { HorizontalPostCard } from '@/components/horizontal-post-card'

interface RelatedPostsProps {
  currentSlug: string
  limit?: number
}

export async function RelatedPosts({ currentSlug, limit = 4 }: RelatedPostsProps) {
  const relatedPosts = await getRelatedPosts(currentSlug, limit)

  return (
    <section className="mt-12 pt-8 border-t">
      <h2 className="text-xl font-bold mb-6">관련 포스트</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {relatedPosts.map((post) => (
          <HorizontalPostCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  )
}
