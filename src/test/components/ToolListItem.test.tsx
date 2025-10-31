import { describe, it, expect } from 'vitest'
import { render, screen } from '../utils'
import ToolListItem from '../../../components/ToolListItem'
import { mockTool, createMockTool } from '../utils'

describe('ToolListItem', () => {
  const defaultProps = {
    tool: mockTool,
    rank: 1,
    isAdvancedMode: false,
  }

  it('renders tool information correctly', () => {
    render(<ToolListItem {...defaultProps} />)
    
    // Check if tool name is rendered
    expect(screen.getByText('Test Tool')).toBeInTheDocument()
    
    // Check if tool description is rendered
    expect(screen.getByText('A test tool for unit testing')).toBeInTheDocument()
    
    // Check if rank is displayed
    expect(screen.getByText('1.')).toBeInTheDocument()
    
    // Check if image is rendered with correct alt text
    expect(screen.getByAltText('Test Tool thumbnail')).toBeInTheDocument()
  })

  it('renders popularity metrics correctly', () => {
    render(<ToolListItem {...defaultProps} />)
    
    // Check daily visits
    expect(screen.getByText('1k/d')).toBeInTheDocument()
    
    // Check weekly visits
    expect(screen.getByText('7k/w')).toBeInTheDocument()
  })

  it('renders correct link to tool website', () => {
    render(<ToolListItem {...defaultProps} />)
    
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', 'https://example.com')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('shows advanced info when isAdvancedMode is true', () => {
    render(<ToolListItem {...defaultProps} isAdvancedMode={true} />)
    
    // Check for advanced mode elements
    expect(screen.getByText('Free Tier/Trial:')).toBeInTheDocument()
    expect(screen.getByText('Starts From:')).toBeInTheDocument()
    expect(screen.getByText('Notes:')).toBeInTheDocument()
    expect(screen.getByText('This is a test tool')).toBeInTheDocument()
  })

  it('does not show advanced info when isAdvancedMode is false', () => {
    render(<ToolListItem {...defaultProps} isAdvancedMode={false} />)
    
    // Advanced mode elements should not be present
    expect(screen.queryByText('Free Tier/Trial:')).not.toBeInTheDocument()
    expect(screen.queryByText('Starts From:')).not.toBeInTheDocument()
    expect(screen.queryByText('Notes:')).not.toBeInTheDocument()
  })

  it('displays free tier correctly', () => {
    const freeTool = createMockTool({ freeTier: true })
    render(<ToolListItem {...defaultProps} tool={freeTool} isAdvancedMode={true} />)
    
    expect(screen.getByText('Yes')).toBeInTheDocument()
  })

  it('displays paid tier correctly', () => {
    const paidTool = createMockTool({ freeTier: false })
    render(<ToolListItem {...defaultProps} tool={paidTool} isAdvancedMode={true} />)
    
    expect(screen.getByText('No')).toBeInTheDocument()
  })

  it('displays pricing correctly for free tools', () => {
    const freeTool = createMockTool({ monthlyCost: 0 })
    render(<ToolListItem {...defaultProps} tool={freeTool} isAdvancedMode={true} />)
    
    expect(screen.getByText('Free')).toBeInTheDocument()
  })

  it('displays pricing correctly for paid tools', () => {
    const paidTool = createMockTool({ monthlyCost: 29 })
    render(<ToolListItem {...defaultProps} tool={paidTool} isAdvancedMode={true} />)
    
    expect(screen.getByText('$29/mo')).toBeInTheDocument()
  })

  it('displays enterprise pricing correctly', () => {
    const enterpriseTool = createMockTool({ monthlyCost: null })
    render(<ToolListItem {...defaultProps} tool={enterpriseTool} isAdvancedMode={true} />)
    
    expect(screen.getByText('Enterprise')).toBeInTheDocument()
  })

  it('formats popularity numbers correctly', () => {
    const popularTool = createMockTool({
      popularity: {
        daily: 1500,
        weekly: 12000,
        monthly: 50000,
      }
    })
    render(<ToolListItem {...defaultProps} tool={popularTool} />)
    
    // Check formatted numbers
    expect(screen.getByText('1.5k/d')).toBeInTheDocument()
    expect(screen.getByText('12k/w')).toBeInTheDocument()
  })

  it('has proper accessibility attributes', () => {
    render(<ToolListItem {...defaultProps} />)
    
    // Check for proper ARIA labels
    expect(screen.getByLabelText('Visit Test Tool website - A test tool for unit testing')).toBeInTheDocument()
    expect(screen.getByLabelText('Rank 1')).toBeInTheDocument()
    expect(screen.getByLabelText('Test Tool logo')).toBeInTheDocument()
    
    // Check for proper roles
    expect(screen.getByRole('article')).toBeInTheDocument()
    expect(screen.getByRole('link')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument()
  })

  it('displays popularity metrics correctly', () => {
    render(<ToolListItem {...defaultProps} />)
    
    // The popularity metrics should be visible (weekly popularity)
    const metricsContainer = screen.getByText(/7k/)
    expect(metricsContainer).toBeInTheDocument()
  })
})