#!/usr/bin/env node

const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

class AudioTranscriptionTool {
    constructor() {
        // Initialize OpenAI client
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
        
        // Ensure transcriptions directory exists
        this.transcriptionsDir = path.join(__dirname, 'transcriptions');
        if (!fs.existsSync(this.transcriptionsDir)) {
            fs.mkdirSync(this.transcriptionsDir);
        }
    }

    /**
     * Transcribe audio file using OpenAI Whisper
     */
    async transcribeAudio(audioFilePath) {
        try {
            console.log('🎵 Transcribing audio file...');
            
            const transcription = await this.openai.audio.transcriptions.create({
                file: fs.createReadStream(audioFilePath),
                model: "whisper-1",
                response_format: "text"
            });

            console.log('✅ Transcription completed!');
            return transcription;
        } catch (error) {
            console.error('❌ Error transcribing audio:', error.message);
            throw error;
        }
    }

    /**
     * Generate summary using GPT
     */
    async generateSummary(transcription) {
        try {
            console.log('📝 Generating summary...');
            
            const response = await this.openai.chat.completions.create({
                model: "gpt-4.1-mini",
                messages: [
                    {
                        role: "system",
                        content: "You are a professional summarizer. Create a concise, well-structured summary that captures the key points and main takeaways from the provided transcript. Focus on the most important information and maintain the original context and meaning."
                    },
                    {
                        role: "user",
                        content: `Please summarize the following transcript:\n\n${transcription}`
                    }
                ],
                max_tokens: 500,
                temperature: 0.3
            });

            console.log('✅ Summary generated!');
            return response.choices[0].message.content;
        } catch (error) {
            console.error('❌ Error generating summary:', error.message);
            throw error;
        }
    }

