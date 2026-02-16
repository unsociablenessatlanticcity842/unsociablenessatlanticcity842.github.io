import { useEffect } from 'react'

interface UseSearchKeyboardShortcutsProps {
  onSearchFocus?: () => void
  onClearFilters?: () => void
  searchInputRef?: React.RefObject<HTMLInputElement | null>
}

export function useSearchKeyboardShortcuts({
  onSearchFocus,
  onClearFilters,
  searchInputRef,
}: UseSearchKeyboardShortcutsProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Slash key to focus search (when not typing in an input)
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault()
        if (searchInputRef?.current) {
          searchInputRef.current.focus()
          searchInputRef.current.select()
        }
        onSearchFocus?.()
      }

      // Escape to clear filters when search is focused
      if (e.key === 'Escape' && document.activeElement === searchInputRef?.current) {
        e.preventDefault()
        onClearFilters?.()
        searchInputRef.current?.blur()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onSearchFocus, onClearFilters, searchInputRef])
}
