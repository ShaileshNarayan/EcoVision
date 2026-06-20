import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Badge variants using Tailwind v3
const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-secondary text-secondary-foreground border-transparent",
        assigned: "bg-blue-500/10 text-blue-600 border-blue-500/20",
        resolved: "bg-chart-1/10 text-chart-1 border-chart-1/20",
        pending: "bg-chart-2/10 text-chart-2 border-chart-2/20",
        secondary: "bg-secondary text-secondary-foreground border-transparent",
        outline: "text-foreground border border-border bg-transparent", // <-- added
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)



export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}


