import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-body font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground shadow-sm",
        secondary: "border-transparent bg-secondary text-secondary-foreground shadow-sm",
        destructive: "border-transparent bg-destructive text-destructive-foreground shadow-sm",
        outline: "border-primary/40 text-foreground bg-background/80",
        success: "border-transparent bg-success text-success-foreground shadow-sm",
        // Adventure themed badges
        jungle: "border-transparent bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-sm",
        treasure: "border-transparent bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-sm",
        ocean: "border-transparent bg-gradient-to-r from-cyan-400 to-blue-500 text-white shadow-sm",
        sunset: "border-transparent bg-gradient-to-r from-orange-400 to-red-500 text-white shadow-sm",
        earth: "border-transparent bg-gradient-to-r from-amber-600 to-amber-800 text-white shadow-sm",
        sky: "border-transparent bg-gradient-to-r from-sky-400 to-blue-400 text-white shadow-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };