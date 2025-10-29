# FourBolt - User Guide

Welcome to FourBolt! This comprehensive guide will help you master meeting transcription, recording management, and AI-powered insights.

## Table of Contents
1. [Getting Started](#getting-started)
2. [Recording Your First Meeting](#recording-your-first-meeting)
3. [Managing Meetings](#managing-meetings)
4. [Working with Transcripts](#working-with-transcripts)
5. [Action Items Management](#action-items-management)
6. [Analytics & Insights](#analytics--insights)
7. [Customizing Settings](#customizing-settings)
8. [Tips and Best Practices](#tips-and-best-practices)
9. [Troubleshooting](#troubleshooting)

## Getting Started

### First Launch

When you first launch FourBolt, you'll see a beautiful interface with four main sections:
- **Record**: Create new meeting recordings
- **Recordings**: View and manage past meetings
- **Action Items**: Track tasks across all meetings
- **Settings**: Customize your experience

### Choosing Your Theme

FourBolt offers 4 professional color palettes:

1. **Medium Gray** (Default) - Professional dark theme perfect for long sessions
2. **Light** - Clean bright theme for daytime use
3. **Midnight Blue** - Deep blue theme for focused work
4. **Retro 90s** - Nostalgic teal and silver aesthetic

**To change themes:**
1. Click **Settings** in the sidebar
2. Browse the Color Palette options
3. Click any theme to apply it instantly

### Setting Up Your AI Model

Before transcribing, configure your AI preferences:

1. Click the **Settings** icon in the sidebar
2. Under "AI Settings", select your preferred model:
   - **Claude Sonnet 4.5** - Advanced reasoning and summaries
   - **GPT-4** - Versatile and accurate transcription
3. Enter your API key:
   - For Claude: Get key from [https://console.anthropic.com](https://console.anthropic.com)
   - For OpenAI: Get key from [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
4. (Optional) Add custom vocabulary for your industry

Your API key is stored securely on your local machine.

## Recording Your First Meeting

### Using Meeting Templates

FourBolt provides templates to streamline common meeting types:

- **General Meeting**: Standard meetings and discussions
- **Standup**: Quick team check-ins with status updates
- **Retrospective**: Sprint reviews and reflection sessions
- **Sales**: Client calls and product demonstrations

### Step-by-Step Recording Process

1. **Navigate to Record Tab**
   - Click the Record icon (microphone) in the sidebar

2. **Set Up Your Meeting**
   - **Title**: Enter a descriptive name, or leave blank for auto-generated title
   - **Template**: (Optional) Click a template for pre-configured settings
   - The template will customize your meeting structure

3. **Start Recording**
   - Click the large circular microphone button
   - The button becomes a stop icon when recording
   - Watch the live audio waveform for visual feedback

4. **Take Notes During Recording**
   - Use the rich text editor below the recording controls
   - Format your notes with:
     - **Bold** - Press Cmd/Ctrl + B or click the B button
     - *Italic* - Press Cmd/Ctrl + I or click the I button
     - Bullet lists - Press Cmd/Ctrl + Shift + 8 or click the list button
   - Notes are automatically saved

5. **See Live Transcription** (if enabled)
   - Watch real-time transcription appear as you speak
   - Perfect for verifying audio quality during the meeting

6. **Control Your Recording**
   - **Pause**: Temporarily stop recording for breaks
   - **Resume**: Continue from where you paused
   - **Stop & Save**: End recording and process transcription

### Understanding the Waveform

The audio waveform visualization shows:
- **Active bars**: Audio is being captured
- **Low activity**: Speak louder or adjust microphone
- **Consistent patterns**: Good, clear audio input
- **Paused state**: Waveform dims when paused

## Managing Meetings

### Browsing Your Recordings

1. Click **Recordings** in the sidebar
2. See all meetings displayed as cards with:
   - Meeting title and date
   - Duration
   - Number of participants
   - Quick preview of content

### Searching for Meetings

The powerful search finds meetings by:
- Title
- Date
- Participant names
- Transcript content
- Notes

**To search:**
- Type keywords in the search bar at the top
- Results update instantly
- Click X to clear search

### Opening a Meeting

Click any meeting card to open the detailed view with three tabs:

#### Transcript Tab
- View the complete conversation
- See speaker names with avatars
- Click timestamps to navigate
- Edit speaker names by clicking the pencil icon
- Add bookmarks to important moments

#### Summary Tab
- Read AI-generated summary of key points
- Review all action items from the meeting
- See participant contributions
- Export summary for sharing

#### Analytics Tab
- View speaking time distribution charts
- See total words spoken
- Track number of speakers
- Count action items created

### Editing Meeting Information

**Change Meeting Title:**
1. Open the meeting detail view
2. Click the pencil icon next to the title
3. Type new title and press Enter

**Update Speaker Names:**
1. In the Transcript tab, click a speaker name
2. Type the correct name
3. Press Enter to update all instances

**Add Bookmarks:**
- Click the bookmark icon on any transcript segment
- Marks important moments for quick reference
- View all bookmarks in the bookmarks panel

## Action Items Management

### Accessing the Action Items Dashboard

1. Click **Action Items** in the sidebar
2. See statistics at the top:
   - Total action items across all meetings
   - Completed count
   - Pending count
   - Overdue count

### Filtering and Sorting

**Filter by Status:**
- **All** - Show everything
- **Active** - Only uncompleted items
- **Completed** - Only finished items
- **Overdue** - Items past their due date

**Sort Options:**
- **Most Recent** - Newest items first
- **Due Date** - Upcoming deadlines first
- **Priority** - High priority items first
- **Assignee** - Group by person

### Working with Action Items

**Mark Complete:**
- Click the checkbox next to any item
- Item moves to completed status
- Shows with strikethrough text

**View Details:**
Each action item shows:
- Task description
- Assignee name
- Due date
- Priority level (high, medium, low)
- Source meeting

**From Meeting Summaries:**
- Action items are auto-generated by AI
- Extracted from meeting discussions
- Appear in the Summary tab of each meeting

### Priority Levels

- **High** (Red badge) - Urgent, time-sensitive tasks
- **Medium** (Yellow badge) - Standard priority
- **Low** (Green badge) - Nice to have, flexible timing

## Analytics & Insights

### Meeting Analytics

Each meeting provides detailed analytics:

**Speaking Time Charts:**
- Visual bar charts show distribution
- Percentage of time each person spoke
- Helps identify participation balance

**Word Count Statistics:**
- Total words in meeting
- Average per speaker
- Speaking pace indicators

**Participant Metrics:**
- Number of unique speakers
- Contributions per person
- Speaking patterns

### Dashboard Statistics

In Settings, view overall statistics:
- **Total Recordings** - All meetings captured
- **Total Minutes** - Cumulative recording time
- Track usage over time

## Customizing Settings

### Color Palettes

Choose from 4 themes in the Color Palette section:
- Preview each theme before applying
- Changes take effect immediately
- Your preference is saved

### AI Configuration

**Default AI Model:**
- Select Claude Sonnet 4.5 or GPT-4
- Different models excel at different tasks
- Claude: Better summaries and insights
- GPT-4: Excellent transcription accuracy

**Custom Vocabulary:**
- Add industry-specific terms
- Improves transcription accuracy
- Examples:
  - Technical terms: "kubernetes", "API", "DevOps"
  - Company names: "Acme Corp", "Project Phoenix"
  - Product names: "FourBolt", specific model numbers

**How to add:**
1. In Settings, find Custom Vocabulary
2. Type terms separated by commas
3. Save settings

### Audio & Integration

**Microphone Selection:**
- Choose your preferred input device
- Test different microphones
- Switch based on environment

**Calendar Integration:**
- Enable to auto-populate meeting titles
- Syncs with your calendar events
- Automatic participant detection

## Tips and Best Practices

### For Best Recording Quality

1. **Environment Setup:**
   - Choose a quiet location
   - Minimize background noise
   - Close windows and doors
   - Turn off fans or AC during recording

2. **Microphone Positioning:**
   - Place 6-12 inches from your mouth
   - Use external microphone when possible
   - Test audio levels before important meetings

3. **Recording Techniques:**
   - Speak clearly at moderate pace
   - One person speaks at a time
   - State names when changing speakers
   - Use pause for breaks, not stop

### For Better Transcriptions

1. **Prepare Custom Vocabulary:**
   - Add specialized terms before recording
   - Include product names
   - Add frequently used acronyms

2. **During Recording:**
   - Monitor the waveform for consistent input
   - Check live transcription accuracy
   - Adjust microphone if needed

3. **After Recording:**
   - Review and correct speaker names
   - Edit any misheard words
   - Add bookmarks to key moments

### Organizing Meetings

1. **Use Descriptive Titles:**
   - Include date and topic
   - Example: "Q4 Planning - Product Roadmap"
   - Makes searching easier

2. **Choose Appropriate Templates:**
   - Templates optimize for meeting type
   - Faster setup
   - Consistent structure

3. **Add Contextual Notes:**
   - Include meeting agenda
   - Note key decisions
   - Reference related meetings

### Managing Action Items

1. **Review After Each Meeting:**
   - Check AI-generated action items
   - Verify assignees are correct
   - Confirm due dates

2. **Set Realistic Deadlines:**
   - Consider dependencies
   - Account for other commitments
   - Build in buffer time

3. **Regular Check-ins:**
   - Visit Action Items dashboard daily
   - Update status as you work
   - Communicate delays early

## Troubleshooting

### Microphone Not Working

**macOS:**
1. System Preferences → Security & Privacy → Privacy
2. Select **Microphone** from left sidebar
3. Ensure FourBolt has a checkmark
4. Restart FourBolt

**Windows:**
1. Settings → Privacy → Microphone
2. Enable "Allow apps to access your microphone"
3. Ensure FourBolt is enabled
4. Restart FourBolt

**General Fixes:**
- Check microphone is plugged in
- Try a different USB port
- Test microphone in other apps
- Restart your computer

### No Audio Waveform

- Grant microphone permissions (see above)
- Select correct input device in Settings
- Increase system microphone volume
- Try a different microphone

### Transcription Not Starting

1. **Check API Key:**
   - Go to Settings
   - Verify API key is entered
   - Confirm key is valid (not expired)

2. **Internet Connection:**
   - Transcription requires internet
   - Check your connection
   - Try again when online

3. **File Size:**
   - Very large files may take time
   - Check for processing indicator
   - Wait a few minutes for completion

### Poor Transcription Accuracy

1. **Improve Audio Quality:**
   - Use better microphone
   - Reduce background noise
   - Speak more clearly

2. **Add Custom Vocabulary:**
   - Include technical terms
   - Add names and acronyms
   - Spell out unusual words

3. **Try Different AI Model:**
   - Switch between Claude and GPT-4
   - Different models may work better
   - Test with sample recording

### Application Won't Start

1. **Check Node.js:**
   - Ensure Node.js 18+ is installed
   - Run: `node --version`
   - Reinstall if needed

2. **Reinstall Dependencies:**
   ```bash
   cd FourBolt
   rm -rf node_modules
   npm install
   ```

3. **Clear Cache:**
   - Delete application cache
   - Restart computer
   - Try again

### Action Items Not Showing

- Ensure meeting has been fully processed
- Check Summary tab first
- AI generates items from discussion context
- Not all meetings produce action items

### Theme Not Changing

- Click directly on theme preview
- Wait 1-2 seconds for application
- Refresh if needed
- Check for error messages

## Keyboard Shortcuts

### Recording
- `Cmd/Ctrl + Shift + R` - Toggle recording (global)

### Notes Formatting
- `Cmd/Ctrl + B` - Bold text
- `Cmd/Ctrl + I` - Italic text
- `Cmd/Ctrl + Shift + 8` - Bullet list

### Navigation
- `Cmd/Ctrl + 1` - Go to Record
- `Cmd/Ctrl + 2` - Go to Recordings
- `Cmd/Ctrl + 3` - Go to Action Items
- `Cmd/Ctrl + 4` - Go to Settings

## Getting Help

If you continue to experience issues:

1. **Check Documentation:**
   - Review this guide thoroughly
   - Read the README.md file
   - Check API provider documentation

2. **Report Issues:**
   - Open an issue on GitHub
   - Include error messages
   - Describe steps to reproduce

3. **Community Support:**
   - Check existing GitHub issues
   - See if others had similar problems
   - Share solutions you find

---

**Happy Recording! Built with Electron and React**
