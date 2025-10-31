import React, { memo } from 'react';
import type { Tool, ViewMode } from '../types';

interface ToolCardProps {
  tool: Tool;
  viewMode: 'grid-hover' | 'grid-visible';
  isAdvancedMode: boolean;
  rank: number;
}

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
    </svg>
);

const CheckIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>);
const XIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>);


const formatCount = (num: number): string => {
    if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    return num.toString();
};

const AdvancedInfo: React.FC<{ tool: Tool }> = memo(({ tool }) => (
    <div className="mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-800 text-xs space-y-2 text-neutral-600 dark:text-neutral-400">
        <div className="flex justify-between items-center">
            <span className="font-medium">Free Tier/Trial:</span>
            <span className={`flex items-center font-medium ${tool.freeTier ? 'text-green-700 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}>
                {tool.freeTier ? <CheckIcon /> : <XIcon />}
                {tool.freeTier ? 'Yes' : 'No'}
            </span>
        </div>
        <div className="flex justify-between items-center">
            <span className="font-medium">Starts From:</span>
            <span className="font-semibold text-black dark:text-white">
                {tool.monthlyCost === 0 ? 'Free' : tool.monthlyCost ? `$${tool.monthlyCost}/mo` : 'Enterprise'}
            </span>
        </div>
        <div className="pt-1">
            <p><span className="font-medium">Notes:</span> {tool.notes}</p>
        </div>
    </div>
));

const ToolCard: React.FC<ToolCardProps> = ({ tool, viewMode, isAdvancedMode, rank }) => {
  return (
    <article
      className="group flex flex-col overflow-hidden bg-white dark:bg-neutral-900 transition-all duration-300 ease-in-out hover:shadow-xl hover:shadow-neutral-200/50 dark:hover:shadow-neutral-800/50 hover:-translate-y-2 hover:scale-[1.02] border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 rounded-lg"
    >
      <a
        href={tool.url}
        target="_blank"
        rel="noopener noreferrer"
        className="touch-target flex flex-col h-full"
        aria-label={`Visit ${tool.name} website - ${tool.description}`}
        role="link"
      >
      <div className="relative aspect-video bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center overflow-hidden rounded-t-lg">
        <img
          src={tool.imageUrl}
          alt={`${tool.name} homepage screenshot`}
          className="h-full w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
          loading="lazy"
        />
        {/* Rank badge */}
        <div
          className="absolute top-2 left-2 bg-black/70 dark:bg-black/80 text-white text-xs font-bold px-2 py-1 rounded-full"
          aria-label={`Rank ${rank}`}
          role="status"
        >
          #{rank}
        </div>
        {/* Overlay with description, appears on hover only in grid-hover mode */}
        {viewMode === 'grid-hover' && (
             <div
               className="absolute inset-0 p-3 sm:p-4 bg-black/80 dark:bg-black/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out"
               aria-hidden="true"
             >
              <p className="text-center text-xs sm:text-sm text-neutral-100 leading-relaxed">
                {tool.description}
              </p>
            </div>
        )}
      </div>
      <div className="p-3 sm:p-4 border-t border-neutral-100 dark:border-neutral-800/50 flex-grow flex flex-col">
        <h3 className="font-semibold text-sm sm:text-base truncate text-black dark:text-white" role="heading" aria-level="3">{tool.name}</h3>
        
        {viewMode === 'grid-visible' && (
            <p
              className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-2 flex-grow line-clamp-2"
              aria-label="Tool description"
            >
                {tool.description}
            </p>
        )}

        <div className="mt-2 flex flex-wrap gap-1 sm:gap-1.5" role="list" aria-label="Tool keywords">
          {(tool.keywords || []).slice(0, 2).map(keyword => (
            <span
              key={keyword}
              className="px-1.5 sm:px-2 py-0.5 text-xs bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded-full truncate max-w-20 sm:max-w-none"
              role="listitem"
              aria-label={`Keyword: ${keyword}`}
            >
              {keyword}
            </span>
          ))}
        </div>
        
        {viewMode === 'grid-hover' && !isAdvancedMode && <div className="flex-grow"></div> /* Spacer */}

        {isAdvancedMode ? <AdvancedInfo tool={tool} /> : (
            <div
              className="mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-end text-xs text-neutral-500 dark:text-neutral-400 space-x-4"
              role="region"
              aria-label="Popularity metrics"
            >
                <div className="flex items-center space-x-1 touch-target" title="Daily Visits" aria-label={`${formatCount(tool.popularity.daily)} daily visits`}>
                    <UserIcon />
                    <span>{formatCount(tool.popularity.daily)}/d</span>
                </div>
                <div className="flex items-center space-x-1 touch-target" title="Weekly Visits" aria-label={`${formatCount(tool.popularity.weekly)} weekly visits`}>
                    <UserIcon />
                    <span>{formatCount(tool.popularity.weekly)}/w</span>
                </div>
            </div>
        )}
      </div>
    </a>
    </article>
  );
};

export default memo(ToolCard);
