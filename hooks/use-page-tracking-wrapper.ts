'use client'

import { useEffect } from 'react'
import { usePageTracking } from './use-page-tracking'
import type { PageMetadata } from '@/lib/analytics/types'

interface UsePageTrackingWrapperOptions {
  metadata?: PageMetadata
  trackScrolling?: boolean
  enableEngagementTracking?: boolean
  isArticle?: boolean
}

// This is a wrapper hook that can be used safely in RSC
export function usePageTrackingWrapper(options: UsePageTrackingWrapperOptions = {}) {
  // Use a flag to ensure tracking is only initialized client-side
  useEffect(() => {
    // This ensures the hook only runs on the client
    if (typeof window !== 'undefined') {
      // Import and use the actual hook dynamically
      import('./use-page-tracking').then(({ usePageTracking }) => {
        // The actual tracking logic will be handled by the imported hook
        // This is just a placeholder for now - the real implementation
        // would need to be refactored to not use useSearchParams directly
      })
    }
  }, [])

  return {
    timeOnPage: 0,
    scrollPercentage: 0,
    isActive: true,
  }
}