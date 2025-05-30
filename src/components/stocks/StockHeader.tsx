
import { useState } from 'react';
import { Search } from 'lucide-react';

interface StockHeaderProps {
  stockSymbol: string;
  currentPrice: string;
  priceDiff: string;
  percentDiff: string;
  isPositive: boolean;
  searchInput?: string;
  setSearchInput?: (value: string) => void;
  handleSearch?: (e: React.FormEvent) => void;
  hideSearch?: boolean;
}

export function StockHeader({
  stockSymbol,
  currentPrice,
  priceDiff,
  percentDiff,
  isPositive,
  searchInput = '',
  setSearchInput = () => {},
  handleSearch = (e) => { e.preventDefault(); },
  hideSearch = false
}: StockHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-end gap-2">
      <div className="text-right pr-4">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">{stockSymbol}</h1>
        <div className="mt-1 flex items-center justify-end">
          <span className="text-3xl font-bold">${currentPrice}</span>
        </div>
      </div>
      
      {!hideSearch && (
        <form onSubmit={handleSearch} className="flex w-full md:w-auto">
          <div className="relative flex flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search symbol..."
              className="flex h-10 w-full rounded-l-md border border-input bg-background py-2 pl-10 pr-4 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
          <button
            type="submit"
            className="inline-flex h-10 items-center justify-center rounded-r-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Search
          </button>
        </form>
      )}
    </div>
  );
}

export default StockHeader;
