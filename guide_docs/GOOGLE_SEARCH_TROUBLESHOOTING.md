# Google Search 인덱싱 트러블슈팅 가이드

이 문서는 Google Search에서 블로그가 인덱싱되지 않는 문제를 해결한 과정과 향후 유사한 문제 발생 시 대응 방법을 설명합니다.

---

## 📋 목차

1. [문제 상황](#문제-상황)
2. [원인 분석](#원인-분석)
3. [해결 방법](#해결-방법)
4. [검증 방법](#검증-방법)
5. [예방 조치](#예방-조치)
6. [일반적인 SEO 문제 해결](#일반적인-seo-문제-해결)

---

## 🚨 문제 상황

### 증상
- Google Search에서 `site:kaameo.github.io` 검색 시 페이지가 나타나지 않음
- Google Search Console에 sitemap을 제출했으나 페이지가 색인되지 않음
- robots.txt는 정상적으로 설정되어 있음

### 발견 시기
2025년 11월 12일

---

## 🔍 원인 분석

### 주요 원인: Canonical URL 설정 오류

**문제점**:
모든 페이지가 동일한 canonical URL(`/`)을 가리키고 있었음

```typescript
// app/layout.tsx (문제가 있던 코드)
export const metadata: Metadata = {
  // ...
  alternates: {
    canonical: '/',  // ❌ 모든 페이지에 적용됨
  },
}
```

**영향**:
- 모든 포스트 페이지: `<link rel="canonical" href="https://kaameo.github.io/">`
- Google이 모든 페이지를 홈페이지의 중복으로 인식
- 검색 엔진이 홈페이지만 색인하고 나머지 페이지는 무시

### 부차적 문제

1. **Structured Data 부재**
   - Schema.org JSON-LD 마크업이 없어 검색 결과에서 리치 스니펫 표시 불가
   - 검색 엔진이 페이지 내용을 충분히 이해하기 어려움

2. **Sitemap 날짜 오류**
   - 일부 포스트의 `lastmod` 날짜가 미래 날짜(2025년)로 표시
   - 신뢰도 저하 가능성

---

## ✅ 해결 방법

### 1. Canonical URL 수정 (Critical)

#### 1-1. 전역 Canonical URL 제거

**파일**: `app/layout.tsx`

```typescript
export const metadata: Metadata = {
  metadataBase: new URL('https://kaameo.github.io'),
  title: {
    default: 'Kaameo Dev Blog',
    template: '%s | Kaameo Dev Blog',
  },
  // ... 기타 메타데이터
  robots: {
    index: true,
    follow: true,
    // ...
  },
  // ❌ 제거: alternates: { canonical: '/' }
}
```

#### 1-2. 페이지별 Canonical URL 추가

**홈페이지** (`app/page.tsx`):
```typescript
import type { Metadata } from 'next'

export const metadata: Metadata = {
  alternates: {
    canonical: '/',
  },
}
```

**포스트 페이지** (`app/posts/[slug]/page.tsx`):
```typescript
export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const post = await getPostBySlug(params.slug)

  if (!post) {
    return {}
  }

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `/posts/${params.slug}/`,  // ✅ 페이지별 고유 canonical
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      url: `https://kaameo.github.io/posts/${params.slug}/`,  // ✅ OG URL도 추가
    },
    // ...
  }
}
```

**카테고리 페이지** (`app/categories/[category]/page.tsx`):
```typescript
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const categoryName = getCategoryFromSlug(params.category)

  return {
    title: `${categoryName} 카테고리`,
    description: `${categoryName} 카테고리의 포스트 목록`,
    alternates: {
      canonical: `/categories/${params.category}/`,
    },
  }
}
```

**태그 페이지** (`app/tags/[tag]/page.tsx`):
```typescript
export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const allTags = getAllTags()
  const actualTag = slugToTag(params.tag, allTags)

  if (!actualTag) {
    return {}
  }

  return {
    title: `${actualTag} 태그`,
    description: `${actualTag} 태그가 포함된 포스트 목록`,
    alternates: {
      canonical: `/tags/${params.tag}/`,
    },
  }
}
```

### 2. Structured Data 추가 (Important)

#### 2-1. Structured Data 컴포넌트 생성

**파일**: `components/structured-data.tsx`

```typescript
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
  tags
}: BlogPostingSchema) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": title,
    "description": description,
    ...(author && {
      "author": {
        "@type": "Person",
        "name": author
      }
    }),
    "datePublished": date,
    "dateModified": date,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://kaameo.github.io/posts/${slug}/`
    },
    "publisher": {
      "@type": "Person",
      "name": "Kaameo",
      "url": "https://kaameo.github.io"
    },
    ...(category && {
      "articleSection": category
    }),
    ...(tags && tags.length > 0 && {
      "keywords": tags.join(", ")
    })
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
```

#### 2-2. 포스트 페이지에 적용

**파일**: `app/posts/[slug]/page.tsx`

```typescript
import { BlogPostingStructuredData } from "@/components/structured-data"

