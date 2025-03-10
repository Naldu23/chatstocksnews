
export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  source: string;
  publishedAt: string;
  url: string;
  imageUrl?: string;
  category: string;
  readTime: number;
  content?: string; // Added content field
}

export interface Category {
  id: string;
  name: string;
}

export const categories: Category[] = [
  { id: 'all', name: 'All News' },
  { id: 'pharmaceutical', name: 'Pharmaceutical' },
  { id: 'regulatory', name: 'Regulatory' },
  { id: 'technology', name: 'Technology' },
  { id: 'finance', name: 'Finance' },
  { id: 'business', name: 'Business' },
  { id: 'general', name: 'General' },
];
