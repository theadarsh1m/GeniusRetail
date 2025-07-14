"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MobileOptimizedCardProps {
  children: ReactNode;
  className?: string;
  enableHover?: boolean;
  enableTap?: boolean;
  gradient?: boolean;
}

export function MobileOptimizedCard({
  children,
  className,
  enableHover = true,
  enableTap = true,
  gradient = false,
}: MobileOptimizedCardProps) {
  return (
    <motion.div
      className={cn(
        "relative overflow-hidden rounded-lg border border-border/50",
        "bg-card/50 backdrop-blur-sm shadow-sm",
        "touch-manipulation", // Optimizes touch interactions
        gradient && "bg-gradient-to-br from-card/80 to-card/40",
        className,
      )}
      whileHover={
        enableHover
          ? {
              scale: 1.02,
              y: -2,
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
            }
          : undefined
      }
      whileTap={
        enableTap
          ? {
              scale: 0.98,
              transition: { duration: 0.1 },
            }
          : undefined
      }
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 25,
      }}
    >
      {children}

      {/* Mobile touch indicator */}
      <div className="absolute inset-0 opacity-0 bg-primary/5 pointer-events-none active:opacity-100 transition-opacity duration-150 md:hidden" />
    </motion.div>
  );
}
