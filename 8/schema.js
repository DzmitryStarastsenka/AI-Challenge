/**
 * Data Validation Library
 * A robust validation library for complex data structures
 */

/**
 * Base class for all validators
 * Provides common functionality like optional validation and custom error messages
 */
class BaseValidator {
  constructor() {
    this.isOptional = false;
    this.customMessage = null;
  }

  /**
   * Makes this validator optional (allows undefined/null values)
   * @returns {BaseValidator} Returns this validator for chaining
   */
  optional() {
    this.isOptional = true;
    return this;
  }

  /**
   * Sets a custom error message for validation failures
   * @param {string} message - The custom error message
   * @returns {BaseValidator} Returns this validator for chaining
   */
  withMessage(message) {
    this.customMessage = message;
    return this;
  }

  /**
   * Validates a value and returns validation result
   * @param {any} value - The value to validate
   * @returns {Object} Validation result with success boolean and errors array
   */
  validate(value) {
    // Handle optional values
    if (this.isOptional && (value === undefined || value === null)) {
      return { success: true, errors: [] };
    }

    // Check for required values
    if (!this.isOptional && (value === undefined || value === null)) {
      return {
        success: false,
        errors: [this.customMessage || 'Value is required']
      };
    }

    return this._validate(value);
  }

  /**
   * Internal validation method to be implemented by subclasses
   * @param {any} value - The value to validate
   * @returns {Object} Validation result
   */
  _validate(value) {
    return { success: true, errors: [] };
  }
}

/**
 * String validator with various string-specific validations
 */
class StringValidator extends BaseValidator {
  constructor() {
    super();
    this.minLengthValue = null;
    this.maxLengthValue = null;
    this.patternRegex = null;
  }

  /**
   * Sets minimum length requirement
   * @param {number} min - Minimum length
   * @returns {StringValidator} Returns this validator for chaining
   */
  minLength(min) {
    this.minLengthValue = min;
    return this;
  }

  /**
   * Sets maximum length requirement
   * @param {number} max - Maximum length
   * @returns {StringValidator} Returns this validator for chaining
   */
  maxLength(max) {
    this.maxLengthValue = max;
    return this;
  }

  /**
   * Sets pattern requirement using regex
   * @param {RegExp} regex - Regular expression pattern
   * @returns {StringValidator} Returns this validator for chaining
   */
  pattern(regex) {
    this.patternRegex = regex;
    return this;
  }

  _validate(value) {
    const errors = [];

    // Check if value is a string
    if (typeof value !== 'string') {
      return {
        success: false,
        errors: [this.customMessage || 'Value must be a string']
      };
    }

    // Check minimum length
    if (this.minLengthValue !== null && value.length < this.minLengthValue) {
      errors.push(`String must be at least ${this.minLengthValue} characters long`);
    }

    // Check maximum length
    if (this.maxLengthValue !== null && value.length > this.maxLengthValue) {
      errors.push(`String must be no more than ${this.maxLengthValue} characters long`);
    }

    // Check pattern
    if (this.patternRegex && !this.patternRegex.test(value)) {
      errors.push(this.customMessage || 'String does not match required pattern');
    }

    return {
      success: errors.length === 0,
      errors: errors
    };
  }
}

/**
 * Number validator with range and type validations
 */
class NumberValidator extends BaseValidator {
  constructor() {
    super();
    this.minValue = null;
    this.maxValue = null;
    this.integerOnly = false;
  }

  /**
   * Sets minimum value requirement
   * @param {number} min - Minimum value
   * @returns {NumberValidator} Returns this validator for chaining
   */
  min(min) {
    this.minValue = min;
    return this;
  }

  /**
   * Sets maximum value requirement
   * @param {number} max - Maximum value
   * @returns {NumberValidator} Returns this validator for chaining
   */
  max(max) {
    this.maxValue = max;
    return this;
  }

  /**
   * Requires the number to be an integer
   * @returns {NumberValidator} Returns this validator for chaining
   */
  integer() {
    this.integerOnly = true;
    return this;
  }

