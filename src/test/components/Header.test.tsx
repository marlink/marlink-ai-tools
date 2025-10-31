import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '../utils'
import userEvent from '@testing-library/user-event'
import Header from '../../../components/Header'
import { Theme } from '../../../types'

describe('Header', () => {
  const mockProps = {
    onOpenAdmin: vi.fn(),
    onOpenSubmitForm: vi.fn(),
    theme: Theme.Light,
    onThemeChange: vi.fn(),
    isAdvancedMode: false,
    onAdvancedModeChange: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the main title correctly', () => {
    render(<Header {...mockProps} />)
    
    expect(screen.getByText('Most visited AI tools')).toBeInTheDocument()
    expect(screen.getByText('by marceli.info')).toBeInTheDocument()
  })

  it('renders theme toggle button', () => {
    render(<Header {...mockProps} />)
    
    const themeButton = screen.getByLabelText('Switch to dark theme')
    expect(themeButton).toBeInTheDocument()
  })

  it('shows correct theme icon for light mode', () => {
    render(<Header {...mockProps} theme={Theme.Light} />)
    
    // In light mode, should show moon icon (for switching to dark)
    const themeButton = screen.getByLabelText('Switch to dark theme')
    expect(themeButton).toBeInTheDocument()
  })

  it('shows correct theme icon for dark mode', () => {
    render(<Header {...mockProps} theme={Theme.Dark} />)
    
    // In dark mode, should show sun icon (for switching to light)
    const themeButton = screen.getByLabelText('Switch to light theme')
    expect(themeButton).toBeInTheDocument()
  })

  it('calls onThemeChange when theme button is clicked', async () => {
    const user = userEvent.setup()
    render(<Header {...mockProps} />)
    
    const themeButton = screen.getByLabelText('Switch to dark theme')
    await user.click(themeButton)
    
    expect(mockProps.onThemeChange).toHaveBeenCalledWith(Theme.Dark)
  })

  it('renders advanced mode toggle', () => {
    render(<Header {...mockProps} />)
    
    const advancedToggle = screen.getByText('Advanced Mode')
    expect(advancedToggle).toBeInTheDocument()
  })

  it('shows advanced mode as off when disabled', () => {
    render(<Header {...mockProps} isAdvancedMode={false} />)
    
    expect(screen.getByText('Advanced Mode')).toBeInTheDocument()
    const toggle = screen.getByRole('switch')
    expect(toggle).toHaveAttribute('aria-checked', 'false')
  })

  it('shows advanced mode as on when enabled', () => {
    render(<Header {...mockProps} isAdvancedMode={true} />)
    
    expect(screen.getByText('Advanced Mode')).toBeInTheDocument()
    const toggle = screen.getByRole('switch')
    expect(toggle).toHaveAttribute('aria-checked', 'true')
  })

  it('calls onAdvancedModeChange when advanced mode button is clicked', async () => {
    const user = userEvent.setup()
    render(<Header {...mockProps} />)
    
    const advancedToggle = screen.getByRole('switch')
    await user.click(advancedToggle)
    
    expect(mockProps.onAdvancedModeChange).toHaveBeenCalledWith(true)
  })

  it('renders admin button', () => {
    render(<Header {...mockProps} />)
    
    const adminButton = screen.getByText('Admin')
    expect(adminButton).toBeInTheDocument()
  })

  it('renders submit tool button', () => {
    render(<Header {...mockProps} />)
    
    const submitButton = screen.getByText('Submit a Tool')
    expect(submitButton).toBeInTheDocument()
  })

  it('calls onOpenAdmin when admin button is clicked', async () => {
    const user = userEvent.setup()
    render(<Header {...mockProps} />)
    
    const adminButton = screen.getByText('Admin')
    await user.click(adminButton)
    
    expect(mockProps.onOpenAdmin).toHaveBeenCalledTimes(1)
  })

  it('calls onOpenSubmitForm when submit tool button is clicked', async () => {
    const user = userEvent.setup()
    render(<Header {...mockProps} />)
    
    const submitButton = screen.getByText('Submit a Tool')
    await user.click(submitButton)
    
    expect(mockProps.onOpenSubmitForm).toHaveBeenCalledTimes(1)
  })

  it('has proper responsive layout', () => {
    render(<Header {...mockProps} />)
    
    const header = screen.getByRole('banner')
    expect(header).toHaveClass('bg-white', 'dark:bg-black')
  })

  it('has proper accessibility attributes', () => {
    render(<Header {...mockProps} />)
    
    const header = screen.getByRole('banner')
    expect(header).toBeInTheDocument()
    
    const themeButton = screen.getByLabelText('Switch to dark theme')
    expect(themeButton).toBeInTheDocument()
    
    const advancedToggle = screen.getByRole('switch')
    expect(advancedToggle).toBeInTheDocument()
    
    const adminButton = screen.getByText('Admin')
    expect(adminButton).toBeInTheDocument()
  })

  it('applies smooth transitions to interactive elements', () => {
    render(<Header {...mockProps} />)
    
    const themeButton = screen.getByLabelText('Switch to dark theme')
    expect(themeButton).toHaveClass('transition-all')
    
    const advancedToggle = screen.getByRole('switch')
    expect(advancedToggle).toHaveClass('transition-colors')
    
    const adminButton = screen.getByText('Admin')
    expect(adminButton).toHaveClass('transition-all')
  })
})