import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AppErrorHandler, errorHandler, handleAsync } from '../../utils/errorHandler'

describe('AppErrorHandler', () => {
  let handler: AppErrorHandler

  beforeEach(() => {
    handler = AppErrorHandler.getInstance()
    handler.clearErrorLog()
  })

  it('should be a singleton', () => {
    const instance1 = AppErrorHandler.getInstance()
    const instance2 = AppErrorHandler.getInstance()
    expect(instance1).toBe(instance2)
  })

  it('should log errors correctly', () => {
    const error = {
      message: 'Test error',
      code: 'TEST_ERROR' as const,
      details: { test: true }
    }

    handler.logError(error)
    const errorLog = handler.getErrorLog()
    
    expect(errorLog).toHaveLength(1)
    expect(errorLog[0]).toMatchObject(error)
  })

  it('should handle Error objects', () => {
    const error = new Error('Test error message')
    const appError = handler.handleError(error, 'test context')

    expect(appError.message).toBe('Test error message')
    expect(appError.code).toBe('GENERIC_ERROR')
    expect(appError.details?.context).toBe('test context')
  })

  it('should handle string errors', () => {
    const error = 'String error message'
    const appError = handler.handleError(error, 'test context')

    expect(appError.message).toBe('String error message')
    expect(appError.code).toBe('STRING_ERROR')
    expect(appError.details?.context).toBe('test context')
  })

  it('should handle unknown errors', () => {
    const error = { unknown: 'object' }
    const appError = handler.handleError(error, 'test context')

    expect(appError.message).toBe('An unknown error occurred')
    expect(appError.code).toBe('UNKNOWN_ERROR')
    expect(appError.details?.context).toBe('test context')
  })

  it('should create validation errors', () => {
    const error = handler.createValidationError('Invalid input', 'email')

    expect(error.message).toBe('Invalid input')
    expect(error.code).toBe('VALIDATION_ERROR')
    expect(error.details?.field).toBe('email')
  })

  it('should create network errors', () => {
    const error = handler.createNetworkError('Network failed', 500)

    expect(error.message).toBe('Network failed')
    expect(error.code).toBe('NETWORK_ERROR')
    expect(error.details?.status).toBe(500)
  })

  it('should create not found errors', () => {
    const error = handler.createNotFoundError('User', '123')

    expect(error.message).toBe('User not found with id: 123')
    expect(error.code).toBe('NOT_FOUND_ERROR')
    expect(error.details?.resource).toBe('User')
    expect(error.details?.id).toBe('123')
  })

  it('should clear error log', () => {
    const error = {
      message: 'Test error',
      code: 'TEST_ERROR' as const
    }

    handler.logError(error)
    expect(handler.getErrorLog()).toHaveLength(1)
    
    handler.clearErrorLog()
    expect(handler.getErrorLog()).toHaveLength(0)
  })
})

describe('handleAsync', () => {
  it('should handle successful async operations', async () => {
    const successFn = async () => 'success result'
    const result = await handleAsync(successFn, 'test context')

    expect(result.data).toBe('success result')
    expect(result.error).toBeNull()
  })

  it('should handle failed async operations', async () => {
    const errorFn = async () => {
      throw new Error('Async error')
    }
    const result = await handleAsync(errorFn, 'test context')

    expect(result.data).toBeNull()
    expect(result.error).toMatchObject({
      message: 'Async error',
      code: 'GENERIC_ERROR'
    })
  })
})

describe('errorHandler singleton', () => {
  it('should export a singleton instance', () => {
    expect(errorHandler).toBeInstanceOf(AppErrorHandler)
    expect(errorHandler).toBe(AppErrorHandler.getInstance())
  })
})