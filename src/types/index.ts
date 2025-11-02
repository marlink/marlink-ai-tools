export interface Tool {
  id: number;
  name: string;
  description: string;
  category: string;
  url: string;
  imageUrl: string;
  keywords: string[];
  popularity: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  freeTier: boolean;
  monthlyCost: number | null;
  notes: string;
}

export enum Theme {
  Light = 'light',
  Dark = 'dark'
}

export type ViewMode = 'grid-hover' | 'grid-visible' | 'list';
export type SortOption = 'Daily' | 'Weekly' | 'Monthly';

export interface AppState {
  theme: Theme;
  tools: Tool[];
  loading: boolean;
  isAdminOpen: boolean;
  isSubmitFormOpen: boolean;
  viewMode: ViewMode;
  activeCategories: string[];
  activeSort: SortOption;
  searchQuery: string;
  isAdvancedMode: boolean;
  error: string | null;
}

export interface ToolFormData {
  name: string;
  description: string;
  category: string;
  url: string;
  imageUrl: string;
  keywords: string[];
  freeTier: boolean;
  monthlyCost: number | null;
  notes: string;
}

export interface SubmissionFormData {
  url: string;
  contact: string;
}

export interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ToolCardProps extends ComponentProps {
  tool: Tool;
  viewMode: ViewMode;
  isAdvancedMode: boolean;
}

export interface FilterBarProps extends ComponentProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeCategories: string[];
  onCategoryChange: (category: string) => void;
  onClearCategories: () => void;
  categories: string[];
  toolCount: number;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  isAdvancedMode: boolean;
  onAdvancedModeToggle: () => void;
  activeSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export interface ToolGridProps extends ComponentProps {
  tools: Tool[];
  viewMode: ViewMode;
  loading: boolean;
  isAdvancedMode: boolean;
}

export interface HeroProps extends ComponentProps {
  toolCount: number;
}

export interface FeaturedToolsProps extends ComponentProps {
  tools: Tool[];
}

export interface HeaderProps extends ComponentProps {
  theme: Theme;
  onThemeToggle: () => void;
  onAdminClick: () => void;
  onSubmitClick: () => void;
  isAdvancedMode: boolean;
  onAdvancedModeToggle: () => void;
}

export interface FooterProps extends ComponentProps {
  // Footer specific props can be added here
}

export interface AdminPanelProps extends ComponentProps {
  tools: Tool[];
  onAddTool: (tool: ToolFormData) => void;
  onUpdateTool: (tool: Tool) => void;
  onDeleteTool: (toolId: number) => void;
  onClose: () => void;
}

export interface SubmissionFormProps extends ComponentProps {
  onSubmit: (submission: SubmissionFormData) => void;
  onClose: () => void;
}

// Error types
export interface AppError {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: AppError;
}

// Utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;