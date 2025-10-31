import { describe, it, expect, vi, beforeEach } from 'vitest'
import { logger } from '../../utils/logger'

describe('Logger', () => {
  beforeEach(() => {
    logger.clearLogs()
    vi.clearAllMocks()
  })

  it('should be a singleton', () => {
    const Logger = (logger as any).constructor
    const instance1 = Logger.getInstance()
    const instance2 = Logger.getInstance()
    expect(instance1).toBe(instance2)
  })

  it('should log debug messages', () => {
    logger.debug('Debug message', 'test-context', { test: true })
    const logs = logger.getLogs('debug')
    
    expect(logs).toHaveLength(1)
    expect(logs[0].level).toBe('debug')
    expect(logs[0].message).toBe('Debug message')
    expect(logs[0].context).toBe('test-context')
    expect(logs[0].data).toEqual({ test: true })
  })

  it('should log info messages', () => {
    logger.info('Info message', 'test-context')
    const logs = logger.getLogs('info')
    
    expect(logs).toHaveLength(1)
    expect(logs[0].level).toBe('info')
    expect(logs[0].message).toBe('Info message')
  })

  it('should log warn messages', () => {
    logger.warn('Warning message')
    const logs = logger.getLogs('warn')
    
    expect(logs).toHaveLength(1)
    expect(logs[0].level).toBe('warn')
    expect(logs[0].message).toBe('Warning message')
  })

  it('should log error messages', () => {
    logger.error('Error message')
    const logs = logger.getLogs('error')
    
    expect(logs).toHaveLength(1)
    expect(logs[0].level).toBe('error')
    expect(logs[0].message).toBe('Error message')
  })

  it('should filter logs by level', () => {
    logger.debug('Debug message')
    logger.info('Info message')
    logger.warn('Warning message')
    logger.error('Error message')

    expect(logger.getLogs('debug')).toHaveLength(1)
    expect(logger.getLogs('info')).toHaveLength(1)
    expect(logger.getLogs('warn')).toHaveLength(1)
    expect(logger.getLogs('error')).toHaveLength(1)
    expect(logger.getLogs()).toHaveLength(4)
  })

  it('should clear logs', () => {
    logger.info('Test message')
    expect(logger.getLogs()).toHaveLength(1)
    
    logger.clearLogs()
    expect(logger.getLogs()).toHaveLength(0)
  })

  it('should export logs as JSON string', () => {
    logger.info('Test message', 'context')
    const exported = logger.exportLogs()
    const parsed = JSON.parse(exported)
    
    expect(Array.isArray(parsed)).toBe(true)
    expect(parsed).toHaveLength(1)
    expect(parsed[0].message).toBe('Test message')
  })

  it('should log component lifecycle events', () => {
    logger.componentMount('TestComponent', { prop: 'value' })
    logger.componentUpdate('TestComponent', { old: 'prop' }, { new: 'prop' })
    logger.componentUnmount('TestComponent')

    const logs = logger.getLogs()
    expect(logs).toHaveLength(3)
    expect(logs[0].message).toContain('mounted')
    expect(logs[1].message).toContain('updated')
    expect(logs[2].message).toContain('unmounted')
  })

  it('should log user actions', () => {
    logger.userAction('button_click', { buttonId: 'submit' })
    const logs = logger.getLogs()
    
    expect(logs).toHaveLength(1)
    expect(logs[0].message).toContain('User action: button_click')
    expect(logs[0].data).toEqual({ buttonId: 'submit' })
  })

  it('should log API requests and responses', () => {
    logger.apiRequest('GET', '/api/tools', { query: 'test' })
    logger.apiResponse('GET', '/api/tools', 200, { tools: [] })

    const logs = logger.getLogs()
    expect(logs).toHaveLength(2)
    expect(logs[0].message).toContain('API Request: GET /api/tools')
    expect(logs[1].message).toContain('API Response: GET /api/tools - 200')
  })

  it('should log performance metrics', () => {
    logger.performanceMetric('page_load', 1500, 'ms')
    const logs = logger.getLogs()
    
    expect(logs).toHaveLength(1)
    expect(logs[0].message).toContain('Performance: page_load = 1500ms')
  })

  it('should handle timing operations', () => {
    // Mock console.time and console.timeEnd to verify they are called
    const consoleSpy = vi.spyOn(console, 'time')
    const consoleEndSpy = vi.spyOn(console, 'timeEnd')
    
    logger.time('test-operation')
    logger.timeEnd('test-operation')

    expect(consoleSpy).toHaveBeenCalledWith('test-operation')
    expect(consoleEndSpy).toHaveBeenCalledWith('test-operation')
    
    consoleSpy.mockRestore()
    consoleEndSpy.mockRestore()
  })

  it('should include timestamps in log entries', () => {
    logger.info('Test message')
    const logs = logger.getLogs()
    
    expect(logs[0].timestamp).toBeDefined()
    expect(new Date(logs[0].timestamp)).toBeInstanceOf(Date)
  })
})