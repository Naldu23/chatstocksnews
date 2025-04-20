
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { NewsArticle } from '@/components/news/types';
import { dummyNewsArticles } from '@/components/news/dummyData';
import ArticleContent from '@/components/news/ArticleContent';
import Header from '@/components/layout/Header';
import NoArticlesFound from '@/components/news/NoArticlesFound';
import { ArticleService } from '@/services/article/ArticleService';
import { useToast } from "@/hooks/use-toast";
import { N8nService } from '@/services/n8nService';

const USArticlePage = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const convertImportanceToGrade = (importance: number | undefined): 'critical' | 'important' | 'useful' | 'interesting' => {
    if (!importance) return 'interesting'; // Default to lowest importance
    
    switch (importance) {
      case 1:
        return 'critical';
      case 2:
        return 'important';
      case 3:
        return 'useful';
      case 4:
        return 'interesting';
      default:
        return 'interesting';
    }
  };

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

  const handleGradeChange = async (grade: string) => {
    if (article) {
      const typedGrade = grade as 'critical' | 'important' | 'useful' | 'interesting';
      setArticle({ ...article, grade: typedGrade });
      
      try {
        console.log(`Sending grade update for US article: ${article.id}, grade: ${grade}`);
        const response = await N8nService.updateArticleGrade('us', article.id, grade);
        
        if (!response.success) {
          throw new Error(response.error || 'Failed to update article grade');
        }
        
        console.log('Successfully notified n8n about grade change:', response.data);
        toast({
          title: "Grade Updated",
          description: `Article importance set to ${grade}`,
        });
      } catch (error) {
        console.error('Failed to notify n8n about grade change:', error);
        toast({
          title: "Update Error",
          description: "Failed to sync grade change with the server",
          variant: "destructive",
        });
      }
    }
  };
  
  useEffect(() => {
    const fetchArticleContent = async () => {
      setIsLoading(true);
      
      try {
        const decodedId = id ? decodeURIComponent(id) : '';
        console.log(`Looking for US article with decoded ID: ${decodedId}`);
        
        const foundArticle = dummyNewsArticles.find(a => a.id === decodedId);
        
        if (foundArticle) {
          console.log(`Found article in dummy data:`, foundArticle);
          
          const articleToUpdate = { ...foundArticle };
          
          if (!articleToUpdate.content) {
            console.log(`Fetching US article content for ID: ${decodedId}`);
            
            const response = await ArticleService.fetchArticleContent('us', decodedId);
            
            if (response.success && response.data) {
              console.log('Successfully fetched article content:', response.data);
              articleToUpdate.content = response.data.content || articleToUpdate.summary;
            } else {
              console.warn('Could not fetch article content:', response.error);
              articleToUpdate.content = articleToUpdate.summary;
              toast({
                title: "Content Warning",
                description: "Using summary as fallback. Could not fetch full article content.",
                variant: "destructive",
              });
            }
          }
          
          setArticle(articleToUpdate);
        } else {
          console.warn(`Article not found with ID: ${decodedId}`);
          
          console.log(`Attempting direct webhook fetch for ID: ${decodedId}`);
          const response = await ArticleService.fetchArticleContent('us', decodedId);
          
          if (response.success && response.data && response.data.title) {
            const grade = response.data.grade || 
                          (response.data.importance ? 
                            convertImportanceToGrade(Number(response.data.importance)) : 
                            'interesting');
            
            console.log(`Converting importance ${response.data.importance} to grade: ${grade}`);
            
            const webhookArticle: NewsArticle = {
              id: decodedId,
              title: response.data.title || 'Unknown Title',
              summary: response.data.summary || '',
              content: response.data.content || '',
              imageUrl: response.data.imageUrl || '',
              source: response.data.source || 'External Source',
              publishedAt: response.data.publishedAt || new Date().toISOString(),
              readTime: response.data.readTime || 5,
              grade: grade,
              url: response.data.url || '' 
            };
            
            console.log('Created article from webhook data:', webhookArticle);
            setArticle(webhookArticle);
          } else {
            console.error('Both dummy data and webhook lookup failed');
            toast({
              title: "Article Not Found",
              description: "Could not find or fetch the requested article.",
              variant: "destructive",
            });
          }
        }
      } catch (error) {
        console.error('Error processing article:', error);
        toast({
          title: "Error",
          description: "Failed to load article content.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchArticleContent();
  }, [id, toast]);
  
  return (
    <div className="flex h-screen flex-col">
      <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      
      <div className="flex-1 overflow-hidden">
        <main className="h-full overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : article ? (
            <ArticleContent article={article} onGradeChange={handleGradeChange} />
          ) : (
            <div className="max-w-4xl mx-auto pt-12">
              <NoArticlesFound />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default USArticlePage;
