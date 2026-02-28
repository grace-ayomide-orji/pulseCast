import { generateIdFromUrl } from "./hashUtils";
import type { WeatherData, NewsData, NewsApiResponse, NewsApiArticle } from "./types";

// weather api service

export async function fetchWeather(city: string): Promise<WeatherData | { error: string }> {
  if (!process.env.OPENWEATHER_API_KEY) {
    return { error: "API configuration error. Please contact support." };
  }
  try {
    const weatherRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`,
      { cache: "no-store" }
    );
    if (!weatherRes.ok) {
      const errData = await weatherRes.json();
      return { error: errData.message || "Weather API failed. Check city name or API key." };
    }

    const forecastRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`,
      { cache: "no-store" }
    );
    if (!forecastRes.ok) {
      const errData = await forecastRes.json();
      return { error: errData.message || "Forecast API failed. Check city name or API key." };
    }

    const weatherData = await weatherRes.json();
    const forecastData = await forecastRes.json();
    const forecast = [];
    const uniqueDays = new Set();

    for (let i = 0; i < forecastData.list.length && forecast.length < 7; i++) {
      const item = forecastData.list[i];
      const date = new Date(item.dt * 1000);
      const day = date.toLocaleDateString("en-US", { weekday: "short" });
  
    if (!uniqueDays.has(day)) {
      forecast.push({
        date: day,
        temp: Math.round(item.main.temp),
        condition: item.weather[0]?.main || "Unknown",
      });
      uniqueDays.add(day);
    }
  }

  return {
    city: weatherData.name,
    temp: Math.round(weatherData.main.temp),
    condition: weatherData.weather[0]?.main || "Unknown",
    alert: weatherData.alerts?.[0]?.description || "No alerts available",
    timezone: weatherData.timezone,
    forecast,
  };
  } catch (error) {
    console.error("Fetch Weather API Error:", error);
    return { error: "Network error or API unavailable. Please try again later." };
  }
}

export async function fetchWeatherByCoords(lat: number, lon: number): Promise<WeatherData | { error: string }> {
  try {
    const weatherRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`,
      { cache: "no-store" }
    );
    if (!weatherRes.ok) {
      const errData = await weatherRes.json();
      return { error: errData.message || "Weather API failed. Check coordinates or API key." };
    }

    const forecastRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`,
      { cache: "no-store" }
    );
    if (!forecastRes.ok) {
      const errData = await forecastRes.json();
      return { error: errData.message || "Forecast API failed. Check coordinates or API key." };
    }

    const weatherData = await weatherRes.json();
    const forecastData = await forecastRes.json();
    const forecast = [];
    const uniqueDays = new Set();

    for (let i = 0; i < forecastData.list.length && forecast.length < 7; i++) {
      const item = forecastData.list[i];
      const date = new Date(item.dt * 1000);
      const day = date.toLocaleDateString("en-US", { weekday: "short" });
  
    if (!uniqueDays.has(day)) {
      forecast.push({
        date: day,
        temp: Math.round(item.main.temp),
        condition: item.weather[0]?.main || "Unknown",
      });
      uniqueDays.add(day);
    }
  }

  return {
    city: weatherData.name,
    temp: Math.round(weatherData.main.temp),
    condition: weatherData.weather[0]?.main || "Unknown",
    alert: weatherData.alerts?.[0]?.description || "No alerts available",
    timezone: weatherData.timezone,
    forecast, // Could be 3, 5, or 7 days - all real data
  };
  } catch (error) {
    console.error("Weather fetch error:", error);
    return { error: "Network error or API unavailable. Please try again later." };
  }
}

export async function fetchCityByIP(): Promise<string | null> {
  try {
    const res = await fetch("https://ipapi.co/json/", { cache: "no-store" });
    if (!res.ok) throw new Error("IP API failed");
    const data = await res.json();
    return data.city || null;
  } catch (error) {
    console.error("Fetch City bu Ip API Error:", error);
    return null;
  }
}

// news api service

export async function TopHeadlistfetchNews(source: string = "", page: number = 1, pageSize: number = 10): Promise<{ articles: NewsData[]; totalResults: number } | { error: string }> {
  const sources = source.trim() !== "" ? source : 'bbc-news,cnn,reuters,associated-press,the-verge';
  const PROBLEMATIC_DOMAINS = ['politico.com', 'news-journalonline.com', 'trueachievements.com', 'yourtango.com'];
  
  try {
    const url = `https://newsapi.org/v2/top-headlines?sources=${sources}&page=${page}&pageSize=${pageSize}&apiKey=${process.env.NEWSAPI_KEY}`;
    const res = await fetch(url, { next: { revalidate: 300 } }); // Cache for 5 minutes
    
    if (!res.ok) {
      const errData = await res.json();
      return { error: errData.message || `News API failed with status ${res.status}` };
    }
    
    const data: NewsApiResponse = await res.json();
    const articles = data.articles
      .filter((article: NewsApiArticle) => article.title && article.description && article.url && article.content && article.url && article.source.name)
      .map((article: NewsApiArticle) => {
        // Nullify images from problematic domains to avoid 403/406 errors
        let imageUrl = article.urlToImage;
        if (imageUrl && PROBLEMATIC_DOMAINS.some(domain => imageUrl?.includes(domain))) {
          imageUrl = null;
        }
        
        return {
          id: generateIdFromUrl(article.url),
          title: article.title,
          description: article.description,
          content: article.content,
          url: article.url,
          source: article.source.name,
          sourceId: article.source.id, 
          imageUrl: imageUrl,
          publishedAt: article.publishedAt
        };
      });
      
    return articles.length > 0 ? {
      articles : articles,
      totalResults: data.totalResults,
    } : { error: "No news articles available." };
  } catch (error) {
    console.error("TopHeadlistfetchNews API Error:", error);
    return { error: "Network error or API unavailable. Please try again later." };
  }
}

