'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { layout, sizes } from '@/lib/design-tokens';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  variant: ToastVariant;
  message: string;
  duration?: number;
  onClose?: () => void;
  showCloseButton?: boolean;
}

const Toast = ({
  variant,
  message,
  duration = 4000,
  onClose,
  showCloseButton = true,
}: ToastProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose?.(), 200); // Fade out animation
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!isVisible) return null;

  const variantStyles = {
    success: {
      bg: 'bg-[rgba(16,185,129,0.1)]',
      border: 'border-semantic-green',
      text: 'text-semantic-green',
      icon: CheckCircle2,
    },
    error: {
      bg: 'bg-[rgba(239,68,68,0.1)]',
      border: 'border-semantic-red',
      text: 'text-semantic-red',
      icon: AlertCircle,
    },
    warning: {
      bg: 'bg-[rgba(245,158,11,0.1)]',
      border: 'border-semantic-yellow',
      text: 'text-semantic-yellow',
      icon: AlertTriangle,
    },
    info: {
      bg: 'bg-primary-100',
      border: 'border-primary-600',
      text: 'text-primary-600',
      icon: Info,
    },
  };

  const { bg, border, text, icon: Icon } = variantStyles[variant];

  return (
    <div
      className={cn(
        'fixed top-6 left-1/2 -translate-x-1/2 z-50',
        `min-w-[${layout.toast.minWidth}] max-w-[${layout.toast.maxWidth}]`,
        'rounded-lg border px-4 py-3',
        'shadow-md',
        'flex items-center gap-2',
        'animate-in slide-in-from-top-4 fade-in duration-250',
        bg,
        border,
        text
      )}
      role="alert"
      aria-live="polite"
    >
      <Icon size={sizes.icon.px.md} strokeWidth={1.75} className="flex-shrink-0" />
      <p className="flex-1 text-sm font-medium">{message}</p>
      {showCloseButton && (
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(() => onClose?.(), 200);
          }}
          className="flex-shrink-0 p-1 rounded hover:bg-black/10 transition-colors"
          aria-label={t('aria.close')}
        >
          <X size={sizes.icon.px.sm} strokeWidth={1.75} />
        </button>
      )}
    </div>
  );
};

export default Toast;

