"use client";

import Link from "next/link";
import { useData } from "@/lib/DataContext";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle , CardFooter} from "@/components/ui/card";
import type { NewsData } from '@/lib/types';
import { formatNewsDate } from '@/lib/dateUtils';
import PaginationControls from "@/components/paginationControls";
import { Loader } from "@/components/Loader";

const ITEMS_PER_PAGE = 10;

export default function NewsPage() {
  const { newsData, newsPagination, refreshNews, newsMode, setNewsMode, isLoading } = useData(); 
  const [isTimedOut, setIsTimedOut] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (newsData === null) { 
        setIsTimedOut(true);
      }
    }, 15000);

    return () => clearTimeout(timeoutId);
  }, [newsData]);

  const handleRetry = () => {
    setIsTimedOut(false);
    refreshNews(newsMode, currentPage, ITEMS_PER_PAGE);
  };
  
  const handleModeChange = (newMode: 'headlines' | 'all') => {
    if (newMode !== newsMode) {
      setNewsMode(newMode);
      setCurrentPage(1);
      refreshNews(newMode, 1, ITEMS_PER_PAGE);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    refreshNews(newsMode, page, ITEMS_PER_PAGE);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="parent mt-[40px] mb-[40px]">
      <Card className="border-none rounded-none shadow-none">
        
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary-color mb-[20px]">
            Latest News
          </CardTitle>
          {/* Mode Toggle Buttons */}
          <div className="pb-[10px] border-b border-b-primary-color">
            {/* Buttons container with relative positioning */}
            <div className="relative flex justify-center gap-4">
              <button
                onClick={() => handleModeChange('headlines')}
                disabled={isLoading}
                className={`px-4 py-[5px] rounded-[20px] transition-colors ${
                  newsMode === 'headlines'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Headlines
              </button>
              <button
                onClick={() => handleModeChange('all')}
                disabled={isLoading}
                className={`px-4 py-[5px] rounded-[20px] transition-colors ${
                  newsMode === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                All News
              </button>

              {/* Desktop: Absolute positioned to right */}
              {newsPagination && (
                <div className="hidden md:block absolute bottom-0 right-0 text-sm text-gray-600">
                  ({newsPagination.totalResults} total articles)
                </div>
              )}
            </div>

            {/* Mobile: Separate line below buttons */}
            {newsPagination && (
              <div className="md:hidden mt-2 text-sm text-gray-600">
                ({newsPagination.totalResults} total articles)
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          { isLoading ? (
            <Loader className="mt-10"  />
          ): newsData === null && !isTimedOut ? (
            <div className="py-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading news...</p>
            </div>
          ) : isTimedOut ? (
            <div className="py-8 text-center">
              <div className="text-red-500 text-4xl mb-4">⏰</div>
              <p className="text-red-600 mb-4">News loading is taking too long.</p>
              <p className="text-gray-600 mb-4">This might be due to API limits or network issues.</p>
              <button
                onClick={handleRetry}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Try Again
              </button>
            </div>
          ) : newsData && "error" in newsData ? (
            <div className="py-8 text-center text-red-600">
              <p>Error loading news: {newsData.error}</p>
              <button
                onClick={handleRetry}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mt-4"
              >
                Try Again
              </button>
            </div>
          ) : newsData && Array.isArray(newsData) && newsData.length === 0 ? (
            <div className="py-8 text-center text-gray-600">
              <p>No news articles available at the moment.</p>
            </div>
          ): newsData && Array.isArray(newsData) && newsData.length > 0 ? (
            <>
            {newsData.map((news: NewsData) => (
             
              <div key={news.id} className="p-4 transition-shadow border rounded-lg hover:shadow-md">
                  <div className="flex flex-col items-center gap-4 md:flex-row">
                      {/* News Image */}
                      {news.imageUrl && (
                          <div className="w-full overflow-hidden rounded-lg h-[170px] md:w-[300px]">
                              <img
                                  src={news.imageUrl || "/favicon/pulsecast.png"}
                                  alt={news.title}
                                  className="object-cover w-full h-full"
                                  onError={(e) => {
                                    e.currentTarget.src = "/favicon/pulsecast.png";
                                  }}
                              />
                          </div>
                      )}
                  
                      {/* News Content */}
                      <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2 text-sm text-gray-500">
                              {news.country && (
                                  <>
                                      <span className="px-2 py-1 text-red-600 rounded"> {news.country.toUpperCase()} </span>
                                      <span>•</span>
                                  </>
                              )}
                              <span className="font-medium">{news.source}</span>
                              {news.publishedAt && (
                                  <>
                                  <span>•</span>
                                  <span>{formatNewsDate(news.publishedAt)}</span>
                                  </>
                              )}
                          </div>
                          
                          <h3 className="mb-1 font-semibold text-gray-900 transition-colors text-[16.5px] hover:text-primary-color-light">
                              <Link href={`/news/${news.id}`}>{news.title}</Link>
                          </h3>
                      
                          <p className="mb-2 text-gray-700 line-clamp-2">{news.description}</p>
                          
                          {/* Read More Link */}
                          <Link href={`/news/${news.id}`} className="inline-block font-medium text-blue-600 hover:underline">Read Full Story →</Link>
                      </div>
                  </div>
              </div>
            ))}
            </>
          ): (
            <div className="py-8 text-center text-gray-600">
              <p>Unexpected state occurred.</p>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-end">
          {!isLoading && newsPagination && newsPagination.totalPages > 1 && (
            <PaginationControls
              currentPage={currentPage}
              totalPages={newsPagination.totalPages}
              isLoading={isLoading}
              onPageChange={handlePageChange}
            />
          )}
        </CardFooter>
      </Card>
    </div>
  );
}