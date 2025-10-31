import React, { memo, useState, useEffect, useCallback } from 'react';
import type { SortOption, ViewMode } from '../types';

const categories = ["All", "Productivity", "Writing", "Creative", "Developer", "Marketing", "Research", "Video", "Audio"];
const sortOptions: SortOption[] = ["Daily", "Weekly", "Monthly"];

interface FilterBarProps {
    activeCategories: string[];
    onCategoryChange: (category: string) => void;
    onClearCategories: () => void;
    activeSort: SortOption;
    onSortChange: (sortOption: SortOption) => void;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    viewMode: ViewMode;
    onViewModeChange: (mode: ViewMode) => void;
}

const DailyIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>);
const WeeklyIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>);
const MonthlyIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /><path d="M12 15h.01" /></svg>);

const GridIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>);
const GridDetailIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" /></svg>);
const ListIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>);


const icons: Record<SortOption, React.FC> = { Daily: DailyIcon, Weekly: WeeklyIcon, Monthly: MonthlyIcon };
const viewIcons: Record<ViewMode, React.FC> = { 'grid-hover': GridIcon, 'grid-visible': GridDetailIcon, list: ListIcon };

const FilterBar: React.FC<FilterBarProps> = ({ activeCategories, onCategoryChange, onClearCategories, activeSort, onSortChange, searchQuery, onSearchChange, viewMode, onViewModeChange }) => {
    const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
    const [isSearching, setIsSearching] = useState(false);
    
    const showClearButton = activeCategories.length > 1 || (activeCategories.length === 1 && activeCategories[0] !== 'All');

    // Debounced search implementation
    useEffect(() => {
        if (localSearchQuery !== searchQuery) {
            setIsSearching(true);
        }
        
        const timeoutId = setTimeout(() => {
            onSearchChange(localSearchQuery);
            setIsSearching(false);
        }, 300); // 300ms debounce delay

        return () => clearTimeout(timeoutId);
    }, [localSearchQuery, onSearchChange, searchQuery]);

    // Sync local state with prop changes
    useEffect(() => {
        setLocalSearchQuery(searchQuery);
    }, [searchQuery]);

    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalSearchQuery(e.target.value);
    }, []);

    const getButtonClasses = (isActive: boolean) => 
        `px-3 py-1.5 text-sm transition-all duration-300 ease-in-out flex items-center justify-center transform hover:scale-105 ${
            isActive 
            ? 'font-semibold text-white dark:text-black bg-slate-800 dark:bg-slate-200 shadow-md' 
            : 'text-neutral-500 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
        }`;
    
    const getViewButtonClasses = (isActive: boolean) => 
        `p-2 transition-colors duration-200 flex items-center justify-center ${
            isActive 
            ? 'text-white dark:text-black bg-slate-800 dark:bg-slate-200' 
            : 'text-neutral-400 hover:text-black dark:hover:text-white'
        }`;

    return (
        <div className="container mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8 animate-scale-in" style={{ animationDelay: '400ms' }}>
            <div className="flex flex-col items-center gap-y-4 sm:gap-y-6">
                <div 
                    className="flex items-center justify-center gap-x-1 sm:gap-x-2 border border-neutral-200 dark:border-neutral-800 p-1 rounded-full"
                    role="group"
                    aria-label="Sort options"
                >
                    {sortOptions.map(opt => {
                        const Icon = icons[opt];
                        return (
                            <button 
                                key={opt} 
                                onClick={() => onSortChange(opt)} 
                                className={`${getButtonClasses(activeSort === opt)} rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-black`}
                                aria-pressed={activeSort === opt}
                                aria-label={`Sort by ${opt.toLowerCase()} popularity`}
                            >
                                <Icon />
                                {opt}
                            </button>
                        );
                    })}
                </div>
                
                 <div className="w-full max-w-2xl flex flex-col sm:flex-row items-center gap-2 sm:gap-x-2">
                    <div className="flex-grow w-full sm:w-auto relative">
                        <label htmlFor="search-input" className="sr-only">
                            Search for AI tools
                        </label>
                         <input
                            id="search-input"
                            type="search"
                            value={localSearchQuery}
                            onChange={handleSearchChange}
                            placeholder="Search for any tool..."
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-10 text-sm bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-black focus:outline-none transition-all duration-300 ease-in-out hover:border-neutral-400 dark:hover:border-neutral-600 focus:shadow-lg rounded-lg"
                            aria-describedby="search-description"
                        />
                        {isSearching && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                <svg className="animate-spin h-4 w-4 text-neutral-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            </div>
                        )}
                        <div id="search-description" className="sr-only">
                            Search through {categories.length - 1} categories of AI tools
                        </div>
                    </div>
                    <div 
                        className="flex items-center bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 p-1 space-x-1 rounded-lg flex-shrink-0"
                        role="group"
                        aria-label="View mode options"
                    >
                        <button 
                            onClick={() => onViewModeChange('grid-hover')} 
                            className={`${getViewButtonClasses(viewMode === 'grid-hover')} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-black`}
                            aria-pressed={viewMode === 'grid-hover'}
                            aria-label="Grid view with hover details"
                        >
                            <GridIcon />
                        </button>
                        <button 
                            onClick={() => onViewModeChange('grid-visible')} 
                            className={`${getViewButtonClasses(viewMode === 'grid-visible')} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-black`}
                            aria-pressed={viewMode === 'grid-visible'}
                            aria-label="Grid view with visible details"
                        >
                            <GridDetailIcon />
                        </button>
                        <button 
                            onClick={() => onViewModeChange('list')} 
                            className={`${getViewButtonClasses(viewMode === 'list')} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-black`}
                            aria-pressed={viewMode === 'list'}
                            aria-label="List view"
                        >
                            <ListIcon />
                        </button>
                    </div>
                </div>
                
                <div 
                    className="flex flex-wrap items-center justify-center gap-x-2 sm:gap-x-4 gap-y-2"
                    role="group"
                    aria-label="Category filters"
                >
                    {categories.map(cat => (
                        <button 
                            key={cat} 
                            onClick={() => onCategoryChange(cat)} 
                            className={`${getButtonClasses(activeCategories.includes(cat))} border border-transparent hover:border-neutral-300 dark:hover:border-neutral-700 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-black`}
                            aria-pressed={activeCategories.includes(cat)}
                            aria-label={`Filter by ${cat} category`}
                        >
                            {cat}
                        </button>
                    ))}
                    {showClearButton && (
                        <button
                            onClick={onClearCategories}
                            className="px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-black rounded"
                            aria-label="Clear all category filters"
                        >
                            Clear
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default memo(FilterBar);
