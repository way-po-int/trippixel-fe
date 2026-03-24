"use client";

import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { type ProblemDetail } from "@/types/problem-detail";
import { type CreatePlanRequest, type PlanResponse } from "@/types/plan";
import { createPlan } from "@/lib/api/plan";

type Options = Omit<
  UseMutationOptions<PlanResponse, AxiosError<ProblemDetail>, CreatePlanRequest>,
  "mutationFn"
>;

export const useCreatePlan = (options?: Options) => {
  const queryClient = useQueryClient();

  return useMutation<PlanResponse, AxiosError<ProblemDetail>, CreatePlanRequest>({
    mutationFn: createPlan,
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });

      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};
