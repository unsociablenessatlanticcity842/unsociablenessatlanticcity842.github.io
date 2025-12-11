"use client"

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// 동적 import로 PostTracker 로드
const PostTracker = dynamic(
  () => import('./post-tracker').then(mod => mod.PostTracker),
  {
    ssr: false,
  }
)

interface PostTrackerWrapperProps {
  title: string
  slug: string
  category?: string
  tags?: string[]
  author?: string
  readingTime?: number
  wordCount?: number
}

export function PostTrackerWrapper(props: PostTrackerWrapperProps) {
  return (
    <Suspense fallback={null}>
      <PostTracker {...props} />
    </Suspense>
  )
}