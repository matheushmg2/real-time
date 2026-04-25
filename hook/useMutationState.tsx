"use client";

import { useMutation } from "convex/react";
import { useState } from "react";
import { FunctionReference } from "convex/server";

export const useMutationState = <T extends FunctionReference<"mutation">>(
  mutationToRun: T
) => {
  const [pending, setPending] = useState(false);

  const mutationFn = useMutation(mutationToRun);

  const mutate = async (payload: T["_args"]): Promise<T["_returnType"]> => {
    setPending(true);

    try {
      const result = await mutationFn(payload);
      return result;
    } catch (error) {
      throw error;
    } finally {
      setPending(false);
    }
  };

  return {
    mutate,
    pending,
  };
};