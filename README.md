# TripPixel FE

트립픽셀 프론트엔드 프로젝트입니다.

## 기본 실행

의존성 설치:

```bash
pnpm install
```

로컬 개발 서버 실행:

```bash
pnpm dev
```

브라우저에서 `http://localhost:3000`으로 접속합니다.

프로덕션 빌드 확인:

```bash
pnpm build
```

## Storybook

Storybook은 컴포넌트 UI를 페이지와 분리해서 빠르게 확인할 때 사용합니다.

실행:

```bash
pnpm storybook
```

정적 빌드:

```bash
pnpm build-storybook
```

현재 카드 컴포넌트 기본 stories가 포함되어 있어, 화면 전체를 띄우지 않고도 카드 레이아웃과 이미지 렌더링을 따로 확인할 수 있습니다.

## Local Mock Mode

로그인, 백엔드 상태, 외부 API 상태에 덜 의존하면서 페이지 개발을 진행하기 위한 로컬 전용 개발 모드입니다.

`.env.local`에 아래 값을 추가하면 활성화됩니다.

```env
NEXT_PUBLIC_LOCAL_DEV_MOCK=true
```

이 모드에서 지원하는 범위:

- 인증 진입 시 로그인 게이트 우회
- `/home` 보관함 목록 mock 데이터 제공
- `/projects` 여행 계획 목록 mock 데이터 제공
- `/my` 마이페이지 사용자 정보 mock 데이터 제공
- 로그아웃 시 실제 API 호출 없이 로컬 상태만 정리

이 모드는 어디까지나 로컬 개발 편의를 위한 기능입니다. 실제 서비스 동작 검증, 실제 인증 흐름 검증, 실제 API 응답 검증은 mock 모드를 끄고 확인해야 합니다.

## Mock 데이터 원칙

로컬 mock 데이터는 의도적으로 외부 이미지 URL 대신 로컬 정적 에셋을 사용합니다.

이유:

- 외부 이미지 응답 상태에 따라 개발환경이 흔들리지 않게 하기 위해
- 로그인 문제와 이미지 문제를 분리해서 보기 위해
- 페이지 레이아웃과 상태 흐름을 먼저 안정적으로 확인하기 위해

즉 local mock mode의 목표는 "화면 개발이 막히지 않는 안정적인 로컬 환경"입니다.

반대로 외부 이미지 문제를 재현하거나 실제 네트워크 응답을 확인하고 싶다면 Storybook 또는 실제 API 모드에서 따로 확인하는 것이 맞습니다.

## Vercel 배포와의 관계

현재 Storybook과 local mock mode는 기본 애플리케이션 빌드 경로와 분리되어 있습니다.

중요한 점:

- Vercel 기본 배포는 애플리케이션 빌드 기준으로 동작합니다.
- Storybook은 `pnpm storybook`, `pnpm build-storybook`로만 실행합니다.
- 따라서 Vercel의 Build Command를 별도로 바꾸지 않으면 Storybook 추가만으로 운영 배포가 바뀌지 않습니다.
- `NEXT_PUBLIC_LOCAL_DEV_MOCK=true`는 반드시 `.env.local`에서만 사용하는 것을 전제로 합니다.
- 이 값을 Vercel 환경변수에 넣지 않으면 운영/프리뷰 배포에는 영향을 주지 않습니다.

정리하면:

- Storybook 추가: 운영 배포 영향 없음
- local mock mode: 로컬 `.env.local`에서만 켜면 운영 배포 영향 없음

## 권장 사용 방식

1. 컴포넌트 UI만 빠르게 확인할 때

```bash
pnpm storybook
```

2. 로그인 없이 페이지 단위 개발을 할 때

`.env.local`

```env
NEXT_PUBLIC_LOCAL_DEV_MOCK=true
```

그다음:

```bash
pnpm dev
```

3. 실제 서비스 흐름을 검증할 때

- `NEXT_PUBLIC_LOCAL_DEV_MOCK` 값을 제거하거나 `false`로 변경
- 실제 API와 실제 인증 흐름으로 확인
