# Visual Guide: What You'll See in FourBolt

This guide shows you exactly what the app looks like and what each part does.

## Main Interface

When you first open the app (`http://localhost:5173`), you'll see:

### Navigation Bar (Top)
```
┌────────────────────────────────────────────────────────────┐
│  ⚡ FourBolt                    [API Status]  ☑️  ⚙️       │
└────────────────────────────────────────────────────────────┘
```
- **⚡ FourBolt** - Logo/home button (click to return to recording view)
- **API Status** - Shows "API Key Missing" if not configured
- **☑️** - Action Items dashboard
- **⚙️** - Settings

---

## Recording View (Main Screen)

### Layout
```
┌─────────────────────────────────────────────────────────────────┐
│                    Recording Vault                               │
│  (Past meetings list on left)                                    │
│                                                                   │
│  ┌──────────────────────┐  ┌──────────────────────┐            │
│  │   RECORDING          │  │  LIVE TRANSCRIPTION   │            │
│  │   CONTROLS           │  │                       │            │
│  │                      │  │  ✨ Gemini AI         │            │
│  │  [Audio Waveform]    │  │  (Every 10s)          │            │
│  │                      │  │                       │            │
│  │  [Pause] [00:45] [Stop] │  [Transcript Text]  │            │
│  │                      │  │                       │            │
│  │  MEETING NOTES       │  │                       │            │
│  │  [Text Editor]       │  │                       │            │
│  └──────────────────────┘  └──────────────────────┘            │
└─────────────────────────────────────────────────────────────────┘
```

### Left Side: Recording Controls

**When NOT recording:**
```
┌──────────────────────┐
│                      │
│   ▁▂▃▅▃▂▁           │  <- Inactive waveform (gray)
│                      │
│                      │
│   [🟢 Record]        │  <- Green Record button
│                      │
│                      │
│   Meeting Notes      │
│                      │
│   Take notes...      │  <- Empty text editor
│                      │
└──────────────────────┘
```

**When recording (Gemini mode):**
```
┌──────────────────────┐
│  10-08-2025 Meeting  │  <- Editable title
│                      │
│   ▁▃▅▇▅▃▁          │  <- Live waveform (blue/purple gradient)
│                      │
│  [⏸] [🔴 01:23] [⏹] │  <- Pause, Timer, Stop
│                      │
│   Meeting Notes      │
│  [🔖 Add Bookmark]   │  <- Bookmark button
│                      │
│  • Take notes here   │  <- Active text editor
│  • Use rich text     │
│  • Bullets, bold...  │
└──────────────────────┘
```

### Right Side: Live Transcription

**Gemini AI Mode:**
```
┌──────────────────────┐
│ Live Transcription   │
│ ✨ Gemini AI         │  <- Shows active method
│ (Processing...)      │  <- Status indicator
│                  🟢   │  <- Green dot when active
│                      │
│ [00:10] Speaker 1    │  <- Timestamp + speaker
│ Hello everyone,      │
│ welcome to today's   │
│ quarterly review...  │
│                      │
│ [00:25] Speaker 2    │
│ Thanks for joining.  │
│ Let's start with...  │
│                      │
│ Transcribing with    │  <- Status message
│ Gemini AI...         │  <- While processing
└──────────────────────┘
```

**Web Speech API Mode:**
```
┌──────────────────────┐
│ Live Transcription   │
│ 🎤 Web Speech API    │  <- Shows browser mode
│ (Real-time)          │
│                  🟢   │
│                      │
│ [00:01] Speaker 1    │
│ hello everyone       │  <- Appears instantly
│ welcome to todays... │  <- May have typos
│                      │
│ welcome to todays... │  <- Live text (gray)
│                      │  <- Updates as you speak
└──────────────────────┘
```

---

## Settings View

Click the ⚙️ icon to see settings:

