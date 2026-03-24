"use client";

import { cn } from "@/lib/utils/utils";
import CheckBox from "./CheckBox";
import type { LucideIcon } from "lucide-react";

type CheckBoxFieldProps = {
  id: string;
  name?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label: string;
  icon?: LucideIcon;
  description: string;
  className?: string;
  iconClassName?: string;
};

const CheckBoxField = ({
  id,
  name,
  checked,
  onCheckedChange,
  label,
  icon: Icon,
  description,
  className = "",
  iconClassName = "",
}: CheckBoxFieldProps) => {
  return (
    <label
      htmlFor={id}
      className={cn(
        "bg-checkbox flex w-full cursor-pointer items-center gap-3 rounded-4xl px-5 py-3 transition-colors",
        className,
      )}
    >
      <CheckBox
        id={id}
        name={name}
        checked={checked}
        onCheckedChange={(value) => onCheckedChange?.(value === true)}
      />
      <div className="flex min-w-0 flex-1 flex-col gap-[7px]">
        <span className="typography-label-base-sb text-foreground truncate">{label}</span>
        <div className="typography-body-sm-reg text-muted-foreground flex items-center gap-[3px]">
          {Icon && <Icon className={cn("h-4.5 w-4.5 shrink-0", iconClassName)} />}
          <span className="min-w-0 flex-1 truncate">{description}</span>
        </div>
      </div>
    </label>
  );
};

export default CheckBoxField;
