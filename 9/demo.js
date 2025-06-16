// Demo script to showcase the Service Analyzer functionality without requiring an API key
// This is useful for testing and demonstrating the application

class DemoServiceAnalyzer {
    constructor() {
        this.mockResponses = {
            'spotify': `# Service Analysis Report

## Brief History
- Founded in 2006 by Daniel Ek and Martin Lorentzon in Stockholm, Sweden
- Launched publicly in 2008 in several European countries
- Expanded to the United States in 2011
- Went public on the New York Stock Exchange in 2018 via direct listing

## Target Audience
- Music enthusiasts aged 18-34 (primary demographic)
- Podcast listeners and creators
- Students and young professionals
- Global audience across 180+ markets

## Core Features
- On-demand music streaming with 100+ million tracks
- Personalized playlists and recommendations
- Podcast hosting and streaming platform
- Social features for sharing and collaborative playlists

## Unique Selling Points
- Superior music discovery algorithms
- Extensive podcast ecosystem
- Freemium model with both free and premium tiers
- Cross-platform availability

## Business Model
- Freemium subscription model
- Premium subscriptions at $9.99/month
- Advertising revenue from free-tier users
- Revenue sharing with artists and record labels

## Tech Stack Insights
- Backend built on Java and Python
- Uses Apache Kafka for real-time data streaming
- Google Cloud Platform for infrastructure
- Machine learning for recommendation systems

## Perceived Strengths
- Industry-leading music discovery algorithms
- Vast music library
- User-friendly interface
- Regular feature updates

## Perceived Weaknesses
- Lower artist payout rates
- Limited high-fidelity audio options
- Regional content availability varies
- Free tier limitations`,

            'notion': `# Service Analysis Report

## Brief History
- Founded in 2016 by Ivan Zhao and Simon Last
- Started as a simple note-taking app
- Evolved into an all-in-one workspace platform
- Raised significant funding and gained popularity during remote work boom

## Target Audience
- Knowledge workers and productivity enthusiasts
- Teams and organizations needing collaborative tools
- Students and academics
- Content creators and project managers

## Core Features
- Note-taking and documentation
- Database and spreadsheet functionality
- Project management and task tracking
- Team collaboration and sharing

## Unique Selling Points
- Block-based editing system
- Highly customizable workspace
- Combines multiple productivity tools in one platform
- Template library and community

## Business Model
- Freemium subscription model
- Tiered pricing for individuals and teams
- Enterprise solutions for large organizations
- Template marketplace

## Tech Stack Insights
- React-based frontend
- Cloud-native architecture
- Real-time collaboration technology
- Cross-platform synchronization

## Perceived Strengths
- Flexibility and customization options
- All-in-one workspace solution
- Strong community and templates
- Continuous feature development

## Perceived Weaknesses
- Steep learning curve for new users
- Performance issues with large databases
- Limited offline functionality
- Can become cluttered without organization`
        };
    }

    getMockResponse(serviceName) {
        const key = serviceName.toLowerCase();
        return this.mockResponses[key] || this.generateGenericResponse(serviceName);
    }

    generateGenericResponse(serviceName) {
        return `# Service Analysis Report

## Brief History
- ${serviceName} is a digital service/platform
- Information about founding and milestones would be analyzed from input
- Key developments and growth phases would be identified

## Target Audience
- Primary user segments would be identified from service description
- Demographics and user characteristics would be analyzed
- Market positioning would be determined

## Core Features
- Key functionalities would be extracted from service information
- Primary features and capabilities would be listed
- User-facing features would be highlighted

## Unique Selling Points
- Competitive advantages would be identified
- Differentiating factors would be analyzed
- Value propositions would be extracted

## Business Model
- Revenue streams would be analyzed
- Monetization strategies would be identified
- Pricing models would be discussed

## Tech Stack Insights
- Technology choices would be inferred
- Technical architecture insights would be provided
- Platform and infrastructure details would be analyzed

## Perceived Strengths
- Positive aspects would be identified
- Competitive advantages would be highlighted
- User benefits would be analyzed

## Perceived Weaknesses
- Potential limitations would be identified
- Areas for improvement would be discussed
- Competitive disadvantages would be analyzed`;
    }

    displayReport(serviceName) {
        console.log('🔍 Analyzing service... (Demo Mode)');
        console.log('\n' + '='.repeat(60));
        console.log('📊 ANALYSIS REPORT (DEMO)');
        console.log('='.repeat(60));
        
        const report = this.getMockResponse(serviceName);
        console.log(report);
        
        console.log('='.repeat(60));
        console.log('\n📝 This is a demo report. In the real application, this would be generated by OpenAI API.');
    }

    async runDemo() {
        console.log('🚀 Service Analyzer - Demo Mode');
        console.log('This demo shows how the application works without needing an API key.\n');

        console.log('Example 1: Analyzing Spotify');
        console.log('='.repeat(40));
        this.displayReport('Spotify');

        console.log('\n\nExample 2: Analyzing Notion');
        console.log('='.repeat(40));
        this.displayReport('Notion');

        console.log('\n\n🎯 To use the real application:');
        console.log('1. Get an OpenAI API key from https://platform.openai.com/');
        console.log('2. Create a .env file with: OPENAI_API_KEY=your_key_here');
        console.log('3. Run: npm start');
        console.log('\n✨ The real application provides detailed, AI-generated analysis for any service!');
    }
}

// Run demo if this file is executed directly
if (require.main === module) {
    const demo = new DemoServiceAnalyzer();
    demo.runDemo().catch(console.error);
}

module.exports = DemoServiceAnalyzer; 