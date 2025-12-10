import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 프로덕션 최적화
  compress: true,
  
  // 이미지 최적화
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // 이미지 최적화 캐시 설정
    minimumCacheTTL: 60 * 60 * 24 * 7, // 7일
  },
  
  // 실험적 기능
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-select',
      '@radix-ui/react-tabs',
      '@radix-ui/react-toast',
      'framer-motion',
      'lightweight-charts',
    ],
    // 서버 컴포넌트 최적화
    serverComponentsExternalPackages: ['@prisma/client'],
  },

  // 웹팩 최적화
  webpack: (config, { isServer }) => {
    // 클라이언트 번들 최적화
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            // 프레임워크 코드 분리
            framework: {
              name: 'framework',
              chunks: 'all',
              test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription)[\\/]/,
              priority: 40,
              enforce: true,
            },
            // 라이브러리 코드 분리
            lib: {
              test(module: any) {
                return module.size() > 160000 && /node_modules[/\\]/.test(module.identifier());
              },
              name(module: any) {
                const hash = require('crypto').createHash('sha1');
                hash.update(module.identifier());
                return hash.digest('hex').substring(0, 8);
              },
              priority: 30,
              minChunks: 1,
              reuseExistingChunk: true,
            },
            // 공통 코드 분리
            commons: {
              name: 'commons',
              minChunks: 2,
              priority: 20,
            },
            // 공유 코드 분리
            shared: {
              name(module: any, chunks: any) {
                return require('crypto')
                  .createHash('sha1')
                  .update(chunks.reduce((acc: string, chunk: any) => acc + chunk.name, ''))
                  .digest('hex')
                  .substring(0, 8);
              },
              priority: 10,
              minChunks: 2,
              reuseExistingChunk: true,
            },
          },
        },
      };
    }
    return config;
  },

  // Turbopack 설정 (Next.js 16 기본)
  turbopack: {
    // Turbopack은 자동으로 최적화를 수행합니다
  },
};

export default nextConfig;