### Transcription Settings Section
```
┌─────────────────────────────────────────────────────────┐
│  🎤 Transcription Settings                               │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Transcription Method                                    │
│                                                          │
│  ┌─────────────────────────────────────────────┐  ●    │
│  │ ✨ Gemini AI Transcription                  │       │
│  │ Uses Google Gemini 1.5 Flash for accurate   │       │
│  │ speech-to-text. Processes audio every 10s.  │       │
│  │ Requires API key and uses quota.            │       │
│  └─────────────────────────────────────────────┘       │
│                                                          │
│  ┌─────────────────────────────────────────────┐       │
│  │ 🎤 Browser Speech Recognition               │       │
│  │ Uses browser's built-in Web Speech API for  │       │
│  │ real-time transcription. Free, instant, but │       │
│  │ less accurate. Chrome/Edge/Safari only.     │       │
│  └─────────────────────────────────────────────┘       │
│                                                          │
│  Gemini Model                                           │
│  [Gemini 1.5 Flash (Recommended) ▼]                    │
│                                                          │
│  ⚠️ Note: Gemini transcription uses your API quota.    │
│     Flash model is recommended for best cost.           │
└─────────────────────────────────────────────────────────┘
```

### Color Theme Section
```
┌─────────────────────────────────────────────────────────┐
│  🎨 Color Theme                                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  [██ Medium Gray]       [██ Light]                     │
│  [██ Midnight Blue]     [██ Retro 90s]                 │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## Recording in Progress (Step by Step)

### Second 0-10: Starting Up
```
Recording Controls              Live Transcription
─────────────────              ──────────────────
10-08-2025 Meeting             Live Transcription
                               ✨ Gemini AI (Every 10s)
▁▂▃▅▇▅▃▂▁                                    🟢 Listening...

[⏸] [🔴 00:05] [⏹]            (Waiting for first chunk...)

Meeting Notes
🔖 Add Bookmark

[Type your notes here]
```

### Second 10: First Transcription
```
Recording Controls              Live Transcription
─────────────────              ──────────────────
10-08-2025 Meeting             Live Transcription
                               ✨ Gemini AI (Processing...)
▁▃▅▇▆▄▂▁                                    🟢 Transcribing...

[⏸] [🔴 00:12] [⏹]            Transcribing with Gemini AI...

Meeting Notes                  [00:00] Speaker 1
🔖 Add Bookmark                Good morning everyone,
                               welcome to today's quarterly
• Added bullet point          business review meeting.
```

### Second 20: More Transcription
```
Recording Controls              Live Transcription
─────────────────              ──────────────────
10-08-2025 Meeting             Live Transcription
                               ✨ Gemini AI (Every 10s)
▁▂▄▇▆▃▁                                     🟢 Listening...

[⏸] [🔴 00:23] [⏹]            [00:00] Speaker 1
                               Good morning everyone,
Meeting Notes                  welcome to today's quarterly
🔖 Add Bookmark                business review meeting.

• Added bullet point          [00:12] Speaker 2
• Another note                Thanks for the warm welcome.
                               I'm excited to share our Q3
                               results with the team.
```

---

## After Stopping Recording

When you click **Stop**, you'll see:

### Processing Screen
```
┌─────────────────────────────────────┐
│  ✨ Generating AI Summary...         │
│                                      │
│  Please wait while we analyze your   │
│  meeting transcript...               │
│                                      │
│      [⚡ Processing animation]       │
└─────────────────────────────────────┘
```

### Meeting Saved
The meeting appears in the left sidebar:
```
Recording Vault
───────────────
🔍 Search...

┌────────────────────────┐
│ ▌ 10-08-2025 Meeting  │  <- Your new meeting
│   58:42  |  4 speakers │
└────────────────────────┘

