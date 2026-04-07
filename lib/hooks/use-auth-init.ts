"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { reissue } from "@/lib/api/auth";
import { isLocalDevMockEnabled } from "@/lib/config/local-dev";

export const useAuthInit = () => {
  const router = useRouter();
  const [isReady, setIsReady] = useState(
    () =>
      isLocalDevMockEnabled ||
      (typeof window !== "undefined" && Boolean(window.localStorage.getItem("accessToken"))),
  );

  useEffect(() => {
    if (isLocalDevMockEnabled || isReady) {
      return;
    }

    reissue()
      .then((data) => {
        localStorage.setItem("accessToken", data.access_token);
        setIsReady(true);
      })
      .catch(() => {
        router.replace("/login");
      });
  }, [isReady, router]);

  return { isReady };
};
