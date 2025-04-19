
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { NewsArticle } from '@/components/news/types';
import { dummyNewsArticles } from '@/components/news/dummyData';
import ArticleContent from '@/components/news/ArticleContent';
import Header from '@/components/layout/Header';
import NoArticlesFound from '@/components/news/NoArticlesFound';
import { ArticleService } from '@/services/article/ArticleService';
import { useToast } from "@/hooks/use-toast";

const USArticlePage = () => {
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
        // Decode the ID from the URL if it's encoded
        const decodedId = id ? decodeURIComponent(id) : '';
        console.log(`Looking for US article with decoded ID: ${decodedId}`);
        
        // First try to find the article in dummy data
        const foundArticle = dummyNewsArticles.find(a => a.id === decodedId);
        
        if (foundArticle) {
          console.log(`Found article in dummy data:`, foundArticle);
          
          // Clone the article to avoid modifying the original data
          const articleToUpdate = { ...foundArticle };
          
          // If we don't have content yet, fetch it from the webhook
          if (!articleToUpdate.content) {
            console.log(`Fetching US article content for ID: ${decodedId}`);
            
            // Always call the webhook to get fresh content
            const response = await ArticleService.fetchArticleContent('us', decodedId);
            
            if (response.success && response.data) {
              console.log('Successfully fetched article content:', response.data);
              articleToUpdate.content = response.data.content || articleToUpdate.summary;
            } else {
              console.warn('Could not fetch article content:', response.error);
              // Use summary as fallback content
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
          
          // Even if we don't find it in dummy data, try to fetch from webhook
          console.log(`Attempting direct webhook fetch for ID: ${decodedId}`);
          const response = await ArticleService.fetchArticleContent('us', decodedId);
          
          if (response.success && response.data && response.data.title) {
            // Create a synthetic article from webhook data
            const webhookArticle: NewsArticle = {
              id: decodedId,
              title: response.data.title || 'Unknown Title',
              summary: response.data.summary || '',
              content: response.data.content || '',
              imageUrl: response.data.imageUrl || '',
              source: response.data.source || 'External Source',
              publishedAt: response.data.publishedAt || new Date().toISOString(),
              readTime: response.data.readTime || 5,
              grade: 'regular'
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

export default USArticlePage;
