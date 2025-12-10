/**
 * i18n Translations
 * 모든 번역 텍스트를 중앙에서 관리
 */

export type Language = 'ko' | 'en';

export interface Translations {
  common: {
    loading: string;
    error: string;
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    close: string;
    search: string;
    submit: string;
    confirm: string;
    yes: string;
    no: string;
    back: string;
    next: string;
    previous: string;
    refresh: string;
    retry: string;
    noData: string;
    noResults: string;
    count: string;
    cases: string;
    results: string;
    tryDifferentSearch: string;
    selectDifferentCategory: string;
    clear: string;
    loadFailed: string;
    unknown: string;
    errorOccurred: string;
    unexpectedError: string;
    searching: string;
    searchFailed: string;
    clearSearch: string;
    sending: string;
    adding: string;
    updating: string;
    total: string;
    unit: string;
    copy: string;
    copied: string;
    viewAll: string;
  };
  nav: {
    dashboard: string;
    news: string;
    education: string;
    explore: string;
    portfolio: string;
    favorites: string;
    history: string;
    hotIssue: string;
    settings: string;
  };
  dashboard: {
    title: string;
    selectStock: string;
    selectStockDescription: string;
    stockList: string;
    stockDetail: string;
    portfolioValue: string;
    totalReturn: string;
    holdings: string;
    recentActivity: string;
    noRecentActivity: string;
    searchPlaceholder: string;
    aiSummaryOnelineSummary: string;
    aiSummaryKeyIssue1: string;
    aiSummaryKeyIssue2: string;
    aiSummaryPriceAnalysis: string;
    aiSummaryRiskSummary: string;
    aiSummaryLearningCta: string;
    categories: {
      popular: string;
      battery: string;
      it: string;
      bio: string;
      finance: string;
      auto: string;
      media: string;
      rising: string;
      falling: string;
      volume: string;
    };
  };
  stock: {
    title: string;
    price: string;
    change: string;
    changePercent: string;
    volume: string;
    market: string;
    sector: string;
    per: string;
    pbr: string;
    rising: string;
    falling: string;
    addToPortfolio: string;
    addToFavorites: string;
    removeFromFavorites: string;
    inPortfolio: string;
    chartLoading: string;
    noChartData: string;
    oneMonth: string;
    threeMonths: string;
    sixMonths: string;
    oneYear: string;
    priceChart: string;
    relatedNews: string;
    newsLoadError: string;
    newsLoading: string;
    high: string;
    low: string;
    marketCap: string;
    companyOverview: string;
    notFound: string;
    notFoundDesc: string;
    loading: string;
  };
  news: {
    title: string;
    titleAndFeed: string;
    subtitle: string;
    loading: string;
    read: string;
    like: string;
    unlike: string;
    favorite: string;
    share: string;
    source: string;
    publishedAt: string;
    relatedNews: string;
    noNews: string;
    filterAll: string;
    filterPositive: string;
    filterNegative: string;
    filterNeutral: string;
    searchPlaceholder: string;
    aiSummary: string;
    aiAnalysis: string;
    keyIssues: string;
    relatedConcepts: string;
    relatedStocks: string;
    notFound: string;
    notFoundDesc: string;
    noContent: string;
    quiet: string;
    noRelatedNews: string;
    notesCount: string;
    dragToCreateNote: string;
    noNotesYet: string;
    dragToCreateNoteDesc: string;
    noTitle: string;
    topStocks: string;
    myStocks: string;
  };
  education: {
    today: string;
    dashboard: string;
    qa: string;
    notes: string;
    myNotes: string;
    scrapNews: string;
    noteCreated: string;
    questionHistory: string;
    questionPlaceholder: string;
    questionSubmit: string;
    questionGenerating: string;
    question: {
      history: string;
      input: string;
      inputDescription: string;
      placeholder: string;
      generating: string;
      sample: {
        per: string;
        dividend: string;
        rsi: string;
      };
    };
    difficulty: {
      beginner: string;
      intermediate: string;
      advanced: string;
    };
    saveNote: string;
    viewStocks: string;
    noNotes: string;
    noNotesDescription: string;
    createNote: string;
    createNoteFromNews: string;
    noteWithNews: string;
    selectNews: string;
    noNewsSelected: string;
    createNoteFromNewsDesc: string;
    editNote: string;
    noteTitle: string;
    noteContent: string;
    noteTags: string;
    noteTagsPlaceholder: string;
    notePlaceholder: string;
    noteContentPlaceholder: string;
    tagPlaceholder: string;
    deleteNoteConfirm: string;
    errorOccurred: string;
    related: string;
    learnMore: string;
    aiHelp: string;
    noRecommendations: string;
  };
  explore: {
    strategyExploration: string;
    strategySelection: string;
    selectStrategy: string;
    selectStrategyDescription: string;
    strategy: {
      dividend: string;
      dividendDescription: string;
      growth: string;
      growthDescription: string;
      value: string;
      valueDescription: string;
      momentum: string;
      momentumDescription: string;
      ai: string;
      aiDescription: string;
    };
    strategyDescription: string;
    recommendedStocks: string;
    stockName: string;
    currentPrice: string;
    changeRate: string;
    per: string;
    stocksCount: string;
  };
  portfolio: {
    title: string;
    subtitle: string;
    totalValue: string;
    totalReturn: string;
    holdings: string;
    addStock: string;
    added: string;
    editStock: string;
    removeStock: string;
    quantity: string;
    averagePrice: string;
    currentPrice: string;
    profit: string;
    profitRate: string;
    noPortfolio: string;
    noPortfolioDescription: string;
    selectStock: string;
    selectStockPlaceholder: string;
    selectStockError: string;
    quantityError: string;
    priceError: string;
    alreadyAdded: string;
    addFailed: string;
    updateSuccess: string;
    updateFailed: string;
    enterQuantity: string;
    enterPrice: string;
    expectedValue: string;
    currentValue: string;
    totalPurchase: string;
    expectedProfit: string;
    sortBy: string;
    addStockTitle: string;
    editStockTitle: string;
    stockName: string;
    shares: string;
    totalShares: string;
    action: string;
    weight: string;
    sectorAllocation: string;
    riskAnalysis: string;
    analyzing: string;
    removeConfirm: string;
    purchaseAmount: string;
    evaluation: string;
    sortByValue: string;
    sortByProfit: string;
    sortByReturn: string;
  };
  favorites: {
    title: string;
    subtitle: string;
    myFavorites: string;
    addFavorite: string;
    removeFavorite: string;
    added: string;
    removed: string;
    noFavorites: string;
    noFavoritesDescription: string;
    removeFailed: string;
    changeFailed: string;
    removeConfirm: string;
    emptyTitle: string;
    emptyDescription: string;
    removeLabel: string;
    volume: string;
  };
  history: {
    title: string;
    subtitle: string;
    loading: string;
    viewHistory: string;
    viewed: string;
    noHistory: string;
    noHistoryDescription: string;
    typeNews: string;
    typeNote: string;
    typeConcept: string;
    filterAll: string;
    filterView: string;
  };
  settings: {
    title: string;
    subtitle: string;
    theme: {
      title: string;
      description: string;
      light: string;
      dark: string;
      system: string;
      current: string;
    };
    language: {
      title: string;
      description: string;
      korean: string;
      english: string;
    };
    notifications: {
      title: string;
      description: string;
      email: string;
      emailDesc: string;
      push: string;
      pushDesc: string;
      news: string;
      newsDesc: string;
    };
    account: {
      title: string;
      profile: string;
      profileDesc: string;
      password: string;
      passwordDesc: string;
    };
    privacy: {
      title: string;
      export: string;
      exportDesc: string;
      delete: string;
      deleteDesc: string;
    };
  };
  chat: {
    consent: {
      title: string;
      description: string;
      enable: string;
      skip: string;
    };
    suggested: string;
    placeholder: string;
    send: string;
    inputPlaceholder: string;
    error: {
      sendFailed: string;
    };
    newConversation: string;
    newConversationSuccess: string;
    newConversationFailed: string;
    deleteConversation: string;
    deleteConfirm: string;
    deleteSuccess: string;
    deleteFailed: string;
    like: string;
    dislike: string;
    regenerate: string;
    feedbackLiked: string;
    feedbackDisliked: string;
    feedbackFailed: string;
    messageRegenerated: string;
    regenerateFailed: string;
    consentEnabled: string;
    consentDisabled: string;
    consentFailed: string;
    noConversations: string;
    startNewConversation: string;
    untitled: string;
    noMessages: string;
    consentTitle: string;
    consentDesc: string;
    enableConsent: string;
    startConversation: string;
    startConversationDesc: string;
    messageLoading: string;
    messagePlaceholder: string;
    sendPrompt: string;
    copyCode: string;
    copiedToClipboard: string;
    title: string;
    minimize: string;
    maximize: string;
    close: string;
    conversationActive: string;
    noConversation: string;
    welcomeTitle: string;
    welcomeDesc: string;
    creating: string;
    startNew: string;
    createFailed: string;
    resumeConversation: string;
    clickStartNewToBegin: string;
    };
  search: {
    stockSearchPlaceholder: string;
    searching: string;
    searchError: string;
    noSearchResults: string;
    recentSearches: string;
    historyDeleted: string;
    title: string;
    placeholder: string;
    placeholderFocused: string;
    popularSearch: string;
    popularSearchTime: string;
    popularStocksToChoose: string;
    seeMore: string;
    close: string;
    searchResults: string;
    stockGroups: {
      undervalued: string;
      undervaluedDesc: string;
      dividend: string;
      dividendDesc: string;
      dualBuy: string;
      dualBuyDesc: string;
    };
  };
  ai: {
    summary: string;
    analysis: string;
    analyzing: string;
    selectStock: string;
    collapse: string;
    expand: string;
    keyIssues: string;
    priceInterpretation: string;
    learnMore: string;
  };
  hotIssue: {
    title: string;
    subtitle: string;
    popularStocks: string;
    popularNews: string;
  };
  theme: {
    lightMode: string;
    darkMode: string;
  };
  aria: {
    edit: string;
    delete: string;
    close: string;
    clearSearch: string;
    sortOrder: string;
    removeFavorite: string;
    closeModal: string;
  };
  market: {
    kospi: string;
    kosdaq: string;
    usdkrw: string;
    nasdaq: string;
    sp500: string;
    vix: string;
    status: {
      regularMarket: string;
      afterMarket: string;
      overseasDayMarket: string;
      marketClosed: string;
    };
  };
}

