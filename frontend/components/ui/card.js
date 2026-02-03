"use client";

import { cn } from "../../lib/utils";

export function Card({ className, ...props }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-slate-800 bg-slate-900/80 shadow-sm p-4",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }) {
  return <div className={cn("mb-2 flex items-center justify-between", className)} {...props} />;
}

export function CardTitle({ className, ...props }) {
  return <h3 className={cn("font-semibold text-slate-50", className)} {...props} />;
}

export function CardContent({ className, ...props }) {
  return <div className={cn("text-sm text-slate-300", className)} {...props} />;
}

