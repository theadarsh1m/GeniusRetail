
"use client";

import { Flame } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { type Product } from "@/lib/types";
import { cn } from "@/lib/utils";

interface TrendingScoreProps {
  product: Product;
  className?: string;
}

// Normalize the raw score to a 0-100 scale.
// These max values are estimations and can be adjusted based on real data.
const MAX_VIEWS = 5000;
const MAX_WISHLIST = 1500;
const MAX_TIME_SPENT = 1000; // in minutes

export function calculateTrendingScore(product: Product): number {
  const { views = 0, wishlistCount = 0, timeSpent = 0 } = product;

  // Weighted calculation
  const rawScore = (views * 0.4) + (wishlistCount * 0.3) + (timeSpent * 0.3);

  // Normalization
  const maxPossibleScore = (MAX_VIEWS * 0.4) + (MAX_WISHLIST * 0.3) + (MAX_TIME_SPENT * 0.3);
  const normalizedScore = (rawScore / maxPossibleScore) * 100;

  return Math.min(Math.round(normalizedScore), 100); // Cap at 100
}

export function TrendingScore({ product, className }: TrendingScoreProps) {
  const score = calculateTrendingScore(product);

  const getScoreColor = () => {
    if (score > 80) return "text-red-500";
    if (score > 50) return "text-orange-500";
    return "text-gray-400";
  };
  
  const { views = 0, wishlistCount = 0, timeSpent = 0 } = product;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn("flex items-center space-x-1 cursor-pointer", className)}>
            <Flame className={cn("h-5 w-5", getScoreColor())} />
            <span className={cn("text-sm font-medium", getScoreColor())}>
              {score}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-bold">🔥 Trending!</p>
          <p>Based on high user engagement:</p>
          <ul className="list-disc list-inside text-xs text-muted-foreground">
            <li>{wishlistCount.toLocaleString()} wishlists</li>
            <li>{views.toLocaleString()} views</li>
            <li>{timeSpent.toLocaleString()} total minutes viewed</li>
          </ul>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
