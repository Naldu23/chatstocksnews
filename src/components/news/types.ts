
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

// Convert string grade to numeric importance (1-4)
export const getNumericImportance = (grade?: string): number => {
  switch (grade) {
    case 'critical':
      return 1;
    case 'important':
      return 2;
    case 'useful':
      return 3;
    case 'interesting':
      return 4;
    default:
      return 4; // Default to lowest importance
  }
};

// Convert numeric importance to string grade
export const getGradeFromNumeric = (importance: number): string => {
  switch (importance) {
    case 1:
      return 'critical';
    case 2:
      return 'important';
    case 3:
      return 'useful';
    case 4:
      return 'interesting';
    default:
      return 'interesting'; // Default to lowest importance
  }
};
