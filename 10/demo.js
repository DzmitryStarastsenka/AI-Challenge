require('dotenv').config();
const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');

// Check for API key first
if (!process.env.OPENAI_API_KEY) {
  console.error("Error: OPENAI_API_KEY environment variable is not set.");
  console.log("Please set your OpenAI API key using one of these methods:");
  console.log("1. Create a .env file in this directory with: OPENAI_API_KEY=your-api-key-here");
  console.log("2. Set environment variable:");
  console.log("   Windows (PowerShell): $env:OPENAI_API_KEY='your-api-key-here'");
  console.log("   Windows (Command Prompt): set OPENAI_API_KEY=your-api-key-here");
  console.log("   macOS/Linux: export OPENAI_API_KEY='your-api-key-here'");
  process.exit(1);
}

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Load products data
const products = JSON.parse(fs.readFileSync(path.join(__dirname, 'products.json'), 'utf8'));

// Function schema for OpenAI function calling
const productSearchFunction = {
  name: "search_products",
  description: "Search and filter products based on user preferences",
  parameters: {
    type: "object",
    properties: {
      category: {
        type: "string",
        description: "Product category (Electronics, Fitness, Kitchen, Books, Clothing)",
        enum: ["Electronics", "Fitness", "Kitchen", "Books", "Clothing"]
      },
      max_price: {
        type: "number",
        description: "Maximum price for the product"
      },
      min_price: {
        type: "number",
        description: "Minimum price for the product"
      },
      min_rating: {
        type: "number",
        description: "Minimum rating for the product"
      },
      in_stock_only: {
        type: "boolean",
        description: "Whether to include only products that are in stock"
      },
      keywords: {
        type: "array",
        items: { type: "string" },
        description: "Keywords to search for in product names"
      }
    },
    required: []
  }
};

// Function to actually search products based on criteria
function searchProducts(criteria) {
  let filteredProducts = [...products];

  // Filter by category
  if (criteria.category) {
    filteredProducts = filteredProducts.filter(product => 
      product.category.toLowerCase() === criteria.category.toLowerCase()
    );
  }

  // Filter by price range
  if (criteria.max_price !== undefined) {
    filteredProducts = filteredProducts.filter(product => 
      product.price <= criteria.max_price
    );
  }

  if (criteria.min_price !== undefined) {
    filteredProducts = filteredProducts.filter(product => 
      product.price >= criteria.min_price
    );
  }

  // Filter by minimum rating
  if (criteria.min_rating !== undefined) {
    filteredProducts = filteredProducts.filter(product => 
      product.rating >= criteria.min_rating
    );
  }

  // Filter by stock availability
  if (criteria.in_stock_only) {
    filteredProducts = filteredProducts.filter(product => 
      product.in_stock === true
    );
  }

  // Filter by keywords
  if (criteria.keywords && criteria.keywords.length > 0) {
    filteredProducts = filteredProducts.filter(product => 
      criteria.keywords.some(keyword => 
        product.name.toLowerCase().includes(keyword.toLowerCase())
      )
    );
  }

  return filteredProducts;
}

// Function to format and display results
function displayResults(products, queryDescription) {
  console.log(`\n=== Results for: "${queryDescription}" ===`);
  if (products.length === 0) {
    console.log("No products found matching your criteria.\n");
    return;
  }

  console.log("Filtered Products:");
  products.forEach((product, index) => {
    const stockStatus = product.in_stock ? "In Stock" : "Out of Stock";
    console.log(`${index + 1}. ${product.name} - $${product.price}, Rating: ${product.rating}, ${stockStatus}`);
  });
  console.log("");
}

// Demo function using OpenAI
async function runDemo(userInput, description) {
  try {
    console.log(`\nProcessing query: "${userInput}"`);

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a product search assistant. Analyze user requests and call the search_products function with appropriate parameters to filter products. 
          
          Available product categories: Electronics, Fitness, Kitchen, Books, Clothing
          
          Consider these aspects when parsing user input:
          - Price ranges (under, over, between amounts)
          - Product categories mentioned
          - Quality requirements (ratings)
          - Stock availability needs
          - Specific product types or features (as keywords)
          
          Always call the search_products function with the most appropriate criteria based on the user's natural language input.`
        },
        {
          role: "user",
          content: userInput
        }
      ],
      functions: [productSearchFunction],
      function_call: { name: "search_products" }
    });

    const functionCall = completion.choices[0].message.function_call;
    
    if (functionCall && functionCall.name === "search_products") {
      const searchCriteria = JSON.parse(functionCall.arguments);
      console.log("AI-generated search criteria:", JSON.stringify(searchCriteria, null, 2));
      
      const results = searchProducts(searchCriteria);
      displayResults(results, description);
      
      return results;
    } else {
      console.log("Could not process the search request.");
      return [];
    }

  } catch (error) {
    console.error("Error in demo:", error.message);
    return [];
  }
}

// Run multiple demo queries
async function runAllDemos() {
  if (!process.env.OPENAI_API_KEY) {
    console.error("Error: OPENAI_API_KEY environment variable is not set.");
    console.log("Please set your OpenAI API key as an environment variable:");
    console.log("Windows: set OPENAI_API_KEY=your-api-key-here");
    console.log("macOS/Linux: export OPENAI_API_KEY='your-api-key-here'");
    process.exit(1);
  }

  console.log("=== Product Search AI Demo ===");
  console.log("Demonstrating OpenAI Function Calling for Product Search\n");

  const demoQueries = [
    {
      query: "I need electronics under $200 that are in stock",
      description: "Electronics under $200, in stock only"
    },
    {
      query: "Show me fitness equipment with rating above 4.5",
      description: "Fitness equipment with high ratings"
    },
    {
      query: "Find kitchen appliances between $50 and $150",
      description: "Kitchen appliances in specific price range"
    },
    {
      query: "I want books about programming or science",
      description: "Books related to programming or science"
    },
    {
      query: "Show me headphones with good ratings",
      description: "Quality headphones"
    }
  ];

  for (const demo of demoQueries) {
    await runDemo(demo.query, demo.description);
    // Add a small delay between queries
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log("=== Demo Complete ===");
}

// Run the demo
runAllDemos().catch(console.error); 