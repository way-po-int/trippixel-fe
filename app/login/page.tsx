"use client";

import Image from "next/image";
import { Suspense, useEffect } from "react";
import { reissue } from "@/lib/api/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useSocialLogin } from "@/lib/hooks/use-social-login";
import KakaoIcon from "@/public/icons/non_bg_kakao.svg";
import NaverIcon from "@/public/icons/non-bg-naver.svg";
import GoogleIcon from "@/public/icons/non_bg_google.svg";

const LoginContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { mutate: login, isPending } = useSocialLogin();

  useEffect(() => {
    const errorCode = searchParams.get("error_code");

    if (errorCode) {
      toast.error("로그인 중 오류가 발생했습니다. 다시 시도해 주세요.");
      return;
    }

    const token = localStorage.getItem("accessToken");
    if (token) {
      router.replace("/home");
      return;
    }

    reissue()
      .then((data) => {
        localStorage.setItem("accessToken", data.access_token);
        router.replace("/home");
      })
      .catch(() => {
        // refreshToken 없거나 만료 → 로그인 버튼 노출 유지
      });
  }, [searchParams, router]);

  return (
    <div className="flex min-h-screen flex-col bg-white px-5">
      <div className="flex flex-1 items-center justify-center">
        <h1>
          <Image
            src="/logo.svg"
            alt="TripPixel"
            width={180}
            height={44}
            priority
            className="h-11 w-auto"
          />
        </h1>
      </div>

      <div className="flex flex-col gap-3 pb-[75px]">
        <Button
          className="relative w-full rounded-xl bg-[#FEE500] text-black hover:bg-[#FEE500]/90"
          disabled={isPending}
          onClick={() => login("kakao")}
        >
          <KakaoIcon width={24} height={20} className="absolute left-4" />
          <span className="typography-action-base-reg">카카오로 시작하기</span>
        </Button>
        <Button
          className="relative w-full rounded-xl bg-[#03A94D] text-white hover:bg-[#03A94D]/90"
          disabled={isPending}
          onClick={() => login("naver")}
        >
          <NaverIcon width={20} height={20} className="absolute left-4" />
          <span className="typography-action-base-reg">네이버로 시작하기</span>
        </Button>
        <Button
          className="relative w-full rounded-xl bg-[#F2F2F2] text-black hover:bg-[#F2F2F2]/90"
          disabled={isPending}
          onClick={() => login("google")}
        >
          <GoogleIcon width={20} height={20} className="absolute left-4" />
          <span className="typography-action-base-reg">구글로 시작하기</span>
        </Button>
      </div>
    </div>
  );
};

const LoginPage = () => (
  <Suspense>
    <LoginContent />
  </Suspense>
);

export default LoginPage;
