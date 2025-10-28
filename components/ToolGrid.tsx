import React from 'react';
import type { Tool, ViewMode } from '../types';
import ToolCard from './ToolCard';
import ToolListItem from './ToolListItem';
import Spinner from './Spinner';

interface ToolGridProps {
    tools: Tool[];
    viewMode: ViewMode;
    isAdvancedMode: boolean;
    loading: boolean;
}

const ToolGrid: React.FC<ToolGridProps> = ({ tools, viewMode, isAdvancedMode, loading }) => {
    if (loading) {
        return <Spinner />;
    }

    if (tools.length === 0) {
        return (
            <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center">
                <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-12 rounded-lg">
                    <h2 className="text-xl font-semibold text-black dark:text-white">No Tools Found</h2>
                    <p className="text-neutral-500 dark:text-neutral-400 mt-2">
                        Try adjusting your search or filter criteria.
                    </p>
                </div>
            </main>
        );
    }

    if (viewMode === 'list') {
        return (
            <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4">
                    {tools.map((tool, index) => (
                        <ToolListItem key={tool.id} tool={tool} rank={index + 1} isAdvancedMode={isAdvancedMode} />
                    ))}
                </div>
            </main>
        );
    }

    return (
        <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                {tools.map(tool => (
                    <ToolCard key={tool.id} tool={tool} viewMode={viewMode} isAdvancedMode={isAdvancedMode} />
                ))}
            </div>
        </main>
    );
};

export default ToolGrid;
