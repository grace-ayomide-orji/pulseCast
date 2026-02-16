"use client";

import Image from 'next/image';
import { useState } from 'react';

interface SafeNewsImageProps {
  src: string | null;
  alt: string;
  fill?: boolean;
  className?: string;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
}

const PROBLEMATIC_DOMAINS = [
  'politico.com',
  'news-journalonline.com',
  'trueachievements.com',
  'yourtango.com'
];

export default function SafeNewsImage({ 
  src, 
  alt, 
  fill, 
  className, 
  width, 
  height, 
  sizes,
  priority 
}: SafeNewsImageProps) {
  const [imgSrc, setImgSrc] = useState(src || '/images/placeholder-news.png');
  const [hasError, setHasError] = useState(false);

  const isProblematic = src && PROBLEMATIC_DOMAINS.some(domain => src.includes(domain));

  return (
    <Image
      src={hasError ? '/images/placeholder-news.png' : imgSrc}
      alt={alt}
      fill={fill}
      width={width}
      height={height}
      sizes={sizes}
      className={className}
      priority={priority}
      unoptimized={isProblematic || hasError}
      onError={() => {
        if (!hasError) {
          setHasError(true);
          setImgSrc('/images/placeholder-news.png');
        }
      }}
    />
  );
}