    /**
     * Extract analytics from transcription
     */
    async extractAnalytics(transcription) {
        try {
            console.log('📊 Extracting analytics...');
            
            const response = await this.openai.chat.completions.create({
                model: "gpt-4.1-mini",
                messages: [
                    {
                        role: "system",
                        content: `You are a text analytics expert. Analyze the provided transcript and return a JSON object with the following structure:
                        {
                            "word_count": number,
                            "speaking_speed_wpm": number (calculate based on estimated duration from content),
                            "frequently_mentioned_topics": [
                                { "topic": "string", "mentions": number }
                            ]
                        }
                        
                        For speaking speed, estimate based on typical speaking patterns and content flow. For topics, identify the most frequently mentioned subjects, concepts, or themes (minimum 3 topics).`
                    },
                    {
                        role: "user",
                        content: `Please analyze this transcript and return the analytics as valid JSON:\n\n${transcription}`
                    }
                ],
                max_tokens: 400,
                temperature: 0.1
            });

            console.log('✅ Analytics extracted!');
            
            // Parse JSON response
            const analyticsText = response.choices[0].message.content;
            let analytics;
            
            try {
                // Extract JSON from response (in case there's extra text)
                const jsonMatch = analyticsText.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    analytics = JSON.parse(jsonMatch[0]);
                } else {
                    analytics = JSON.parse(analyticsText);
                }
            } catch (parseError) {
                console.warn('⚠️ Could not parse analytics JSON, using fallback calculation');
                analytics = this.fallbackAnalytics(transcription);
            }

            return analytics;
        } catch (error) {
            console.error('❌ Error extracting analytics:', error.message);
            // Return fallback analytics
            return this.fallbackAnalytics(transcription);
        }
    }

    /**
     * Fallback analytics calculation if GPT fails
     */
    fallbackAnalytics(transcription) {
        const words = transcription.split(/\s+/).filter(word => word.length > 0);
        const wordCount = words.length;
        
        // Estimate speaking speed (average is 150-160 WPM)
        const estimatedDurationMinutes = wordCount / 150;
        const speakingSpeed = Math.round(wordCount / estimatedDurationMinutes);

        // Simple topic extraction (most frequent meaningful words)
        const wordFreq = {};
        words.forEach(word => {
            const cleanWord = word.toLowerCase().replace(/[^\w]/g, '');
            if (cleanWord.length > 3) { // Skip short words
                wordFreq[cleanWord] = (wordFreq[cleanWord] || 0) + 1;
            }
        });

        const topics = Object.entries(wordFreq)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([topic, mentions]) => ({ topic, mentions }));

        return {
            word_count: wordCount,
            speaking_speed_wpm: speakingSpeed,
            frequently_mentioned_topics: topics
        };
    }

    /**
     * Save transcription to file
     */
    saveTranscription(transcription, audioFileName) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const baseName = path.basename(audioFileName, path.extname(audioFileName));
        const fileName = `transcription_${baseName}_${timestamp}.md`;
        const filePath = path.join(this.transcriptionsDir, fileName);
        
        const content = `# Transcription for ${audioFileName}\n\n**Generated on:** ${new Date().toLocaleString()}\n\n## Content\n\n${transcription}`;
        
        fs.writeFileSync(filePath, content);
        console.log(`💾 Transcription saved to: ${filePath}`);
        return filePath;
    }

    /**
     * Save analysis results for the provided audio file
     */
    saveProvidedAudioResults(transcription, summary, analytics, audioFileName) {
        // Save transcription.md
        const transcriptionContent = `# Transcription for ${audioFileName}\n\n**Generated on:** ${new Date().toLocaleString()}\n\n## Content\n\n${transcription}`;
        fs.writeFileSync(path.join(__dirname, 'transcription.md'), transcriptionContent);
        
        // Save summary.md
        const summaryContent = `# Summary for ${audioFileName}\n\n**Generated on:** ${new Date().toLocaleString()}\n\n## Summary\n\n${summary}`;
        fs.writeFileSync(path.join(__dirname, 'summary.md'), summaryContent);
        
        // Save analysis.json
        fs.writeFileSync(path.join(__dirname, 'analysis.json'), JSON.stringify(analytics, null, 2));
        
        console.log('📁 Required deliverable files saved:');
        console.log('   - transcription.md');
        console.log('   - summary.md');
        console.log('   - analysis.json');
    }

    /**
     * Process audio file - main workflow
     */
    async processAudio(audioFilePath) {
        try {
            console.log(`\n🚀 Starting audio processing for: ${audioFilePath}`);
            console.log('=' .repeat(50));

            // Check if file exists
            if (!fs.existsSync(audioFilePath)) {
                throw new Error(`Audio file not found: ${audioFilePath}`);
            }

            // Step 1: Transcribe audio
            const transcription = await this.transcribeAudio(audioFilePath);
            
            // Step 2: Generate summary and analytics in parallel
            const [summary, analytics] = await Promise.all([
                this.generateSummary(transcription),
                this.extractAnalytics(transcription)
            ]);

            // Step 3: Save transcription to separate file
            const transcriptionFile = this.saveTranscription(transcription, path.basename(audioFilePath));

            // Step 4: If this is the provided audio file, save required deliverables
            const audioFileName = path.basename(audioFilePath);
            if (audioFileName === 'CAR0004.mp3') {
                this.saveProvidedAudioResults(transcription, summary, analytics, audioFileName);
            }

            // Step 5: Display results
            console.log('\n' + '=' .repeat(50));
            console.log('📋 RESULTS');
            console.log('=' .repeat(50));
            
            console.log('\n📝 SUMMARY:');
            console.log('-' .repeat(30));
            console.log(summary);
            
            console.log('\n📊 ANALYTICS:');
            console.log('-' .repeat(30));
            console.log(JSON.stringify(analytics, null, 2));
            
            console.log(`\n💾 Transcription saved to: ${transcriptionFile}`);
            console.log('\n✅ Processing completed successfully!');

            return {
                transcription,
                summary,
                analytics,
                transcriptionFile
            };

        } catch (error) {
            console.error('\n❌ Error processing audio:', error.message);
            throw error;
        }
    }
}

// Main execution
async function main() {
    console.log('🎵 Audio Transcription & Analysis Tool');
    console.log('Powered by OpenAI Whisper & GPT');
    console.log('=' .repeat(50));

    // Check for API key
    if (!process.env.OPENAI_API_KEY) {
        console.error('❌ Error: OPENAI_API_KEY not found in environment variables');
        console.log('Please create a .env file with your OpenAI API key:');
        console.log('OPENAI_API_KEY=your_api_key_here');
        process.exit(1);
    }

    // Get audio file path from command line arguments
    const audioFilePath = process.argv[2];
    
    if (!audioFilePath) {
        console.log('Usage: node index.js <path_to_audio_file>');
        console.log('Example: node index.js ./CAR0004.mp3');
        console.log('\nProcessing provided sample file...');
        
        // Process the provided sample file
        const sampleFile = path.join(__dirname, 'CAR0004.mp3');
        if (fs.existsSync(sampleFile)) {
            const tool = new AudioTranscriptionTool();
            await tool.processAudio(sampleFile);
        } else {
            console.error('❌ No audio file provided and sample file not found');
            process.exit(1);
        }
    } else {
        // Process specified audio file
        const tool = new AudioTranscriptionTool();
        await tool.processAudio(audioFilePath);
    }
}

// Run the application
if (require.main === module) {
    main().catch(error => {
        console.error('❌ Application error:', error.message);
        process.exit(1);
    });
}

module.exports = AudioTranscriptionTool; 