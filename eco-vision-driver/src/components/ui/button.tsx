// import * as React from "react"
// import { Slot } from "@radix-ui/react-slot"
// import { cva, type VariantProps } from "class-variance-authority"
// import { cn } from "@/lib/utils"

// const buttonVariants = cva(
//   [
//     "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium",
//     "transition-[background,box-shadow,transform]",
//     "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/40",
//     "disabled:pointer-events-none disabled:opacity-50",
//     "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
//   ].join(" "),
//   {
//     variants: {
//       variant: {
//         /* 🔵 Primary */
//         default:
//           "bg-primary text-primary-foreground shadow-[var(--button-shadow)] hover:brightness-105 active:shadow-[var(--button-shadow-active)]",

//         /* ⚠️ Destructive */
//         destructive:
//           "bg-destructive/15 text-destructive shadow-[var(--button-shadow)] border border-destructive/30 hover:bg-destructive/25 active:bg-destructive/30 active:shadow-[var(--button-shadow-active)]",
//         /* ⚪ Secondary */
//         secondary:
//           "bg-secondary text-secondary-foreground shadow-[var(--button-shadow)] hover:bg-secondary/90 active:shadow-[var(--button-shadow-active)]",

//         /* 🟤 Outline → surface-based, NOT border-based */
//         outline:
//           "bg-transparent text-foreground shadow-none hover:bg-[var(--elevate-1)] active:bg-[var(--elevate-2)]",

//         /* 👻 Ghost */
//         ghost:
//           "bg-transparent text-foreground shadow-none hover:bg-[var(--elevate-1)] active:bg-[var(--elevate-2)]",
//       },

//       size: {
//         default: "min-h-9 px-4 py-2",
//         sm: "min-h-8 px-3 text-xs",
//         lg: "min-h-10 px-8",
//         icon: "h-9 w-9",
//       },
//     },
//     defaultVariants: {
//       variant: "default",
//       size: "default",
//     },
//   }
// )

// export interface ButtonProps
//   extends React.ButtonHTMLAttributes<HTMLButtonElement>,
//     VariantProps<typeof buttonVariants> {
//   asChild?: boolean
// }

// const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
//   ({ className, variant, size, asChild = false, ...props }, ref) => {
//     const Comp = asChild ? Slot : "button"

//     return (
//       <Comp
//         ref={ref}
//         className={cn(buttonVariants({ variant, size }), className)}
//         {...props}
//       />
//     )
//   }
// )

// Button.displayName = "Button"

// export { Button, buttonVariants }

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium",
    "transition-[background,box-shadow,transform]",
    "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/40",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      variant: {
        /* 🔵 Primary */
        default:
          "bg-primary text-primary-foreground shadow-[var(--button-shadow)] hover:brightness-105 active:shadow-[var(--button-shadow-active)]",

        /* ⚠️ Destructive */
        destructive: [
          "shadow-[var(--button-shadow)]",
          "border border-[var(--destructive-border)]",
          "bg-[var(--destructive-bg)]",
          "text-[color:var(--destructive-foreground)]",
          "hover:bg-[var(--destructive-hover)]",
          "active:shadow-[var(--button-shadow-active)]",
        ].join(" "),

        /* ⚪ Secondary */
        secondary:
          "bg-secondary text-secondary-foreground shadow-[var(--button-shadow)] hover:bg-secondary/90 active:shadow-[var(--button-shadow-active)]",

        /* 🟤 Outline */
        outline: [
          "bg-transparent",
          "text-foreground",
          "border border-[var(--button-outline)]",
          "shadow-none",
          "hover:bg-[var(--elevate-1)]",
          "active:bg-[var(--elevate-2)]",
        ].join(" "),

        /* 👻 Ghost */
        ghost: [
          "bg-transparent",
          "text-foreground",
          "border border-transparent",
          "shadow-none",
          "hover:bg-[var(--elevate-1)]",
          "active:bg-[var(--elevate-2)]",
        ].join(" "),
      },

      size: {
        default: "min-h-9 px-4 py-2",
        sm: "min-h-8 px-3 text-xs",
        lg: "min-h-10 px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"

    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    )
  }
)

Button.displayName = "Button"

export { Button, buttonVariants }
