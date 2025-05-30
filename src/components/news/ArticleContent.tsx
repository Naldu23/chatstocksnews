
import { ArrowLeft, ExternalLink, Calendar, Clock, BookOpen } from 'lucide-react';
import { NewsArticle } from './types';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { importanceGrades } from './types';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface ArticleContentProps {
  article: NewsArticle;
  onGradeChange?: (grade: string) => void;
}

const ArticleContent = ({ article, onGradeChange }: ArticleContentProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getBackRoute = () => {
    if (location.pathname.includes('/article/kor/')) {
      return '/korean-news';
    }
    return '/us-news';
  };

  const handleGoBack = () => {
    navigate(getBackRoute());
  };

  const handleGradeChange = (grade: string) => {
    console.log(`ArticleContent: Grade changed to ${grade}`);
    if (onGradeChange && grade) {
      onGradeChange(grade);
      toast({
        title: "Grade Updated",
        description: `Article importance set to ${grade}`,
      });
    }
  };

  if (!article) {
    return <div>Article not found</div>;
  };

  const processContent = (content?: string) => {
    if (!content) return content;
    return content.replace(/<\/br>/g, '\n\n').replace(/<br>/g, '\n\n').replace(/<br\/>/g, '\n\n');
  };

  const displayContent = article.content || article.summary;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={handleGoBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to News
          </Button>
        </div>
        
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <ToggleGroup 
              type="single" 
              value={article.grade || 'interesting'} 
              onValueChange={handleGradeChange} 
              className="flex gap-2"
            >
              {importanceGrades.slice(1).map((grade) => (
                <ToggleGroupItem
                  key={grade.id}
                  value={grade.id}
                  aria-label={grade.name}
                  className={cn(
                    "data-[state=on]:text-white",
                    grade.id === 'critical' && "data-[state=on]:bg-rose-600",
                    grade.id === 'important' && "data-[state=on]:bg-amber-500",
                    grade.id === 'useful' && "data-[state=on]:bg-yellow-400 data-[state=on]:text-black",
                    grade.id === 'interesting' && "data-[state=on]:bg-neutral-400 data-[state=on]:text-black"
                  )}
                >
                  {grade.name}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>

            {article.url && (
              <Button variant="outline" size="sm" asChild>
                <a 
                  href={article.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  View Original
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            )}
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
        {displayContent ? (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}  
            rehypePlugins={[rehypeRaw]}  
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
            {processContent(displayContent)}
          </ReactMarkdown>
        ) : (
          <p className="text-lg">No content available for this article.</p>
        )}
      </div>
    </div>
  );
};

export default ArticleContent;
