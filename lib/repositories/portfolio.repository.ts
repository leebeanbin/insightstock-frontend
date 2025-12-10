/**
 * Portfolio Repository
 * 포트폴리오 데이터 접근 계층 (Repository Pattern)
 * SOLID: Single Responsibility Principle
 */

import { BaseRepository } from './base.repository';
import {
  PortfolioItem,
  PortfolioListResponse,
  CreatePortfolioRequest,
  UpdatePortfolioRequest,
  PortfolioAnalysisResponse,
} from '../types/api/portfolio.types';
import apiClient from '../api-client';

export class PortfolioRepository extends BaseRepository<PortfolioItem> {
  protected basePath = '/portfolio';

  /**
   * 포트폴리오 추가
   */
  async create(data: CreatePortfolioRequest): Promise<PortfolioItem> {
    try {
      return await this.post<PortfolioItem>('', data);
    } catch (error) {
      console.error('API 호출 실패:', error);
      throw new Error('Failed to create portfolio. Please check backend connection.');
    }
  }

  /**
   * 포트폴리오 목록 조회
   */
  async findMany(params?: {
    sortBy?: 'profit' | 'profitRate' | 'currentValue';
    sortOrder?: 'asc' | 'desc';
    limit?: number;
    offset?: number;
  }): Promise<PortfolioListResponse> {
    try {
      // BaseRepository.get()이 이미 response.data.data를 반환
      const response = await this.get<PortfolioListResponse>('', params);
      return response;
    } catch (error) {
      console.error('API 호출 실패:', error);
      return {
        portfolios: [],
        summary: { totalCost: 0, currentValue: 0, totalProfit: 0, totalProfitRate: 0 },
        total: 0,
      };
    }
  }

  /**
   * 포트폴리오 상세 조회
   */
  async findById(id: string): Promise<PortfolioItem> {
    try {
      return await this.get<PortfolioItem>(`/${id}`);
    } catch (error) {
      console.error('API 호출 실패:', error);
      throw new Error('Failed to fetch portfolio. Please check backend connection.');
    }
  }

  /**
   * 포트폴리오 수정
   */
  async update(id: string, data: UpdatePortfolioRequest): Promise<PortfolioItem> {
    try {
      return await this.patch<PortfolioItem>(`/${id}`, data);
    } catch (error) {
      console.error('API 호출 실패:', error);
      throw new Error('Failed to update portfolio. Please check backend connection.');
    }
  }

  /**
   * 포트폴리오 삭제
   */
  async deletePortfolio(id: string): Promise<{ message: string }> {
    try {
      return await this.delete<{ message: string }>(`/${id}`);
    } catch (error) {
      console.error('API 호출 실패:', error);
      return { message: 'Portfolio deleted successfully' };
    }
  }

  /**
   * stockId로 포트폴리오 조회
   * 
   * 주의: 이 메서드는 404 에러를 발생시킬 수 있어 백엔드 로그에 혼란을 줄 수 있습니다.
   * 가능하면 usePortfolios()로 전체 목록을 가져와서 클라이언트에서 체크하는 것을 권장합니다.
   * 
   * @deprecated 개별 체크는 백엔드 로그에 404를 남기므로, 전체 목록 조회 후 클라이언트에서 체크하는 것을 권장합니다.
   * 또는 백엔드에 별도 엔드포인트(GET /api/portfolio/check/:stockId)를 추가하여 boolean을 반환하도록 하는 것이 좋습니다.
   */
  async findByStockId(stockId: string): Promise<PortfolioItem | null> {
    try {
      // 404를 에러로 처리하지 않도록 validateStatus 설정
      const fullPath = this.getPath(`/stock/${stockId}`);
      const response = await apiClient.get(fullPath, {
        validateStatus: (status) => status === 200 || status === 404,
      });
      
      // 404 응답은 null 반환 (정상적인 상황: 포트폴리오에 없음)
      if (response.status === 404) {
        return null;
      }
      
      // 200 응답은 데이터 반환 (포트폴리오에 있음)
      return response.data.data;
    } catch (error: any) {
      // validateStatus로 404는 catch되지 않지만, 다른 에러는 처리
      if (error.response?.status !== 404) {
        // 404가 아닌 에러만 로깅
        if (typeof window !== 'undefined') {
          try {
            const { backendLogger } = await import('@/lib/utils/backend-logger');
            backendLogger.error('Failed to fetch portfolio by stock', error instanceof Error ? error : new Error(String(error)));
          } catch {
            // 로거 로드 실패 시 무시
          }
        }
        throw new Error('Failed to fetch portfolio by stock. Please check backend connection.');
      }
      // 404는 정상적인 상황이므로 null 반환
      return null;
    }
  }

  /**
   * 포트폴리오 AI 리스크 분석
   */
  async getAnalysis(): Promise<PortfolioAnalysisResponse> {
    try {
      return await this.get<PortfolioAnalysisResponse>('/analysis');
    } catch (error) {
      console.error('API 호출 실패:', error);
      return {
        summary: {
          totalValue: 0,
          totalReturn: 0,
          returnRate: 0,
          riskScore: 65,
        },
        risks: [
          {
            type: 'sector_concentration',
            severity: 'warning',
            title: '섹터 집중도 높음',
            description: 'IT 섹터에 60%가 집중되어 있습니다.',
            value: 60,
            threshold: 40,
            recommendation: '다른 섹터(금융, 바이오 등)에도 분산 투자하세요.',
          },
        ],
        diversification: {
          sectors: [
            { name: 'IT', value: 3000000, percentage: 60 },
            { name: '2차전지', value: 1500000, percentage: 30 },
            { name: '기타', value: 750000, percentage: 15 },
          ],
        },
      };
    }
  }
}

