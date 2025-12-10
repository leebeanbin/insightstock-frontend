#!/bin/bash

# InsightStock Frontend Interactive Setup Script
# 각 단계를 체크하고 필요한 작업만 수행합니다

set -e

echo "🚀 InsightStock Frontend Setup"
echo "================================"
echo ""

# 색상 정의
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 체크 함수
check_step() {
    echo -e "${YELLOW}[CHECK]${NC} $1"
}

success_step() {
    echo -e "${GREEN}[✓]${NC} $1"
}

warn_step() {
    echo -e "${RED}[✗]${NC} $1"
}

ask_proceed() {
    read -p "$(echo -e ${YELLOW}[?]${NC}) $1 (y/N): " -n 1 -r
    echo
    [[ $REPLY =~ ^[Yy]$ ]]
}

echo "각 단계를 체크하고 필요한 작업만 수행합니다."
echo ""

# =====================================
# 1. Node.js 확인
# =====================================
check_step "1/5 Checking Node.js installation..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    success_step "Node.js is installed: $NODE_VERSION"
else
    warn_step "Node.js is not installed"
    echo "   Please install Node.js 20.x from https://nodejs.org/"
    exit 1
fi
echo ""

# =====================================
# 2. pnpm 확인
# =====================================
check_step "2/5 Checking pnpm installation..."
if command -v pnpm &> /dev/null; then
    PNPM_VERSION=$(pnpm -v)
    success_step "pnpm is installed: $PNPM_VERSION"
else
    warn_step "pnpm is not installed"
    if ask_proceed "Install pnpm now?"; then
        npm install -g pnpm
        success_step "pnpm installed"
    else
        echo "   Please install pnpm: npm install -g pnpm"
        exit 1
    fi
fi
echo ""

# =====================================
# 3. 의존성 설치 확인
# =====================================
check_step "3/5 Checking dependencies (node_modules)..."
if [ -d "node_modules" ]; then
    success_step "Dependencies are installed"
    if ask_proceed "Reinstall dependencies?"; then
        rm -rf node_modules
        pnpm install
        success_step "Dependencies reinstalled"
    fi
else
    warn_step "Dependencies not installed"
    if ask_proceed "Run pnpm install?"; then
        pnpm install
        success_step "Dependencies installed"
    else
        echo "   Skipping dependency installation"
        exit 1
    fi
fi
echo ""

# =====================================
# 4. 환경 변수 파일 확인
# =====================================
check_step "4/5 Checking .env.local file..."
if [ -f ".env.local" ]; then
    success_step ".env.local file exists"
    echo "   Current settings:"
    grep -E "^NEXT_PUBLIC_" .env.local | sed 's/=.*/=***/' || echo "   (no env variables found)"

    if ask_proceed "Edit .env.local file?"; then
        ${EDITOR:-nano} .env.local
    fi
else
    warn_step ".env.local file not found"
    if ask_proceed "Create .env.local file?"; then
        if [ -f ".env.example" ]; then
            cp .env.example .env.local
            success_step ".env.local created from .env.example"
        else
            echo "   Creating default .env.local..."
            cat > .env.local << EOF
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:3001

# WebSocket URL (optional)
NEXT_PUBLIC_WS_URL=ws://localhost:3001
EOF
            success_step ".env.local created with defaults"
        fi

        echo "   Default backend URL: http://localhost:3001"
        if ask_proceed "   Edit .env.local now?"; then
            ${EDITOR:-nano} .env.local
        fi
    fi
fi
echo ""

# =====================================
# 5. 백엔드 연결 확인
# =====================================
check_step "5/5 Checking backend connection..."
if [ -f ".env.local" ]; then
    BACKEND_URL=$(grep NEXT_PUBLIC_API_URL .env.local | cut -d'=' -f2)
    if [ ! -z "$BACKEND_URL" ]; then
        echo "   Backend URL: $BACKEND_URL"

        # 백엔드 연결 테스트
        if curl -s -f "$BACKEND_URL/health" > /dev/null 2>&1; then
            success_step "Backend is running and accessible"
        else
            warn_step "Backend is not accessible at $BACKEND_URL"
            echo "   Make sure backend server is running:"
            echo "   cd ../insightstock-backend && pnpm dev"
        fi
    fi
else
    warn_step "Cannot check backend connection (.env.local not found)"
fi
echo ""

# =====================================
# 빌드 캐시 정리 (선택)
# =====================================
if [ -d ".next" ]; then
    if ask_proceed "Clear Next.js build cache (.next folder)?"; then
        rm -rf .next
        success_step "Build cache cleared"
    fi
fi
echo ""

# =====================================
# 완료
# =====================================
echo "================================"
echo -e "${GREEN}✅ Setup process complete!${NC}"
echo ""
echo "Next steps:"
echo "  1. Make sure backend is running: cd ../insightstock-backend && pnpm dev"
echo "  2. Start dev server: pnpm dev"
echo "  3. Open browser: http://localhost:3000"
echo ""
echo "Optional commands:"
echo "  - pnpm build       (create production build)"
echo "  - pnpm start       (run production server)"
echo "  - pnpm lint        (run linter)"
echo ""
