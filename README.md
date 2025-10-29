# FourBolt

A powerful cross-platform desktop application for audio recording and transcription, built with Electron, React, and OpenAI's Whisper API.

![FourBolt](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey.svg)

## Features

### 🎙️ Audio Recording
- Real-time audio capture from system microphone
- Multiple audio input device support
- Live audio level monitoring and visualization
- Pause/resume recording capability
- High-quality audio encoding (WAV/MP3 formats)
- Configurable sample rates (16kHz, 44.1kHz, 48kHz)

### 📝 AI-Powered Transcription
- Integration with OpenAI Whisper API for accurate transcription
- Multi-language support with automatic language detection
- Timestamp generation for precise navigation
- Confidence scores for transcribed segments
- Real-time and batch processing modes

### 📚 Recording Management
- Named recording sessions with metadata
- Automatic file naming with timestamps
- Searchable recording history
- Tag and category system for organization
- Quick access to past recordings

### ✏️ Transcript Editor
- Editable transcripts with timestamp navigation
- Click timestamps to jump to audio positions
- Search within transcripts
- Multiple export formats (TXT, SRT, VTT, PDF)
- Highlight and annotate sections

### ⚙️ Customization
- Dark/Light theme support
- Configurable audio quality settings
- Custom keyboard shortcuts
- API key management
- Language preferences

## Installation

### Prerequisites
- Node.js 18+ and npm
- OpenAI API key (for transcription features)

### Setup

