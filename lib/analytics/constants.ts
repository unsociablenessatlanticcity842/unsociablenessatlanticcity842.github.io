/**
 * Google Analytics 4 Constants
 * 
 * Central configuration and constants for GA4 integration
 */

// Environment Configuration
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ''
export const GA_DEBUG_MODE = process.env.NODE_ENV === 'development'
export const GA_ENABLED_IN_DEV = process.env.NEXT_PUBLIC_GA_ENABLED_IN_DEV === 'true'

// GA4 Script URL
export const GA_SCRIPT_URL = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`

// Cookie Configuration
export const COOKIE_CONFIG = {
  CONSENT_COOKIE_NAME: 'kaameo-blog-consent',
  CONSENT_COOKIE_EXPIRES: 365, // days
  GA_COOKIE_PREFIX: '_ka_',
  GA_COOKIE_EXPIRES: 365 * 2, // 2 years in days
  COOKIE_DOMAIN: 'auto',
  COOKIE_FLAGS: 'SameSite=Lax;Secure',
} as const

// Consent Configuration
export const CONSENT_CONFIG = {
  VERSION: '1.0.0',
  DEFAULT_CONSENT: {
    ad_storage: 'denied',
    analytics_storage: 'denied',
    functionality_storage: 'denied',
    personalization_storage: 'denied',
    security_storage: 'granted',
    wait_for_update: 2000, // milliseconds
  },
  GRANTED_CONSENT: {
    ad_storage: 'denied', // We don't use ads
    analytics_storage: 'granted',
    functionality_storage: 'granted',
    personalization_storage: 'granted',
    security_storage: 'granted',
  },
} as const

// Event Names (following GA4 recommended event naming)
export const GA_EVENTS = {
  // Automatically collected events (for reference)
  PAGE_VIEW: 'page_view',
  USER_ENGAGEMENT: 'user_engagement',
  SCROLL: 'scroll',
  SESSION_START: 'session_start',
  FIRST_VISIT: 'first_visit',
  
  // Custom events for blog
  ARTICLE_READ: 'article_read',
  ARTICLE_SHARE: 'share',
  ARTICLE_MILESTONE: 'article_milestone',
  COMMENT_POST: 'comment_post',
  COMMENT_REACTION: 'comment_reaction',
  CODE_COPY: 'code_copy',
  SEARCH: 'search',
  THEME_CHANGE: 'theme_change',
  CATEGORY_FILTER: 'category_filter',
  TAG_CLICK: 'tag_click',
  EXTERNAL_LINK_CLICK: 'external_link_click',
  NEWSLETTER_SIGNUP: 'newsletter_signup',
  CONTACT_FORM_SUBMIT: 'contact_form_submit',
  
  // Error events
  ERROR_BOUNDARY: 'error_boundary',
  RESOURCE_ERROR: 'resource_error',
  
  // Performance events
  WEB_VITALS: 'web_vitals',
  TIMING_COMPLETE: 'timing_complete',
} as const

// Event Categories
export const EVENT_CATEGORIES = {
  ENGAGEMENT: 'engagement',
  NAVIGATION: 'navigation',
  CONTENT: 'content',
  SOCIAL: 'social',
  PERFORMANCE: 'performance',
  ERROR: 'error',
  CONVERSION: 'conversion',
} as const

// Scroll Milestones (percentages)
export const SCROLL_MILESTONES = [25, 50, 75, 90, 100] as const

// Reading Time Milestones (seconds)
export const READING_TIME_MILESTONES = [10, 30, 60, 120, 300] as const

// Default Event Parameters
export const DEFAULT_EVENT_PARAMS = {
  send_to: GA_MEASUREMENT_ID,
  anonymize_ip: true,
} as const

// Page Tracking Configuration
export const PAGE_TRACKING_CONFIG = {
  TRACK_HASH_CHANGES: false,
  TRACK_SEARCH_PARAMS: ['ref', 'utm_source', 'utm_medium', 'utm_campaign'],
  IGNORED_PATHS: ['/api/', '/_next/', '/admin/'],
  DEBOUNCE_DELAY: 500, // milliseconds
} as const

// Error Messages
export const ERROR_MESSAGES = {
  GA_NOT_INITIALIZED: 'Google Analytics is not initialized',
  MISSING_MEASUREMENT_ID: 'GA4 Measurement ID is not configured',
  CONSENT_REQUIRED: 'User consent is required for analytics',
  INVALID_EVENT_NAME: 'Invalid event name provided',
  NETWORK_ERROR: 'Failed to load Google Analytics',
} as const

// Debug Configuration
export const DEBUG_CONFIG = {
  LOG_EVENTS: GA_DEBUG_MODE,
  LOG_PAGE_VIEWS: GA_DEBUG_MODE,
  LOG_ERRORS: !GA_DEBUG_MODE, // Only log errors in production, not in dev
  LOG_CONSENT_CHANGES: !GA_DEBUG_MODE,
  SHOW_DEBUG_PANEL: GA_DEBUG_MODE && GA_ENABLED_IN_DEV,
} as const

// Performance Thresholds
export const PERFORMANCE_THRESHOLDS = {
  LCP_GOOD: 2500, // milliseconds
  LCP_NEEDS_IMPROVEMENT: 4000,
  FID_GOOD: 100,
  FID_NEEDS_IMPROVEMENT: 300,
  CLS_GOOD: 0.1,
  CLS_NEEDS_IMPROVEMENT: 0.25,
  TTFB_GOOD: 800,
  TTFB_NEEDS_IMPROVEMENT: 1800,
} as const

// Content Engagement Thresholds
export const ENGAGEMENT_THRESHOLDS = {
  MIN_READ_TIME: 5, // seconds
  MIN_SCROLL_DEPTH: 10, // percentage
  ENGAGED_TIME: 15, // seconds
  BOUNCE_TIME: 10, // seconds
} as const

// localStorage Keys
export const STORAGE_KEYS = {
  USER_ID: 'ka_user_id',
  SESSION_ID: 'ka_session_id',
  LAST_PAGE_VIEW: 'ka_last_page',
  CONSENT_STATE: 'ka_consent',
  DEBUG_ENABLED: 'ka_debug',
} as const

// Resource Hints
export const RESOURCE_HINTS = [
  { rel: 'preconnect', href: 'https://www.google-analytics.com' },
  { rel: 'dns-prefetch', href: 'https://www.google-analytics.com' },
  { rel: 'preconnect', href: 'https://www.googletagmanager.com' },
  { rel: 'dns-prefetch', href: 'https://www.googletagmanager.com' },
] as const

// Regex Patterns
export const PATTERNS = {
  EMAIL: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
  PHONE: /(\+\d{1,3}[-.\s]?)?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}/g,
  CREDIT_CARD: /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g,
  SSN: /\b\d{3}-\d{2}-\d{4}\b/g,
  IP_ADDRESS: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g,
} as const

// Type Guards
export const isValidEventName = (name: string): name is keyof typeof GA_EVENTS => {
  return Object.values(GA_EVENTS).includes(name as GAEventName)
}

export const isValidCategory = (category: string): category is keyof typeof EVENT_CATEGORIES => {
  return Object.values(EVENT_CATEGORIES).includes(category as EventCategory)
}

// Export types for use in other files
export type GAEventName = typeof GA_EVENTS[keyof typeof GA_EVENTS]
export type EventCategory = typeof EVENT_CATEGORIES[keyof typeof EVENT_CATEGORIES]
export type ScrollMilestone = typeof SCROLL_MILESTONES[number]
export type ReadingMilestone = typeof READING_TIME_MILESTONES[number]