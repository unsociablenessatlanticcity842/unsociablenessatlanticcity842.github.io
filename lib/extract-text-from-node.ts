import { ReactNode, isValidElement, ReactElement } from 'react'

/**
 * Recursively extract text content from React nodes
 * This handles various types of React nodes including strings, numbers,
 * elements, fragments, and arrays
 */
export function extractTextFromNode(node: ReactNode): string {
  // Handle null/undefined
  if (node == null) {
    return ''
  }

  // Handle string and number types
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node)
  }

  // Handle boolean (React renders true/false as empty)
  if (typeof node === 'boolean') {
    return ''
  }

  // Handle arrays of nodes
  if (Array.isArray(node)) {
    return node.map(extractTextFromNode).join('')
  }

  // Handle React elements
  if (isValidElement(node)) {
    const element = node as ReactElement<{ children?: ReactNode }>
    // If the element has children, extract text from them
    if (element.props && element.props.children) {
      return extractTextFromNode(element.props.children)
    }
    return ''
  }

  // Handle objects (might be React Fragments or other objects)
  if (typeof node === 'object' && node !== null) {
    // Check if it's a React Fragment
    const obj = node as { props?: { children?: ReactNode } }
    if (obj.props && obj.props.children) {
      return extractTextFromNode(obj.props.children)
    }
  }

  // Fallback for any other types
  return ''
}
