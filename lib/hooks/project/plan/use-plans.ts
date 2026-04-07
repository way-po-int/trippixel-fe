"use client";

import {
  useInfiniteQuery,
  type UseInfiniteQueryOptions,
  type InfiniteData,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { type ProblemDetail } from "@/types/problem-detail";
import type { GetPlansParams, PlanListResponse } from "@/types/plan";
import { getPlans } from "@/lib/api/plan";
import { isLocalDevMockEnabled } from "@/lib/config/local-dev";
import { createLocalDevPlans } from "@/lib/mock/local-dev-data";

type PlansQueryKey = readonly ["plans", { size: number }];

type Options = Omit<
  UseInfiniteQueryOptions<
    PlanListResponse,
    AxiosError<ProblemDetail>,
    InfiniteData<PlanListResponse, number>,
    PlansQueryKey,
    number
  >,
  "queryKey" | "queryFn" | "initialPageParam" | "getNextPageParam"
>;

export const usePlans = (params?: Omit<GetPlansParams, "page">, options?: Options) => {
  const size = params?.size ?? 10;

  return useInfiniteQuery<
    PlanListResponse,
    AxiosError<ProblemDetail>,
    InfiniteData<PlanListResponse, number>,
    PlansQueryKey,
    number
  >({
    queryKey: ["plans", { size }] as const,
    queryFn: ({ pageParam = 0 }) =>
      isLocalDevMockEnabled
        ? Promise.resolve({ ...createLocalDevPlans(size), page: pageParam })
        : getPlans({ page: pageParam, size }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => (lastPage.has_next ? lastPage.page + 1 : undefined),
    ...options,
  });
};
