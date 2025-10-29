# FourBolt - User Guide

Welcome to FourBolt! This guide will help you get started with recording and transcribing audio.

## Table of Contents
1. [Getting Started](#getting-started)
2. [Recording Your First Audio](#recording-your-first-audio)
3. [Managing Recordings](#managing-recordings)
4. [Working with Transcripts](#working-with-transcripts)
5. [Configuring Settings](#configuring-settings)
6. [Tips and Best Practices](#tips-and-best-practices)
7. [Troubleshooting](#troubleshooting)

## Getting Started

### First Launch

When you first launch FourBolt, you'll see a clean interface with three main sections:
- **Record**: Create new audio recordings
- **History**: View and manage past recordings
- **Settings**: Configure the application

### Setting Up Your API Key

Before you can transcribe audio, you need to configure your OpenAI API key:

1. Click the **Settings** icon in the sidebar (⚙️)
2. In the "OpenAI API Key" field, enter your API key
   - Get an API key from [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
   - It should start with `sk-`
3. Click **Save Settings** at the bottom

Your API key is stored securely on your local machine and is never shared.

## Recording Your First Audio

### Step-by-Step Recording Process

1. **Navigate to Record Tab**
   - Click the Record icon (🎙️) in the sidebar

2. **Configure Your Recording**
   - **Title**: Enter a descriptive name (e.g., "Team Meeting - Jan 15")
   - **Audio Device**: Select your microphone from the dropdown
   - **Notes**: (Optional) Add context or meeting agenda

3. **Start Recording**
   - Click the **Start Recording** button (⏺)
   - The button will turn red and show "Recording"
   - You'll see a live audio level indicator

4. **During Recording**
   - **Audio Level Bar**: Monitor your input levels
   - **Timer**: Watch the elapsed time
   - **Pause Button**: Temporarily stop recording without ending the session
   - **Resume Button**: Continue recording after pausing

5. **Stop and Save**
   - Click **Stop & Save** (⏹) when finished
   - The audio is automatically saved
   - Transcription begins immediately (requires API key)

### Audio Level Monitoring

The audio level bar shows your microphone input:
- **Green/Blue**: Good levels
- **No movement**: Microphone not working or too quiet
- **Consistently maxed**: Too loud, may cause distortion

### Pause vs. Stop

- **Pause**: Temporarily stop without ending
  - Use for breaks, interruptions, or when you need to cough
  - Maintains the same recording session

- **Stop**: End the recording and save
  - Use when completely finished
  - Triggers transcription process

## Managing Recordings

### Viewing Your History

1. Click the **History** icon (📚) in the sidebar
2. You'll see all your recordings as cards showing:
   - Title and date
   - Duration
   - Notes preview
   - Beginning of transcript

### Searching Recordings

The search feature looks through:
- Recording titles
- Notes you've added
- Full transcript text

**To search:**
1. Type your search term in the search bar
2. Press Enter or click **Search**
3. Click **Clear** to show all recordings again

**Search tips:**
- Use specific keywords for better results
- Search for dates, names, or topics
- Searches are case-insensitive

### Deleting Recordings

1. Find the recording you want to delete
2. Click the trash icon (🗑️) in the top right of the card
3. Confirm deletion
4. Both the audio file and database entry are removed

**Warning**: Deletion is permanent and cannot be undone!

## Working with Transcripts

### Viewing a Transcript

1. Go to the **History** tab
2. Click on any recording card
3. The transcript view opens with:
   - Recording title and metadata
   - Your notes (if any)
   - Full transcript with timestamps

### Understanding Transcript Segments

If your transcript shows timestamps:
- **Time marker**: Shows when each segment was spoken
- **Text**: The transcribed words
- **Confidence indicator**:
  - ✓ = High confidence (>90%)
  - ~ = Medium confidence (70-90%)
  - ? = Low confidence (<70%)

### Editing Transcripts

The AI transcription is very accurate but not perfect. You can edit:

1. Click **Edit Mode**
2. Make your corrections in the text area
3. Click **Save Changes** when done
4. Click **Cancel** to discard changes

**When to edit:**
- Technical terms or jargon
- Proper nouns (names, places)
- Specialized vocabulary
- Formatting improvements

### Exporting Transcripts

Click any export button to save in different formats:

**TXT (Plain Text)**
- Simple text file
- No formatting or timestamps
- Best for: General use, copy-pasting

**SRT (SubRip Subtitle)**
- Includes timestamps
- Industry-standard subtitle format
- Best for: Video subtitles, time-coded transcripts

**VTT (WebVTT)**
- Web video text tracks
- Similar to SRT
- Best for: Web videos, HTML5 players

**PDF**
- Formatted document
- Professional appearance
- Best for: Printing, sharing, archiving

## Configuring Settings

### Transcription Settings

**OpenAI API Key**
- Required for transcription
- Stored securely on your device
- Can be updated anytime

**Default Model**
- Currently: Whisper-1 (recommended)
- Most accurate model available
- Optimal balance of speed and quality

**Default Language**
- Set if you primarily speak one language
- Or choose "Auto-detect" for automatic detection
- Improves accuracy for specialized vocabulary

### Audio Settings

**Sample Rate**
- **16 kHz**: Lower quality, smaller files, faster processing
  - Good for: Voice-only content, limited storage
- **44.1 kHz**: CD quality (recommended)
  - Good for: General use, balanced quality/size
- **48 kHz**: Higher quality, larger files
  - Good for: Music, high-fidelity recordings

**Audio Format**
- **WAV**: Uncompressed, highest quality
  - Larger file sizes
  - No quality loss
- **MP3**: Compressed, smaller files
  - ~10x smaller than WAV
  - Minimal quality loss

### Appearance

**Theme**
- **Light**: Bright, clean interface
- **Dark**: Easy on the eyes in low light

The theme changes immediately when selected.

### Keyboard Shortcuts

**Global Shortcuts** (work even when app is in background):
- `Cmd/Ctrl + Shift + R`: Start/stop recording

More shortcuts coming in future updates!

## Tips and Best Practices

### For Better Audio Quality

1. **Environment**
   - Record in a quiet space
   - Close windows to reduce outside noise
   - Turn off fans, AC, or noisy equipment

2. **Microphone Placement**
   - Position 6-12 inches from your mouth
   - Avoid touching or moving the microphone while recording
   - Use a pop filter if available

3. **Speaking Technique**
   - Speak clearly and at a moderate pace
   - Don't rush or mumble
   - Pause between thoughts or sentences

### For Better Transcription

1. **Audio Quality Matters**
   - Clear audio = accurate transcription
   - Reduce background noise
   - Use a good microphone

2. **Language Settings**
   - Set the correct language in Settings
   - Consistent accent/dialect helps
   - Technical terms may need editing

3. **File Size Considerations**
   - Whisper API has a 25MB limit
   - Long recordings may need splitting
   - Use lower sample rates for very long sessions

### Organizing Your Recordings

1. **Use Descriptive Titles**
   - Bad: "Recording 1"
   - Good: "Product Planning Meeting - Q1 2024"

2. **Add Detailed Notes**
   - Meeting attendees
   - Key topics discussed
   - Action items or decisions

3. **Regular Cleanup**
   - Delete old, unnecessary recordings
   - Export important transcripts
   - Keep your library organized

## Troubleshooting

### "No audio devices found"

**macOS:**
1. Go to System Preferences → Security & Privacy → Privacy
2. Select "Microphone" in the left sidebar
3. Ensure FourBolt has a checkmark

**Windows:**
1. Go to Settings → Privacy → Microphone
2. Ensure "Allow apps to access your microphone" is ON
3. Scroll down and enable for desktop apps

**Linux:**
1. Check your audio input settings
2. Ensure PulseAudio or ALSA is configured correctly

### "API key not set" error

1. Go to Settings
2. Enter your OpenAI API key
3. Click Save Settings
4. Try transcribing again

If the error persists:
- Verify your API key is correct
- Check if you have an active OpenAI account
- Ensure your API key has access to the Whisper API

### "Transcription failed" error

**Check Internet Connection:**
- Transcription requires internet
- Verify you can access openai.com

**Verify API Key:**
- Ensure it's entered correctly
- Check for extra spaces
- Verify it starts with `sk-`

**Check API Usage:**
- Log in to OpenAI Platform
- Check if you have available credits
- Review any usage limits

**File Size Issues:**
- Audio must be under 25MB
- Split longer recordings
- Use lower sample rates

### Audio Level Too Low

1. **System Volume:**
   - Check system input volume settings
   - Increase microphone gain

2. **Physical Distance:**
   - Move microphone closer
   - Typically 6-12 inches is optimal

3. **Microphone Settings:**
   - Try a different audio device
   - Check if microphone needs power (phantom power for XLR mics)

### App Won't Start or Crashes

1. **Update the App:**
   - Check for latest version
   - Download and install updates

2. **Check System Requirements:**
   - Ensure your OS is supported
   - Verify you have enough disk space

3. **Reset Settings:**
   - Close the app
   - Delete settings file (location varies by OS)
   - Restart the app

### Transcript Accuracy Issues

**Expected Accuracy:**
- Generally 90-95% for clear audio
- Lower for accented speech, jargon, or background noise

**Improving Accuracy:**
1. Record in a quieter environment
2. Use a better microphone
3. Speak more clearly
4. Set the correct language in Settings
5. Edit transcripts after creation

### Storage Issues

**Recordings Location:**
- Default: User data directory
- Check Settings for location
- Audio files can be large

**Managing Space:**
1. Delete old recordings
2. Export and archive important ones
3. Use MP3 format to save space
4. Choose lower sample rates

## Getting Help

If you need additional help:

1. **Check Documentation:**
   - README.md for technical details
   - This guide for usage instructions

2. **Report Issues:**
   - Visit the GitHub repository
   - Open an issue with details
   - Include error messages and steps to reproduce

3. **API-Related Issues:**
   - Check OpenAI status page
   - Review OpenAI documentation
   - Contact OpenAI support for API issues

## Privacy and Security

### Your Data

- All recordings are stored locally on your device
- Database is local (SQLite)
- No data is sent to us

### API Usage

- Audio is sent to OpenAI for transcription
- Review OpenAI's privacy policy
- API key is stored locally and encrypted

### Best Practices

- Don't record sensitive/private conversations without consent
- Review and delete recordings regularly
- Keep your API key secure
- Don't share recordings with sensitive information

---

**Happy Recording!** 🎙️

For more information, visit the project repository or contact support.
