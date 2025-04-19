
import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import NewsAggregator from '@/components/news/NewsAggregator';
import { N8nService } from '@/services/n8nService';

const NewsPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  // Fetch featured articles when page loads
  useEffect(() => {
    const sendPageVisit = async () => {
      try {
        console.log('News page loaded - sending featured articles request');
        await N8nService.fetchFeaturedArticles();
      } catch (error) {
        console.error('Error sending page visit webhook:', error);
      }
    };
    
    sendPageVisit();
    
    // Add event listener for page refresh via F5 or browser refresh button
    const handleBeforeUnload = () => {
      setRefreshTrigger(prev => prev + 1);
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
  
  return (
    <div className="flex h-screen flex-col">
      <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      
      <div className="flex-1 overflow-auto">
        <main className="h-full max-w-[1600px] mx-auto">
          <NewsAggregator key={refreshTrigger} />
        </main>
      </div>
    </div>
  );
};

export default NewsPage;
