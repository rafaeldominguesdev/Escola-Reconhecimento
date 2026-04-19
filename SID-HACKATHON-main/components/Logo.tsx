import React from "react";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const Logo = ({ size = "md", className }: LogoProps) => {
  const sizes = {
    sm: { text: "text-xl", dot: "w-2.5 h-2.5", rays: "h-1.5", gap: "gap-1" },
    md: { text: "text-3xl", dot: "w-3.5 h-3.5", rays: "h-2.5", gap: "gap-1.5" },
    lg: { text: "text-6xl", dot: "w-6 h-6", rays: "h-4", gap: "gap-2" }
  };

  const current = sizes[size];

  return (
    <div className={cn("flex items-center gap-1.5 select-none", className)}>
      <div className="relative">
        <span className={cn("font-serif font-black text-sid-black", current.text)}>s</span>
        <div className="inline-block relative">
          <span className={cn("font-serif font-black text-sid-black", current.text)}>i</span>
          {/* Green dot on top of the 'i' */}
          <div className={cn(
            "absolute left-1/2 -translate-x-1/2 flex flex-col items-center",
            size === "lg" ? "-top-[2.2rem]" : size === "sm" ? "-top-[0.8rem]" : "-top-[1.1rem]"
          )}>
            {/* Rays */}
            <div className={cn("flex mb-0.5 animate-pulse", current.gap)}>
              <div className={cn("w-0.5 bg-sid-yellow rounded-full -rotate-[45deg] origin-bottom", current.rays)} />
              <div className={cn("w-0.5 bg-sid-yellow rounded-full", current.rays)} />
              <div className={cn("w-0.5 bg-sid-yellow rounded-full rotate-[45deg] origin-bottom", current.rays)} />
            </div>
            {/* Dot */}
            <div className={cn("bg-sid-green rounded-full shadow-[0_0_15px_rgba(46,204,113,0.4)]", current.dot)} />
          </div>
        </div>
        <span className={cn("font-serif font-black text-sid-black truncate", current.text)}>d.</span>
      </div>
    </div>
  );
};

export default Logo;
