# Google Search Console 설정 가이드

이 가이드는 kaameo.github.io 블로그를 Google Search Console에 등록하고 검색 노출을 최적화하는 방법을 안내합니다.

## 목차
1. [Google Search Console 등록](#1-google-search-console-등록)
2. [소유권 확인](#2-소유권-확인)
3. [Sitemap 제출](#3-sitemap-제출)
4. [URL 검사 및 색인 요청](#4-url-검사-및-색인-요청)
5. [검색 성능 모니터링](#5-검색-성능-모니터링)

---

## 1. Google Search Console 등록

### 1.1 Search Console 접속
1. [Google Search Console](https://search.google.com/search-console) 접속
2. Google 계정으로 로그인

### 1.2 속성 추가
1. 좌측 상단 "속성 추가" 클릭
2. **URL 접두어** 방식 선택 (권장)
3. URL 입력: `https://kaameo.github.io`
4. "계속" 클릭

> **왜 URL 접두어를 선택하나요?**
> - 도메인 속성: 모든 서브도메인과 프로토콜 포함 (DNS 인증 필요)
> - URL 접두어: 특정 URL만 관리 (HTML 파일 인증 가능, GitHub Pages에 적합)

---

## 2. 소유권 확인

### 2.1 HTML 파일 업로드 방식 (권장)

1. **HTML 파일 다운로드**
   - Search Console에서 제공하는 HTML 파일 다운로드
   - 파일명 예시: `google1234567890abcdef.html`

2. **파일 업로드**
   ```bash
   # 1. 다운로드한 파일을 public 폴더에 복사
   cp ~/Downloads/google1234567890abcdef.html public/

   # 2. Git에 추가 및 커밋
   git add public/google1234567890abcdef.html
   git commit -m "chore: add Google Search Console verification file"
   git push origin main
   ```

3. **배포 대기**
   - GitHub Actions가 자동으로 배포 (약 2-3분 소요)
   - Actions 탭에서 배포 상태 확인

4. **소유권 확인**
   - Search Console로 돌아가서 "확인" 버튼 클릭
   - 파일이 정상적으로 접근 가능한지 확인
   - 확인 완료 후 파일은 삭제하지 마세요 (재확인에 사용됨)

### 2.2 대체 방법: HTML 태그

Next.js 메타데이터에 인증 태그를 추가할 수도 있습니다:

```typescript
// app/layout.tsx
export const metadata: Metadata = {
  // ... 기존 설정
  verification: {
    google: 'your-verification-code-here',
  },
}
```

---

## 3. Sitemap 제출

### 3.1 Sitemap 자동 생성 확인

프로젝트에는 이미 sitemap 자동 생성이 설정되어 있습니다:

- **생성 스크립트**: `scripts/generate-sitemap.js`
- **자동 실행**: GitHub Actions 배포 시 자동 생성
- **위치**: `https://kaameo.github.io/sitemap.xml`

### 3.2 Sitemap 제출하기

1. Search Console에서 좌측 메뉴 "Sitemaps" 클릭
2. "새 사이트맵 추가" 입력란에 `sitemap.xml` 입력
3. "제출" 클릭
4. 상태가 "성공"으로 표시될 때까지 대기 (몇 분 소요)

### 3.3 Sitemap 내용 확인

Sitemap에는 다음이 포함됩니다:
- ✅ 홈페이지 (`/`)
- ✅ 포스트 목록 (`/posts`)
- ✅ 모든 블로그 포스트 (`/posts/[slug]`)
- ✅ 카테고리 페이지 (`/categories/[category]`)
- ✅ 태그 페이지 (`/tags/[tag]`)

---

## 4. URL 검사 및 색인 요청

### 4.1 개별 URL 색인 요청

새 포스트를 작성하거나 중요한 페이지를 빠르게 색인하고 싶을 때:

1. Search Console 상단 검색창에 URL 입력
   - 예: `https://kaameo.github.io/posts/my-new-post`
2. "URL 검사" 실행
3. "색인 생성 요청" 클릭
4. 상태 확인 및 대기

### 4.2 색인 우선순위

색인 요청 우선순위:
1. **최우선**: 홈페이지 (`https://kaameo.github.io`)
2. **높음**: 새로 작성한 포스트
3. **중간**: 업데이트된 포스트
4. **낮음**: 카테고리/태그 페이지 (Sitemap으로 자동 처리)

### 4.3 색인 상태 확인

- **URL이 Google에 등록되어 있음**: ✅ 색인 완료
- **URL이 Google에 등록되어 있지 않음**: ⏳ 색인 대기 중
- **페이지를 가져올 수 없음**: ❌ 오류 확인 필요

---

## 5. 검색 성능 모니터링

### 5.1 주요 지표

Search Console에서 확인할 수 있는 주요 지표:

1. **실적**
   - 총 클릭수
   - 총 노출수
   - 평균 CTR (클릭률)
   - 평균 게재순위

2. **검색어**
   - 사용자가 어떤 키워드로 블로그를 찾는지 확인
   - 높은 노출, 낮은 클릭 키워드는 제목/설명 개선 필요

3. **페이지**
   - 어떤 포스트가 가장 많이 노출되는지
   - 성과 좋은 포스트의 패턴 분석

### 5.2 Core Web Vitals

"Core Web Vitals" 메뉴에서 성능 지표 확인:
- **LCP** (Largest Contentful Paint): 2.5초 이하 목표
- **FID** (First Input Delay): 100ms 이하 목표
- **CLS** (Cumulative Layout Shift): 0.1 이하 목표

### 5.3 모바일 사용성

"모바일 사용성" 메뉴에서 모바일 최적화 상태 확인:
- 클릭 요소 간격
- 뷰포트 설정
- 텍스트 크기

---

## 문제 해결 (Troubleshooting)

### ❌ "페이지를 가져올 수 없음"

**원인**:
- robots.txt에서 차단됨
- 페이지가 실제로 존재하지 않음
- 서버 오류

**해결**:
1. `https://kaameo.github.io/robots.txt` 확인
2. 해당 URL이 실제로 접근 가능한지 브라우저에서 확인
3. GitHub Pages 배포 상태 확인

### ❌ "색인이 생성되었지만 사이트맵에 제출되지 않음"

**원인**: Sitemap에 해당 URL이 없음

**해결**:
1. `scripts/generate-sitemap.js` 확인
2. 새 포스트가 `content/posts/` 폴더에 있는지 확인
3. 재배포 후 Sitemap 갱신 확인

### ⚠️ "검색 결과에 나타나지 않음"

**대기 시간**:
- 최초 색인: 1-4주 소요 가능
- 색인 요청 후: 며칠 ~ 2주

**가속화 방법**:
1. 모든 주요 페이지 색인 요청
2. 외부 링크 확보 (GitHub 프로필, SNS, 다른 블로그)
3. 정기적인 새 포스트 작성
4. 양질의 컨텐츠 작성

---

## 체크리스트

완료된 항목을 체크하세요:

- [ ] Google Search Console에 사이트 등록
- [ ] 소유권 확인 완료
- [ ] robots.txt 설정 확인 (`/robots.txt` 접근 가능)
- [ ] Sitemap 제출 완료
- [ ] 홈페이지 색인 요청 완료
- [ ] 주요 포스트 5개 색인 요청 완료
- [ ] 외부 링크 3개 이상 확보 (GitHub 프로필, SNS 등)
- [ ] Google Analytics 연동 확인 (선택사항)

---

## 추가 리소스

- [Google Search Console 공식 문서](https://support.google.com/webmasters)
- [SEO 기초 가이드](https://developers.google.com/search/docs/beginner/seo-starter-guide)
- [검색엔진 최적화 체크리스트](https://developers.google.com/search/docs/beginner/do-i-need-seo)

---

## 정기 유지보수

### 매주
- [ ] 새 포스트 색인 요청
- [ ] 검색 성능 확인

### 매월
- [ ] 검색어 트렌드 분석
- [ ] Core Web Vitals 확인
- [ ] 모바일 사용성 점검

### 분기별
- [ ] 저성과 포스트 개선
- [ ] 메타데이터 최적화
- [ ] 외부 링크 확보 전략 검토
