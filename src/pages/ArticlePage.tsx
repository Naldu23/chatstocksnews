
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { NewsArticle } from '@/components/news/types';
import { dummyNewsArticles } from '@/components/news/dummyData';
import ArticleContent from '@/components/news/ArticleContent';
import Header from '@/components/layout/Header';
import NoArticlesFound from '@/components/news/NoArticlesFound';
import { N8nService } from '@/services/n8nService';
import { useToast } from "@/hooks/use-toast";

const ArticlePage = () => {
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
        // First, find the basic article info from our dummy data
        const foundArticle = dummyNewsArticles.find(a => a.id === id) || null;
        
        if (foundArticle) {
          // If we found the article, check if it already has content
          if (!foundArticle.content) {
            // If no content, try to fetch it
            console.log(`Fetching content for article: ${id}`);
            
            try {
              // Implement a new method in N8nService to fetch article content
              const response = await N8nService.fetchArticleContent(id);
              
              if (response.success && response.data) {
                // If we got content from the service, add it to the article
                foundArticle.content = response.data.content || foundArticle.summary;
              } else {
                console.warn('Could not fetch article content:', 'Failed to get content from API');
                // Use summary as fallback content if no content was fetched
                foundArticle.content = foundArticle.summary;
              }
            } catch (error) {
              console.error('Error fetching article content:', error);
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

export default ArticlePage;
