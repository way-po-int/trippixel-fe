// 환경변수 이름 상수
const ENV_VARS = {
  SERVICE_TERMS_URL: "NEXT_PUBLIC_SERVICE_TERMS_URL",
  PRIVACY_POLICY_URL: "NEXT_PUBLIC_PRIVACY_POLICY_URL",
  GUIDE_URL: "NEXT_PUBLIC_GUIDE_URL",
  VOC_URL: "NEXT_PUBLIC_VOC_URL",
  GOOGLE_MAPS_API_KEY: "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY",
  API_BASE_URL: "NEXT_PUBLIC_API_BASE_URL",
  IMAGE_DOMAINS: "NEXT_PUBLIC_IMAGE_DOMAINS",
  GA_MEASUREMENT_ID: "NEXT_PUBLIC_GA_MEASUREMENT_ID",
} as const;

// 빌드 시간 환경변수 검증
if (typeof window === "undefined") {
  const requiredEnvVars = [
    ENV_VARS.SERVICE_TERMS_URL,
    ENV_VARS.PRIVACY_POLICY_URL,
    ENV_VARS.GUIDE_URL,
    ENV_VARS.VOC_URL,
    ENV_VARS.GOOGLE_MAPS_API_KEY,
    ENV_VARS.API_BASE_URL,
    ENV_VARS.IMAGE_DOMAINS,
  ];

  const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0) {
    throw new Error(
      `필요한 환경변수가 없습니다: ${missingVars.join(", ")}\n` +
        ".env 파일을 확인하고 개발 서버를 재시작해주세요.",
    );
  }
}

const getRequiredUrl = (envVar: string, errorMessage: string): string => {
  const url = process.env[envVar];
  if (!url) {
    throw new Error(errorMessage);
  }
  return url;
};

const getRequiredEnv = (envVar: string, errorMessage: string): string => {
  const value = process.env[envVar];
  if (!value) {
    throw new Error(errorMessage);
  }
  return value;
};

const getOptionalEnv = (envVar: string): string | undefined => {
  const value = process.env[envVar];
  return value || undefined;
};

// 에러 메시지 생성 헬퍼 함수
const createEnvError = (envVar: string) => `${envVar} 환경변수가 설정되지 않았습니다.`;

// 용도별로 그룹화된 환경변수
export const env = {
  // 외부 서비스 URL들
  urls: {
    serviceTerms: getRequiredUrl(
      ENV_VARS.SERVICE_TERMS_URL,
      createEnvError(ENV_VARS.SERVICE_TERMS_URL),
    ),
    privacyPolicy: getRequiredUrl(
      ENV_VARS.PRIVACY_POLICY_URL,
      createEnvError(ENV_VARS.PRIVACY_POLICY_URL),
    ),
    guide: getRequiredUrl(ENV_VARS.GUIDE_URL, createEnvError(ENV_VARS.GUIDE_URL)),
    voc: getRequiredUrl(ENV_VARS.VOC_URL, createEnvError(ENV_VARS.VOC_URL)),
  },

  // API 설정
  api: {
    baseUrl: getRequiredUrl(ENV_VARS.API_BASE_URL, createEnvError(ENV_VARS.API_BASE_URL)),
    googleMapsKey: getRequiredEnv(
      ENV_VARS.GOOGLE_MAPS_API_KEY,
      createEnvError(ENV_VARS.GOOGLE_MAPS_API_KEY),
    ),
  },

  // 이미지 최적화
  images: {
    domains: getRequiredEnv(ENV_VARS.IMAGE_DOMAINS, createEnvError(ENV_VARS.IMAGE_DOMAINS)),
  },

  analytics: {
    gaMeasurementId: getOptionalEnv(ENV_VARS.GA_MEASUREMENT_ID),
  },
} as const;
