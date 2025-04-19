
export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  source: string;
  publishedAt: string;
  url: string;
  imageUrl?: string;
  readTime: number;
  content?: string;
  grade?: 'critical' | 'important' | 'useful' | 'interesting';
}

// Importance grades for news articles
export const importanceGrades = [
  { id: 'all', name: 'All Grades', color: 'bg-secondary text-secondary-foreground' },
  { id: 'critical', name: 'Critical', color: 'bg-rose-600 text-white' },
  { id: 'important', name: 'Important', color: 'bg-amber-500 text-white' },
  { id: 'useful', name: 'Useful', color: 'bg-yellow-400 text-black' },
  { id: 'interesting', name: 'Interesting', color: 'bg-neutral-400 text-black' },
];
