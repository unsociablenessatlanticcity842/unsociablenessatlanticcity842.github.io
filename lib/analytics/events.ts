/**
 * Google Analytics 4 Event Tracking Functions
 * 
 * Custom event tracking implementations for blog-specific events
 */

import { GA_EVENTS, EVENT_CATEGORIES, SCROLL_MILESTONES, READING_TIME_MILESTONES } from './constants'
import { trackEvent, trackTiming } from './gtag'
import { 
  getScrollPercentage, 
  getBrowserInfo,
  getNetworkInfo,
  getReferrerInfo,
} from './utils'
import type { BlogEventParams } from './types'

// Track article milestones
const readingMilestones = new Set<number>()
const scrollMilestones = new Set<number>()
let articleStartTime: number | null = null
let lastActiveTime: number = Date.now()

/**
 * Track article read start
 */
export function trackArticleStart(metadata: {
  post_id: string
  post_title: string
  post_category?: string
  post_tags?: string[]
  author?: string
  word_count?: number
  reading_time?: number
}) {
  articleStartTime = Date.now()
  readingMilestones.clear()
  scrollMilestones.clear()
  
  const params: BlogEventParams = {
    event_category: EVENT_CATEGORIES.CONTENT,
    ...metadata,
    ...getBrowserInfo(),
    ...getReferrerInfo(),
  }
  
  trackEvent(GA_EVENTS.ARTICLE_READ, params)
}

/**
 * Track article completion
 */
export function trackArticleComplete(metadata: {
  post_id: string
  post_title: string
  actual_reading_time?: number
}) {
  if (!articleStartTime) return
  
  const totalTime = Math.round((Date.now() - articleStartTime) / 1000)
  const scrollDepth = getScrollPercentage()
  
  const params: BlogEventParams = {
    event_category: EVENT_CATEGORIES.CONTENT,
    event_label: 'complete',
    value: totalTime,
    ...metadata,
    actual_reading_time: totalTime,
    scroll_percentage: scrollDepth,
    engagement_score: calculateEngagementScore(totalTime, scrollDepth),
  }
  
  trackEvent(GA_EVENTS.ARTICLE_READ, params)
  
  // Track timing
  trackTiming('article_read_time', totalTime * 1000, EVENT_CATEGORIES.CONTENT, metadata.post_id)
}

/**
 * Track scroll milestones
 */
export function trackScrollMilestone(percentage: number, metadata?: {
  post_id?: string
  post_title?: string
}) {
  const milestone = SCROLL_MILESTONES.find(m => 
    percentage >= m && !scrollMilestones.has(m)
  )
  
  if (milestone) {
    scrollMilestones.add(milestone)
    
    const params: BlogEventParams = {
      event_category: EVENT_CATEGORIES.ENGAGEMENT,
      event_label: `scroll_${milestone}`,
      scroll_percentage: milestone,
      ...metadata,
      time_to_milestone: articleStartTime 
        ? Math.round((Date.now() - articleStartTime) / 1000)
        : undefined,
    }
    
    trackEvent(GA_EVENTS.SCROLL, params)
  }
}

/**
 * Track reading time milestones
 */
export function trackReadingMilestone(seconds: number, metadata?: {
  post_id?: string
  post_title?: string
}) {
  const milestone = READING_TIME_MILESTONES.find(m => 
    seconds >= m && !readingMilestones.has(m)
  )
  
  if (milestone) {
    readingMilestones.add(milestone)
    
    const params: BlogEventParams = {
      event_category: EVENT_CATEGORIES.ENGAGEMENT,
      event_label: `reading_${milestone}s`,
      value: milestone,
      ...metadata,
      scroll_percentage: getScrollPercentage(),
    }
    
    trackEvent(GA_EVENTS.ARTICLE_MILESTONE, params)
  }
}

/**
 * Track search
 */
export function trackSearch(searchTerm: string, resultsCount?: number) {
  const params: BlogEventParams = {
    event_category: EVENT_CATEGORIES.ENGAGEMENT,
    search_term: searchTerm.toLowerCase(),
    value: resultsCount,
  }
  
  trackEvent(GA_EVENTS.SEARCH, params)
}

/**
 * Track theme change
 */
export function trackThemeChange(theme: 'light' | 'dark') {
  const params: BlogEventParams = {
    event_category: EVENT_CATEGORIES.ENGAGEMENT,
    event_label: theme,
    theme_mode: theme,
  }
  
  trackEvent(GA_EVENTS.THEME_CHANGE, params)
}

/**
 * Track category filter
 */
export function trackCategoryFilter(category: string, postCount?: number) {
  const params: BlogEventParams = {
    event_category: EVENT_CATEGORIES.NAVIGATION,
    event_label: category,
    value: postCount,
  }
  
  trackEvent(GA_EVENTS.CATEGORY_FILTER, params)
}

/**
 * Track tag click
 */
export function trackTagClick(tag: string, source?: 'post' | 'sidebar' | 'cloud') {
  const params: BlogEventParams = {
    event_category: EVENT_CATEGORIES.NAVIGATION,
    event_label: tag,
    source,
  }
  
  trackEvent(GA_EVENTS.TAG_CLICK, params)
}

/**
 * Track code copy
 */
export function trackCodeCopy(language?: string, source?: string) {
  const params: BlogEventParams = {
    event_category: EVENT_CATEGORIES.ENGAGEMENT,
    event_label: language || 'unknown',
    source,
  }
  
  trackEvent(GA_EVENTS.CODE_COPY, params)
}

/**
 * Track external link click
 */
