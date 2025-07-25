"use client"

import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote"
import { CodeBlock, InlineCode } from "@/components/code-block"
import { ModernCodeBlock, TerminalCodeBlock } from "@/components/code-block-modern"
import { ComponentProps } from "react"

interface MDXContentProps {
  source: MDXRemoteSerializeResult
  codeBlockStyle?: "default" | "modern" | "terminal"
}

// Custom components for MDX rendering
const createComponents = (style: "default" | "modern" | "terminal" = "default") => ({
  pre: ({ children, ...props }: ComponentProps<"pre">) => {
    // Extract props from the code element
    const codeElement = children as React.ReactElement<{className?: string; children?: React.ReactNode}>
    const className = codeElement?.props?.className || ""
    const codeString = codeElement?.props?.children || ""
    
    // Check for terminal/bash code
    const language = className.match(/language-(\w+)/)?.[1]
    const isTerminal = language === "bash" || language === "shell" || language === "terminal"
    
    // Choose appropriate component based on style preference
    if (style === "terminal" && isTerminal) {
      return <TerminalCodeBlock>{codeString}</TerminalCodeBlock>
    } else if (style === "modern") {
      return (
        <ModernCodeBlock className={className} {...props}>
          {codeString}
        </ModernCodeBlock>
      )
    }
    
    return (
      <CodeBlock className={className} {...props}>
        {codeString}
      </CodeBlock>
    )
  },
  code: ({ children, className }: ComponentProps<"code">) => {
    // Check if it's inline code (no className means it's not in a pre tag)
    if (!className) {
      return <InlineCode>{children}</InlineCode>
    }
    // Otherwise, let the pre component handle it
    return <code className={className}>{children}</code>
  },
})

export function MDXContent({ source, codeBlockStyle = "default" }: MDXContentProps) {
  return <MDXRemote {...source} components={createComponents(codeBlockStyle)} />
}