  _validate(value) {
    const errors = [];

    // Check if value is a number
    if (typeof value !== 'number' || isNaN(value)) {
      return {
        success: false,
        errors: [this.customMessage || 'Value must be a number']
      };
    }

    // Check if integer required
    if (this.integerOnly && !Number.isInteger(value)) {
      errors.push(this.customMessage || 'Number must be an integer');
    }

    // Check minimum value
    if (this.minValue !== null && value < this.minValue) {
      errors.push(this.customMessage || `Number must be at least ${this.minValue}`);
    }

    // Check maximum value
    if (this.maxValue !== null && value > this.maxValue) {
      errors.push(this.customMessage || `Number must be no more than ${this.maxValue}`);
    }

    return {
      success: errors.length === 0,
      errors: errors
    };
  }
}

/**
 * Boolean validator
 */
class BooleanValidator extends BaseValidator {
  _validate(value) {
    if (typeof value !== 'boolean') {
      return {
        success: false,
        errors: [this.customMessage || 'Value must be a boolean']
      };
    }

    return { success: true, errors: [] };
  }
}

/**
 * Date validator with date-specific validations
 */
class DateValidator extends BaseValidator {
  constructor() {
    super();
    this.minDate = null;
    this.maxDate = null;
  }

  /**
   * Sets minimum date requirement
   * @param {Date} min - Minimum date
   * @returns {DateValidator} Returns this validator for chaining
   */
  min(min) {
    this.minDate = min;
    return this;
  }

  /**
   * Sets maximum date requirement
   * @param {Date} max - Maximum date
   * @returns {DateValidator} Returns this validator for chaining
   */
  max(max) {
    this.maxDate = max;
    return this;
  }

  _validate(value) {
    const errors = [];

    // Check if value is a Date object or can be converted to one
    let dateValue;
    if (value instanceof Date) {
      dateValue = value;
    } else if (typeof value === 'string' || typeof value === 'number') {
      dateValue = new Date(value);
    } else {
      return {
        success: false,
        errors: [this.customMessage || 'Value must be a valid date']
      };
    }

    // Check if date is valid
    if (isNaN(dateValue.getTime())) {
      return {
        success: false,
        errors: [this.customMessage || 'Value must be a valid date']
      };
    }

    // Check minimum date
    if (this.minDate && dateValue < this.minDate) {
      errors.push(`Date must be after ${this.minDate.toISOString()}`);
    }

    // Check maximum date
    if (this.maxDate && dateValue > this.maxDate) {
      errors.push(`Date must be before ${this.maxDate.toISOString()}`);
    }

    return {
      success: errors.length === 0,
      errors: errors
    };
  }
}

/**
 * Array validator for validating arrays and their elements
 */
class ArrayValidator extends BaseValidator {
  constructor(itemValidator) {
    super();
    this.itemValidator = itemValidator;
    this.minLengthValue = null;
    this.maxLengthValue = null;
  }

  /**
   * Sets minimum array length requirement
   * @param {number} min - Minimum length
   * @returns {ArrayValidator} Returns this validator for chaining
   */
  minLength(min) {
    this.minLengthValue = min;
    return this;
  }

  /**
   * Sets maximum array length requirement
   * @param {number} max - Maximum length
   * @returns {ArrayValidator} Returns this validator for chaining
   */
  maxLength(max) {
    this.maxLengthValue = max;
    return this;
  }

  _validate(value) {
    const errors = [];

    // Check if value is an array
    if (!Array.isArray(value)) {
      return {
        success: false,
        errors: [this.customMessage || 'Value must be an array']
      };
    }

    // Check minimum length
    if (this.minLengthValue !== null && value.length < this.minLengthValue) {
      errors.push(`Array must have at least ${this.minLengthValue} items`);
    }

    // Check maximum length
    if (this.maxLengthValue !== null && value.length > this.maxLengthValue) {
      errors.push(`Array must have no more than ${this.maxLengthValue} items`);
    }

    // Validate each item if item validator is provided
    if (this.itemValidator) {
      value.forEach((item, index) => {
        const itemResult = this.itemValidator.validate(item);
        if (!itemResult.success) {
          itemResult.errors.forEach(error => {
            errors.push(`Item at index ${index}: ${error}`);
          });
        }
      });
    }

    return {
      success: errors.length === 0,
      errors: errors
    };
  }
}

