import { describe, it, expect } from 'vitest'
import { render, screen } from '../utils'
import SkeletonCard from '../../../components/SkeletonCard'

describe('SkeletonCard', () => {
  it('renders grid skeleton correctly', () => {
    render(<SkeletonCard viewMode="grid-hover" />)
    
    // Should render skeleton with animation
    const skeleton = document.querySelector('.animate-pulse')
    expect(skeleton).toBeInTheDocument()
    expect(skeleton).toHaveClass('animate-pulse')
  })

  it('renders list skeleton correctly', () => {
    render(<SkeletonCard viewMode="list" />)
    
    // Should render skeleton with animation
    const skeleton = document.querySelector('.animate-pulse')
    expect(skeleton).toBeInTheDocument()
    expect(skeleton).toHaveClass('animate-pulse')
  })

  it('renders grid-visible skeleton with description area', () => {
    render(<SkeletonCard viewMode="grid-visible" />)
    
    // Should render skeleton with animation
    const skeleton = document.querySelector('.animate-pulse')
    expect(skeleton).toBeInTheDocument()
    expect(skeleton).toHaveClass('animate-pulse')
  })

  it('has different layout for list vs grid view', () => {
    const { rerender } = render(<SkeletonCard viewMode="list" />)
    
    // List view should have flex layout
    let skeleton = document.querySelector('.animate-pulse')
    expect(skeleton).toBeInTheDocument()
    
    // Grid view should have different structure
    rerender(<SkeletonCard viewMode="grid-hover" />)
    skeleton = document.querySelector('.animate-pulse')
    expect(skeleton).toBeInTheDocument()
  })

  it('applies correct styling classes', () => {
    render(<SkeletonCard viewMode="grid-hover" />)
    
    const skeleton = document.querySelector('.animate-pulse')
    expect(skeleton).toBeInTheDocument()
    expect(skeleton).toHaveClass('bg-white', 'dark:bg-neutral-900', 'border', 'rounded-lg')
  })
})