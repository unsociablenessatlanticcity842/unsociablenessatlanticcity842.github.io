import { ComponentProps, ReactNode, ReactElement } from "react"
import { CodeBlock, InlineCode } from "@/components/code-block"
import { MermaidCodeBlockWrapper } from "@/components/mermaid-code-block-wrapper"
import { extractTextFromNode } from "@/lib/extract-text-from-node"

// Custom components for MDX rendering
// These are used by compileMDX in RSC context
// Client components with "use client" directive can be used here
export const mdxComponents = {
  pre: ({ children, ...props }: ComponentProps<"pre">) => {
    // Extract props from the code element
    const codeElement = children as ReactElement<{className?: string; children?: ReactNode}>
    const className = codeElement?.props?.className || ""
    const codeString = codeElement?.props?.children || ""

    // Check for mermaid diagrams
    const language = className.match(/language-(\w+)/)?.[1]
    const isMermaid = language === "mermaid"

    // Handle Mermaid diagrams
    if (isMermaid) {
      const content = extractTextFromNode(codeString)
      return <MermaidCodeBlockWrapper>{content}</MermaidCodeBlockWrapper>
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
}
