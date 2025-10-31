import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '../utils'
import SubmissionForm from '../../../components/SubmissionForm'

describe('SubmissionForm', () => {
  const mockOnClose = vi.fn()
  const mockOnSubmit = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders form correctly', () => {
    render(<SubmissionForm onClose={mockOnClose} onSubmit={mockOnSubmit} />)
    
    // Should render form elements
    expect(screen.getByText('Submit a Tool')).toBeInTheDocument()
    expect(screen.getByText('Found a cool AI tool? Share it with the community!')).toBeInTheDocument()
    expect(screen.getByLabelText(/Tool URL/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Your Email or Phone/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Submit for Review' })).toBeInTheDocument()
  })

  it('handles close button click', () => {
    render(<SubmissionForm onClose={mockOnClose} onSubmit={mockOnSubmit} />)
    
    const closeButton = screen.getByLabelText('Close submission form')
    fireEvent.click(closeButton)
    
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('handles form submission with valid data', async () => {
    render(<SubmissionForm onClose={mockOnClose} onSubmit={mockOnSubmit} />)
    
    const urlInput = screen.getByLabelText(/Tool URL/)
    const contactInput = screen.getByLabelText(/Your Email or Phone/)
    const submitButton = screen.getByRole('button', { name: 'Submit for Review' })
    
    fireEvent.change(urlInput, { target: { value: 'https://example.com' } })
    fireEvent.change(contactInput, { target: { value: 'test@example.com' } })
    fireEvent.click(submitButton)
    
    expect(mockOnSubmit).toHaveBeenCalledWith('https://example.com', 'test@example.com')
  })

  it('shows success message after submission', async () => {
    render(<SubmissionForm onClose={mockOnClose} onSubmit={mockOnSubmit} />)
    
    const urlInput = screen.getByLabelText(/Tool URL/)
    const submitButton = screen.getByRole('button', { name: 'Submit for Review' })
    
    fireEvent.change(urlInput, { target: { value: 'https://example.com' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Thank You!')).toBeInTheDocument()
      expect(screen.getByText('Your submission has been received and is pending review.')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument()
    })
  })

  it('handles close button in success state', async () => {
    render(<SubmissionForm onClose={mockOnClose} onSubmit={mockOnSubmit} />)
    
    // Submit form first
    const urlInput = screen.getByLabelText(/Tool URL/)
    const submitButton = screen.getByRole('button', { name: 'Submit for Review' })
    
    fireEvent.change(urlInput, { target: { value: 'https://example.com' } })
    fireEvent.click(submitButton)
    
    // Wait for success state and click close
    await waitFor(() => {
      const closeButton = screen.getByRole('button', { name: 'Close' })
      fireEvent.click(closeButton)
    })
    
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('requires URL field', () => {
    render(<SubmissionForm onClose={mockOnClose} onSubmit={mockOnSubmit} />)
    
    const urlInput = screen.getByLabelText(/Tool URL/)
    expect(urlInput).toBeRequired()
  })

  it('does not require contact field', () => {
    render(<SubmissionForm onClose={mockOnClose} onSubmit={mockOnSubmit} />)
    
    const contactInput = screen.getByLabelText(/Your Email or Phone/)
    expect(contactInput).not.toBeRequired()
  })

  it('has proper form accessibility', () => {
    render(<SubmissionForm onClose={mockOnClose} onSubmit={mockOnSubmit} />)
    
    // Check form labels are properly associated
    const urlInput = screen.getByLabelText(/Tool URL/)
    const contactInput = screen.getByLabelText(/Your Email or Phone/)
    
    expect(urlInput).toHaveAttribute('id', 'submission-url')
    expect(contactInput).toHaveAttribute('id', 'contact')
  })

  it('applies correct styling classes', () => {
    render(<SubmissionForm onClose={mockOnClose} onSubmit={mockOnSubmit} />)
    
    // Check modal backdrop
    const backdrop = document.querySelector('.fixed.inset-0')
    expect(backdrop).toHaveClass('bg-black/50', 'dark:bg-white/10', 'backdrop-blur-sm', 'z-50')
  })
})