export async function AllfetchNews(
  keyword: string = "",
  options: {
    language?: string;
    sortBy?: string;
    pageSize?: number;
    page?: number;
    country?: string;
  } = {}
): Promise<{ articles: NewsData[]; totalResults: number } | { error: string }> {
  const PROBLEMATIC_DOMAINS = ['politico.com', 'news-journalonline.com', 'trueachievements.com', 'yourtango.com'];
  
  try {
    const { language = "en", sortBy = "publishedAt", pageSize = 20, page = 1, country = "" } = options;
    let url: string;
    const baseParams = `language=${language}&pageSize=${pageSize}&page=${page}&apiKey=${process.env.NEWSAPI_KEY}`;
    const countryParam = country ? `&country=${country}` : '';
    
    if (keyword.trim() !== "") {
      url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(keyword)}&sortBy=${sortBy}&${baseParams}${countryParam}`;
    } else {
      url = `https://newsapi.org/v2/top-headlines?${baseParams}${countryParam}`;
    }

    const res = await fetch(url, { next: { revalidate: 300 } }); // Cache for 5 minutes
    if (!res.ok) {
      const errData = await res.json();
      return { error: errData.message || `News API failed with status ${res.status}` };
    }

    const data: NewsApiResponse = await res.json(); 
    const articles = data.articles
      .filter((article: NewsApiArticle) => article.title && article.description && article.url && article.content && article.url && article.source.name)
      .map((article: NewsApiArticle) => {
        // Nullify images from problematic domains to avoid 403/406 errors
        let imageUrl = article.urlToImage;
        if (imageUrl && PROBLEMATIC_DOMAINS.some(domain => imageUrl?.includes(domain))) {
          imageUrl = null;
        }
        
        return {
          id: generateIdFromUrl(article.url),
          title: article.title,
          description: article.description,
          content: article.content,
          url: article.url,
          source: article.source.name,
          sourceId: article.source.id, 
          imageUrl: imageUrl,
          publishedAt: article.publishedAt
        };
      });  
    return articles.length > 0 ? {
      articles: articles,
      totalResults: data.totalResults,
    } : { error: "No news articles available." };
  } catch (error) {
    console.error("All New API Error:", error);
    return { error: "Network error or API unavailable. Please try again later." };
  }
}

export async function searchNews(
  keyword: string,
  options: {
    language?: string;
    sortBy?: string;
    pageSize?: number;
    country?: string;
  } = {}
): Promise<NewsData[] | { error: string }> {
  const PROBLEMATIC_DOMAINS = ['politico.com', 'news-journalonline.com', 'trueachievements.com', 'yourtango.com'];
  
  try {
    const { language = "en", sortBy = "publishedAt", pageSize = 20, country = "" } = options;
    
    if (!process.env.NEWSAPI_KEY) {
      return { error: "API key not configured" };
    }

    const baseParams = `language=${language}&pageSize=${pageSize}&apiKey=${process.env.NEWSAPI_KEY}`;
    const countryParam = country ? `&country=${country}` : '';
    
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(keyword)}&sortBy=${sortBy}&${baseParams}${countryParam}`;
    
    const res = await fetch(url, { cache: "no-store" });
    
    if (!res.ok) {
      const errData = await res.json();
      return { error: errData.message || `News API failed with status ${res.status}` };
    }
    
    const data = await res.json();
    
    const articles = data.articles
      .filter((article: NewsApiArticle) => article.title && article.description && article.url && article.source.name)
      .map((article: NewsApiArticle) => {
        // Nullify images from problematic domains to avoid 403/406 errors
        let imageUrl = article.urlToImage;
        if (imageUrl && PROBLEMATIC_DOMAINS.some(domain => imageUrl?.includes(domain))) {
          imageUrl = null;
        }
        
        return {
          id: generateIdFromUrl(article.url),
          title: article.title,
          description: article.description,
          content: article.content,
          url: article.url,
          source: article.source.name,
          sourceId: article.source.id, 
          imageUrl: imageUrl,
          publishedAt: article.publishedAt
        };
      });
    
    return articles.length >= 1 ? articles : { error: "No articles found" };
    
  } catch (error) {
    console.error("Search API News Error:", error);
    return { error: "Network error or API unavailable" };
  }
}