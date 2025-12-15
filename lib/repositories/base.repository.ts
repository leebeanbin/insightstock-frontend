/**
 * Base Repository
 * 모든 Repository의 기본 클래스
 * 공통 기능 제공 (SOLID: Open/Closed Principle)
 */

import apiClient from '../api-client';
import { AxiosResponse } from 'axios';

export abstract class BaseRepository<T> {
  protected abstract basePath: string;

  /**
   * GET 요청
   */
  protected async get<R = T>(
    path: string,
    params?: Record<string, any>,
    options?: { validateStatus?: (status: number) => boolean }
  ): Promise<R> {
    const fullPath = this.getPath(path);
    const response: AxiosResponse<{ success: boolean; data: R }> = await apiClient.get(fullPath, {
      params,
      validateStatus: options?.validateStatus,
    });

    // 404 응답인 경우 빈 배열/객체 반환
    if (response.status === 404) {
      return (Array.isArray(response.data.data) ? [] : null) as R;
    }

    return response.data.data;
  }

  /**
   * POST 요청
   */
  protected async post<R = T>(
    path: string,
    data?: any
  ): Promise<R> {
    const fullPath = this.getPath(path);
    // 디버깅: 실제 호출되는 URL 확인
    if (process.env.NODE_ENV === 'development') {
      const fullURL = `${apiClient.defaults.baseURL}${fullPath}`;
      console.log(`[BaseRepository] POST ${fullURL}`, { data });
    }
    const response: AxiosResponse<{ success: boolean; data: R }> = await apiClient.post(fullPath, data);
    return response.data.data;
  }

  /**
   * PATCH 요청
   */
  protected async patch<R = T>(
    path: string,
    data?: any
  ): Promise<R> {
    const fullPath = this.getPath(path);
    const response: AxiosResponse<{ success: boolean; data: R }> = await apiClient.patch(fullPath, data);
    return response.data.data;
  }

  /**
   * DELETE 요청
   */
  protected async delete<R = { message: string }>(
    path: string
  ): Promise<R> {
    const fullPath = this.getPath(path);
    const response: AxiosResponse<{ success: boolean; data?: R; message?: string }> = await apiClient.delete(fullPath);
    return (response.data.data || { message: response.data.message || 'Deleted successfully' }) as R;
  }

  /**
   * 전체 경로 생성
   * @param suffix - 추가 경로 (앞의 /는 자동 제거)
   */
  protected getPath(suffix: string = ''): string {
    if (!suffix) return this.basePath;
    // suffix 앞의 / 제거
    const cleanSuffix = suffix.startsWith('/') ? suffix.slice(1) : suffix;
    return `${this.basePath}/${cleanSuffix}`;
  }
}