const translationsData: Record<Language, Translations> = {
  ko: {
    common: {
      loading: '로딩 중...',
      error: '오류가 발생했습니다',
      save: '저장',
      cancel: '취소',
      delete: '삭제',
      edit: '편집',
      close: '닫기',
      search: '검색',
      submit: '전송',
      confirm: '확인',
      yes: '예',
      no: '아니오',
      back: '뒤로',
      next: '다음',
      previous: '이전',
      refresh: '새로고침',
      retry: '다시 시도',
      noData: '데이터가 없습니다',
      noResults: '결과가 없습니다',
      count: '개',
      cases: '건',
      results: '결과',
      tryDifferentSearch: '다른 검색어를 시도해보세요',
      selectDifferentCategory: '다른 카테고리를 선택하세요',
      clear: '검색어 지우기',
      loadFailed: '종목을 불러오는데 실패했습니다',
      unknown: '알 수 없음',
      errorOccurred: '예상치 못한 오류가 발생했습니다',
      unexpectedError: '알 수 없는 오류가 발생했습니다.',
      searching: '검색 중...',
      searchFailed: '검색 중 오류가 발생했습니다',
      clearSearch: '검색어 지우기',
      sending: '전송 중...',
      adding: '추가 중...',
      updating: '수정 중...',
      total: '총',
      unit: '주',
      copy: '복사',
      copied: '복사됨',
      viewAll: '전체보기',
    },
    nav: {
      dashboard: '대시보드',
      news: '뉴스 & 피드',
      education: '교육',
      explore: '탐색',
      portfolio: '포트폴리오',
      favorites: '즐겨찾기',
      history: '기록',
      hotIssue: '핫이슈',
      settings: '설정',
    },
    dashboard: {
      title: '대시보드',
      selectStock: '종목을 선택하세요',
      selectStockDescription: '좌측 목록에서 종목을 선택하면\n차트와 뉴스가 표시됩니다.',
      stockList: '종목 목록',
      stockDetail: '종목 상세',
      portfolioValue: '포트폴리오 총 가치',
      totalReturn: '총 수익률',
      holdings: '보유 종목 수',
      recentActivity: '최근 활동',
      noRecentActivity: '최근 활동이 없습니다',
      searchPlaceholder: '종목명 또는 코드 검색',
      aiSummaryOnelineSummary: '실적 개선 기대감에 상승',
      aiSummaryKeyIssue1: '이슈 1: 4분기 실적 전망 상향 조정',
      aiSummaryKeyIssue2: '이슈 2: 거래량 평균 대비 150% 증가',
      aiSummaryPriceAnalysis: '외국인과 기관이 동시에 매수하며 상승 탄력을 받았습니다.',
      aiSummaryRiskSummary: '단기 급등 후 조정 가능성에 주의하세요.',
      aiSummaryLearningCta: '실적 발표가 주가에 미치는 영향',
      categories: {
        popular: '인기',
        battery: '2차전지',
        it: 'IT/반도체',
        bio: '바이오',
        finance: '금융',
        auto: '자동차',
        media: '엔터/미디어',
        rising: '상승',
        falling: '하락',
        volume: '거래량',
      },
    },
    stock: {
      title: '종목',
      price: '현재가',
      change: '등락',
      changePercent: '등락률',
      volume: '거래량',
      market: '시장',
      sector: '섹터',
      per: 'PER',
      pbr: 'PBR',
      rising: '상승',
      falling: '하락',
      addToPortfolio: '포트폴리오에 추가',
      addToFavorites: '즐겨찾기 추가',
      removeFromFavorites: '즐겨찾기 제거',
      inPortfolio: '포트폴리오에 포함됨',
      chartLoading: '차트 로딩 중...',
      noChartData: '차트 데이터가 없습니다',
      oneMonth: '1개월',
      threeMonths: '3개월',
      sixMonths: '6개월',
      oneYear: '1년',
      priceChart: '가격 차트',
      relatedNews: '관련 뉴스',
      newsLoadError: '뉴스를 불러오는 중 오류가 발생했습니다.',
      newsLoading: '뉴스를 불러오는 중...',
      high: '고가',
      low: '저가',
      marketCap: '시가총액',
      companyOverview: '기업 개요',
      notFound: '종목을 찾을 수 없습니다',
      notFoundDesc: '요청한 종목이 존재하지 않습니다.',
      loading: '종목 정보를 불러오는 중...',
    },
    news: {
      title: '뉴스',
      titleAndFeed: '뉴스 & 피드',
      subtitle: '최신 금융 뉴스와 AI 분석을 확인하세요',
      loading: '뉴스를 불러오는 중...',
      read: '읽음',
      like: '좋아요',
      unlike: '좋아요 취소',
      favorite: '즐겨찾기',
      share: '공유',
      source: '출처',
      publishedAt: '발행일',
      relatedNews: '관련 뉴스',
      noNews: '뉴스가 없습니다',
      filterAll: '전체',
      filterPositive: '긍정',
      filterNegative: '부정',
      filterNeutral: '중립',
      searchPlaceholder: '뉴스 제목 또는 내용 검색...',
      aiSummary: 'AI 요약',
      aiAnalysis: 'AI 분석',
      keyIssues: '핵심 이슈',
      relatedConcepts: '관련 개념',
      relatedStocks: '관련 종목',
      notFound: '뉴스를 찾을 수 없습니다',
      notFoundDesc: '요청한 뉴스가 존재하지 않습니다.',
      noContent: '콘텐츠가 없습니다',
      quiet: '아직은 조용합니다~',
      noRelatedNews: '{stockName} 관련 뉴스가 없습니다',
      notesCount: '이 뉴스에 대한 {count}개의 노트',
      dragToCreateNote: '텍스트를 드래그하여 노트를 만드세요',
      noNotesYet: '아직 노트가 없습니다',
      dragToCreateNoteDesc: '뉴스 텍스트를 드래그하여 첫 노트를 만들어보세요',
      noTitle: '제목 없음',
      topStocks: '내 종목',
      myStocks: '관심 종목',
    },
    education: {
      today: '오늘의 학습',
      dashboard: '학습 대시보드',
      qa: 'Q&A',
      notes: '노트',
      myNotes: '내 노트',
      scrapNews: '뉴스 스크랩',
      noteCreated: '노트가 생성되었습니다',
      questionHistory: '질문 기록',
      questionPlaceholder: '궁금한 것을 물어보세요... (예: PER이 뭔가요?)',
      questionSubmit: '전송',
      questionGenerating: '생성 중...',
      question: {
        history: '질문 기록',
        input: '질문을 입력하세요',
        inputDescription: '궁금한 투자 개념이나 용어에 대해 질문해보세요',
        placeholder: '질문을 입력하세요',
        generating: '생성 중...',
        sample: {
          per: 'PER이 뭔가요?',
          dividend: '배당금은 어떻게 받나요?',
          rsi: 'RSI 지표는 무엇인가요?',
        },
      },
      difficulty: {
        beginner: '초급',
        intermediate: '중급',
        advanced: '고급',
      },
      saveNote: '노트에 저장',
      viewStocks: '관련 종목 보기',
      noNotes: '작성된 노트가 없습니다',
      noNotesDescription: '새 노트를 작성하여 투자 아이디어를 기록해보세요',
      createNote: '새 노트 작성',
      createNoteFromNews: '노트로 저장',
      noteWithNews: '뉴스와 함께 노트 작성',
      selectNews: '뉴스 선택',
      noNewsSelected: '뉴스가 선택되지 않았습니다',
      createNoteFromNewsDesc: '뉴스를 선택하면 오른쪽에서 노트를 작성할 수 있습니다',
      editNote: '노트 편집',
      noteTitle: '제목',
      noteContent: '내용',
      noteTags: '태그',
      noteTagsPlaceholder: '태그 (쉼표로 구분)',
      notePlaceholder: '노트 제목을 입력하세요',
      noteContentPlaceholder: '노트 내용을 입력하세요',
      tagPlaceholder: '태그를 입력하고 Enter를 누르세요',
      deleteNoteConfirm: '정말 이 노트를 삭제하시겠습니까?',
      errorOccurred: '오류가 발생했습니다',
      related: '관련',
      learnMore: '에 대해 학습해보세요',
      aiHelp: '질문을 입력하면 AI가 답변을 생성합니다. 대화를 통해 개념을 더 깊이 이해할 수 있습니다.',
      noRecommendations: '추천할 학습 내용이 없습니다.',
    },
    explore: {
      strategyExploration: '전략 탐색',
      strategySelection: '전략 선택',
      selectStrategy: '전략을 선택하세요',
      selectStrategyDescription: '위에서 전략을 선택하면 상세 정보가 표시됩니다',
      strategy: {
        dividend: '배당주 전략',
        dividendDescription: '배당률 3% 이상, 5년 연속 배당',
        growth: '성장주 전략',
        growthDescription: '매출 성장률 20% 이상',
        value: '가치주 전략',
        valueDescription: 'PER 10 이하, PBR 1 이하',
        momentum: '모멘텀 전략',
        momentumDescription: '최근 1개월 등락률 상위',
        ai: 'AI 추천',
        aiDescription: '포트폴리오 기반 맞춤 추천',
      },
      strategyDescription: '전략 설명',
      recommendedStocks: '추천 종목',
      stockName: '종목명',
      currentPrice: '현재가',
      changeRate: '등락률',
      per: 'PER',
      stocksCount: '개 종목',
    },
    portfolio: {
      title: '포트폴리오',
      subtitle: '보유 종목과 수익률을 확인하세요',
      totalValue: '총 가치',
      totalReturn: '총 수익률',
      holdings: '보유 종목',
      addStock: '종목 추가',
      added: '포트폴리오에 추가되었습니다',
      editStock: '종목 편집',
      removeStock: '종목 제거',
      quantity: '수량',
      averagePrice: '평균 단가',
      currentPrice: '현재가',
      profit: '손익',
      profitRate: '수익률',
      noPortfolio: '포트폴리오가 없습니다',
      noPortfolioDescription: '종목을 추가하여 포트폴리오를 구성해보세요',
      selectStock: '종목 선택',
      selectStockPlaceholder: '종목명 또는 종목코드 검색...',
      selectStockError: '종목을 선택해주세요.',
      quantityError: '보유 수량을 올바르게 입력해주세요.',
      priceError: '평균 매수가를 올바르게 입력해주세요.',
      alreadyAdded: '이미 추가된 종목입니다. 수정 기능을 사용해주세요.',
      addFailed: '포트폴리오 추가에 실패했습니다.',
      updateSuccess: '포트폴리오가 수정되었습니다.',
      updateFailed: '포트폴리오 수정에 실패했습니다.',
      enterQuantity: '보유 수량을 입력하세요',
      enterPrice: '평균 매수가를 입력하세요',
      expectedValue: '예상 평가금액',
      currentValue: '현재 평가금액',
      totalPurchase: '총 매수금액',
      expectedProfit: '예상 손익',
      sortBy: '정렬',
      addStockTitle: '포트폴리오 추가',
      editStockTitle: '포트폴리오 수정',
      stockName: '종목명',
      shares: '주',
      totalShares: '총',
      action: '작업',
      weight: '비중',
      sectorAllocation: '업종 비중',
      riskAnalysis: 'AI 리스크 분석',
      analyzing: '분석 중...',
      removeConfirm: '정말 이 종목을 포트폴리오에서 제거하시겠습니까?',
      purchaseAmount: '매입금액',
      evaluation: '평가금액',
      sortByValue: '평가금액',
      sortByProfit: '수익금액',
      sortByReturn: '수익률',
    },
    favorites: {
      title: '즐겨찾기',
      myFavorites: '내 즐겨찾기',
      addFavorite: '즐겨찾기 추가',
      removeFavorite: '즐겨찾기 제거',
      added: '즐겨찾기에 추가되었습니다',
      removed: '즐겨찾기에서 제거되었습니다',
      noFavorites: '즐겨찾기가 없습니다',
      noFavoritesDescription: '관심 종목을 즐겨찾기에 추가해보세요',
      removeFailed: '즐겨찾기 제거에 실패했습니다.',
      changeFailed: '즐겨찾기 변경에 실패했습니다.',
      removeConfirm: '"{{name}}"을(를) 즐겨찾기에서 제거하시겠습니까?',
      subtitle: '관심 종목을 모아서 관리하세요',
      emptyTitle: '즐겨찾기가 없습니다',
      emptyDescription: '관심 종목을 즐겨찾기에 추가하면 여기에 표시됩니다',
      removeLabel: '즐겨찾기 제거',
      volume: '거래량',
    },
    history: {
      title: '기록',
      subtitle: '최근 조회한 종목과 활동 내역을 확인하세요',
      loading: '기록을 불러오는 중...',
      viewHistory: '조회 기록',
      viewed: '조회',
      noHistory: '기록이 없습니다',
      noHistoryDescription: '종목을 조회하면 기록이 표시됩니다',
      typeNews: '뉴스',
      typeNote: '노트',
      typeConcept: '개념',
      filterAll: '전체',
      filterView: '조회',
    },
    settings: {
      title: '설정',
      subtitle: '앱 설정을 관리하세요',
      theme: {
        title: '테마 설정',
        description: '앱의 색상 테마를 선택하세요',
        light: '라이트 모드',
        dark: '다크 모드',
        system: '시스템 설정',
        current: '현재 테마',
      },
      language: {
        title: '언어 설정',
        description: '앱의 표시 언어를 선택하세요',
        korean: '한국어',
        english: '영어',
      },
      notifications: {
        title: '알림 설정',
        description: '받을 알림을 선택하세요',
        email: '이메일 알림',
        emailDesc: '중요한 업데이트를 이메일로 받습니다',
        push: '푸시 알림',
        pushDesc: '실시간 알림을 받습니다',
        news: '뉴스 알림',
        newsDesc: '관심 종목의 뉴스를 받습니다',
      },
      account: {
        title: '계정 설정',
        profile: '프로필 편집',
        profileDesc: '프로필 정보를 수정합니다',
        password: '비밀번호 변경',
        passwordDesc: '계정 보안을 위해 비밀번호를 변경합니다',
      },
      privacy: {
        title: '개인정보 보호',
        export: '데이터 내보내기',
        exportDesc: '모든 데이터를 다운로드합니다',
        delete: '계정 삭제',
        deleteDesc: '모든 데이터가 영구적으로 삭제됩니다',
      },
    },
    chat: {
      consent: {
        title: '개인 정보 연결',
        description: '읽은 뉴스, 학습 이력, 노트 정보를 연결하여 더 정확한 답변을 받을 수 있습니다',
        enable: '연결하기',
        skip: '건너뛰기',
      },
      suggested: '추천 질문',
      placeholder: '메시지를 입력하세요...',
      send: '전송',
      inputPlaceholder: '질문을 입력하세요...',
      error: {
        sendFailed: '메시지 전송에 실패했습니다',
      },
      newConversation: '새 대화',
      newConversationSuccess: '새 대화가 시작되었습니다.',
      newConversationFailed: '대화 생성에 실패했습니다.',
      deleteConversation: '대화 삭제',
      deleteConfirm: '정말 이 대화를 삭제하시겠습니까?',
      deleteSuccess: '대화가 삭제되었습니다.',
      deleteFailed: '대화 삭제에 실패했습니다.',
      like: '좋아요',
      dislike: '싫어요',
      regenerate: '재생성',
      feedbackLiked: '좋아요를 눌렀습니다.',
      feedbackDisliked: '싫어요를 눌렀습니다.',
      feedbackFailed: '피드백 전송에 실패했습니다.',
      messageRegenerated: '메시지가 재생성되었습니다.',
      regenerateFailed: '메시지 재생성에 실패했습니다.',
      consentEnabled: '개인 정보 연결이 활성화되었습니다.',
      consentDisabled: '개인 정보 연결이 비활성화되었습니다.',
      consentFailed: '연결 설정 변경에 실패했습니다.',
      noConversations: '대화가 없습니다',
      startNewConversation: '새 대화를 시작해보세요',
      untitled: '제목 없음',
      noMessages: '메시지가 없습니다',
      consentTitle: '정보 연결을 활성화하시겠습니까?',
      consentDesc: '읽은 뉴스, 학습 내용, 노트 정보를 활용해 더 정확한 답변을 제공합니다.',
      enableConsent: '연결하기',
      startConversation: '대화를 시작하세요',
      startConversationDesc: 'AI 투자 도우미에게 질문을 입력하면 도움을 받을 수 있습니다.',
      messageLoading: '메시지를 불러오는 중...',
      messagePlaceholder: '투자에 대해 질문해보세요...',
      sendPrompt: 'Enter로 전송, Shift+Enter로 줄바꿈',
      copyCode: '코드 복사',
      copiedToClipboard: '클립보드에 복사되었습니다.',
      title: 'AI 투자 도우미',
      minimize: '최소화',
      maximize: '최대화',
      close: '닫기',
      conversationActive: '대화 중',
      noConversation: '대화가 없습니다',
      welcomeTitle: 'AI 투자 도우미',
      welcomeDesc: '대화를 선택하거나 새 대화를 시작하여 투자에 대해 질문해보세요.',
      creating: '생성 중...',
      startNew: '새 대화 시작',
      createFailed: '대화 생성에 실패했습니다.',
      resumeConversation: '대화 계속하기',
      clickStartNewToBegin: '새 대화 시작 버튼을 눌러 대화를 시작하세요',
    },
    search: {
      stockSearchPlaceholder: '종목명 또는 종목코드 검색...',
      searching: '검색 중...',
      searchError: '검색 중 오류가 발생했습니다',
      noSearchResults: '검색 결과가 없습니다',
      recentSearches: '최근 검색',
      historyDeleted: '검색 기록이 삭제되었습니다',
      title: '검색',
      placeholder: '검색어를 입력해주세요',
      placeholderFocused: '종목명, 코드로 검색',
      popularSearch: '인기 검색',
      popularSearchTime: '오늘 {time} 기준',
      popularStocksToChoose: '인기있는 주식 골라보기',
      seeMore: '더 보기',
      close: '닫기',
      searchResults: '{query} 검색 결과',
      stockGroups: {
        undervalued: '아직 저렴한 가치주',
        undervaluedDesc: '회사의 순자산 대비 저평가된 주식',
        dividend: '꾸준한 배당주',
        dividendDesc: '배당을 꾸준히 주는 주식',
        dualBuy: '쌍끌이 매수',
        dualBuyDesc: '기관과 외국인이 동시에 사들이는 주식',
      },
    },
    ai: {
      summary: 'AI 요약',
      analysis: 'AI 분석',
      analyzing: 'AI가 분석 중입니다...',
      selectStock: '종목을 선택하면 AI 요약이 표시됩니다.',
      collapse: 'AI 패널 접기',
      expand: 'AI 패널 펼치기',
      keyIssues: '주요 이슈',
      priceInterpretation: '가격 해석',
      learnMore: '에 대해 더 알아보기',
    },
    hotIssue: {
      title: '핫 이슈',
      subtitle: '지금 가장 주목받는 종목과 뉴스를 확인하세요',
      popularStocks: '인기 종목',
      popularNews: '인기 뉴스',
    },
    theme: {
      lightMode: '라이트 모드',
      darkMode: '다크 모드',
    },
    aria: {
      edit: '수정',
      delete: '삭제',
      close: '닫기',
      clearSearch: '검색어 지우기',
      sortOrder: '정렬 순서 변경',
      removeFavorite: '즐겨찾기 제거',
      closeModal: '모달 닫기',
    },
    market: {
      kospi: '코스피',
      kosdaq: '코스닥',
      usdkrw: 'USD/KRW',
      nasdaq: '나스닥',
      sp500: 'S&P 500',
      vix: 'VIX',
      status: {
        regularMarket: '국내 정규장',
        afterMarket: '국내 애프터마켓',
        overseasDayMarket: '해외 데이마켓',
        marketClosed: '장 마감',
      },
    },
  },
  en: {
    common: {
      loading: 'Loading...',
      error: 'An error occurred',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      close: 'Close',
      search: 'Search',
      submit: 'Submit',
      confirm: 'Confirm',
      yes: 'Yes',
      no: 'No',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      refresh: 'Refresh',
      retry: 'Retry',
      noData: 'No data available',
      noResults: 'No results found',
      count: '',
      cases: '',
      results: 'results',
      tryDifferentSearch: 'Try a different search term',
      selectDifferentCategory: 'Select a different category',
      clear: 'Clear search',
      loadFailed: 'Failed to load stocks',
      unknown: 'Unknown',
      errorOccurred: 'An unexpected error occurred',
      unexpectedError: 'An unknown error occurred.',
      searching: 'Searching...',
      searchFailed: 'An error occurred while searching',
      clearSearch: 'Clear search',
      sending: 'Sending...',
      adding: 'Adding...',
      updating: 'Updating...',
      total: 'Total',
      unit: ' shares',
      copy: 'Copy',
      copied: 'Copied',
      viewAll: 'View All',
    },
    nav: {
      dashboard: 'Dashboard',
      news: 'News & Feed',
      education: 'Education',
      explore: 'Explore',
      portfolio: 'Portfolio',
      favorites: 'Favorites',
      history: 'History',
      hotIssue: 'Hot Issue',
      settings: 'Settings',
    },
    dashboard: {
      title: 'Dashboard',
      selectStock: 'Select a stock',
      selectStockDescription: 'Select a stock from the list on the left\nto view charts and news.',
      stockList: 'Stock List',
      stockDetail: 'Stock Detail',
      portfolioValue: 'Portfolio Value',
      totalReturn: 'Total Return',
      holdings: 'Holdings',
      recentActivity: 'Recent Activity',
      noRecentActivity: 'No recent activity',
      searchPlaceholder: 'Search by name or code',
      aiSummaryOnelineSummary: 'Rising on earnings improvement expectations',
      aiSummaryKeyIssue1: 'Issue 1: Q4 earnings outlook revised upward',
      aiSummaryKeyIssue2: 'Issue 2: Trading volume increased 150% compared to average',
      aiSummaryPriceAnalysis: 'Foreign and institutional investors bought simultaneously, gaining upward momentum.',
      aiSummaryRiskSummary: 'Caution needed for possible adjustment after short-term surge.',
      aiSummaryLearningCta: 'Impact of earnings announcements on stock prices',
      categories: {
        popular: 'Popular',
        battery: 'Battery',
        it: 'IT/Semiconductor',
        bio: 'Bio',
        finance: 'Finance',
        auto: 'Automotive',
        media: 'Entertainment/Media',
        rising: 'Rising',
        falling: 'Falling',
        volume: 'Volume',
      },
    },
    stock: {
      title: 'Stocks',
      price: 'Price',
      change: 'Change',
      changePercent: 'Change %',
      volume: 'Volume',
      market: 'Market',
      sector: 'Sector',
      per: 'PER',
      pbr: 'PBR',
      rising: 'Rising',
      falling: 'Falling',
      addToPortfolio: 'Add to Portfolio',
      addToFavorites: 'Add to Favorites',
      removeFromFavorites: 'Remove from Favorites',
      inPortfolio: 'In Portfolio',
      chartLoading: 'Loading chart...',
      noChartData: 'No chart data available',
      oneMonth: '1M',
      threeMonths: '3M',
      sixMonths: '6M',
      oneYear: '1Y',
      priceChart: 'Price Chart',
      relatedNews: 'Related News',
      newsLoadError: 'An error occurred while loading news.',
      newsLoading: 'Loading news...',
      high: 'High',
      low: 'Low',
      marketCap: 'Market Cap',
      companyOverview: 'Company Overview',
      notFound: 'Stock not found',
      notFoundDesc: 'The requested stock does not exist.',
      loading: 'Loading stock information...',
    },
    news: {
      title: 'News',
      titleAndFeed: 'News & Feed',
      subtitle: 'Check the latest financial news and AI analysis',
      loading: 'Loading news...',
      read: 'Read',
      like: 'Like',
      unlike: 'Unlike',
      favorite: 'Favorite',
      share: 'Share',
      source: 'Source',
      publishedAt: 'Published',
      relatedNews: 'Related News',
      noNews: 'No news available',
      filterAll: 'All',
      filterPositive: 'Positive',
      filterNegative: 'Negative',
      filterNeutral: 'Neutral',
      searchPlaceholder: 'Search news title or content...',
      aiSummary: 'AI Summary',
      aiAnalysis: 'AI Analysis',
      keyIssues: 'Key Issues',
      relatedConcepts: 'Related Concepts',
      relatedStocks: 'Related Stocks',
      notFound: 'News not found',
      notFoundDesc: 'The requested news does not exist.',
      noContent: 'No content available',
      quiet: 'It\'s quiet here~',
      noRelatedNews: 'No news related to {stockName}',
      notesCount: '{count} notes for this news',
      dragToCreateNote: 'Drag text to create a note',
      noNotesYet: 'No notes yet',
      dragToCreateNoteDesc: 'Drag news text to create your first note',
      noTitle: 'No title',
    },
    education: {
      today: "Today's Learning",
      dashboard: 'Learning Dashboard',
      qa: 'Q&A',
      notes: 'Notes',
      myNotes: 'My Notes',
      scrapNews: 'Scrap News',
      noteCreated: 'Note created successfully',
      questionHistory: 'Question History',
      questionPlaceholder: 'Ask anything... (e.g., What is PER?)',
      questionSubmit: 'Send',
      questionGenerating: 'Generating...',
      question: {
        history: 'Question History',
        input: 'Enter your question',
        inputDescription: 'Ask questions about investment concepts or terms',
        placeholder: 'Enter your question',
        generating: 'Generating...',
        sample: {
          per: 'What is PER?',
          dividend: 'How do I receive dividends?',
          rsi: 'What is the RSI indicator?',
        },
      },
      difficulty: {
        beginner: 'Beginner',
        intermediate: 'Intermediate',
        advanced: 'Advanced',
      },
      saveNote: 'Save to Notes',
      viewStocks: 'View Related Stocks',
      noNotes: 'No notes written yet',
      noNotesDescription: 'Write a new note to record your investment ideas',
      createNote: 'Create New Note',
      createNoteFromNews: 'Save to Note',
      noteWithNews: 'Create Note with News',
      selectNews: 'Select News',
      noNewsSelected: 'No news selected',
      createNoteFromNewsDesc: 'Select a news article to create a note on the right',
      editNote: 'Edit Note',
      noteTitle: 'Title',
      noteContent: 'Content',
      noteTags: 'Tags',
      noteTagsPlaceholder: 'Tags (comma separated)',
      notePlaceholder: 'Enter note title',
      noteContentPlaceholder: 'Enter note content',
      tagPlaceholder: 'Enter tags and press Enter',
      deleteNoteConfirm: 'Are you sure you want to delete this note?',
      errorOccurred: 'An error occurred',
      related: 'Related',
      learnMore: ' to learn more about',
      aiHelp: 'Enter a question and AI will generate an answer. Deepen your understanding through conversation.',
      noRecommendations: 'No learning recommendations available.',
    },
    explore: {
      strategyExploration: 'Strategy Exploration',
      strategySelection: 'Select Strategy',
      selectStrategy: 'Select a strategy',
      selectStrategyDescription: 'Select a strategy above to view details',
      strategy: {
        dividend: 'Dividend Strategy',
        dividendDescription: 'Dividend yield 3%+, 5 consecutive years',
        growth: 'Growth Strategy',
        growthDescription: 'Revenue growth 20%+',
        value: 'Value Strategy',
        valueDescription: 'PER ≤ 10, PBR ≤ 1',
        momentum: 'Momentum Strategy',
        momentumDescription: 'Top performers in last month',
        ai: 'AI Recommendation',
        aiDescription: 'Portfolio-based personalized recommendation',
      },
      strategyDescription: 'Strategy Description',
      recommendedStocks: 'Recommended Stocks',
      stockName: 'Stock Name',
      currentPrice: 'Current Price',
      changeRate: 'Change Rate',
      per: 'PER',
      stocksCount: ' stocks',
    },
    portfolio: {
      title: 'Portfolio',
      subtitle: 'Check your holdings and returns',
      totalValue: 'Total Value',
      totalReturn: 'Total Return',
      holdings: 'Holdings',
      addStock: 'Add Stock',
      added: 'Added to portfolio',
      editStock: 'Edit Stock',
      removeStock: 'Remove Stock',
      quantity: 'Quantity',
      averagePrice: 'Average Price',
      currentPrice: 'Current Price',
      profit: 'Profit/Loss',
      profitRate: 'Return Rate',
      noPortfolio: 'No portfolio yet',
      noPortfolioDescription: 'Add stocks to build your portfolio',
      selectStock: 'Select Stock',
      selectStockPlaceholder: 'Search by name or code...',
      selectStockError: 'Please select a stock.',
      quantityError: 'Please enter a valid quantity.',
      priceError: 'Please enter a valid average price.',
      alreadyAdded: 'This stock is already in your portfolio. Please use edit function.',
      addFailed: 'Failed to add to portfolio.',
      updateSuccess: 'Portfolio updated successfully.',
      updateFailed: 'Failed to update portfolio.',
      enterQuantity: 'Enter quantity',
      enterPrice: 'Enter average price',
      expectedValue: 'Expected Value',
      currentValue: 'Current Value',
      totalPurchase: 'Total Purchase Amount',
      expectedProfit: 'Expected Profit/Loss',
      sortBy: 'Sort By',
      addStockTitle: 'Add to Portfolio',
      editStockTitle: 'Edit Portfolio',
      stockName: 'Stock Name',
      shares: ' shares',
      totalShares: 'Total',
      action: 'Action',
      weight: 'Weight',
      sectorAllocation: 'Sector Allocation',
      riskAnalysis: 'AI Risk Analysis',
      analyzing: 'Analyzing...',
      removeConfirm: 'Are you sure you want to remove this stock from your portfolio?',
      purchaseAmount: 'Purchase Amount',
      evaluation: 'Valuation',
      sortByValue: 'Value',
      sortByProfit: 'Profit',
      sortByReturn: 'Return',
    },
    favorites: {
      title: 'Favorites',
      myFavorites: 'My Favorites',
      addFavorite: 'Add to Favorites',
      removeFavorite: 'Remove from Favorites',
      added: 'Added to favorites',
      removed: 'Removed from favorites',
      noFavorites: 'No favorites yet',
      noFavoritesDescription: 'Add stocks to your favorites',
      removeFailed: 'Failed to remove from favorites.',
      changeFailed: 'Failed to change favorites.',
      removeConfirm: 'Are you sure you want to remove "{{name}}" from your favorites?',
      subtitle: 'Manage your favorite stocks',
      emptyTitle: 'No favorites',
      emptyDescription: 'Add stocks to your favorites to see them here',
      removeLabel: 'Remove from favorites',
      volume: 'Volume',
    },
    history: {
      title: 'History',
      subtitle: 'View your recently viewed stocks and activity history',
      loading: 'Loading history...',
      viewHistory: 'View History',
      viewed: 'Viewed',
      noHistory: 'No history yet',
      noHistoryDescription: 'Your viewing history will appear here',
      typeNews: 'News',
      typeNote: 'Note',
      typeConcept: 'Concept',
      filterAll: 'All',
      filterView: 'Viewed',
    },
    settings: {
      title: 'Settings',
      subtitle: 'Manage your app settings',
      theme: {
        title: 'Theme',
        description: 'Choose your app color theme',
        light: 'Light Mode',
        dark: 'Dark Mode',
        system: 'System',
        current: 'Current Theme',
      },
      language: {
        title: 'Language',
        description: 'Choose your display language',
        korean: 'Korean',
        english: 'English',
      },
      notifications: {
        title: 'Notifications',
        description: 'Choose which notifications to receive',
        email: 'Email Notifications',
        emailDesc: 'Receive important updates via email',
        push: 'Push Notifications',
        pushDesc: 'Receive real-time notifications',
        news: 'News Notifications',
        newsDesc: 'Receive news about your favorite stocks',
      },
      account: {
        title: 'Account',
        profile: 'Edit Profile',
        profileDesc: 'Modify your profile information',
        password: 'Change Password',
        passwordDesc: 'Change your password for account security',
      },
      privacy: {
        title: 'Privacy',
        export: 'Export Data',
        exportDesc: 'Download all your data',
        delete: 'Delete Account',
        deleteDesc: 'All data will be permanently deleted',
      },
    },
    chat: {
      consent: {
        title: 'Connect Personal Information',
        description: 'Connect your read news, learning history, and notes to receive more accurate responses',
        enable: 'Connect',
        skip: 'Skip',
      },
      suggested: 'Suggested Questions',
      placeholder: 'Type a message...',
      send: 'Send',
      inputPlaceholder: 'Ask a question...',
      error: {
        sendFailed: 'Failed to send message',
      },
      newConversation: 'New Conversation',
      newConversationSuccess: 'New conversation started.',
      newConversationFailed: 'Failed to create conversation.',
      deleteConversation: 'Delete Conversation',
      deleteConfirm: 'Are you sure you want to delete this conversation?',
      deleteSuccess: 'Conversation deleted.',
      deleteFailed: 'Failed to delete conversation.',
      like: 'Like',
      dislike: 'Dislike',
      regenerate: 'Regenerate',
      feedbackLiked: 'Liked the message.',
      feedbackDisliked: 'Disliked the message.',
      feedbackFailed: 'Failed to send feedback.',
      messageRegenerated: 'Message regenerated.',
      regenerateFailed: 'Failed to regenerate message.',
      consentEnabled: 'Personal information connection enabled.',
      consentDisabled: 'Personal information connection disabled.',
      consentFailed: 'Failed to update connection settings.',
      noConversations: 'No conversations yet',
      startNewConversation: 'Start a new conversation',
      untitled: 'Untitled',
      noMessages: 'No messages',
      consentTitle: 'Enable information connection?',
      consentDesc: 'Leverage your read news, learning content, and notes for more accurate answers.',
      enableConsent: 'Connect',
      startConversation: 'Start a conversation',
      startConversationDesc: 'Ask the AI investment assistant a question to get help.',
      messageLoading: 'Loading messages...',
      messagePlaceholder: 'Ask about investing...',
      sendPrompt: 'Press Enter to send, Shift+Enter for new line',
      copyCode: 'Copy Code',
      copiedToClipboard: 'Copied to clipboard.',
      title: 'AI Investment Assistant',
      minimize: 'Minimize',
      maximize: 'Maximize',
      close: 'Close',
      conversationActive: 'Active conversation',
      noConversation: 'No conversation',
      welcomeTitle: 'AI Investment Assistant',
      welcomeDesc: 'Select a conversation or start a new one to ask about investing.',
      creating: 'Creating...',
      startNew: 'Start New Conversation',
      createFailed: 'Failed to create conversation.',
      resumeConversation: 'Resume Conversation',
      clickStartNewToBegin: 'Click "Start New" to begin a conversation',
    },
    search: {
      stockSearchPlaceholder: 'Search by name or code...',
      searching: 'Searching...',
      searchError: 'An error occurred while searching',
      noSearchResults: 'No search results',
      recentSearches: 'Recent Searches',
      historyDeleted: 'Search history deleted',
      title: 'Search',
      placeholder: 'Enter search term',
      placeholderFocused: 'Search by name or code',
      popularSearch: 'Popular Search',
      popularSearchTime: 'As of {time} today',
      popularStocksToChoose: 'Popular Stocks to Choose From',
      seeMore: 'See More',
      close: 'Close',
      searchResults: 'Search results for "{query}"',
      stockGroups: {
        undervalued: 'Still Undervalued Stocks',
        undervaluedDesc: 'Stocks undervalued compared to company net assets',
        dividend: 'Consistent Dividend Stocks',
        dividendDesc: 'Stocks that consistently pay dividends',
        dualBuy: 'Dual Buy',
        dualBuyDesc: 'Stocks simultaneously bought by institutions and foreigners',
      },
    },
    ai: {
      summary: 'AI Summary',
      analysis: 'AI Analysis',
      analyzing: 'AI is analyzing...',
      selectStock: 'AI summary will appear when you select a stock.',
      collapse: 'Collapse AI panel',
      expand: 'Expand AI panel',
      keyIssues: 'Key Issues',
      priceInterpretation: 'Price Interpretation',
      learnMore: ' to learn more about',
    },
    hotIssue: {
      title: 'Hot Issues',
      subtitle: 'Check the most notable stocks and news right now',
      popularStocks: 'Popular Stocks',
      popularNews: 'Popular News',
    },
    theme: {
      lightMode: 'Light Mode',
      darkMode: 'Dark Mode',
    },
    aria: {
      edit: 'Edit',
      delete: 'Delete',
      close: 'Close',
      clearSearch: 'Clear search',
      sortOrder: 'Change sort order',
      removeFavorite: 'Remove from favorites',
      closeModal: 'Close modal',
    },
    market: {
      kospi: 'KOSPI',
      kosdaq: 'KOSDAQ',
      usdkrw: 'USD/KRW',
      nasdaq: 'NASDAQ',
      sp500: 'S&P 500',
      vix: 'VIX',
      status: {
        regularMarket: 'Domestic Regular Market',
        afterMarket: 'Domestic Aftermarket',
        overseasDayMarket: 'Overseas Day Market',
        marketClosed: 'Market Closed',
      },
    },
  },
};

// Explicit export for Turbopack compatibility
export const translations: Record<Language, Translations> = translationsData;

