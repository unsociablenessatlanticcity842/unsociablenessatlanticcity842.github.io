# Giscus 댓글 시스템 설정 가이드

이 문서는 블로그에 GitHub 기반 댓글 시스템(Giscus)을 설정하는 방법을 안내합니다.

## 📋 사전 준비

### 1. GitHub Repository에서 Discussions 활성화

1. GitHub에서 `kaameo/kaameo.github.io` repository로 이동
2. Settings → General → Features 섹션으로 이동
3. "Discussions" 체크박스 활성화
4. Changes 저장

### 2. Giscus 설정

1. [https://giscus.app](https://giscus.app) 방문
2. 다음 설정 입력:

#### Repository 설정
- **Repository:** `kaameo/kaameo.github.io`
- 녹색 체크 표시가 나타나는지 확인 (Discussions 활성화 확인)

#### Page ↔ Discussions 매핑
- **Mapping:** `pathname` 선택 (각 포스트 URL에 대해 고유한 Discussion 생성)

#### Discussion 카테고리
- **Category:** `Announcements` 또는 `General` 선택

#### 기능 설정
- **Enable reactions for the main post** ✅
- **Emit discussion metadata** ❌
- **Theme:** `preferred_color_scheme` (자동 테마 전환)
- **Comment box placement:** `top`

### 3. 환경 변수 설정

1. Giscus 페이지 하단에서 생성된 설정 값 확인
2. `.env.local` 파일 생성:

```bash
cp .env.local.example .env.local
```

3. `.env.local` 파일 편집하여 값 입력:

```env
NEXT_PUBLIC_GISCUS_REPO=kaameo/kaameo.github.io
NEXT_PUBLIC_GISCUS_REPO_ID=R_kgDOM-dQDw
NEXT_PUBLIC_GISCUS_CATEGORY=Announcements
NEXT_PUBLIC_GISCUS_CATEGORY_ID=DIC_kwDOM-dQD84Ct5cr
```

## 🚀 로컬 테스트

```bash
# 개발 서버 실행
npm run dev

# http://localhost:3000/posts/[any-post] 접속
# 페이지 하단에서 댓글 섹션 확인
```

## ✅ 체크리스트

- [ ] GitHub repository에서 Discussions 활성화됨
- [ ] giscus.app에서 설정 완료
- [ ] `.env.local` 파일에 환경 변수 설정됨
- [ ] 로컬에서 댓글 컴포넌트 표시 확인
- [ ] GitHub 로그인 후 댓글 작성 가능 확인
- [ ] 다크모드 ↔ 라이트모드 전환 시 댓글 테마도 변경됨

## 🎨 커스터마이징

### 스타일 변경
`components/giscus-comments.tsx` 파일에서 스타일 수정 가능:
- 컨테이너 스타일링
- 제목 텍스트
- 로딩 상태 UI

### 위치 변경
기본적으로 포스트 내용 아래에 표시됩니다. 위치를 변경하려면 `app/posts/[slug]/page.tsx`에서 `<GiscusComments />` 컴포넌트 위치를 조정하세요.

## 🚨 문제 해결

### 댓글이 표시되지 않는 경우
1. GitHub repository에서 Discussions가 활성화되어 있는지 확인
2. 환경 변수가 올바르게 설정되어 있는지 확인
3. 브라우저 콘솔에서 에러 메시지 확인

### 다크모드가 작동하지 않는 경우
1. `next-themes`가 올바르게 설정되어 있는지 확인
2. 브라우저에서 시스템 테마 설정 확인

## 📚 추가 리소스

- [Giscus 공식 문서](https://giscus.app/ko)
- [GitHub Discussions 문서](https://docs.github.com/en/discussions)


---

<script src="https://giscus.app/client.js"
        data-repo="kaameo/kaameo.github.io"
        data-repo-id="R_kgDOM-dQDw"
        data-category="Announcements"
        data-category-id="DIC_kwDOM-dQD84Ct5cr"
        data-mapping="pathname"
        data-strict="0"
        data-reactions-enabled="1"
        data-emit-metadata="0"
        data-input-position="top"
        data-theme="preferred_color_scheme"
        data-lang="ko"
        crossorigin="anonymous"
        async>
</script>