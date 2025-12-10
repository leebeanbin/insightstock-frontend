/**
 * Carousel Component
 * 캐로셀 컴포넌트 - 실무 표준 디자인
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { sizes } from '@/lib/design-tokens';

export interface CarouselProps {
  children: React.ReactNode[];
  autoPlay?: boolean;
  interval?: number;
  showIndicators?: boolean;
  showArrows?: boolean;
  className?: string;
  itemClassName?: string;
}

const Carousel = ({
  children,
  autoPlay = false,
  interval = 3000,
  showIndicators = true,
  showArrows = true,
  className,
  itemClassName,
}: CarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const totalItems = children.length;

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? totalItems - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === totalItems - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    if (autoPlay && !isPaused && totalItems > 1) {
      intervalRef.current = setInterval(() => {
        goToNext();
      }, interval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoPlay, isPaused, interval, totalItems]);

  if (totalItems === 0) return null;

  return (
    <div
      className={cn('relative w-full', className)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Carousel Container */}
      <div className="relative overflow-hidden rounded-[var(--radius-xl)]">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {children.map((child, index) => (
            <div
              key={index}
              className={cn('min-w-full flex-shrink-0', itemClassName)}
            >
              {child}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      {showArrows && totalItems > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className={cn(
              'absolute left-4 top-1/2 -translate-y-1/2',
              'p-2 rounded-full',
              'bg-background-card/80 dark:bg-background-card/80',
              'border border-border-default',
              'text-text-primary hover:text-[var(--brand-main)] dark:hover:text-[var(--brand-purple)]',
              'hover:bg-background-hover',
              'transition-all duration-200',
              'z-10',
              'shadow-lg'
            )}
            aria-label="Previous slide"
          >
            <ChevronLeft size={sizes.icon.px.md} />
          </button>
          <button
            onClick={goToNext}
            className={cn(
              'absolute right-4 top-1/2 -translate-y-1/2',
              'p-2 rounded-full',
              'bg-background-card/80 dark:bg-background-card/80',
              'border border-border-default',
              'text-text-primary hover:text-[var(--brand-main)] dark:hover:text-[var(--brand-purple)]',
              'hover:bg-background-hover',
              'transition-all duration-200',
              'z-10',
              'shadow-lg'
            )}
            aria-label="Next slide"
          >
            <ChevronRight size={sizes.icon.px.md} />
          </button>
        </>
      )}

      {/* Indicators */}
      {showIndicators && totalItems > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          {children.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                'w-2 h-2 rounded-full transition-all duration-200',
                index === currentIndex
                  ? 'bg-[var(--brand-main)] dark:bg-[var(--brand-purple)] w-6'
                  : 'bg-background-subtle hover:bg-background-hover'
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Carousel;

