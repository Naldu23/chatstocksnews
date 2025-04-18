
import { BookOpen, Calendar, Clock, ArrowLeft, Bookmark, Share2 } from 'lucide-react';
import { NewsArticle } from './types';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ReactMarkdown from 'react-markdown';

interface ArticleContentProps {
  article: NewsArticle;
}

const ArticleContent = ({ article }: ArticleContentProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (!article) {
    return <div>Article not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Link to="/news">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to News
            </Button>
          </Link>
        </div>
        
        <div className="flex items-center justify-between">
          {article.grade && (
            <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
              {article.grade.charAt(0).toUpperCase() + article.grade.slice(1)}
            </span>
          )}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Bookmark className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button variant="ghost" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold leading-tight">{article.title}</h1>
        
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            {formatDate(article.publishedAt)}
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {article.readTime} min read
          </div>
          <div className="flex items-center">
            <BookOpen className="h-4 w-4 mr-1" />
            Source: {article.source}
          </div>
        </div>
      </div>
      
      {article.imageUrl && (
        <div className="w-full h-64 md:h-96 overflow-hidden rounded-xl">
          <img 
            src={article.imageUrl} 
            alt={article.title} 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <Separator />
      
      <div className="prose prose-gray dark:prose-invert max-w-none">
        {article.content ? (
          <ReactMarkdown>{article.content}</ReactMarkdown>
        ) : (
          <p className="text-lg">{article.summary}</p>
        )}
      </div>
    </div>
  );
};

export default ArticleContent;
