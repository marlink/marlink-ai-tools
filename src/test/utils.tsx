import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import type { Tool } from '../../types'

// Mock tool data for testing
export const mockTool: Tool = {
  id: 'test-tool-1',
  name: 'Test Tool',
  description: 'A test tool for unit testing',
  url: 'https://example.com',
  imageUrl: 'https://example.com/image.jpg',
  category: 'Productivity',
  keywords: ['test', 'productivity', 'tool'],
  popularity: {
    daily: 1000,
    weekly: 7000,
    monthly: 30000,
  },
  freeTier: true,
  monthlyCost: 0,
  notes: 'This is a test tool',
}

export const mockTools: Tool[] = [
  mockTool,
  {
    ...mockTool,
    id: 'test-tool-2',
    name: 'Test Tool 2',
    description: 'Another test tool',
    category: 'Design',
    keywords: ['design', 'creative'],
    freeTier: false,
    monthlyCost: 29,
  },
  {
    ...mockTool,
    id: 'test-tool-3',
    name: 'Test Tool 3',
    description: 'Third test tool',
    category: 'Development',
    keywords: ['development', 'coding'],
    monthlyCost: null, // Enterprise pricing
  },
]

// Custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }

// Helper functions for testing
export const createMockTool = (overrides: Partial<Tool> = {}): Tool => ({
  ...mockTool,
  ...overrides,
})

export const waitForLoadingToFinish = () => 
  new Promise(resolve => setTimeout(resolve, 0))