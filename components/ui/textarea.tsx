import * as React from "react";

import { cn } from "@/lib/utils/utils";

type TextareaProps = React.ComponentProps<"textarea"> & {
  error?: boolean;
};

function Textarea({ className, error, ...props }: TextareaProps) {
  return (
    <div className="relative w-full">
      <textarea
        data-slot="textarea"
        aria-invalid={error || undefined}
        className={cn(
          "flex field-sizing-content min-h-11 w-full rounded-xl bg-[#F0F0F0] px-3 py-3",
          "typography-body-sm-reg text-foreground",
          "placeholder:text-muted-foreground",
          "border border-transparent outline-none",
          "resize-y transition-all",
          "focus:border-sky-500 focus:ring-2 focus:ring-sky-500/25",
          "disabled:bg-border disabled:cursor-not-allowed disabled:opacity-100",
          "aria-invalid:border-destructive aria-invalid:ring-0",
          className,
        )}
        {...props}
      />
      {/* <div className="pointer-events-none absolute bottom-2 right-3 size-2 rounded-[1px] bg-[#A3A3A3]" /> */}
    </div>
  );
}

export { Textarea };
export type { TextareaProps };
