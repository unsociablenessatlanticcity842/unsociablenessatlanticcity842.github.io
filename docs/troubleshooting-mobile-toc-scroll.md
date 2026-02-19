# 트러블슈팅: 모바일 TOC 클릭 시 해당 섹션으로 이동하지 않는 문제

## 증상

- **PC(데스크톱)**: 우측 사이드바 TOC 항목 클릭 → 해당 heading으로 정상 스크롤
- **모바일**: Sheet 패널 TOC 항목 클릭 → 스크롤이 전혀 동작하지 않음

## 원인 분석

### 1단계: 구조 차이 파악

| 환경 | TOC 위치 | 오버레이 | 스크롤 잠금 |
|------|---------|---------|-----------|
| 데스크톱 | `aside` (sticky) | 없음 | 없음 |
| 모바일 | Radix Sheet (`Dialog`) | `fixed inset-0 z-50` | `overflow: hidden` on body |

데스크톱 TOC는 페이지 본문과 같은 스크롤 컨텍스트에 있지만, 모바일 TOC는 Radix Dialog 기반 Sheet 안에 렌더링된다.

### 2단계: Radix Dialog의 Body Scroll Lock

Radix Dialog(Sheet의 기반)가 열리면 다음이 자동 적용된다:

```
document.body.style.overflow = 'hidden'
document.body.style.pointerEvents = 'none'  // Overlay 아래 영역
```

이 상태에서 `window.scrollTo()`를 호출하면:
- body에 `overflow: hidden`이 걸려 있어 **스크롤 자체가 차단**됨
- 브라우저가 스크롤 명령을 무시하거나, 실행되더라도 화면에 반영되지 않음

### 3단계: 타이밍 문제

초기 수정에서 Sheet를 닫는 `setTocOpen(false)`를 호출한 직후 `scrollTo()`를 실행했지만, 이것도 동작하지 않았다:

```typescript
// 첫 번째 시도 (실패)
onItemClick?.()                    // setState → 비동기 re-render 예약
const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
requestAnimationFrame(() => {
  window.scrollTo({ top: y })      // 이 시점에 아직 Sheet가 닫히지 않음
})
```

React의 `setState`는 비동기이므로:
1. `setTocOpen(false)` 호출 → re-render **예약**만 됨
2. 다음 줄의 `getBoundingClientRect()` → Sheet가 아직 열린 상태에서 좌표 계산
3. `requestAnimationFrame` → Sheet 닫힘 애니메이션 시작 전이거나 진행 중
4. `window.scrollTo()` → body scroll lock이 아직 해제되지 않아 무시됨

Radix Sheet의 닫힘 과정:
```
setTocOpen(false)
  → React re-render (비동기)
  → Sheet exit 애니메이션 시작 (~200-300ms)
  → 애니메이션 완료
  → Radix가 body overflow: hidden 제거
  → 비로소 window.scrollTo() 가능
```

## 해결 방법

Sheet 닫힘이 완전히 완료된 후에 스크롤을 실행하도록 `setTimeout`으로 지연:

```typescript
// 최종 수정 (성공)
const scrollToHeading = () => {
  const element = document.getElementById(id)
  if (element) {
    const yOffset = -100
    const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
    window.scrollTo({ top: y, behavior: 'smooth' })
  }
}

if (onItemClick) {
  onItemClick()                          // Sheet 닫기 시작
  setTimeout(scrollToHeading, 350)       // 닫힘 완료 후 스크롤
} else {
  requestAnimationFrame(scrollToHeading) // 데스크톱: 즉시 스크롤
}
```

핵심 포인트:
- **350ms 지연**: Radix Sheet 닫힘 애니메이션(~300ms) + body scroll lock 해제 여유분
- **좌표 재계산**: `setTimeout` 콜백 안에서 `getBoundingClientRect()` 호출 → Sheet 닫힌 후의 정확한 좌표
- **조건 분기**: `onItemClick` 유무로 모바일/데스크톱 경로를 분리하여 데스크톱 동작에 영향 없음

## 수정 파일

- `components/table-of-contents.tsx`: `onItemClick` prop 추가, `handleClick` 타이밍 분기
- `components/blog-layout.tsx`: 모바일 Sheet 내 `<TableOfContents>`에 `onItemClick={() => setTocOpen(false)}` 전달

## 교훈

1. **Radix Dialog 계열 컴포넌트(Sheet, Dialog, AlertDialog)는 body scroll을 잠근다** — 오버레이가 열린 상태에서 `window.scrollTo()`는 동작하지 않는다.
2. **React setState 이후 DOM 반영은 비동기다** — `setState` 직후의 코드는 이전 상태의 DOM에서 실행된다.
3. **애니메이션이 있는 UI 전환 후 DOM 조작은 전환 완료를 기다려야 한다** — `setTimeout`이나 `onAnimationEnd` 등으로 타이밍을 확보해야 한다.
