/**
 * Portfolio Service
 * 포트폴리오 비즈니스 로직 계층 (Service Layer)
 * SOLID: Single Responsibility Principle, Dependency Inversion Principle
 */

import { PortfolioRepository } from '../repositories/portfolio.repository';
import {
  PortfolioItem,
  PortfolioListResponse,
  CreatePortfolioRequest,
  UpdatePortfolioRequest,
  PortfolioAnalysisResponse,
} from '../types/api/portfolio.types';

export class PortfolioService {
  constructor(private repository: PortfolioRepository) {
    // Dependency Injection (SOLID: Dependency Inversion Principle)
  }

  /**
   * 포트폴리오 추가 (비즈니스 로직: 중복 체크, 유효성 검증)
   * 
   * 참고: 중복 체크는 백엔드에서 처리하는 것이 권장됩니다.
   * 프론트엔드에서 개별 체크 API 호출 시 404 에러가 발생하여
   * 백엔드 로그에 혼란을 줄 수 있습니다.
   * 백엔드에서 중복 체크를 처리하고 적절한 에러 메시지를 반환하도록 구현하는 것이 좋습니다.
   */
  async createPortfolio(data: CreatePortfolioRequest): Promise<PortfolioItem> {
    // 비즈니스 로직: 유효성 검증
    if (data.quantity <= 0) {
      throw new Error('Quantity must be greater than 0');
    }
    if (data.averagePrice <= 0) {
      throw new Error('Average price must be greater than 0');
    }

    // 중복 체크는 백엔드에서 처리 (백엔드가 409 Conflict 또는 적절한 에러 반환)
    // 프론트엔드에서 개별 체크 시 404 에러가 발생하여 로그에 혼란을 줄 수 있음
    return await this.repository.create(data);
  }

  /**
   * 포트폴리오 목록 조회 (비즈니스 로직: 정렬, 필터링)
   */
  async getPortfolios(params?: {
    sortBy?: 'profit' | 'profitRate' | 'currentValue';
    sortOrder?: 'asc' | 'desc';
    limit?: number;
    offset?: number;
  }): Promise<PortfolioListResponse> {
    // 비즈니스 로직: 기본값 설정
    const sortBy = params?.sortBy || 'currentValue';
    const sortOrder = params?.sortOrder || 'desc';
    const limit = params?.limit || 50;
    const offset = params?.offset || 0;

    return await this.repository.findMany({
      sortBy,
      sortOrder,
      limit,
      offset,
    });
  }

  /**
   * 포트폴리오 상세 조회
   */
  async getPortfolio(id: string): Promise<PortfolioItem> {
    // 비즈니스 로직: 유효성 검증
    if (!id) {
      throw new Error('Portfolio ID is required');
    }

    const portfolio = await this.repository.findById(id);
    if (!portfolio) {
      throw new Error('Portfolio not found');
    }

    return portfolio;
  }

  /**
   * stockId로 포트폴리오 조회
   */
  async getPortfolioByStockId(stockId: string): Promise<PortfolioItem | null> {
    return await this.repository.findByStockId(stockId);
  }

  /**
   * 포트폴리오 수정 (비즈니스 로직: 유효성 검증)
   */
  async updatePortfolio(
    id: string,
    data: UpdatePortfolioRequest
  ): Promise<PortfolioItem> {
    // 비즈니스 로직: 유효성 검증
    if (!id) {
      throw new Error('Portfolio ID is required');
    }
    if (data.quantity !== undefined && data.quantity <= 0) {
      throw new Error('Quantity must be greater than 0');
    }
    if (data.averagePrice !== undefined && data.averagePrice <= 0) {
      throw new Error('Average price must be greater than 0');
    }

    // 기존 포트폴리오 확인
    await this.getPortfolio(id);

    return await this.repository.update(id, data);
  }

  /**
   * 포트폴리오 삭제
   */
  async deletePortfolio(id: string): Promise<{ message: string }> {
    // 비즈니스 로직: 유효성 검증
    if (!id) {
      throw new Error('Portfolio ID is required');
    }

    // 기존 포트폴리오 확인
    await this.getPortfolio(id);

    return await this.repository.deletePortfolio(id);
  }

  /**
   * 포트폴리오 AI 리스크 분석
   */
  async getAnalysis(): Promise<PortfolioAnalysisResponse> {
    return await this.repository.getAnalysis();
  }

  /**
   * 포트폴리오 수익률 계산 (비즈니스 로직)
   */
  calculateProfitRate(
    currentPrice: number,
    averagePrice: number
  ): number {
    if (averagePrice === 0) return 0;
    return ((currentPrice - averagePrice) / averagePrice) * 100;
  }

  /**
   * 포트폴리오 총 가치 계산 (비즈니스 로직)
   */
  calculateTotalValue(
    portfolios: PortfolioItem[]
  ): { totalCost: number; currentValue: number; totalProfit: number; totalProfitRate: number } {
    const totalCost = portfolios.reduce(
      (sum, p) => sum + p.totalCost,
      0
    );
    const currentValue = portfolios.reduce(
      (sum, p) => sum + p.currentValue,
      0
    );
    const totalProfit = currentValue - totalCost;
    const totalProfitRate = totalCost > 0 ? (totalProfit / totalCost) * 100 : 0;

    return {
      totalCost,
      currentValue,
      totalProfit,
      totalProfitRate,
    };
  }
}

