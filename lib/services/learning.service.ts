import apiClient from '../api-client';

export interface LearningRecommendation {
  concept: string;
  question: string;
  description: string;
  relatedStocks: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export class LearningService {
  /**
   * 오늘의 학습 추천 조회
   */
  async getTodayRecommendations(): Promise<LearningRecommendation[]> {
    const response = await apiClient.get<{
      success: boolean;
      data: LearningRecommendation[];
    }>('/learning/today');
    return response.data.data;
  }
}

