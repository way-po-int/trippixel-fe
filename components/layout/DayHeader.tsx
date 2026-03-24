"use client";

import * as React from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils/utils";

type DayHeaderProps = {
  /** Controlled */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Uncontrolled */
  defaultOpen?: boolean;
  /** 헤더 텍스트 */
  day: number;
  date: string;
  /** 펼쳐지는 컨텐츠 */
  children?: React.ReactNode;
  /** 비활성 */
  disabled?: boolean;
  /** 스타일 */
  className?: string;
  contentClassName?: string;
  /** 접근성 */
  id?: string; // content id(없으면 자동 생성)
};

export const DayHeader = ({
  open,
  onOpenChange,
  defaultOpen = false,
  day,
  date,
  children,
  disabled = false,
  className,
  id,
  contentClassName,
}: DayHeaderProps) => {
  const contentId = React.useId();
  const panelId = id ?? `dayheader-panel-${contentId}`;

  const isControlled = typeof open === "boolean";
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);

  const isOpen = isControlled ? (open as boolean) : uncontrolledOpen;

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (disabled) return;
      if (!isControlled) setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [disabled, isControlled, onOpenChange],
  );

  const toggle = React.useCallback(() => {
    if (disabled) return;
    setOpen(!isOpen);
  }, [disabled, isOpen, setOpen]);

  return (
    <section className={cn("w-full", className)}>
      {/* Header (clickable) */}
      <button
        aria-expanded={isOpen}
        aria-controls={panelId}
        aria-disabled={disabled}
        disabled={disabled}
        onClick={toggle}
        className={cn(
          "border-border/60 flex h-20.5 w-full cursor-pointer items-center justify-between gap-3 border-b-[0.67px] px-5 py-4",
          disabled ? "cursor-not-allowed" : "cursor-pointer",
        )}
      >
        <div className="flex items-center gap-4">
          <span className="bg-primary/10 typography-display-xl text-primary flex h-12 w-12 items-center justify-center rounded-[18px]">
            {day}
          </span>
          <div className="flex flex-col items-start gap-0.5">
            <h3 className="typography-display-xl text-foreground">DAY {day}</h3>
            <p className="typography-body-sm-reg text-muted-foreground">{date}</p>
          </div>
        </div>

        <ChevronRight
          className={cn(
            "size-6 transition-transform duration-200",
            isOpen && "rotate-90",
            disabled && "text-disabled",
          )}
          aria-hidden="true"
        />
      </button>

      {/* Content */}
      <div id={panelId} hidden={!isOpen} className={contentClassName}>
        {children}
      </div>
    </section>
  );
};
