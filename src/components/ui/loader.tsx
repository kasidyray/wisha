import React from "react";
import { cn } from "@/lib/utils";

interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Loader({ className, ...props }: LoaderProps) {
  return (
    <div
      className={cn("animate-spin rounded-full border-2 border-t-transparent", className)}
      {...props}
    />
  );
} 