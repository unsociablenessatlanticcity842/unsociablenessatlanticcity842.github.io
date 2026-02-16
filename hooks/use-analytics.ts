'use client'

import { useCallback } from 'react'
import { sendGAEvent } from '@next/third-parties/google'
import {
  trackSearch,
  trackThemeChange,
  trackCategoryFilter,
  trackTagClick,
  trackCodeCopy,
  trackExternalLink,
  trackWebVitals,
} from '@/lib/analytics/events'

/**
 * Simplified Analytics Hook
 *
 * Provides event tracking functions for blog analytics
 * No consent management - simple personal blog
 */
export function useAnalytics() {
  // Generic event tracking
  const trackEvent = useCallback((eventName: string, parameters?: Record<string, any>) => {
    sendGAEvent('event', eventName, parameters || {})
  }, [])

  // Specific event tracking functions
  const trackSearchEvent = useCallback((searchTerm: string) => {
    trackSearch(searchTerm)
  }, [])

  const trackThemeChangeEvent = useCallback((theme: string) => {
    trackThemeChange(theme)
  }, [])

  const trackCategoryFilterEvent = useCallback((category: string) => {
    trackCategoryFilter(category)
  }, [])

  const trackTagClickEvent = useCallback((tag: string) => {
    trackTagClick(tag)
  }, [])

  const trackCodeCopyEvent = useCallback((language?: string) => {
    trackCodeCopy(language)
  }, [])

  const trackExternalLinkEvent = useCallback((url: string) => {
    trackExternalLink(url)
  }, [])

  const trackWebVitalsEvent = useCallback(
    (metric: { name: string; value: number; id: string; rating?: string }) => {
      trackWebVitals(metric)
    },
    [],
  )

  return {
    // Generic tracking
    trackEvent,

    // Specific event tracking
    trackSearch: trackSearchEvent,
    trackThemeChange: trackThemeChangeEvent,
    trackCategoryFilter: trackCategoryFilterEvent,
    trackTagClick: trackTagClickEvent,
    trackCodeCopy: trackCodeCopyEvent,
    trackExternalLink: trackExternalLinkEvent,
    trackWebVitals: trackWebVitalsEvent,
  }
}
