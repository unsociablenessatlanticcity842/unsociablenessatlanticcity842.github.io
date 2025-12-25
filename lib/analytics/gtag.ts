/**
 * Google Analytics 4 gtag Helper Functions
 * 
 * Core functions for interacting with the gtag.js library
 */

import { 
  GA_MEASUREMENT_ID, 
  GA_DEBUG_MODE, 
  DEFAULT_EVENT_PARAMS,
  ERROR_MESSAGES,
  DEBUG_CONFIG,
} from './constants'
import { 
  sanitizeUrl, 
  sanitizeObject, 
  isBot, 
  isDoNotTrackEnabled,
  formatEventParams,
} from './utils'
import type { 
  Gtag, 
  GtagConfig, 
  BlogEventParams, 
  ConsentParams,
  ErrorInfo,
} from './types'

// Error tracking
let errorCount = 0
const errors: ErrorInfo[] = []

/**
 * Log to console in debug mode
 */
function debugLog(action: string, data?: any) {
  if (!DEBUG_CONFIG.LOG_EVENTS) return
  
  const timestamp = new Date().toISOString()
  console.log(`[GA4 ${timestamp}] ${action}`, data ? data : '')
}

/**
 * Track errors internally
 */
function trackError(error: Error, type: ErrorInfo['type']) {
  errorCount++
  
  const errorInfo: ErrorInfo = {
    message: error.message,
    stack: error.stack,
    type,
    timestamp: Date.now(),
  }
  
  errors.push(errorInfo)
  
  // Keep only last 10 errors
  if (errors.length > 10) {
    errors.shift()
  }
  
  if (DEBUG_CONFIG.LOG_ERRORS) {
    console.error('[GA4 Error]', errorInfo)
  }
}

/**
 * Check if gtag is available
 */
export function isGtagAvailable(): boolean {
  return typeof window !== 'undefined' && typeof window.gtag === 'function'
}

/**
 * Initialize the dataLayer
 */
export function initializeDataLayer() {
  if (typeof window === 'undefined') return
  
  window.dataLayer = window.dataLayer || []
  
  // Define gtag function if not already defined
  if (!window.gtag) {
    window.gtag = function(...args) {
      window.dataLayer.push(args)
    } as Gtag
  }
  
  debugLog('DataLayer initialized')
}

/**
 * Initialize GA4 with configuration
 */
export function initializeGA4(config?: Partial<GtagConfig>) {
  try {
    if (!isGtagAvailable()) {
      throw new Error(ERROR_MESSAGES.GA_NOT_INITIALIZED)
    }
    
    if (!GA_MEASUREMENT_ID) {
      throw new Error(ERROR_MESSAGES.MISSING_MEASUREMENT_ID)
    }
    
    // Initialize with timestamp
    window.gtag('js', new Date())
    
    // Configure GA4 with default and custom settings
    const finalConfig: GtagConfig = {
      page_path: window.location.pathname,
      debug_mode: GA_DEBUG_MODE,
      anonymize_ip: true,
      cookie_flags: 'SameSite=Lax;Secure',
      allow_google_signals: false, // Disable for privacy
      allow_ad_personalization_signals: false, // Disable for privacy
      ...config,
    }
    
    window.gtag('config', GA_MEASUREMENT_ID, finalConfig)
    
    debugLog('GA4 initialized', { measurementId: GA_MEASUREMENT_ID, config: finalConfig })
  } catch (error) {
    trackError(error as Error, 'initialization')
  }
}

/**
 * Update consent state
 */
export function updateConsent(consentParams: ConsentParams) {
  try {
    if (!isGtagAvailable()) {
      // Silently skip if gtag is not ready yet
      // This can happen during initialization before GA script loads
      debugLog('Skipping consent update - gtag not ready', consentParams)
      return
    }

    window.gtag('consent', 'update', consentParams)

    debugLog('Consent updated', consentParams)
  } catch (error) {
    trackError(error as Error, 'consent')
  }
}

/**
 * Track a page view
 */
