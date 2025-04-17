
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Moon, Sun, Menu, X, Crown, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface HeaderProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export function Header({ toggleSidebar, isSidebarOpen }: HeaderProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState<'en' | 'ko'>('en');
  const { toast } = useToast();
  
  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark');
    setIsDarkMode(!isDarkMode);
  };
  
  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'ko' : 'en';
    setLanguage(newLanguage);
    
    toast({
      title: newLanguage === 'en' ? 'Language Changed' : '언어가 변경됨',
      description: newLanguage === 'en' ? 'Switched to English' : '한국어로 전환됨',
    });
  };
  
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-lg transition-all">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <button 
            onClick={toggleSidebar}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:hidden"
          >
            {isSidebarOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle sidebar</span>
          </button>
          <NavLink to="/" className="flex items-center">
            <span className="text-xl font-semibold tracking-tight flex items-center">
              BIO
              <Crown 
                className="h-6 w-6 text-yellow-500 mx-0.5 drop-shadow-sm filter" 
                strokeWidth={1.5}
                fill="rgba(234, 179, 8, 0.2)"
              />
              ING
            </span>
          </NavLink>
        </div>
        
        <nav className="hidden md:flex items-center space-x-1 md:space-x-2 lg:space-x-6">
          <NavLink 
            to="/chat" 
            className={({ isActive }) => 
              cn(
                "px-4 py-2 text-sm font-medium rounded-full transition-colors",
                isActive 
                  ? "bg-primary text-primary-foreground" 
                  : "hover:bg-secondary"
              )
            }
          >
            Chat
          </NavLink>
          <NavLink 
            to="/stocks" 
            className={({ isActive }) => 
              cn(
                "px-4 py-2 text-sm font-medium rounded-full transition-colors",
                isActive 
                  ? "bg-primary text-primary-foreground" 
                  : "hover:bg-secondary"
              )
            }
          >
            Stocks
          </NavLink>
          <NavLink 
            to="/news" 
            className={({ isActive }) => 
              cn(
                "px-4 py-2 text-sm font-medium rounded-full transition-colors",
                isActive 
                  ? "bg-primary text-primary-foreground" 
                  : "hover:bg-secondary"
              )
            }
          >
            News
          </NavLink>
        </nav>
        
        <div className="flex items-center gap-2">
          <button
            onClick={toggleLanguage}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <Globe className="h-5 w-5" />
            <span className="sr-only">Toggle language</span>
          </button>
          
          <button
            onClick={toggleDarkMode}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle theme</span>
          </button>
        </div>
      </div>
      
      <nav className="md:hidden flex items-center justify-around py-2 border-t border-border/40">
        <NavLink 
          to="/chat" 
          className={({ isActive }) => 
            cn(
              "px-3 py-1.5 text-sm font-medium rounded-full transition-colors",
              isActive 
                ? "bg-primary text-primary-foreground" 
                : "hover:bg-secondary"
            )
          }
        >
          Chat
        </NavLink>
        <NavLink 
          to="/stocks" 
          className={({ isActive }) => 
            cn(
              "px-3 py-1.5 text-sm font-medium rounded-full transition-colors",
              isActive 
                ? "bg-primary text-primary-foreground" 
                : "hover:bg-secondary"
            )
          }
        >
          Stocks
        </NavLink>
        <NavLink 
          to="/news" 
          className={({ isActive }) => 
            cn(
              "px-3 py-1.5 text-sm font-medium rounded-full transition-colors",
              isActive 
                ? "bg-primary text-primary-foreground" 
                : "hover:bg-secondary"
            )
          }
        >
          News
        </NavLink>
      </nav>
    </header>
  );
}

export default Header;
