import React, { memo } from 'react';

const Hero: React.FC = () => {
    return (
        <section className="text-center py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-neutral-900 dark:text-neutral-100 mb-4 sm:mb-6 animate-slide-up">
                AI Tool Directory
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '200ms' }}>
                Discover and explore the best AI tools for your projects. From machine learning frameworks to productivity enhancers.
            </p>
        </section>
    );
};

export default memo(Hero);
