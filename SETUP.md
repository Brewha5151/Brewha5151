# FourBolt - Meeting Transcription App Setup Guide

This guide will help you set up and run the FourBolt meeting transcription application in your browser with Gemini API integration.

## Features

- **Real-time Audio Recording**: Uses your microphone to capture meeting audio
- **Live Transcription**: Browser-based speech recognition for real-time transcription
- **AI-Powered Summaries**: Gemini API generates intelligent meeting summaries
- **Action Item Extraction**: Automatically identifies tasks and action items
- **Meeting Notes**: Rich text editor for taking notes during meetings
- **Bookmarks**: Mark important moments during recording
- **Multiple Themes**: Choose from different color palettes
- **Speaking Analytics**: Track speaking time and participation

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A modern web browser (Chrome, Edge, or Safari recommended for speech recognition)
- Gemini API key from Google AI Studio

## Installation Steps

### 1. Install Dependencies

First, install all required npm packages:

```bash
npm install
```

If you encounter errors with electron installation (since we're using this for browser only), you can install without optional dependencies:

```bash
npm install --no-optional
```

### 2. Get Your Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

### 3. Configure Environment Variables

1. Create a `.env` file in the project root:

```bash
cp .env.example .env
```

2. Edit the `.env` file and add your Gemini API key:

```env
VITE_GEMINI_API_KEY=your_actual_api_key_here
```

**Important**: The `.env` file is git-ignored to keep your API key secure. Never commit your API key to version control.

### 4. Run the Development Server

Start the Vite development server:

```bash
npm run dev:renderer
```

Or simply:

```bash
npm run dev
```

The application will open at `http://localhost:5173`

### 5. Grant Microphone Permissions

When you first try to record:
1. Your browser will ask for microphone permissions
2. Click "Allow" to enable audio recording
3. You may need to refresh the page after granting permissions

## Usage Guide

### Recording a Meeting

1. **Start Recording**:
   - Click the green "Record" button
   - Grant microphone permissions if prompted
   - The timer will start and live transcription will begin

2. **During Recording**:
   - **Pause/Resume**: Click the "Pause" button to temporarily stop recording
   - **Add Bookmarks**: Click the bookmark icon to mark important moments
   - **Take Notes**: Type in the notes section on the left panel
   - **View Live Transcription**: Watch real-time transcription on the right panel

3. **Stop Recording**:
   - Click the "Stop" button when finished
   - The app will automatically generate an AI summary using Gemini
   - Your meeting will be saved with transcript, notes, and audio data

### Viewing Meetings

1. Click on any meeting in the left sidebar to view details
2. Switch between tabs:
   - **Transcript**: Full meeting transcript with timestamps
   - **Summary**: AI-generated summary with key points
   - **Analytics**: Speaking time and participation metrics

### Managing Action Items

1. Click the checkbox icon in the top navigation to view all action items
2. Filter by status, priority, or assignee
3. Click checkboxes to mark items as complete

### Settings

Click the gear icon to access settings:
- **Color Theme**: Choose your preferred color palette
- **AI Model**: Select the Gemini model to use
- **API Key Status**: Check if your API key is configured

## Browser Compatibility

### Speech Recognition Support

Live transcription uses the Web Speech API:
- ✅ **Chrome/Edge**: Full support
- ✅ **Safari**: Full support
- ❌ **Firefox**: Not currently supported

If speech recognition isn't available, you can still:
- Record audio
- Take notes manually
- Generate AI summaries after recording (requires manual transcript upload)

### Audio Recording Support

All modern browsers support audio recording via MediaRecorder API.

## Troubleshooting

### "API Key Missing" Warning

**Problem**: Red warning badge in the navigation bar

**Solution**:
1. Ensure `.env` file exists in project root
2. Check that `VITE_GEMINI_API_KEY` is set correctly
3. Restart the development server after adding the key
4. The key should start with the prefix provided by Google AI Studio

### Microphone Not Working

**Problem**: Recording starts but no audio levels or transcription

**Solution**:
1. Check browser permissions (usually found in address bar or browser settings)
2. Ensure no other application is using the microphone
3. Try a different browser
4. Check system microphone settings

### Speech Recognition Not Starting

**Problem**: Recording works but transcription doesn't appear

**Solution**:
1. Use Chrome, Edge, or Safari (Firefox doesn't support Web Speech API)
2. Ensure you have an internet connection (speech recognition requires online API)
3. Check browser console for errors (F12)
4. Try speaking clearly and at normal volume

### Gemini API Errors

**Problem**: "Failed to generate summary" message

**Solutions**:
1. Verify API key is correct
2. Check you have API quota remaining at [Google AI Studio](https://makersuite.google.com)
3. Ensure stable internet connection
4. Check browser console for specific error messages

### Build Errors

**Problem**: TypeScript or build errors

**Solution**:
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite

# Restart dev server
npm run dev:renderer
```

## Building for Production

To create a production build:

```bash
npm run build:renderer
```

The built files will be in `dist/renderer/` and can be served by any static file server.

## Project Structure

```
src/renderer/
├── App.tsx                      # Original UI component
├── AppEnhanced.tsx             # Enhanced with real recording (active)
├── main.tsx                    # Entry point
├── utils/
│   ├── audioRecorder.ts        # Web Audio API recording
│   └── geminiTranscription.ts  # Gemini AI integration
└── styles/
    └── global.css              # Global styles
```

## Privacy & Security

- **Audio Data**: Recorded audio is stored locally in browser memory
- **Transcripts**: Speech recognition is processed by browser's online API
- **API Key**: Stored in .env file (never committed to git)
- **Summaries**: Sent to Gemini API for processing

**Note**: Do not record sensitive/confidential information without proper authorization.

## API Costs

Gemini API usage:
- Free tier: 60 requests per minute
- For pricing details, visit [Google AI Pricing](https://ai.google.dev/pricing)

## Support

For issues or questions:
1. Check this guide first
2. Review browser console errors (F12)
3. Verify all prerequisites are met
4. Check Gemini API status and quota

## License

MIT License - See LICENSE file for details

---

**Ready to start?** Run `npm run dev:renderer` and begin recording your first meeting! 🎙️
