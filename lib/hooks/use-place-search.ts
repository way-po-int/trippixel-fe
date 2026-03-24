"use client";

import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { PlaceSearchItem } from "@/lib/api/place";
import { searchPlaces } from "@/lib/api/place";
import type { ProblemDetail } from "@/types/problem-detail";
import { useDebounce } from "./use-debounce";

type PlaceSearchQueryKey = readonly ["place-search", { query: string }];

type Options = Omit<
  UseQueryOptions<
    PlaceSearchItem[],
    AxiosError<ProblemDetail>,
    PlaceSearchItem[],
    PlaceSearchQueryKey
  >,
  "queryKey" | "queryFn" | "enabled"
>;

export const usePlaceSearch = (query: string, debounceMs: number = 400, options?: Options) => {
  const debouncedQuery = useDebounce(query, debounceMs);

  return useQuery<
    PlaceSearchItem[],
    AxiosError<ProblemDetail>,
    PlaceSearchItem[],
    PlaceSearchQueryKey
  >({
    queryKey: ["place-search", { query: debouncedQuery }] as const,
    queryFn: () => searchPlaces(debouncedQuery),
    enabled: debouncedQuery.length >= 2,
    staleTime: 5 * 60 * 1000, // 5분 동안 캐시 유지
    gcTime: 10 * 60 * 1000, // 10분 후 캐시 정리
    ...options,
  });
};