/**
 * Object validator for validating objects and their properties
 */
class ObjectValidator extends BaseValidator {
  constructor(schema = {}) {
    super();
    this.schema = schema;
    this.allowAdditionalProperties = true;
  }

  /**
   * Disallows additional properties not defined in the schema
   * @returns {ObjectValidator} Returns this validator for chaining
   */
  strict() {
    this.allowAdditionalProperties = false;
    return this;
  }

  _validate(value) {
    const errors = [];

    // Check if value is an object
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
      return {
        success: false,
        errors: [this.customMessage || 'Value must be an object']
      };
    }

    // Validate schema properties
    for (const [key, validator] of Object.entries(this.schema)) {
      const propResult = validator.validate(value[key]);
      if (!propResult.success) {
        propResult.errors.forEach(error => {
          errors.push(`Property '${key}': ${error}`);
        });
      }
    }

    // Check for additional properties if strict mode
    if (!this.allowAdditionalProperties) {
      const schemaKeys = Object.keys(this.schema);
      const valueKeys = Object.keys(value);
      const additionalKeys = valueKeys.filter(key => !schemaKeys.includes(key));
      
      if (additionalKeys.length > 0) {
        errors.push(`Additional properties not allowed: ${additionalKeys.join(', ')}`);
      }
    }

    return {
      success: errors.length === 0,
      errors: errors
    };
  }
}

/**
 * Main Schema class providing static factory methods for validators
 */
class Schema {
  /**
   * Creates a string validator
   * @returns {StringValidator} String validator instance
   */
  static string() {
    return new StringValidator();
  }

  /**
   * Creates a number validator
   * @returns {NumberValidator} Number validator instance
   */
  static number() {
    return new NumberValidator();
  }

  /**
   * Creates a boolean validator
   * @returns {BooleanValidator} Boolean validator instance
   */
  static boolean() {
    return new BooleanValidator();
  }

  /**
   * Creates a date validator
   * @returns {DateValidator} Date validator instance
   */
  static date() {
    return new DateValidator();
  }

  /**
   * Creates an object validator with the given schema
   * @param {Object} schema - Schema definition with property validators
   * @returns {ObjectValidator} Object validator instance
   */
  static object(schema = {}) {
    return new ObjectValidator(schema);
  }

  /**
   * Creates an array validator with optional item validator
   * @param {BaseValidator} itemValidator - Validator for array items
   * @returns {ArrayValidator} Array validator instance
   */
  static array(itemValidator = null) {
    return new ArrayValidator(itemValidator);
  }
}

// Export all classes for use in other modules
export {
  Schema,
  BaseValidator,
  StringValidator,
  NumberValidator,
  BooleanValidator,
  DateValidator,
  ArrayValidator,
  ObjectValidator
};

// Example usage and demonstration
if (import.meta.url === `file://${process.argv[1]}`) {
  // Define a complex schema
  const addressSchema = Schema.object({
    street: Schema.string(),
    city: Schema.string(),
    postalCode: Schema.string().pattern(/^\d{5}$/).withMessage('Postal code must be 5 digits'),
    country: Schema.string()
  });

  const userSchema = Schema.object({
    id: Schema.string().withMessage('ID must be a string'),
    name: Schema.string().minLength(2).maxLength(50),
    email: Schema.string().pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
    age: Schema.number().optional(),
    isActive: Schema.boolean(),
    tags: Schema.array(Schema.string()),
    address: addressSchema.optional(),
    metadata: Schema.object({}).optional()
  });

  // Test data
  const userData = {
    id: "12345",
    name: "John Doe",
    email: "john@example.com",
    isActive: true,
    tags: ["developer", "designer"],
    address: {
      street: "123 Main St",
      city: "Anytown",
      postalCode: "12345",
      country: "USA"
    }
  };

  // Validate data
  const result = userSchema.validate(userData);
  console.log('Validation Result:', result);
}
