
import { useState, useEffect, useCallback } from 'react';
import { startOfDay, endOfDay, parseISO } from 'date-fns';
import { N8nService } from '@/services/n8nService';
import { useToast } from "@/hooks/use-toast";
import { NewsArticle } from './types';
import { dummyNewsArticles } from './dummyData';
import ArticleCard from './ArticleCard';
import DateFilter from './DateFilter';
import SearchBar from './SearchBar';
import NoArticlesFound from './NoArticlesFound';
import GradeFilter from './GradeFilter';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function NewsAggregator() {
  const { toast } = useToast();
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>(dummyNewsArticles);
  const [filteredArticles, setFilteredArticles] = useState<NewsArticle[]>(dummyNewsArticles);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isErrorState, setIsErrorState] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  
  // Create a stable version of sendDateToWebhook to avoid recreating it on every render
  const sendDateToWebhook = useCallback(async (date: Date) => {
    try {
      console.log(`Sending date to webhook (Local): ${date.toLocaleDateString()}`);
      console.log(`Sending date to webhook (ISO): ${date.toISOString()}`);
      
      const response = await N8nService.sendDateFilter(date);
      
      if (!response.success) {
        console.warn('Failed to send date to webhook:', response.error);
        toast({
          title: "Warning",
          description: "Date selection was updated but we couldn't fetch new articles.",
          variant: "destructive",
        });
      } else {
        console.log('Successfully sent date to webhook:', response);
        toast({
          title: "Success",
          description: "Date selection was updated and new articles fetched.",
        });
      }
      
      return response;
    } catch (error) {
      console.error('Error sending date to webhook:', error);
      toast({
        title: "Warning",
        description: "Date selection was updated but the webhook notification failed.",
        variant: "destructive",
      });
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }, [toast]);
  
  const fetchNewsData = useCallback(async () => {
    setIsLoading(true);
    setIsErrorState(false);
    
    try {
      console.log('Loading news data...');
      // Always load the dummy data first to ensure we have something to display
      setNewsArticles(dummyNewsArticles);
      
      // Send the current selected date to the webhook when refreshing
      if (selectedDate) {
        const webhookResponse = await sendDateToWebhook(selectedDate);
        console.log('Webhook response received:', webhookResponse);
        
        // If the webhook was successful and returned articles, use those instead
        if (webhookResponse.success && 
            webhookResponse.data && 
            Array.isArray(webhookResponse.data) && 
            webhookResponse.data.length > 0 && 
            webhookResponse.data[0].articles && 
            Array.isArray(webhookResponse.data[0].articles) && 
            webhookResponse.data[0].articles.length > 0) {
          
          // Validate the articles received to ensure they match our expected format
          const validatedArticles = webhookResponse.data[0].articles.map((article: any) => {
            return {
              id: article.id || `news-${Math.random().toString(36).substring(2, 9)}`,
              title: article.title || 'Untitled Article',
              summary: article.summary || '',
              source: article.source || 'Unknown Source',
              publishedAt: article.publishedAt || new Date().toISOString(),
              url: article.url || '#',
              imageUrl: article.imageUrl,
              readTime: article.readTime || 5,
              content: article.content,
              grade: article.grade
            } as NewsArticle;
          });
          
          setNewsArticles(validatedArticles);
          console.log('Successfully loaded articles from webhook:', validatedArticles);
        } else if (webhookResponse.success && 
                  webhookResponse.data && 
                  webhookResponse.data.articles && 
                  Array.isArray(webhookResponse.data.articles) && 
                  webhookResponse.data.articles.length > 0) {
          
          // Direct articles array format
          const validatedArticles = webhookResponse.data.articles.map((article: any) => {
            return {
              id: article.id || `news-${Math.random().toString(36).substring(2, 9)}`,
              title: article.title || 'Untitled Article',
              summary: article.summary || '',
              source: article.source || 'Unknown Source',
              publishedAt: article.publishedAt || new Date().toISOString(),
              url: article.url || '#',
              imageUrl: article.imageUrl,
              readTime: article.readTime || 5,
              content: article.content,
              grade: article.grade
            } as NewsArticle;
          });
          
          setNewsArticles(validatedArticles);
          console.log('Successfully loaded articles directly from webhook:', validatedArticles);
        } else {
          console.warn('Webhook response was successful but no valid articles found, using dummy data:', webhookResponse);
          toast({
            title: "Notice",
            description: "Could not retrieve articles from the server. Using sample data instead.",
            variant: "default",
          });
        }
      }
    } catch (error) {
      console.error('Error loading news data:', error);
      setIsErrorState(true);
      toast({
        title: "Error",
        description: "Failed to load news data. Using sample data instead.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setInitialLoad(false);
    }
  }, [selectedDate, sendDateToWebhook, toast]);
  
  // Run on initial mount
  useEffect(() => {
    fetchNewsData();
  }, [fetchNewsData]);
  
  // Fix: Separate the date change from fetching to avoid race conditions
  const handleDateChange = useCallback((date: Date | undefined) => {
    console.log("NewsAggregator: Date changed to:", date);
    setSelectedDate(date);
    
    // Don't try to fetch immediately - let the selectedDate effect handle it
    if (!date) {
      return;
    }
    
    // Set loading state here to give immediate feedback
    setIsLoading(true);
    
    // Let the effect trigger fetchNewsData
  }, []);
  
  // Add an effect to trigger fetchNewsData when selectedDate changes
  useEffect(() => {
    if (selectedDate) {
      console.log("Effect triggered due to selectedDate change:", selectedDate);
      fetchNewsData();
    }
  }, [selectedDate, fetchNewsData]);
  
  // Filter articles when dependencies change
  useEffect(() => {
    if (isLoading) return; // Don't update filtered articles while loading

    let filtered = [...newsArticles];
    
    if (selectedDate) {
      const dayStart = startOfDay(selectedDate);
      const dayEnd = endOfDay(selectedDate);
      
      filtered = filtered.filter(article => {
        try {
          const articleDate = parseISO(article.publishedAt);
          console.log(`Article date (${article.id}): ${articleDate.toLocaleDateString()}, comparing with selected date: ${selectedDate.toLocaleDateString()}`);
          return articleDate >= dayStart && articleDate <= dayEnd;
        } catch (error) {
          console.error(`Invalid date format for article ${article.id}:`, article.publishedAt);
          return false;
        }
      });
    }
    
    if (selectedGrade !== 'all') {
      filtered = filtered.filter(article => article.grade === selectedGrade);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        article => 
          article.title.toLowerCase().includes(query) || 
          article.summary.toLowerCase().includes(query)
      );
    }
    
    setFilteredArticles(filtered);
  }, [newsArticles, selectedDate, selectedGrade, searchQuery, isLoading]);
  
  const handleGradeSelect = (gradeId: string) => {
    setSelectedGrade(gradeId);
  };
  
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };
  
  const handleGradeChange = (articleId: string, grade: string) => {
    const updatedArticles = newsArticles.map(article => 
      article.id === articleId ? { ...article, grade: grade as NewsArticle['grade'] } : article
    );
    
    setNewsArticles(updatedArticles);
    
    toast({
      title: "Article Graded",
      description: `Article marked as "${grade.charAt(0).toUpperCase() + grade.slice(1)}"`,
    });
  };

  // Create article loading skeletons for better UX during loading
  const renderLoadingSkeletons = () => {
    return Array(3).fill(0).map((_, index) => (
      <div key={`skeleton-${index}`} className="border rounded-lg p-4 space-y-3">
        <div className="flex gap-4">
          <Skeleton className="h-16 w-16 rounded-md" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
        <Skeleton className="h-20 w-full" />
      </div>
    ));
  };
  
  const showNoArticlesFound = !isLoading && filteredArticles.length === 0 && !initialLoad;
  
  return (
    <div className="h-full overflow-y-auto p-4 md:p-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-64 space-y-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-4">News Feed</h1>
            <SearchBar 
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
            />
          </div>
          
          <div className="space-y-6">
            <DateFilter
              selectedDate={selectedDate}
              onDateChange={handleDateChange}
              onRefresh={fetchNewsData}
              isLoading={isLoading}
            />
            
            <Separator className="my-4" />
            
            <GradeFilter 
              selectedGrade={selectedGrade}
              onSelectGrade={handleGradeSelect}
            />
          </div>
        </div>
        
        <div className="flex-1">
          {isLoading ? (
            <div className="space-y-6">
              {renderLoadingSkeletons()}
            </div>
          ) : showNoArticlesFound ? (
            <NoArticlesFound />
          ) : (
            <div className="space-y-6">
              {filteredArticles.map((article) => (
                <ArticleCard 
                  key={article.id} 
                  article={article} 
                  onGradeChange={handleGradeChange}
                />
              ))}
            </div>
          )}
          
          {isErrorState && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>
                <p className="font-medium">There was an error connecting to the news service.</p>
                <p className="text-sm mt-1">Showing sample articles instead. You can try refreshing the data.</p>
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}

export default NewsAggregator;
