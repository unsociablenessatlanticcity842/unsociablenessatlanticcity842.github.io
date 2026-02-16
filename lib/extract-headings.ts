import GithubSlugger from 'github-slugger'

/**
 * Represents a heading extracted from Markdown/MDX content
 */
export interface Heading {
  /** Unique identifier for the heading (used for anchor links) */
  id: string
  /** The text content of the heading */
  text: string
  /** The heading level (1-6, corresponding to h1-h6) */
  level: number
}

/**
 * Extracts headings from Markdown/MDX content while excluding code blocks
 *
 * @param content - The raw Markdown/MDX content to parse
 * @returns An array of Heading objects representing the document structure
 *
 * @example
 * const content = '# Title\n## Subtitle\n```js\n# Not a heading\n```'
 * const headings = extractHeadings(content)
 * // Returns: [{ id: 'title', text: 'Title', level: 1 }, { id: 'subtitle', text: 'Subtitle', level: 2 }]
 */
export function extractHeadings(content: string): Heading[] {
  // Guard against null/undefined input
  if (!content) {
    return []
  }

  // Step 1: Remove all code blocks from content to prevent false heading detection
  // This regex matches fenced code blocks with optional language identifier
  // Handles: ```lang, ```, and multiline content within blocks
  const codeBlockRegex = /```[\w]*.*?\n[\s\S]*?```/gm

  // Also handle quadruple backticks for nested code examples (MDX edge case)
  const quadrupleBacktickRegex = /````[\w]*.*?\n[\s\S]*?````/gm

  // Replace code blocks with empty lines to preserve line numbers
  let contentWithoutCodeBlocks = content

  // First remove quadruple backtick blocks (if any)
  contentWithoutCodeBlocks = contentWithoutCodeBlocks.replace(quadrupleBacktickRegex, (match) => {
    return match
      .split('\n')
      .map(() => '')
      .join('\n')
  })

  // Then remove triple backtick blocks
  contentWithoutCodeBlocks = contentWithoutCodeBlocks.replace(codeBlockRegex, (match) => {
    return match
      .split('\n')
      .map(() => '')
      .join('\n')
  })

  // Step 2: Extract headings from cleaned content
  const headings: Heading[] = []
  const headingRegex = /^(#{1,6})\s+(.+)$/gm
  const slugger = new GithubSlugger()
  let match

  while ((match = headingRegex.exec(contentWithoutCodeBlocks)) !== null) {
    const level = match[1].length
    const text = match[2].trim()

    const id = slugger.slug(text)

    // Skip empty IDs (edge case: heading with only special characters)
    if (!id) continue

    headings.push({ id, text, level })
  }

  return headings
}

