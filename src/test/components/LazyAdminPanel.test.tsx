import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '../utils'
import LazyAdminPanel from '../../../components/LazyAdminPanel'

// Mock the AdminPanel component to never resolve, so we can test the skeleton
vi.mock('../../../components/AdminPanel', () => ({
  default: () => new Promise(() => {}) // Never resolves
}))

describe('LazyAdminPanel', () => {
  const mockProps = {
    onClose: vi.fn(),
    onAddTool: vi.fn(),
    onUpdateTool: vi.fn(),
    toolCount: 5,
    tools: []
  }

  it('renders loading skeleton', () => {
    render(<LazyAdminPanel {...mockProps} />)
    
    // Should show skeleton while loading
    const skeleton = document.querySelector('.animate-pulse')
    expect(skeleton).toBeInTheDocument()
  })

  it('skeleton has proper modal structure', () => {
    render(<LazyAdminPanel {...mockProps} />)
    
    // Check modal backdrop
    const backdrop = document.querySelector('.fixed.inset-0')
    expect(backdrop).toBeInTheDocument()
    expect(backdrop).toHaveClass('bg-black', 'bg-opacity-50', 'flex', 'items-center', 'justify-center', 'z-50')
  })

  it('skeleton has proper content structure', () => {
    render(<LazyAdminPanel {...mockProps} />)
    
    // Check skeleton content
    const skeleton = document.querySelector('.animate-pulse')
    expect(skeleton).toBeInTheDocument()
    
    // Check skeleton elements
    const skeletonElements = document.querySelectorAll('.bg-neutral-200')
    expect(skeletonElements.length).toBeGreaterThan(0)
  })

  it('skeleton has responsive design', () => {
    render(<LazyAdminPanel {...mockProps} />)
    
    const modal = document.querySelector('.max-w-4xl')
    expect(modal).toBeInTheDocument()
    expect(modal).toHaveClass('w-full', 'max-h-[90vh]', 'overflow-y-auto', 'mx-4')
  })
})