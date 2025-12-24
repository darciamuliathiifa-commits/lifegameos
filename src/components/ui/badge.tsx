import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-gradient-to-r from-primary to-emerald-500 text-primary-foreground shadow-sm",
        secondary: "border-transparent bg-gradient-to-r from-secondary to-amber-400 text-secondary-foreground shadow-sm",
        destructive: "border-transparent bg-gradient-to-r from-destructive to-red-500 text-white shadow-sm",
        outline: "border-secondary/50 text-secondary bg-secondary/10",
        success: "border-transparent bg-gradient-to-r from-success to-emerald-400 text-white shadow-sm",
        accent: "border-transparent bg-gradient-to-r from-accent to-teal-400 text-accent-foreground shadow-sm",
        pyro: "border-transparent bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-sm",
        hydro: "border-transparent bg-gradient-to-r from-blue-400 to-cyan-500 text-white shadow-sm",
        anemo: "border-transparent bg-gradient-to-r from-teal-400 to-emerald-500 text-white shadow-sm",
        electro: "border-transparent bg-gradient-to-r from-purple-500 to-violet-600 text-white shadow-sm",
        dendro: "border-transparent bg-gradient-to-r from-green-600 to-emerald-500 text-white shadow-sm",
        geo: "border-transparent bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-800 shadow-sm",
        cryo: "border-transparent bg-gradient-to-r from-cyan-300 to-blue-300 text-slate-700 shadow-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
