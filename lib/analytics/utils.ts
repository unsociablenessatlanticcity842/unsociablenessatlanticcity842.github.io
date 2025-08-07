/**
 * Google Analytics 4 Utility Functions
 * 
 * Helper functions for data sanitization, validation, and GA4 operations
 */

import { PATTERNS, STORAGE_KEYS, ENGAGEMENT_THRESHOLDS } from './constants'
import type { BlogEventParams, PageMetadata } from './types'

/**
 * Sanitize data to remove PII (Personally Identifiable Information)
 */
export function sanitizeData(data: string): string {
  let sanitized = data
  
  // Remove email addresses
  sanitized = sanitized.replace(PATTERNS.EMAIL, '[EMAIL_REMOVED]')
  
  // Remove phone numbers
  sanitized = sanitized.replace(PATTERNS.PHONE, '[PHONE_REMOVED]')
  
  // Remove credit card numbers
  sanitized = sanitized.replace(PATTERNS.CREDIT_CARD, '[CC_REMOVED]')
  
  // Remove SSN
  sanitized = sanitized.replace(PATTERNS.SSN, '[SSN_REMOVED]')
  
  // Remove IP addresses
  sanitized = sanitized.replace(PATTERNS.IP_ADDRESS, '[IP_REMOVED]')
  
  return sanitized
}

/**
 * Sanitize URL to remove sensitive query parameters
 */
export function sanitizeUrl(url: string): string {
  try {
    const urlObj = new URL(url)
    const sensitiveParams = ['email', 'token', 'key', 'password', 'auth', 'session']
    
    sensitiveParams.forEach(param => {
      urlObj.searchParams.delete(param)
    })
    
    return urlObj.toString()
  } catch {
    return url
  }
}

/**
 * Sanitize object recursively to remove PII
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized = {} as T
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key as keyof T] = sanitizeData(value) as T[keyof T]
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key as keyof T] = Array.isArray(value)
        ? value.map(item => typeof item === 'string' ? sanitizeData(item) : item) as T[keyof T]
        : sanitizeObject(value) as T[keyof T]
    } else {
      sanitized[key as keyof T] = value
    }
  }
  
  return sanitized
}

/**
 * Generate a unique session ID
 */
export function generateSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Generate a persistent user ID (stored in localStorage)
 */
export function getOrCreateUserId(): string {
  if (typeof window === 'undefined') return ''
  
  let userId = localStorage.getItem(STORAGE_KEYS.USER_ID)
  
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    localStorage.setItem(STORAGE_KEYS.USER_ID, userId)
  }
  
  return userId
}

/**
 * Check if Do Not Track is enabled
 */
export function isDoNotTrackEnabled(): boolean {
  if (typeof window === 'undefined') return false
  
  const dnt = navigator.doNotTrack || (window as any).doNotTrack || (navigator as any).msDoNotTrack
  return dnt === '1' || dnt === 'yes' || dnt === true
}

/**
 * Check if the user is a bot
 */
export function isBot(): boolean {
  if (typeof navigator === 'undefined') return false
  
  const botPatterns = [
    /bot/i,
    /crawl/i,
    /spider/i,
    /scraper/i,
    /facebookexternalhit/i,
    /WhatsApp/i,
    /Slack/i,
    /Twitter/i,
  ]
  
  return botPatterns.some(pattern => pattern.test(navigator.userAgent))
}

/**
 * Get browser information
 */
export function getBrowserInfo() {
  if (typeof window === 'undefined') return {}
  
  return {
    language: navigator.language,
    platform: navigator.platform,
    screen_resolution: `${window.screen.width}x${window.screen.height}`,
    viewport_size: `${window.innerWidth}x${window.innerHeight}`,
    color_depth: window.screen.colorDepth,
    pixel_ratio: window.devicePixelRatio || 1,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  }
}

/**
 * Calculate reading time based on word count
 */
export function calculateReadingTime(wordCount: number): number {
  const WORDS_PER_MINUTE = 200
  return Math.ceil(wordCount / WORDS_PER_MINUTE)
}

/**
 * Parse page metadata from the document
 */
export function parsePageMetadata(): PageMetadata {
  if (typeof document === 'undefined') {
    return {
      title: '',
      path: '',
    }
  }
  
  const metadata: PageMetadata = {
    title: document.title,
    path: window.location.pathname,
  }
  
  // Try to extract additional metadata from meta tags
  const metaTags = document.getElementsByTagName('meta')
  
  for (let i = 0; i < metaTags.length; i++) {
    const meta = metaTags[i]
    const property = meta.getAttribute('property') || meta.getAttribute('name')
    const content = meta.getAttribute('content')
    
    if (!property || !content) continue
    
    switch (property) {
      case 'article:author':
        metadata.author = content
        break
      case 'article:published_time':
        metadata.publishedAt = content
        break
      case 'article:modified_time':
        metadata.updatedAt = content
        break
      case 'article:tag':
        if (!metadata.tags) metadata.tags = []
        metadata.tags.push(content)
        break
      case 'article:section':
        metadata.category = content
        break
    }
  }
  
  return metadata
}

/**
 * Debounce function for event handlers
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return function (this: any, ...args: Parameters<T>) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const context = this
    
    if (timeout) clearTimeout(timeout)
    
    timeout = setTimeout(() => {
      func.apply(context, args)
    }, wait)
  }
}

/**
 * Throttle function for event handlers
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false
  
  return function (this: any, ...args: Parameters<T>) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const context = this
    
    if (!inThrottle) {
      func.apply(context, args)
      inThrottle = true
      
      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
  }
}

/**
 * Calculate scroll percentage
 */
export function getScrollPercentage(): number {
  if (typeof window === 'undefined') return 0
  
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
  
  if (scrollHeight === 0) return 100
  
  return Math.round((scrollTop / scrollHeight) * 100)
}

/**
 * Check if element is in viewport
 */
export function isInViewport(element: Element): boolean {
  const rect = element.getBoundingClientRect()
  
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  )
}

/**
 * Format event parameters for GA4
 */
export function formatEventParams(params: BlogEventParams): BlogEventParams {
  const formatted = { ...params }
  
  // Ensure all string values are sanitized
  Object.keys(formatted).forEach(key => {
    const value = formatted[key as keyof BlogEventParams]
    if (typeof value === 'string') {
      formatted[key as keyof BlogEventParams] = sanitizeData(value) as any
    }
  })
  
  // Add timestamp if not present
  if (!formatted.timestamp) {
    formatted.timestamp = Date.now()
  }
  
  // Add engagement time if applicable
  if (!formatted.engagement_time_msec && typeof window !== 'undefined') {
    const navigationStart = performance?.timing?.navigationStart || Date.now()
    formatted.engagement_time_msec = Date.now() - navigationStart
  }
  
  return formatted
}

/**
 * Check if user is engaged based on time and scroll
 */
export function isUserEngaged(timeOnPage: number, scrollDepth: number): boolean {
  return (
    timeOnPage >= ENGAGEMENT_THRESHOLDS.ENGAGED_TIME * 1000 &&
    scrollDepth >= ENGAGEMENT_THRESHOLDS.MIN_SCROLL_DEPTH
  )
}

/**
 * Get network connection info
 */
export function getNetworkInfo() {
  if (typeof navigator === 'undefined' || !('connection' in navigator)) {
    return { effective_connection_type: 'unknown' }
  }
  
  const connection = (navigator as any).connection
  
  return {
    effective_connection_type: connection.effectiveType || 'unknown',
    downlink_mbps: connection.downlink || 0,
    rtt_ms: connection.rtt || 0,
    save_data: connection.saveData || false,
  }
}

/**
 * Safe JSON parse with fallback
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json)
  } catch {
    return fallback
  }
}

/**
 * Create a performance observer for Web Vitals
 */
export function createPerformanceObserver(callback: (entry: PerformanceEntry) => void) {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
    return null
  }
  
  try {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        callback(entry)
      }
    })
    
    return observer
  } catch {
    return null
  }
}

/**
 * Get referrer information
 */
export function getReferrerInfo() {
  if (typeof document === 'undefined') return {}
  
  const referrer = document.referrer
  
  if (!referrer) {
    return { referrer_source: 'direct' }
  }
  
  try {
    const referrerUrl = new URL(referrer)
    const currentUrl = new URL(window.location.href)
    
    if (referrerUrl.hostname === currentUrl.hostname) {
      return { referrer_source: 'internal' }
    }
    
    // Detect common referrer sources
    const hostname = referrerUrl.hostname.toLowerCase()
    
    if (hostname.includes('google')) return { referrer_source: 'google' }
    if (hostname.includes('facebook') || hostname.includes('fb.com')) return { referrer_source: 'facebook' }
    if (hostname.includes('twitter') || hostname.includes('t.co')) return { referrer_source: 'twitter' }
    if (hostname.includes('linkedin')) return { referrer_source: 'linkedin' }
    if (hostname.includes('reddit')) return { referrer_source: 'reddit' }
    
    return {
      referrer_source: 'external',
      referrer_domain: referrerUrl.hostname,
    }
  } catch {
    return { referrer_source: 'invalid' }
  }
}

/**
 * Batch events for efficient sending
 */
export class EventBatcher<T> {
  private queue: T[] = []
  private timer: NodeJS.Timeout | null = null
  
  constructor(
    private callback: (events: T[]) => void,
    private batchSize: number = 10,
    private timeout: number = 1000
  ) {}
  
  add(event: T) {
    this.queue.push(event)
    
    if (this.queue.length >= this.batchSize) {
      this.flush()
    } else if (!this.timer) {
      this.timer = setTimeout(() => this.flush(), this.timeout)
    }
  }
  
  flush() {
    if (this.queue.length === 0) return
    
    const events = [...this.queue]
    this.queue = []
    
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }
    
    this.callback(events)
  }
  
  destroy() {
    this.flush()
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }
  }
}