/**
 * Google Analytics 4 Consent Management
 * 
 * Handles user consent for analytics and cookies
 */

import { 
  COOKIE_CONFIG, 
  CONSENT_CONFIG, 
  STORAGE_KEYS,
  DEBUG_CONFIG,
} from './constants'
import { updateConsent as updateGtagConsent } from './gtag'
import { safeJsonParse } from './utils'
import type { ConsentState, ConsentParams } from './types'

// Consent state cache
let consentStateCache: ConsentState | null = null

/**
 * Get default consent state
 */
function getDefaultConsentState(): ConsentState {
  return {
    analytics: false,
    marketing: false,
    functional: false,
    timestamp: Date.now(),
    version: CONSENT_CONFIG.VERSION,
  }
}

/**
 * Load consent state from localStorage
 */
export function loadConsentState(): ConsentState {
  if (typeof window === 'undefined') {
    return getDefaultConsentState()
  }
  
  // Return cached state if available
  if (consentStateCache) {
    return consentStateCache
  }
  
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CONSENT_STATE)
    
    if (!stored) {
      return getDefaultConsentState()
    }
    
    const parsed = safeJsonParse<ConsentState>(stored, getDefaultConsentState())
    
    // Check if consent version matches
    if (parsed.version !== CONSENT_CONFIG.VERSION) {
      if (DEBUG_CONFIG.LOG_CONSENT_CHANGES) {
        console.log('[GA4 Consent] Version mismatch, resetting consent')
      }
      return getDefaultConsentState()
    }
    
    // Check if consent is expired (1 year)
    const expiryTime = parsed.timestamp + (COOKIE_CONFIG.CONSENT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000)
    if (Date.now() > expiryTime) {
      if (DEBUG_CONFIG.LOG_CONSENT_CHANGES) {
        console.log('[GA4 Consent] Consent expired, resetting')
      }
      return getDefaultConsentState()
    }
    
    consentStateCache = parsed
    return parsed
  } catch (error) {
    console.error('[GA4 Consent] Error loading consent state:', error)
    return getDefaultConsentState()
  }
}

/**
 * Save consent state to localStorage
 */
export function saveConsentState(state: ConsentState) {
  if (typeof window === 'undefined') return
  
  try {
    consentStateCache = state
    localStorage.setItem(STORAGE_KEYS.CONSENT_STATE, JSON.stringify(state))
    
    if (DEBUG_CONFIG.LOG_CONSENT_CHANGES) {
      console.log('[GA4 Consent] Consent state saved:', state)
    }
  } catch (error) {
    console.error('[GA4 Consent] Error saving consent state:', error)
  }
}

/**
 * Update consent for a specific type
 */
export function updateConsent(
  type: keyof Omit<ConsentState, 'timestamp' | 'version'>,
  value: boolean
) {
  const currentState = loadConsentState()
  
  const newState: ConsentState = {
    ...currentState,
    [type]: value,
    timestamp: Date.now(),
    version: CONSENT_CONFIG.VERSION,
  }
  
  saveConsentState(newState)
  
  // Update gtag consent
  syncGtagConsent(newState)
  
  // Dispatch custom event
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('consentUpdate', {
      detail: { type, value, state: newState }
    }))
  }
}

/**
 * Accept all consent
 */
export function acceptAllConsent() {
  const newState: ConsentState = {
    analytics: true,
    marketing: true,
    functional: true,
    timestamp: Date.now(),
    version: CONSENT_CONFIG.VERSION,
  }
  
  saveConsentState(newState)
  syncGtagConsent(newState)
  
  if (DEBUG_CONFIG.LOG_CONSENT_CHANGES) {
    console.log('[GA4 Consent] All consent accepted')
  }
  
  // Dispatch event
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('consentUpdate', {
      detail: { type: 'all', value: true, state: newState }
    }))
  }
}

/**
 * Reject all consent
 */
export function rejectAllConsent() {
  const newState: ConsentState = {
    analytics: false,
    marketing: false,
    functional: false,
    timestamp: Date.now(),
    version: CONSENT_CONFIG.VERSION,
  }
  
  saveConsentState(newState)
  syncGtagConsent(newState)
  
  if (DEBUG_CONFIG.LOG_CONSENT_CHANGES) {
    console.log('[GA4 Consent] All consent rejected')
  }
  
  // Dispatch event
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('consentUpdate', {
      detail: { type: 'all', value: false, state: newState }
    }))
  }
}

/**
 * Reset consent (clear stored state)
 */
export function resetConsent() {
  if (typeof window === 'undefined') return
  
  try {
    consentStateCache = null
    localStorage.removeItem(STORAGE_KEYS.CONSENT_STATE)
    
    // Set default gtag consent
    const defaultState = getDefaultConsentState()
    syncGtagConsent(defaultState)
    
    if (DEBUG_CONFIG.LOG_CONSENT_CHANGES) {
      console.log('[GA4 Consent] Consent reset')
    }
    
    // Dispatch event
    window.dispatchEvent(new CustomEvent('consentUpdate', {
      detail: { type: 'reset', value: null, state: defaultState }
    }))
  } catch (error) {
    console.error('[GA4 Consent] Error resetting consent:', error)
  }
}

