export function tagToSlug(tag: string): string {
  if (!tag) return ''
  return tag
    .toLowerCase()
    .replace(/[^\w\s가-힣-]/g, '-') // Replace special characters with hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
}

export function slugToTag(slug: string, tags: string[]): string | undefined {
  // Try exact match first
  const exactMatch = tags.find((tag) => tagToSlug(tag) === slug)
  if (exactMatch) return exactMatch

  // Try case-insensitive match
  return tags.find((tag) => tagToSlug(tag).toLowerCase() === slug.toLowerCase())
}
