# My Timetable

SvelteKit 기반 주간 강의 시간표 앱입니다. 단일 대형 컴포넌트를 모듈화하여 재사용 가능한 UI 컴포넌트와 타입 안전한 데이터 계층으로 구성했습니다.

## Tech Stack

- SvelteKit 2 / Svelte 5 / TypeScript
- Vite 6
- TailwindCSS 4
- Vitest + Testing Library
- ESLint + Prettier

## Structure

- `src/lib/data/schedule.ts`: 시간표 원본 데이터와 요일/색상 매핑
- `src/lib/types/schedule.ts`: 도메인 타입
- `src/lib/utils/schedule.ts`: 데이터 가공 유틸
- `src/lib/components/*`: 재사용 UI 컴포넌트
- `src/lib/TimeTable.svelte`: 화면 조합 컨테이너
- `src/routes/components/+page.svelte`: 컴포넌트 카탈로그 페이지

## Commands

```bash
npm install
npm run dev
npm run test
npm run check
npm run lint:ts
npm run lint
npm run build
```

## Security and Maintenance Notes

- 외부 CDN 폰트 로딩 제거
- 전역 `window` 함수 주입 제거
- 의존성 보안 점검은 `npm audit`로 확인
