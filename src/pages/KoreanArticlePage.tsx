
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { NewsArticle } from '@/components/news/types';
import { dummyNewsArticles } from '@/components/news/dummyData';
import ArticleContent from '@/components/news/ArticleContent';
import Header from '@/components/layout/Header';
import NoArticlesFound from '@/components/news/NoArticlesFound';
import { ArticleService } from '@/services/article/ArticleService';
import { useToast } from "@/hooks/use-toast";

const KoreanArticlePage = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  useEffect(() => {
    const fetchArticleContent = async () => {
      setIsLoading(true);
      
      try {
        const foundArticle = dummyNewsArticles.find(a => a.id === id) || null;
        
        if (foundArticle) {
          if (!foundArticle.content) {
            console.log(`Fetching Korean article content for: ${id}`);
            
            const response = await ArticleService.fetchArticleContent('kor', id || '');
            
            if (response.success && response.data) {
              foundArticle.content = response.data.content || foundArticle.summary;
            } else {
              console.warn('Could not fetch article content:', response.error);
              foundArticle.content = foundArticle.summary;
            }
          }
          
          setArticle(foundArticle);
        } else {
          toast({
            title: "Article Not Found",
            description: "Could not find the requested article.",
            variant: "destructive",
          });
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
            <ArticleContent article={article} />
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

export default KoreanArticlePage;
