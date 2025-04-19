
import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import NewsAggregator from '@/components/news/NewsAggregator';
import { N8nService } from '@/services/n8nService';

const KoreanNewsPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  return (
    <div className="flex h-screen flex-col">
      <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      
      <div className="flex-1 overflow-auto">
        <main className="h-full max-w-[1600px] mx-auto">
          <NewsAggregator 
            isKorean={true}
            fetchNews={N8nService.fetchKoreanNews}
            fetchFeatured={N8nService.fetchKoreanFeaturedArticles}
          />
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default KoreanNewsPage;
