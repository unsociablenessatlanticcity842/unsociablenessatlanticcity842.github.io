import type { Metadata } from 'next'
import { JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { SkipToContent } from '@/components/skip-to-content'
import { GoogleAnalytics } from '@/components/analytics/analytics'
import { WebVitals } from '@/components/analytics/web-vitals'
import { CommandPaletteWrapper } from '@/components/command-palette-wrapper'

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className={`${jetbrainsMono.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SkipToContent />
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1" id="main-content">
              {children}
            </main>
            <Footer />
          </div>
          <CommandPaletteWrapper />
          <GoogleAnalytics />
          <WebVitals />
        </ThemeProvider>
      </body>
    </html>
  )
}
