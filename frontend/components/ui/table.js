"use client";

import { cn } from "../../lib/utils";

export function Table({ className, ...props }) {
  return (
    <table
      className={cn("w-full text-sm text-left text-foreground border-collapse", className)}
      {...props}
    />
  );
}

export function Thead({ className, ...props }) {
  return (
    <thead className={cn("bg-card/80 border-b border-border", className)} {...props} />
  );
}

export function Tbody({ className, ...props }) {
  return <tbody className={cn("divide-y divide-border", className)} {...props} />;
}

export function Tr({ className, ...props }) {
  return <tr className={cn("hover:bg-muted/40", className)} {...props} />;
}

export function Th({ className, ...props }) {
  return (
    <th
      className={cn("px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground", className)}
      {...props}
    />
  );
}

export function Td({ className, ...props }) {
  return <td className={cn("px-3 py-2 align-middle", className)} {...props} />;
}

