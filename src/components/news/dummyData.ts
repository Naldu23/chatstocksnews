
import { NewsArticle } from './types';

export const dummyNewsArticles: NewsArticle[] = [
  {
    id: "news-1",
    title: "Major Pharmaceutical Breakthrough in Cancer Treatment",
    summary: "Scientists announce revolutionary new therapy showing 90% success rate in clinical trials",
    source: "PharmaDaily",
    publishedAt: "2024-02-15T09:30:00Z",
    url: "https://example.com/pharma-breakthrough",
    imageUrl: "https://picsum.photos/400/300",
    readTime: 5,
    grade: "critical"
  },
  {
    id: "news-2",
    title: "FDA Approves New Drug for Rare Disease",
    summary: "Groundbreaking treatment receives fast-track approval",
    source: "MedNews",
    publishedAt: "2024-02-14T14:20:00Z",
    url: "https://example.com/fda-approval",
    imageUrl: "https://picsum.photos/400/301",
    readTime: 4,
    grade: "important"
  },
  {
    id: "news-3",
    title: "Healthcare AI Platform Raises $100M",
    summary: "Startup revolutionizing patient care receives major funding",
    source: "TechCrunch",
    publishedAt: "2024-02-13T11:15:00Z",
    url: "https://example.com/ai-funding",
    imageUrl: "https://picsum.photos/400/302",
    readTime: 6,
    grade: "useful"
  },
  {
    id: "news-4",
    title: "New Healthcare Policy Changes Announced",
    summary: "Government introduces reforms to improve healthcare accessibility",
    source: "HealthPolicy Today",
    publishedAt: "2024-02-12T16:45:00Z",
    url: "https://example.com/policy-changes",
    imageUrl: "https://picsum.photos/400/303",
    readTime: 7,
    grade: "interesting"
  },
  {
    id: "news-5",
    title: "Global Health Conference Highlights Innovation",
    summary: "Leading experts discuss future of healthcare",
    source: "MedTech Weekly",
    publishedAt: "2024-02-11T13:00:00Z",
    url: "https://example.com/health-conference",
    imageUrl: "https://picsum.photos/400/304",
    readTime: 5,
    grade: "interesting"
  }
];
