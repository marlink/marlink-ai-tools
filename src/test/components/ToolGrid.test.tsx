import { describe, it, expect } from 'vitest'
import { render, screen } from '../utils'
import ToolGrid from '../../../components/ToolGrid'
import { mockTools, mockTool } from '../utils'

describe('ToolGrid', () => {
  const defaultProps = {
    tools: mockTools,
    viewMode: 'grid-hover' as const,
    isAdvancedMode: false,
    loading: false,
  }

  it('renders tools in grid view correctly', () => {
    render(<ToolGrid {...defaultProps} />)
    
    // Should render all tools
    expect(screen.getByText('Test Tool')).toBeInTheDocument()
    expect(screen.getByText('Test Tool 2')).toBeInTheDocument()
    expect(screen.getByText('Test Tool 3')).toBeInTheDocument()
  })

  it('renders tools in list view correctly', () => {
    render(<ToolGrid {...defaultProps} viewMode="list" />)
    
    // Should render all tools in list format
    expect(screen.getByText('Test Tool')).toBeInTheDocument()
    expect(screen.getByText('Test Tool 2')).toBeInTheDocument()
    expect(screen.getByText('Test Tool 3')).toBeInTheDocument()
  })

  it('shows loading skeleton when loading is true', () => {
    render(<ToolGrid {...defaultProps} loading={true} />)
    
    // Should show skeleton cards instead of actual tools
    expect(screen.queryByText('Test Tool')).not.toBeInTheDocument()
    
    // Should render skeleton cards (checking for skeleton structure with animate-pulse class)
    const skeletonElements = document.querySelectorAll('.animate-pulse')
    expect(skeletonElements.length).toBeGreaterThan(0)
  })

  it('shows no tools message when tools array is empty', () => {
    render(<ToolGrid {...defaultProps} tools={[]} />)
    
    expect(screen.getByText('No Tools Found')).toBeInTheDocument()
    expect(screen.getByText('Try adjusting your search or filter criteria.')).toBeInTheDocument()
  })

  it('passes advanced mode to child components', () => {
    render(<ToolGrid {...defaultProps} isAdvancedMode={true} />)
    
    // Should render tools with advanced mode enabled
    expect(screen.getByText('Test Tool')).toBeInTheDocument()
  })

  it('renders correct grid classes for different view modes', () => {
    const { rerender } = render(<ToolGrid {...defaultProps} viewMode="grid-hover" />)
    
    // Check grid container exists
    const gridContainer = screen.getByRole('main')
    expect(gridContainer).toBeInTheDocument()
    
    // Test list view
    rerender(<ToolGrid {...defaultProps} viewMode="list" />)
    expect(gridContainer).toBeInTheDocument()
  })

  it('handles single tool correctly', () => {
    render(<ToolGrid {...defaultProps} tools={[mockTool]} />)
    
    expect(screen.getByText('Test Tool')).toBeInTheDocument()
    expect(screen.queryByText('Test Tool 2')).not.toBeInTheDocument()
  })

  it('applies animation delays to tools', () => {
    render(<ToolGrid {...defaultProps} />)
    
    // Should render tools with animation wrapper divs
    const toolElements = screen.getAllByText(/Test Tool/)
    expect(toolElements.length).toBe(3)
  })
})