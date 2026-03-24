"use client";

import { cn } from "@/lib/utils/utils";
import Divider from "../Divider";
import HeaderBtn from "@/components/layout/HeaderBtn";
import { Pencil } from "lucide-react";

type PlanTimeProps = {
  blockStatus: "FIXED" | "PENDING" | "DIRECT";
  startTime: string;
  address: string;
  isFirst?: boolean;
  isLast?: boolean;
  isFree?: boolean;
  isEdit?: boolean;
  onMenuClick?: () => void;
};

const PlanTime = ({
  blockStatus,
  startTime,
  address,
  isFirst = false,
  isLast = false,
  isFree = false,
  isEdit = false,
  onMenuClick,
}: PlanTimeProps) => {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex min-w-0 flex-1 items-center gap-6">
        {/* 타임라인 원 */}
        <div className="flex h-full w-1.75 flex-col items-center">
          {/* 첫 일정은 윗 선 안보이게 처리 */}
          <Divider className={cn("h-3 w-px rotate-180 bg-[#D9D9D9]", isFirst && "opacity-0")} />
          {/* 원 */}
          <div className="relative h-3 w-3">
            <div className="absolute inset-0 scale-150 rounded-full bg-white/[0.002]" />
            <div className="border-primary relative h-3 w-3 rounded-full border-2 bg-white shadow-sm" />
          </div>
          {/* 마지막 일정은 아랫 선 안보이게 처리 */}
          <Divider className={cn("h-3 w-px rotate-180 bg-[#D9D9D9]", isLast && "opacity-0")} />
        </div>
        {/* 시작 시간 / 주소 */}
        <div className="flex min-w-0 items-center gap-2">
          <span className="typography-body-sm-sb">{startTime}</span>
          {!isFree && (
            <>
              <Divider className="bg-border h-3 w-px rotate-180" />
              <span className="typography-body-sm-reg text-muted-foreground truncate">
                {address}
              </span>
            </>
          )}
        </div>
      </div>
      {blockStatus === "PENDING" && isEdit === true && (
        // 후보지 있는 블록 메뉴 버튼
        <HeaderBtn
          icon={Pencil}
          label="메뉴"
          onClick={onMenuClick}
          className="size-9"
          iconClassName="text-muted-foreground"
        />
      )}
    </div>
  );
};

export default PlanTime;
