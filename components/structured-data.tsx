const SITE_URL = 'https://kaameo.github.io'
const SITE_NAME = 'Kaameo Dev Blog'
const DEFAULT_AUTHOR = 'Kaameo'

interface BlogPostingSchema {
  title: string
  description: string
  date: string
  author?: string
  slug: string
  category?: string
  tags?: string[]
}

export function BlogPostingStructuredData({
  title,
  description,
  date,
  author,
  slug,
  category,
  tags,
}: BlogPostingSchema) {
  const postUrl = `${SITE_URL}/posts/${slug}/`
  const authorName = author || DEFAULT_AUTHOR

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: description,
    author: {
      '@type': 'Person',
      name: authorName,
    },
    datePublished: date,
    dateModified: date,
    image: `${SITE_URL}/api/og?title=${encodeURIComponent(title)}`,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl,
    },
    publisher: {
      '@type': 'Person',
      name: DEFAULT_AUTHOR,
      url: SITE_URL,
    },
    ...(category && {
      articleSection: category,
    }),
    ...(tags &&
      tags.length > 0 && {
        keywords: tags.join(', '),
      }),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

export function WebSiteStructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    description: '개발 여정을 기록하는 블로그',
    inLanguage: 'ko',
    publisher: {
      '@type': 'Person',
      name: DEFAULT_AUTHOR,
      url: SITE_URL,
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

interface BreadcrumbItem {
  name: string
  href: string
}

export function BreadcrumbStructuredData({ items }: { items: BreadcrumbItem[] }) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.href}`,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
