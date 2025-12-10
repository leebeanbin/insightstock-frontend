import React from 'react';
import { cn } from '@/lib/utils';

export type SkeletonVariant = 'text' | 'circle' | 'rectangle';

export interface SkeletonProps {
  variant?: SkeletonVariant;
  width?: string | number;
  height?: string | number;
  className?: string;
}

const Skeleton = ({
  variant = 'text',
  width,
  height,
  className,
}: SkeletonProps) => {
  const baseStyles = 'bg-gray-200 rounded animate-pulse';

  const variantStyles = {
    text: 'h-4 w-full',
    circle: 'rounded-full',
    rectangle: 'rounded-lg',
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={cn(baseStyles, variantStyles[variant], className)}
      style={style}
      aria-hidden="true"
    />
  );
};

export default Skeleton;

