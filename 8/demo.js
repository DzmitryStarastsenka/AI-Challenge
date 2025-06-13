import { Schema } from './schema.js';

console.log('🔍 Data Validation Library Demo\n');

// Example 1: Basic validation
console.log('📝 Example 1: Basic String Validation');
const nameValidator = Schema.string().minLength(2).maxLength(50);

console.log('Valid name:', nameValidator.validate('John Doe'));
console.log('Invalid name (too short):', nameValidator.validate('J'));
console.log('Invalid name (not string):', nameValidator.validate(123));
console.log();

// Example 2: Email validation
console.log('📧 Example 2: Email Validation');
const emailValidator = Schema.string()
  .pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
  .withMessage('Please provide a valid email address');

console.log('Valid email:', emailValidator.validate('user@example.com'));
console.log('Invalid email:', emailValidator.validate('invalid-email'));
console.log();

// Example 3: Number validation with constraints
console.log('🔢 Example 3: Age Validation');
const ageValidator = Schema.number()
  .min(0)
  .max(120)
  .integer()
  .withMessage('Age must be a valid integer between 0 and 120');

console.log('Valid age:', ageValidator.validate(25));
console.log('Invalid age (decimal):', ageValidator.validate(25.5));
console.log('Invalid age (negative):', ageValidator.validate(-5));
console.log();

// Example 4: Array validation
console.log('📋 Example 4: Tags Array Validation');
const tagsValidator = Schema.array(Schema.string().minLength(1))
  .minLength(1)
  .maxLength(10);

console.log('Valid tags:', tagsValidator.validate(['javascript', 'node', 'validation']));
console.log('Invalid tags (empty array):', tagsValidator.validate([]));
console.log('Invalid tags (contains empty string):', tagsValidator.validate(['javascript', '']));
console.log();

// Example 5: Complex object validation
console.log('👤 Example 5: User Profile Validation');
const addressSchema = Schema.object({
  street: Schema.string().minLength(1),
  city: Schema.string().minLength(1),
  postalCode: Schema.string().pattern(/^\d{5}(-\d{4})?$/),
  country: Schema.string().minLength(2)
});

const userSchema = Schema.object({
  id: Schema.string().withMessage('User ID is required'),
  name: Schema.string().minLength(2).maxLength(100),
  email: Schema.string().pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
  age: Schema.number().min(13).max(120).optional(),
  isActive: Schema.boolean(),
  tags: Schema.array(Schema.string()).optional(),
  address: addressSchema.optional(),
  preferences: Schema.object({
    newsletter: Schema.boolean(),
    theme: Schema.string().optional()
  }).optional()
});

const validUser = {
  id: 'user_123',
  name: 'John Doe',
  email: 'john@example.com',
  age: 30,
  isActive: true,
  tags: ['developer', 'javascript'],
  address: {
    street: '123 Main St',
    city: 'New York',
    postalCode: '10001',
    country: 'US'
  },
  preferences: {
    newsletter: true,
    theme: 'dark'
  }
};

const invalidUser = {
  id: 'user_123',
  name: 'J', // Too short
  email: 'invalid-email', // Invalid format
  age: 'thirty', // Should be number
  isActive: 'yes', // Should be boolean
  address: {
    street: '123 Main St',
    city: 'New York',
    postalCode: 'invalid', // Invalid postal code format
    country: 'US'
  }
};

console.log('✅ Valid user validation:');
const validResult = userSchema.validate(validUser);
console.log('Success:', validResult.success);
console.log('Errors:', validResult.errors);
console.log();

console.log('❌ Invalid user validation:');
const invalidResult = userSchema.validate(invalidUser);
console.log('Success:', invalidResult.success);
console.log('Errors:');
invalidResult.errors.forEach((error, index) => {
  console.log(`  ${index + 1}. ${error}`);
});
console.log();

// Example 6: Strict object validation
console.log('🔒 Example 6: Strict Object Validation');
const strictSchema = Schema.object({
  name: Schema.string(),
  age: Schema.number()
}).strict();

console.log('Valid strict object:', strictSchema.validate({ name: 'John', age: 30 }));
console.log('Invalid strict object (extra properties):', 
  strictSchema.validate({ name: 'John', age: 30, extra: 'not allowed' }));
console.log();

// Example 7: Date validation
console.log('📅 Example 7: Date Validation');
const eventDateValidator = Schema.date()
  .min(new Date('2024-01-01'))
  .max(new Date('2024-12-31'));

console.log('Valid date:', eventDateValidator.validate('2024-06-15'));
console.log('Invalid date (too early):', eventDateValidator.validate('2023-12-31'));
console.log('Invalid date (not a date):', eventDateValidator.validate('not-a-date'));
console.log();

// Example 8: E-commerce order validation
console.log('🛒 Example 8: E-commerce Order Validation');
const productSchema = Schema.object({
  id: Schema.string(),
  name: Schema.string().minLength(1),
  price: Schema.number().min(0),
  quantity: Schema.number().min(1).integer()
});

const orderSchema = Schema.object({
  orderId: Schema.string(),
  customerId: Schema.string(),
  products: Schema.array(productSchema).minLength(1),
  totalAmount: Schema.number().min(0),
  orderDate: Schema.date(),
  status: Schema.string().pattern(/^(pending|confirmed|shipped|delivered|cancelled)$/)
});

const sampleOrder = {
  orderId: 'ORD-2024-001',
  customerId: 'CUST-123',
  products: [
    { id: 'PROD-1', name: 'Laptop', price: 999.99, quantity: 1 },
    { id: 'PROD-2', name: 'Mouse', price: 29.99, quantity: 2 }
  ],
  totalAmount: 1059.97,
  orderDate: new Date().toISOString(),
  status: 'pending'
};

console.log('Order validation result:');
const orderResult = orderSchema.validate(sampleOrder);
console.log('Success:', orderResult.success);
if (!orderResult.success) {
  console.log('Errors:', orderResult.errors);
}
console.log();

console.log('🎉 Demo completed! The validation library can handle various data types and complex nested structures.'); 