
import React, { useEffect } from 'react';
import { Calendar as CalendarIcon, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface DateFilterProps {
  selectedDate: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  onRefresh: () => void;
  isLoading: boolean;
}

export const DateFilter = ({
  selectedDate,
  onDateChange,
  onRefresh,
  isLoading
}: DateFilterProps) => {
  // Ensure we always have a default date
  const displayDate = selectedDate || new Date();
  
  // Force the selection of a date on first render if none is selected
  useEffect(() => {
    if (!selectedDate) {
      onDateChange(new Date());
    }
  }, [selectedDate, onDateChange]);

  const handleDateChange = (date: Date | undefined) => {
    // Only allow selecting a date, prevent deselection
    if (date) {
      // Preserve the exact date without time zone adjustments
      const normalizedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      console.log("DateFilter: Date selected:", normalizedDate);
      onDateChange(normalizedDate);
    }
  };

  const handleRefresh = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("DateFilter: Manual refresh triggered");
    onRefresh();
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Date Filter</h3>
        <button
          onClick={handleRefresh}
          className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-secondary text-secondary-foreground transition-colors hover:bg-secondary/80"
          aria-label="Refresh news data"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span className="sr-only">Refresh</span>
        </button>
      </div>
      
      <div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {format(displayDate, "PPP")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={displayDate}
              onSelect={handleDateChange}
              initialFocus
              required
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default DateFilter;
