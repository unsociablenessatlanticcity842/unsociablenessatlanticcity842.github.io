/**
 * Custom Event Tracking for Blog
 *
 * Simplified event tracking using Next.js sendGAEvent
 */

import { sendGAEvent } from '@next/third-parties/google'

/**
 * Track article read
 */
export function trackArticleRead(slug: string, title: string) {
  sendGAEvent('event', 'article_read', {
    article_slug: slug,
    article_title: title,
  })
}

/**
 * Track scroll milestone
 */
export function trackScrollMilestone(percentage: number) {
  sendGAEvent('event', 'scroll', {
    percent_scrolled: percentage,
  })
}

/**
 * Track code copy
 */
export function trackCodeCopy(language?: string) {
  sendGAEvent('event', 'code_copy', {
    code_language: language || 'unknown',
  })
}

/**
 * Track category filter
 */
export function trackCategoryFilter(category: string) {
  sendGAEvent('event', 'category_filter', {
    category_name: category,
  })
}

/**
 * Track tag click
 */
export function trackTagClick(tag: string) {
  sendGAEvent('event', 'tag_click', {
    tag_name: tag,
  })
}

/**
 * Track external link click
 */
export function trackExternalLink(url: string) {
  sendGAEvent('event', 'external_link_click', {
    link_url: url,
  })
}

/**
 * Track theme change
 */
export function trackThemeChange(theme: string) {
  sendGAEvent('event', 'theme_change', {
    theme_name: theme,
  })
}

/**
 * Track search
 */
export function trackSearch(query: string) {
  sendGAEvent('event', 'search', {
    search_term: query,
  })
}

/**
 * Track Web Vitals (performance metrics)
 */
export function trackWebVitals(metric: {
  name: string
  value: number
  id: string
  rating?: string
}) {
  sendGAEvent('event', 'web_vitals', {
    metric_name: metric.name,
    metric_value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
    metric_id: metric.id,
    metric_rating: metric.rating,
  })
}
