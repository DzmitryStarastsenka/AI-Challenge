# Data Validation Library

A robust, type-safe data validation library for JavaScript that supports complex data structures with fluent API design.

## Features

- ✅ **Type-safe validation** for primitive types (string, number, boolean, date)
- 🏗️ **Complex structure support** for arrays and objects
- 🔗 **Fluent API** with method chaining
- 📝 **Custom error messages** 
- 🔒 **Strict mode** for object validation
- 🎯 **Optional field** support
- 🧪 **Comprehensive test coverage** (90%+)
- 📦 **Zero dependencies**

## Installation

```bash
# Clone the repository or copy the files
# Install dependencies for testing
npm install
```

## Quick Start

```javascript
import { Schema } from './schema.js';

// Basic string validation
const nameValidator = Schema.string().minLength(2).maxLength(50);
const result = nameValidator.validate('John Doe');
console.log(result.success); // true

// Email validation with custom message
const emailValidator = Schema.string()
  .pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
  .withMessage('Please provide a valid email address');

// Complex object validation
const userSchema = Schema.object({
  name: Schema.string().minLength(2),
  email: Schema.string().pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
  age: Schema.number().min(0).max(120).optional(),
  isActive: Schema.boolean()
});

const userData = {
  name: 'John Doe',
  email: 'john@example.com',
  age: 30,
  isActive: true
};

const validationResult = userSchema.validate(userData);
```

## API Reference

### Schema Factory Methods

#### `Schema.string()`
Creates a string validator.

**Methods:**
- `.minLength(min: number)` - Sets minimum length requirement
- `.maxLength(max: number)` - Sets maximum length requirement
- `.pattern(regex: RegExp)` - Sets regex pattern requirement

```javascript
const validator = Schema.string()
  .minLength(2)
  .maxLength(100)
  .pattern(/^[A-Za-z\s]+$/);
```

#### `Schema.number()`
Creates a number validator.

**Methods:**
- `.min(min: number)` - Sets minimum value
- `.max(max: number)` - Sets maximum value
- `.integer()` - Requires integer values

```javascript
const validator = Schema.number()
  .min(0)
  .max(100)
  .integer();
```

#### `Schema.boolean()` 
Creates a boolean validator.

```javascript
const validator = Schema.boolean();
```

#### `Schema.date()`
Creates a date validator that accepts Date objects, ISO strings, or timestamps.

**Methods:**
- `.min(min: Date)` - Sets minimum date
- `.max(max: Date)` - Sets maximum date

```javascript
const validator = Schema.date()
  .min(new Date('2024-01-01'))
  .max(new Date('2024-12-31'));
```

#### `Schema.array(itemValidator?)`
Creates an array validator with optional item validation.

**Methods:**
- `.minLength(min: number)` - Sets minimum array length
- `.maxLength(max: number)` - Sets maximum array length

```javascript
// Array of strings
const validator = Schema.array(Schema.string())
  .minLength(1)
  .maxLength(10);

// Array without item validation  
const simpleArray = Schema.array();
```

#### `Schema.object(schema?)`
Creates an object validator with optional property schema.

**Methods:**
- `.strict()` - Disallows additional properties not in schema

```javascript
const validator = Schema.object({
  name: Schema.string(),
  age: Schema.number().optional()
}).strict();
```

### Universal Methods

All validators support these methods:

#### `.optional()`
Makes the validator accept `undefined` or `null` values.

```javascript
const validator = Schema.string().optional();
```

#### `.withMessage(message: string)`  
Sets a custom error message for validation failures.

```javascript
const validator = Schema.string()
  .minLength(8)
  .withMessage('Password must be at least 8 characters long');
```

#### `.validate(value: any)`
Validates a value and returns a result object.

**Returns:**
```javascript
{
  success: boolean,
  errors: string[]
}
```

## Advanced Examples

### Nested Object Validation

```javascript
const addressSchema = Schema.object({
  street: Schema.string().minLength(1),
  city: Schema.string().minLength(1), 
  postalCode: Schema.string().pattern(/^\d{5}(-\d{4})?$/),
  country: Schema.string().minLength(2)
});

const userSchema = Schema.object({
  name: Schema.string().minLength(2).maxLength(100),
  email: Schema.string().pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
  address: addressSchema.optional()
});
```

### Array of Objects

```javascript
const productSchema = Schema.object({
  id: Schema.string(),
  name: Schema.string().minLength(1),
  price: Schema.number().min(0),
  quantity: Schema.number().min(1).integer()
});

const orderSchema = Schema.object({
  products: Schema.array(productSchema).minLength(1),
  totalAmount: Schema.number().min(0)
});
```

### Custom Error Messages

```javascript
const passwordSchema = Schema.string()
  .minLength(8)
  .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
  .withMessage('Password must be at least 8 characters with uppercase, lowercase, and number');
```

### Strict Object Validation

```javascript
const strictSchema = Schema.object({
  name: Schema.string(),
  age: Schema.number()
}).strict();

// This will fail because 'extra' property is not allowed
const result = strictSchema.validate({
  name: 'John',
  age: 30,
  extra: 'not allowed'
});
```

## Running the Application

### Demo
Run the demo to see the library in action:

```bash
npm run demo
```

### Tests
Run the comprehensive test suite:

```bash
# Run all tests
npm test

# Run tests with coverage report
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Schema Validation Example
You can also run the library directly to see the built-in example:

```bash
node schema.js
```

## Usage in Your Projects

### ES6 Modules
```javascript
import { Schema } from './schema.js';

const validator = Schema.string().minLength(1);
```

### CommonJS (if adapted)
```javascript
const { Schema } = require('./schema.js');
```

### Individual Validators
```javascript
import { 
  StringValidator, 
  NumberValidator, 
  ObjectValidator 
} from './schema.js';

const validator = new StringValidator().minLength(5);
```

## Error Handling

The library provides detailed error messages to help identify validation issues:

```javascript
const schema = Schema.object({
  email: Schema.string().pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
  age: Schema.number().min(18)
});

const result = schema.validate({
  email: 'invalid-email',
  age: 16
});

console.log(result.errors);
// [
//   "Property 'email': String does not match required pattern",
//   "Property 'age': Number must be at least 18"
// ]
```

## Testing

The library includes comprehensive tests covering:

- ✅ All validator types (string, number, boolean, date, array, object)
- ✅ Method chaining and combinations
- ✅ Optional field handling
- ✅ Custom error messages
- ✅ Nested object validation
- ✅ Array item validation
- ✅ Strict mode validation
- ✅ Edge cases and error conditions

Test coverage is maintained at 90%+ to ensure reliability.

## Performance Considerations

- Validators are lightweight and can be reused
- Object schemas are compiled once and can validate multiple objects
- Pattern matching uses native RegExp for optimal performance
- No external dependencies keep the bundle size minimal

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass with `npm test`
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Changelog

### v1.0.0
- Initial release with core validation functionality
- Support for all primitive types and complex structures
- Comprehensive test suite
- Full documentation 