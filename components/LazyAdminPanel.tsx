import React, { lazy, Suspense } from 'react';
import type { Tool } from '../types';

// Lazy load the AdminPanel component
const AdminPanel = lazy(() => import('./AdminPanel'));

interface LazyAdminPanelProps {
    onClose: () => void;
    onAddTool: (newTool: Omit<Tool, 'id'>) => void;
    toolCount: number;
    tools: Tool[];
    onUpdateTool: (updatedTool: Tool) => void;
}

// Loading component for the admin panel
const AdminPanelSkeleton: React.FC = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-neutral-900 p-8 rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto mx-4">
            <div className="animate-pulse">
                <div className="flex justify-between items-center mb-6">
                    <div className="h-8 bg-neutral-200 dark:bg-neutral-700 rounded w-48"></div>
                    <div className="h-8 w-8 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
                </div>
                <div className="space-y-4">
                    <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4"></div>
                    <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2"></div>
                    <div className="h-32 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
                    <div className="flex space-x-4">
                        <div className="h-10 bg-neutral-200 dark:bg-neutral-700 rounded w-24"></div>
                        <div className="h-10 bg-neutral-200 dark:bg-neutral-700 rounded w-24"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const LazyAdminPanel: React.FC<LazyAdminPanelProps> = (props) => {
    return (
        <Suspense fallback={<AdminPanelSkeleton />}>
            <AdminPanel {...props} />
        </Suspense>
    );
};

export default LazyAdminPanel;