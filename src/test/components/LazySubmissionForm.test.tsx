import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '../utils'
import LazySubmissionForm from '../../../components/LazySubmissionForm'

// Mock the SubmissionForm component to never resolve, so we can test the skeleton
vi.mock('../../../components/SubmissionForm', () => ({
  default: () => new Promise(() => {}) // Never resolves
}))

describe('LazySubmissionForm', () => {
  const mockProps = {
    onClose: vi.fn(),
    onSubmit: vi.fn()
  }

  it('renders loading skeleton', () => {
    render(<LazySubmissionForm {...mockProps} />)
    
    // Should show skeleton while loading
    const skeleton = document.querySelector('.animate-pulse')
    expect(skeleton).toBeInTheDocument()
  })

  it('skeleton has proper modal structure', () => {
    render(<LazySubmissionForm {...mockProps} />)
    
    // Check modal backdrop
    const backdrop = document.querySelector('.fixed.inset-0')
    expect(backdrop).toBeInTheDocument()
    expect(backdrop).toHaveClass('bg-black/50', 'dark:bg-white/10', 'backdrop-blur-sm', 'z-50')
  })

  it('skeleton has proper form structure', () => {
    render(<LazySubmissionForm {...mockProps} />)
    
    // Check skeleton content
    const skeleton = document.querySelector('.animate-pulse')
    expect(skeleton).toBeInTheDocument()
    
    // Check skeleton elements for form fields
    const skeletonElements = document.querySelectorAll('.bg-neutral-200')
    expect(skeletonElements.length).toBeGreaterThan(0)
  })

  it('skeleton has responsive design', () => {
    render(<LazySubmissionForm {...mockProps} />)
    
    const modal = document.querySelector('.max-w-lg')
    expect(modal).toBeInTheDocument()
    expect(modal).toHaveClass('w-full', 'bg-white', 'dark:bg-black', 'border', 'p-8', 'relative')
  })

  it('skeleton shows form field placeholders', () => {
    render(<LazySubmissionForm {...mockProps} />)
    
    // Check for form field skeleton structure
    const formSkeleton = document.querySelector('.space-y-6')
    expect(formSkeleton).toBeInTheDocument()
    
    // Should have multiple skeleton elements for form fields
    const fieldSkeletons = document.querySelectorAll('.h-12.bg-neutral-200')
    expect(fieldSkeletons.length).toBeGreaterThanOrEqual(2) // At least 2 form fields + submit button
  })
})