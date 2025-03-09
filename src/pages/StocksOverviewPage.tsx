
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/layout/Header';
import { MarketOverview } from '@/components/stocks/MarketOverview';
import N8nService from '@/services/n8nService';

const StocksOverviewPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  useEffect(() => {
    const connectToN8n = async () => {
      try {
        const userAgent = navigator.userAgent;
        const response = await N8nService.sendStocksOverviewVisit(userAgent);
        
        if (response.success) {
          console.log('Successfully connected to n8n webhook:', response.data);
        } else {
          console.error('Failed to connect to n8n webhook:', response.error);
        }
      } catch (error) {
        console.error('Error connecting to n8n webhook:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    connectToN8n();
  }, []);
  
  return (
    <div className="flex h-screen flex-col">
      <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      
      <div className="flex-1 overflow-hidden">
        <main className="h-full p-4 md:p-6 max-w-7xl mx-auto">
          <MarketOverview />
        </main>
      </div>
    </div>
  );
};

export default StocksOverviewPage;