export default async function PostPage({ params }: PostPageProps) {
  const post = await getPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <BlogLayout headings={post.headings}>
      {/* ✅ Structured Data 추가 */}
      <BlogPostingStructuredData
        title={post.title}
        description={post.description}
        date={post.date}
        author={post.author}
        slug={post.slug}
        category={post.category}
        tags={post.tags}
      />

      {/* 기존 컨텐츠 */}
      <article className="py-10">
        {/* ... */}
      </article>
    </BlogLayout>
  )
}
```

### 3. Sitemap 날짜 수정 (Maintenance)

**파일**: `scripts/generate-sitemap.js`

```javascript
// 수정 전
const stats = fs.statSync(fullPath);
posts.push({
  slug,
  lastmod: stats.mtime.toISOString(),  // ❌ 미래 날짜 가능
});

// 수정 후
const stats = fs.statSync(fullPath);
const now = new Date();
const mtime = new Date(stats.mtime);

// ✅ 파일 수정 시간과 현재 시간 중 더 이른 시간 사용
const lastmod = mtime > now ? now.toISOString() : mtime.toISOString();

posts.push({
  slug,
  lastmod,
});
```

---

## 🔬 검증 방법

### 로컬 빌드 검증

```bash
# 빌드 실행
npm run build

# 홈페이지 canonical URL 확인
grep -o '<link rel="canonical"[^>]*>' out/index.html
# 예상 결과: <link rel="canonical" href="https://kaameo.github.io/"/>

# 포스트 페이지 canonical URL 확인
grep -o '<link rel="canonical"[^>]*>' out/posts/controller-vs-restcontroller/index.html
# 예상 결과: <link rel="canonical" href="https://kaameo.github.io/posts/controller-vs-restcontroller/"/>

# Structured Data 확인
grep -o '<script type="application/ld+json"[^>]*>.*</script>' out/posts/controller-vs-restcontroller/index.html
# 예상 결과: JSON-LD 스키마가 포함된 script 태그

# Sitemap 재생성
node scripts/generate-sitemap.js
# 예상 결과: ✅ Sitemap generated with 70 URLs
```

### 배포 후 검증

```bash
# Canonical URL 확인
curl -s https://kaameo.github.io/ | grep -o '<link rel="canonical"[^>]*>'

# Structured Data 확인
curl -s https://kaameo.github.io/posts/controller-vs-restcontroller/ | grep -o '<script type="application/ld+json"[^>]*>'

# robots.txt 확인
curl https://kaameo.github.io/robots.txt

# sitemap.xml 확인
curl https://kaameo.github.io/sitemap.xml
```

### Google Tools 검증

#### 1. Rich Results Test
- URL: https://search.google.com/test/rich-results
- 포스트 URL 입력 후 테스트
- BlogPosting 구조화 데이터 인식 확인

#### 2. Google Search Console

**URL 검사 도구**:
```
1. Search Console 상단 검색창에 URL 입력
2. "URL이 Google에 등록되어 있지 않음" → 정상 (아직 크롤링 전)
3. "색인 생성 요청" 클릭
4. 페이지 소스 확인:
   - Canonical URL 올바른지 확인
   - Structured Data 인식되는지 확인
