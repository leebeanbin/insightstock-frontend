# 💎 InsightStock — Development Guide
**Version 5.0 - Unified & Production Ready**  
**실전 배포 가능한 완전한 개발 가이드**

---

## 📚 목차

1. [AI Chatbot System](#1-ai-chatbot-system)
2. [Complete CRUD Patterns](#2-complete-crud-patterns)
3. [DTO & Validation Strategy](#3-dto--validation-strategy)
4. [Prisma Query Optimization](#4-prisma-query-optimization)
5. [Performance & Caching](#5-performance--caching)
6. [Error Handling & Logging](#6-error-handling--logging)
7. [Testing Strategy](#7-testing-strategy)
8. [Complete Implementation Examples](#8-complete-implementation-examples)

---

## 1. AI Chatbot System

### 1.1 System Architecture

```
┌─────────────────────────────────────────────────────┐
│                  Frontend (Next.js)                 │
│  ┌──────────────────────────────────────────────┐  │
│  │   Chat Interface                             │  │
│  │   - Message Input                            │  │
│  │   - Message History (infinite scroll)        │  │
│  │   - Typing Indicator                         │  │
│  │   - Streaming Response (SSE)                 │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
                      ↓ HTTP / SSE
┌─────────────────────────────────────────────────────┐
│              Backend API (Express)                  │
│  ┌──────────────────────────────────────────────┐  │
│  │  Chat Controller                             │  │
│  │  - POST /chat/messages                       │  │
│  │  - POST /chat/messages/stream (SSE)          │  │
│  │  - GET /chat/conversations                   │  │
│  └──────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────┐  │
│  │  AI Service                                  │  │
│  │  - RAG Context Building                      │  │
│  │  - Prompt Engineering                        │  │
│  │  - Stream Handling                           │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
         ↓                    ↓                    ↓
┌───────────────┐   ┌──────────────┐   ┌──────────────┐
│ PostgreSQL    │   │ Redis        │   │ Pinecone     │
│ - 대화 저장   │   │ - 세션 캐시  │   │ - RAG 검색   │
└───────────────┘   └──────────────┘   └──────────────┘
                           ↓
                    ┌──────────────┐
                    │ OpenAI API   │
                    │ GPT-4o mini  │
                    └──────────────┘
```

### 1.2 완전한 구현

#### 1.2.1 AI Service (Core)

```typescript
// src/services/ai.service.ts
import OpenAI from 'openai';
import { Pinecone } from '@pinecone-database/pinecone';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });

export class AIService {
  // ============================================
  // RAG: 관련 문서 검색
  // ============================================
  async searchRelevantDocs(query: string, topK: number = 5) {
    // 1. 쿼리 임베딩 생성
    const embedding = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: query
    });

    // 2. Pinecone 검색
    const index = pinecone.index(process.env.PINECONE_INDEX!);
    const results = await index.query({
      vector: embedding.data[0].embedding,
      topK,
      includeMetadata: true
    });

    return results.matches.map(match => ({
      content: match.metadata.content,
      source: match.metadata.source,
      score: match.score
    }));
  }

  // ============================================
  // 프롬프트 생성
  // ============================================
  buildPrompt(
    userQuestion: string,
    conversationHistory: Array<{ role: string; content: string }>,
    ragContext: Array<{ content: string; source: string }>
  ) {
    const systemPrompt = `당신은 주식 초보자를 위한 금융 교육 AI입니다.

**역할:**
- 금융 개념을 쉽고 명확하게 설명
- 실제 사례를 들어 이해를 돕기
- 복잡한 내용은 단계별로 설명
- 항상 친절하고 격려하는 톤 유지

**참고 문서:**
${ragContext.map((doc, i) => `[${i + 1}] ${doc.content}\n출처: ${doc.source}`).join('\n\n')}

**지침:**
1. 위 문서를 참고하되, 그대로 베끼지 말고 이해하기 쉽게 재구성하세요.
2. 금융 용어는 반드시 설명을 덧붙이세요.
3. 예시를 들어 설명하세요.
4. 추가 질문을 유도하는 것도 좋습니다.`;

    return [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.slice(-10), // 최근 10개만
      { role: 'user', content: userQuestion }
    ];
  }

  // ============================================
  // 일반 응답 (비스트리밍)
  // ============================================
  async sendMessage(
    conversationId: string,
    userMessage: string,
    userId: string
  ) {
    // 1. 대화 히스토리 조회
    const history = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
      take: 10,
      select: { role: true, content: true }
    });

    // 2. RAG 검색
    const ragDocs = await this.searchRelevantDocs(userMessage);

    // 3. 프롬프트 생성
    const messages = this.buildPrompt(userMessage, history, ragDocs);

    // 4. OpenAI 호출
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      temperature: 0.7,
      max_tokens: 1000
    });

    const assistantMessage = completion.choices[0].message.content;

    // 5. 메시지 저장
    await prisma.message.createMany({
      data: [
        {
          conversationId,
          userId,
          role: 'user',
          content: userMessage
        },
        {
          conversationId,
          userId,
          role: 'assistant',
          content: assistantMessage
        }
      ]
    });

    return {
      conversationId,
      message: assistantMessage,
      sources: ragDocs.map(d => d.source)
    };
  }

  // ============================================
  // 스트리밍 응답 (SSE)
  // ============================================
  async sendMessageStream(
    conversationId: string,
    userMessage: string,
    userId: string,
    onToken: (token: string) => void,
    onDone: () => void
  ) {
    // 1. 대화 히스토리 조회
    const history = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
      take: 10,
      select: { role: true, content: true }
    });

    // 2. RAG 검색
    const ragDocs = await this.searchRelevantDocs(userMessage);

    // 3. 프롬프트 생성
    const messages = this.buildPrompt(userMessage, history, ragDocs);

    // 4. OpenAI 스트리밍 호출
    const stream = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      temperature: 0.7,
      max_tokens: 1000,
      stream: true
    });

    let fullResponse = '';

    // 5. 스트리밍 처리
    for await (const chunk of stream) {
      const token = chunk.choices[0]?.delta?.content || '';
      if (token) {
        fullResponse += token;
        onToken(token);
      }
    }

    // 6. 메시지 저장
    await prisma.message.createMany({
      data: [
        {
          conversationId,
          userId,
          role: 'user',
          content: userMessage
        },
        {
          conversationId,
          userId,
          role: 'assistant',
          content: fullResponse
        }
      ]
    });

    onDone();

    return {
      conversationId,
      message: fullResponse,
      sources: ragDocs.map(d => d.source)
    };
  }
}
```

#### 1.2.2 Chat Controller (SSE)

```typescript
// src/controllers/chat.controller.ts
import { Request, Response } from 'express';
import { AIService } from '../services/ai.service';

const aiService = new AIService();

export class ChatController {
  // ============================================
  // POST /chat/messages (일반)
  // ============================================
  async sendMessage(req: Request, res: Response) {
    const { conversationId, message } = req.body;
    const userId = req.user!.id;

    const result = await aiService.sendMessage(
      conversationId,
      message,
      userId
    );

    res.json(result);
  }

  // ============================================
  // POST /chat/messages/stream (SSE)
  // ============================================
  async sendMessageStream(req: Request, res: Response) {
    const { conversationId, message } = req.body;
    const userId = req.user!.id;

    // SSE 헤더 설정
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // 시작 이벤트
    res.write(`event: start\ndata: ${JSON.stringify({ conversationId })}\n\n`);

    // 토큰 스트리밍
    await aiService.sendMessageStream(
      conversationId,
      message,
      userId,
      (token) => {
        res.write(`event: token\ndata: ${JSON.stringify({ token })}\n\n`);
      },
      () => {
        res.write(`event: done\ndata: ${JSON.stringify({ conversationId })}\n\n`);
        res.end();
      }
    );
  }

  // ============================================
  // GET /chat/conversations
  // ============================================
  async getConversations(req: Request, res: Response) {
    const userId = req.user!.id;
    const { limit = 20, offset = 0 } = req.query;

    const conversations = await prisma.conversation.findMany({
      where: { userId },
      orderBy: { lastMessageAt: 'desc' },
      take: Number(limit),
      skip: Number(offset),
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });

    const total = await prisma.conversation.count({ where: { userId } });

    res.json({
      conversations: conversations.map(conv => ({
        id: conv.id,
        title: conv.title,
        lastMessage: conv.messages[0]?.content,
        lastMessageAt: conv.lastMessageAt
      })),
      total
    });
  }
}
```

#### 1.2.3 Frontend (React + SSE)

```typescript
// src/components/ChatInterface.tsx
import { useState, useRef, useEffect } from 'react';

export function ChatInterface({ conversationId }: { conversationId: string }) {
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);

  // 메시지 전송 (스트리밍)
  const sendMessage = async () => {
    if (!input.trim() || isStreaming) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsStreaming(true);

    // SSE 연결
    const eventSource = new EventSource(
      `/api/chat/messages/stream?conversationId=${conversationId}&message=${encodeURIComponent(userMessage)}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );

    eventSourceRef.current = eventSource;

    let assistantMessage = '';

    // 시작 이벤트
    eventSource.addEventListener('start', (e) => {
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);
    });

    // 토큰 이벤트
    eventSource.addEventListener('token', (e) => {
      const { token } = JSON.parse(e.data);
      assistantMessage += token;
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1].content = assistantMessage;
        return newMessages;
      });
    });

    // 완료 이벤트
    eventSource.addEventListener('done', (e) => {
      eventSource.close();
      setIsStreaming(false);
    });

    // 에러 핸들링
    eventSource.onerror = () => {
      eventSource.close();
      setIsStreaming(false);
      alert('스트리밍 중 오류가 발생했습니다.');
    };
  };

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  return (
    <div className="chat-interface">
      {/* 메시지 리스트 */}
      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.role}`}>
            {msg.content}
          </div>
        ))}
        {isStreaming && <div className="typing-indicator">입력 중...</div>}
      </div>

      {/* 입력 */}
      <div className="input-container">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="질문을 입력하세요..."
          disabled={isStreaming}
        />
        <button onClick={sendMessage} disabled={isStreaming}>
          전송
        </button>
      </div>
    </div>
  );
}
```

---

## 2. Complete CRUD Patterns

### 2.1 3-Layer Architecture

```
┌─────────────────────────────────────────────┐
│           Controller Layer                  │
│  - 요청/응답 처리                           │
│  - Validation (DTO)                         │
│  - Error Handling                           │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│           Service Layer                     │
│  - 비즈니스 로직                            │
│  - Transaction 관리                         │
│  - 외부 API 호출                            │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│           Repository Layer                  │
│  - Database 쿼리                            │
│  - Prisma ORM                               │
│  - 캐싱                                     │
└─────────────────────────────────────────────┘
```

### 2.2 Portfolio CRUD (완전한 예시)

#### 2.2.1 Repository Layer

```typescript
// src/repositories/portfolio.repository.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class PortfolioRepository {
  // Create
  async create(data: {
    userId: string;
    stockId: string;
    quantity: number;
    averagePrice: number;
  }) {
    return prisma.portfolio.create({
      data,
      include: {
        stock: {
          select: {
            id: true,
            code: true,
            name: true,
            currentPrice: true,
            changeRate: true
          }
        }
      }
    });
  }

  // Read (List with Pagination)
  async findMany(params: {
    userId: string;
    limit: number;
    offset: number;
    sortBy?: 'profit' | 'profitRate' | 'currentValue';
    sortOrder?: 'asc' | 'desc';
  }) {
    const { userId, limit, offset, sortBy = 'currentValue', sortOrder = 'desc' } = params;

    // N+1 방지: include 사용
    const portfolios = await prisma.portfolio.findMany({
      where: { userId },
      take: limit,
      skip: offset,
      include: {
        stock: {
          select: {
            id: true,
            code: true,
            name: true,
            currentPrice: true,
            changeRate: true
          }
        }
      }
    });

    const total = await prisma.portfolio.count({ where: { userId } });

    return { portfolios, total };
  }

  // Read (Single)
  async findById(id: string) {
    return prisma.portfolio.findUnique({
      where: { id },
      include: {
        stock: true
      }
    });
  }

  // Update
  async update(id: string, data: {
    quantity?: number;
    averagePrice?: number;
  }) {
    return prisma.portfolio.update({
      where: { id },
      data,
      include: {
        stock: true
      }
    });
  }

  // Delete
  async delete(id: string) {
    return prisma.portfolio.delete({ where: { id } });
  }

  // Summary (집계)
  async getSummary(userId: string) {
    const portfolios = await prisma.portfolio.findMany({
      where: { userId },
      include: {
        stock: {
          select: {
            currentPrice: true
          }
        }
      }
    });

    const totalCost = portfolios.reduce(
      (sum, p) => sum + Number(p.averagePrice) * p.quantity,
      0
    );

    const currentValue = portfolios.reduce(
      (sum, p) => sum + Number(p.stock.currentPrice) * p.quantity,
      0
    );

    return {
      totalCost,
      currentValue,
      totalProfit: currentValue - totalCost,
      totalProfitRate: ((currentValue - totalCost) / totalCost) * 100
    };
  }
}
```

#### 2.2.2 Service Layer

```typescript
// src/services/portfolio.service.ts
import { PortfolioRepository } from '../repositories/portfolio.repository';
import { NotFoundError, ValidationError } from '../utils/errors';

const portfolioRepo = new PortfolioRepository();

export class PortfolioService {
  // Create
  async createPortfolio(data: {
    userId: string;
    stockId: string;
    quantity: number;
    averagePrice: number;
  }) {
    // 중복 체크
    const existing = await prisma.portfolio.findUnique({
      where: {
        userId_stockId: {
          userId: data.userId,
          stockId: data.stockId
        }
      }
    });

    if (existing) {
      throw new ValidationError('이미 포트폴리오에 추가된 종목입니다.');
    }

    // 생성
    const portfolio = await portfolioRepo.create(data);

    // 수익률 계산
    return this.enrichPortfolio(portfolio);
  }

  // List
  async getPortfolios(params: {
    userId: string;
    limit: number;
    offset: number;
    sortBy?: 'profit' | 'profitRate' | 'currentValue';
    sortOrder?: 'asc' | 'desc';
  }) {
    const { portfolios, total } = await portfolioRepo.findMany(params);

    // 수익률 계산 (Batch)
    const enriched = portfolios.map(p => this.enrichPortfolio(p));

    // Summary 계산
    const summary = await portfolioRepo.getSummary(params.userId);

    return {
      portfolios: enriched,
      summary,
      total
    };
  }

  // Detail
  async getPortfolio(id: string, userId: string) {
    const portfolio = await portfolioRepo.findById(id);

    if (!portfolio) {
      throw new NotFoundError('포트폴리오를 찾을 수 없습니다.');
    }

    if (portfolio.userId !== userId) {
      throw new ForbiddenError('권한이 없습니다.');
    }

    return this.enrichPortfolio(portfolio);
  }

  // Update
  async updatePortfolio(
    id: string,
    userId: string,
    data: { quantity?: number; averagePrice?: number }
  ) {
    // 권한 확인
    const existing = await portfolioRepo.findById(id);
    if (!existing) {
      throw new NotFoundError('포트폴리오를 찾을 수 없습니다.');
    }
    if (existing.userId !== userId) {
      throw new ForbiddenError('권한이 없습니다.');
    }

    // 업데이트
    const portfolio = await portfolioRepo.update(id, data);

    return this.enrichPortfolio(portfolio);
  }

  // Delete
  async deletePortfolio(id: string, userId: string) {
    // 권한 확인
    const existing = await portfolioRepo.findById(id);
    if (!existing) {
      throw new NotFoundError('포트폴리오를 찾을 수 없습니다.');
    }
    if (existing.userId !== userId) {
      throw new ForbiddenError('권한이 없습니다.');
    }

    // 삭제
    await portfolioRepo.delete(id);

    return { message: '포트폴리오가 삭제되었습니다.' };
  }

  // Helper: 수익률 계산
  private enrichPortfolio(portfolio: any) {
    const totalCost = Number(portfolio.averagePrice) * portfolio.quantity;
    const currentValue = Number(portfolio.stock.currentPrice) * portfolio.quantity;
    const profit = currentValue - totalCost;
    const profitRate = (profit / totalCost) * 100;

    return {
      ...portfolio,
      totalCost,
      currentValue,
      profit,
      profitRate: Number(profitRate.toFixed(2))
    };
  }
}
```

#### 2.2.3 Controller Layer

```typescript
// src/controllers/portfolio.controller.ts
import { Request, Response } from 'express';
import { PortfolioService } from '../services/portfolio.service';
import { CreatePortfolioDTO, UpdatePortfolioDTO } from '../dtos/portfolio.dto';

const portfolioService = new PortfolioService();

export class PortfolioController {
  // POST /portfolio
  async create(req: Request, res: Response) {
    const dto = CreatePortfolioDTO.parse(req.body);
    const userId = req.user!.id;

    const portfolio = await portfolioService.createPortfolio({
      ...dto,
      userId
    });

    res.status(201).json(portfolio);
  }

  // GET /portfolio
  async list(req: Request, res: Response) {
    const userId = req.user!.id;
    const { limit = 50, offset = 0, sortBy, sortOrder } = req.query;

    const result = await portfolioService.getPortfolios({
      userId,
      limit: Number(limit),
      offset: Number(offset),
      sortBy: sortBy as any,
      sortOrder: sortOrder as any
    });

    res.json(result);
  }

  // GET /portfolio/:id
  async detail(req: Request, res: Response) {
    const { id } = req.params;
    const userId = req.user!.id;

    const portfolio = await portfolioService.getPortfolio(id, userId);

    res.json(portfolio);
  }

  // PATCH /portfolio/:id
  async update(req: Request, res: Response) {
    const { id } = req.params;
    const userId = req.user!.id;
    const dto = UpdatePortfolioDTO.parse(req.body);

    const portfolio = await portfolioService.updatePortfolio(id, userId, dto);

    res.json(portfolio);
  }

  // DELETE /portfolio/:id
  async delete(req: Request, res: Response) {
    const { id } = req.params;
    const userId = req.user!.id;

    const result = await portfolioService.deletePortfolio(id, userId);

    res.json(result);
  }
}
```

---

## 3. DTO & Validation Strategy

### 3.1 Zod를 활용한 DTO

```typescript
// src/dtos/portfolio.dto.ts
import { z } from 'zod';

// Create DTO
export const CreatePortfolioDTO = z.object({
  stockId: z.string().cuid(),
  quantity: z.number().int().positive(),
  averagePrice: z.number().positive()
});

export type CreatePortfolioDTO = z.infer<typeof CreatePortfolioDTO>;

// Update DTO
export const UpdatePortfolioDTO = z.object({
  quantity: z.number().int().positive().optional(),
  averagePrice: z.number().positive().optional()
}).refine(data => Object.keys(data).length > 0, {
  message: '최소 하나의 필드는 업데이트해야 합니다.'
});

export type UpdatePortfolioDTO = z.infer<typeof UpdatePortfolioDTO>;

// Query DTO
export const PortfolioQueryDTO = z.object({
  limit: z.coerce.number().int().positive().max(100).default(50),
  offset: z.coerce.number().int().min(0).default(0),
  sortBy: z.enum(['profit', 'profitRate', 'currentValue']).optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
});

export type PortfolioQueryDTO = z.infer<typeof PortfolioQueryDTO>;
```

### 3.2 Validation Middleware

```typescript
// src/middleware/validate.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { ValidationError } from '../utils/errors';

export function validateBody(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error: any) {
      throw new ValidationError(error.errors[0].message);
    }
  };
}

export function validateQuery(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.query = schema.parse(req.query);
      next();
    } catch (error: any) {
      throw new ValidationError(error.errors[0].message);
    }
  };
}

// 사용 예시
import { validateBody } from '../middleware/validate.middleware';
import { CreatePortfolioDTO } from '../dtos/portfolio.dto';

router.post(
  '/portfolio',
  authMiddleware,
  validateBody(CreatePortfolioDTO),
  portfolioController.create
);
```

---

## 4. Prisma Query Optimization

### 4.1 N+1 문제 방지

```typescript
// ❌ N+1 문제 (BAD)
const portfolios = await prisma.portfolio.findMany({ where: { userId } });
for (const portfolio of portfolios) {
  const stock = await prisma.stock.findUnique({ where: { id: portfolio.stockId } });
  // N+1 쿼리 발생!
}

// ✅ include 사용 (GOOD)
const portfolios = await prisma.portfolio.findMany({
  where: { userId },
  include: {
    stock: true
  }
});

// ✅ select로 필요한 필드만 (BETTER)
const portfolios = await prisma.portfolio.findMany({
  where: { userId },
  include: {
    stock: {
      select: {
        id: true,
        code: true,
        name: true,
        currentPrice: true,
        changeRate: true
      }
    }
  }
});
```

### 4.2 Batch 쿼리

```typescript
// ❌ 루프 안에서 개별 쿼리 (BAD)
for (const stockId of stockIds) {
  await prisma.stock.update({
    where: { id: stockId },
    data: { updatedAt: new Date() }
  });
}

// ✅ updateMany 사용 (GOOD)
await prisma.stock.updateMany({
  where: { id: { in: stockIds } },
  data: { updatedAt: new Date() }
});
```

### 4.3 Transaction

```typescript
// 여러 쿼리를 원자적으로 실행
await prisma.$transaction(async (tx) => {
  // 1. Portfolio 업데이트
  await tx.portfolio.update({
    where: { id: portfolioId },
    data: { quantity: newQuantity }
  });

  // 2. Trade 기록 생성
  await tx.trade.create({
    data: {
      userId,
      stockId,
      type: 'BUY',
      quantity: addedQuantity,
      price: currentPrice
    }
  });

  // 3. User 통계 업데이트
  await tx.user.update({
    where: { id: userId },
    data: {
      totalInvestment: { increment: totalAmount }
    }
  });
});
```

### 4.4 Raw Query (성능 최적화)

```typescript
// Prisma로 복잡한 집계가 어려운 경우
const result = await prisma.$queryRaw`
  SELECT 
    s.sector,
    COUNT(*) as stock_count,
    SUM(p.quantity * s.current_price) as total_value
  FROM portfolios p
  JOIN stocks s ON p.stock_id = s.id
  WHERE p.user_id = ${userId}
  GROUP BY s.sector
  ORDER BY total_value DESC
`;
```

---

## 5. Performance & Caching

### 5.1 Redis 캐싱 전략

#### 5.1.1 Cache-Aside Pattern

```typescript
// src/utils/cache.ts
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

export async function getOrCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 300 // 5분
): Promise<T> {
  // 1. 캐시 확인
  const cached = await redis.get(key);
  if (cached) {
    return JSON.parse(cached);
  }

  // 2. DB 조회
  const data = await fetcher();

  // 3. 캐시 저장
  await redis.setex(key, ttl, JSON.stringify(data));

  return data;
}

// 사용 예시
export async function getStock(id: string) {
  return getOrCache(
    `stock:${id}`,
    () => prisma.stock.findUnique({ where: { id } }),
    60 // 1분 캐시
  );
}
```

#### 5.1.2 Write-Through Pattern

```typescript
export async function updateStock(id: string, data: any) {
  // 1. DB 업데이트
  const stock = await prisma.stock.update({
    where: { id },
    data
  });

  // 2. 캐시 업데이트
  await redis.setex(
    `stock:${id}`,
    60,
    JSON.stringify(stock)
  );

  return stock;
}
```

#### 5.1.3 Cache Invalidation

```typescript
// 패턴 매칭으로 삭제
export async function invalidateStockCache(stockId: string) {
  const keys = await redis.keys(`stock:${stockId}:*`);
  if (keys.length > 0) {
    await redis.del(...keys);
  }
}

// 태그 기반 삭제
export async function invalidatePortfolioCache(userId: string) {
  await redis.del(`portfolio:${userId}:list`);
  await redis.del(`portfolio:${userId}:summary`);
}
```

### 5.2 캐싱 레이어별 전략

| 레이어 | TTL | 사용처 |
|--------|-----|--------|
| 정적 데이터 | 1시간+ | 금융 개념, 전략 설명 |
| 준정적 데이터 | 5-15분 | 종목 정보, 뉴스 |
| 실시간 데이터 | 10-60초 | 주가, 시장 지수 |
| 사용자 세션 | 7일 | JWT, 세션 |

---

## 6. Error Handling & Logging

### 6.1 Custom Error Classes

```typescript
// src/utils/errors.ts
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(400, message);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(401, message);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(403, message);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(404, message);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Conflict') {
    super(409, message);
  }
}
```

### 6.2 Error Handler Middleware

```typescript
// src/middleware/error.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { logger } from '../utils/logger';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Operational Error (예상된 에러)
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: {
        message: err.message,
        statusCode: err.statusCode
      }
    });
  }

  // Prisma Errors
  if (err.name === 'PrismaClientKnownRequestError') {
    const prismaError = err as any;
    
    if (prismaError.code === 'P2002') {
      return res.status(409).json({
        error: { message: '이미 존재하는 데이터입니다.' }
      });
    }
    
    if (prismaError.code === 'P2025') {
      return res.status(404).json({
        error: { message: '리소스를 찾을 수 없습니다.' }
      });
    }
  }

  // Zod Validation Errors
  if (err.name === 'ZodError') {
    return res.status(400).json({
      error: {
        message: 'Validation error',
        details: (err as any).errors
      }
    });
  }

  // Unknown Errors (예상치 못한 에러)
  logger.error(err);
  return res.status(500).json({
    error: { message: 'Internal server error' }
  });
}
```

### 6.3 Logging with Winston

```typescript
// src/utils/logger.ts
import winston from 'winston';

export const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

// Request Logger
export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info({
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      userId: req.user?.id
    });
  });
  
  next();
}
```

---

## 7. Testing Strategy

### 7.1 Unit Tests (Jest)

```typescript
// src/services/__tests__/portfolio.service.test.ts
import { PortfolioService } from '../portfolio.service';
import { prismaMock } from '../../utils/prisma-mock';

describe('PortfolioService', () => {
  let service: PortfolioService;

  beforeEach(() => {
    service = new PortfolioService();
  });

  describe('createPortfolio', () => {
    it('should create a portfolio successfully', async () => {
      const mockData = {
        userId: 'user123',
        stockId: 'stock123',
        quantity: 10,
        averagePrice: 71000
      };

      prismaMock.portfolio.findUnique.mockResolvedValue(null);
      prismaMock.portfolio.create.mockResolvedValue({
        id: 'port123',
        ...mockData,
        stock: {
          id: 'stock123',
          code: '005930',
          name: '삼성전자',
          currentPrice: 71500
        }
      } as any);

      const result = await service.createPortfolio(mockData);

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('profit');
      expect(result.profit).toBeGreaterThan(0);
    });

    it('should throw error if stock already in portfolio', async () => {
      prismaMock.portfolio.findUnique.mockResolvedValue({ id: 'existing' } as any);

      await expect(
        service.createPortfolio({
          userId: 'user123',
          stockId: 'stock123',
          quantity: 10,
          averagePrice: 71000
        })
      ).rejects.toThrow('이미 포트폴리오에 추가된 종목입니다.');
    });
  });
});
```

### 7.2 Integration Tests

```typescript
// src/controllers/__tests__/portfolio.controller.integration.test.ts
import request from 'supertest';
import { app } from '../../app';
import { prisma } from '../../utils/prisma';

describe('Portfolio API Integration Tests', () => {
  let token: string;
  let userId: string;

  beforeAll(async () => {
    // 테스트 사용자 생성
    const user = await prisma.user.create({
      data: { email: 'test@example.com', password: 'hashed' }
    });
    userId = user.id;

    // 토큰 발급
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'password' });
    token = res.body.accessToken;
  });

  afterAll(async () => {
    // 테스트 데이터 정리
    await prisma.portfolio.deleteMany({ where: { userId } });
    await prisma.user.delete({ where: { id: userId } });
    await prisma.$disconnect();
  });

  describe('POST /api/portfolio', () => {
    it('should create a portfolio', async () => {
      const res = await request(app)
        .post('/api/portfolio')
        .set('Authorization', `Bearer ${token}`)
        .send({
          stockId: 'stock123',
          quantity: 10,
          averagePrice: 71000
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.quantity).toBe(10);
    });

    it('should return 401 without token', async () => {
      const res = await request(app)
        .post('/api/portfolio')
        .send({
          stockId: 'stock123',
          quantity: 10,
          averagePrice: 71000
        });

      expect(res.status).toBe(401);
    });
  });
});
```

### 7.3 E2E Tests (Playwright)

```typescript
// e2e/portfolio.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Portfolio Flow', () => {
  test.beforeEach(async ({ page }) => {
    // 로그인
    await page.goto('/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/dashboard');
  });

  test('should add stock to portfolio', async ({ page }) => {
    // 종목 검색
    await page.goto('/stocks');
    await page.fill('input[placeholder="종목 검색"]', '삼성전자');
    await page.click('text=005930 삼성전자');

    // 포트폴리오 추가
    await page.click('button:has-text("포트폴리오 추가")');
    await page.fill('input[name="quantity"]', '10');
    await page.fill('input[name="averagePrice"]', '71000');
    await page.click('button:has-text("추가")');

    // 확인
    await expect(page.locator('text=포트폴리오에 추가되었습니다')).toBeVisible();
  });
});
```

---

## 8. Complete Implementation Examples

### 8.1 Stock Module (전체)

```typescript
// ============================================
// src/repositories/stock.repository.ts
// ============================================
export class StockRepository {
  async findMany(filters: {
    market?: string;
    sector?: string;
    limit: number;
    offset: number;
  }) {
    const { market, sector, limit, offset } = filters;

    const where: any = {};
    if (market && market !== 'all') where.market = market;
    if (sector) where.sector = sector;

    const [stocks, total] = await Promise.all([
      prisma.stock.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: { marketCap: 'desc' }
      }),
      prisma.stock.count({ where })
    ]);

    return { stocks, total };
  }

  async findById(id: string) {
    return prisma.stock.findUnique({ where: { id } });
  }

  async findByCode(code: string) {
    return prisma.stock.findUnique({ where: { code } });
  }

  async search(query: string, limit: number = 10) {
    return prisma.stock.findMany({
      where: {
        OR: [
          { name: { contains: query } },
          { code: { contains: query } }
        ]
      },
      take: limit,
      select: {
        id: true,
        code: true,
        name: true,
        currentPrice: true,
        changeRate: true,
        market: true
      }
    });
  }
}

// ============================================
// src/services/stock.service.ts
// ============================================
export class StockService {
  constructor(private repo: StockRepository) {}

  async getStocks(filters: {
    market?: string;
    sector?: string;
    limit: number;
    offset: number;
  }) {
    return getOrCache(
      `stocks:${JSON.stringify(filters)}`,
      () => this.repo.findMany(filters),
      300 // 5분 캐시
    );
  }

  async getStock(id: string) {
    return getOrCache(
      `stock:${id}`,
      () => this.repo.findById(id),
      60 // 1분 캐시
    );
  }

  async getStockPrices(stockId: string, period: string) {
    // 한국투자증권 API 호출
    const prices = await koreaInvestmentAPI.getPrices(stockId, period);

    return prices;
  }

  async searchStocks(query: string) {
    return this.repo.search(query);
  }
}

// ============================================
// src/controllers/stock.controller.ts
// ============================================
export class StockController {
  constructor(private service: StockService) {}

  async list(req: Request, res: Response) {
    const { market, sector, limit = 20, offset = 0 } = req.query;

    const result = await this.service.getStocks({
      market: market as string,
      sector: sector as string,
      limit: Number(limit),
      offset: Number(offset)
    });

    res.json(result);
  }

  async detail(req: Request, res: Response) {
    const { id } = req.params;

    const stock = await this.service.getStock(id);

    if (!stock) {
      throw new NotFoundError('종목을 찾을 수 없습니다.');
    }

    res.json(stock);
  }

  async prices(req: Request, res: Response) {
    const { id } = req.params;
    const { period = '1m' } = req.query;

    const prices = await this.service.getStockPrices(id, period as string);

    res.json(prices);
  }

  async search(req: Request, res: Response) {
    const { q } = req.query;

    if (!q) {
      throw new ValidationError('검색어를 입력해주세요.');
    }

    const results = await this.service.searchStocks(q as string);

    res.json({ results });
  }
}

// ============================================
// src/routes/stock.routes.ts
// ============================================
import { Router } from 'express';
import { StockController } from '../controllers/stock.controller';
import { StockService } from '../services/stock.service';
import { StockRepository } from '../repositories/stock.repository';

const router = Router();
const stockRepo = new StockRepository();
const stockService = new StockService(stockRepo);
const stockController = new StockController(stockService);

router.get('/stocks', (req, res) => stockController.list(req, res));
router.get('/stocks/search', (req, res) => stockController.search(req, res));
router.get('/stocks/:id', (req, res) => stockController.detail(req, res));
router.get('/stocks/:id/prices', (req, res) => stockController.prices(req, res));

export default router;
```

---

## 9. 최종 체크리스트

### 9.1 코드 품질

```
☐ TypeScript strict mode 활성화
☐ ESLint + Prettier 설정
☐ Husky + lint-staged (commit hook)
☐ 모든 함수에 JSDoc 주석
☐ 명확한 변수/함수명
☐ Magic Number 제거 (상수로 분리)
☐ Dead Code 제거
```

### 9.2 Performance

```
☐ Database 인덱스 확인
☐ N+1 쿼리 방지 (include 사용)
☐ Redis 캐싱 적용
☐ API Rate Limiting
☐ 이미지 최적화
☐ Lazy Loading
☐ Code Splitting
```

### 9.3 Security

```
☐ JWT Secret 환경 변수화
☐ CORS 설정
☐ Helmet 사용
☐ SQL Injection 방지 (Prisma 사용)
☐ XSS 방지
☐ Rate Limiting
☐ Input Validation (Zod)
```

### 9.4 Testing

```
☐ Unit Tests (80%+ coverage)
☐ Integration Tests
☐ E2E Tests (주요 플로우)
☐ Load Testing (k6)
```

### 9.5 Monitoring

```
☐ Winston Logger
☐ Sentry (Error Tracking)
☐ Health Check 엔드포인트
☐ Uptime Monitoring
```

---

**이제 진짜 완전한 개발 가이드입니다!** 🎉

모든 패턴, 최적화, 테스팅 전략이 포함되었습니다! 바로 개발 시작 가능합니다! 🚀
