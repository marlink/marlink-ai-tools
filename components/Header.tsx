import React from 'react';
import { Theme } from '../types';

interface HeaderProps {
    onOpenAdmin: () => void;
    onOpenSubmitForm: () => void;
    theme: Theme;
    onThemeChange: (theme: Theme) => void;
    isAdvancedMode: boolean;
    onAdvancedModeChange: (isAdvanced: boolean) => void;
}

const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);

const MoonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
);

const Header: React.FC<HeaderProps> = ({ onOpenAdmin, onOpenSubmitForm, theme, onThemeChange, isAdvancedMode, onAdvancedModeChange }) => {
    const toggleTheme = () => {
        console.log('Header: toggleTheme called, current theme:', theme);
        const newTheme = theme === Theme.Light ? Theme.Dark : Theme.Light;
        console.log('Header: switching to theme:', newTheme);
        onThemeChange(newTheme);
    };

    console.log('Header: rendering with theme:', theme, 'and classes:', 'sticky top-0 z-40 w-full backdrop-blur flex-none transition-colors duration-500 lg:z-50 lg:border-b lg:border-neutral-200/80 dark:lg:border-neutral-800/80 bg-white dark:bg-black');
    return (
        <header className="sticky top-0 z-40 w-full backdrop-blur flex-none transition-colors duration-500 lg:z-50 lg:border-b lg:border-neutral-200/80 dark:lg:border-neutral-800/80 bg-white dark:bg-black">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-3">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-black dark:text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m12 3-1.9 1.9a10 10 0 0 0-7 14.1 10 10 0 0 0 17.8 0 10 10 0 0 0-7-14.1Z"></path>
                            <path d="M12 21a7.5 7.5 0 0 0 7.5-7.5c0-2.5-1.5-4.5-3-5.5"></path>
                            <path d="m12 3 1.9 1.9A10 10 0 0 1 21 19a10 10 0 0 1-17.9 0 10 10 0 0 1 7-14.1Z"></path>
                        </svg>
                        <div>
                             <h1 className="text-xl font-bold tracking-tighter text-black dark:text-white">
                                Most visited AI tools
                            </h1>
                            <a href="https://marceli.info" target="_blank" rel="noopener noreferrer" className="text-xs text-black dark:text-white hover:underline">
                                by marceli.info
                            </a>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                         <div className="flex items-center space-x-2">
                            <span className="text-xs font-medium text-black dark:text-white">Advanced Mode</span>
                            <button
                                onClick={() => onAdvancedModeChange(!isAdvancedMode)}
                                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${isAdvancedMode ? 'bg-black dark:bg-white' : 'bg-neutral-300 dark:bg-neutral-700'}`}
                            >
                                <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white dark:bg-black transition-transform ${isAdvancedMode ? 'translate-x-5' : 'translate-x-1'}`} />
                            </button>
                        </div>
                        <div className="w-px h-6 bg-neutral-200 dark:bg-neutral-800 hidden sm:block"></div>
                        <button 
                            onClick={onOpenSubmitForm}
                            className="px-4 py-2 text-sm font-medium border border-black dark:border-white text-black dark:text-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-colors duration-300 hidden sm:inline-flex"
                        >
                           Submit a Tool
                        </button>
                        <button 
                            onClick={onOpenAdmin}
                            className="text-sm text-black dark:text-white hover:text-neutral-600 dark:hover:text-neutral-400 transition-colors"
                        >
                           Admin
                        </button>
                        <button
                            onClick={toggleTheme}
                            className="h-9 w-9 flex items-center justify-center border border-neutral-300 dark:border-neutral-700 text-black dark:text-white"
                            aria-label="Toggle theme"
                        >
                            {theme === Theme.Light ? <MoonIcon /> : <SunIcon />}
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;