"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { HorizontalPostCard } from "@/components/horizontal-post-card"
import { PostCard } from "@/components/post-card"
import { Button } from "@/components/ui/button"
import { SearchLink } from "@/components/search-link"
import { LayoutToggle } from "@/components/layout-toggle"
import { ArrowRight } from "lucide-react"
import type { Post } from "@/lib/mdx"

interface HomePageClientProps {
  posts: Post[]
}

export default function HomePageClient({ posts }: HomePageClientProps) {
  // Default to horizontal layout
  const [layout, setLayout] = useState<"grid" | "horizontal">("horizontal")
  
  // Load saved layout preference
  useEffect(() => {
    const savedLayout = localStorage.getItem("homeLayout") as "grid" | "horizontal" | null
    if (savedLayout) {
      setLayout(savedLayout)
    }
  }, [])
  
  // Save layout preference
  const handleLayoutChange = (newLayout: "grid" | "horizontal") => {
    console.log("Layout change triggered:", newLayout)
    setLayout(newLayout)
    localStorage.setItem("homeLayout", newLayout)
  }

  return (
    <div className="container py-10 max-w-6xl">
      {/* Hero Section */}
      <section className="flex flex-col items-center text-center space-y-4 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-20">
        <h1 className="text-3xl font-bold sm:text-4xl md:text-5xl lg:text-6xl">
          Kaameo Dev Blog
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground sm:text-xl">
          다양한 기술 스택에 대한 경험과 인사이트를 나눕니다.
        </p>
        <p className="max-w-[700px] text-base text-muted-foreground/70">
          모든 포스트는 LLM을 통해 생성합니다.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Link href="/posts">
            <Button size="lg" className="w-full sm:w-auto">
              모든 글 보기
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <div className="flex gap-3 sm:gap-4">
            <SearchLink showShortcut={true} enableKeyboardNavigation={true} />
            <Link href="/about" className="flex-1 sm:flex-initial">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                About Me
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Posts Section */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">최근 포스트</h2>
          <div className="flex items-center gap-4">
            <LayoutToggle layout={layout} onLayoutChange={handleLayoutChange} />
            <Link href="/posts">
              <Button variant="ghost" size="sm">
                모두 보기
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
        
        {layout === "horizontal" ? (
          <div className="space-y-6">
            {posts.slice(0, 6).map((post) => (
              <HorizontalPostCard 
                key={post.slug} 
                post={post}
                className="py-6"
              />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.slice(0, 6).map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}