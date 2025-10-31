import { describe, it, expect } from 'vitest'
import { render, screen } from '../utils'
import Hero from '../../../components/Hero'

describe('Hero', () => {
  it('renders hero section correctly', () => {
    render(<Hero />)
    
    // Check main heading
    expect(screen.getByText('AI Tool Directory')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('AI Tool Directory')
    
    // Check description text
    expect(screen.getByText(/Discover and explore the best AI tools/)).toBeInTheDocument()
  })

  it('has proper semantic structure', () => {
    render(<Hero />)
    
    // Should be wrapped in a section element
    const section = document.querySelector('section')
    expect(section).toBeInTheDocument()
  })

  it('applies correct CSS classes for styling', () => {
    render(<Hero />)
    
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveClass('animate-slide-up')
    
    const description = screen.getByText(/Discover and explore the best AI tools/)
    expect(description).toHaveClass('animate-slide-up')
  })

  it('has responsive text sizing', () => {
    render(<Hero />)
    
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveClass('text-3xl', 'sm:text-4xl', 'lg:text-5xl', 'xl:text-6xl')
    
    const description = screen.getByText(/Discover and explore the best AI tools/)
    expect(description).toHaveClass('text-base', 'sm:text-lg', 'lg:text-xl')
  })
})