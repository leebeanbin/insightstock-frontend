/**
 * useIntersectionObserver Hook
 * Intersection Observer API를 사용한 무한 스크롤 구현
 */

'use client';

import { useEffect, useRef, useState } from 'react';

export interface UseIntersectionObserverOptions {
  threshold?: number;
  root?: Element | null;
  rootMargin?: string;
  enabled?: boolean;
}

export function useIntersectionObserver<T extends HTMLElement = HTMLDivElement>(
  options: UseIntersectionObserverOptions = {}
) {
  const { threshold = 0.1, root = null, rootMargin = '0px', enabled = true } = options;
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const elementRef = useRef<T>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || !enabled) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isElementIntersecting = entry.isIntersecting;
        setIsIntersecting(isElementIntersecting);
        if (isElementIntersecting) {
          setHasIntersected(true);
        }
      },
      { threshold, root, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, root, rootMargin, enabled]);

  return { ref: elementRef, isIntersecting, hasIntersected };
}

