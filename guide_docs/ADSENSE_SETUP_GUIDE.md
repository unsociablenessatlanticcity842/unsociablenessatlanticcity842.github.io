# Google AdSense 설정 가이드

이 문서는 블로그에 Google AdSense 광고를 적용하기 위한 단계별 가이드입니다.

## 현재 상태

코드 구현은 완료되었습니다. 아래 환경변수만 설정하면 광고가 활성화됩니다.

**구현된 광고 위치:**

| 위치 | 파일 | 노출 조건 |
|------|------|-----------|
| 블로그 글 상단 (헤더 아래) | `app/posts/[slug]/page.tsx` | 모든 기기 |
| 블로그 글 하단 (댓글 위) | `app/posts/[slug]/page.tsx` | 모든 기기 |
| 사이드바 하단 | `components/global-sidebar.tsx` | 데스크톱만 (lg 이상) |

**관련 컴포넌트:**
- `components/analytics/adsense.tsx` — `GoogleAdSense` (글로벌 스크립트), `AdUnit` (개별 광고)

---

## Step 1: Google AdSense 가입

1. [Google AdSense](https://adsense.google.com/) 접속
2. Google 계정으로 로그인
3. 사이트 URL 입력: `https://kaameo.github.io`
4. 약관 동의 후 신청 제출

### 승인 요건

- 독창적인 콘텐츠가 충분히 있어야 함 (최소 10~15개 포스트 권장)
- 사이트가 정상적으로 접근 가능해야 함
- 개인정보처리방침 페이지가 있으면 유리
- 심사 기간: 보통 1일~2주

---

## Step 2: AdSense 승인 코드 확인

승인 신청 후 AdSense 대시보드에서 게시자 ID를 확인합니다.

- 형식: `ca-pub-XXXXXXXXXXXXXXXX`
- 위치: AdSense > 계정 > 계정 정보 > 게시자 ID

---

## Step 3: 광고 단위(Ad Unit) 생성

AdSense 대시보드에서 광고 단위를 생성합니다.

1. AdSense > 광고 > 광고 단위별
2. **디스플레이 광고** 선택
3. 3개의 광고 단위를 각각 생성:

| 광고 단위 이름 | 권장 형식 | 용도 |
|---------------|-----------|------|
| `blog-post-top` | 가로형 (horizontal) | 블로그 글 상단 |
| `blog-post-bottom` | 자동 크기 (auto) | 블로그 글 하단 |
| `sidebar` | 세로형 (vertical) | 사이드바 |

4. 각 광고 단위의 **슬롯 ID** (숫자)를 메모

---

## Step 4: 환경변수 설정

### 로컬 개발 (.env.local)

프로젝트 루트에 `.env.local` 파일을 생성하거나 기존 파일에 추가:

```bash
# Google AdSense
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXXXXXXXX
NEXT_PUBLIC_ADSENSE_SLOT_POST_TOP=1234567890
NEXT_PUBLIC_ADSENSE_SLOT_POST_BOTTOM=2345678901
NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR=3456789012
```

### GitHub Pages 배포 (GitHub Actions)

1. GitHub 리포지토리 > **Settings** > **Secrets and variables** > **Actions**
2. **Repository secrets**에 추가:

| Secret Name | 값 예시 |
|-------------|---------|
| `NEXT_PUBLIC_ADSENSE_CLIENT_ID` | `ca-pub-XXXXXXXXXXXXXXXX` |
| `NEXT_PUBLIC_ADSENSE_SLOT_POST_TOP` | `1234567890` |
| `NEXT_PUBLIC_ADSENSE_SLOT_POST_BOTTOM` | `2345678901` |
| `NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR` | `3456789012` |

3. `.github/workflows/deploy.yml`의 build step에 환경변수 전달 확인:

```yaml
- name: Build
  env:
    NEXT_PUBLIC_ADSENSE_CLIENT_ID: ${{ secrets.NEXT_PUBLIC_ADSENSE_CLIENT_ID }}
    NEXT_PUBLIC_ADSENSE_SLOT_POST_TOP: ${{ secrets.NEXT_PUBLIC_ADSENSE_SLOT_POST_TOP }}
    NEXT_PUBLIC_ADSENSE_SLOT_POST_BOTTOM: ${{ secrets.NEXT_PUBLIC_ADSENSE_SLOT_POST_BOTTOM }}
    NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR: ${{ secrets.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR }}
  run: npm run build
```

> **중요:** `NEXT_PUBLIC_` 접두사가 있는 변수는 빌드 시점에 번들에 포함됩니다. GitHub Actions의 build step에서 반드시 env로 전달해야 합니다.

---

## Step 5: 배포 및 확인

1. 환경변수 설정 후 `main` 브랜치에 push
2. GitHub Actions 빌드 완료 대기
3. `https://kaameo.github.io/posts/[아무글]` 접속하여 광고 영역 확인
4. AdSense 대시보드에서 노출/수익 데이터 확인 (반영까지 수 시간 소요)

---

## 체크리스트

- [ ] AdSense 가입 신청
- [ ] AdSense 승인 완료
- [ ] 광고 단위 3개 생성 (post-top, post-bottom, sidebar)
- [ ] `.env.local`에 환경변수 설정 (로컬 테스트)
- [ ] GitHub Secrets에 환경변수 추가
- [ ] `deploy.yml` build step에 env 전달 추가
- [ ] 배포 후 광고 노출 확인

---

## 참고

- 환경변수가 설정되지 않으면 점선 박스 placeholder가 표시됩니다 (프로덕션 포함)
- AdSense 승인 전에는 스크립트가 로드되어도 광고가 표시되지 않습니다
- ads.txt 파일이 필요할 수 있습니다 — AdSense 대시보드에서 안내하면 `public/ads.txt`에 추가하세요
