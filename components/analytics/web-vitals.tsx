'use client'

import { useReportWebVitals } from 'next/web-vitals'
import { trackWebVitals } from '@/lib/analytics/events'

export function WebVitals() {
  useReportWebVitals((metric) => {
    trackWebVitals(metric)
  })
  return null
}
