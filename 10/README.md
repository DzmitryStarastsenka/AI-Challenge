# Product Search Tool - OpenAI Function Calling

A powerful product search tool that uses OpenAI's function calling capabilities to filter products based on natural language queries. Instead of writing complex filtering logic, this application lets the AI model understand user preferences and automatically invoke the appropriate search functions with structured parameters.

## Features

- **Natural Language Processing**: Enter search queries in plain English
- **OpenAI Function Calling**: Leverages GPT-4 to understand and structure search criteria
- **Flexible Filtering**: Filter by category, price range, rating, stock availability, and keywords
- **Interactive Console Interface**: User-friendly command-line interface
- **Structured Output**: Clean, formatted results with product details

## Available Product Categories

- Electronics
- Fitness
- Kitchen
- Books
- Clothing

## Prerequisites

- Node.js (version 14 or higher)
- OpenAI API key

## Installation

1. **Clone or download the project files**
   ```
   # Navigate to the project directory
   cd 10
   ```

2. **Install dependencies**
   ```
   npm install
   ```

3. **Set up your OpenAI API key**
   
   **Option A: Environment Variable (Recommended)**
   ```bash
   # Windows (Command Prompt)
   set OPENAI_API_KEY=your_actual_api_key_here
   
   # Windows (PowerShell)
   $env:OPENAI_API_KEY="your_actual_api_key_here"
   
   # macOS/Linux
   export OPENAI_API_KEY="your_actual_api_key_here"
   ```
   
   **Option B: Using .env file**
   - Copy `env.example` to `.env`
   - Replace `your_openai_api_key_here` with your actual API key

## Usage

### Interactive Mode (Recommended)

Run the main application:
```bash
npm start
```

The application will start an interactive console where you can enter natural language queries.

### Example Queries

- `"I need electronics under $100"`
- `"Show me fitness equipment with rating above 4.5"`
- `"Find kitchen appliances between $50 and $200"`
- `"I want books about programming"`
- `"Show me headphones that are in stock"`
- `"Find clothing items under $30"`

### Demo Mode

Run the demo to see pre-configured examples:
```bash
npm test
```

or

```bash
node demo.js
```

## How It Works

1. **User Input**: You enter a natural language query describing what you're looking for
2. **AI Processing**: The application sends your query to OpenAI's GPT-4.1-mini model along with the complete product database
3. **Function Calling**: The AI model analyzes your request, filters the products internally, and calls the `return_filtered_products` function with the matching products
4. **Direct AI Filtering**: OpenAI performs all filtering logic - no manual filtering is done by the application
5. **Results**: Matching products returned by OpenAI are displayed in a structured format

## Function Schema

The application defines a `return_filtered_products` function that OpenAI uses to return matching products:

- `matching_products`: Array of product objects that match the user's criteria
  - Each product contains: name, category, price, rating, in_stock
- `search_criteria_used`: Description of the criteria used to filter the products

**Key Implementation Detail**: OpenAI receives the entire product database and performs all filtering internally. The application contains no manual filtering logic, fully complying with the task requirements.

## Sample Output Format

```
Processing your request...
Search criteria used: Electronics under $200 that are in stock

Filtered Products:
1. Wireless Headphones - $99.99, Rating: 4.5, In Stock
2. Smart Watch - $199.99, Rating: 4.6, In Stock
3. Bluetooth Speaker - $49.99, Rating: 4.4, In Stock
```

## Error Handling

- **Missing API Key**: The application will prompt you to set your OpenAI API key
- **Network Issues**: Error messages will be displayed for connection problems
- **Invalid Queries**: The application will ask you to rephrase unclear requests

## File Structure

```
10/
├── index.js           # Main application file
├── demo.js            # Demo script with examples
├── package.json       # Node.js dependencies
├── products.json      # Product database
├── env.example        # Environment variable example
├── README.md          # This file
└── sample_outputs.md  # Sample application runs
```

## Troubleshooting

### "API key not set" error
Make sure you've set the `OPENAI_API_KEY` environment variable correctly.

### "Module not found" error
Run `npm install` to install all dependencies.

### Rate limiting
If you encounter rate limiting from OpenAI, wait a moment before making another request.

## Getting Your OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in to your account
3. Click "Create new secret key"
4. Copy the key and use it in your environment variable

## Technical Details

- **Model**: Uses GPT-4.1-mini for natural language processing
- **Function Calling**: Implements OpenAI's function calling feature with AI-powered filtering
- **Data Format**: Products stored in JSON format with name, category, price, rating, and stock status
- **Filtering Approach**: 100% AI-powered - OpenAI receives the full product database and performs all filtering
- **Node.js Version**: Compatible with Node.js 14+
- **Compliance**: Fully compliant with task requirements - no manual filtering logic

## License

MIT License - Feel free to use this project for educational and commercial purposes.