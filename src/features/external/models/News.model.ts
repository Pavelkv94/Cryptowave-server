type NewsArticleModel = {
  source: {
    id: null;
    name: string;
  };
  author: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  content: string;
  title: string;
};

export type NewsViewModel = {
  articles: NewsArticleModel[];
  status: string;
  totalResults: number;
};
