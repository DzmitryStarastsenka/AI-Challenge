require('dotenv').config();
const OpenAI = require('openai');
const readline = require('readline');
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
  name: "return_filtered_products",
  description: "Return a list of products that match the user's search criteria from the provided product database",
  parameters: {
    type: "object",
    properties: {
      matching_products: {
        type: "array",
        description: "Array of products that match the user's criteria",
        items: {
          type: "object",
          properties: {
            name: { type: "string", description: "Product name" },
            category: { type: "string", description: "Product category" },
            price: { type: "number", description: "Product price" },
            rating: { type: "number", description: "Product rating" },
            in_stock: { type: "boolean", description: "Whether product is in stock" }
          },
          required: ["name", "category", "price", "rating", "in_stock"]
        }
      },
      search_criteria_used: {
        type: "string",
        description: "Description of the criteria used to filter the products"
      }
    },
    required: ["matching_products", "search_criteria_used"]
  }
};

// This function is removed - OpenAI will do the filtering directly

// Function to format and display results
function displayResults(products) {
  if (products.length === 0) {
    console.log("\nNo products found matching your criteria.\n");
    return;
  }

  console.log("\nFiltered Products:");
  products.forEach((product, index) => {
    const stockStatus = product.in_stock ? "In Stock" : "Out of Stock";
    console.log(`${index + 1}. ${product.name} - $${product.price}, Rating: ${product.rating}, ${stockStatus}`);
  });
  console.log("");
}

// Main search function using OpenAI
async function processUserQuery(userInput) {
  try {
    console.log("\nProcessing your request...");

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: `You are a product search assistant. Analyze user requests and return matching products from the provided database using the return_filtered_products function.
          
          Here is the complete product database:
          ${JSON.stringify(products, null, 2)}
          
          Your task is to:
          1. Understand the user's search criteria from their natural language input
          2. Filter the products based on their requirements (price, category, rating, stock status, keywords)
          3. Return only the products that match ALL specified criteria
          4. Always call the return_filtered_products function with the matching products
          
          Consider these aspects when filtering:
          - Price ranges (under, over, between amounts)
          - Product categories (Electronics, Fitness, Kitchen, Books, Clothing)
          - Quality requirements (ratings)
          - Stock availability needs
          - Specific product types or features (keywords in product names)
          
          Return the actual product objects that match the criteria, not just criteria parameters.`
        },
        {
          role: "user",
          content: userInput
        }
      ],
      functions: [productSearchFunction],
      function_call: { name: "return_filtered_products" }
    });

    const functionCall = completion.choices[0].message.function_call;
    
    if (functionCall && functionCall.name === "return_filtered_products") {
      const result = JSON.parse(functionCall.arguments);
      console.log("Search criteria used:", result.search_criteria_used);
      
      displayResults(result.matching_products);
      
      return result.matching_products;
    } else {
      console.log("Sorry, I couldn't understand your search request. Please try again.");
      return [];
    }

  } catch (error) {
    console.error("Error processing your request:", error.message);
    if (error.message.includes('API key')) {
      console.log("Please make sure your OPENAI_API_KEY environment variable is set.");
    }
    return [];
  }
}

// Console interface
function startConsoleInterface() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log("=== Product Search Tool ===");
  console.log("Powered by OpenAI Function Calling");
  console.log("\nExample queries:");
  console.log("• 'I need electronics under $100 that are in stock'");
  console.log("• 'Show me fitness equipment with rating above 4.5'");
  console.log("• 'Find kitchen appliances between $50 and $200'");
  console.log("• 'I want books about programming'");
  console.log("• 'Show me clothing items under $30'");
  console.log("\nType 'quit' to exit.\n");

  function askForInput() {
    rl.question("What products are you looking for? ", async (input) => {
      if (input.toLowerCase() === 'quit') {
        console.log("Thanks for using Product Search Tool!");
        rl.close();
        return;
      }

      if (!input.trim()) {
        console.log("Please enter a search query.");
        askForInput();
        return;
      }

      await processUserQuery(input);
      askForInput();
    });
  }

  askForInput();
}

// Check for API key and start the application
if (!process.env.OPENAI_API_KEY) {
  console.error("Error: OPENAI_API_KEY environment variable is not set.");
  console.log("Please set your OpenAI API key as an environment variable:");
  console.log("export OPENAI_API_KEY='your-api-key-here'");
  process.exit(1);
}

// Start the application
startConsoleInterface(); 