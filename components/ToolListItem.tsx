import React from 'react';
import type { Tool } from '../types';

interface ToolListItemProps {
  tool: Tool;
  rank: number;
  isAdvancedMode: boolean;
}

const formatCount = (num: number): string => {
    if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    return num.toString();
};

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
    </svg>
);

const CheckIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>);
const XIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>);

const AdvancedInfo: React.FC<{ tool: Tool }> = ({ tool }) => (
    <div className="mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-800 text-xs space-y-1 text-neutral-600 dark:text-neutral-400">
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
);

const ToolListItem: React.FC<ToolListItemProps> = ({ tool, rank, isAdvancedMode }) => {
  return (
    <a
      href={tool.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors duration-200 group rounded-lg"
    >
        <div className="flex items-center space-x-4">
            <div className="flex-shrink-0 text-lg font-bold text-neutral-400 dark:text-neutral-500 w-8 text-center">{rank}.</div>
            <div className="flex-shrink-0 h-12 w-12 bg-neutral-100 dark:bg-neutral-800 overflow-hidden rounded-md">
                <img src={tool.imageUrl} alt={`${tool.name} thumbnail`} className="h-full w-full object-cover" loading="lazy" />
            </div>
            <div className="flex-grow min-w-0">
                <h3 className="font-semibold text-base truncate text-black dark:text-white group-hover:underline">{tool.name}</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 truncate">{tool.description}</p>
            </div>
            <div className="hidden sm:flex items-center flex-shrink-0 text-xs text-neutral-500 dark:text-neutral-400 space-x-4">
                    <div className="flex items-center space-x-1" title="Daily Visits">
                        <UserIcon />
                        <span>{formatCount(tool.popularity.daily)}/d</span>
                    </div>
                    <div className="flex items-center space-x-1" title="Weekly Visits">
                        <UserIcon />
                        <span>{formatCount(tool.popularity.weekly)}/w</span>
                    </div>
            </div>
        </div>
        {isAdvancedMode && <AdvancedInfo tool={tool} />}
    </a>
  );
};

export default ToolListItem;
