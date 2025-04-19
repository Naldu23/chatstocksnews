
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
    <div className="flex flex-col min-h-screen">
      <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      
      <div className="flex-1">
        <main className="max-w-[1600px] mx-auto pb-8">
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
