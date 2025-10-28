import React from 'react';

const Hero = () => {
  return (
    <div className="bg-white dark:bg-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center py-16 sm:py-20 lg:py-24">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tighter text-black dark:text-white">
          Your Ultimate AI Tool Directory
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-neutral-600 dark:text-neutral-400">
          Explore a curated collection of over 100 of the best AI tools, ranked and reviewed. Find the perfect AI to boost your productivity, creativity, and more.
        </p>
      </div>
       <hr className="border-neutral-200 dark:border-neutral-800" />
    </div>
  );
};

export default Hero;
