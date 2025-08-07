import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// 스켈레톤 컴포넌트
function PostsSearchSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* 검색 바 스켈레톤 */}
      <div className="h-12 bg-muted rounded-lg"></div>
      
      {/* 결과 요약 스켈레톤 */}
      <div className="flex items-center justify-between">
        <div className="h-6 w-32 bg-muted rounded"></div>
        <div className="h-10 w-24 bg-muted rounded"></div>
      </div>
      
      {/* 포스트 그리드 스켈레톤 */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-3 bg-muted rounded w-full"></div>
            <div className="h-3 bg-muted rounded w-2/3"></div>
          </div>
        ))}
      </div>
    </div>
  )
}

// 동적 import로 PostsSearch 로드
const PostsSearch = dynamic(
  () => import('./posts-search').then(mod => mod.PostsSearch),
  {
    ssr: false,
    loading: () => <PostsSearchSkeleton />
  }
)

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