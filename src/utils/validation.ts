import type { Tool, ToolFormData, SubmissionFormData, AppError } from '../types';
import { errorHandler } from './errorHandler';

export interface ValidationResult {
  isValid: boolean;
  errors: AppError[];
}

export class Validator {
  private static isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private static isValidString(value: string, minLength = 1, maxLength = 1000): boolean {
    return typeof value === 'string' && 
           value.trim().length >= minLength && 
           value.trim().length <= maxLength;
  }

  private static isValidArray(value: unknown[]): boolean {
    return Array.isArray(value) && value.length > 0;
  }

  public static validateTool(tool: Partial<Tool>): ValidationResult {
    const errors: AppError[] = [];

    // Required fields validation
    if (!tool.name || !this.isValidString(tool.name, 1, 100)) {
      errors.push(errorHandler.createValidationError('Tool name is required and must be 1-100 characters', 'name'));
    }

    if (!tool.description || !this.isValidString(tool.description, 10, 500)) {
      errors.push(errorHandler.createValidationError('Description is required and must be 10-500 characters', 'description'));
    }

    if (!tool.category || !this.isValidString(tool.category, 1, 50)) {
      errors.push(errorHandler.createValidationError('Category is required and must be 1-50 characters', 'category'));
    }

    if (!tool.url || !this.isValidUrl(tool.url)) {
      errors.push(errorHandler.createValidationError('Valid URL is required', 'url'));
    }

    if (!tool.keywords || !this.isValidArray(tool.keywords)) {
      errors.push(errorHandler.createValidationError('At least one keyword is required', 'keywords'));
    } else if (tool.keywords.some(keyword => !this.isValidString(keyword, 1, 30))) {
      errors.push(errorHandler.createValidationError('All keywords must be 1-30 characters', 'keywords'));
    }

    // Optional fields validation
    if (tool.notes && !this.isValidString(tool.notes, 0, 1000)) {
      errors.push(errorHandler.createValidationError('Notes must be less than 1000 characters', 'notes'));
    }

    if (tool.popularity && (
      typeof tool.popularity !== 'object' ||
      typeof tool.popularity.daily !== 'number' ||
      typeof tool.popularity.weekly !== 'number' ||
      typeof tool.popularity.monthly !== 'number'
    )) {
      errors.push(errorHandler.createValidationError('Popularity must be an object with daily, weekly, and monthly numbers', 'popularity'));
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  public static validateToolFormData(formData: Partial<ToolFormData>): ValidationResult {
    const errors: AppError[] = [];

    // Required fields validation
    if (!formData.name || !this.isValidString(formData.name, 1, 100)) {
      errors.push(errorHandler.createValidationError('Tool name is required and must be 1-100 characters', 'name'));
    }

    if (!formData.description || !this.isValidString(formData.description, 10, 500)) {
      errors.push(errorHandler.createValidationError('Description is required and must be 10-500 characters', 'description'));
    }

    if (!formData.category || !this.isValidString(formData.category, 1, 50)) {
      errors.push(errorHandler.createValidationError('Category is required and must be 1-50 characters', 'category'));
    }

    if (!formData.url || !this.isValidUrl(formData.url)) {
      errors.push(errorHandler.createValidationError('Valid URL is required', 'url'));
    }

    if (!formData.keywords || !this.isValidArray(formData.keywords)) {
      errors.push(errorHandler.createValidationError('At least one keyword is required', 'keywords'));
    } else if (formData.keywords.some(keyword => !this.isValidString(keyword, 1, 30))) {
      errors.push(errorHandler.createValidationError('All keywords must be 1-30 characters', 'keywords'));
    }

    // Optional fields validation
    if (formData.notes && !this.isValidString(formData.notes, 0, 1000)) {
      errors.push(errorHandler.createValidationError('Notes must be less than 1000 characters', 'notes'));
    }

    if (formData.monthlyCost !== null && formData.monthlyCost !== undefined && (typeof formData.monthlyCost !== 'number' || formData.monthlyCost < 0)) {
      errors.push(errorHandler.createValidationError('Monthly cost must be a positive number or null', 'monthlyCost'));
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  public static validateSubmissionFormData(formData: Partial<SubmissionFormData>): ValidationResult {
    const errors: AppError[] = [];

    // Validate URL is required
    if (!formData.url || !this.isValidUrl(formData.url)) {
      errors.push(errorHandler.createValidationError('Valid URL is required', 'url'));
    }

    // Validate contact email if provided (optional)
    if (formData.contact && !this.isValidEmail(formData.contact)) {
      errors.push(errorHandler.createValidationError('Valid email address is required', 'contact'));
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  public static validateSearchQuery(query: string): ValidationResult {
    const errors: AppError[] = [];

    if (!query || query.trim().length === 0) {
      errors.push(errorHandler.createValidationError('Search query cannot be empty', 'query'));
    }

    if (query.length > 200) {
      errors.push(errorHandler.createValidationError('Search query must be less than 200 characters', 'query'));
    }

    // Check for potentially harmful patterns
    const harmfulPatterns = [/<script/i, /javascript:/i, /on\w+=/i];
    if (harmfulPatterns.some(pattern => pattern.test(query))) {
      errors.push(errorHandler.createValidationError('Search query contains invalid characters', 'query'));
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  public static sanitizeString(input: string): string {
    return input
      .trim()
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
      .replace(/<[^>]*>/g, '') // Remove other HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocols
      .substring(0, 1000); // Limit length
  }

  public static sanitizeUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      // Only allow http and https protocols
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        throw new Error('Invalid protocol');
      }
      return urlObj.toString();
    } catch {
      return '';
    }
  }

  public static sanitizeArray(arr: string[]): string[] {
    return arr
      .filter(item => typeof item === 'string')
      .map(item => this.sanitizeString(item))
      .filter(item => item.length > 0)
      .slice(0, 10); // Limit to 10 items
  }
}

// React hook for form validation
export const useValidation = <T>(
  validator: (data: Partial<T>) => ValidationResult
) => {
  const [errors, setErrors] = React.useState<AppError[]>([]);
  const [isValid, setIsValid] = React.useState(true);

  const validate = React.useCallback((data: Partial<T>) => {
    const result = validator(data);
    setErrors(result.errors);
    setIsValid(result.isValid);
    return result;
  }, [validator]);

  const clearErrors = React.useCallback(() => {
    setErrors([]);
    setIsValid(true);
  }, []);

  const getFieldError = React.useCallback((fieldName: string) => {
    return errors.find(error => 
      error.details && 
      typeof error.details === 'object' && 
      'field' in error.details && 
      error.details.field === fieldName
    );
  }, [errors]);

  return {
    errors,
    isValid,
    validate,
    clearErrors,
    getFieldError
  };
};