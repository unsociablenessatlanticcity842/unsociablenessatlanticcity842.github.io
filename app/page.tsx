import Link from "next/link"
import { getAllPosts } from "@/lib/mdx"
import { PostCard } from "@/components/post-card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function HomePage() {
  const posts = getAllPosts()
  const recentPosts = posts.slice(0, 6)

  return (
    <div className="container py-10">
      {/* Hero Section */}
      <section className="flex flex-col items-center text-center space-y-4 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-20">
        <h1 className="text-3xl font-bold sm:text-4xl md:text-5xl lg:text-6xl">
          Welcome to Kaameo Dev Blog
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground sm:text-xl">
          개발 여정을 기록하고 공유하는 공간입니다. 
          Next.js, React, TypeScript 등 다양한 기술 스택에 대한 경험과 인사이트를 나눕니다.
        </p>
        <div className="flex gap-4">
          <Link href="/posts">
            <Button size="lg">
              모든 글 보기
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/about">
            <Button size="lg" variant="outline">
              About Me
            </Button>
          </Link>
        </div>
      </section>

      {/* Recent Posts Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold">최근 포스트</h2>
          <Link href="/posts">
            <Button variant="ghost">
              모두 보기
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {recentPosts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>
    </div>
  )
}