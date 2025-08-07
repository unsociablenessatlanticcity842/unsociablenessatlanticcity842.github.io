'use client'

import { usePageTracking } from '@/hooks/use-page-tracking'

interface PostTrackerProps {
  title: string
  slug: string
  category?: string
  tags?: string[]
  author?: string
  readingTime?: number
  wordCount?: number
}

export function PostTracker({
  title,
  slug,
  category,
  tags,
  author,
  readingTime,
  wordCount,
}: PostTrackerProps) {
  // Track page view and reading progress
  usePageTracking({
    metadata: {
      title,
      path: `/posts/${slug}`,
      category,
      tags,
      author,
      readingTime,
      wordCount,
    },
    trackScrolling: true,
    enableEngagementTracking: true,
    isArticle: true,
  })

  // This component doesn't render anything
  return null
}