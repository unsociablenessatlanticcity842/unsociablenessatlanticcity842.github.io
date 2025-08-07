'use client'

import { useCallback } from 'react'
import { trackEvent as gtagTrackEvent, setUserProperties, setUserId } from '@/lib/analytics/gtag'
import { hasAnalyticsConsent } from '@/lib/analytics/consent'
import { 
  trackSearch,
  trackThemeChange,
  trackCategoryFilter,
  trackTagClick,
  trackCodeCopy,
  trackExternalLink,
  trackShare,
  trackCommentInteraction,
  trackError,
  trackWebVitals,
} from '@/lib/analytics/events'
import type { BlogEventParams } from '@/lib/analytics/types'

export function useAnalytics() {
  // Generic event tracking
  const trackEvent = useCallback((eventName: string, parameters?: BlogEventParams) => {
    if (!hasAnalyticsConsent()) return
    gtagTrackEvent(eventName, parameters)
  }, [])

  // Search tracking
  const trackSearchEvent = useCallback((searchTerm: string, resultsCount?: number) => {
    if (!hasAnalyticsConsent()) return
    trackSearch(searchTerm, resultsCount)
  }, [])

  // Theme change tracking
  const trackThemeChangeEvent = useCallback((theme: 'light' | 'dark') => {
    if (!hasAnalyticsConsent()) return
    trackThemeChange(theme)
  }, [])

  // Category filter tracking
  const trackCategoryFilterEvent = useCallback((category: string, postCount?: number) => {
    if (!hasAnalyticsConsent()) return
    trackCategoryFilter(category, postCount)
  }, [])

  // Tag click tracking
  const trackTagClickEvent = useCallback((tag: string, source?: 'post' | 'sidebar' | 'cloud') => {
    if (!hasAnalyticsConsent()) return
    trackTagClick(tag, source)
  }, [])

  // Code copy tracking
  const trackCodeCopyEvent = useCallback((language?: string, source?: string) => {
    if (!hasAnalyticsConsent()) return
    trackCodeCopy(language, source)
  }, [])

  // External link tracking
  const trackExternalLinkEvent = useCallback((url: string, text?: string) => {
    if (!hasAnalyticsConsent()) return
    trackExternalLink(url, text)
  }, [])

  // Share tracking
  const trackShareEvent = useCallback((method: string, content?: {
    post_id?: string
    post_title?: string
    post_url?: string
  }) => {
    if (!hasAnalyticsConsent()) return
    trackShare(method, content)
  }, [])

  // Comment interaction tracking
  const trackCommentEvent = useCallback((
    action: 'post' | 'reaction' | 'reply',
    metadata?: {
      post_id?: string
      post_title?: string
      comment_id?: string
    }
  ) => {
    if (!hasAnalyticsConsent()) return
    trackCommentInteraction(action, metadata)
  }, [])

  // Error tracking
  const trackErrorEvent = useCallback((error: {
    message: string
    source?: string
    lineno?: number
    colno?: number
    stack?: string
  }) => {
    if (!hasAnalyticsConsent()) return
    trackError(error)
  }, [])

  // Web Vitals tracking
  const trackWebVitalsEvent = useCallback((metric: {
    name: 'FCP' | 'LCP' | 'FID' | 'CLS' | 'TTFB' | 'INP'
    value: number
    rating: 'good' | 'needs-improvement' | 'poor'
    id?: string
    navigationType?: string
  }) => {
    if (!hasAnalyticsConsent()) return
    trackWebVitals(metric)
  }, [])

  // User properties
  const setUserPropertiesEvent = useCallback((properties: Record<string, any>) => {
    if (!hasAnalyticsConsent()) return
    setUserProperties(properties)
  }, [])

  // User ID
  const setUserIdEvent = useCallback((userId: string | null) => {
    if (!hasAnalyticsConsent()) return
    setUserId(userId)
  }, [])

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
    trackShare: trackShareEvent,
    trackComment: trackCommentEvent,
    trackError: trackErrorEvent,
    trackWebVitals: trackWebVitalsEvent,
    
    // User tracking
    setUserProperties: setUserPropertiesEvent,
    setUserId: setUserIdEvent,
  }
}