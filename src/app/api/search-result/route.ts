import { NextRequest, NextResponse } from "next/server";
import { searchNews } from "@/lib/api";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const searchQuery = searchParams.get("query");
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "10");


  try {
    if (!searchQuery) {
      return NextResponse.json({ error: "Please enter a search query" }, { status: 400 });
    }

    const searchResults = await searchNews(searchQuery, { pageSize });

    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedResults = Array.isArray(searchResults) ? searchResults.slice(startIndex, endIndex) : [];

    return NextResponse.json({
      articles: paginatedResults,
      pagination: {
        page,
        pageSize,
        totalResults: Array.isArray(searchResults) ? searchResults.length : 0,
        totalPages: Math.ceil(Array.isArray(searchResults) ? searchResults.length : 0 / pageSize)
      }
    });

  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ error: "Server error while fetching news" }, { status: 500 });
  }
}