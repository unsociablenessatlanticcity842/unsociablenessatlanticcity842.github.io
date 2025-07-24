import { Metadata } from "next"
import { getAllPosts } from "@/lib/mdx"
import { PostCard } from "@/components/post-card"

export const metadata: Metadata = {
  title: "All Posts",
  description: "모든 블로그 포스트 목록",
}

export default function PostsPage() {
  const posts = getAllPosts()

  return (
    <div className="container py-10">
      <div className="space-y-4 pb-8">
        <h1 className="text-4xl font-bold">모든 포스트</h1>
        <p className="text-muted-foreground">
          총 {posts.length}개의 포스트가 있습니다.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  )
}