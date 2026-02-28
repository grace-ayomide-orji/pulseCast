"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useData } from "@/lib/DataContext";
import type { NewsData } from '@/lib/types';
import { formatNewsDate } from '@/lib/dateUtils';
import PaginationControls from "@/components/paginationControls";
import { Loader } from "@/components/Loader";
import SafeNewsImage from "@/components/SafeNewsImage";

const ITEMS_PER_PAGE = 10;

export default function SearchPage() {
  const router = useRouter();
  const { updateSearch, searchData, isLoading, searchPagination } = useData();
  const [query, setQuery] = useState("");
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);

  // Load search history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem("searchHistory");
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Handle URL query parameters on page load
  useEffect(() => {
    const urlQuery = searchParams.get('q');
    const urlPage = parseInt(searchParams.get('page') || '1');
    
    if (urlQuery && (urlQuery !== query || urlPage !== currentPage)) {
      setQuery(urlQuery);
      setCurrentPage(urlPage);
      updateSearch(urlQuery, urlPage, ITEMS_PER_PAGE);
      
      // Inline the save logic
      const filteredHistory = searchHistory.filter(item => item !== urlQuery);
      const newHistory = [urlQuery, ...filteredHistory].slice(0, 5);
      setSearchHistory(newHistory);
      localStorage.setItem("searchHistory", JSON.stringify(newHistory));
    }
  }, [searchParams, query, currentPage, updateSearch, searchHistory]);

  const handleHistoryClick = (historyQuery: string) => {
    setQuery(historyQuery);
    setCurrentPage(1);
    router.push(`/search?q=${encodeURIComponent(historyQuery)}&page=1`);
    updateSearch(historyQuery, 1, ITEMS_PER_PAGE);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    router.push(`/search?q=${encodeURIComponent(query)}&page=${page}`);
    updateSearch(query, page, ITEMS_PER_PAGE);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="parent mt-[40px] mb-[40px]">
      <Card className="border-none rounded-none shadow-none">
        <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold text-primary-color">
          {(searchPagination?.totalResults ?? "") && `${searchPagination?.totalResults} `}
          Search Results
          {query && ` for "${query}"`}
        </CardTitle>
        </CardHeader>

        <CardContent>
          {/* Search History */}
          {searchHistory.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Recent Searches</h3>
              <div className="flex flex-wrap gap-2">
                {searchHistory.map((historyItem, index) => (
                  <button
                    key={index}
                    onClick={() => handleHistoryClick(historyItem)}
                    className="px-3 py-1 text-sm bg-gray-100 rounded-full hover:bg-gray-200"
                    disabled={isLoading}
                  >
                    {historyItem}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search Results */}
          {isLoading ? (
            <Loader className="mt-10" />
          ) : searchData === null ? (
            <div className="text-center text-gray-500 py-8">
              <p>Enter a search term in the navbar to find news articles</p>
            </div>
          ) : "error" in searchData ? (
            <div className="text-center text-red-600 py-8">
              <p>Error: {searchData.error}</p>
              <button
                onClick={() => updateSearch(query)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mt-4"
                disabled={isLoading}
              >
                Try Again
              </button>
            </div>
          ) : searchData.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <p>{`No results found for "${query}"`}</p>
              </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                {`${searchData.length} result${searchData.length !== 1 ? 's' : ''} found for "${query}"`}
                
              </h3>
              {searchData.map((news: NewsData) => (
                <div key={news.id} className="p-4 transition-shadow border rounded-lg hover:shadow-md">
                    <div className="flex flex-col items-center gap-4 md:flex-row">
                        {/* News Image */}
                        {news.imageUrl && (
                            <div className="w-full overflow-hidden rounded-lg h-[170px] md:w-[300px]">
                                <SafeNewsImage
                                    src={news.imageUrl}
                                    alt={news.title}
                                    width={300}
                                    height={170}
                                    className="object-cover w-full h-full"
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
                                <Link href={`/news/${news.id}?fromSearch=true&q=${encodeURIComponent(query)}`}>{news.title}</Link>
                            </h3>
                        
                            <p className="mb-2 text-gray-700 line-clamp-2">{news.description}</p>
                            
                            {/* Read More Link */}
                            <Link href={`/news/${news.id}?fromSearch=true&q=${encodeURIComponent(query)}`} 
                            className="inline-block font-medium text-blue-600 hover:underline">Read Full Story →</Link>
                        </div>
                    </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-end">
          {searchPagination && searchPagination.totalPages > 1 && (
            <PaginationControls
              currentPage={currentPage}
              totalPages={searchPagination.totalPages}
              isLoading={isLoading}
              onPageChange={handlePageChange}
            />
          )}
        </CardFooter>
      </Card>
    </div>
  );
}