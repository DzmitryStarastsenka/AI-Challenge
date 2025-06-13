import { describe, test, expect } from '@jest/globals';
import {
  Schema,
  BaseValidator,
  StringValidator,
  NumberValidator,
  BooleanValidator,
  DateValidator,
  ArrayValidator,
  ObjectValidator
} from './schema.js';

describe('BaseValidator', () => {
  test('should handle optional values correctly', () => {
    const validator = new BaseValidator().optional();
    
    expect(validator.validate(undefined).success).toBe(true);
    expect(validator.validate(null).success).toBe(true);
  });

  test('should require values by default', () => {
    const validator = new BaseValidator();
    
    expect(validator.validate(undefined).success).toBe(false);
    expect(validator.validate(null).success).toBe(false);
  });

  test('should use custom error messages', () => {
    const validator = new BaseValidator().withMessage('Custom error');
    const result = validator.validate(null);
    
    expect(result.success).toBe(false);
    expect(result.errors).toContain('Custom error');
  });
});

describe('StringValidator', () => {
  test('should validate string type', () => {
    const validator = Schema.string();
    
    expect(validator.validate('hello').success).toBe(true);
    expect(validator.validate(123).success).toBe(false);
    expect(validator.validate({}).success).toBe(false);
  });

  test('should validate minimum length', () => {
    const validator = Schema.string().minLength(3);
    
    expect(validator.validate('hi').success).toBe(false);
    expect(validator.validate('hello').success).toBe(true);
  });

  test('should validate maximum length', () => {
    const validator = Schema.string().maxLength(5);
    
    expect(validator.validate('hello').success).toBe(true);
    expect(validator.validate('hello world').success).toBe(false);
  });

  test('should validate pattern matching', () => {
    const emailValidator = Schema.string().pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    
    expect(emailValidator.validate('test@example.com').success).toBe(true);
    expect(emailValidator.validate('invalid-email').success).toBe(false);
  });

  test('should chain validations', () => {
    const validator = Schema.string().minLength(2).maxLength(50).pattern(/^[A-Za-z\s]+$/);
    
    expect(validator.validate('John Doe').success).toBe(true);
    expect(validator.validate('J').success).toBe(false); // Too short
    expect(validator.validate('John123').success).toBe(false); // Invalid pattern
  });

  test('should handle optional strings', () => {
    const validator = Schema.string().optional();
    
    expect(validator.validate(undefined).success).toBe(true);
    expect(validator.validate('hello').success).toBe(true);
  });
});

describe('NumberValidator', () => {
  test('should validate number type', () => {
    const validator = Schema.number();
    
    expect(validator.validate(42).success).toBe(true);
    expect(validator.validate(3.14).success).toBe(true);
    expect(validator.validate('42').success).toBe(false);
    expect(validator.validate(NaN).success).toBe(false);
  });

  test('should validate minimum value', () => {
    const validator = Schema.number().min(10);
    
    expect(validator.validate(5).success).toBe(false);
    expect(validator.validate(15).success).toBe(true);
  });

  test('should validate maximum value', () => {
    const validator = Schema.number().max(100);
    
    expect(validator.validate(50).success).toBe(true);
    expect(validator.validate(150).success).toBe(false);
  });

  test('should validate integer requirement', () => {
    const validator = Schema.number().integer();
    
    expect(validator.validate(42).success).toBe(true);
    expect(validator.validate(3.14).success).toBe(false);
  });

  test('should chain number validations', () => {
    const validator = Schema.number().min(0).max(100).integer();
    
    expect(validator.validate(50).success).toBe(true);
    expect(validator.validate(-5).success).toBe(false); // Below min
    expect(validator.validate(150).success).toBe(false); // Above max
    expect(validator.validate(50.5).success).toBe(false); // Not integer
  });
});

describe('BooleanValidator', () => {
  test('should validate boolean type', () => {
    const validator = Schema.boolean();
    
    expect(validator.validate(true).success).toBe(true);
    expect(validator.validate(false).success).toBe(true);
    expect(validator.validate('true').success).toBe(false);
    expect(validator.validate(1).success).toBe(false);
  });

  test('should handle optional booleans', () => {
    const validator = Schema.boolean().optional();
    
    expect(validator.validate(undefined).success).toBe(true);
    expect(validator.validate(true).success).toBe(true);
  });
});

