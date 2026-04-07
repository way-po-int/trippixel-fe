import axios from "axios";

export const getApiBaseUrl = (): string => {
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!baseURL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not set");
  }

  return baseURL;
};

export const apiClient = axios.create({
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  config.baseURL ??= getApiBaseUrl();

  if (typeof window !== "undefined") {
    const token = window.localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 403 && typeof window !== "undefined") {
      const code = error.response?.data?.code;

      if (code === "TERMS_REQUIRED") {
        window.location.href = "/onboard";
        return Promise.reject(error);
      }

      if (code === "GUEST_FORBIDDEN") {
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
        return Promise.reject(error);
      }
    }

    if (error.response?.status === 401) {
      const code = error.response?.data?.code;

      if (code === "MISSING_TOKEN" || code === "INVALID_TOKEN") {
        if (typeof window !== "undefined") {
          localStorage.removeItem("accessToken");
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }

      if (!originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const { data } = await axios.post<{ access_token: string }>(
            `${getApiBaseUrl()}auth/reissue`,
            null,
            { withCredentials: true },
          );

          if (typeof window !== "undefined") {
            localStorage.setItem("accessToken", data.access_token);
          }
          originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
          return apiClient(originalRequest);
        } catch {
          if (typeof window !== "undefined") {
            localStorage.removeItem("accessToken");
            window.location.href = "/login";
          }
        }
      }
    }

    return Promise.reject(error);
  },
);