1. **Clone the repository:**
```bash
git clone https://github.com/yourusername/fourbolt.git
cd fourbolt
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure your API key:**
   - Launch the application
   - Navigate to Settings
   - Enter your OpenAI API key
   - Or set the `OPENAI_API_KEY` environment variable

4. **Run in development mode:**
```bash
npm run dev
```

## Building for Production

### Build for all platforms:
```bash
npm run build
npm run package
```

### Platform-specific builds:

**macOS:**
```bash
npm run package:mac
```

**Windows:**
```bash
npm run package:win
```

**Linux:**
```bash
npm run package:linux
```

The built applications will be available in the `release/` directory.

## Usage

### Recording Audio

1. **Start a Recording:**
   - Click the "Record" tab in the sidebar
   - Enter a title for your recording
   - Select your audio input device
   - (Optional) Add notes about the recording
   - Click "Start Recording"

2. **During Recording:**
   - Monitor the audio levels in real-time
   - Use "Pause" to temporarily stop recording
   - Use "Stop & Save" when finished

3. **After Recording:**
   - The audio is automatically saved
   - Transcription begins immediately (if API key is configured)
   - View your recording in the History tab

### Managing Recordings

1. **View History:**
   - Click the "History" tab
   - Browse all your recordings
   - Use the search bar to find specific recordings
   - Click any recording to view its transcript

2. **Search Recordings:**
   - Enter keywords in the search bar
   - Searches across titles, notes, and transcripts
   - Press Enter or click "Search"
   - Click "Clear" to reset

### Working with Transcripts

1. **View Transcript:**
   - Click a recording from the History view
   - View the full transcript with timestamps
   - Click timestamps to navigate (when audio playback is available)

2. **Edit Transcript:**
   - Click "Edit Mode"
   - Make your changes
   - Click "Save Changes"

3. **Export Transcript:**
   - Choose from multiple formats:
     - **TXT**: Plain text format
     - **SRT**: Subtitle format with timestamps
     - **VTT**: Web video text tracks format
     - **PDF**: Formatted document

### Settings Configuration

1. **Transcription Settings:**
   - **API Key**: Your OpenAI API key for Whisper
   - **Model**: Select Whisper model (whisper-1)
   - **Language**: Choose default language or auto-detect

2. **Audio Settings:**
   - **Sample Rate**: Choose quality (16kHz, 44.1kHz, 48kHz)
   - **Format**: Select WAV or MP3

3. **Appearance:**
   - **Theme**: Toggle between Light and Dark mode

### Keyboard Shortcuts

- `Cmd/Ctrl + Shift + R` - Toggle recording (global shortcut)

## Architecture

### Technology Stack

- **Frontend**: React 18 with TypeScript
- **Desktop Framework**: Electron 28
- **Build Tool**: Vite 5
- **Database**: SQLite (better-sqlite3)
- **Transcription**: OpenAI Whisper API
- **Audio**: Web Audio API, MediaRecorder API

### Project Structure

```
fourbolt/
├── src/
│   ├── main/                 # Electron main process
│   │   ├── main.ts          # Main entry point
│   │   ├── preload.ts       # Preload script for IPC
│   │   └── services/        # Backend services
│   │       ├── AudioRecorder.ts
│   │       ├── DatabaseService.ts
│   │       └── TranscriptionService.ts
│   └── renderer/            # React application
│       ├── components/      # React components
│       │   ├── RecordingView.tsx
│       │   ├── HistoryView.tsx
│       │   ├── TranscriptView.tsx
│       │   └── SettingsView.tsx
│       ├── hooks/          # Custom React hooks
│       ├── styles/         # CSS stylesheets
│       ├── types/          # TypeScript definitions
│       └── App.tsx         # Main app component
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run package` - Create distributable packages
- `npm start` - Run the built application

### Adding New Features

1. **Backend Services** (Main Process):
   - Add new services in `src/main/services/`
   - Register IPC handlers in `src/main/main.ts`
   - Expose APIs in `src/main/preload.ts`

2. **Frontend Components** (Renderer Process):
   - Create components in `src/renderer/components/`
   - Add styles in `src/renderer/styles/`
   - Define types in `src/renderer/types/`

### Database Schema

**Recordings Table:**
```sql
CREATE TABLE recordings (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  filePath TEXT NOT NULL,
  duration INTEGER NOT NULL,
  createdAt TEXT NOT NULL,
  tags TEXT,
  notes TEXT,
  transcript TEXT,
  transcriptSegments TEXT,
  language TEXT,
  modelUsed TEXT
);
```

## API Integration

### OpenAI Whisper API

The app uses the OpenAI Whisper API for transcription. You'll need an API key from [OpenAI Platform](https://platform.openai.com/api-keys).

**Supported Models:**
- `whisper-1` - Most accurate and recommended

**Supported Languages:**
- English, Spanish, French, German, Italian, Portuguese, Dutch
- Auto-detection for any language

**Response Formats:**
- `verbose_json` - Detailed with timestamps and segments (default)
- `json` - Simple text output
- `srt` - SubRip subtitle format
- `vtt` - WebVTT format

## Troubleshooting

### Microphone Access Issues

**macOS:**
1. Go to System Preferences → Security & Privacy → Privacy → Microphone
2. Ensure FourBolt has microphone access

**Windows:**
1. Go to Settings → Privacy → Microphone
2. Allow desktop apps to access your microphone

### Transcription Errors

1. **"API key not set"**: Configure your OpenAI API key in Settings
2. **"Transcription failed"**: Check your internet connection and API key validity
3. **"Audio file not found"**: Ensure recordings are being saved properly

### Audio Recording Issues

1. **No audio devices found**: Check system audio settings
2. **Low audio quality**: Increase sample rate in Settings
3. **Audio level too low**: Position microphone closer or adjust system input volume

## Performance Optimization

### For Long Recordings:
- Use 16kHz sample rate for smaller files
- Choose MP3 format for compression
- Close other applications during recording

### For Better Transcription:
- Record in a quiet environment
- Use a quality microphone
- Speak clearly at moderate pace
- Keep recordings under 25MB for faster processing

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [OpenAI Whisper](https://openai.com/research/whisper) - Speech recognition model
- [Electron](https://www.electronjs.org/) - Desktop application framework
- [React](https://reactjs.org/) - UI library
- [Better SQLite3](https://github.com/WiseLibs/better-sqlite3) - SQLite bindings

## Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check the [Troubleshooting](#troubleshooting) section
- Review [OpenAI API documentation](https://platform.openai.com/docs/api-reference)

## Roadmap

### Planned Features:
- [ ] Real-time streaming transcription
- [ ] Speaker diarization (identify different speakers)
- [ ] Local Whisper model support (no API required)
- [ ] Audio playback with transcript synchronization
- [ ] Cloud sync (Dropbox, Google Drive)
- [ ] Meeting templates and presets
- [ ] Advanced audio editing tools
- [ ] Mobile companion app
- [ ] Team collaboration features

---

**Made with ❤️ using Electron and React**
