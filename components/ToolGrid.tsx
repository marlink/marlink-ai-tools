import React, { memo, useMemo } from 'react';
import type { Tool, ViewMode } from '../types';
import ToolCard from './ToolCard';
import ToolListItem from './ToolListItem';
import Spinner from './Spinner';
import SkeletonCard from './SkeletonCard';

interface ToolGridProps {
    tools: Tool[];
    viewMode: ViewMode;
    isAdvancedMode: boolean;
    loading: boolean;
}

const ToolGrid: React.FC<ToolGridProps> = ({ tools, viewMode, isAdvancedMode, loading }) => {
    // Memoize the grid columns calculation for better performance
    const gridColumns = useMemo(() => {
        if (viewMode === 'list') {
            return 'grid-cols-1 xl:grid-cols-2';
        }
        return 'grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6';
    }, [viewMode]);

    // Memoize the tools rendering to prevent unnecessary re-renders
    const renderedTools = useMemo(() => {
        if (viewMode === 'list') {
            return tools.map((tool, index) => (
                <ToolListItem 
                    key={tool.id} 
                    tool={tool} 
                    rank={index + 1} 
                    isAdvancedMode={isAdvancedMode} 
                />
            ));
        }
        
        return tools.map((tool, index) => (
            <ToolCard 
                key={tool.id} 
                tool={tool} 
                viewMode={viewMode} 
                isAdvancedMode={isAdvancedMode} 
                rank={index + 1} 
            />
        ));
    }, [tools, viewMode, isAdvancedMode]);

    if (loading) {
        return (
            <main className="container mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
                <div className={`grid ${gridColumns} gap-3 sm:gap-4 lg:gap-6 ${viewMode === 'list' ? 'gap-x-4 sm:gap-x-6 lg:gap-x-8 gap-y-3 sm:gap-y-4' : ''}`}>
                    {Array.from({ length: 12 }, (_, index) => (
                        <SkeletonCard key={index} viewMode={viewMode} />
                    ))}
                </div>
            </main>
        );
    }

    if (tools.length === 0) {
        return (
            <main className="container mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
                <div className="text-center py-8 sm:py-12 lg:py-16 animate-fade-in">
                    <div className="animate-scale-in" style={{ animationDelay: '200ms' }}>
                        <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2 sm:mb-4">
                            No Tools Found
                        </h2>
                        <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400">
                            Try adjusting your search or filter criteria.
                        </p>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="container mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
            <div className={`grid ${gridColumns} gap-3 sm:gap-4 lg:gap-6 ${viewMode === 'list' ? 'gap-x-4 sm:gap-x-6 lg:gap-x-8 gap-y-3 sm:gap-y-4' : ''}`}>
                {tools.map((tool, index) => (
                    <div
                        key={tool.id}
                        className="animate-fade-in"
                        style={{ animationDelay: `${index * 50}ms` }}
                    >
                        {viewMode === 'list' ? (
                            <ToolListItem
                                tool={tool}
                                rank={index + 1}
                                isAdvancedMode={isAdvancedMode}
                            />
                        ) : (
                            <ToolCard
                                tool={tool}
                                viewMode={viewMode}
                                isAdvancedMode={isAdvancedMode}
                            />
                        )}
                    </div>
                ))}
            </div>
        </main>
    );
};

export default memo(ToolGrid);