describe('DateValidator', () => {
  test('should validate Date objects', () => {
    const validator = Schema.date();
    
    expect(validator.validate(new Date()).success).toBe(true);
    expect(validator.validate('2023-12-25').success).toBe(true);
    expect(validator.validate('invalid-date').success).toBe(false);
  });

  test('should validate minimum date', () => {
    const minDate = new Date('2023-01-01');
    const validator = Schema.date().min(minDate);
    
    expect(validator.validate(new Date('2023-06-01')).success).toBe(true);
    expect(validator.validate(new Date('2022-06-01')).success).toBe(false);
  });

  test('should validate maximum date', () => {
    const maxDate = new Date('2023-12-31');
    const validator = Schema.date().max(maxDate);
    
    expect(validator.validate(new Date('2023-06-01')).success).toBe(true);
    expect(validator.validate(new Date('2024-06-01')).success).toBe(false);
  });

  test('should handle date strings and numbers', () => {
    const validator = Schema.date();
    
    expect(validator.validate('2023-12-25').success).toBe(true);
    expect(validator.validate(Date.now()).success).toBe(true);
  });
});

describe('ArrayValidator', () => {
  test('should validate array type', () => {
    const validator = Schema.array();
    
    expect(validator.validate([]).success).toBe(true);
    expect(validator.validate([1, 2, 3]).success).toBe(true);
    expect(validator.validate('not an array').success).toBe(false);
  });

  test('should validate minimum length', () => {
    const validator = Schema.array().minLength(2);
    
    expect(validator.validate([1]).success).toBe(false);
    expect(validator.validate([1, 2, 3]).success).toBe(true);
  });

  test('should validate maximum length', () => {
    const validator = Schema.array().maxLength(3);
    
    expect(validator.validate([1, 2]).success).toBe(true);
    expect(validator.validate([1, 2, 3, 4]).success).toBe(false);
  });

  test('should validate array items', () => {
    const validator = Schema.array(Schema.string());
    
    expect(validator.validate(['hello', 'world']).success).toBe(true);
    expect(validator.validate(['hello', 123]).success).toBe(false);
  });

  test('should provide detailed error messages for items', () => {
    const validator = Schema.array(Schema.string().minLength(3));
    const result = validator.validate(['hello', 'hi']);
    
    expect(result.success).toBe(false);
    expect(result.errors.some(err => err.includes('Item at index 1'))).toBe(true);
  });
});

describe('ObjectValidator', () => {
  test('should validate object type', () => {
    const validator = Schema.object();
    
    expect(validator.validate({}).success).toBe(true);
    expect(validator.validate({ name: 'John' }).success).toBe(true);
    expect(validator.validate('not an object').success).toBe(false);
    expect(validator.validate([]).success).toBe(false);
    expect(validator.validate(null).success).toBe(false);
  });

  test('should validate object properties', () => {
    const validator = Schema.object({
      name: Schema.string(),
      age: Schema.number()
    });
    
    expect(validator.validate({ name: 'John', age: 30 }).success).toBe(true);
    expect(validator.validate({ name: 'John', age: 'thirty' }).success).toBe(false);
  });

  test('should handle missing required properties', () => {
    const validator = Schema.object({
      name: Schema.string(),
      age: Schema.number()
    });
    
    const result = validator.validate({ name: 'John' });
    expect(result.success).toBe(false);
    expect(result.errors.some(err => err.includes("Property 'age'"))).toBe(true);
  });

  test('should handle optional properties', () => {
    const validator = Schema.object({
      name: Schema.string(),
      age: Schema.number().optional()
    });
    
    expect(validator.validate({ name: 'John' }).success).toBe(true);
    expect(validator.validate({ name: 'John', age: 30 }).success).toBe(true);
  });

  test('should allow additional properties by default', () => {
    const validator = Schema.object({
      name: Schema.string()
    });
    
    expect(validator.validate({ name: 'John', extra: 'data' }).success).toBe(true);
  });

  test('should disallow additional properties in strict mode', () => {
    const validator = Schema.object({
      name: Schema.string()
    }).strict();
    
    const result = validator.validate({ name: 'John', extra: 'data' });
    expect(result.success).toBe(false);
    expect(result.errors.some(err => err.includes('Additional properties not allowed'))).toBe(true);
  });
});

