
import { BookOpen, Calendar, Clock, ArrowLeft, Bookmark, Share2 } from 'lucide-react';
import { NewsArticle } from './types';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';  // Add support for tables, strikethrough, etc.
import rehypeRaw from 'rehype-raw';  // Add support for rendering HTML inside markdown

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

  // Process content to handle both </br> tags and regular markdown
  const processContent = (content?: string) => {
    if (!content) return content;
    
    // Replace HTML break tags with double newlines for markdown
    return content.replace(/<\/br>/g, '\n\n').replace(/<br>/g, '\n\n').replace(/<br\/>/g, '\n\n');
  };

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
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}  // Add GitHub Flavored Markdown support
            rehypePlugins={[rehypeRaw]}  // Add support for HTML in markdown
            components={{
              h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mt-6 mb-4" {...props} />,
              h2: ({ node, ...props }) => <h2 className="text-2xl font-bold mt-5 mb-3" {...props} />,
              h3: ({ node, ...props }) => <h3 className="text-xl font-bold mt-4 mb-2" {...props} />,
              p: ({ node, ...props }) => <p className="text-base leading-relaxed my-3" {...props} />,
              a: ({ node, ...props }) => <a className="text-primary hover:text-primary/80 underline" {...props} />,
              ul: ({ node, ...props }) => <ul className="list-disc list-outside ml-6 my-4" {...props} />,
              ol: ({ node, ...props }) => <ol className="list-decimal list-outside ml-6 my-4" {...props} />,
              li: ({ node, ...props }) => <li className="my-1" {...props} />,
              strong: ({ node, ...props }) => <strong className="font-bold" {...props} />
            }}
          >
            {processContent(article.content)}
          </ReactMarkdown>
        ) : (
          <p className="text-lg">{article.summary}</p>
        )}
      </div>
    </div>
  );
};

export default ArticleContent;
