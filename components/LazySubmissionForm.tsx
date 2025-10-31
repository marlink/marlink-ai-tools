import React, { lazy, Suspense } from 'react';

// Lazy load the SubmissionForm component
const SubmissionForm = lazy(() => import('./SubmissionForm'));

interface LazySubmissionFormProps {
    onClose: () => void;
    onSubmit: (url: string, contact: string) => void;
}

// Loading component for the submission form
const SubmissionFormSkeleton: React.FC = () => (
    <div className="fixed inset-0 bg-black/50 dark:bg-white/10 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 p-8 relative">
            <div className="animate-pulse">
                <div className="flex justify-between items-center mb-8">
                    <div className="h-8 bg-neutral-200 dark:bg-neutral-700 rounded w-48"></div>
                    <div className="h-6 w-6 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
                </div>
                <div className="space-y-6">
                    <div>
                        <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-24 mb-2"></div>
                        <div className="h-12 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
                    </div>
                    <div>
                        <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-32 mb-2"></div>
                        <div className="h-12 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
                    </div>
                    <div className="h-12 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
                </div>
            </div>
        </div>
    </div>
);

const LazySubmissionForm: React.FC<LazySubmissionFormProps> = (props) => {
    return (
        <Suspense fallback={<SubmissionFormSkeleton />}>
            <SubmissionForm {...props} />
        </Suspense>
    );
};

export default LazySubmissionForm;