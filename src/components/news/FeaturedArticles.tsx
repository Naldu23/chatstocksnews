
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { ChevronRight } from "lucide-react";
import { NewsArticle } from "./types";
import { Link } from "react-router-dom";

interface FeaturedArticlesProps {
  articles: NewsArticle[];
  isLoading: boolean;
  isKorean?: boolean;
}

export function FeaturedArticles({ articles, isLoading, isKorean = false }: FeaturedArticlesProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array(3).fill(0).map((_, index) => (
            <Skeleton key={index} className="h-40 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }
  
  if (articles.length === 0) {
    return null;
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Featured Articles</h2>
        <Link 
          to={isKorean ? "/korean-news" : "/us-news"} 
          className="text-sm text-muted-foreground flex items-center hover:text-primary"
        >
          View all 
          <ChevronRight className="ml-1 h-4 w-4" />
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.slice(0, 3).map((article) => (
          <Link 
            key={article.id} 
            to={`/article/${isKorean ? 'kor' : 'us'}/${article.id}`}
            className="group"
          >
            <div className="h-40 relative overflow-hidden rounded-lg mb-2">
              {article.imageUrl ? (
                <img 
                  src={article.imageUrl} 
                  alt={article.title} 
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                  No image
                </div>
              )}
              
              {article.grade && (
                <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm text-xs font-medium px-2 py-0.5 rounded">
                  {article.grade.charAt(0).toUpperCase() + article.grade.slice(1)}
                </div>
              )}
            </div>
            
            <h3 className="font-medium line-clamp-2 group-hover:text-primary">{article.title}</h3>
          </Link>
        ))}
      </div>
      
      <Separator className="mt-6" />
    </div>
  );
}

export default FeaturedArticles;
