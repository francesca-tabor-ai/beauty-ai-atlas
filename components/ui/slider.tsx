"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type SliderProps = React.InputHTMLAttributes<HTMLInputElement>;

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, type = "range", ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Slider.displayName = "Slider";

export { Slider };

