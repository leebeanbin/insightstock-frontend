/**
 * 스켈레톤 로딩 컴포넌트
 * 토스 스타일의 부드러운 로딩 애니메이션
 */

'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animate?: boolean;
}

export function Skeleton({
  className,
  variant = 'rectangular',
  width,
  height,
  animate = true,
}: SkeletonProps) {
  const baseClasses = 'bg-gray-200 dark:bg-gray-800';
  
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    rounded: 'rounded-lg',
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  const content = (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        'animate-pulse',
        className
      )}
      style={style}
    />
  );

  if (!animate) {
    return (
      <div
        className={cn(
          baseClasses,
          variantClasses[variant],
          className
        )}
        style={style}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0.6 }}
      animate={{
        opacity: [0.6, 1, 0.6],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className={cn(
        baseClasses,
        variantClasses[variant],
        className
      )}
      style={style}
    />
  );
}

/**
 * 스켈레톤 텍스트
 */
export function SkeletonText({
  lines = 1,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          height={16}
          width={i === lines - 1 ? '80%' : '100%'}
        />
      ))}
    </div>
  );
}

/**
 * 스켈레톤 카드
 */
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('p-4 space-y-3', className)}>
      <Skeleton variant="rounded" height={20} width="60%" />
      <SkeletonText lines={2} />
      <Skeleton variant="rounded" height={40} width="100%" />
    </div>
  );
}

/**
 * 스켈레톤 리스트 아이템
 */
export function SkeletonListItem({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-3 p-3', className)}>
      <Skeleton variant="circular" width={40} height={40} />
      <div className="flex-1 space-y-2">
        <Skeleton variant="rounded" height={16} width="40%" />
        <Skeleton variant="rounded" height={12} width="60%" />
      </div>
      <Skeleton variant="rounded" height={20} width={60} />
    </div>
  );
}

