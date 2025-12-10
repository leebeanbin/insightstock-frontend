/**
 * PageLayout Component
 * 공통 페이지 레이아웃 (Sidebar + Header + Content)
 */

'use client';

import Sidebar from '@/components/organisms/Sidebar';
import Header from '@/components/organisms/Header';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  onStockSelect?: (stock: any) => void;
}

export function PageLayout({ children, className, contentClassName, onStockSelect }: PageLayoutProps) {
  return (
    <div className={cn('flex h-screen bg-gray-50', className)}>
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onStockSelect={onStockSelect} />
        <div className={cn('flex-1 overflow-y-auto', contentClassName)}>
          {children}
        </div>
      </div>
    </div>
  );
}

