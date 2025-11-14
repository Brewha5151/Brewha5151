# FourBolt Meeting Transcription App

A powerful browser-based meeting transcription application with **Google Gemini AI** integration for accurate speech-to-text, built with React, Vite, and TypeScript.

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![Platform](https://img.shields.io/badge/platform-Browser-lightgrey.svg)
![Gemini](https://img.shields.io/badge/AI-Google%20Gemini%201.5-orange.svg)

## 🎯 Quick Start

Get started in 3 minutes:

1. **Get your free Gemini API key** at [Google AI Studio](https://makersuite.google.com/app/apikey)
2. **Clone and install**:
   ```bash
   git clone <repository-url>
   cd Brewha5151
   npm install
   ```
3. **Configure API key** in `.env`:
   ```env
   VITE_GEMINI_API_KEY=your_api_key_here
   ```
4. **Run the app**:
   ```bash
   npm run dev:renderer
   ```
5. **Open browser** to `http://localhost:5173`

✅ **That's it!** Click Record and start transcribing.

---

## 📸 Screenshots

> **Note**: Screenshots coming soon! See [VISUAL_GUIDE.md](./VISUAL_GUIDE.md) for detailed ASCII diagrams of the interface.

### Main Recording Interface
*Live recording with audio waveform, Gemini AI transcription, and meeting notes*

### Settings Panel
*Choose between Gemini AI or Browser Speech Recognition, select models, and customize themes*

### Meeting Summary View
*AI-generated summaries, action items, and speaker analytics*

---

## ✨ Features

### 🎙️ Dual Transcription Methods

Choose the best method for your needs:

**Option 1: Gemini AI Transcription** (Recommended) ✨
- ✅ High accuracy with Google Gemini 1.5 Flash/Pro
- ✅ Better speaker identification
- ✅ Works in any modern browser
- ✅ Handles technical vocabulary well
- ⚠️ Processes audio every 10 seconds
- ⚠️ Uses API quota (very affordable - ~$0.01 per 10 minutes)

**Option 2: Browser Speech Recognition** 🎤
- ✅ Instant, real-time transcription
- ✅ Completely free (no API usage)
- ✅ No internet required for Chrome
- ⚠️ Less accurate for technical terms
- ⚠️ Chrome/Edge/Safari only (not Firefox)

### 🤖 AI-Powered Features

- **Live Transcription**: See words appear as you speak
- **Speaker Identification**: Automatically detects and labels speakers
- **AI Summaries**: Get instant meeting summaries with Gemini
- **Action Item Extraction**: Automatically identifies tasks and assignments
- **Speaker Analytics**: Track speaking time and participation

### 🎨 Beautiful Interface

- **4 Color Themes**: Medium Gray, Light, Midnight Blue, Retro 90s
- **Live Audio Waveform**: Visual feedback during recording
- **Rich Text Notes**: Take formatted notes during meetings
- **Bookmark System**: Mark important moments
- **Responsive Design**: Works on desktop and tablet

### 📊 Meeting Management

- **Recording Vault**: Browse all past meetings
- **Search & Filter**: Find meetings quickly
- **Tabbed Views**: Transcript, Summary, Analytics
- **Export Options**: Download transcripts in multiple formats
- **Action Items Dashboard**: Track tasks across all meetings

---

## 📦 Installation

### Prerequisites

- **Node.js 18+** and npm ([Download here](https://nodejs.org))
- **Google Gemini API Key** (free tier available)
- **Modern browser**: Chrome, Edge, Safari, or Firefox

### Step-by-Step Setup

#### 1. Get Your Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"** or **"Get API Key"**
4. Copy your API key (starts with `AIza...`)

**Free Tier Includes:**
- 60 requests per minute
- Generous monthly quota
- Perfect for personal use

#### 2. Clone the Repository

```bash
git clone <repository-url>
cd Brewha5151
```

#### 3. Install Dependencies

```bash
npm install
```

**Note**: If you see Electron installation errors, that's expected in this environment. The app will still work in the browser.

#### 4. Configure Your API Key

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` and add your API key:

```env
VITE_GEMINI_API_KEY=AIza...your_actual_key_here
```

**⚠️ Important**:
- Never commit `.env` to git (it's in `.gitignore`)
- Never share your API key publicly

#### 5. Start the Development Server

```bash
npm run dev:renderer
```

The app will start at **http://localhost:5173**

#### 6. Allow Microphone Access

When you click Record for the first time:
1. Browser will ask for microphone permission
2. Click **"Allow"**
3. You're ready to record!

---

## 🎬 Usage Guide

See detailed usage instructions in [USAGE_GUIDE.md](./USAGE_GUIDE.md)

### Quick Recording Workflow

1. **Click "Record"** button (green microphone icon)
2. **Allow microphone access** when prompted
3. **Start speaking** - transcription appears every 10 seconds (Gemini) or instantly (Web Speech)
4. **Take notes** in the left panel during the meeting
5. **Add bookmarks** to mark important moments
6. **Click "Stop"** when finished
7. **Wait for AI summary** to generate automatically

### Choosing Transcription Method

Click **Settings** (gear icon) to choose:

- **Gemini AI Transcription** (Default)
  - Best for: Important meetings, technical discussions
  - Accuracy: High
  - Cost: ~$0.01 per 10 minutes
  - Speed: 10-second chunks

- **Browser Speech Recognition**
  - Best for: Quick notes, casual recordings
  - Accuracy: Medium
  - Cost: Free
  - Speed: Real-time

### Viewing Past Meetings

1. Click any meeting in the left **Recording Vault**
2. Switch between tabs:
   - **Transcript**: Full conversation with timestamps
   - **Summary**: AI-generated key points and decisions
   - **Analytics**: Speaking time charts

---

## 🛠️ Troubleshooting

### "API Key Missing" Warning

**Problem**: Red badge in top navigation

**Solution**:
1. Check `.env` file exists in project root
2. Ensure line reads: `VITE_GEMINI_API_KEY=your_key_here`
3. No quotes, no spaces around `=`
4. Restart dev server: `Ctrl+C` then `npm run dev:renderer`

### No Transcription Appearing

**If using Gemini AI**:
1. Open browser console (`F12`) and check for errors
2. Verify API key is correct (no extra spaces/quotes)
3. Check quota at [Google AI Studio](https://makersuite.google.com)
4. Wait 10 seconds - Gemini processes in chunks
5. Check internet connection

**If using Web Speech**:
1. Use Chrome, Edge, or Safari (Firefox not supported)
2. Check microphone permissions in browser settings
3. Speak clearly and wait 1-2 seconds
4. Try refreshing the page

### Microphone Not Working

**Problem**: No waveform or audio levels showing

**Solution**:
1. Check browser permissions (click lock icon in address bar)
2. Ensure no other app is using microphone (Zoom, Teams, etc.)
3. Try a different browser
4. Check system microphone settings
5. Restart browser

### "Transcription Failed" Error

**Possible causes**:
1. Invalid or expired API key
2. No internet connection
3. API quota exceeded
4. Audio format not supported by browser

**Solution**:
- Check browser console for specific error message
- Verify API key at [Google AI Studio](https://makersuite.google.com)
- Test internet connection
- Try recording a 10-second test meeting

### Build or Install Errors

**"npm install" fails**:
```bash
# Clear cache and retry
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

**Electron errors during install**:
- These are expected in some environments
- The browser app will still work fine
- Safe to ignore if `npm run dev:renderer` works

---

## 📖 Complete Documentation

- **[SETUP.md](./SETUP.md)** - Detailed installation and configuration guide
- **[USAGE_GUIDE.md](./USAGE_GUIDE.md)** - Step-by-step usage instructions
- **[VISUAL_GUIDE.md](./VISUAL_GUIDE.md)** - Visual walkthrough of the interface
- **[SCREENSHOTS_GUIDE.md](./SCREENSHOTS_GUIDE.md)** - How to capture and add screenshots

---

## 💰 Cost & API Usage

### Gemini API Pricing (Free Tier)

**What you get for free**:
- 60 requests per minute
- 1,500 requests per day
- Generous monthly quota

**Typical costs with Gemini 1.5 Flash**:
- 10-minute meeting: ~$0.01 USD
- 30-minute meeting: ~$0.03 USD
- 60-minute meeting: ~$0.06 USD

**Cost comparison**:
- **Gemini 1.5 Flash**: 20x cheaper, recommended for most meetings
- **Gemini 1.5 Pro**: Higher accuracy, use for critical meetings

**Free alternative**: Use Browser Speech Recognition mode (no API costs)

---

## 🏗️ Architecture

### Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite 5
- **AI Service**: Google Gemini 1.5 (Flash/Pro)
- **Audio Recording**: Web Audio API, MediaRecorder API
- **Speech Recognition**: Web Speech API (fallback mode)
- **Icons**: Lucide React
- **Styling**: Inline React styles with theme system

### Project Structure

```
Brewha5151/
├── src/
│   └── renderer/                    # React application
│       ├── AppEnhanced.tsx          # Main application component
│       ├── main.tsx                 # Entry point
│       └── utils/
│           ├── geminiTranscription.ts   # Gemini API integration
│           └── audioRecorder.ts         # Browser audio recording
├── .env                             # API key configuration (gitignored)
├── .env.example                     # Template for .env
├── package.json                     # Dependencies
├── vite.config.ts                   # Vite configuration
├── SETUP.md                         # Installation guide
├── USAGE_GUIDE.md                   # Usage instructions
├── VISUAL_GUIDE.md                  # Visual interface guide
└── README.md                        # This file
```

### How It Works

1. **Recording**: Browser's MediaRecorder API captures microphone audio
2. **Chunking**: Audio split into 10-second chunks (for Gemini mode)
3. **Encoding**: Audio converted to base64 for transmission
4. **Transcription**: Sent to Gemini 1.5 with multimodal API
5. **Parsing**: Response parsed for speaker labels and text
6. **Storage**: Meetings saved in browser localStorage
7. **AI Processing**: Summaries and action items generated on-demand

---

## 🔐 Privacy & Security

- **Audio Recording**: Stored temporarily in browser memory, never uploaded except for transcription
- **Transcripts**: Saved in browser localStorage (not sent to our servers)
- **Gemini API**: Audio chunks sent to Google for processing (see [Google's AI Privacy](https://ai.google.dev/terms))
- **API Key**: Stored in `.env` file (never committed to git)
- **No Backend**: Everything runs in your browser

**⚠️ Important**: Do not record confidential meetings without proper authorization and understanding of data processing policies.

---

## 🚀 Development

### Available Scripts

```bash
# Start development server (browser)
npm run dev:renderer

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check

# Lint code
npm run lint
```

### Browser Compatibility

| Browser | Recording | Gemini | Web Speech |
|---------|-----------|--------|------------|
| Chrome  | ✅        | ✅     | ✅         |
| Edge    | ✅        | ✅     | ✅         |
| Safari  | ✅        | ✅     | ✅         |
| Firefox | ✅        | ✅     | ❌         |

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Test thoroughly in multiple browsers
5. Commit: `git commit -m 'Add amazing feature'`
6. Push: `git push origin feature/amazing-feature`
7. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **[Google Gemini](https://ai.google.dev/)** - AI transcription and summaries
- **[React](https://react.dev/)** - UI framework
- **[Vite](https://vitejs.dev/)** - Build tool and dev server
- **[Lucide](https://lucide.dev/)** - Beautiful icon library
- **[Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)** - Browser audio recording
- **[Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)** - Browser speech recognition

---

## 💬 Support

Need help?

1. **Check Documentation**:
   - [Installation Guide](./SETUP.md)
   - [Usage Guide](./USAGE_GUIDE.md)
   - [Visual Guide](./VISUAL_GUIDE.md)
   - [Troubleshooting](#troubleshooting) (this page)

2. **Common Issues**:
   - API key not working → Check `.env` format
   - No transcription → Wait 10 seconds for first chunk
   - Microphone issues → Check browser permissions

3. **Get Help**:
   - Open an issue on GitHub
   - Check [Google Gemini API docs](https://ai.google.dev/docs)
   - Review browser console for errors (`F12`)

---

## 🎉 What's New in v2.0.0

### Major Features:
- ✨ **Google Gemini 1.5 Integration** - Real audio-to-text transcription
- 🎤 **Dual Transcription Modes** - Choose between Gemini AI or Browser Speech
- ⚡ **Browser-Based** - No desktop installation required
- 🎨 **Visual Feedback** - Live waveform and transcription status
- 📊 **Enhanced Analytics** - Speaker time tracking and insights
- 🔖 **Bookmark System** - Mark important moments during recording
- 💾 **Local Storage** - All data saved in browser (privacy-focused)
- 🎯 **Model Selection** - Choose between Flash (fast) or Pro (accurate)

### Improvements:
- Real-time audio visualization
- 10-second chunk processing for optimal latency
- Automatic speaker identification
- Meeting summaries with Gemini AI
- Action item extraction
- Responsive theme system
- Error handling and retry logic

---

**Built with ❤️ using React, Vite, and Google Gemini AI**

*Start transcribing smarter, not harder.*
