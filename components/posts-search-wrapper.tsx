'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { HorizontalPostCardSkeleton } from '@/components/horizontal-post-card-skeleton'

// 스켈레톤 컴포넌트
function PostsSearchSkeleton() {
  return (
    <div className="space-y-6">
      {/* 검색 바 스켈레톤 */}
      <Skeleton className="h-12 w-full rounded-lg" />

      {/* 결과 요약 스켈레톤 */}
      <Skeleton className="h-5 w-32" />

      {/* 포스트 리스트 스켈레톤 */}
      <div className="divide-y">
        {[...Array(6)].map((_, i) => (
          <HorizontalPostCardSkeleton key={i} className="py-6" />
        ))}
      </div>
    </div>
  )
}

// 동적 import로 PostsSearch 로드
const PostsSearch = dynamic(() => import('./posts-search').then((mod) => mod.PostsSearch), {
  loading: () => <PostsSearchSkeleton />,
})

import { Post } from '@/lib/mdx'

interface PostsSearchWrapperProps {
  posts: Post[]
}

export function PostsSearchWrapper({ posts }: PostsSearchWrapperProps) {
  return (
    <Suspense fallback={<PostsSearchSkeleton />}>
      <PostsSearch posts={posts} />
    </Suspense>
  )
}
