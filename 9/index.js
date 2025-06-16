const { OpenAI } = require('openai');
const readlineSync = require('readline-sync');
const fs = require('fs');
require('dotenv').config();

class ServiceAnalyzer {
    constructor() {
        if (!process.env.OPENAI_API_KEY) {
            console.error('❌ Error: OPENAI_API_KEY not found in environment variables.');
            console.error('Please create a .env file with your OpenAI API key.');
            console.error('Example: OPENAI_API_KEY=your_api_key_here');
            process.exit(1);
        }
        
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });
    }

    createPrompt(input, isServiceName = false) {
        const systemPrompt = `You are a professional service analyst. Your task is to analyze services and create comprehensive, well-structured markdown reports.

IMPORTANT: Always respond with a complete markdown report that includes ALL the following sections:

# Service Analysis Report

## Brief History
- Founding year, milestones, key events

## Target Audience
- Primary user segments and demographics

## Core Features
- Top 2-4 key functionalities

## Unique Selling Points
- Key differentiators from competitors

## Business Model
- How the service makes money

## Tech Stack Insights
- Technologies used (if known or can be inferred)

## Perceived Strengths
- Mentioned positives or standout features

## Perceived Weaknesses
- Cited drawbacks or limitations

Format your response as clean, professional markdown. Be comprehensive but concise.`;

        const userPrompt = isServiceName ? 
            `Analyze the service "${input}" and provide a comprehensive analysis report.` :
            `Analyze the following service description and provide a comprehensive analysis report:\n\n${input}`;

        return { systemPrompt, userPrompt };
    }

    async analyzeService(input, isServiceName = false) {
        try {
            console.log('🔍 Analyzing service...');
            
            const { systemPrompt, userPrompt } = this.createPrompt(input, isServiceName);
            
            const response = await this.openai.chat.completions.create({
                model: "gpt-4.1-mini",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userPrompt }
                ],
                max_tokens: 2000,
                temperature: 0.7
            });

            return response.choices[0].message.content;
        } catch (error) {
            console.error('❌ Error calling OpenAI API:', error.message);
            if (error.message.includes('403') && error.message.includes('not supported')) {
                console.log('\n🌍 It appears OpenAI API is not available in your region.');
                console.log('💡 You can still see how the app works by running: npm run demo');
            }
            throw error;
        }
    }

    saveReport(report, filename) {
        try {
            if (!fs.existsSync('reports')) {
                fs.mkdirSync('reports');
            }
            
            const filepath = `reports/${filename}`;
            fs.writeFileSync(filepath, report);
            console.log(`📄 Report saved to: ${filepath}`);
        } catch (error) {
            console.error('❌ Error saving report:', error.message);
        }
    }

    displayMenu() {
        console.log('\n=== 🔍 Service Analyzer ===');
        console.log('1. Analyze a known service (e.g., "Spotify", "Notion")');
        console.log('2. Analyze service description text');
        console.log('3. Exit');
        console.log('============================\n');
    }

    async run() {
        console.log('🚀 Welcome to Service Analyzer!');
        console.log('This tool uses AI to generate comprehensive service analysis reports.\n');

        while (true) {
            this.displayMenu();
            
            const choice = readlineSync.question('Select an option (1-3): ');
            
            switch (choice) {
                case '1':
                    await this.handleServiceNameAnalysis();
                    break;
                case '2':
                    await this.handleServiceDescriptionAnalysis();
                    break;
                case '3':
                    console.log('👋 Goodbye!');
                    return;
                default:
                    console.log('❌ Invalid choice. Please select 1, 2, or 3.');
            }
        }
    }

    async handleServiceNameAnalysis() {
        const serviceName = readlineSync.question('\nEnter the service name (e.g., Spotify, Notion): ');
        
        if (!serviceName.trim()) {
            console.log('❌ Service name cannot be empty.');
            return;
        }

        try {
            const report = await this.analyzeService(serviceName.trim(), true);
            
            console.log('\n' + '='.repeat(60));
            console.log('📊 ANALYSIS REPORT');
            console.log('='.repeat(60));
            console.log(report);
            console.log('='.repeat(60));
            
            const save = readlineSync.keyInYNStrict('\nWould you like to save this report to a file?');
            if (save) {
                const filename = `${serviceName.toLowerCase().replace(/\s+/g, '_')}_analysis_${Date.now()}.md`;
                this.saveReport(report, filename);
            }
            
        } catch (error) {
            console.log('❌ Failed to analyze service. Please try again.');
        }
    }

    async handleServiceDescriptionAnalysis() {
        console.log('\nEnter the service description (press Enter twice to finish):');
        
        let description = '';
        let emptyLines = 0;
        
        while (emptyLines < 2) {
            const line = readlineSync.question('');
            if (line.trim() === '') {
                emptyLines++;
            } else {
                emptyLines = 0;
                description += line + '\n';
            }
        }
        
        if (!description.trim()) {
            console.log('❌ Service description cannot be empty.');
            return;
        }

        try {
            const report = await this.analyzeService(description.trim(), false);
            
            console.log('\n' + '='.repeat(60));
            console.log('📊 ANALYSIS REPORT');
            console.log('='.repeat(60));
            console.log(report);
            console.log('='.repeat(60));
            
            const save = readlineSync.keyInYNStrict('\nWould you like to save this report to a file?');
            if (save) {
                const filename = `custom_service_analysis_${Date.now()}.md`;
                this.saveReport(report, filename);
            }
            
        } catch (error) {
            console.log('❌ Failed to analyze service. Please try again.');
        }
    }
}

// Main execution
if (require.main === module) {
    const analyzer = new ServiceAnalyzer();
    analyzer.run().catch(console.error);
}

module.exports = ServiceAnalyzer; 