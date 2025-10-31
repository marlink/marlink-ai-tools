import React, { memo } from 'react';

interface SkeletonCardProps {
  viewMode: 'grid-hover' | 'grid-visible' | 'list';
}

const SkeletonCard: React.FC<SkeletonCardProps> = ({ viewMode }) => {
  if (viewMode === 'list') {
    return (
      <div className="animate-pulse bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 sm:p-6">
        <div className="flex items-start space-x-4">
          {/* Rank */}
          <div className="w-8 h-6 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
          
          {/* Image */}
          <div className="w-16 h-12 sm:w-20 sm:h-14 bg-neutral-200 dark:bg-neutral-700 rounded flex-shrink-0"></div>
          
          {/* Content */}
          <div className="flex-grow min-w-0">
            <div className="h-5 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-full mb-3"></div>
            <div className="flex space-x-2">
              <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded-full w-16"></div>
              <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded-full w-20"></div>
            </div>
          </div>
          
          {/* Stats */}
          <div className="hidden sm:flex flex-col space-y-2 text-right">
            <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-12"></div>
            <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-12"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-pulse bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
      {/* Image skeleton */}
      <div className="aspect-video bg-neutral-200 dark:bg-neutral-700"></div>
      
      {/* Content skeleton */}
      <div className="p-3 sm:p-4">
        <div className="h-5 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4 mb-3"></div>
        
        {viewMode === 'grid-visible' && (
          <div className="space-y-2 mb-3">
            <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-full"></div>
            <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-2/3"></div>
          </div>
        )}
        
        {/* Keywords skeleton */}
        <div className="flex space-x-2 mb-4">
          <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded-full w-16"></div>
          <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded-full w-20"></div>
        </div>
        
        {/* Stats skeleton */}
        <div className="flex justify-end space-x-4 pt-3 border-t border-neutral-200 dark:border-neutral-800">
          <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-12"></div>
          <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-12"></div>
        </div>
      </div>
    </div>
  );
};

export default memo(SkeletonCard);