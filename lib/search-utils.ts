import { Post } from '@/lib/mdx'
import React from 'react'

/**
 * Simple fuzzy search implementation
 * Returns true if all characters in the search term appear in the same order in the text
 */
export function fuzzyMatch(text: string, searchTerm: string): boolean {
  if (!searchTerm) return true
  
  const textLower = text.toLowerCase()
  const searchLower = searchTerm.toLowerCase()
  
  let searchIndex = 0
  for (let i = 0; i < textLower.length && searchIndex < searchLower.length; i++) {
    if (textLower[i] === searchLower[searchIndex]) {
      searchIndex++
    }
  }
  
  return searchIndex === searchLower.length
}

/**
 * Calculate match score for ranking
 * Higher score = better match
 */
export function calculateMatchScore(text: string, searchTerm: string): number {
  if (!searchTerm) return 0
  
  const textLower = text.toLowerCase()
  const searchLower = searchTerm.toLowerCase()
  
  // Exact match
  if (textLower === searchLower) return 100
  
  // Starts with search term
  if (textLower.startsWith(searchLower)) return 90
  
  // Contains exact search term
  if (textLower.includes(searchLower)) return 80
  
  // Fuzzy match - calculate based on character positions
  let score = 0
  let lastMatchIndex = -1
  let searchIndex = 0
  
  for (let i = 0; i < textLower.length && searchIndex < searchLower.length; i++) {
    if (textLower[i] === searchLower[searchIndex]) {
      // Bonus for consecutive matches
      if (lastMatchIndex === i - 1) {
        score += 2
      } else {
        score += 1
      }
      lastMatchIndex = i
      searchIndex++
    }
  }
  
  // Normalize score based on match completion and text length
  if (searchIndex === searchLower.length) {
    return Math.min(70, score * (searchLower.length / textLower.length) * 50)
  }
  
  return 0
}

/**
 * Filter posts by search term and tags
 */
export function filterPosts(
  posts: Post[],
  searchTerm: string,
  selectedTags: string[]
): Post[] {
  return posts
    .filter(post => {
      // Filter by search term
      if (searchTerm && !fuzzyMatch(post.title, searchTerm)) {
        return false
      }
      
      // Filter by tags (AND logic - post must have all selected tags)
      if (selectedTags.length > 0) {
        if (!post.tags) return false
        return selectedTags.every(tag => post.tags!.includes(tag))
      }
      
      return true
    })
    .map(post => ({
      ...post,
      matchScore: searchTerm ? calculateMatchScore(post.title, searchTerm) : 0
    }))
    .sort((a, b) => {
      // Sort by match score if searching
      if (searchTerm) {
        return (b.matchScore || 0) - (a.matchScore || 0)
      }
      // Otherwise sort by date
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
}

/**
 * Highlight matching parts of text
 */
export function highlightText(text: string, searchTerm: string): React.ReactNode {
  if (!searchTerm) return text
  
  const parts: React.ReactNode[] = []
  const textLower = text.toLowerCase()
  const searchLower = searchTerm.toLowerCase()
  
  let lastIndex = 0
  let searchIndex = 0
  
  for (let i = 0; i < text.length && searchIndex < searchLower.length; i++) {
    if (textLower[i] === searchLower[searchIndex]) {
      // Add non-matching part
      if (i > lastIndex) {
        parts.push(text.slice(lastIndex, i))
      }
      // Add matching character with highlight
      parts.push(
        React.createElement(
          'mark',
          { 
            key: i, 
            className: "bg-yellow-200 dark:bg-yellow-900 px-0.5 rounded" 
          },
          text[i]
        )
      )
      lastIndex = i + 1
      searchIndex++
    }
  }
  
  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }
  
  return parts
}