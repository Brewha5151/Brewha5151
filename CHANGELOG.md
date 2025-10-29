# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-01-15

### Added
- Initial release of MacWhisper Dictation App
- Real-time audio recording with pause/resume capability
- Multiple audio input device support
- Live audio level monitoring and visualization
- OpenAI Whisper API integration for transcription
- Multi-language support with auto-detection
- Timestamp generation for transcripts
- Confidence scores for transcribed segments
- SQLite database for recording metadata storage
- Recording history with search functionality
- Searchable transcript archive
- Editable transcript interface
- Multiple export formats (TXT, SRT, VTT, PDF)
- Configurable audio settings (sample rate, format)
- Light/Dark theme support
- Global keyboard shortcuts (Cmd/Ctrl+Shift+R for recording)
- Settings panel with API key management
- Tag and notes system for recordings
- Cross-platform support (Windows, macOS, Linux)

### Features

#### Recording
- High-quality audio capture (WAV/MP3)
- Configurable sample rates (16kHz, 44.1kHz, 48kHz)
- Real-time audio level visualization
- Pause/resume without ending session
- Automatic file naming with timestamps
- Recording notes and metadata

#### Transcription
- OpenAI Whisper-1 model support
- Automatic language detection
- Segmented transcripts with timestamps
- Confidence scoring
- Verbose JSON response format

#### User Interface
- Clean, modern design
- Sidebar navigation
- Recording, History, and Settings views
- Transcript editor with timestamp navigation
- Search functionality across all recordings

#### Data Management
- Local SQLite database
- Organized file storage
- Search by title, notes, or transcript content
- Bulk delete operations

### Technical
- Built with Electron 28
- React 18 with TypeScript
- Vite 5 for bundling
- Better-sqlite3 for database
- Web Audio API for recording
- MediaRecorder API
- Cross-platform desktop application

### Documentation
- Comprehensive README with setup instructions
- Detailed USER_GUIDE with tips and troubleshooting
- CONTRIBUTING guidelines
- MIT License
- API integration documentation

---

## Future Releases

### Planned for 1.1.0
- [ ] Real-time streaming transcription
- [ ] Audio playback with transcript synchronization
- [ ] Export to DOCX format
- [ ] Improved error handling and logging
- [ ] System tray integration

### Planned for 1.2.0
- [ ] Speaker diarization
- [ ] Local Whisper model support (offline mode)
- [ ] Cloud sync (Dropbox, Google Drive)
- [ ] Meeting templates
- [ ] Advanced audio editing

### Planned for 2.0.0
- [ ] Mobile companion app
- [ ] Team collaboration features
- [ ] Real-time collaboration
- [ ] Custom vocabulary training
- [ ] Advanced analytics

---

[1.0.0]: https://github.com/yourusername/macwhisper-dictation-app/releases/tag/v1.0.0
