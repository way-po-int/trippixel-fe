const ENV_VARS = {
  SERVICE_TERMS_URL: "NEXT_PUBLIC_SERVICE_TERMS_URL",
  PRIVACY_POLICY_URL: "NEXT_PUBLIC_PRIVACY_POLICY_URL",
  GUIDE_URL: "NEXT_PUBLIC_GUIDE_URL",
  VOC_URL: "NEXT_PUBLIC_VOC_URL",
  GOOGLE_MAPS_API_KEY: "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY",
  API_BASE_URL: "NEXT_PUBLIC_API_BASE_URL",
  IMAGE_DOMAINS: "NEXT_PUBLIC_IMAGE_DOMAINS",
} as const;

const DEFAULT_EXTERNAL_URL = "about:blank";

const createEnvError = (envVar: string) => `${envVar} 환경변수가 설정되지 않았습니다.`;

const warnMissingEnv = (envVar: string, fallback: string) => {
  if (typeof window === "undefined") {
    console.warn(`${envVar} not found. Falling back to ${fallback}.`);
  }
};

const getRequiredEnv = (envVar: string, errorMessage: string): string => {
  const value = process.env[envVar];

  if (!value) {
    throw new Error(errorMessage);
  }

  return value;
};

const getOptionalUrl = (envVar: string, fallback = DEFAULT_EXTERNAL_URL): string => {
  const value = process.env[envVar];

  if (value) {
    return value;
  }

  warnMissingEnv(envVar, fallback);
  return fallback;
};

export const env = {
  urls: {
    get serviceTerms() {
      return getOptionalUrl(ENV_VARS.SERVICE_TERMS_URL);
    },
    get privacyPolicy() {
      return getOptionalUrl(ENV_VARS.PRIVACY_POLICY_URL);
    },
    get guide() {
      return getOptionalUrl(ENV_VARS.GUIDE_URL);
    },
    get voc() {
      return getOptionalUrl(ENV_VARS.VOC_URL);
    },
  },

  api: {
    get baseUrl() {
      return getRequiredEnv(ENV_VARS.API_BASE_URL, createEnvError(ENV_VARS.API_BASE_URL));
    },
    get googleMapsKey() {
      return getRequiredEnv(
        ENV_VARS.GOOGLE_MAPS_API_KEY,
        createEnvError(ENV_VARS.GOOGLE_MAPS_API_KEY),
      );
    },
  },

  images: {
    get domains() {
      return getRequiredEnv(ENV_VARS.IMAGE_DOMAINS, createEnvError(ENV_VARS.IMAGE_DOMAINS));
    },
  },
} as const;
