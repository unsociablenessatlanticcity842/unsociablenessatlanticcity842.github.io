'use client'

import { useEffect, useState } from 'react'
import { Check, Copy, Eye, Code } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface MermaidCodeBlockProps {
  children: string
  className?: string
}

let mermaidAPI: typeof import('mermaid').default | null = null
let mermaidInitialized = false

export function MermaidCodeBlock({ children }: MermaidCodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [svgCode, setSvgCode] = useState<string>('')

  useEffect(() => {
    if (!children || typeof children !== 'string') {
      setError('Invalid diagram content')
      setIsLoading(false)
      return
    }

    let isCancelled = false

    const renderDiagram = async () => {
      try {
        // Import mermaid dynamically
        if (!mermaidAPI) {
          const mermaidModule = await import('mermaid')
          mermaidAPI = mermaidModule.default
        }

        if (isCancelled) return

        // Initialize mermaid only once
        if (!mermaidInitialized) {
          mermaidAPI.initialize({
            startOnLoad: false,
            theme: document.documentElement.classList.contains('dark') ? 'dark' : 'default',
            securityLevel: 'loose',
            themeVariables: {
              darkMode: document.documentElement.classList.contains('dark'),
            },
          })
          mermaidInitialized = true
        }

        // Generate unique ID
        const id = `mermaid-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`

        try {
          // Parse and render the diagram
          const { svg } = await mermaidAPI.render(id, children.trim())

          if (!isCancelled) {
            setSvgCode(svg)
            setError(null)
          }
        } catch (renderError) {
          // Mermaid might throw errors for invalid syntax
          if (!isCancelled) {
            // Clean up any DOM elements mermaid might have created
            const element = document.getElementById(id)
            if (element) {
              element.remove()
            }

            setError(
              renderError instanceof Error ? renderError.message : 'Failed to render diagram',
            )
          }
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load Mermaid')
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false)
        }
      }
    }

    // Start rendering
    setIsLoading(true)
    setError(null)
    renderDiagram()

    // Cleanup function
    return () => {
      isCancelled = true
    }
  }, [children])

  // Re-render when theme changes
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'class' &&
          mutation.target === document.documentElement
        ) {
          // Reset initialization flag to reinitialize with new theme
          mermaidInitialized = false
          // Force re-render by updating state
          setSvgCode('')
          setIsLoading(true)
        }
      })
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    return () => observer.disconnect()
  }, [])

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="group relative my-6 overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-muted/30 to-muted/10 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/50 bg-muted/20 px-4 py-2">
        <div className="flex items-center gap-3">
          {/* Language Badge */}
          <span className="text-xs font-medium text-muted-foreground">mermaid</span>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 rounded-md bg-muted/50 p-0.5">
            <Button
              variant={viewMode === 'preview' ? 'secondary' : 'ghost'}
              size="sm"
              className={cn('h-6 px-2 text-xs', viewMode === 'preview' && 'shadow-sm')}
              onClick={() => setViewMode('preview')}
            >
              <Eye className="mr-1 h-3 w-3" />
              미리보기
            </Button>
            <Button
              variant={viewMode === 'code' ? 'secondary' : 'ghost'}
              size="sm"
              className={cn('h-6 px-2 text-xs', viewMode === 'code' && 'shadow-sm')}
              onClick={() => setViewMode('code')}
            >
              <Code className="mr-1 h-3 w-3" />
              코드
            </Button>
          </div>
        </div>

        {/* Copy Button */}
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-xs opacity-0 transition-opacity group-hover:opacity-100"
          onClick={handleCopy}
        >
          {copied ? (
            <>
              <Check className="mr-1 h-3 w-3" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="mr-1 h-3 w-3" />
              Copy
            </>
          )}
        </Button>
      </div>

      {/* Content */}
      <div className="relative">
        {viewMode === 'preview' ? (
          <div className="p-6">
            {error ? (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-800 dark:bg-red-950/20 dark:text-red-400">
                <p className="font-semibold">렌더링 오류:</p>
                <p className="mt-1 text-sm">{error}</p>
              </div>
            ) : isLoading ? (
              <div className="flex items-center justify-center py-8">
                <span className="text-muted-foreground">다이어그램 로딩 중...</span>
              </div>
            ) : (
              <div
                className="mermaid-container flex justify-center overflow-x-auto"
                dangerouslySetInnerHTML={{ __html: svgCode }}
              />
            )}
          </div>
        ) : (
          <div className="relative overflow-x-auto">
            <pre className="text-sm leading-6">
              <code className="block px-6 py-5">{children}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}
