import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ChatPage from "./pages/ChatPage";
import StocksOverviewPage from "./pages/StocksOverviewPage";
import StockDetailPage from "./pages/StockDetailPage";
import NewsPage from "./pages/NewsPage";
import ArticlePage from "./pages/ArticlePage";
import NotFound from "./pages/NotFound";
import KoreanNewsPage from "./pages/KoreanNewsPage";
import USArticlePage from "./pages/USArticlePage";
import KoreanArticlePage from "./pages/KoreanArticlePage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/stocks" element={<StocksOverviewPage />} />
          <Route path="/stock/:symbol" element={<StockDetailPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/korean-news" element={<KoreanNewsPage />} />
          <Route path="/article/us/:id" element={<USArticlePage />} />
          <Route path="/article/kor/:id" element={<KoreanArticlePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
