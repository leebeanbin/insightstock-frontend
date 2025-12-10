import { useQuery } from '@tanstack/react-query';
import { LearningService, LearningRecommendation } from '../services/learning.service';
import { getCacheConfig } from '../config/cache';

const learningService = new LearningService();

/**
 * 오늘의 학습 추천 조회
 */
export function useTodayRecommendations() {
  return useQuery<LearningRecommendation[]>({
    queryKey: ['learning', 'today'],
    queryFn: () => learningService.getTodayRecommendations(),
    ...getCacheConfig('learning', 'today'),
  });
}

