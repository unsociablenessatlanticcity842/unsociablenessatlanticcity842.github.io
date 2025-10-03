# Google Analytics 4 구현 가이드

이 문서는 Next.js 블로그에 구현된 GA4 시스템의 상세 가이드입니다.

## 🎯 개요

프라이버시 중심의 GA4 통합으로 다음 기능을 제공합니다:
- GDPR/CCPA 준수 쿠키 동의 시스템
- 자동 페이지뷰 및 스크롤 추적
- 커스텀 이벤트 추적
- 읽기 진행률 분석
- 성능 메트릭 수집

## 🚀 시작하기

### 1. GA4 계정 설정

1. [Google Analytics](https://analytics.google.com/) 접속
2. 관리 → 속성 만들기
3. 데이터 스트림 → 웹 → 새 스트림 추가
4. Measurement ID (G-XXXXXXXXXX) 복사

### 2. 환경 변수 설정

```bash
# .env.local 생성
cp .env.local.example .env.local

# 환경 변수 설정
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-QSTMBHZMWY
NEXT_PUBLIC_GA_ENABLED_IN_DEV=true  # 개발 환경에서 테스트 시
```

### 3. 배포 환경 설정

#### Vercel
```
Settings → Environment Variables
NEXT_PUBLIC_GA_MEASUREMENT_ID = G-YOUR_MEASUREMENT_ID
```

#### GitHub Actions
```yaml
env:
  NEXT_PUBLIC_GA_MEASUREMENT_ID: ${{ secrets.GA_MEASUREMENT_ID }}
```

## 📊 자동 추적 이벤트

### 페이지뷰
- 모든 페이지 전환 자동 추적
- SPA 라우팅 지원
- 메타데이터 포함 (제목, 경로, 참조자)

### 스크롤 추적
- 마일스톤: 25%, 50%, 75%, 90%, 100%
- 포스트별 개별 추적
- 읽기 완료 자동 감지

### 읽기 시간
- 실제 체류 시간 측정
- 활성/비활성 상태 구분
- 읽기 마일스톤: 10초, 30초, 1분, 2분, 5분

### 사용자 참여
- 마우스/키보드 활동 추적
- 15초마다 참여도 측정
- 이탈률 계산

## 🎨 커스텀 이벤트 추적

### 사용 방법

```typescript
import { useAnalytics } from '@/hooks/use-analytics'

function MyComponent() {
  const { trackEvent, trackSearch, trackCodeCopy } = useAnalytics()

  // 일반 이벤트
  trackEvent('custom_event', {
    event_category: 'engagement',
    event_label: 'button_click',
    value: 1
  })

  // 검색 추적
  trackSearch('검색어', 10) // 검색어, 결과 수

  // 코드 복사
  trackCodeCopy('javascript', 'blog_post')
}
```

### 주요 이벤트

| 이벤트 | 용도 | 파라미터 |
|--------|------|----------|
| `article_read` | 포스트 읽기 시작/완료 | post_id, title, reading_time |
| `search` | 사이트 내 검색 | search_term, results_count |
| `code_copy` | 코드 블록 복사 | language, source |
| `theme_change` | 다크모드 전환 | theme_mode |
| `external_link_click` | 외부 링크 클릭 | link_url, link_domain |

## 🍪 쿠키 동의 시스템

### 동의 유형

1. **필수 쿠키** (항상 활성)
   - 기본 사이트 기능
   - 보안 관련

2. **분석 쿠키** (선택)
   - Google Analytics
   - 사용자 행동 분석

3. **기능성 쿠키** (선택)
   - 테마 설정
   - 사용자 선호도

4. **마케팅 쿠키** (선택)
   - 현재 미사용
   - 향후 확장 가능

### 동의 관리

```typescript
import { useConsent } from '@/hooks/use-consent'

function ConsentManager() {
  const { 
    hasAnalyticsConsent,
    updateConsent,
    acceptAll,
    rejectAll 
  } = useConsent()

  // 동의 상태 확인
  if (hasAnalyticsConsent) {
    // GA4 활성화됨
  }

  // 동의 업데이트
  updateConsent('analytics', true)
}
```

## 🔍 디버깅

### 개발 환경

1. Chrome DevTools Console에서 이벤트 로그 확인
2. Network 탭에서 GA4 요청 확인
3. Application → Local Storage에서 동의 상태 확인

### GA4 DebugView

1. GA4 → 관리 → DebugView
2. Chrome Extension: [Google Analytics Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna)
3. 실시간 이벤트 모니터링

### 디버그 정보 확인

```typescript
// 브라우저 콘솔에서
window.gtag('event', 'debug_test', {
  event_category: 'test',
  debug_mode: true
})
```

## 📈 GA4 보고서 활용

### 주요 보고서

1. **실시간**
   - 현재 활성 사용자
   - 실시간 이벤트
   - 페이지별 조회수

2. **참여도**
   - 평균 참여 시간
   - 참여 세션수
   - 이벤트 수

3. **콘텐츠**
   - 인기 포스트
   - 읽기 완료율
   - 카테고리별 성과

### 커스텀 보고서 생성

1. 탐색 → 분석 허브
2. 새 분석 만들기
3. 측정기준: 페이지 경로, 이벤트 이름
4. 측정항목: 이벤트 수, 사용자 수

## 🛡️ 프라이버시 & 보안

### 데이터 보호

- IP 익명화 기본 활성화
- PII 자동 필터링 (이메일, 전화번호 등)
- User-ID 미사용 (익명 추적만)
- 최소 데이터 수집 원칙

### 규정 준수

- GDPR: 명시적 동의, 철회 가능
- CCPA: 옵트아웃 권리 보장
- KISA: 한국 개인정보보호법 준수
- Do Not Track: DNT 헤더 존중

## ⚡ 성능 최적화

### 로딩 최적화

- `afterInteractive` 전략으로 비차단 로드
- 동의 후에만 스크립트 로드
- Resource hints (preconnect, dns-prefetch)

### 이벤트 배칭

- 중요도별 우선순위 처리
- requestIdleCallback 활용
- 배치 전송으로 네트워크 요청 감소

## 🔧 문제 해결

### GA4가 작동하지 않는 경우

1. 환경 변수 확인
   ```bash
   echo $NEXT_PUBLIC_GA_MEASUREMENT_ID
   ```

2. 쿠키 동의 확인
   - 개발자 도구 → Application → Local Storage
   - `ka_consent` 키 확인

3. 광고 차단기 확인
   - uBlock Origin 등이 GA4를 차단할 수 있음

### 이벤트가 전송되지 않는 경우

1. 콘솔 에러 확인
2. Network 탭에서 collect 요청 확인
3. GA4 DebugView에서 실시간 확인

## 📚 추가 리소스

- [GA4 공식 문서](https://support.google.com/analytics/answer/9322688)
- [Next.js Analytics](https://nextjs.org/docs/app/building-your-application/optimizing/analytics)
- [Web Vitals](https://web.dev/vitals/)

## 🤝 기여하기

개선 사항이나 버그를 발견하면 이슈를 생성해주세요.

---

구현: 2024년 1월
버전: 1.0.0


---
```
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-QSTMBHZMWY"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-QSTMBHZMWY');
</script>
```