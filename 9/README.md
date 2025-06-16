# Service Analyzer

A powerful console application that uses OpenAI's GPT model to analyze services and generate comprehensive, markdown-formatted reports from multiple perspectives including business, technical, and user-focused viewpoints.

## Features

- 🔍 **Dual Input Modes**: Analyze known services by name or provide custom service descriptions
- 🤖 **AI-Powered Analysis**: Leverages OpenAI's GPT model for intelligent service analysis
- 📊 **Comprehensive Reports**: Generates structured markdown reports with 8 key sections
- 💾 **Report Export**: Save generated reports to markdown files
- 🎯 **Interactive Console**: User-friendly command-line interface
- 🔒 **Secure**: API keys stored securely in environment variables

## Requirements

- Node.js (version 14 or higher)
- OpenAI API key
- Internet connection for API calls

## Installation

1. **Clone or download the project files**
   ```bash
   cd 9
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up your OpenAI API key**
   
   Create a `.env` file in the project root:
   ```bash
   cp env.example .env
   ```
   
   Edit the `.env` file and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_actual_openai_api_key_here
   ```
   
   **Important**: Never commit your `.env` file to version control!

## Getting Your OpenAI API Key

1. Visit [OpenAI's website](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to the API section
4. Generate a new API key
5. Copy the key and paste it into your `.env` file

## Usage

### Running the Application

**Full Application (requires OpenAI API key):**
```bash
npm start
```

or

```bash
node index.js
```

**Demo Mode (no API key required):**
```bash
npm run demo
```

**Enhanced Demo Mode (realistic AI-style reports):**
```bash
npm run demo-enhanced
```

The demo modes show example reports without making actual API calls. The enhanced demo provides more realistic, comprehensive reports and interactive experience.

### Application Menu

When you run the application, you'll see an interactive menu:

```
=== 🔍 Service Analyzer ===
1. Analyze a known service (e.g., "Spotify", "Notion")
2. Analyze service description text
3. Exit
============================
```

### Option 1: Analyze Known Service

Choose option 1 and enter the name of a well-known service:
- Example: `Spotify`, `Netflix`, `Notion`, `Slack`, `Discord`
- The AI will use its knowledge base to analyze the service

### Option 2: Analyze Service Description

Choose option 2 and enter a custom service description:
- You can paste marketing copy, product descriptions, or any text about a service
- Press Enter twice to finish inputting your description
- The AI will analyze the provided text

### Report Sections

Each generated report includes the following sections:

1. **Brief History** - Founding year, milestones, key events
2. **Target Audience** - Primary user segments and demographics
3. **Core Features** - Top 2-4 key functionalities
4. **Unique Selling Points** - Key differentiators from competitors
5. **Business Model** - How the service makes money
6. **Tech Stack Insights** - Technologies used (if known or can be inferred)
7. **Perceived Strengths** - Mentioned positives or standout features
8. **Perceived Weaknesses** - Cited drawbacks or limitations

### Saving Reports

After generating a report, you'll be asked if you want to save it:
- Reports are saved in the `reports/` directory
- Files are named automatically with timestamps
- All reports are saved in markdown format

## Example Commands

### Analyzing Spotify
```
Select an option (1-3): 1
Enter the service name (e.g., Spotify, Notion): Spotify
```

### Analyzing Custom Service
```
Select an option (1-3): 2
Enter the service description (press Enter twice to finish):
Our platform helps creators monetize their content through subscription-based access. 
We provide tools for video hosting, community building, and payment processing.

```

## Project Structure

```
service-analyzer/
├── index.js              # Main application file
├── demo.js               # Basic demo mode
├── enhanced-demo.js      # Interactive demo with realistic reports
├── package.json          # Project dependencies
├── README.md             # This file
├── env.example           # Environment file template
├── sample_outputs.md     # Sample application runs
├── .gitignore           # Git ignore file
└── reports/             # Generated reports (created automatically)
```

## Dependencies

- **openai**: Official OpenAI API client for Node.js
- **readline-sync**: Synchronous readline for interactive console input
- **dotenv**: Environment variable loader

## Troubleshooting

### Common Issues

1. **"OPENAI_API_KEY not found"**
   - Make sure you created a `.env` file
   - Verify your API key is correctly entered
   - Check that the file is in the same directory as `index.js`

2. **"Error calling OpenAI API"**
   - Verify your API key is valid and active
   - Check your internet connection
   - Ensure you have sufficient API credits

3. **"403 Country, region, or territory not supported"**
   - OpenAI API is not available in all regions
   - Use the demo modes to see how the application works
   - Consider using a VPN if appropriate for your use case

4. **"Module not found"**
   - Run `npm install` to install dependencies
   - Make sure you're in the correct directory

### Getting Help

If you encounter issues:
1. Check that all dependencies are installed
2. Verify your OpenAI API key is valid
3. Ensure you have a stable internet connection
4. Check the console for detailed error messages

## Security Notes

- Never commit your `.env` file or API keys to version control
- Keep your OpenAI API key secure and don't share it
- Monitor your API usage to avoid unexpected charges
- The application uses GPT-3.5-turbo model for cost efficiency

## Sample Outputs

See `sample_outputs.md` for example reports generated by the application.

## License

This project is licensed under the MIT License. 