export function trackPageView(url?: string, title?: string) {
  try {
    // Skip if bot or DNT enabled
    if (isBot() || isDoNotTrackEnabled()) {
      debugLog('Skipping page view - bot or DNT detected')
      return
    }

    if (!isGtagAvailable()) {
      // Silently skip if gtag is not ready yet
      // This can happen during route changes before GA script loads
      debugLog('Skipping page view - gtag not ready')
      return
    }

    const pageUrl = url || window.location.pathname + window.location.search
    const pageTitle = title || document.title

    const params: GtagConfig = {
      page_path: sanitizeUrl(pageUrl),
      page_title: pageTitle,
      page_location: sanitizeUrl(window.location.href),
      ...DEFAULT_EVENT_PARAMS,
    }

    window.gtag('event', 'page_view', params)

    if (DEBUG_CONFIG.LOG_PAGE_VIEWS) {
      debugLog('Page view tracked', params)
    }
  } catch (error) {
    trackError(error as Error, 'tracking')
  }
}

/**
 * Track a custom event
 */
export function trackEvent(eventName: string, parameters?: BlogEventParams) {
  try {
    // Skip if bot or DNT enabled
    if (isBot() || isDoNotTrackEnabled()) {
      debugLog('Skipping event - bot or DNT detected')
      return
    }

    if (!isGtagAvailable()) {
      // Silently skip if gtag is not ready yet
      debugLog('Skipping event - gtag not ready')
      return
    }

    if (!eventName) {
      throw new Error(ERROR_MESSAGES.INVALID_EVENT_NAME)
    }

    // Format and sanitize parameters
    const sanitizedParams = parameters
      ? sanitizeObject(formatEventParams(parameters))
      : {}

    // Add default parameters
    const finalParams = {
      ...DEFAULT_EVENT_PARAMS,
      ...sanitizedParams,
    }

    window.gtag('event', eventName, finalParams)

    debugLog(`Event tracked: ${eventName}`, finalParams)
  } catch (error) {
    trackError(error as Error, 'tracking')
  }
}

/**
 * Set user properties
 */
export function setUserProperties(properties: Record<string, any>) {
  try {
    if (!isGtagAvailable()) {
      debugLog('Skipping user properties - gtag not ready')
      return
    }

    const sanitizedProperties = sanitizeObject(properties)

    window.gtag('set', 'user_properties', sanitizedProperties)

    debugLog('User properties set', sanitizedProperties)
  } catch (error) {
    trackError(error as Error, 'tracking')
  }
}

/**
 * Set user ID (for logged-in users)
 */
export function setUserId(userId: string | null) {
  try {
    if (!isGtagAvailable()) {
      debugLog('Skipping user ID - gtag not ready')
      return
    }

    if (userId) {
      window.gtag('set', { user_id: userId })
      debugLog('User ID set', { userId })
    } else {
      // Clear user ID
      window.gtag('set', { user_id: null })
      debugLog('User ID cleared')
    }
  } catch (error) {
    trackError(error as Error, 'tracking')
  }
}

/**
 * Track timing events (performance)
 */
export function trackTiming(
  name: string,
  value: number,
  category?: string,
  label?: string
) {
  try {
    if (!isGtagAvailable()) {
      debugLog('Skipping timing - gtag not ready')
      return
    }

    const params = {
      name,
      value: Math.round(value), // GA4 expects integer milliseconds
      event_category: category || 'Performance',
      event_label: label,
      ...DEFAULT_EVENT_PARAMS,
    }

    window.gtag('event', 'timing_complete', params)

    debugLog('Timing tracked', params)
  } catch (error) {
    trackError(error as Error, 'tracking')
  }
}

/**
 * Track exceptions (errors)
 */
export function trackException(description: string, fatal: boolean = false) {
  try {
    if (!isGtagAvailable()) {
      debugLog('Skipping exception - gtag not ready')
      return
    }

    const params = {
      description: sanitizeObject({ description }).description || description,
      fatal,
      ...DEFAULT_EVENT_PARAMS,
    }

    window.gtag('event', 'exception', params)

    debugLog('Exception tracked', params)
  } catch (error) {
    trackError(error as Error, 'tracking')
  }
}

/**
 * Get debug information
 */
export function getDebugInfo() {
  return {
    isInitialized: isGtagAvailable(),
    measurementId: GA_MEASUREMENT_ID,
    debugMode: GA_DEBUG_MODE,
    errorCount,
    errors: [...errors],
    isBot: isBot(),
    isDoNotTrack: isDoNotTrackEnabled(),
  }
}

/**
 * Clear all errors (for testing)
 */
export function clearErrors() {
  errorCount = 0
  errors.length = 0
}

