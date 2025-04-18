
import { useState } from 'react';
import Header from '@/components/layout/Header';
import NewsAggregator from '@/components/news/NewsAggregator';

const NewsPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  return (
    <div className="flex h-screen flex-col">
      <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      
      <div className="flex-1 overflow-auto">
        <main className="h-full">
          <NewsAggregator />
        </main>
      </div>
    </div>
  );
};

export default NewsPage;
