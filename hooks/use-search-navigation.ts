import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function useSearchNavigation() {
  const router = useRouter()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Slash key to navigate to posts page with search focus (when not typing in an input)
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault()
        // Add query parameter to trigger search focus
        router.push('/posts?search=true')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [router])
}