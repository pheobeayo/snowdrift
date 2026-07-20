import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-medium tracking-wide transition-colors",
  {
    variants: {
      variant: {
        default: "border-teal-600/60 bg-teal-500/10 text-teal-300",
        paid: "border-teal-600/60 bg-teal-500/10 text-teal-300",
        unpaid: "border-line-3 bg-surface-3 text-ink-2",
        open: "border-teal-600/60 bg-teal-500/10 text-teal-300",
        progress: "border-[#f4b860]/40 bg-[#f4b860]/10 text-[#f4b860]",
        review: "border-[#5aa9e6]/40 bg-[#5aa9e6]/10 text-[#5aa9e6]",
        done: "border-line-3 bg-surface-3 text-ink-3",
        points: "border-[#c084fc]/40 bg-[#c084fc]/10 text-[#c084fc]",
        outline: "border-line-3 text-ink-2",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
