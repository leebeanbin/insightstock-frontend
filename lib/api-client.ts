import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { toast } from 'sonner';

// API 클라이언트 생성
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request 인터셉터: JWT 토큰 추가 및 로깅
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const startTime = Date.now();
    const requestId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // 요청 메타데이터 저장 (응답 인터셉터에서 사용)
    (config as any).__requestStartTime = startTime;
    (config as any).__requestId = requestId;
    
    // 클라이언트 사이드에서만 localStorage 접근
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // 백엔드로 API 요청 로그 전송
      try {
        const { backendLogger } = await import('@/lib/utils/backend-logger');
        const fullURL = `${config.baseURL}${config.url}`;
        backendLogger.debug(`API Request: ${config.method?.toUpperCase()} ${fullURL}`, {
          metadata: {
            requestId,
            method: config.method,
            url: fullURL,
            hasData: !!config.data,
            hasParams: !!config.params,
          },
        });
      } catch {
        // 백엔드 로거 로드 실패 시 무시
      }
    }
    
    return config;
  },
  async (error) => {
    // 요청 에러 로깅
    if (typeof window !== 'undefined') {
      try {
        const { backendLogger } = await import('@/lib/utils/backend-logger');
        backendLogger.error('API Request Error', error, {
          metadata: {
            message: error.message,
            config: error.config,
          },
        });
      } catch {
        // 무시
      }
    }
    return Promise.reject(error);
  }
);

// Response 인터셉터: 에러 처리 및 로깅
apiClient.interceptors.response.use(
  async (response) => {
    // 성공 응답 로깅
    if (typeof window !== 'undefined') {
      const config = response.config as any;
      const duration = config.__requestStartTime ? Date.now() - config.__requestStartTime : 0;
      const requestId = config.__requestId;
      
      try {
        const { backendLogger } = await import('@/lib/utils/backend-logger');
        const fullURL = `${response.config.baseURL}${response.config.url}`;
        backendLogger.debug(`API Response: ${response.config.method?.toUpperCase()} ${fullURL} - ${response.status} (${duration}ms)`, {
          metadata: {
            requestId,
            status: response.status,
            duration,
            hasData: !!response.data,
          },
        });
      } catch {
        // 무시
      }
    }
    
    return response;
  },
  async (error: AxiosError<{ message?: string; error?: { message?: string } }>) => {
    const url = error.config?.url || '';
    const isPortfolioCheck = url.includes('/portfolio/stock/');
    
    // 404 Not Found - 포트폴리오 체크 관련 404는 정상적인 상황(포트폴리오에 없음)이므로 조용히 처리
    if (error.response?.status === 404 && isPortfolioCheck) {
      // 백엔드로 로그 전송 (조용히, 에러 없이)
      if (typeof window !== 'undefined') {
        try {
          const { backendLogger } = await import('@/lib/utils/backend-logger');
          backendLogger.debug(`Portfolio check 404 (normal): ${url}`, {
            metadata: {
              stockId: url.split('/portfolio/stock/')[1],
            },
          });
        } catch {
          // 백엔드 로거 로드 실패 시 무시
        }
      }
      // 에러를 조용히 처리 (콘솔에 표시하지 않음)
      // validateStatus로 처리된 404는 여기까지 오지 않지만, 혹시 모를 경우를 대비
      return Promise.reject(error);
    }

    // 401 Unauthorized: 토큰 만료 또는 인증 실패
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        // 로그인 페이지로 리다이렉트 (페이지가 있는 경우)
        // 인터셉터 내부이므로 router를 사용할 수 없어 window.location 사용
        if (window.location.pathname !== '/login') {
          // Next.js의 router를 사용할 수 없으므로 window.location 사용
          // 단, 전체 페이지 리로드를 피하기 위해 가능하면 router 사용 권장
          window.location.href = '/login';
        }
      }
      toast.error('인증이 만료되었습니다. 다시 로그인해주세요.');
    }
    // 403 Forbidden: 권한 없음
    else if (error.response?.status === 403) {
      toast.error('접근 권한이 없습니다.');
    }
    // 404 Not Found (포트폴리오 체크 제외)
    else if (error.response?.status === 404) {
      toast.error('요청한 리소스를 찾을 수 없습니다.');
    }
    // 500 Server Error
    else if (error.response?.status === 500) {
      toast.error('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }
    // 기타 에러
    else if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    } else if (error.response?.data?.error?.message) {
      toast.error(error.response.data.error.message);
    } else if (error.message) {
      toast.error(error.message);
    } else {
      toast.error('알 수 없는 오류가 발생했습니다.');
    }

    return Promise.reject(error);
  }
);

export default apiClient;

