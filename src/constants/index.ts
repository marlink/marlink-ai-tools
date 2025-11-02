import type { ViewMode, Theme, SortOption } from '../types';

// App Configuration
export const APP_CONFIG = {
  name: 'AI Tools Directory',
  version: '1.0.0',
  description: 'Comprehensive directory of AI tools and resources',
  author: 'AI Tools Team',
  repository: 'https://github.com/your-org/ai-tools-directory',
  maxToolsPerPage: 20,
  maxSearchResults: 100,
  debounceDelay: 300,
  animationDuration: 200,
  maxFileSize: 5 * 1024 * 1024, // 5MB
  supportedImageTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'],
} as const;

// Theme Configuration
export const THEME_CONFIG = {
  default: 'light' as Theme,
  storageKey: 'ai-tools-theme',
  transitions: {
    duration: '200ms',
    easing: 'ease-in-out',
  },
} as const;

// View Mode Configuration
export const VIEW_MODE_CONFIG = {
  default: 'grid-visible' as ViewMode,
  storageKey: 'ai-tools-view-mode',
  gridColumns: {
    mobile: 1,
    tablet: 2,
    desktop: 3,
    wide: 4,
  },
} as const;

// Filter Configuration
export const FILTER_CONFIG = {
  defaultCategory: 'All Categories',
  defaultPricing: 'All Pricing',
  defaultSortBy: 'Weekly' as SortOption,
  storageKey: 'ai-tools-filters',
} as const;

// Pricing Types
export const PRICING_TYPES = [
  'Free',
  'Freemium', 
  'Paid',
  'Open Source'
] as const;

// Sort Options
export const SORT_OPTIONS: readonly { value: SortOption; label: string }[] = [
  { value: 'Daily', label: 'Daily Popularity' },
  { value: 'Weekly', label: 'Weekly Popularity' },
  { value: 'Monthly', label: 'Monthly Popularity' },
] as const;

// Categories (will be dynamically generated from tools data)
export const DEFAULT_CATEGORIES = [
  'Conversational AI',
  'Image Generation',
  'Code Assistant',
  'Writing Assistant',
  'Content Creation',
  'Video & Multimedia',
  'Audio & Voice',
  'Search & Research',
  'Development Platform',
  'Presentation',
  '3D & AR/VR',
] as const;

// UI Constants
export const UI_CONSTANTS = {
  headerHeight: '64px',
  footerHeight: '80px',
  sidebarWidth: '280px',
  maxContentWidth: '1200px',
  borderRadius: {
    small: '4px',
    medium: '8px',
    large: '12px',
    xl: '16px',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
  breakpoints: {
    mobile: '640px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1280px',
  },
  zIndex: {
    dropdown: 1000,
    modal: 1050,
    tooltip: 1100,
    toast: 1200,
  },
} as const;

// Animation Constants
export const ANIMATIONS = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2 },
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3 },
  },
  slideDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
    transition: { duration: 0.3 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { duration: 0.2 },
  },
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  generic: 'An unexpected error occurred. Please try again.',
  network: 'Network error. Please check your connection and try again.',
  validation: 'Please check your input and try again.',
  notFound: 'The requested resource was not found.',
  unauthorized: 'You are not authorized to perform this action.',
  forbidden: 'Access to this resource is forbidden.',
  serverError: 'Server error. Please try again later.',
  timeout: 'Request timed out. Please try again.',
  offline: 'You appear to be offline. Please check your connection.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  toolAdded: 'Tool added successfully!',
  toolUpdated: 'Tool updated successfully!',
  toolDeleted: 'Tool deleted successfully!',
  submissionReceived: 'Thank you! Your submission has been received.',
  settingsSaved: 'Settings saved successfully!',
  dataSynced: 'Data synchronized successfully!',
} as const;

// API Configuration
export const API_CONFIG = {
  baseUrl: '/api',
  timeout: 10000,
  retryAttempts: 3,
  retryDelay: 1000,
  endpoints: {
    tools: '/tools',
    categories: '/categories',
    submissions: '/submissions',
    health: '/health',
  },
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  theme: THEME_CONFIG.storageKey,
  viewMode: VIEW_MODE_CONFIG.storageKey,
  filters: FILTER_CONFIG.storageKey,
  userPreferences: 'ai-tools-user-preferences',
  recentSearches: 'ai-tools-recent-searches',
  favoriteTools: 'ai-tools-favorites',
  lastVisit: 'ai-tools-last-visit',
} as const;

// Feature Flags
export const FEATURE_FLAGS = {
  enableAdvancedFilters: true,
  enableUserSubmissions: true,
  enableAdminPanel: true,
  enableAnalytics: false,
  enableOfflineMode: false,
  enableDarkMode: true,
  enableExport: true,
  enableFavorites: true,
} as const;

// Performance Configuration
export const PERFORMANCE_CONFIG = {
  virtualScrollThreshold: 50,
  imageLoadingThreshold: 10,
  searchDebounceMs: APP_CONFIG.debounceDelay,
  cacheTimeout: 5 * 60 * 1000, // 5 minutes
  maxCacheSize: 100,
} as const;

// Accessibility Configuration
export const A11Y_CONFIG = {
  announceDelay: 1000,
  focusDelay: 100,
  skipLinkTarget: '#main-content',
  landmarkRoles: {
    header: 'banner',
    nav: 'navigation',
    main: 'main',
    footer: 'contentinfo',
    aside: 'complementary',
  },
} as const;

// SEO Configuration
export const SEO_CONFIG = {
  defaultTitle: APP_CONFIG.name,
  titleTemplate: '%s | AI Tools Directory',
  defaultDescription: APP_CONFIG.description,
  defaultKeywords: [
    'AI tools',
    'artificial intelligence',
    'machine learning',
    'productivity',
    'automation',
    'directory',
  ],
  ogImage: '/og-image.png',
  twitterCard: 'summary_large_image',
} as const;