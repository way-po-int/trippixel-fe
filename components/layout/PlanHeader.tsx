"use client";

import { cn } from "@/lib/utils/utils";
import { Button } from "../ui/button";
import { Pencil, Settings } from "lucide-react";
import HeaderBtn from "./HeaderBtn";
import { useRouter } from "next/navigation";

type PlanHeaderProps = {
  title: string;
  day: number;
  isEditing?: boolean;
  href?: string;
  isEditBudget?: boolean;
  className?: string;
};

const PlanHeader = ({
  title,
  day,
  isEditing = false,
  isEditBudget = false,
  href,
  className,
}: PlanHeaderProps) => {
  const router = useRouter();

  const safeDay = Math.max(day, 1);

  const handleToggleMode = () => {
    if (!href) return;
    router.push(href);
  };

  return (
    <div className={cn("flex w-full items-center justify-between gap-3", className)}>
      <div className="flex min-w-0 flex-1 flex-col items-start gap-1">
        <h2
          className={cn(
            "typography-display-2xl text-foreground",
            "w-full min-w-0 overflow-hidden text-ellipsis whitespace-nowrap",
          )}
        >
          {title}
        </h2>
        <p className="text-muted-foreground typography-body-sm-sb">
          {safeDay === 1 ? "당일치기 여행" : `${safeDay - 1}박 ${safeDay}일 여행`}
        </p>
      </div>

      {!isEditBudget &&
        (isEditing ? (
          // 편집 화면일 때: Header 버튼
          <HeaderBtn
            icon={Settings}
            label="보기 버튼"
            bgVariant="ghost"
            iconClassName="text-muted-foreground"
            onClick={handleToggleMode}
          />
        ) : (
          // 보기 화면일 때: '편집하기' 버튼
          <Button
            variant="default"
            onClick={handleToggleMode}
            className="typography-action-sm-bold h-10 shrink-0 gap-1 rounded-xl px-4 py-2.5"
          >
            <Pencil className="h-4.5 w-4.5 stroke-3 text-black opacity-40" />
            편집하기
          </Button>
        ))}
    </div>
  );
};

export default PlanHeader;
