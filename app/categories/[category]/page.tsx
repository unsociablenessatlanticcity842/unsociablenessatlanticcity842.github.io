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
    category: category.toLowerCase(),
  }))
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const categoryName = params.category.charAt(0).toUpperCase() + params.category.slice(1)
  
  return {
    title: `${categoryName} 카테고리`,
    description: `${categoryName} 카테고리의 포스트 목록`,
  }
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const categoryName = params.category.charAt(0).toUpperCase() + params.category.slice(1)
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