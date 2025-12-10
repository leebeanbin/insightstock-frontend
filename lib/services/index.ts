/**
 * Service Layer Export
 * 모든 Service를 한 곳에서 export (Facade Pattern)
 * SOLID: Dependency Inversion Principle
 */

import { ChatRepository } from '../repositories/chat.repository';
import { PortfolioRepository } from '../repositories/portfolio.repository';
import { FavoritesRepository } from '../repositories/favorites.repository';
import { HistoryRepository } from '../repositories/history.repository';
import { NewsRepository } from '../repositories/news.repository';
import { StockRepository } from '../repositories/stock.repository';
import { SearchRepository } from '../repositories/search.repository';
import { NoteRepository } from '../repositories/note.repository';

import { ChatService } from './chat.service';
import { PortfolioService } from './portfolio.service';
import { FavoritesService } from './favorites.service';
import { HistoryService } from './history.service';
import { NewsService } from './news.service';
import { StockService } from './stock.service';
import { SearchService } from './search.service';
import { NoteService, noteService } from './note.service';
import { LearningService } from './learning.service';
import { userActivityService } from './user-activity.service';

// Repository 인스턴스 생성 (Singleton Pattern)
const chatRepository = new ChatRepository();
const portfolioRepository = new PortfolioRepository();
const favoritesRepository = new FavoritesRepository();
const historyRepository = new HistoryRepository();
const newsRepository = new NewsRepository();
const stockRepository = new StockRepository();
const searchRepository = new SearchRepository();

// Service 인스턴스 생성 (Dependency Injection)
export const chatService = new ChatService(chatRepository);
export const portfolioService = new PortfolioService(portfolioRepository);
export const favoritesService = new FavoritesService(favoritesRepository);
export const historyService = new HistoryService(historyRepository);
export const newsService = new NewsService(newsRepository);
export const stockService = new StockService(stockRepository);
export const searchService = new SearchService(searchRepository);
export { noteService, userActivityService };

// Export for testing (의존성 주입 가능하도록)
export {
  ChatService,
  PortfolioService,
  FavoritesService,
  HistoryService,
  NewsService,
  StockService,
  SearchService,
  NoteService,
  LearningService,
};
export {
  ChatRepository,
  PortfolioRepository,
  FavoritesRepository,
  HistoryRepository,
  NewsRepository,
  StockRepository,
  SearchRepository,
  NoteRepository,
};

