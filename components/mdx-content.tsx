import { ReactElement } from "react"

interface MDXContentProps {
  source: ReactElement
}

export function MDXContent({ source }: MDXContentProps) {
  return <>{source}</>
}