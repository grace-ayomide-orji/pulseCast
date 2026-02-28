export interface NewsApiArticle {
  title: string;
  description: string;
  url: string;
  content: string;
  source: { name: string; id: string | null };
  urlToImage: string | null;
  publishedAt: string;
}

export interface WeatherData {
  city: string;
  temp: number;
  condition: string;
  alert?: string;
  timezone: number; 
  forecast?: { date: string; temp: number; condition: string }[];
}

export interface NewsData {
  id: string;
  title: string;
  description: string;
  content: string; 
  url: string;
  source: string;
  sourceId: string | null;
  publishedAt?: string;
  imageUrl?: string | null;
  country?: string;
}

export interface NewsApiResponse {
  status: string;
  totalResults: number;
  articles: NewsApiArticle[];
}

export interface PaginationInfo {
  page: number;
  pageSize: number;
  totalResults: number;
  totalPages: number;
}
