import { Metadata } from "next"
import { Suspense } from "react"
import { getAllPosts } from "@/lib/mdx"
import { PostsSearch } from "@/components/posts-search"

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
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <PostsSearch posts={posts} />
      </Suspense>
    </div>
  )
}