
import { Link } from 'react-router-dom';
import { NewsArticle } from './types';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Clock } from 'lucide-react';
import { format } from 'date-fns';

interface FeaturedArticlesProps {
  articles: NewsArticle[];
  isLoading: boolean;
}

export const FeaturedArticles = ({ articles, isLoading }: FeaturedArticlesProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'MMM d, yyyy');
  };

  return (
    <div className="w-full mb-8 space-y-4">
      <h2 className="text-2xl font-bold">Featured Articles</h2>
      
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {articles.slice(0, 10).map((article) => (
            <CarouselItem key={article.id} className="md:basis-1/2 lg:basis-1/3">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-0">
                  <Link to={`/article/${article.id}`} className="block">
                    <div className="relative aspect-[16/9] overflow-hidden rounded-t-lg">
                      {article.imageUrl ? (
                        <img
                          src={article.imageUrl}
                          alt={article.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full bg-muted flex items-center justify-center">
                          <span className="text-muted-foreground">No image</span>
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                        <h3 className="text-white font-semibold line-clamp-2 text-lg">
                          {article.title}
                        </h3>
                      </div>
                    </div>
                    <div className="p-4 space-y-2">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {article.summary}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{article.source}</span>
                        <span>•</span>
                        <span>{formatDate(article.publishedAt)}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {article.readTime} min read
                        </span>
                      </div>
                    </div>
                  </Link>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default FeaturedArticles;
