
import React from 'react';
import { Facebook, Instagram, Twitter, Linkedin, Mail, Copyright } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 py-12 px-4 md:px-6 lg:px-8 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">BioKing News</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Bringing you the latest news in healthcare, technology, and scientific breakthroughs.
          </p>
        </div>
        
        <div className="space-y-4">
          <h4 className="text-md font-semibold text-gray-700 dark:text-gray-200">Quick Links</h4>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li><a href="/news" className="hover:text-primary transition-colors">English News</a></li>
            <li><a href="/korean-news" className="hover:text-primary transition-colors">Korean News</a></li>
            <li><a href="/chat" className="hover:text-primary transition-colors">Research Chat</a></li>
            <li><a href="/stocks" className="hover:text-primary transition-colors">Stock Overview</a></li>
          </ul>
        </div>
        
        <div className="space-y-4">
          <h4 className="text-md font-semibold text-gray-700 dark:text-gray-200">Connect With Us</h4>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
              <Linkedin className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
              <Mail className="h-5 w-5" />
            </a>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-500 flex items-center">
            <Copyright className="h-4 w-4 mr-1" /> {currentYear} BioKing. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
