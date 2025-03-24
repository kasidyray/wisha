import React from "react";
import { cn } from "@/lib/utils";

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  withText?: boolean;
  text?: string;
}

export function Spinner({ 
  className, 
  size = 'md', 
  withText = false, 
  text = "Loading...",
  ...props 
}: SpinnerProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className={cn(
          "animate-spin rounded-full border-t-2 border-b-2 border-primary mx-auto", 
          sizeClasses[size],
          className
        )}
        {...props}
      />
      {withText && <p className="text-lg mt-4">{text}</p>}
    </div>
  );
} 