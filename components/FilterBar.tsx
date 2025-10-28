import React from 'react';
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
    
    const showClearButton = activeCategories.length > 1 || (activeCategories.length === 1 && activeCategories[0] !== 'All');

    const getButtonClasses = (isActive: boolean) => 
        `px-3 py-1.5 text-sm transition-colors duration-200 flex items-center justify-center ${
            isActive 
            ? 'font-semibold text-white dark:text-black bg-slate-800 dark:bg-slate-200' 
            : 'text-neutral-500 hover:text-black dark:hover:text-white'
        }`;
    
    const getViewButtonClasses = (isActive: boolean) => 
        `p-2 transition-colors duration-200 flex items-center justify-center ${
            isActive 
            ? 'text-white dark:text-black bg-slate-800 dark:bg-slate-200' 
            : 'text-neutral-400 hover:text-black dark:hover:text-white'
        }`;

    return (
        <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center gap-y-6">
                <div className="flex items-center justify-center gap-x-1 sm:gap-x-2 border border-neutral-200 dark:border-neutral-800 p-1 rounded-full">
                    {sortOptions.map(opt => {
                        const Icon = icons[opt];
                        return (
                            <button key={opt} onClick={() => onSortChange(opt)} className={`${getButtonClasses(activeSort === opt)} rounded-full`}>
                                <Icon />
                                {opt}
                            </button>
                        );
                    })}
                </div>
                
                 <div className="w-full max-w-2xl flex items-center gap-x-2">
                    <div className="flex-grow">
                         <input
                            type="search"
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            placeholder="Search for any tool..."
                            className="w-full px-4 py-3 text-sm bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 focus:ring-2 focus:ring-slate-800 dark:focus:ring-slate-200 focus:outline-none transition-all duration-200 rounded-lg"
                            aria-label="Search for tools"
                        />
                    </div>
                    <div className="flex items-center bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 p-1 space-x-1 rounded-lg">
                        <button title="Grid View (Hover)" onClick={() => onViewModeChange('grid-hover')} className={`${getViewButtonClasses(viewMode === 'grid-hover')} rounded-md`}><GridIcon /></button>
                        <button title="Grid View (Detailed)" onClick={() => onViewModeChange('grid-visible')} className={`${getViewButtonClasses(viewMode === 'grid-visible')} rounded-md`}><GridDetailIcon /></button>
                        <button title="List View" onClick={() => onViewModeChange('list')} className={`${getViewButtonClasses(viewMode === 'list')} rounded-md`}><ListIcon /></button>
                    </div>
                </div>
                
                <div className="flex flex-wrap items-center justify-center gap-x-2 sm:gap-x-4 gap-y-2">
                    {categories.map(cat => (
                        <button key={cat} onClick={() => onCategoryChange(cat)} className={`${getButtonClasses(activeCategories.includes(cat))} border border-transparent hover:border-neutral-300 dark:hover:border-neutral-700 rounded-full`}>
                            {cat}
                        </button>
                    ))}
                    {showClearButton && (
                        <button
                            onClick={onClearCategories}
                            className="px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 hover:underline"
                        >
                            Clear
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FilterBar;
