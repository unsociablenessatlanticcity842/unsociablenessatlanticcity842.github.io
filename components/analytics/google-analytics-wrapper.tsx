"use client"

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// 동적 import로 GoogleAnalytics 로드
const GoogleAnalytics = dynamic(
  () => import('./google-analytics').then(mod => mod.GoogleAnalytics),
  {
    ssr: false,
  }
)

export function GoogleAnalyticsWrapper() {
  return (
    <Suspense fallback={null}>
      <GoogleAnalytics />
    </Suspense>
  )
}