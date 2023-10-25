import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  value: string;
  onClose?: (value: string) => void;
}

function Badge({
  className,
  variant,
  children,
  value,
  onClose,
  ...props
}: BadgeProps) {
  const _onClose = (e: React.MouseEvent<SVGSVGElement>) => {
    e.stopPropagation();
    onClose?.(value);
  };
  return (
    <div
      className={cn(
        badgeVariants({ variant }),
        !!onClose ? "pe-8 relative whitespace-nowrap" : "",
        className
      )}
      {...props}
    >
      {children}
      {!!onClose ? (
        <X
          onClick={_onClose}
          className={cn([
            "w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer",
          ])}
        />
      ) : null}
    </div>
  );
}

export { Badge, badgeVariants };
