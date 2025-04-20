import { useState, useEffect, useCallback } from 'react';
import { startOfDay, endOfDay, parseISO, isToday } from 'date-fns';
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

interface NewsAggregatorProps {
  isKorean: boolean;
  fetchNews: (date: Date | undefined) => Promise<any>;
  fetchFeatured: () => Promise<any>;
}

export function NewsAggregator({ isKorean, fetchNews, fetchFeatured }: NewsAggregatorProps) {
  const { toast } = useToast();
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [featuredArticles, setFeaturedArticles] = useState<NewsArticle[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<NewsArticle[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isErrorState, setIsErrorState] = useState(false);
  const [featuredLoading, setFeaturedLoading] = useState(true);
  
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };
  
  const handleGradeSelect = (gradeId: string) => {
    setSelectedGrade(gradeId);
  };

  const fetchFeaturedArticles = useCallback(async () => {
    setFeaturedLoading(true);
    try {
      console.log('Fetching featured articles');
      
      const response = await fetchFeatured();
      
      if (response.success && response.data) {
        let articles = [];
        
        if (Array.isArray(response.data)) {
          articles = response.data;
        } 
        else if (response.data.articles && Array.isArray(response.data.articles)) {
          articles = response.data.articles;
        }
        else if (response.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
          const keys = Object.keys(response.data);
          if (keys.length > 0 && !isNaN(Number(keys[0]))) {
            articles = Object.values(response.data);
          }
        }
        
        console.log('Processed featured articles:', articles);
        
        if (articles.length > 0) {
          const validatedArticles = articles.map((article: any) => ({
            id: article.id || `featured-${Math.random().toString(36).substring(2, 9)}`,
            title: article.title || 'Untitled Article',
            summary: article.summary || '',
            source: article.source || 'Featured Source',
            publishedAt: article.publishedAt || new Date().toISOString(),
            url: article.url || '#',
            imageUrl: article.imageUrl || undefined,
            readTime: article.readTime || 5,
            content: article.content || undefined,
            grade: article.grade || 'important'
          }));
          
          const sortedArticles = validatedArticles.sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
          
          setFeaturedArticles(sortedArticles);
          console.log('Featured articles loaded:', sortedArticles.length);
        } else {
          console.log('No featured articles returned, using dummy data');
          setFeaturedArticles(dummyNewsArticles.slice(0, 5));
        }
      } else {
        console.warn('Failed to fetch featured articles:', response.error);
        setFeaturedArticles(dummyNewsArticles.slice(0, 5));
      }
    } catch (error) {
      console.error('Error loading featured articles:', error);
      setFeaturedArticles(dummyNewsArticles.slice(0, 5));
    } finally {
      setFeaturedLoading(false);
    }
  }, [fetchFeatured]);

  useEffect(() => {
    fetchFeaturedArticles();
  }, [fetchFeaturedArticles]);

  const fetchNewsData = useCallback(async (date: Date) => {
    setIsLoading(true);
    setIsErrorState(false);
    
    try {
      console.log(`Fetching ${isKorean ? 'Korean' : 'English'} news for date: ${date.toLocaleDateString()}`);
      
      const webhookResponse = await fetchNews(date);
      
      if (!webhookResponse.success || !webhookResponse.data || 
          (Array.isArray(webhookResponse.data) && webhookResponse.data.length === 0) ||
          (webhookResponse.data.articles && webhookResponse.data.articles.length === 0)) {
        
        console.warn('No articles found for the selected date');
        
        setNewsArticles([]);
        toast({
          title: "No Articles",
          description: `No articles found for the selected date (${date.toLocaleDateString()})`,
          variant: "default",
        });
      } else {
        let articlesFound = false;
        let validatedArticles: NewsArticle[] = [];
        
        if (webhookResponse.data && 
            Array.isArray(webhookResponse.data) && 
            webhookResponse.data[0]?.articles && 
            Array.isArray(webhookResponse.data[0].articles) && 
            webhookResponse.data[0].articles.length > 0) {
          
          validatedArticles = webhookResponse.data[0].articles.map((article: any) => ({
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
          
          articlesFound = true;
        } else if (webhookResponse.data && 
                  webhookResponse.data.articles && 
                  Array.isArray(webhookResponse.data.articles) && 
                  webhookResponse.data.articles.length > 0) {
          
          validatedArticles = webhookResponse.data.articles.map((article: any) => ({
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
          
          articlesFound = true;
        }
        
        if (!articlesFound) {
          console.warn('No valid articles found in response');
          setNewsArticles([]);
          toast({
            title: "No Articles",
            description: `No articles found for the selected date (${date.toLocaleDateString()})`,
            variant: "default",
          });
        } else {
          setNewsArticles(validatedArticles);
        }
      }
    } catch (error) {
      console.error('Error loading news data:', error);
      setIsErrorState(true);
      setNewsArticles([]);
      toast({
        title: "Error",
        description: "Failed to load news data.",
        variant: "destructive",
      });
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  }, [toast, fetchNews, isKorean]);

  useEffect(() => {
    if (selectedDate) {
      console.log("Effect triggered due to selectedDate change:", selectedDate);
      fetchNewsData(selectedDate);
    }
  }, [selectedDate, fetchNewsData]);

  const handleDateChange = useCallback((date: Date | undefined) => {
    console.log("NewsAggregator: Date changed to:", date);
    if (date) {
      const normalizedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      console.log("NewsAggregator: Using normalized date:", normalizedDate);
      setSelectedDate(normalizedDate);
    }
  }, []);

  const handleRefresh = useCallback(() => {
    if (selectedDate) {
      fetchNewsData(selectedDate);
    }
    
    fetchFeaturedArticles();
  }, [selectedDate, fetchNewsData, fetchFeaturedArticles]);

  useEffect(() => {
    if (isLoading) return;
    
    let filtered = [...newsArticles];
    
    if (selectedDate && !isKorean) {
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
  }, [newsArticles, selectedDate, selectedGrade, searchQuery, isLoading, isKorean]);

  const convertGradeToImportance = (grade: string): number => {
    switch (grade) {
      case 'critical':
        return 1;
      case 'important':
        return 2;
      case 'useful':
        return 3;
      case 'interesting':
        return 4;
      default:
        return 4;
    }
  };

  const handleGradeChange = async (articleId: string, grade: string) => {
    const updatedArticles = newsArticles.map(article => 
      article.id === articleId ? { ...article, grade: grade as NewsArticle['grade'] } : article
    );
    
    setNewsArticles(updatedArticles);
    
    const updatedArticle = updatedArticles.find(article => article.id === articleId);
    
    if (updatedArticle) {
      const importance = convertGradeToImportance(grade);
      
      try {
        const articleType = isKorean ? 'kor' : 'us';
        const payload = {
          type: articleType,
          importance,
          articleId: articleId
        };
        
        console.log('Sending webhook data:', payload);
        
        const response = await fetch('https://n8n.bioking.kr/webhook-test/d5ca48e8-d388-4e52-aecf-7778c9f6e7d3', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          mode: 'cors',
          body: JSON.stringify(payload),
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        console.log('Successfully notified n8n about grade change:', payload);
      } catch (error) {
        console.error('Failed to notify n8n about grade change:', error);
        toast({
          title: "Update Error",
          description: "Failed to sync grade change with the server",
          variant: "destructive",
        });
      }
    }
    
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
            isKorean={isKorean}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="h-full p-4 md:p-6 lg:p-8">
      <div className="mb-4">
        <FeaturedArticles 
          articles={featuredArticles} 
          isLoading={featuredLoading} 
          isKorean={isKorean}
        />
      </div>
      
      <div className="flex flex-col md:flex-row gap-6 lg:gap-8">
        <div className="w-full md:w-64 space-y-6 flex-shrink-0 pb-24">
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-4">
              {isKorean ? 'Korean News Feed' : 'News Feed'}
            </h1>
            <SearchBar 
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
            />
          </div>
          
          <div className="space-y-6">
            <DateFilter
              selectedDate={selectedDate}
              onDateChange={handleDateChange}
              onRefresh={handleRefresh}
              isLoading={isLoading}
            />
            
            <Separator className="my-4" />
            
            <GradeFilter 
              selectedGrade={selectedGrade}
              onSelectGrade={handleGradeSelect}
            />
          </div>
        </div>
        
        <div className="flex-1 pb-24">
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
