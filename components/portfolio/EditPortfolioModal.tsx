/**
 * EditPortfolioModal Component
 * 포트폴리오 수정 모달
 */

'use client';

import { useState, useEffect, useMemo } from 'react';
import Modal from '@/components/atoms/Modal';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import { useUpdatePortfolio } from '@/lib/hooks/use-portfolio';
import { PortfolioItem } from '@/lib/types/api/portfolio.types';
import { toast } from 'sonner';
import { formatPrice, formatPercent } from '@/lib/formatters';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { safeParseFloat, validatePortfolioQuantity, validatePortfolioPrice } from '@/lib/utils/validation';
import { handleMutationError } from '@/lib/utils/error-handler';

interface EditPortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  portfolio: PortfolioItem | null;
}

export function EditPortfolioModal({
  isOpen,
  onClose,
  portfolio,
}: EditPortfolioModalProps) {
  const [quantity, setQuantity] = useState<string>('');
  const [averagePrice, setAveragePrice] = useState<string>('');
  const { t } = useLanguage();

  const updateMutation = useUpdatePortfolio();

  // 포트폴리오 데이터로 폼 초기화
  useEffect(() => {
    if (portfolio) {
      setQuantity(portfolio.quantity.toString());
      setAveragePrice(portfolio.averagePrice.toString());
    }
  }, [portfolio]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!portfolio) return;

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
      await updateMutation.mutateAsync({
        id: portfolio.id,
        data: {
          quantity: quantityValidation.value,
          averagePrice: priceValidation.value,
        },
      });

      toast.success(t('portfolio.updateSuccess'));
      handleClose();
    } catch (error: unknown) {
      // 공통 에러 핸들러 사용
      handleMutationError(
        error,
        'Failed to update portfolio',
        t('portfolio.updateFailed')
      );
    }
  };

  const handleClose = () => {
    setQuantity('');
    setAveragePrice('');
    onClose();
  };

  if (!portfolio) return null;

  // 공통 유틸리티로 안전한 숫자 파싱 (useMemo로 최적화)
  const { quantityNum, priceNum, currentValue, totalCost, profit, profitRate } = useMemo(() => {
    const qty = safeParseFloat(quantity);
    const price = safeParseFloat(averagePrice);
    const current = qty * portfolio.stock.currentPrice;
    const cost = qty * price;
    const profitValue = current - cost;
    const rate = cost > 0 ? (profitValue / cost) * 100 : 0;
    
    return {
      quantityNum: qty,
      priceNum: price,
      currentValue: current,
      totalCost: cost,
      profit: profitValue,
      profitRate: rate,
    };
  }, [quantity, averagePrice, portfolio.stock.currentPrice]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={t('portfolio.editStockTitle')}
      size="medium"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 종목 정보 (읽기 전용) */}
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {portfolio.stock.name}
              </p>
              <p className="text-xs text-gray-600">{portfolio.stock.code}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-gray-900">
                {formatPrice(portfolio.stock.currentPrice)}
              </p>
            </div>
          </div>
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
          <p className="mt-1 text-xs text-gray-500">
            {t('stock.currentPrice')}: {formatPrice(portfolio.stock.currentPrice)}
          </p>
        </div>

        {/* 예상 수익률 */}
        {quantity && averagePrice && (
          <div className="p-4 bg-gray-50 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{t('portfolio.totalPurchase')}</span>
              <span className="text-base font-bold text-gray-900">
                {formatPrice(totalCost)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{t('portfolio.currentValue')}</span>
              <span className="text-base font-bold text-gray-900">
                {formatPrice(currentValue)}
              </span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-gray-200">
              <span className="text-sm font-medium text-gray-700">{t('portfolio.expectedProfit')}</span>
              <span
                className={`text-base font-bold ${
                  profit >= 0 ? 'text-semantic-red' : 'text-semantic-blue'
                }`}
              >
                {formatPrice(profit)} ({profitRate >= 0 ? '+' : ''}
                {profitRate.toFixed(2)}%)
              </span>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
          <Button
            variant="secondary"
            onClick={handleClose}
            disabled={updateMutation.isPending}
          >
            {t('common.cancel')}
          </Button>
          <Button
            variant="primary"
            disabled={!quantity || !averagePrice || updateMutation.isPending}
            onClick={handleSubmit}
          >
            {updateMutation.isPending ? t('common.updating') : t('portfolio.editStock')}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

