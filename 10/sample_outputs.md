# Sample Outputs - Product Search Tool

This document demonstrates various usage scenarios of the Product Search Tool using OpenAI's function calling capabilities.

## Sample Run 1: Electronics Under Budget

**User Query**: `"I need electronics under $200 that are in stock"`

**Console Output**:
```
=== Product Search Tool ===
Powered by OpenAI Function Calling

Example queries:
• 'I need electronics under $100 that are in stock'
• 'Show me fitness equipment with rating above 4.5'
• 'Find kitchen appliances between $50 and $200'
• 'I want books about programming'
• 'Show me clothing items under $30'

Type 'quit' to exit.

What products are you looking for? I need electronics under $200 that are in stock

Processing your request...
Search criteria: {
  "category": "Electronics",
  "max_price": 200,
  "in_stock_only": true
}

Filtered Products:
1. Wireless Headphones - $99.99, Rating: 4.5, In Stock
2. Smart Watch - $199.99, Rating: 4.6, In Stock
3. Bluetooth Speaker - $49.99, Rating: 4.4, In Stock
4. Gaming Mouse - $59.99, Rating: 4.3, In Stock
5. External Hard Drive - $89.99, Rating: 4.4, In Stock
6. Portable Charger - $29.99, Rating: 4.2, In Stock
```

**Analysis**: The AI correctly identified:
- Category: Electronics
- Price constraint: Under $200 (max_price: 200)
- Stock requirement: Only in-stock items (in_stock_only: true)

## Sample Run 2: High-Quality Fitness Equipment

**User Query**: `"Show me fitness equipment with rating above 4.5"`

**Console Output**:
```
What products are you looking for? Show me fitness equipment with rating above 4.5

Processing your request...
Search criteria: {
  "category": "Fitness",
  "min_rating": 4.5
}

Filtered Products:
1. Treadmill - $899.99, Rating: 4.6, Out of Stock
2. Dumbbell Set - $149.99, Rating: 4.7, In Stock
3. Exercise Bike - $499.99, Rating: 4.5, In Stock
4. Foam Roller - $24.99, Rating: 4.5, In Stock
```

**Analysis**: The AI correctly identified:
- Category: Fitness
- Quality requirement: Rating above 4.5 (min_rating: 4.5)
- No stock or price constraints specified

## Sample Run 3: Kitchen Appliances in Price Range

**User Query**: `"Find kitchen appliances between $50 and $150"`

**Console Output**:
```
What products are you looking for? Find kitchen appliances between $50 and $150

Processing your request...
Search criteria: {
  "category": "Kitchen",
  "min_price": 50,
  "max_price": 150
}

Filtered Products:
1. Air Fryer - $89.99, Rating: 4.6, In Stock
2. Microwave Oven - $129.99, Rating: 4.5, Out of Stock
3. Coffee Maker - $79.99, Rating: 4.3, In Stock
4. Rice Cooker - $59.99, Rating: 4.3, In Stock
5. Pressure Cooker - $99.99, Rating: 4.7, In Stock
```

**Analysis**: The AI correctly identified:
- Category: Kitchen
- Price range: Between $50 and $150 (min_price: 50, max_price: 150)

## Sample Run 4: Books with Specific Keywords

**User Query**: `"I want books about programming or science"`

**Console Output**:
```
What products are you looking for? I want books about programming or science

Processing your request...
Search criteria: {
  "category": "Books",
  "keywords": ["programming", "science"]
}

Filtered Products:
1. Programming Guide - $49.99, Rating: 4.7, In Stock
2. History of Science - $39.99, Rating: 4.6, In Stock
```

**Analysis**: The AI correctly identified:
- Category: Books
- Keywords: ["programming", "science"]
- The system found books containing these keywords in their names

## Sample Run 5: Budget Clothing Items

**User Query**: `"Show me clothing items under $30"`

**Console Output**:
```
What products are you looking for? Show me clothing items under $30

Processing your request...
Search criteria: {
  "category": "Clothing",
  "max_price": 30
}

Filtered Products:
1. Men's T-Shirt - $14.99, Rating: 4.2, In Stock
2. Women's Sandals - $29.99, Rating: 4.2, In Stock
3. Women's Scarf - $19.99, Rating: 4.3, In Stock
4. Men's Socks - $9.99, Rating: 4.1, In Stock
5. Women's Hat - $24.99, Rating: 4.4, In Stock
```

**Analysis**: The AI correctly identified:
- Category: Clothing
- Price constraint: Under $30 (max_price: 30)

## Sample Run 6: Complex Multi-Criteria Search

**User Query**: `"I need headphones with good ratings that are in stock"`

**Console Output**:
```
What products are you looking for? I need headphones with good ratings that are in stock

Processing your request...
Search criteria: {
  "keywords": ["headphones"],
  "min_rating": 4.3,
  "in_stock_only": true
}

Filtered Products:
1. Wireless Headphones - $99.99, Rating: 4.5, In Stock
2. Noise-Cancelling Headphones - $299.99, Rating: 4.8, In Stock
```

**Analysis**: The AI correctly identified:
- Keywords: ["headphones"] to search for headphone products
- Quality requirement: "good ratings" interpreted as min_rating: 4.3
- Stock requirement: in_stock_only: true

## Sample Run 7: No Results Found

**User Query**: `"Find gaming laptops under $500 that are in stock"`

**Console Output**:
```
What products are you looking for? Find gaming laptops under $500 that are in stock

Processing your request...
Search criteria: {
  "keywords": ["gaming", "laptop"],
  "max_price": 500,
  "in_stock_only": true
}

No products found matching your criteria.
```

**Analysis**: The AI correctly structured the search but no products matched all criteria:
- Gaming laptop costs $1299.99 (over budget)
- Gaming laptop is out of stock
- This demonstrates the system's ability to handle edge cases

## Key Observations

1. **Natural Language Understanding**: The AI successfully interprets various phrasings and converts them to structured search parameters.

2. **Flexible Parameter Mapping**: Different query styles are handled appropriately:
   - Price ranges ("under $200", "between $50 and $150")
   - Quality requirements ("good ratings", "rating above 4.5")
   - Availability ("in stock", "available")
   - Categories (explicitly mentioned or inferred)

3. **Keyword Extraction**: The AI can identify product-specific terms and use them as search keywords.

4. **Edge Case Handling**: The system gracefully handles cases where no products match the criteria.

5. **Consistent Output Format**: All results follow the same clear format for easy reading.

## Usage Tips

- Be specific about your requirements for better results
- Mention price ranges, ratings, and stock requirements explicitly
- Use natural language - the AI handles various phrasings well
- If no results are found, try broadening your criteria
- Type 'quit' to exit the application at any time