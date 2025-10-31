import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '../utils'
import userEvent from '@testing-library/user-event'
import FilterBar from '../../../components/FilterBar'

describe('FilterBar', () => {
  const mockProps = {
    activeCategories: ['All'],
    onCategoryChange: vi.fn(),
    onClearCategories: vi.fn(),
    activeSort: 'Daily' as const,
    onSortChange: vi.fn(),
    searchQuery: '',
    onSearchChange: vi.fn(),
    viewMode: 'grid-hover' as const,
    onViewModeChange: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders search input correctly', () => {
    render(<FilterBar {...mockProps} />)
    
    const searchInput = screen.getByPlaceholderText('Search for any tool...')
    expect(searchInput).toBeInTheDocument()
    expect(searchInput).toHaveValue('')
  })

  it('renders category buttons correctly', () => {
    render(<FilterBar {...mockProps} />)
    
    // Check if all categories are rendered
    expect(screen.getByText('All')).toBeInTheDocument()
    expect(screen.getByText('Productivity')).toBeInTheDocument()
    expect(screen.getByText('Writing')).toBeInTheDocument()
    expect(screen.getByText('Creative')).toBeInTheDocument()
  })

  it('highlights active categories', () => {
    render(<FilterBar {...mockProps} activeCategories={["Productivity"]} />)
    
    const productivityButton = screen.getByText('Productivity')
    expect(productivityButton).toHaveClass('bg-slate-800', 'text-white')
  })

  it('calls onSearchChange when typing in search input', async () => {
    const user = userEvent.setup()
    render(<FilterBar {...mockProps} />)
    
    const searchInput = screen.getByPlaceholderText('Search for any tool...')
    await user.type(searchInput, 'test query')
    
    // Wait for debounce delay (300ms)
    await new Promise(resolve => setTimeout(resolve, 350))
    
    // Should be called after debounce delay
    expect(mockProps.onSearchChange).toHaveBeenCalledWith('test query')
  })

  it('calls onCategoryChange when category button is clicked', async () => {
    const user = userEvent.setup()
    render(<FilterBar {...mockProps} />)
    
    const creativeButton = screen.getByText('Creative')
    await user.click(creativeButton)
    
    expect(mockProps.onCategoryChange).toHaveBeenCalledWith('Creative')
  })

  it('renders view mode toggles', () => {
    render(<FilterBar {...mockProps} />)
    
    // Check for view mode buttons
    const gridHoverButton = screen.getByLabelText('Grid view with hover details')
    const gridVisibleButton = screen.getByLabelText('Grid view with visible details')
    const listButton = screen.getByLabelText('List view')
    
    expect(gridHoverButton).toBeInTheDocument()
    expect(gridVisibleButton).toBeInTheDocument()
    expect(listButton).toBeInTheDocument()
  })

  it('calls onViewModeChange when clicking view mode buttons', async () => {
    const user = userEvent.setup()
    render(<FilterBar {...mockProps} />)
    
    const listButton = screen.getByLabelText('List view')
    await user.click(listButton)
    
    expect(mockProps.onViewModeChange).toHaveBeenCalledWith('list')
  })

  it('shows sort options correctly', () => {
    render(<FilterBar {...mockProps} />)
    
    // Check if sort buttons are rendered
    expect(screen.getByText('Daily')).toBeInTheDocument()
    expect(screen.getByText('Weekly')).toBeInTheDocument()
    expect(screen.getByText('Monthly')).toBeInTheDocument()
  })

  it('highlights active sort option', () => {
    render(<FilterBar {...mockProps} activeSort="Weekly" />)
    
    const weeklyButton = screen.getByText('Weekly')
    expect(weeklyButton).toHaveClass('bg-slate-800', 'text-white')
  })

  it('calls onSortChange when sort option is clicked', async () => {
    const user = userEvent.setup()
    render(<FilterBar {...mockProps} />)
    
    const weeklyButton = screen.getByText('Weekly')
    await user.click(weeklyButton)
    
    expect(mockProps.onSortChange).toHaveBeenCalledWith('Weekly')
  })

  it('calls onCategoryChange when category button is clicked', async () => {
    const user = userEvent.setup()
    render(<FilterBar {...mockProps} />)
    
    const productivityButton = screen.getByText('Productivity')
    await user.click(productivityButton)
    
    expect(mockProps.onCategoryChange).toHaveBeenCalledWith('Productivity')
  })

  it('has proper accessibility attributes', () => {
    render(<FilterBar {...mockProps} />)
    
    // Check search input accessibility
    const searchInput = screen.getByPlaceholderText('Search for any tool...')
    expect(searchInput).toHaveAttribute('type', 'search')
    
    // Check sort options group
    const sortGroup = screen.getByRole('group', { name: 'Sort options' })
    expect(sortGroup).toBeInTheDocument()
    
    // Check category buttons have proper roles
    const categoryButtons = screen.getAllByRole('button')
    expect(categoryButtons.length).toBeGreaterThan(0)
  })
})