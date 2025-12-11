"use client"

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// Dynamic import for better performance
const GiscusComments = dynamic(
  () => import("@/components/giscus-comments").then((mod) => mod.GiscusComments),
  {
    ssr: false,
    loading: () => (
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-8">댓글</h2>
        <div className="animate-pulse">
          <div className="h-32 bg-muted rounded-lg"></div>
        </div>
      </div>
    ),
  }
)

interface GiscusCommentsWrapperProps {
  className?: string
}

export function GiscusCommentsWrapper({ className }: GiscusCommentsWrapperProps) {
  return (
    <Suspense fallback={
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-8">댓글</h2>
        <div className="animate-pulse">
          <div className="h-32 bg-muted rounded-lg"></div>
        </div>
      </div>
    }>
      <GiscusComments className={className} />
    </Suspense>
  )
}
