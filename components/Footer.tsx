import React from 'react';

const Footer: React.FC = () => {
  console.log('Footer: rendering with classes:', 'w-full bg-white dark:bg-black text-black dark:text-white py-8');
  return (
    <footer className="w-full bg-white dark:bg-black text-black dark:text-white py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <a
            href="/"
            className="text-lg font-semibold hover:text-neutral-600 dark:hover:text-neutral-400 transition-colors"
          >
            Back to Marlink AI Tools
          </a>
          <div className="flex flex-wrap justify-center space-x-6 text-sm">
            <span>Best AI tools</span>
            <span>Most popular tools</span>
            <span>Marlink tools</span>
          </div>
          <p className="text-xs text-neutral-600 dark:text-neutral-400">
            Designed by Design System <a href="https://marceli.info" target="_blank" rel="noopener noreferrer" className="hover:text-black dark:hover:text-white">https://marceli.info</a> 2025
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;