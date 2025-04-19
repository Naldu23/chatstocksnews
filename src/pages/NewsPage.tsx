
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
  
  return (
    <div className="flex min-h-screen flex-col">
      <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      
      <div className="flex-1">
        <main className="max-w-[1600px] mx-auto">
          <NewsAggregator 
            key={refreshTrigger}
            isKorean={false}
            fetchNews={N8nService.fetchEnglishNews}
            fetchFeatured={N8nService.fetchEnglishFeaturedArticles}
          />
        </main>
      </div>

      <footer className="w-full border-t bg-card/30 backdrop-blur-sm mt-8">
        <div className="max-w-[1600px] mx-auto py-6 px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 BioKing News. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="/news" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                English News
              </a>
              <a href="/korean-news" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Korean News
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default NewsPage;
