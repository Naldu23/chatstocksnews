
import { Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NewsItem {
  title: string;
  date: string;
  id?: string; // Add optional ID for navigation
}

interface StockNewsItemProps {
  symbol: string;
  name: string;
  news: NewsItem[];
}

const StockNewsItem = ({ symbol, name, news }: StockNewsItemProps) => {
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold flex items-center">
        <span className="bg-secondary text-secondary-foreground px-2 py-0.5 rounded mr-2 text-sm">
          {symbol}
        </span>
        {name}
      </h3>
      
      <ul className="space-y-2 pl-2 border-l-2 border-muted ml-2">
        {news.map((item, index) => (
          <li key={index} className="hover:bg-muted/50 p-2 rounded transition-colors">
            <div className="flex items-start">
              <div className="flex-1">
                {item.id ? (
                  <Link 
                    to={`/article/${item.id}`} 
                    className="font-medium hover:text-primary hover:underline"
                    onClick={(e) => {
                      // Ensure the event propagates correctly
                      e.stopPropagation();
                    }}
                  >
                    {item.title}
                  </Link>
                ) : (
                  <p className="font-medium">{item.title}</p>
                )}
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <Calendar className="h-3 w-3 mr-1" />
                  {item.date}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StockNewsItem;
