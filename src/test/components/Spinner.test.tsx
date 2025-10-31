import { describe, it, expect } from 'vitest'
import { render, screen } from '../utils'
import Spinner from '../../../components/Spinner'

describe('Spinner', () => {
  it('renders spinner correctly', () => {
    render(<Spinner />)
    
    // Should render loading status
    const spinner = screen.getByRole('status')
    expect(spinner).toBeInTheDocument()
    expect(spinner).toHaveClass('animate-spin')
  })

  it('has proper accessibility attributes', () => {
    render(<Spinner />)
    
    // Should have proper ARIA attributes
    const container = screen.getByRole('status').parentElement
    expect(container).toHaveAttribute('aria-live', 'polite')
    expect(container).toHaveAttribute('aria-busy', 'true')
  })

  it('displays loading text for screen readers', () => {
    render(<Spinner />)
    
    // Should have screen reader text
    const loadingText = screen.getByText('Loading...')
    expect(loadingText).toBeInTheDocument()
    expect(loadingText).toHaveClass('sr-only')
  })

  it('applies correct styling classes', () => {
    render(<Spinner />)
    
    const spinner = screen.getByRole('status')
    expect(spinner).toHaveClass(
      'w-12',
      'h-12',
      'rounded-full',
      'animate-spin',
      'border-4',
      'border-solid',
      'border-slate-800',
      'border-t-transparent',
      'dark:border-slate-200',
      'dark:border-t-transparent'
    )
  })

  it('has proper container layout', () => {
    render(<Spinner />)
    
    const container = screen.getByRole('status').parentElement
    expect(container).toHaveClass('flex', 'justify-center', 'items-center', 'py-20')
  })
})