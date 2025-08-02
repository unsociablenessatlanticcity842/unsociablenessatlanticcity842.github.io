import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getPostsByCategory, getAllCategories } from "@/lib/mdx"
import { PostCard } from "@/components/post-card"

interface CategoryPageProps {
  params: {
    category: string
  }
}

export async function generateStaticParams() {
  const categories = getAllCategories()
  return categories.map((category) => ({
    category: category.toLowerCase().replace(/\s+/g, '-'),
  }))
}

// Create a map for category slug to actual category name
function getCategoryFromSlug(slug: string): string {
  const categories = getAllCategories()
  const normalizedSlug = slug.toLowerCase()
  
  // Find the category that matches when lowercased and spaces replaced with hyphens
  const matchedCategory = categories.find(
    cat => cat.toLowerCase().replace(/\s+/g, '-') === normalizedSlug
  )
  
  return matchedCategory || slug
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const categoryName = getCategoryFromSlug(params.category)
  
  return {
    title: `${categoryName} 카테고리`,
    description: `${categoryName} 카테고리의 포스트 목록`,
  }
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const categoryName = getCategoryFromSlug(params.category)
  const posts = getPostsByCategory(categoryName)
  
  if (posts.length === 0) {
    notFound()
  }

  return (
    <div className="container py-10">
      <div className="space-y-4 pb-8">
        <h1 className="text-4xl font-bold">{categoryName} 카테고리</h1>
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