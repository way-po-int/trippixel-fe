"use client";

import Image from "next/image";
import ProfileImage from "@/components/common/ProfileImage";
import { Button } from "@/components/ui/button";
import { ChevronRight, LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import { useMe } from "@/lib/hooks/use-me";
import { useLogout } from "@/lib/hooks/use-logout";

type SocialProvider = "GOOGLE" | "KAKAO" | "NAVER";

const SOCIAL_PROVIDER_ICON: Record<SocialProvider, string> = {
  GOOGLE: "/icons/google.svg",
  KAKAO: "/icons/kakao.svg",
  NAVER: "/icons/naver.svg",
};

type MypageClientProps = {
  guidUrl: string;
  vocUrl: string;
};

const MypageClient = ({ guidUrl, vocUrl }: MypageClientProps) => {
  const router = useRouter();
  const { data: me } = useMe();
  const { mutate: logoutMutate, isPending: isLogoutPending } = useLogout({
    onSuccess: () => {
      localStorage.removeItem("accessToken");
      router.replace("/login");
    },
  });

  const provider = me?.provider ?? "GOOGLE";
  const nickname = me?.nickname ?? "";
  const email = me?.email ?? "";
  const picture = me?.picture ?? "";

  return (
    <div className="flex min-h-screen flex-col">
      <Header showNotificationButton rightBtnBgVariant="ghost" />
      <div className="flex flex-row items-center gap-3.5 pr-8.5 pb-7 pl-5">
        <ProfileImage src={picture} alt={nickname} size="md" />
        <div className="flex flex-col gap-1">
          <p className="typography-headline-sm-bold">{nickname}</p>
          <p className="typography-body-sm-reg text-neutral-500">{email}</p>
          <div className="flex flex-row items-center gap-2">
            <Image
              src={SOCIAL_PROVIDER_ICON[provider as SocialProvider]}
              alt={provider}
              width={24}
              height={24}
            />
            <p className="typography-body-sm-reg text-neutral-500">{provider} 계정 연동됨</p>
          </div>
        </div>
      </div>
      <div className="flex w-full flex-1 flex-col justify-between gap-2.5 rounded-t-3xl bg-[#f0f0f0] px-5 pt-6 pb-24">
        <div className="flex flex-col gap-9">
          <div className="flex flex-col gap-1">
            <p className="typography-action-sm-bold text-[#a3a3a3]">나의 계정</p>
            <MypageBtn href="/my/edit">회원 정보 수정</MypageBtn>
          </div>
          <div className="flex flex-col gap-1">
            <p className="typography-action-sm-bold text-[#a3a3a3]">도움말</p>
            <MypageBtn onClick={() => window.open(guidUrl, "_blank")}>약관 및 정책</MypageBtn>
            <MypageBtn onClick={() => window.open(vocUrl, "_blank")}>
              소중한 의견 들려주기
            </MypageBtn>
          </div>
        </div>
        <Button
          variant="ghost"
          disabled={isLogoutPending}
          icon={<LogOutIcon size={18} className="opacity-40" />}
          onClick={() => logoutMutate()}
        >
          <p className="typography-action-sm-reg text-neutral-500">로그아웃</p>
        </Button>
      </div>
    </div>
  );
};

const MypageBtn = ({
  children,
  href,
  onClick,
}: {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
}) => {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (href) {
      router.push(href);
    }
  };

  return (
    <Button
      variant="ghost"
      className="flex w-full flex-row justify-between p-0 pr-5"
      onClick={handleClick}
    >
      <div className="typography-body-base">{children}</div>
      <ChevronRight size={20} strokeWidth={2} color="#01012e" className="opacity-13" />
    </Button>
  );
};

export default MypageClient;
