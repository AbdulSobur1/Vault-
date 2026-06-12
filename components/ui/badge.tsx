import * as React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "warning" | "danger" | "outline";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "bg-primary text-white dark:bg-white dark:text-primary",
    success: "bg-success/10 text-success border-success/20",
    warning: "bg-accent/10 text-accent border-accent/20",
    danger: "bg-danger/10 text-danger border-danger/20",
    outline: "border border-border text-muted dark:border-dark-border",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
