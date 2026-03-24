"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/utils";

type RadioFieldProps = {
  id: string;
  name?: string;
  selected?: boolean;
  onSelected?: (selected: boolean) => void;
  radioButton?: boolean;
  label: string;
  icon?: LucideIcon;
  description: string;
  className?: string;
};

const RadioField = ({
  id,
  name,
  selected = false,
  onSelected,
  radioButton = false,
  label,
  icon: Icon,
  description,
  className = "",
}: RadioFieldProps) => {
  return (
    <label
      htmlFor={id}
      className={cn(
        "bg-checkbox flex cursor-pointer items-center gap-3 rounded-4xl border-2 px-5 py-3 transition-colors",
        "has-[:focus-visible]:ring-ring/50 has-[:focus-visible]:ring-[3px]",
        selected ? "border-primary" : "border-transparent",
        className,
      )}
    >
      <input
        id={id}
        type="radio"
        name={name}
        checked={selected}
        onChange={() => onSelected?.(true)}
        className="peer sr-only"
      />
      {radioButton && (
        <span
          aria-hidden="true"
          className={cn(
            "flex size-6 shrink-0 items-center justify-center rounded-full bg-neutral-300 transition",
            selected && "border-primary bg-input border-7",
          )}
        />
      )}
      <div className="flex min-w-0 flex-1 flex-col gap-[7px]">
        <span className="typography-label-base-sb text-foreground truncate">{label}</span>
        <div className="typography-body-sm-reg text-muted-foreground flex items-center gap-[3px]">
          {Icon && <Icon className="h-4.5 w-4.5 shrink-0" />}
          <span className="min-w-0 flex-1 truncate">{description}</span>
        </div>
      </div>
    </label>
  );
};

export default RadioField;
