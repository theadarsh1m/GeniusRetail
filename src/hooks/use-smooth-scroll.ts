"use client";

import { useCallback } from "react";

interface SmoothScrollOptions {
  duration?: number;
  easing?: "linear" | "easeInOut" | "easeIn" | "easeOut";
  offset?: number;
}

export function useSmoothScroll() {
  const scrollTo = useCallback(
    (target: string | number, options: SmoothScrollOptions = {}) => {
      const { duration = 1000, easing = "easeInOut", offset = 0 } = options;

      let targetPosition: number;

      if (typeof target === "string") {
        const element = document.querySelector(target);
        if (!element) return;
        const rect = element.getBoundingClientRect();
        targetPosition = window.pageYOffset + rect.top - offset;
      } else {
        targetPosition = target - offset;
      }

      const startPosition = window.pageYOffset;
      const distance = targetPosition - startPosition;
      let startTime: number | null = null;

      const easingFunctions = {
        linear: (t: number) => t,
        easeInOut: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
        easeIn: (t: number) => t * t,
        easeOut: (t: number) => t * (2 - t),
      };

      const animation = (currentTime: number) => {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);

        const easedProgress = easingFunctions[easing](progress);
        const currentPosition = startPosition + distance * easedProgress;

        window.scrollTo(0, currentPosition);

        if (timeElapsed < duration) {
          requestAnimationFrame(animation);
        }
      };

      requestAnimationFrame(animation);
    },
    [],
  );

  const scrollToTop = useCallback(
    (options?: SmoothScrollOptions) => {
      scrollTo(0, options);
    },
    [scrollTo],
  );

  const scrollToBottom = useCallback(
    (options?: SmoothScrollOptions) => {
      scrollTo(document.body.scrollHeight, options);
    },
    [scrollTo],
  );

  return {
    scrollTo,
    scrollToTop,
    scrollToBottom,
  };
}
