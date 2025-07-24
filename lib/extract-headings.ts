export interface Heading {
  id: string
  text: string
  level: number
}

export function extractHeadings(content: string): Heading[] {
  const headings: Heading[] = []
  const headingRegex = /^(#{1,6})\s+(.+)$/gm
  let match

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length
    const text = match[2].trim()
    const id = text
      .toLowerCase()
      .replace(/[^\w\s가-힣]/gi, '') // Keep Korean characters
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')

    headings.push({ id, text, level })
  }

  return headings
}