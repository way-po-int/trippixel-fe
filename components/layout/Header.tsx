"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils/utils";
import { useRouter } from "next/navigation";
import HeaderBtn, { type HeaderBtnBgVariant } from "./HeaderBtn";
import { ArrowLeft, Bell, X } from "lucide-react";
import MemberSideDrawer from "../common/MemberSideDrawer";
import { useNotificationDrawer } from "@/lib/context/notification-drawer-context";

type HeaderProps = {
  // 헤더 레이아웃 타입
  variant?: "left" | "center" | "logo";
  // 타이틀 텍스트
  title?: string;
  // 좌측 버튼
  showBackButton?: boolean;
  onBack?: () => void;
  // 우측 버튼
  showCloseButton?: boolean;
  showNotificationButton?: boolean;
  showNotificationDot?: boolean;
  showMenuButton?: boolean;
  onClose?: () => void;
  onNotification?: () => void;
  menuDrawerContent?: React.ReactNode;
  // 우측 커스텀 컨텐츠 (텍스트 버튼 등)
  rightContent?: React.ReactNode;
  // 스타일
  leftBtnBgVariant?: HeaderBtnBgVariant;
  rightBtnBgVariant?: HeaderBtnBgVariant;
  className?: string;
};

const Header = ({
  variant = "left",
  title = "",
  showBackButton = false,
  showCloseButton = false,
  showNotificationButton = false,
  showNotificationDot = false,
  showMenuButton = false,
  onBack,
  onClose,
  onNotification,
  rightContent,
  leftBtnBgVariant = "solid",
  rightBtnBgVariant = "solid",
  className = "",
}: HeaderProps) => {
  const router = useRouter();
  const { openDrawer } = useNotificationDrawer();

  // 기본 뒤로가기 핸들러
  const handleBack = () => (onBack ? onBack() : router.back());

  // 기본 닫기 핸들러
  const handleClose = () => (onClose ? onClose() : router.back());

  // 기본 알림 핸들러
  const handleNotification = () => (onNotification ? onNotification() : openDrawer());

  return (
    <header
      className={cn(
        "grid h-15 w-full grid-cols-[1fr_auto_1fr] items-center justify-between gap-2 bg-transparent px-2.5 pt-3.5 pb-0.5",
        className,
      )}
    >
      {/* 좌측 영역 */}
      <div className="flex items-center justify-start">
        {showBackButton && (
          <HeaderBtn
            bgVariant={leftBtnBgVariant}
            icon={ArrowLeft}
            onClick={handleBack}
            label="뒤로가기"
          />
        )}

        {variant === "logo" && (
          <h1>
            <Link
              href="/"
              className="flex items-center text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
              aria-label="TripPixel 홈"
            >
              <Image
                src="/logo.svg"
                alt="TripPixel"
                width={114}
                height={28}
                priority
                className="h-7 w-auto"
              />
            </Link>
          </h1>
        )}
      </div>

      {/* 중앙 타이틀 (center variant) */}
      <div className="min-w-0">
        {variant === "center" && title ? (
          <h1 className="typography-display-xl text-foreground truncate text-center">{title}</h1>
        ) : null}
      </div>

      {/* 우측 영역 */}
      <div className="flex items-center justify-end">
        {rightContent}

        {showNotificationButton && (
          <HeaderBtn
            bgVariant={rightBtnBgVariant}
            icon={Bell}
            onClick={handleNotification}
            label="알림"
            showDot={showNotificationDot}
          />
        )}

        {showCloseButton && (
          <HeaderBtn bgVariant={rightBtnBgVariant} icon={X} onClick={handleClose} label="닫기" />
        )}

        {showMenuButton && (
          <MemberSideDrawer
            title="제주도 여행"
            variant="COLLECTION"
            rightBtnBgVariant={rightBtnBgVariant}
          />
        )}
      </div>
    </header>
  );
};

export default Header;
