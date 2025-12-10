/**
 * Tooltip Component
 * 툴팁 컴포넌트 - 실무 표준 디자인
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { spacing, borderRadius } from '@/lib/design-tokens';

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  disabled?: boolean;
  className?: string;
  trigger?: 'hover' | 'click';
}

const Tooltip = ({
  content,
  children,
  position = 'top',
  delay = 200,
  disabled = false,
  className,
  trigger = 'hover',
}: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const calculatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    
    // Tooltip이 아직 렌더링되지 않았거나 크기가 0이면 대기
    if (tooltipRect.width === 0 || tooltipRect.height === 0) {
      // 다음 프레임에서 다시 계산
      requestAnimationFrame(() => {
        if (isVisible) calculatePosition();
      });
      return;
    }

    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;

    let top = 0;
    let left = 0;

    // 거리 조정
    const gap = 8;
    
    switch (position) {
      case 'top':
        top = triggerRect.top + scrollY - tooltipRect.height - gap;
        left = triggerRect.left + scrollX + triggerRect.width / 2 - tooltipRect.width / 2;
        break;
      case 'bottom':
        top = triggerRect.bottom + scrollY + gap;
        left = triggerRect.left + scrollX + triggerRect.width / 2 - tooltipRect.width / 2;
        break;
      case 'left':
        // 왼쪽에 배치할 때는 버튼의 중앙에 맞춤
        top = triggerRect.top + scrollY + triggerRect.height / 2 - tooltipRect.height / 2;
        left = triggerRect.left + scrollX - tooltipRect.width - gap;
        break;
      case 'right':
        top = triggerRect.top + scrollY + triggerRect.height / 2 - tooltipRect.height / 2;
        left = triggerRect.right + scrollX + gap;
        break;
    }

    // 화면 경계 체크 (더 넓은 여백)
    const padding = 12;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // 좌우 경계 체크 및 자동 위치 조정
    if (left < padding) {
      // 왼쪽으로 넘치면
      if (position === 'left') {
        // 오른쪽에 배치
        left = triggerRect.right + scrollX + gap;
        // 여전히 넘치면 중앙에 배치
        if (left + tooltipRect.width > viewportWidth - padding) {
          left = triggerRect.left + scrollX + triggerRect.width / 2 - tooltipRect.width / 2;
        }
      } else {
        left = padding;
      }
    } else if (left + tooltipRect.width > viewportWidth - padding) {
      // 오른쪽으로 넘치면
      if (position === 'right') {
        // 왼쪽에 배치
        left = triggerRect.left + scrollX - tooltipRect.width - gap;
        // 여전히 넘치면 중앙에 배치
        if (left < padding) {
          left = triggerRect.left + scrollX + triggerRect.width / 2 - tooltipRect.width / 2;
        }
      } else {
        left = viewportWidth - tooltipRect.width - padding;
      }
      // 최종 경계 체크
      if (left < padding) left = padding;
    }
    
    // 상하 경계 체크 및 자동 위치 조정
    if (top < scrollY + padding) {
      // 위로 넘치면
      if (position === 'top') {
        // 아래에 배치
        top = triggerRect.bottom + scrollY + gap;
        // 여전히 넘치면 중앙에 배치
        if (top + tooltipRect.height > scrollY + viewportHeight - padding) {
          top = triggerRect.top + scrollY + triggerRect.height / 2 - tooltipRect.height / 2;
        }
      } else {
        top = scrollY + padding;
      }
    } else if (top + tooltipRect.height > scrollY + viewportHeight - padding) {
      // 아래로 넘치면
      if (position === 'bottom') {
        // 위에 배치
        top = triggerRect.top + scrollY - tooltipRect.height - gap;
        // 여전히 넘치면 중앙에 배치
        if (top < scrollY + padding) {
          top = triggerRect.top + scrollY + triggerRect.height / 2 - tooltipRect.height / 2;
        }
      } else {
        top = scrollY + viewportHeight - tooltipRect.height - padding;
      }
      // 최종 경계 체크
      if (top < scrollY + padding) top = scrollY + padding;
    }

    setTooltipPosition({ top, left });
  };

  const showTooltip = () => {
    if (disabled) return;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
      requestAnimationFrame(() => {
        calculatePosition();
      });
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  useEffect(() => {
    if (isVisible) {
      // Tooltip이 표시된 후 위치 계산 (약간의 지연으로 실제 크기 반영)
      const timeoutId = setTimeout(() => {
        calculatePosition();
      }, 0);
      
      const handleResize = () => {
        requestAnimationFrame(() => calculatePosition());
      };
      const handleScroll = () => {
        requestAnimationFrame(() => calculatePosition());
      };
      
      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', handleScroll, true);
      
      return () => {
        clearTimeout(timeoutId);
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleScroll, true);
      };
    }
  }, [isVisible]);

  const handleClick = (e: React.MouseEvent) => {
    if (trigger === 'click') {
      e.stopPropagation();
      if (isVisible) {
        hideTooltip();
      } else {
        showTooltip();
      }
    }
  };

  useEffect(() => {
    if (trigger === 'click' && isVisible) {
      const handleClickOutside = (e: MouseEvent) => {
        if (
          triggerRef.current &&
          !triggerRef.current.contains(e.target as Node) &&
          tooltipRef.current &&
          !tooltipRef.current.contains(e.target as Node)
        ) {
          hideTooltip();
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isVisible, trigger]);

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={trigger === 'hover' ? showTooltip : undefined}
        onMouseLeave={trigger === 'hover' ? hideTooltip : undefined}
        onClick={handleClick}
        className={cn('inline-block', className)}
      >
        {children}
      </div>
      {isVisible && (
        <div
          ref={tooltipRef}
          className={cn(
            'fixed pointer-events-none',
            'px-[var(--spacing-3)] py-[var(--spacing-2_5)]',
            // 라이트/다크 모드에 맞는 배경색
            'bg-gray-50 dark:bg-gray-800',
            'text-gray-900 dark:text-gray-100',
            'text-[var(--font-size-sm)] font-medium',
            'rounded-[var(--radius-md)]',
            // 깔끔한 그림자
            'shadow-lg dark:shadow-xl',
            'shadow-gray-900/20 dark:shadow-black/40',
            // 얇은 테두리
            'border border-gray-200 dark:border-gray-600/50',
            'animate-in fade-in zoom-in-95 duration-200',
            // 텍스트가 박스 안에 맞도록 조정
            'max-w-sm min-w-fit',
            'whitespace-normal',
            'break-words',
            'text-center',
            // z-index를 매우 높게 설정하여 모든 요소 위에 표시
            'z-[10000]'
          )}
          style={{
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`,
          }}
          role="tooltip"
        >
          <span className="relative z-10 block leading-relaxed">{content}</span>
          {/* 화살표 - 깔끔하게 */}
          <div
            className={cn(
              'absolute w-2 h-2',
              'bg-gray-50 dark:bg-gray-800',
              'border-gray-200 dark:border-gray-600/50'
            )}
            style={{
              ...(position === 'top' && {
                bottom: '-4px',
                left: '50%',
                transform: 'translateX(-50%) rotate(45deg)',
                borderRight: '1px solid',
                borderBottom: '1px solid',
                borderColor: 'inherit',
              }),
              ...(position === 'bottom' && {
                top: '-4px',
                left: '50%',
                transform: 'translateX(-50%) rotate(45deg)',
                borderTop: '1px solid',
                borderLeft: '1px solid',
                borderColor: 'inherit',
              }),
              ...(position === 'left' && {
                right: '-4px',
                top: '50%',
                transform: 'translateY(-50%) rotate(45deg)',
                borderTop: '1px solid',
                borderRight: '1px solid',
                borderColor: 'inherit',
              }),
              ...(position === 'right' && {
                left: '-4px',
                top: '50%',
                transform: 'translateY(-50%) rotate(45deg)',
                borderBottom: '1px solid',
                borderLeft: '1px solid',
                borderColor: 'inherit',
              }),
            }}
          />
        </div>
      )}
    </>
  );
};

export default Tooltip;