/**
 * Sync consent state with gtag
 */
function syncGtagConsent(state: ConsentState) {
  const consentParams: ConsentParams = {
    analytics_storage: state.analytics ? 'granted' : 'denied',
    functionality_storage: state.functional ? 'granted' : 'denied',
    personalization_storage: state.functional ? 'granted' : 'denied',
    ad_storage: state.marketing ? 'granted' : 'denied',
    security_storage: 'granted', // Always granted for security
  }
  
  updateGtagConsent(consentParams)
}

/**
 * Check if analytics consent is given
 */
export function hasAnalyticsConsent(): boolean {
  const state = loadConsentState()
  return state.analytics === true
}

/**
 * Check if marketing consent is given
 */
export function hasMarketingConsent(): boolean {
  const state = loadConsentState()
  return state.marketing === true
}

/**
 * Check if functional consent is given
 */
export function hasFunctionalConsent(): boolean {
  const state = loadConsentState()
  return state.functional === true
}

/**
 * Check if any consent has been given
 */
export function hasAnyConsent(): boolean {
  const state = loadConsentState()
  return state.analytics || state.marketing || state.functional
}

/**
 * Check if consent banner should be shown
 */
export function shouldShowConsentBanner(): boolean {
  if (typeof window === 'undefined') return false
  
  const state = loadConsentState()
  
  // Show banner if no timestamp (never consented)
  if (!state.timestamp || state.timestamp === getDefaultConsentState().timestamp) {
    return true
  }
  
  // Show banner if version changed
  if (state.version !== CONSENT_CONFIG.VERSION) {
    return true
  }
  
  // Show banner if expired
  const expiryTime = state.timestamp + (COOKIE_CONFIG.CONSENT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000)
  if (Date.now() > expiryTime) {
    return true
  }
  
  return false
}

/**
 * Get consent state for display
 */
export function getConsentDisplay() {
  const state = loadConsentState()
  
  return {
    essential: true, // Always true
    analytics: state.analytics,
    functional: state.functional,
    marketing: state.marketing,
    lastUpdated: state.timestamp ? new Date(state.timestamp).toLocaleDateString() : null,
    version: state.version,
  }
}

/**
 * Initialize consent system
 */
export function initializeConsent() {
  if (typeof window === 'undefined') return
  
  // Load current state
  const state = loadConsentState()
  
  // Set initial gtag consent
  syncGtagConsent(state)
  
  if (DEBUG_CONFIG.LOG_CONSENT_CHANGES) {
    console.log('[GA4 Consent] Consent initialized:', state)
  }
}

/**
 * Get consent required message for different regions
 */
export function getConsentMessage(locale: string = 'ko'): {
  title: string
  description: string
  acceptAll: string
  rejectAll: string
  customize: string
  save: string
  privacyPolicy: string
} {
  const messages = {
    ko: {
      title: '쿠키 사용 동의',
      description: '더 나은 서비스 제공을 위해 쿠키를 사용합니다. 쿠키는 사이트 사용 분석과 개인화된 경험 제공에 활용됩니다.',
      acceptAll: '모두 수락',
      rejectAll: '모두 거부',
      customize: '맞춤 설정',
      save: '저장',
      privacyPolicy: '개인정보 처리방침',
    },
    en: {
      title: 'Cookie Consent',
      description: 'We use cookies to improve your experience. Cookies help us analyze site usage and provide personalized experiences.',
      acceptAll: 'Accept All',
      rejectAll: 'Reject All',
      customize: 'Customize',
      save: 'Save',
      privacyPolicy: 'Privacy Policy',
    },
  }
  
  return messages[locale as keyof typeof messages] || messages.en
}

/**
 * Get consent type descriptions
 */
export function getConsentTypeDescriptions(locale: string = 'ko') {
  const descriptions = {
    ko: {
      essential: {
        name: '필수 쿠키',
        description: '웹사이트 기본 기능 작동에 필요한 쿠키입니다. 이 쿠키는 비활성화할 수 없습니다.',
      },
      analytics: {
        name: '분석 쿠키',
        description: '방문자가 웹사이트를 어떻게 사용하는지 이해하는 데 도움이 되는 쿠키입니다.',
      },
      functional: {
        name: '기능성 쿠키',
        description: '테마 설정 등 개인화된 기능을 제공하는 쿠키입니다.',
      },
      marketing: {
        name: '마케팅 쿠키',
        description: '관련성 있는 광고를 표시하기 위한 쿠키입니다. (현재 사용하지 않음)',
      },
    },
    en: {
      essential: {
        name: 'Essential Cookies',
        description: 'Required for the website to function properly. These cookies cannot be disabled.',
      },
      analytics: {
        name: 'Analytics Cookies',
        description: 'Help us understand how visitors interact with our website.',
      },
      functional: {
        name: 'Functional Cookies',
        description: 'Enable personalized features like theme preferences.',
      },
      marketing: {
        name: 'Marketing Cookies',
        description: 'Used to deliver relevant advertisements. (Currently not used)',
      },
    },
  }
  
  return descriptions[locale as keyof typeof descriptions] || descriptions.en
}