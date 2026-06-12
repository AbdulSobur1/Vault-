import * as React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "warning" | "danger" | "outline";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "bg-bg-elevated text-text-primary",
    success: "bg-success/10 text-success border-success/20",
    warning: "bg-accent-gold/10 text-accent-gold border-accent-gold/20",
    danger: "bg-red-500/10 text-red-500 border-red-500/20",
    outline: "border border-border text-text-secondary",
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
