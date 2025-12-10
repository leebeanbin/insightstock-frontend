/**
 * Portfolio API Types
 * 포트폴리오 관련 타입 정의
 */

export interface PortfolioItem {
  id: string;
  stock: {
    id: string;
    code: string;
    name: string;
    currentPrice: number;
    changeRate: number;
  };
  quantity: number;
  averagePrice: number;
  totalCost: number;
  currentValue: number;
  profit: number;
  profitRate: number;
  createdAt: string;
}

export interface PortfolioSummary {
  totalCost: number;
  currentValue: number;
  totalProfit: number;
  totalProfitRate: number;
}

export interface PortfolioListResponse {
  portfolios: PortfolioItem[];
  summary: PortfolioSummary;
  total: number;
}

export interface CreatePortfolioRequest {
  stockId: string;
  quantity: number;
  averagePrice: number;
}

export interface UpdatePortfolioRequest {
  quantity?: number;
  averagePrice?: number;
}

export interface PortfolioAnalysisResponse {
  summary: {
    totalValue: number;
    totalReturn: number;
    returnRate: number;
    riskScore: number;
  };
  risks: Array<{
    type: string;
    severity: 'warning' | 'error' | 'info';
    title: string;
    description: string;
    value: number;
    threshold: number;
    recommendation: string;
  }>;
  diversification: {
    sectors: Array<{
      name: string;
      value: number;
      percentage: number;
    }>;
  };
}

