네, Next.js로도 GitHub Pages에 정적 사이트를 배포할 수 있습니다. 다만 GitHub Pages는 순수 정적 호스팅만 지원하기 때문에, Next.js의 **서버사이드 렌더링(SSR)** 기능이나 **API 라우트** 등은 쓸 수 없고, **정적 내보내기(static export)** 방식으로만 가능합니다.

## Next.js 정적 내보내기 설정 방법

1. **`next.config.js`에 export 옵션 추가**

   ```js
   // next.config.js
   module.exports = {
     // Next.js 13+: app 디렉토리 사용 시
     output: 'export',
     // Next.js 12 이하:
     //  exportTrailingSlash: true,  // 선택 사항 (URL 끝에 슬래시 붙이기)
   }
   ```
2. **정적 HTML/CSS/JS 생성**

   ```bash
   npm run build       # .next 폴더에 빌드
   npm run export      # 기본적으로 ./out 폴더에 정적 파일 생성
   ```
3. **`out/` 디렉터리를 깃허브 Pages용 브랜치에 커밋**

   * `main` 브랜치 루트에 `/docs` 폴더로 옮겨 커밋하거나,
   * `gh-pages` 전용 브랜치를 만들어 `out/` 전체를 푸시

   ```bash
   # 예시: gh-pages 브랜치로 배포
   git checkout --orphan gh-pages
   git --work-tree out add --all
   git --work-tree out commit -m "Deploy Next.js static"
   git push origin gh-pages --force
   ```
4. **GitHub 리포지토리 설정**

   1. 리포지토리 설정(Settings) → Pages
   2. Source를 `gh-pages` 브랜치, 경로 `/ (root)` 로 선택
   3. 저장하면 `https://<username>.github.io/<repo>` 에 배포 완료

## 주의 사항 및 팁

* **동적 기능 제한**: getServerSideProps, API Routes, Incremental Static Regeneration( ISR) 등 서버 사이드 기능은 동작하지 않습니다.
* **이미지 최적화**: Next.js의 `<Image>` 컴포넌트 기본 최적화(외부 서버 호출)도 정적 export 모드에선 제한됩니다.
* **Base Path**: 리포지토리 하위 경로로 배포할 경우 `next.config.js`에 `basePath: '/<repo>'` 를 설정해야 링크가 올바르게 작동합니다.
* **GitHub Actions 자동 배포**: `peaceiris/actions-gh-pages` 같은 액션을 이용해 커밋만 해도 자동으로 빌드·배포할 수 있습니다.

---

이렇게 하면 Next.js 프로젝트를 순수 정적 사이트로 변환하여 GitHub Pages에서 무리 없이 호스팅할 수 있습니다. 질문이나 문제가 있으면 말씀해 주세요!
