# Audio Transcription & Analysis Tool

A powerful console application that transcribes audio files using OpenAI's Whisper API, generates summaries with GPT, and extracts meaningful analytics from spoken content.

## 🎯 Features

- **Audio Transcription**: High-accuracy speech-to-text using OpenAI Whisper
- **Content Summarization**: Intelligent summarization using GPT-4
- **Analytics Extraction**: Word count, speaking speed (WPM), and topic analysis
- **File Management**: Automatic saving of transcriptions with timestamps
- **Multi-format Support**: Works with various audio formats (MP3, WAV, M4A, etc.)
- **Robust Error Handling**: Fallback analytics if API calls fail

## 🚀 Quick Start

### Prerequisites

- Node.js (version 14 or higher)
- OpenAI API key with access to Whisper and GPT models
- Audio file to transcribe

### Installation

1. **Clone or navigate to the project directory**
   ```bash
   cd 11
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the project root:
   ```bash
   cp env.example .env
   ```
   
   Edit the `.env` file and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_actual_openai_api_key_here
   ```

### Usage

#### Option 1: Process a specific audio file
```bash
node index.js path/to/your/audio/file.mp3
```

#### Option 2: Process the provided sample file
```bash
node index.js
# or
npm start
```

#### Option 3: Using npm script
```bash
npm start path/to/your/audio/file.mp3
```

## 📁 Output Files

The application generates several output files:

### For any audio file:
- **Transcriptions folder**: `transcriptions/transcription_[filename]_[timestamp].md`
  - Contains the full transcription with metadata

### For the provided sample file (CAR0004.mp3):
- **transcription.md**: Full transcription of the provided audio
- **summary.md**: AI-generated summary of the content
- **analysis.json**: Detailed analytics in JSON format

## 📊 Analytics Output

The tool provides comprehensive analytics including:

```json
{
  "word_count": 1280,
  "speaking_speed_wpm": 132,
  "frequently_mentioned_topics": [
    { "topic": "Customer Onboarding", "mentions": 6 },
    { "topic": "Q4 Roadmap", "mentions": 4 },
    { "topic": "AI Integration", "mentions": 3 }
  ]
}
```

## 🛠️ Technical Details

### API Models Used
- **Whisper-1**: OpenAI's speech recognition model for transcription
- **GPT-4.1-mini**: For summarization and analytics extraction

### Supported Audio Formats
- MP3
- WAV
- M4A
- FLAC
- And other formats supported by OpenAI Whisper

### File Size Limits
- Maximum file size: 25 MB (OpenAI Whisper API limit)
- For larger files, consider splitting them first

## 🔧 Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | Yes | Your OpenAI API key |
| `OPENAI_ORG_ID` | No | Your OpenAI organization ID (if applicable) |

### API Settings

The application uses these default settings:
- **Transcription Model**: whisper-1
- **Chat Model**: gpt-4.1-mini
- **Response Format**: text (for transcription)
- **Temperature**: 0.3 (for summary), 0.1 (for analytics)

## 📋 Example Usage

```bash
# Process the provided sample file
$ node index.js

🎵 Audio Transcription & Analysis Tool
Powered by OpenAI Whisper & GPT
==================================================

🚀 Starting audio processing for: CAR0004.mp3
==================================================
🎵 Transcribing audio file...
✅ Transcription completed!
📝 Generating summary...
✅ Summary generated!
📊 Extracting analytics...
✅ Analytics extracted!
💾 Transcription saved to: transcriptions/transcription_CAR0004_2024-01-15T10-30-45-123Z.md
📁 Required deliverable files saved:
   - transcription.md
   - summary.md
   - analysis.json

==================================================
📋 RESULTS
==================================================

📝 SUMMARY:
------------------------------
[AI-generated summary appears here]

📊 ANALYTICS:
------------------------------
{
  "word_count": 856,
  "speaking_speed_wpm": 145,
  "frequently_mentioned_topics": [
    { "topic": "business", "mentions": 12 },
    { "topic": "customers", "mentions": 8 },
    { "topic": "product", "mentions": 6 }
  ]
}

💾 Transcription saved to: transcriptions/transcription_CAR0004_2024-01-15T10-30-45-123Z.md

✅ Processing completed successfully!
```

## 🚨 Error Handling

The application includes robust error handling:

- **Missing API Key**: Clear instructions for setting up environment variables
- **File Not Found**: Validation of audio file paths
- **API Failures**: Graceful degradation with fallback analytics
- **JSON Parsing**: Fallback to local calculations if GPT response is malformed

## 🔒 Security

- API keys are loaded from environment variables (never hardcoded)
- The `.env` file is excluded from version control
- No sensitive data is logged to console

## 📦 Dependencies

- **openai**: Official OpenAI Node.js library
- **dotenv**: Environment variable management
- **fs**: File system operations (built-in)
- **path**: Path utilities (built-in)

## 🐛 Troubleshooting

### Common Issues

1. **"OPENAI_API_KEY not found"**
   - Ensure you've created a `.env` file with your API key
   - Check that the key is valid and has appropriate permissions

2. **"Audio file not found"**
   - Verify the file path is correct
   - Ensure the file exists and is readable

3. **API Rate Limits**
   - Wait a few moments and retry
   - Check your OpenAI account usage limits

4. **Large File Errors**
   - Files must be under 25 MB
   - Consider compressing or splitting large files

### Getting Help

- Check the console output for detailed error messages
- Verify your OpenAI API key has access to Whisper and GPT models
- Ensure your audio file is in a supported format

## 📝 License

MIT License - feel free to use and modify as needed.

## 🤝 Contributing

This is a challenge project, but suggestions and improvements are welcome! 