'use client';

import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import IconButton from './IconButton';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { layout, shadows } from '@/lib/design-tokens';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
  closeOnOverlayClick?: boolean;
}

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'medium',
  closeOnOverlayClick = true,
}: ModalProps) => {
  const { t } = useLanguage();

  useEffect(() => {
    // 클라이언트 사이드에서만 document 접근
    if (typeof document === 'undefined') return;
    
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      if (typeof document !== 'undefined') {
        document.body.style.overflow = '';
      }
    };
  }, [isOpen]);

  useEffect(() => {
    // 클라이언트 사이드에서만 document 접근
    if (typeof document === 'undefined') return;
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      if (typeof document !== 'undefined') {
        document.removeEventListener('keydown', handleEscape);
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeStyles = {
    small: 'w-[var(--layout-modal-small)] max-w-[90vw]',
    medium: 'w-[var(--layout-modal-medium)] max-w-[90vw]',
    large: 'w-[var(--layout-modal-large)] max-w-[90vw]',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      {/* Overlay - 개선된 애니메이션 */}
      <div
        className={cn(
          'fixed inset-0 bg-black/50 backdrop-blur-sm',
          'animate-in fade-in duration-200',
          isOpen ? 'opacity-100' : 'opacity-0'
        )}
        onClick={closeOnOverlayClick ? onClose : undefined}
        aria-hidden="true"
      />

      {/* Modal Content - 개선된 애니메이션 및 반응형 */}
      <div
        className={cn(
          'relative bg-background-card rounded-2xl shadow-2xl',
          'flex flex-col max-h-[var(--layout-modal-maxHeight)]',
          'animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-300',
          'border border-border-default',
          sizeStyles[size],
          'overflow-hidden'
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - 개선된 스타일 */}
        {title && (
          <div className={cn(
            'flex items-center justify-between',
            'px-6 pt-6 pb-4',
            'border-b border-border-subtle',
            'bg-gradient-to-r from-background-card to-background-subtle/50'
          )}>
            <h2 id="modal-title" className="text-xl font-bold text-text-primary">
              {title}
            </h2>
            <IconButton
              icon={X}
              size="medium"
              variant="ghost"
              onClick={onClose}
              aria-label={t('aria.closeModal')}
              className="hover:bg-background-hover"
            />
          </div>
        )}

        {/* Body - 개선된 스크롤 UX */}
        <div className={cn(
          'flex-1 overflow-y-auto',
          'px-6 py-6',
          'scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent',
          'hover:scrollbar-thumb-gray-400',
          'dark:scrollbar-thumb-gray-600 dark:hover:scrollbar-thumb-gray-500'
        )}>
          {children}
        </div>

        {/* Footer - 개선된 스타일 */}
        {footer && (
          <div className={cn(
            'flex items-center justify-end gap-3',
            'px-6 pt-4 pb-6',
            'border-t border-border-subtle',
            'bg-background-subtle/50'
          )}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;

