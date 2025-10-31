import { describe, it, expect } from 'vitest'
import { Validator } from '../../utils/validation'
import type { Tool, ToolFormData, SubmissionFormData } from '../../types'

describe('Validator', () => {
  describe('validateTool', () => {
    const validTool: Partial<Tool> = {
      name: 'Test Tool',
      description: 'A test tool for validation',
      category: 'Testing',
      url: 'https://example.com',
      keywords: ['test', 'validation'],
      popularity: {
        daily: 50,
        weekly: 100,
        monthly: 400
      }
    }

    it('should validate a valid tool', () => {
      const result = Validator.validateTool(validTool)
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should reject tool without name', () => {
      const invalidTool = { ...validTool, name: '' }
      const result = Validator.validateTool(invalidTool)
      
      expect(result.isValid).toBe(false)
      expect(result.errors.some(e => (e.details as any)?.field === 'name')).toBe(true)
    })

    it('should reject tool with invalid description', () => {
      const invalidTool = { ...validTool, description: 'short' }
      const result = Validator.validateTool(invalidTool)
      
      expect(result.isValid).toBe(false)
      expect(result.errors.some(e => (e.details as any)?.field === 'description')).toBe(true)
    })

    it('should reject tool with invalid URL', () => {
      const invalidTool = { ...validTool, url: 'not-a-url' }
      const result = Validator.validateTool(invalidTool)
      
      expect(result.isValid).toBe(false)
      expect(result.errors.some(e => (e.details as any)?.field === 'url')).toBe(true)
    })

    it('should reject tool without category', () => {
      const invalidTool = { ...validTool, category: '' }
      const result = Validator.validateTool(invalidTool)
      
      expect(result.isValid).toBe(false)
      expect(result.errors.some(e => (e.details as any)?.field === 'category')).toBe(true)
    })
  })

  describe('validateToolFormData', () => {
    const validFormData: Partial<ToolFormData> = {
      name: 'Test Tool',
      description: 'A test tool for validation',
      category: 'Testing',
      url: 'https://example.com',
      keywords: ['test', 'validation'],
      freeTier: true,
      monthlyCost: null,
      notes: 'Test notes'
    }

    it('should validate valid form data', () => {
      const result = Validator.validateToolFormData(validFormData)
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should reject form data with invalid name length', () => {
      const invalidData = { ...validFormData, name: 'a'.repeat(101) }
      const result = Validator.validateToolFormData(invalidData)
      
      expect(result.isValid).toBe(false)
      expect(result.errors.some(e => (e.details as any)?.field === 'name')).toBe(true)
    })
  })

  describe('validateSubmissionFormData', () => {
    const validSubmissionData: Partial<SubmissionFormData> = {
      url: 'https://example.com',
      contact: 'test@example.com'
    }

    it('should validate valid submission data', () => {
      const result = Validator.validateSubmissionFormData(validSubmissionData)
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should reject submission without URL', () => {
      const invalidData = { ...validSubmissionData, url: '' }
      const result = Validator.validateSubmissionFormData(invalidData)
      
      expect(result.isValid).toBe(false)
      expect(result.errors.some(e => (e.details as any)?.field === 'url')).toBe(true)
    })

    it('should reject submission with invalid email', () => {
      const invalidData = { ...validSubmissionData, contact: 'invalid-email' }
      const result = Validator.validateSubmissionFormData(invalidData)
      
      expect(result.isValid).toBe(false)
      expect(result.errors.some(e => (e.details as any)?.field === 'contact')).toBe(true)
    })

    it('should allow submission without contact', () => {
      const dataWithoutContact = { url: 'https://example.com' }
      const result = Validator.validateSubmissionFormData(dataWithoutContact)
      
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })
  })

  describe('validateSearchQuery', () => {
    it('should validate valid search query', () => {
      const result = Validator.validateSearchQuery('test query')
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should reject empty search query', () => {
      const result = Validator.validateSearchQuery('')
      expect(result.isValid).toBe(false)
      expect(result.errors.some(e => e.details?.field === 'query')).toBe(true)
    })

    it('should reject overly long search query', () => {
      const longQuery = 'a'.repeat(201)
      const result = Validator.validateSearchQuery(longQuery)
      expect(result.isValid).toBe(false)
      expect(result.errors.some(e => e.details?.field === 'query')).toBe(true)
    })
  })

  describe('sanitization methods', () => {
    it('should sanitize strings', () => {
      const input = '  <script>alert("xss")</script>  '
      const sanitized = Validator.sanitizeString(input)
      
      expect(sanitized).not.toContain('<script>')
      expect(sanitized.trim()).toBe(sanitized)
    })

    it('should sanitize URLs', () => {
      const input = 'https://example.com/path?param=value'
      const sanitized = Validator.sanitizeUrl(input)
      
      expect(sanitized).toBe('https://example.com/path?param=value')
    })

    it('should sanitize arrays', () => {
      const input = ['  item1  ', '<script>item2</script>', 'item3']
      const sanitized = Validator.sanitizeArray(input)
      
      expect(sanitized).toEqual(['item1', 'item3']) // Script tag completely removed
      expect(sanitized.every(item => !item.includes('<script>'))).toBe(true)
    })
  })
})