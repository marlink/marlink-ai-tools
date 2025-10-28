export interface Tool {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  category: string;
  url: string;
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
  Dark = 'dark',
}

export type SortOption = 'Daily' | 'Weekly' | 'Monthly';

export type ViewMode = 'grid-hover' | 'grid-visible' | 'list';