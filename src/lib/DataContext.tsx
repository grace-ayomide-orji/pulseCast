"use client";

import { createContext, useContext, ReactNode, useState, useCallback } from "react";
import type { WeatherData, NewsData, PaginationInfo } from "./types";

interface DataContextType {
  weatherData: WeatherData | { error: string } | null;
  newsData: NewsData[] | { error: string } | null;
  newsPagination: PaginationInfo | null;
  searchData: NewsData[] | { error: string } | null;
  searchPagination: PaginationInfo | null;
  isLoading: boolean;
  newsMode: 'headlines' | 'all';
  setNewsMode: (mode: 'headlines' | 'all') => void;
  refreshNews: (mode?: 'headlines' | 'all', page?: number, pageSize?: number) => Promise<void>; 
  updateSearch: (query: string, page?: number, pageSize?: number) => Promise<NewsData[] | { error: string }>;
  updateWeather: (city: string) => Promise<WeatherData | { error: string }>;
  updateWeatherByCoords: (lat: number, lon: number) => Promise<WeatherData | { error: string }>;   
}

export const DataContext = createContext<DataContextType | undefined>(undefined);

interface DataProviderProps {
  children: ReactNode;
  initialWeatherData: WeatherData | { error: string } | null;
  initialNewsData: NewsData[] | { error: string } | null;
  initialSearchData?: NewsData[] | { error: string } | null;
}

// Helper function for fetch with timeout
const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeout = 50000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

export function DataProvider({
  children,
  initialWeatherData,
  initialNewsData,
  initialSearchData = null,
}: DataProviderProps) {
  const [weatherData, setWeatherData] = useState<WeatherData | { error: string } | null>(initialWeatherData);
  const [newsData, setNewsData] = useState<NewsData[] | { error: string } | null>(initialNewsData);
  const [searchPagination, setSearchPagination] = useState<PaginationInfo | null>(null);
  const [newsPagination, setNewsPagination] = useState<PaginationInfo | null>(null);
  const [searchData, setSearchData] = useState<NewsData[] | { error: string } | null>(initialSearchData);
  const [isLoading, setIsLoading] = useState(false);
  const [newsMode, setNewsMode] = useState<'headlines' | 'all'>('headlines');
  
  const updateWeather = useCallback(async (city: string) => {
    setIsLoading(true);
    try {
      const res = await fetchWithTimeout(`/api/weather?city=${encodeURIComponent(city)}`, {}, 10000);
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Server weather fetch failed: ${res.status} ${errorText}`);
      }
      const newWeather = await res.json();
      setWeatherData(newWeather);
      return newWeather;
    } catch (error) {
      const isAbortError = error instanceof Error && error.name === 'AbortError';
      const errorMessage = isAbortError 
        ? 'Weather request timed out. Please try again.' 
        : error instanceof Error ? error.message : 'Failed to fetch weather data';
      
      const errorObj = { error: errorMessage };
      setWeatherData(errorObj);
      return errorObj;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateWeatherByCoords = useCallback(async (lat: number, lon: number) => {
    setIsLoading(true);
    try {
      const res = await fetchWithTimeout(`/api/weather?lat=${lat}&lon=${lon}`, {}, 10000);
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Server weather fetch failed: ${res.status} ${errorText}`);
      }
      const newWeather = await res.json();
      setWeatherData(newWeather);
      return newWeather;
    } catch (error) {
      const isAbortError = error instanceof Error && error.name === 'AbortError';
      const errorMessage = isAbortError 
        ? 'Weather request timed out. Please try again.' 
        : error instanceof Error ? error.message : 'Failed to fetch weather data';
      
      const errorObj = { error: errorMessage };
      setWeatherData(errorObj);
      return errorObj;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateSearch = useCallback(async (query: string, page: number = 1, pageSize: number = 10) => {
    if (!query.trim()) {
      setSearchData(null);
      return [];
    }
    
    setIsLoading(true);
    try {
      const res = await fetchWithTimeout(`/api/search-result?query=${encodeURIComponent(query)}&page=${page}&pageSize=${pageSize}`, {}, 10000);
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Search failed: ${res.status} ${errorText}`);
      }
      const response = await res.json();
      if ("error" in response) {
        setSearchData(response);
        setSearchPagination(null);
      } else {
        setSearchData(response.articles);
        setSearchPagination(response.pagination);
      }
      
      return response.articles || response;
    } catch (error) {
      const isAbortError = error instanceof Error && error.name === 'AbortError';
      const errorMessage = isAbortError 
        ? 'Search request timed out. Please try again.' 
        : error instanceof Error ? error.message : 'Failed to fetch search results';
      
      const errorObj = { error: errorMessage };
      setSearchData(errorObj);
      setSearchPagination(null);
      return errorObj;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshNews = useCallback(async (mode?: 'headlines' | 'all', page: number = 1, pageSize: number = 10) => {
    const currentMode = mode || newsMode;
    setIsLoading(true);
    try {

      const endpoint = currentMode === 'headlines' 
      ? `/api/news/headlines?page=${page}&pageSize=${pageSize}` 
      : `/api/news/all?page=${page}&pageSize=${pageSize}`;

      const res = await fetchWithTimeout(endpoint, {}, 10000);
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`News API failed: ${res.status} ${errorText}`);
      }

      const response = await res.json();
      
      if ("error" in response) {
        setNewsData(response);
      } else {
        setNewsData(response.articles);
        setNewsPagination(response.pagination);
      }
    } catch (error) {
      const isAbortError = error instanceof Error && error.name === 'AbortError';
      const errorMessage = isAbortError 
        ? 'News refresh timed out. Using cached data.' 
        : 'Failed to refresh news. Using cached data if available.';
      
      setNewsData({ error: errorMessage });
      setNewsPagination(null);
    } finally {
      setIsLoading(false);
    }
  }, [newsMode]);

  return (
    <DataContext.Provider value={{ 
      weatherData, 
      newsData, 
      newsPagination,
      searchData,
      searchPagination,
      isLoading,
      newsMode,
      setNewsMode,
      updateWeather, 
      updateWeatherByCoords, 
      updateSearch,
      refreshNews
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData must be used within a DataProvider");
  return context;
}