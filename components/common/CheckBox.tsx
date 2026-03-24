"use client";

import { cn } from "@/lib/utils/utils";
import { Checkbox } from "../ui/checkbox";

type CheckBoxProps = {
  id?: string;
  name?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
};

const CheckBox = ({ id, name, checked, onCheckedChange, className }: CheckBoxProps) => {
  return (
    <Checkbox
      id={id}
      name={name}
      checked={checked}
      onCheckedChange={(value) => onCheckedChange?.(value === true)}
      className={cn(
        "size-6 rounded-full border-none bg-neutral-300 shadow-none",
        "data-[state=checked]:bg-sky-500",
        className,
      )}
    />
  );
};

export default CheckBox;