describe('Complex Schema Validation', () => {
  test('should validate nested objects', () => {
    const addressSchema = Schema.object({
      street: Schema.string(),
      city: Schema.string(),
      postalCode: Schema.string().pattern(/^\d{5}$/)
    });

    const userSchema = Schema.object({
      name: Schema.string().minLength(2),
      address: addressSchema
    });

    const validUser = {
      name: 'John Doe',
      address: {
        street: '123 Main St',
        city: 'Anytown',
        postalCode: '12345'
      }
    };

    const invalidUser = {
      name: 'John Doe',
      address: {
        street: '123 Main St',
        city: 'Anytown',
        postalCode: 'invalid'
      }
    };

    expect(userSchema.validate(validUser).success).toBe(true);
    expect(userSchema.validate(invalidUser).success).toBe(false);
  });

  test('should validate arrays of objects', () => {
    const itemSchema = Schema.object({
      name: Schema.string(),
      price: Schema.number().min(0)
    });

    const orderSchema = Schema.object({
      items: Schema.array(itemSchema).minLength(1),
      total: Schema.number().min(0)
    });

    const validOrder = {
      items: [
        { name: 'Item 1', price: 10.99 },
        { name: 'Item 2', price: 5.50 }
      ],
      total: 16.49
    };

    const invalidOrder = {
      items: [
        { name: 'Item 1', price: -5 } // Invalid negative price
      ],
      total: 16.49
    };

    expect(orderSchema.validate(validOrder).success).toBe(true);
    expect(orderSchema.validate(invalidOrder).success).toBe(false);
  });

  test('should handle deeply nested structures', () => {
    const deepSchema = Schema.object({
      level1: Schema.object({
        level2: Schema.object({
          level3: Schema.array(Schema.string().minLength(1))
        })
      })
    });

    const validData = {
      level1: {
        level2: {
          level3: ['valid', 'strings']
        }
      }
    };

    const invalidData = {
      level1: {
        level2: {
          level3: ['valid', ''] // Empty string not allowed
        }
      }
    };

    expect(deepSchema.validate(validData).success).toBe(true);
    expect(deepSchema.validate(invalidData).success).toBe(false);
  });
});

describe('Error Messages', () => {
  test('should provide meaningful error messages', () => {
    const schema = Schema.object({
      email: Schema.string().pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).withMessage('Invalid email format'),
      age: Schema.number().min(18).withMessage('Must be at least 18 years old')
    });

    const result = schema.validate({
      email: 'invalid-email',
      age: 16
    });

    expect(result.success).toBe(false);
    expect(result.errors.some(err => err.includes('Invalid email format'))).toBe(true);
    expect(result.errors.some(err => err.includes('Must be at least 18 years old'))).toBe(true);
  });

  test('should provide default error messages when custom ones are not set', () => {
    const schema = Schema.object({
      name: Schema.string(),
      age: Schema.number().min(0)
    });

    const result = schema.validate({
      name: 123,
      age: -5
    });

    expect(result.success).toBe(false);
    expect(result.errors.some(err => err.includes('Value must be a string'))).toBe(true);
    expect(result.errors.some(err => err.includes('Number must be at least 0'))).toBe(true);
  });
});

describe('Schema Factory Methods', () => {
  test('should create correct validator instances', () => {
    expect(Schema.string()).toBeInstanceOf(StringValidator);
    expect(Schema.number()).toBeInstanceOf(NumberValidator);
    expect(Schema.boolean()).toBeInstanceOf(BooleanValidator);
    expect(Schema.date()).toBeInstanceOf(DateValidator);
    expect(Schema.array()).toBeInstanceOf(ArrayValidator);
    expect(Schema.object()).toBeInstanceOf(ObjectValidator);
  });

  test('should allow method chaining', () => {
    const validator = Schema.string().minLength(2).maxLength(50).optional();
    
    expect(validator).toBeInstanceOf(StringValidator);
    expect(validator.minLengthValue).toBe(2);
    expect(validator.maxLengthValue).toBe(50);
    expect(validator.isOptional).toBe(true);
  });
}); 