/**
 * AddPortfolioModal Component
 * 포트폴리오 추가 모달
 */

'use client';

import { useState, useMemo } from 'react';
import Modal from '@/components/atoms/Modal';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import { StockSearch } from '@/components/search/StockSearch';
import { useCreatePortfolio } from '@/lib/hooks/use-portfolio';
import { Stock } from '@/lib/types';
import { toast } from 'sonner';
import { formatPrice } from '@/lib/formatters';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { safeParseFloat, validatePortfolioQuantity, validatePortfolioPrice } from '@/lib/utils/validation';
import { handleMutationError } from '@/lib/utils/error-handler';

interface AddPortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddPortfolioModal({ isOpen, onClose }: AddPortfolioModalProps) {
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [quantity, setQuantity] = useState<string>('');
  const [averagePrice, setAveragePrice] = useState<string>('');
  const { t } = useLanguage();

  const createMutation = useCreatePortfolio();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedStock) {
      toast.error(t('portfolio.selectStockError'));
      return;
    }

    // 공통 유틸리티로 검증
    const quantityValidation = validatePortfolioQuantity(quantity);
    const priceValidation = validatePortfolioPrice(averagePrice);

    if (!quantityValidation.isValid) {
      toast.error(quantityValidation.error || t('portfolio.quantityError'));
      return;
    }

    if (!priceValidation.isValid) {
      toast.error(priceValidation.error || t('portfolio.priceError'));
      return;
    }

    try {
      await createMutation.mutateAsync({
        stockId: selectedStock.id,
        quantity: quantityValidation.value,
        averagePrice: priceValidation.value,
      });

      toast.success(t('portfolio.added'));
      handleClose();
    } catch (error: unknown) {
      // 공통 에러 핸들러 사용
      handleMutationError(
        error,
        'Failed to create portfolio',
        t('portfolio.addFailed'),
        {
          '이미 포트폴리오에 추가된': t('portfolio.alreadyAdded'),
        }
      );
    }
  };

  const handleClose = () => {
    setSelectedStock(null);
    setQuantity('');
    setAveragePrice('');
    onClose();
  };

  const handleStockSelect = (stock: Stock) => {
    setSelectedStock(stock);
    // 현재가를 평균 매수가 기본값으로 설정
    if (!averagePrice) {
      setAveragePrice(stock.currentPrice.toString());
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={t('portfolio.addStockTitle')}
      size="medium"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 종목 선택 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('portfolio.selectStock')} <span className="text-red-500">*</span>
          </label>
          <StockSearch
            placeholder={t('portfolio.selectStockPlaceholder')}
            onSelect={handleStockSelect}
            autoFocus
          />
          {selectedStock && (
            <div className="mt-3 p-3 bg-primary-50 rounded-lg border border-primary-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {selectedStock.name}
                  </p>
                  <p className="text-xs text-gray-600">{selectedStock.code}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">
                    {formatPrice(selectedStock.currentPrice)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 보유 수량 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('portfolio.quantity')} <span className="text-red-500">*</span>
          </label>
          <Input
            type="number"
            placeholder={t('portfolio.enterQuantity')}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            min="0"
            step="1"
            required
          />
        </div>

        {/* 평균 매수가 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('portfolio.averagePrice')} <span className="text-red-500">*</span>
          </label>
          <Input
            type="number"
            placeholder={t('portfolio.enterPrice')}
            value={averagePrice}
            onChange={(e) => setAveragePrice(e.target.value)}
            min="0"
            step="0.01"
            required
          />
          {selectedStock && averagePrice && (
            <p className="mt-1 text-xs text-gray-500">
              {t('stock.currentPrice')}: {formatPrice(selectedStock.currentPrice)}
            </p>
          )}
        </div>

        {/* 예상 평가금액 */}
        {selectedStock && quantity && averagePrice && (() => {
          const quantityNum = safeParseFloat(quantity);
          const priceNum = safeParseFloat(averagePrice);
          
          return (
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">{t('portfolio.expectedValue')}</span>
                <span className="text-base font-bold text-gray-900">
                  {formatPrice(quantityNum * priceNum)}
                </span>
              </div>
              {selectedStock && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{t('portfolio.currentValue')}</span>
                  <span className="text-base font-bold text-gray-900">
                    {formatPrice(quantityNum * selectedStock.currentPrice)}
                  </span>
                </div>
              )}
            </div>
          );
        })()}

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
          <Button
            variant="secondary"
            onClick={handleClose}
            disabled={createMutation.isPending}
          >
            {t('common.cancel')}
          </Button>
          <Button
            variant="primary"
            disabled={!selectedStock || !quantity || !averagePrice || createMutation.isPending}
            onClick={handleSubmit}
          >
            {createMutation.isPending ? t('common.adding') : t('portfolio.addStock')}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

