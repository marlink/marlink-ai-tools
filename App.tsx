import React, { useState, useEffect, useCallback, useMemo, Suspense } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import FeaturedTools from './components/FeaturedTools';
import FilterBar from './components/FilterBar';
import ToolGrid from './components/ToolGrid';
import Footer from './components/Footer';
import LazyAdminPanel from './components/LazyAdminPanel';
import LazySubmissionForm from './components/LazySubmissionForm';
import { Tool, Theme, ViewMode, SortOption, AppState } from './src/types';
import { initialTools, getFeaturedTools, searchTools, sortTools } from './src/data/tools';
import { errorHandler, withErrorBoundary } from './src/utils/errorHandler';
import { logger } from './src/utils/logger';
import { APP_CONFIG, THEME_CONFIG, STORAGE_KEYS, VIEW_MODE_CONFIG } from './src/constants';

function App() {
  // State management with proper typing
  const [appState, setAppState] = useState<AppState>({
    theme: Theme.Light,
    tools: [],
    loading: true,
    isAdminOpen: false,
    isSubmitFormOpen: false,
    viewMode: 'grid-hover',
    activeCategories: ['All'],
    activeSort: 'Weekly',
    searchQuery: '',
    isAdvancedMode: false,
    error: null
  });

  // Initialize app with error handling
  useEffect(() => {
    const initializeApp = async () => {
      try {
        logger.info('App: Initializing application');
        
        // Load theme from localStorage or system preference
        const savedTheme = localStorage.getItem(STORAGE_KEYS.theme) as Theme;
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = savedTheme || (prefersDark ? Theme.Dark : Theme.Light);
        
        // Load other preferences
        const savedViewMode = (localStorage.getItem(STORAGE_KEYS.viewMode) as ViewMode) || VIEW_MODE_CONFIG.default;
        const savedAdvancedMode = localStorage.getItem('ai-tools-advanced-mode') === 'true';
        
        setAppState(prev => ({
          ...prev,
          theme: initialTheme,
          viewMode: savedViewMode,
          isAdvancedMode: savedAdvancedMode,
          tools: initialTools,
          loading: false
        }));
        
        logger.info('App: Application initialized successfully');
      } catch (error) {
        logger.error('App: Failed to initialize application', 'App', error);
        errorHandler.handleError(error);
        setAppState(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to initialize application'
        }));
      }
    };

    initializeApp();
  }, []);

  // Event handlers with error handling
  const handleThemeChange = useCallback((theme: Theme) => {
    logger.info('App: Theme change requested', 'Theme', theme);
    setAppState(prev => ({ ...prev, theme }));
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Escape key to close modals
      if (event.key === 'Escape') {
        if (appState.isAdminOpen) {
          setAppState(prev => ({ ...prev, isAdminOpen: false }));
        } else if (appState.isSubmitFormOpen) {
          setAppState(prev => ({ ...prev, isSubmitFormOpen: false }));
        }
      }
      
      // Ctrl/Cmd + K to focus search
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
          searchInput.focus();
        }
      }
      
      // Ctrl/Cmd + Shift + T to toggle theme
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'T') {
        event.preventDefault();
        const newTheme = appState.theme === Theme.Light ? Theme.Dark : Theme.Light;
        handleThemeChange(newTheme);
      }
      
      // Ctrl/Cmd + Shift + A to toggle advanced mode
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'A') {
        event.preventDefault();
        setAppState(prev => ({ ...prev, isAdvancedMode: !prev.isAdvancedMode }));
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [appState.isAdminOpen, appState.isSubmitFormOpen, appState.theme, handleThemeChange]);

  // Theme effect with persistence
  useEffect(() => {
    logger.debug('App: Theme changed to', 'Theme', appState.theme);
    
    if (appState.theme === Theme.Dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    document.documentElement.style.setProperty('color-scheme', appState.theme);
    localStorage.setItem(STORAGE_KEYS.theme, appState.theme);
  }, [appState.theme]);

  // Persist view preferences
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.viewMode, appState.viewMode);
  }, [appState.viewMode]);

  useEffect(() => {
    localStorage.setItem('ai-tools-advanced-mode', appState.isAdvancedMode.toString());
  }, [appState.isAdvancedMode]);

  const handleCategoryChange = useCallback((category: string) => {
    logger.debug('App: Category change', 'Category', category);
    
    if (category === 'All') {
      setAppState(prev => ({ ...prev, activeCategories: ['All'] }));
    } else {
      setAppState(prev => {
        const otherCategories = prev.activeCategories.filter(c => c !== 'All');
        if (otherCategories.includes(category)) {
          const newCategories = otherCategories.filter(c => c !== category);
          return {
            ...prev,
            activeCategories: newCategories.length === 0 ? ['All'] : newCategories
          };
        } else {
          return {
            ...prev,
            activeCategories: [...otherCategories, category]
          };
        }
      });
    }
  }, []);

  const handleClearCategories = useCallback(() => {
    logger.debug('App: Clearing categories');
    setAppState(prev => ({ ...prev, activeCategories: ['All'] }));
  }, []);

  const handleAddTool = useCallback((newTool: Omit<Tool, 'id'>) => {
    try {
      logger.info('App: Adding new tool', 'Tool', newTool.name);
      
      setAppState(prev => {
        const toolWithId = { 
          ...newTool, 
          id: Math.max(...prev.tools.map(t => t.id), 0) + 1 
        };
        return {
          ...prev,
          tools: [toolWithId, ...prev.tools]
        };
      });
      
      logger.info('App: Tool added successfully');
    } catch (error) {
      logger.error('App: Failed to add tool', 'Tool', error);
      errorHandler.handleError(error);
    }
  }, []);

  const handleUpdateTool = useCallback((updatedTool: Tool) => {
    try {
      logger.info('App: Updating tool', 'Tool', updatedTool.name);
      
      setAppState(prev => ({
        ...prev,
        tools: prev.tools.map(tool => 
          tool.id === updatedTool.id ? updatedTool : tool
        )
      }));
      
      logger.info('App: Tool updated successfully');
    } catch (error) {
      logger.error('App: Failed to update tool', 'Tool', error);
      errorHandler.handleError(error);
    }
  }, []);

  const handleUserSubmit = useCallback((url: string, contact: string) => {
    try {
      logger.info('App: User submission received', 'Submission', { url, contact });
      // In a real app, this would be sent to a backend for review
      // For now, just log the submission
    } catch (error) {
      logger.error('App: Failed to handle user submission', 'Submission', error);
      errorHandler.handleError(error);
    }
  }, []);

  // Computed values with performance optimization
  const filteredAndSortedTools = useMemo(() => {
    try {
      let currentTools = [...appState.tools];

      // Apply search filter
      if (appState.searchQuery) {
        currentTools = searchTools(currentTools, appState.searchQuery);
      }

      // Apply category filter
      if (!appState.activeCategories.includes('All')) {
        currentTools = currentTools.filter(tool => 
          appState.activeCategories.includes(tool.category)
        );
      }

      // Apply sorting
      currentTools = sortTools(currentTools, appState.activeSort);

      return currentTools;
    } catch (error) {
      logger.error('App: Error filtering/sorting tools', 'Tools', error);
      errorHandler.handleError(error);
      return appState.tools;
    }
  }, [appState.tools, appState.searchQuery, appState.activeCategories, appState.activeSort]);

  const featuredTools = useMemo(() => {
    if (appState.loading) return [];
    return getFeaturedTools(appState.tools, 3);
  }, [appState.tools, appState.loading]);

  // Error boundary fallback
  if (appState.error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50 dark:bg-red-900">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
            Application Error
          </h1>
          <p className="text-red-500 dark:text-red-300 mb-4">
            {appState.error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Reload Application
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-black min-h-screen font-sans text-neutral-800 dark:text-neutral-200 transition-colors duration-300">
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Skip to main content
      </a>
      
      <Header
        theme={appState.theme}
        onThemeChange={handleThemeChange}
        onOpenAdmin={() => setAppState(prev => ({ ...prev, isAdminOpen: true }))}
        onOpenSubmitForm={() => setAppState(prev => ({ ...prev, isSubmitFormOpen: true }))}
        isAdvancedMode={appState.isAdvancedMode}
        onAdvancedModeChange={(isAdvanced) => 
          setAppState(prev => ({ ...prev, isAdvancedMode: isAdvanced }))
        }
      />
      
      <Hero />
      
      <main id="main-content" role="main">
        <FeaturedTools 
          tools={featuredTools} 
          isAdvancedMode={appState.isAdvancedMode} 
          loading={appState.loading} 
        />

        <FilterBar
          activeCategories={appState.activeCategories}
          onCategoryChange={handleCategoryChange}
          onClearCategories={handleClearCategories}
          activeSort={appState.activeSort}
          onSortChange={(sort) => setAppState(prev => ({ ...prev, activeSort: sort }))}
          searchQuery={appState.searchQuery}
          onSearchChange={(query) => setAppState(prev => ({ ...prev, searchQuery: query }))}
          viewMode={appState.viewMode}
          onViewModeChange={(mode) => setAppState(prev => ({ ...prev, viewMode: mode }))}
        />

        <ToolGrid 
          tools={filteredAndSortedTools} 
          viewMode={appState.viewMode} 
          isAdvancedMode={appState.isAdvancedMode} 
          loading={appState.loading} 
        />
      </main>

      <Footer />

      {appState.isAdminOpen && (
        <Suspense fallback={<div className="fixed inset-0 bg-black/50 z-50" />}>
          <LazyAdminPanel
            onClose={() => setAppState(prev => ({ ...prev, isAdminOpen: false }))}
            onAddTool={handleAddTool}
            onUpdateTool={handleUpdateTool}
            tools={appState.tools}
            toolCount={appState.tools.length}
          />
        </Suspense>
      )}

      {appState.isSubmitFormOpen && (
        <Suspense fallback={<div className="fixed inset-0 bg-black/50 z-50" />}>
          <LazySubmissionForm
            onClose={() => setAppState(prev => ({ ...prev, isSubmitFormOpen: false }))}
            onSubmit={handleUserSubmit}
          />
        </Suspense>
      )}
    </div>
  );
}

export default withErrorBoundary(App);
