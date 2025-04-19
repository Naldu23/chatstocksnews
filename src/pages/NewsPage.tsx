
import { useState } from 'react';
import Header from '@/components/layout/Header';
import NewsAggregator from '@/components/news/NewsAggregator';
import { N8nService } from '@/services/n8nService';

const NewsPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  // Create wrapper functions that'll capture the selected date for featured articles
  const fetchNews = (date: Date | undefined) => {
    return N8nService.fetchEnglishNews(date);
  };
  
  const fetchFeatured = (date: Date | undefined) => {
    return N8nService.fetchEnglishFeaturedArticles(date);
  };
  
  return (
    <div className="flex h-screen flex-col">
      <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      
      <div className="flex-1 overflow-auto pb-24">
        <main className="h-full max-w-[1600px] mx-auto">
          <NewsAggregator 
            key={refreshTrigger}
            isKorean={false}
            fetchNews={fetchNews}
            fetchFeatured={fetchFeatured}
          />
        </main>
      </div>
    </div>
  );
};

export default NewsPage;