export function trackExternalLink(url: string, text?: string) {
  try {
    const urlObj = new URL(url)
    
    const params: BlogEventParams = {
      event_category: EVENT_CATEGORIES.NAVIGATION,
      event_label: urlObj.hostname,
      link_url: url,
      link_text: text,
      link_domain: urlObj.hostname,
    }
    
    trackEvent(GA_EVENTS.EXTERNAL_LINK_CLICK, params)
  } catch {
    // Invalid URL, skip tracking
  }
}

/**
 * Track social share
 */
export function trackShare(method: string, content?: {
  post_id?: string
  post_title?: string
  post_url?: string
}) {
  const params: BlogEventParams = {
    event_category: EVENT_CATEGORIES.SOCIAL,
    event_label: method,
    method,
    content_type: 'article',
    ...content,
  }
  
  trackEvent(GA_EVENTS.ARTICLE_SHARE, params)
}

/**
 * Track comment interaction
 */
export function trackCommentInteraction(action: 'post' | 'reaction' | 'reply', metadata?: {
  post_id?: string
  post_title?: string
  comment_id?: string
}) {
  const params: BlogEventParams = {
    event_category: EVENT_CATEGORIES.SOCIAL,
    event_label: action,
    ...metadata,
  }
  
  trackEvent(GA_EVENTS.COMMENT_POST, params)
}

/**
 * Track Web Vitals
 */
export function trackWebVitals(metric: {
  name: 'FCP' | 'LCP' | 'FID' | 'CLS' | 'TTFB' | 'INP'
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  id?: string
  navigationType?: string
}) {
  const params = {
    event_category: EVENT_CATEGORIES.PERFORMANCE,
    event_label: metric.name,
    value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
    metric_id: metric.id,
    metric_value: metric.value,
    metric_rating: metric.rating,
    navigation_type: metric.navigationType,
    ...getNetworkInfo(),
  }
  
  trackEvent(GA_EVENTS.WEB_VITALS, params)
  
  // Also track as timing
  trackTiming(
    metric.name.toLowerCase(),
    metric.value,
    'Web Vitals',
    metric.rating
  )
}

/**
 * Track user engagement (time on page)
 */
export function trackEngagement() {
  const now = Date.now()
  const timeSinceLastActive = now - lastActiveTime
  
  // Only track if user was active in the last 30 seconds
  if (timeSinceLastActive < 30000) {
    const params: BlogEventParams = {
      event_category: EVENT_CATEGORIES.ENGAGEMENT,
      engagement_time_msec: timeSinceLastActive,
      page_title: document.title,
      page_path: window.location.pathname,
    }
    
    trackEvent('user_engagement', params)
  }
  
  lastActiveTime = now
}

/**
 * Track errors
 */
export function trackError(error: {
  message: string
  source?: string
  lineno?: number
  colno?: number
  stack?: string
}) {
  const params: BlogEventParams = {
    event_category: EVENT_CATEGORIES.ERROR,
    event_label: error.source || 'unknown',
    description: error.message,
    fatal: false,
    error_source: error.source,
    error_line: error.lineno,
    error_column: error.colno,
  }
  
  trackEvent(GA_EVENTS.ERROR_BOUNDARY, params)
}

/**
 * Calculate engagement score
 */
function calculateEngagementScore(timeOnPage: number, scrollDepth: number): number {
  // Weight factors
  const TIME_WEIGHT = 0.4
  const SCROLL_WEIGHT = 0.3
  const MILESTONE_WEIGHT = 0.3
  
  // Normalize time (cap at 10 minutes)
  const normalizedTime = Math.min(timeOnPage / 600, 1)
  
  // Normalize scroll
  const normalizedScroll = scrollDepth / 100
  
  // Milestone completion
  const milestonesCompleted = scrollMilestones.size + readingMilestones.size
  const totalMilestones = SCROLL_MILESTONES.length + READING_TIME_MILESTONES.length
  const normalizedMilestones = milestonesCompleted / totalMilestones
  
  // Calculate score (0-100)
  const score = (
    normalizedTime * TIME_WEIGHT +
    normalizedScroll * SCROLL_WEIGHT +
    normalizedMilestones * MILESTONE_WEIGHT
  ) * 100
  
  return Math.round(score)
}

/**
 * Reset tracking state (for new articles)
 */
export function resetArticleTracking() {
  articleStartTime = null
  readingMilestones.clear()
  scrollMilestones.clear()
  lastActiveTime = Date.now()
}

/**
 * Track page timing
 */
export function trackPageTiming() {
  if (typeof window === 'undefined' || !window.performance) return
  
  // Wait for load to complete
  if (document.readyState !== 'complete') {
    window.addEventListener('load', trackPageTiming)
    return
  }
  
  const timing = window.performance.timing
  const navigation = window.performance.navigation
  
  // Calculate metrics
  const metrics = {
    dns: timing.domainLookupEnd - timing.domainLookupStart,
    tcp: timing.connectEnd - timing.connectStart,
    request: timing.responseStart - timing.requestStart,
    response: timing.responseEnd - timing.responseStart,
    dom_processing: timing.domComplete - timing.domLoading,
    onload: timing.loadEventEnd - timing.loadEventStart,
    total_page_load: timing.loadEventEnd - timing.navigationStart,
  }
  
  // Track each metric
  Object.entries(metrics).forEach(([name, value]) => {
    if (value > 0) {
      trackTiming(name, value, 'Page Load', navigation.type === 1 ? 'reload' : 'navigation')
    }
  })
  
  // Track overall timing
  trackEvent(GA_EVENTS.TIMING_COMPLETE, {
    event_category: EVENT_CATEGORIES.PERFORMANCE,
    ...metrics,
    navigation_type: navigation.type === 1 ? 'reload' : 'navigation',
    ...getNetworkInfo(),
  })
}