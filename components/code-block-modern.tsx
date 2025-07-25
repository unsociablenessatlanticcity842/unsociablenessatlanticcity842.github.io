"use client"

import { useState } from "react"
import { Check, Copy, Terminal, FileCode } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ModernCodeBlockProps {
  children: React.ReactNode
  className?: string
  fileName?: string
  showLineNumbers?: boolean
  theme?: "github" | "dracula" | "monokai"
}

export function ModernCodeBlock({ 
  children, 
  className = "", 
  fileName,
  showLineNumbers = true,
  theme = "github"
}: ModernCodeBlockProps) {
  const [copied, setCopied] = useState(false)

  // Extract language from className
  const languageMatch = className.match(/language-(\w+)/)
  const language = languageMatch ? languageMatch[1] : "code"

  const handleCopy = async () => {
    const code = typeof children === 'string' ? children : ''
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Calculate line numbers
  const codeString = typeof children === 'string' ? children : ''
  const lines = codeString.split('\n')
  const lineCount = lines.length

  // Theme classes
  const themeClasses = {
    github: "bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800",
    dracula: "bg-[#282a36] border-[#44475a]",
    monokai: "bg-[#272822] border-[#3e3d32]"
  }

  return (
    <div className={cn(
      "group relative my-6 overflow-hidden rounded-xl border shadow-sm transition-all hover:shadow-md",
      themeClasses[theme]
    )}>
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-inherit bg-black/5 dark:bg-white/5 px-4 py-2.5">
        <div className="flex items-center gap-3">
          {/* Language Icon */}
          <div className="flex items-center gap-2">
            {language === "terminal" || language === "bash" || language === "shell" ? (
              <Terminal className="h-4 w-4 text-muted-foreground" />
            ) : (
              <FileCode className="h-4 w-4 text-muted-foreground" />
            )}
            
            {/* Language/File Name */}
            <span className="text-sm font-medium text-muted-foreground">
              {fileName || language}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={handleCopy}
          >
            {copied ? (
              <>
                <Check className="mr-1 h-3 w-3 text-green-500" />
                <span className="text-green-500">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="mr-1 h-3 w-3" />
                Copy
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Code Content */}
      <div className="relative">
        <div className="flex">
          {/* Line Numbers */}
          {showLineNumbers && lineCount > 1 && (
            <div className="select-none px-3 py-4 text-right">
              {lines.map((_, i) => (
                <div 
                  key={i} 
                  className="text-xs leading-6 text-muted-foreground/50"
                >
                  {i + 1}
                </div>
              ))}
            </div>
          )}

          {/* Code Content */}
          <pre className={cn(
            "flex-1 overflow-x-auto p-4 text-sm leading-6",
            !showLineNumbers && "px-6",
            className
          )}>
            <code>{children}</code>
          </pre>
        </div>

        {/* Gradient Fade for Long Code */}
        <div className="pointer-events-none absolute bottom-0 left-0 h-8 w-full bg-gradient-to-t from-background/20 to-transparent" />
      </div>
    </div>
  )
}

// Terminal-style code block variant
export function TerminalCodeBlock({ children, title = "Terminal" }: { children: React.ReactNode, title?: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const code = typeof children === 'string' ? children : ''
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="group relative my-6 overflow-hidden rounded-xl bg-black shadow-xl">
      {/* Terminal Header */}
      <div className="flex items-center justify-between bg-gray-800 px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-500" />
            <div className="h-3 w-3 rounded-full bg-yellow-500" />
            <div className="h-3 w-3 rounded-full bg-green-500" />
          </div>
          <span className="ml-2 text-xs text-gray-400">{title}</span>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          className="h-6 px-2 text-xs text-gray-400 hover:text-white"
          onClick={handleCopy}
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
        </Button>
      </div>

      {/* Terminal Content */}
      <pre className="overflow-x-auto p-4 text-sm leading-6 text-green-400">
        <code>{children}</code>
      </pre>
    </div>
  )
}