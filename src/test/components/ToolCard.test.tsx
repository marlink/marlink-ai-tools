import { describe, it, expect } from 'vitest'
import { render, screen } from '../utils'
import ToolCard from '../../../components/ToolCard'
import { mockTool } from '../utils'

describe('ToolCard', () => {
  const defaultProps = {
    tool: mockTool,
    rank: 1,
    viewMode: 'grid-visible' as const,
    isAdvancedMode: false,
  }

  it('renders tool information correctly', () => {
    render(<ToolCard {...defaultProps} />)
    
    // Check if tool name is rendered
    expect(screen.getByText('Test Tool')).toBeInTheDocument()
    
    // Check if tool description is rendered (in grid-visible mode)
    expect(screen.getByText('A test tool for unit testing')).toBeInTheDocument()
    
    // Check if rank is displayed
    expect(screen.getByText('#1')).toBeInTheDocument()
    
    // Check if image is rendered with correct alt text
    expect(screen.getByAltText('Test Tool homepage screenshot')).toBeInTheDocument()
    
    // Check if keywords are displayed (first 2)
    expect(screen.getByText('test')).toBeInTheDocument()
    expect(screen.getByText('productivity')).toBeInTheDocument()
  })

  it('renders popularity metrics correctly', () => {
    render(<ToolCard {...defaultProps} />)
    
    // Check daily visits
    expect(screen.getByText('1k/d')).toBeInTheDocument()
    
    // Check weekly visits
    expect(screen.getByText('7k/w')).toBeInTheDocument()
  })

  it('handles tools with no keywords gracefully', () => {
    const toolWithoutKeywords = { ...mockTool, keywords: undefined }
    
    expect(() => {
      render(<ToolCard {...defaultProps} tool={toolWithoutKeywords} />)
    }).not.toThrow()
  })

  it('renders correct link to tool website', () => {
    render(<ToolCard {...defaultProps} />)
    
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', 'https://example.com')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('has proper accessibility attributes', () => {
    render(<ToolCard {...defaultProps} />)
    
    // Check for proper ARIA labels
    expect(screen.getByLabelText('Visit Test Tool website - A test tool for unit testing')).toBeInTheDocument()
    expect(screen.getByLabelText('Rank 1')).toBeInTheDocument()
  })
})