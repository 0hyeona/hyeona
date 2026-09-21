# CSS 구조

각 화면 섹션의 기본 스타일과 반응형 스타일은 같은 파일에서 관리합니다.

각 파일 상단에는 연결된 HTML 태그와 자주 수정하는 선택자가 적혀 있습니다. 글자 크기는 `rem`을 사용하며 `1rem = 16px`입니다. 미디어 쿼리 앞의 `[반응형: ...]` 주석으로 PC·태블릿·모바일 영역을 찾을 수 있습니다.

## 공통 파일

- `font.css`: 웹폰트 선언
- `common.css`: reset, 공통 색상 및 기본 요소
- `foundation/global.css`: 페이지 공통 변수, 접근성, 애니메이션
- `style.css`: 기존 경로 호환용 import 파일

## 섹션 파일

- `sections/hero.css`: 메인 Hero와 프로젝트 메뉴
- `sections/about.css`: About/Profile
- `sections/capabilities.css`: Tools & Capabilities
- `sections/visual-projects.css`: Visual Works와 상세 모달
- `sections/navigation.css`: 플로팅 내비게이션과 reveal 효과
- `sections/responsive-projects.css`: Responsive Web Projects 소개
- `sections/project-intro.css`: 프로젝트 공통 인트로
- `sections/romand.css`: Rom&nd 프로젝트 전체
- `sections/noda.css`: NODA 프로젝트 전체
- `sections/contact.css`: Contact

## 반응형 기준

- PC: `min-width: 1201px`
- 태블릿: `769px–1200px`
- 모바일: `max-width: 768px`
- 소형 모바일: `max-width: 480px`, `374px`, `300px`

새로운 반응형 수정은 전역 덮어쓰기 파일을 추가하지 않고 해당 섹션 파일의 마지막에 작성합니다.

## 수정 예시

```css
/* [기본 스타일] */
.about-profile-title {
  font-size: 3rem; /* 48px */
}

/* [반응형: 모바일 · 768px 이하] */
@media (max-width: 768px) {
  .about-profile-title {
    font-size: 2rem; /* 32px */
  }
}
```
