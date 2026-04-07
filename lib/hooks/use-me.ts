"use client";

import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { getMe, type UserMeResponse } from "@/lib/api/user";
import { isLocalDevMockEnabled } from "@/lib/config/local-dev";
import { localDevMockMe } from "@/lib/mock/local-dev-data";
import type { ProblemDetail } from "@/types/problem-detail";

type Options = Omit<
  UseQueryOptions<UserMeResponse, AxiosError<ProblemDetail>>,
  "queryKey" | "queryFn"
>;

export const useMe = (options?: Options) => {
  return useQuery<UserMeResponse, AxiosError<ProblemDetail>>({
    queryKey: ["me"],
    queryFn: () => (isLocalDevMockEnabled ? Promise.resolve(localDevMockMe) : getMe()),
    staleTime: 1000 * 60 * 5,
    ...options,
  });
};
