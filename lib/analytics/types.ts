/**
 * Google Analytics 4 Type Definitions
 * 
 * Comprehensive type definitions for GA4 integration with Next.js
 * Follows GA4 Measurement Protocol and gtag.js specifications
 */

// Global type augmentation for window.gtag
declare global {
  interface Window {
    dataLayer: any[]
    gtag: Gtag
  }
}

// Main gtag function type with overloads
export interface Gtag {
  (command: 'js', date: Date): void
  (command: 'config', targetId: string, config?: GtagConfig): void
  (command: 'event', eventName: string, parameters?: GtagEventParams): void
  (command: 'set', config: Record<string, any>): void
  (command: 'set', property: string, value: any): void
  (command: 'consent', action: string, params: ConsentParams): void
}

// GA4 Configuration
export interface GtagConfig {
  page_path?: string
  page_title?: string
  page_location?: string
  send_page_view?: boolean
  anonymize_ip?: boolean
  allow_google_signals?: boolean
  allow_ad_personalization_signals?: boolean
  restricted_data_processing?: boolean
  cookie_domain?: string
  cookie_expires?: number
  cookie_prefix?: string
  cookie_update?: boolean
  cookie_flags?: string
  user_id?: string
  user_properties?: Record<string, any>
  debug_mode?: boolean
  optimize_id?: string
  [key: string]: any
}

// Event Parameters
export interface GtagEventParams {
  event_category?: string
  event_label?: string
  value?: number
  currency?: string
  items?: GtagItem[]
  promotion_id?: string
  promotion_name?: string
  creative_name?: string
  creative_slot?: string
  location_id?: string
  affiliation?: string
  coupon?: string
  discount?: number
  item_brand?: string
  item_category?: string
  item_category2?: string
  item_category3?: string
  item_category4?: string
  item_category5?: string
  item_list_id?: string
  item_list_name?: string
  item_variant?: string
  shipping?: number
  tax?: number
  transaction_id?: string
  [key: string]: any
}

// Item definition for e-commerce events
export interface GtagItem {
  item_id?: string
  item_name?: string
  affiliation?: string
  coupon?: string
  currency?: string
  discount?: number
  index?: number
  item_brand?: string
  item_category?: string
  item_category2?: string
  item_category3?: string
  item_category4?: string
  item_category5?: string
  item_list_id?: string
  item_list_name?: string
  item_variant?: string
  location_id?: string
  price?: number
  quantity?: number
}

// Consent Parameters
export interface ConsentParams {
  ad_storage?: 'granted' | 'denied'
  analytics_storage?: 'granted' | 'denied'
  functionality_storage?: 'granted' | 'denied'
  personalization_storage?: 'granted' | 'denied'
  security_storage?: 'granted' | 'denied'
  wait_for_update?: number
}

// Custom Event Types for the blog
export interface BlogEventParams extends GtagEventParams {
  post_id?: string
  post_title?: string
  post_category?: string
  post_tags?: string[]
  author?: string
  word_count?: number
  reading_time?: number
  scroll_percentage?: number
  search_term?: string
  theme_mode?: 'light' | 'dark'
}

// Analytics Context
export interface AnalyticsContextValue {
  isInitialized: boolean
  hasConsent: boolean
  debugMode: boolean
  measurementId: string | null
  trackEvent: (eventName: string, parameters?: BlogEventParams) => void
  trackPageView: (url?: string, title?: string) => void
  setUserProperty: (property: string, value: any) => void
  setUserId: (userId: string | null) => void
}

// Consent State
export interface ConsentState {
  analytics: boolean
  marketing: boolean
  functional: boolean
  timestamp: number
  version: string
}

// Consent Context
export interface ConsentContextValue {
  consentState: ConsentState
  hasAnalyticsConsent: boolean
  hasMarketingConsent: boolean
  hasFunctionalConsent: boolean
  updateConsent: (type: keyof Omit<ConsentState, 'timestamp' | 'version'>, value: boolean) => void
  acceptAll: () => void
  rejectAll: () => void
  resetConsent: () => void
}

// Event Queue for batching
export interface QueuedEvent {
  name: string
  parameters: BlogEventParams
  timestamp: number
  priority: 'high' | 'normal' | 'low'
}

// Debug Info
export interface DebugInfo {
  eventsTracked: number
  pageViewsTracked: number
  errorsCount: number
  lastError: Error | null
  isOnline: boolean
  consentStatus: ConsentState
}

// Analytics Configuration
export interface AnalyticsConfig {
  measurementId: string
  debug?: boolean
  enabledInDevelopment?: boolean
  anonymizeIp?: boolean
  cookieExpires?: number
  cookiePrefix?: string
  defaultConsent?: ConsentParams
  customDimensions?: Record<string, any>
  customMetrics?: Record<string, any>
}

// Page Metadata for tracking
export interface PageMetadata {
  title: string
  path: string
  category?: string
  tags?: string[]
  author?: string
  publishedAt?: string
  updatedAt?: string
  readingTime?: number
  wordCount?: number
}

// Scroll Tracking State
export interface ScrollState {
  maxScroll: number
  milestones: Set<number>
  startTime: number
  totalTime: number
}

// Error tracking
export interface ErrorInfo {
  message: string
  stack?: string
  type: 'initialization' | 'tracking' | 'consent' | 'network'
  timestamp: number
}