```

**Coverage 리포트** (1-2주 후):
```
1. 좌측 메뉴: "색인 생성" → "페이지"
2. "색인 생성됨" 숫자 증가 확인
3. "색인 생성 안됨" 오류 확인
```

---

## 🛡️ 예방 조치

### 1. 빌드 시 자동 검증

**package.json**에 검증 스크립트 추가:

```json
{
  "scripts": {
    "build": "next build && touch out/.nojekyll",
    "verify-seo": "node scripts/verify-seo.js",
    "prebuild": "npm run verify-seo"
  }
}
```

**scripts/verify-seo.js** (생성 권장):

```javascript
const fs = require('fs');
const path = require('path');

console.log('🔍 SEO 설정 검증 중...');

// 1. robots.txt 확인
const robotsPath = path.join(__dirname, '../public/robots.txt');
if (!fs.existsSync(robotsPath)) {
  console.error('❌ robots.txt 파일이 없습니다!');
  process.exit(1);
}

// 2. sitemap.xml 확인
const sitemapPath = path.join(__dirname, '../public/sitemap.xml');
if (!fs.existsSync(sitemapPath)) {
  console.warn('⚠️  sitemap.xml 파일이 없습니다. 빌드 전에 생성됩니다.');
}

// 3. Google 인증 파일 확인
const googleVerifyPath = path.join(__dirname, '../public/google1cb755b3583f2691.html');
if (!fs.existsSync(googleVerifyPath)) {
  console.warn('⚠️  Google Search Console 인증 파일이 없습니다.');
}

console.log('✅ SEO 설정 검증 완료');
```

### 2. 정기 모니터링

**주간 체크리스트**:
- [ ] Google Search Console "Coverage" 리포트 확인
- [ ] 새로운 오류나 경고 확인
- [ ] 색인된 페이지 수 추이 확인
- [ ] `site:kaameo.github.io` 검색 결과 확인

**월간 체크리스트**:
- [ ] Sitemap 재생성 및 제출 (새 포스트 많을 경우)
- [ ] Canonical URL 무작위 샘플링 검증
- [ ] Structured Data 테스트 (Rich Results Test)
- [ ] Page Speed Insights 확인

### 3. 코드 리뷰 체크리스트

새로운 페이지 타입 추가 시:
- [ ] `generateMetadata`에 `alternates.canonical` 추가
- [ ] 동적 라우트의 경우 params 기반 canonical URL 생성
- [ ] OpenGraph URL도 함께 설정
- [ ] 해당 페이지가 sitemap에 포함되는지 확인

---

## 🔧 일반적인 SEO 문제 해결

### 문제 1: 페이지가 색인되지 않음

**증상**:
- Google Search Console에서 "발견됨 - 현재 색인이 생성되지 않음"
- 또는 "크롤링됨 - 현재 색인이 생성되지 않음"

**원인 및 해결**:

1. **중복 컨텐츠**:
   - Canonical URL이 다른 페이지를 가리킴
   - 해결: 각 페이지의 canonical이 자신을 가리키는지 확인

2. **낮은 품질**:
   - 내용이 너무 짧거나 가치가 낮음
   - 해결: 최소 300단어 이상의 고품질 컨텐츠 작성

3. **크롤 예산 부족**:
   - 사이트가 너무 크거나 Google이 중요하지 않다고 판단
   - 해결: 중요한 페이지에 내부 링크 추가, sitemap 우선순위 조정

### 문제 2: Sitemap 오류

**증상**:
- "sitemap을 읽을 수 없음"
- "sitemap에 지원되지 않는 파일 형식"

**해결**:

```bash
# Sitemap 형식 검증
curl https://kaameo.github.io/sitemap.xml | xmllint --noout -

