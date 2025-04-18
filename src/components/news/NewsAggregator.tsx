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
import FeaturedArticles from './FeaturedArticles';
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
  const [isLoading, setIsLoading] = useState(true);
  const [isErrorState, setIsErrorState] = useState(false);
  
  const fetchNewsData = useCallback(async () => {
    if (!selectedDate) return;
    
    setIsLoading(true);
    setIsErrorState(false);
    
    try {
      console.log('Loading news data...');
      console.log(`Fetching news for date (Local): ${selectedDate.toLocaleDateString()}`);
      console.log(`Fetching news for date (ISO): ${selectedDate.toISOString()}`);
      
      const webhookResponse = await N8nService.sendDateFilter(selectedDate);
      console.log('Webhook response received:', webhookResponse);
      
      if (!webhookResponse.success) {
        console.warn('Failed to fetch articles:', webhookResponse.error);
        toast({
          title: "Warning",
          description: "Couldn't fetch new articles.",
          variant: "destructive",
        });
        setNewsArticles(dummyNewsArticles);
      } else {
        console.log('Successfully received webhook response:', webhookResponse);
        toast({
          title: "Success",
          description: "Articles fetched successfully.",
        });
        
        if (webhookResponse.data && 
            Array.isArray(webhookResponse.data) && 
            webhookResponse.data.length > 0 && 
            webhookResponse.data[0].articles && 
            Array.isArray(webhookResponse.data[0].articles) && 
            webhookResponse.data[0].articles.length > 0) {
          
          const validatedArticles = webhookResponse.data[0].articles.map((article: any) => ({
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
          }));
          
          setNewsArticles(validatedArticles);
          console.log('Successfully loaded articles from webhook:', validatedArticles);
        } else if (webhookResponse.data && 
                  webhookResponse.data.articles && 
                  Array.isArray(webhookResponse.data.articles) && 
                  webhookResponse.data.articles.length > 0) {
          
          const validatedArticles = webhookResponse.data.articles.map((article: any) => ({
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
          }));
          
          setNewsArticles(validatedArticles);
          console.log('Successfully loaded articles directly from webhook:', validatedArticles);
        } else {
          console.warn('No valid articles found in response, using dummy data:', webhookResponse);
          setNewsArticles(dummyNewsArticles);
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
      setNewsArticles(dummyNewsArticles);
      toast({
        title: "Error",
        description: "Failed to load news data. Using sample data instead.",
        variant: "destructive",
      });
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  }, [selectedDate, toast]);

  useEffect(() => {
    fetchNewsData();
  }, [fetchNewsData]);

  const handleDateChange = useCallback((date: Date | undefined) => {
    console.log("NewsAggregator: Date changed to:", date);
    if (date) {
      const normalizedDate = startOfDay(date);
      setSelectedDate(normalizedDate);
      fetchNewsData();
    }
  }, []);

  useEffect(() => {
    if (selectedDate) {
      console.log("Effect triggered due to selectedDate change:", selectedDate);
      fetchNewsData();
    }
  }, [selectedDate, fetchNewsData]);

  useEffect(() => {
    if (isLoading) return;
    
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

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-6">
          {renderLoadingSkeletons()}
        </div>
      );
    }
    
    if (filteredArticles.length === 0) {
      return <NoArticlesFound />;
    }
    
    return (
      <div className="space-y-6">
        {filteredArticles.map((article) => (
          <ArticleCard 
            key={article.id} 
            article={article} 
            onGradeChange={handleGradeChange}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6">
      {!isLoading && (
        <div className="mb-8 border-b pb-8">
          <FeaturedArticles articles={newsArticles} isLoading={isLoading} />
        </div>
      )}
      
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
          {renderContent()}
          
          {isErrorState && !isLoading && (
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
