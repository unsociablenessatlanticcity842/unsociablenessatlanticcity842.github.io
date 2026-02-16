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
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: description,
    ...(author && {
      author: {
        '@type': 'Person',
        name: author,
      },
    }),
    datePublished: date,
    dateModified: date,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://kaameo.github.io/posts/${slug}/`,
    },
    publisher: {
      '@type': 'Person',
      name: 'Kaameo',
      url: 'https://kaameo.github.io',
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
