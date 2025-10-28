import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-black text-white py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <a
            href="/"
            className="text-lg font-semibold hover:text-neutral-300 transition-colors"
          >
            Back to Marlink AI Tools
          </a>
          <div className="flex flex-wrap justify-center space-x-6 text-sm">
            <span>Best AI tools</span>
            <span>Most popular tools</span>
            <span>Marlink tools</span>
          </div>
          <p className="text-xs text-neutral-400">
            Designed by Design System <a href="https://marceli.info" target="_blank" rel="noopener noreferrer" className="hover:text-white">https://marceli.info</a> 2025
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;