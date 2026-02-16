import { NextResponse, NextRequest } from 'next/server';
import { AllfetchNews } from '@/lib/api';

export async function GET(request: NextRequest) {

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') ||  "1");
    const pageSize = parseInt(searchParams.get('pageSize') ||  "30");
  
    const result = await AllfetchNews("", {
      pageSize,
      page,
    });
    
    if ("error" in result) {
      return NextResponse.json(result, { status: 500 });
    }

    return NextResponse.json({
      articles: result.articles,
      pagination: {
        page,
        pageSize,
        totalResults: result.totalResults,
        totalPages: Math.ceil(result.totalResults / pageSize)
      }
    });
  } catch (error) {
    console.error('All news fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch all news' },
      { status: 500 }
    );
  }
}