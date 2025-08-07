'use client'

import { useEffect, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { trackPageView } from '@/lib/analytics/gtag'
import { 
  trackArticleStart, 
  trackArticleComplete,
  trackScrollMilestone,
  trackReadingMilestone,
  trackEngagement,
  resetArticleTracking,
} from '@/lib/analytics/events'
import { hasAnalyticsConsent } from '@/lib/analytics/consent'
import { debounce, throttle, getScrollPercentage } from '@/lib/analytics/utils'
import type { PageMetadata } from '@/lib/analytics/types'

interface UsePageTrackingOptions {
  metadata?: PageMetadata
  trackScrolling?: boolean
  enableEngagementTracking?: boolean
  isArticle?: boolean
}

export function usePageTracking(options: UsePageTrackingOptions = {}) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { 
    metadata, 
    trackScrolling = true, 
    enableEngagementTracking = true,
    isArticle = false 
  } = options
  
  const startTimeRef = useRef<number>(Date.now())
  const scrollTrackedRef = useRef<Set<number>>(new Set())
  const readingTrackedRef = useRef<Set<number>>(new Set())
  const isActiveRef = useRef<boolean>(true)
  const engagementIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Track page view on route change
  useEffect(() => {
    if (!hasAnalyticsConsent()) return

    const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '')
    trackPageView(url, metadata?.title)

    // Reset tracking for new page
    startTimeRef.current = Date.now()
    scrollTrackedRef.current.clear()
    readingTrackedRef.current.clear()
    
    // If article, track start
    if (isArticle && metadata) {
      resetArticleTracking()
      trackArticleStart({
        post_id: pathname,
        post_title: metadata.title,
        post_category: metadata.category,
        post_tags: metadata.tags,
        author: metadata.author,
        word_count: metadata.wordCount,
        reading_time: metadata.readingTime,
      })
    }
  }, [pathname, searchParams, metadata, isArticle])

  // Track scrolling
  useEffect(() => {
    if (!trackScrolling || !hasAnalyticsConsent()) return

    const handleScroll = throttle(() => {
      const scrollPercentage = getScrollPercentage()
      
      // Track scroll milestones
      trackScrollMilestone(scrollPercentage, {
        post_id: pathname,
        post_title: metadata?.title,
      })

      // Check if article is complete (90%+ scroll)
      if (isArticle && scrollPercentage >= 90 && metadata) {
        const timeOnPage = Math.round((Date.now() - startTimeRef.current) / 1000)
        
        // Only track if spent reasonable time
        if (timeOnPage >= 10) {
          trackArticleComplete({
            post_id: pathname,
            post_title: metadata.title,
            actual_reading_time: timeOnPage,
          })
        }
      }
    }, 250)

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [pathname, metadata, isArticle, trackScrolling])

  // Track reading time milestones
  useEffect(() => {
    if (!isArticle || !hasAnalyticsConsent()) return

    const checkReadingTime = () => {
      const timeOnPage = Math.round((Date.now() - startTimeRef.current) / 1000)
      
      trackReadingMilestone(timeOnPage, {
        post_id: pathname,
        post_title: metadata?.title,
      })
    }

    const interval = setInterval(checkReadingTime, 5000) // Check every 5 seconds
    return () => clearInterval(interval)
  }, [pathname, metadata, isArticle])

  // Track user engagement
  useEffect(() => {
    if (!enableEngagementTracking || !hasAnalyticsConsent()) return

    // Track user activity
    const updateActivity = () => {
      isActiveRef.current = true
    }

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart']
    events.forEach(event => {
      window.addEventListener(event, updateActivity, { passive: true })
    })

    // Send engagement events periodically
    engagementIntervalRef.current = setInterval(() => {
      if (isActiveRef.current) {
        trackEngagement()
        isActiveRef.current = false
      }
    }, 15000) // Every 15 seconds

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, updateActivity)
      })
      if (engagementIntervalRef.current) {
        clearInterval(engagementIntervalRef.current)
      }
    }
  }, [enableEngagementTracking])

  // Track page visibility
  useEffect(() => {
    if (!hasAnalyticsConsent()) return

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page is hidden, pause tracking
        isActiveRef.current = false
      } else {
        // Page is visible again
        isActiveRef.current = true
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  // Clean up on unmount
  useEffect(() => {
    return () => {
      // If article and spent significant time, ensure completion is tracked
      if (isArticle && metadata && hasAnalyticsConsent()) {
        const timeOnPage = Math.round((Date.now() - startTimeRef.current) / 1000)
        const scrollPercentage = getScrollPercentage()
        
        if (timeOnPage >= 30 && scrollPercentage >= 50) {
          trackArticleComplete({
            post_id: pathname,
            post_title: metadata.title,
            actual_reading_time: timeOnPage,
          })
        }
      }
    }
  }, [pathname, metadata, isArticle])

  return {
    timeOnPage: Math.round((Date.now() - startTimeRef.current) / 1000),
    scrollPercentage: getScrollPercentage(),
    isActive: isActiveRef.current,
  }
}