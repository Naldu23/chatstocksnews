import { Link } from 'react-router-dom';
import { NewsArticle } from './types';
import { Card, CardContent } from "@/components/ui/card";
import { Clock } from 'lucide-react';
import { format } from 'date-fns';

interface FeaturedArticlesProps {
  articles: NewsArticle[];
  isLoading: boolean;
  isKorean?: boolean;
}

export const FeaturedArticles = ({ articles, isLoading, isKorean = false }: FeaturedArticlesProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'MMM d, yyyy');
  };

  const getPlaceholderImage = () => {
    const placeholderImages = [
      'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
      'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
      'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d'
    ];
    return placeholderImages[Math.floor(Math.random() * placeholderImages.length)];
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-6">Featured Articles</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Main featured article */}
        <div className="md:col-span-6 h-[400px] md:h-[500px] lg:h-[600px]">
          {articles[0] && (
            <Card className="h-full overflow-hidden">
              <CardContent className="p-0 h-full">
                <Link to={`/article/${isKorean ? 'kor' : 'us'}/${articles[0].id}`} className="block h-full">
                  <div className="relative h-full">
                    {articles[0].imageUrl ? (
                      <img
                        src={articles[0].imageUrl}
                        alt={articles[0].title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <img
                        src={getPlaceholderImage()}
                        alt="Placeholder image"
                        className="h-full w-full object-cover"
                      />
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4 md:p-6 lg:p-8">
                      <h3 className="text-white font-bold text-xl md:text-2xl lg:text-3xl mb-2 md:mb-3">
                        {articles[0].title}
                      </h3>
                      <p className="text-white/90 text-sm md:text-base lg:text-lg line-clamp-2 mb-2 md:mb-4">
                        {articles[0].summary}
                      </p>
                      <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm text-white/80">
                        <span className="font-medium">{articles[0].source}</span>
                        <span>•</span>
                        <span>{formatDate(articles[0].publishedAt)}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {articles[0].readTime} min read
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right side grid */}
        <div className="md:col-span-6 grid grid-cols-1 sm:grid-cols-2 grid-rows-auto sm:grid-rows-2 gap-6 h-[650px] sm:h-[500px] md:h-[500px] lg:h-[600px]">
          {articles.slice(1, 5).map((article, index) => (
            <Card key={article.id} className="h-full overflow-hidden">
              <CardContent className="p-0 h-full">
                <Link to={`/article/${isKorean ? 'kor' : 'us'}/${article.id}`} className="block h-full">
                  <div className="relative h-full">
                    {article.imageUrl ? (
                      <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <img
                        src={getPlaceholderImage()}
                        alt="Placeholder image"
                        className="h-full w-full object-cover"
                      />
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-3 md:p-4">
                      <h3 className="text-white font-semibold text-sm md:text-base lg:text-lg mb-2 md:mb-3 line-clamp-2">
                        {article.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-white/80">
                        <span>{article.source}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {article.readTime} min read
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom row */}
        <div className="col-span-1 md:col-span-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-2 md:mt-4">
          {articles.slice(5, 8).map((article) => (
            <Card key={article.id} className="overflow-hidden">
              <CardContent className="p-0">
                <Link to={`/article/${isKorean ? 'kor' : 'us'}/${article.id}`} className="block">
                  <div className="relative aspect-[16/9]">
                    {article.imageUrl ? (
                      <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <img
                        src={getPlaceholderImage()}
                        alt="Placeholder image"
                        className="h-full w-full object-cover"
                      />
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-3 md:p-4">
                      <h3 className="text-white font-semibold text-sm md:text-lg mb-2 md:mb-3 line-clamp-2">
                        {article.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-white/80">
                        <span>{article.source}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {article.readTime} min read
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedArticles;
