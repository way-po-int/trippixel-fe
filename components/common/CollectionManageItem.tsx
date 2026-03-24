"use client";

import { Trash2 } from "lucide-react";
import ProfileImage from "./ProfileImage";
import { cn } from "@/lib/utils/utils";

type CollectionManageItemProps = {
  title: string;
  nickname: string;
  src: string;
  onClick?: () => void;
  className?: string;
};

const CollectionManageItem = ({
  title,
  nickname,
  src,
  onClick,
  className,
}: CollectionManageItemProps) => {
  return (
    <div
      className={cn(
        "bg-checkbox flex w-full items-center justify-between gap-1.75 rounded-4xl py-3 pr-3.5 pl-5",
        className,
      )}
    >
      <div className="flex w-full min-w-0 flex-1 flex-col items-start gap-1.75 text-start">
        <span className="typography-label-base-sb text-foreground w-full min-w-0 truncate">
          {title}
        </span>
        <div className="flex w-full min-w-0 items-center gap-1">
          <ProfileImage src={src} alt={nickname} className="size-4" />
          <span className="typography-body-sm-reg w-full min-w-0 truncate text-[#09090B]">
            {nickname}
          </span>
        </div>
      </div>
      <button type="button" onClick={onClick}>
        <Trash2 size={24} className="text-foreground shrink-0" />
      </button>
    </div>
  );
};

export default CollectionManageItem;
