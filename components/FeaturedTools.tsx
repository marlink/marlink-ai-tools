import React, { memo } from 'react';
import type { Tool } from '../types';
import ToolCard from './ToolCard';
import Spinner from './Spinner';

interface FeaturedToolsProps {
    tools: Tool[];
    isAdvancedMode: boolean;
    loading: boolean;
}

const TrendingIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-7 sm:w-7 mr-2 text-black dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
);


const FeaturedTools: React.FC<FeaturedToolsProps> = ({ tools, isAdvancedMode, loading }) => {

    return (
        <section className="container mx-auto pt-12 px-4 sm:px-6 lg:px-8">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                     <h2 className="text-2xl font-bold tracking-tight text-black dark:text-white sm:text-3xl flex items-center">
                        <TrendingIcon />
                        Trending This Week
                    </h2>
                    <p className="mt-2 text-neutral-500 dark:text-neutral-400">
                        The most popular AI tools, updated daily based on user traffic.
                    </p>
                </div>
            </div>
            {loading ? <Spinner /> : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {tools.map(tool => (
                        <ToolCard key={`featured-${tool.id}`} tool={tool} viewMode="grid-hover" isAdvancedMode={isAdvancedMode} />
                    ))}
                </div>
            )}
            <hr className="my-12 border-neutral-200 dark:border-neutral-800" />
        </section>
    );
};

export default memo(FeaturedTools);
