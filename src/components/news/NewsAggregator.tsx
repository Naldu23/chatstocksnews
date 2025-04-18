import { useState, useEffect } from 'react';
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

export function NewsAggregator() {
  const { toast } = useToast();
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>(dummyNewsArticles);
  const [filteredArticles, setFilteredArticles] = useState<NewsArticle[]>(dummyNewsArticles);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const fetchNewsData = async () => {
    setIsLoading(true);
    
    try {
      console.log('Loading news data from dummy data');
      setNewsArticles(dummyNewsArticles);
    } catch (error) {
      console.error('Error loading news data:', error);
      toast({
        title: "Error",
        description: "Failed to load news data. Using sample data instead.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchNewsData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const handleDateChange = async (date: Date | undefined) => {
    setSelectedDate(date);
    try {
      const response = await N8nService.sendDateFilter(date);
      console.log('Date filter webhook response:', response);
      
      if (!response.success) {
        toast({
          title: "Warning",
          description: "Date selection was updated but the webhook notification failed.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Date selection was updated and notification sent.",
        });
      }
    } catch (error) {
      console.error('Error sending date to webhook:', error);
      toast({
        title: "Warning",
        description: "Date selection was updated but the webhook notification failed.",
        variant: "destructive",
      });
    }
    
    fetchNewsData();
  };
  
  useEffect(() => {
    let filtered = [...newsArticles];
    
    if (selectedDate) {
      const dayStart = startOfDay(selectedDate);
      const dayEnd = endOfDay(selectedDate);
      
      filtered = filtered.filter(article => {
        const articleDate = parseISO(article.publishedAt);
        return articleDate >= dayStart && articleDate <= dayEnd;
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
  }, [newsArticles, selectedDate, selectedGrade, searchQuery]);
  
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
          {filteredArticles.length === 0 ? (
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
        </div>
      </div>
    </div>
  );
}

export default NewsAggregator;
