import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPostsByCategory, getAllCategories } from '@/lib/mdx'
import { PostCard } from '@/components/post-card'

interface CategoryPageProps {
  params: Promise<{
    category: string
  }>
}

export async function generateStaticParams() {
  const categories = await getAllCategories()
  return categories.map((category) => ({
    category: category.toLowerCase().replace(/\s+/g, '-'),
  }))
}

// Create a map for category slug to actual category name
async function getCategoryFromSlug(slug: string): Promise<string> {
  const categories = await getAllCategories()
  const normalizedSlug = slug.toLowerCase()

  // Find the category that matches when lowercased and spaces replaced with hyphens
  const matchedCategory = categories.find(
    (cat) => cat.toLowerCase().replace(/\s+/g, '-') === normalizedSlug,
  )

  return matchedCategory || slug
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params
  const categoryName = await getCategoryFromSlug(category)

  return {
    title: `${categoryName} 카테고리`,
    description: `${categoryName} 카테고리의 포스트 목록`,
    alternates: {
      canonical: `/categories/${category}/`,
    },
    openGraph: {
      title: `${categoryName} 카테고리 | Kaameo Dev Blog`,
      description: `${categoryName} 카테고리의 포스트 목록`,
      url: `https://kaameo.github.io/categories/${category}/`,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: `${categoryName} 카테고리 | Kaameo Dev Blog`,
      description: `${categoryName} 카테고리의 포스트 목록`,
    },
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params
  const categoryName = await getCategoryFromSlug(category)
  const posts = await getPostsByCategory(categoryName)

  if (posts.length === 0) {
    notFound()
  }

  return (
    <div className="container py-10">
      <div className="space-y-4 pb-8">
        <h1 className="text-4xl font-bold">{categoryName} 카테고리</h1>
        <p className="text-muted-foreground">총 {posts.length}개의 포스트가 있습니다.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  )
}