# 예상 출력: (오류가 없으면 아무것도 출력되지 않음)
```

**일반적인 오류**:
- XML 선언이 누락되었거나 잘못됨
- URL에 특수문자가 이스케이프되지 않음
- 날짜 형식이 ISO 8601이 아님

### 문제 3: Canonical URL 충돌

**증상**:
- Google Search Console에서 "대체 페이지(적절한 표준 태그 있음)"
- 의도한 것과 다른 페이지가 색인됨

**진단**:

```bash
# 특정 페이지의 canonical URL 확인
curl -s https://kaameo.github.io/posts/[slug]/ | grep -o '<link rel="canonical"[^>]*>'

# 예상: href가 현재 페이지를 가리켜야 함
```

**해결**:
1. 각 페이지의 canonical이 자신의 URL을 가리키는지 확인
2. 절대 URL 사용 (상대 URL 피하기)
3. trailing slash 일관성 유지 (`/posts/slug/` vs `/posts/slug`)

### 문제 4: robots.txt 차단

**증상**:
- "robots.txt에 의해 차단됨"
- Google이 페이지를 크롤링하지 못함

**진단**:

```bash
# robots.txt 내용 확인
curl https://kaameo.github.io/robots.txt
```

**올바른 설정**:

```txt
User-agent: *
Allow: /

Sitemap: https://kaameo.github.io/sitemap.xml
```

**피해야 할 설정**:

```txt
User-agent: *
Disallow: /  # ❌ 모든 페이지 차단

User-agent: Googlebot
Disallow: /posts/  # ❌ 포스트 차단
```

### 문제 5: Structured Data 오류

**증상**:
- Rich Results Test에서 오류 표시
- 검색 결과에 리치 스니펫이 나타나지 않음

**검증 도구**:
- https://search.google.com/test/rich-results
- https://validator.schema.org/

**일반적인 오류**:

1. **필수 필드 누락**:
```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "제목",  // ✅ 필수
  "datePublished": "2025-01-01",  // ✅ 필수
  // ❌ author 누락 (권장)
  // ❌ publisher 누락 (권장)
}
```

2. **잘못된 날짜 형식**:
```json
{
  "datePublished": "2025-01-01",  // ✅ 올바름
  "datePublished": "01/01/2025",  // ❌ 잘못됨
}
```

3. **URL 불일치**:
```json
{
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://kaameo.github.io/posts/slug/"  // ✅ canonical URL과 일치
  }
}
```

---

## 📊 성공 지표

### 단기 (1주)
- ✅ Google Search Console에서 sitemap "성공" 상태
- ✅ URL 검사에서 canonical URL 정상 인식
- ✅ Rich Results Test 통과

### 중기 (2-4주)
- ✅ 색인된 페이지 수 > 10개
- ✅ `site:kaameo.github.io` 검색 시 결과 표시
- ✅ Coverage 리포트에서 오류 0개

### 장기 (1-3개월)
- ✅ 색인된 페이지 수 > 50개 (전체 포스트의 80%+)
- ✅ 실제 검색어로 노출 시작 (Search Console "실적" 데이터)
- ✅ 리치 스니펫 표시 확인
- ✅ CTR > 2%

---

## 📚 참고 자료

### Google 공식 문서
- [Search Console 고객센터](https://support.google.com/webmasters)
- [Canonical URL 가이드](https://developers.google.com/search/docs/crawling-indexing/canonicalization)
- [Structured Data 가이드](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data)
- [Sitemap 가이드](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview)

### 검증 도구
- [Google Search Console](https://search.google.com/search-console)
- [Rich Results Test](https://search.google.com/test/rich-results)
- [Schema.org Validator](https://validator.schema.org/)
- [Page Speed Insights](https://pagespeed.web.dev/)

### Next.js 관련
- [Next.js Metadata API](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Next.js SEO](https://nextjs.org/learn/seo/introduction-to-seo)

---
