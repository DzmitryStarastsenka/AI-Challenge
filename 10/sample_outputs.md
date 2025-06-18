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
Search criteria used: Category is Electronics, price under $200, and must be in stock.

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
Search criteria used: Filter for products in the Fitness category with rating above 4.5

Filtered Products:
1. Dumbbell Set - $149.99, Rating: 4.7, In Stock
2. Exercise Bike - $499.99, Rating: 4.5, In Stock
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
Search criteria used: Filtered kitchen appliances with prices between $50 and $150.

Filtered Products:
1. Air Fryer - $89.99, Rating: 4.6, In Stock
2. Pressure Cooker - $99.99, Rating: 4.7, In Stock
```

**Analysis**: The AI correctly identified:
- Category: Kitchen
- Price range: Between $50 and $150 (min_price: 50, max_price: 150)

## Key Observations

1. **Natural Language Understanding**: The AI successfully interprets various phrasings and converts them to structured search parameters.

2. **Flexible Parameter Mapping**: Different query styles are handled appropriately:
   - Price ranges ("under $200", "between $50 and $150")
   - Quality requirements ("rating above 4.5")
   - Availability ("in stock", "available")
   - Categories (explicitly mentioned or inferred)

3. **AI-Powered Filtering**: OpenAI performs all filtering logic directly - no manual filtering code is used.

4. **Consistent Output Format**: All results follow the same clear format for easy reading.

## Usage Tips

- Be specific about your requirements for better results
- Mention price ranges, ratings, and stock requirements explicitly
- Use natural language - the AI handles various phrasings well
- If no results are found, try broadening your criteria
- Type 'quit' to exit the application at any time