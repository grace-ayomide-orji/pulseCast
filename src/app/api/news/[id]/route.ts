import { NextResponse } from 'next/server';
import { TopHeadlistfetchNews, AllfetchNews } from '@/lib/api';
import type { NewsData } from '@/lib/types';

export async function GET(
  { params }: { params: Promise<{ id: string }>}
) {
  try {
    const { id } = await params;

    let article = null;
    
    const topHeadlines = await TopHeadlistfetchNews();  
    if (!('error' in topHeadlines)) {
      article = topHeadlines.articles.find((item: NewsData) => item.id === id);
    }
    
    if (!article) {
      const allNews = await AllfetchNews('', { pageSize: 100 }); // Increased size for better coverage
      if (!('error' in allNews)) {
        article = allNews.articles.find((item: NewsData) => item.id === id);
      }
    }
    
    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' }, 
        { status: 404 }
      );
    }
  
    return NextResponse.json(article);  
  } catch (error) {
    console.error('Article fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}