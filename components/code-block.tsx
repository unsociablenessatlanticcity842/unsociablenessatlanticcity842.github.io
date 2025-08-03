"use client"

import { useState, useRef } from "react"
import { Check, Copy, ChevronDown, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CodeBlockProps {
  children: React.ReactNode
  className?: string
  showLineNumbers?: boolean
  collapsible?: boolean
  title?: string
}

export function CodeBlock({ 
  children, 
  className = "", 
  showLineNumbers = true,
  collapsible = false,
  title 
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const codeRef = useRef<HTMLPreElement>(null)

  // Extract language from className
  const languageMatch = className.match(/language-(\w+)/)
  const language = languageMatch ? languageMatch[1] : "plaintext"

  const handleCopy = async () => {
    if (codeRef.current) {
      const code = codeRef.current.textContent || ""
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Calculate line numbers
  const codeString = typeof children === 'string' ? children : ''
  const lines = codeString.split('\n').filter(line => line !== '')
  const lineNumbers = lines.length

  return (
    <div className="group relative my-6 overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-muted/30 to-muted/10 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/50 bg-muted/20 px-4 py-2">
        <div className="flex items-center gap-2">
          {collapsible && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          )}
          
          {/* Language Badge */}
          <div className="flex items-center gap-2">
            
            <span className="text-xs font-medium text-muted-foreground">
              {language}
            </span>
          </div>

          {title && (
            <span className="ml-2 text-sm font-medium text-foreground/80">
              {title}
            </span>
          )}
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

      {/* Code Content */}
      {!isCollapsed && (
        <div className="relative overflow-x-auto">
          <div className="flex">
            {/* Line Numbers */}
            {showLineNumbers && lineNumbers > 0 && (
              <div className="select-none border-r border-border/50 bg-muted/10 px-3 py-5 text-right">
                {Array.from({ length: lineNumbers }, (_, i) => (
                  <div key={i + 1} className="text-xs leading-6 text-muted-foreground">
                    {i + 1}
                  </div>
                ))}
              </div>
            )}

            {/* Code */}
            <pre
              ref={codeRef}
              className={cn(
                "flex-1 overflow-x-auto text-base leading-6",
                className
              )}
            >
              <code className="block px-6 py-5">{children}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}

// Inline code component
export function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="relative rounded bg-muted/50 px-[0.3rem] py-[0.2rem] font-mono text-sm font-medium text-foreground">
      {children}
    </code>
  )
}