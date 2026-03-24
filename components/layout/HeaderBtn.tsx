"use client";

import { type LucideIcon } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils/utils";

type HeaderBtnBgVariant = "solid" | "glass" | "ghost";

type HeaderBtnProps = {
  bgVariant?: HeaderBtnBgVariant;
  icon: LucideIcon;
  label: string;
  showDot?: boolean;
  disabled?: boolean;
  className?: string;
  iconClassName?: string;
  onClick?: () => void;
};

const HeaderBtn = ({
  bgVariant = "solid",
  icon: Icon,
  label,
  showDot = false,
  disabled = false,
  iconClassName,
  className,
  onClick,
}: HeaderBtnProps) => {
  return (
    <div className="relative">
      <Button
        variant="ghost"
        aria-label={label}
        onClick={onClick}
        disabled={disabled}
        className={cn(
          "size-11 rounded-full p-2.5",
          bgVariant === "solid" && "bg-[#FAFAFA]",
          bgVariant === "glass" && "bg-[#FAFAFA]/60 backdrop-blur-sm",
          bgVariant === "ghost" && "bg-transparent backdrop-blur-xl",
          disabled ? "cursor-not-allowed" : "cursor-pointer",
          className,
        )}
      >
        {Icon && (
          <Icon
            className={cn("text-foreground size-6", disabled && "text-disabled", iconClassName)}
          />
        )}
      </Button>
      {showDot && <div className="absolute top-2 right-2.5 size-1 rounded-full bg-[#0EA5E9]" />}
    </div>
  );
};

export default HeaderBtn;
export type { HeaderBtnBgVariant };
