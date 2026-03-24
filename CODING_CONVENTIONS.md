# Waypoint FE 코딩 컨벤션

> 백엔드가 [캠퍼스 핵데이 Java 코딩 컨벤션](https://naver.github.io/hackday-conventions-java/)을 따르듯,
> 프런트엔드는 아래 규칙을 기준으로 작성합니다.
> 모든 규칙은 **Prettier + ESLint + lint-staged를 통해 커밋 시점에 자동 강제됩니다.**

---

## 목차

1. [포매팅 (Prettier)](#1-포매팅-prettier)
2. [TypeScript 컨벤션 (ESLint)](#2-typescript-컨벤션-eslint)
3. [자동화 (lint-staged + Husky)](#3-자동화-lint-staged--husky)
4. [파일 및 컴포넌트 네이밍](#4-파일-및-컴포넌트-네이밍)
5. [임포트 순서](#5-임포트-순서)
6. [React 컴포넌트 작성 패턴](#6-react-컴포넌트-작성-패턴)

---

## 1. 포매팅 (Prettier)

설정 파일: `.prettierrc`

| 규칙            | 값                            | 이유                                            |
| --------------- | ----------------------------- | ----------------------------------------------- |
| `semi`          | `true`                        | 세미콜론 필수                                   |
| `singleQuote`   | `false`                       | 큰따옴표 사용                                   |
| `trailingComma` | `"all"`                       | 마지막 요소 뒤 쉼표 항상 추가 (git diff 최소화) |
| `printWidth`    | `100`                         | 가독성과 현실적인 줄 길이의 균형                |
| `tabWidth`      | `2`                           | 2스페이스 들여쓰기                              |
| `plugins`       | `prettier-plugin-tailwindcss` | Tailwind 클래스 자동 정렬                       |

### Tailwind 클래스 정렬

`prettier-plugin-tailwindcss`가 Tailwind 공식 권장 순서로 className을 자동 정렬합니다.
수동으로 순서를 신경 쓸 필요 없이, 저장 또는 커밋 시 자동 정리됩니다.

```tsx
// Before (정렬 전)
<div className="text-foreground flex w-full flex-col gap-3 py-2">

// After (정렬 후 — Prettier가 자동 처리)
<div className="flex w-full flex-col gap-3 py-2 text-foreground">
```

### 수동 실행

```bash
# 전체 포매팅
pnpm prettier --write .

# 특정 파일 확인만
pnpm prettier --check src/components/MyComponent.tsx
```

---

## 2. TypeScript 컨벤션 (ESLint)

설정 파일: `eslint.config.mjs`

### 2-1. `type` vs `interface` → **항상 `type` 사용**

```ts
// ✅ Good
type UserProps = {
  name: string;
  age: number;
};

// ❌ Bad
interface UserProps {
  name: string;
  age: number;
}
```

**이유**: `type`은 Union, Intersection, Mapped Type 등 모든 경우에 사용 가능해 일관성이 높습니다.
이 프로젝트에서는 컴포넌트 Props, API 응답 타입, 유틸 타입 모두 `type`으로 통일합니다.

### 2-2. `import type` 사용 강제

타입만 임포트할 때는 반드시 `import type`을 사용합니다.

```ts
// ✅ Good
import type { ReactNode } from "react";
import { useState } from "react";

// ✅ Good (inline)
import { useState, type ReactNode } from "react";

// ❌ Bad
import { ReactNode } from "react";
```

**이유**: `import type`은 컴파일 시 완전히 제거되어 런타임 번들 크기에 영향을 주지 않습니다.

### 2-3. 미사용 변수 금지

`_` 접두사가 붙은 변수는 의도적 미사용으로 허용됩니다.

```ts
// ✅ Good — 의도적으로 사용하지 않는 파라미터
const handler = (_event: MouseEvent, value: string) => { ... };

// ❌ Bad
const unused = "hello"; // 실제로 사용되지 않음
```

### 2-4. 타입 단언(`as`) 최소화

`as`를 남용하면 TypeScript의 타입 안전성이 무력화됩니다. 불가피한 경우에만 사용하고, 이유를 주석으로 남깁니다.

```ts
// ✅ Good — 불가피한 경우 주석 작성
const el = document.getElementById("root") as HTMLDivElement; // 항상 존재함이 보장됨

// ❌ Bad
const data = response as any;
```

---

## 3. 자동화 (lint-staged + Husky)

### 동작 방식

`git commit` 실행 시 **staged 파일에만** 아래 작업이 자동 실행됩니다:

| 파일 종류                 | 실행 작업                                       |
| ------------------------- | ----------------------------------------------- |
| `*.ts`, `*.tsx`           | `prettier --write` → `eslint --fix` 순서로 실행 |
| `*.json`, `*.css`, `*.md` | `prettier --write`                              |

규칙을 위반한 코드가 있으면 커밋이 **자동으로 차단**됩니다.

### 로컬 환경 셋업

저장소를 클론한 후 반드시 아래 명령어를 실행하세요. Husky git hook이 등록됩니다.

```bash
pnpm install
```

> `package.json`의 `"prepare": "husky"` 스크립트가 install 시 자동으로 husky를 초기화합니다.

### 수동 실행

```bash
# staged 파일에 대해 lint-staged 수동 실행
pnpm lint-staged

# ESLint 전체 검사
pnpm lint

# ESLint 자동 수정
pnpm lint --fix
```

---

## 4. 파일 및 컴포넌트 네이밍

| 종류                | 규칙                        | 예시                              |
| ------------------- | --------------------------- | --------------------------------- |
| React 컴포넌트 파일 | `PascalCase`                | `BudgetCandidateCard.tsx`         |
| Hook 파일           | `kebab-case`, `use-` 접두사 | `use-block-detail.ts`             |
| 유틸/API 파일       | `kebab-case`                | `date.ts`, `auth.ts`              |
| 타입 파일           | `kebab-case`                | `plan.ts`, `budget.ts`            |
| 컴포넌트 함수명     | `PascalCase`                | `const BudgetCandidateCard = ...` |
| 훅 함수명           | `camelCase`, `use` 접두사   | `const useBlockDetail = ...`      |
| 일반 함수/변수      | `camelCase`                 | `const normalizeCandidate = ...`  |
| 상수 (모듈 스코프)  | `UPPER_SNAKE_CASE`          | `const MAX_RETRY_COUNT = 3`       |
| 타입/타입 별칭      | `PascalCase`                | `type BlockDetail = ...`          |

---

## 5. 임포트 순서

아래 순서를 따릅니다. 각 그룹 사이에 빈 줄을 추가합니다.

```ts
// 1. Node.js 내장 모듈 (해당 시)
import path from "path";

// 2. 외부 라이브러리
import { useState, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";

// 3. 내부 모듈 (@/ 경로)
import { apiClient } from "@/lib/api/client";
import type { BlockDetail } from "@/lib/api/block";

// 4. 상대 경로
import { formatDate } from "./utils";
```

> 현재 eslint-config-next가 기본적인 import 순서를 검사합니다.

---

## 6. React 컴포넌트 작성 패턴

### 컴포넌트 정의

```tsx
// ✅ 화살표 함수 + default export
type MyComponentProps = {
  title: string;
  children?: ReactNode;
};

const MyComponent = ({ title, children }: MyComponentProps) => {
  return <div>{title}</div>;
};

export default MyComponent;
```

### 이벤트 핸들러 네이밍

Props로 전달하는 콜백은 `on` 접두사, 컴포넌트 내부 핸들러는 `handle` 접두사를 사용합니다.

```tsx
type CardProps = {
  onSelectClick: () => void; // ✅ Props: on 접두사
};

const Card = ({ onSelectClick }: CardProps) => {
  const handleClick = () => {
    // ✅ 내부 핸들러: handle 접두사
    onSelectClick();
  };

  return <button onClick={handleClick}>선택</button>;
};
```

### 조건부 렌더링

삼항 연산자는 간단한 경우에만 사용하고, 복잡하면 early return 또는 변수로 분리합니다.

```tsx
// ✅ 간단한 경우
{
  isLoading ? <Spinner /> : <Content />;
}

// ✅ 복잡한 경우 — 변수로 분리
const content = isLoading ? <Spinner /> : hasError ? <ErrorView /> : <Content />;
return <div>{content}</div>;
```

### `key` prop

리스트 렌더링 시 배열 index를 `key`로 사용하지 않습니다. 안정적인 고유 ID를 사용합니다.

```tsx
// ✅ Good
{
  items.map((item) => <Card key={item.id} {...item} />);
}

// ❌ Bad
{
  items.map((item, idx) => <Card key={idx} {...item} />);
}
```

---

## 관련 설정 파일

| 파일                           | 역할                         |
| ------------------------------ | ---------------------------- |
| `.prettierrc`                  | Prettier 포매팅 규칙         |
| `.prettierignore`              | Prettier 제외 대상           |
| `eslint.config.mjs`            | ESLint + TypeScript 규칙     |
| `.husky/pre-commit`            | 커밋 전 lint-staged 실행     |
| `package.json` → `lint-staged` | staged 파일별 실행 작업 정의 |
