import React, { memo } from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white dark:bg-black text-black dark:text-white py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <a
            href="/"
            className="text-lg font-semibold hover:text-neutral-600 dark:hover:text-neutral-400 transition-all duration-300 ease-in-out transform hover:scale-105 hover:underline"
          >
            Back to Marlink AI Tools
          </a>
          <div className="flex flex-wrap justify-center gap-x-4 sm:gap-x-6 gap-y-2 text-xs sm:text-sm">
            <span className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-all duration-300 ease-in-out transform hover:scale-105 cursor-pointer">Best AI tools</span>
            <span className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-all duration-300 ease-in-out transform hover:scale-105 cursor-pointer">Most popular tools</span>
            <span className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-all duration-300 ease-in-out transform hover:scale-105 cursor-pointer">Marlink tools</span>
          </div>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 px-4">
            Designed by Design System <a href="https://marceli.info" target="_blank" rel="noopener noreferrer" className="hover:text-black dark:hover:text-white break-all sm:break-normal transition-all duration-300 ease-in-out hover:underline">https://marceli.info</a> 2025
          </p>
        </div>
      </div>
    </footer>
  );
};

export default memo(Footer);