┌────────────────────────┐
│ ▌ Q4 Sales Strategy    │
│   32:18  |  3 speakers │
└────────────────────────┘
```

---

## Viewing a Meeting

Click any meeting to see three tabs:

### Transcript Tab
```
┌──────────────────────────────────────────────────────────┐
│  10-08-2025 Meeting                                      │
│  10-08-2025  •  58:42                                    │
│                                                          │
│  [Transcript] [Summary] [Analytics]                      │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  S1  Speaker 1                                00:00      │
│      Good morning everyone, welcome to today's           │
│      quarterly business review meeting.                  │
│                                                          │
│  S2  Speaker 2                                00:12      │
│      Thanks for the warm welcome. I'm excited            │
│      to share our Q3 results with the team.              │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### Summary Tab
```
┌──────────────────────────────────────────────────────────┐
│  AI Summary                                              │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Key Discussion Points                                   │
│  The meeting focused on Q4 sales strategy with           │
│  emphasis on competitive positioning in the Northeast    │
│  market. Team members identified a 15% pricing gap...    │
│                                                          │
│  Critical Decisions                                      │
│  • Develop tiered pricing model before year-end         │
│  • Prepare competitive analysis by October 15th         │
│  • Explore partnership opportunities with firms         │
│                                                          │
│  Next Steps                                              │
│  The team will reconvene after the competitive...        │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### Analytics Tab
```
┌──────────────────────────────────────────────────────────┐
│  Speaking Time                                           │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Speaker 1                                      45%      │
│  ████████████████████████████                            │
│  18:30 spoken                                            │
│                                                          │
│  Speaker 2                                      32%      │
│  ███████████████████                                     │
│  12:45 spoken                                            │
│                                                          │
│  Speaker 3                                      23%      │
│  █████████████                                           │
│  9:15 spoken                                             │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## Action Items Dashboard

Click ☑️ in the nav to see:

```
┌─────────────────────────────────────────────────────────┐
│  Action Items                                            │
│  All tasks from your meetings in one place               │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  [Search...]  [All Items ▼]  [Most Recent ▼]           │
│                                                          │
│  ☐ Prepare competitive analysis by October 15th        │
│     From: Q4 Sales Strategy • 3 days ago                │
│     Assigned: Sarah Chen  [High Priority]               │
│                                                          │
│  ☑ Review market positioning slides                     │
│     From: Q4 Sales Strategy • 5 days ago                │
│     Assigned: Sarah Chen  [Medium Priority]             │
│                                                          │
│  ☐ Develop tiered pricing model                        │
│     From: Q4 Sales Strategy • 3 days ago                │
│     Assigned: Mike Ross  [High Priority]                │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## Visual Status Indicators

Throughout the app, you'll see these indicators:

### Recording Status
- 🟢 **Green dot** - Currently recording/listening
- 🔴 **Red dot** - Recording active
- ⏸️ **Pause icon** - Recording paused

### Transcription Status
- ✨ **Sparkles** - Using Gemini AI
- 🎤 **Microphone** - Using Web Speech
- **(Processing...)** - Gemini is transcribing
- **(Every 10s)** - Waiting for next chunk
- **(Real-time)** - Instant transcription

### API Status
- ⚠️ **Red badge** - "API Key Missing"
- ✅ **No badge** - API configured correctly

### Theme Colors
- **Medium Gray** (Default) - Dark professional theme
- **Light** - Bright clean theme for daytime
- **Midnight Blue** - Deep blue elegant theme
- **Retro 90s** - Nostalgic teal and silver

---

## Quick Tips

💡 **What the colors mean:**
- **Blue/Purple gradient** - Active recording waveform
- **Gray bars** - Inactive/paused
- **Green glow** - Live/active status
- **Orange highlights** - Bookmarks

💡 **Button states:**
- **Bright color** - Active/enabled
- **Dimmed** - Inactive/disabled
- **Pulsing** - Processing/working

💡 **Text hierarchy:**
- **Large bold** - Meeting titles, headers
- **Medium** - Content, transcription
- **Small gray** - Metadata, timestamps

---

**This is what you'll see when you run the app!** 🎉

For step-by-step usage instructions, see [USAGE_GUIDE.md](./USAGE_GUIDE.md)
