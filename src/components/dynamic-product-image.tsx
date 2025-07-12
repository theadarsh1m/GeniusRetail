
"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface DynamicProductImageProps {
  query: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  fallbackSrc?: string;
}

const placeholderImage = 'https://placehold.co/400x400.png';

export function DynamicProductImage({ query, alt, className, width = 400, height = 400, fallbackSrc }: DynamicProductImageProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchImage = async () => {
      try {
        const response = await fetch(`/api/pexels?query=${encodeURIComponent(query)}`);
        if (!response.ok) {
          throw new Error('Failed to fetch image from Pexels API');
        }
        const data = await response.json();
        if (isMounted) {
          setImageUrl(data.imageUrl || fallbackSrc || placeholderImage);
        }
      } catch (error) {
        console.error(`Pexels fetch error for query "${query}":`, error);
        if (isMounted) {
          setImageUrl(fallbackSrc || placeholderImage);
        }
      }
    };

    if (query) {
        fetchImage();
    } else {
        setImageUrl(fallbackSrc || placeholderImage);
    }
    
    return () => {
      isMounted = false;
    };

  }, [query, fallbackSrc]);

  if (!imageUrl) {
    return <Skeleton className={cn("bg-muted", className)} style={{width: `${width}px`, height: `${height}px`}} />;
  }

  return (
    <Image
      src={imageUrl}
      alt={alt}
      width={width}
      height={height}
      className={cn("opacity-0 transition-opacity duration-500", className)}
      data-ai-hint={query}
      loading="lazy"
      onLoad={(e) => e.currentTarget.classList.remove('opacity-0')}
      onError={() => setImageUrl(fallbackSrc || placeholderImage)}
    />
  );
}
