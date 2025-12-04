import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { GlobalSidebar } from '@/components/global-sidebar'
import { SkipToContent } from '@/components/skip-to-content'
import { GoogleAnalyticsWrapper } from '@/components/analytics/google-analytics-wrapper'
import { CookieConsent } from '@/components/analytics/cookie-consent'
import { getCategoriesWithCount, getTagsWithCount } from '@/lib/posts-data'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-sans',
})

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://kaameo.github.io'),
  title: {
    default: 'Kaameo Dev Blog',
    template: '%s | Kaameo Dev Blog',
  },
  description: '개발 여정을 기록하는 블로그',
  keywords: ['개발', '프로그래밍', 'Next.js', 'React', 'TypeScript'],
  authors: [{ name: 'Kaameo' }],
  creator: 'Kaameo',
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://kaameo.github.io',
    siteName: 'Kaameo Dev Blog',
    title: 'Kaameo Dev Blog',
    description: '개발 여정을 기록하는 블로그',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kaameo Dev Blog',
    description: '개발 여정을 기록하는 블로그',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const categories = getCategoriesWithCount()
  const tags = getTagsWithCount()

  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SkipToContent />
          <div className="relative flex min-h-screen flex-col">
            <Header categories={categories} tags={tags} />
            <div className="flex-1 flex">
              {/* Global sidebar - hidden on mobile */}
              <div className="hidden lg:block">
                <GlobalSidebar categories={categories} tags={tags} />
              </div>
              {/* Main content area with left margin on desktop */}
              <main className="flex-1 lg:ml-[250px]" id="main-content">
                {children}
              </main>
            </div>
            <Footer />
          </div>
          <GoogleAnalyticsWrapper />
          <CookieConsent />
        </ThemeProvider>
      </body>
    </html>
  )
}