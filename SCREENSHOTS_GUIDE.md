# Screenshot Guide for FourBolt

This guide explains how to capture screenshots of the FourBolt app and add them to the documentation.

## 📸 Required Screenshots

You'll need to capture **6 main screenshots** to complete the documentation:

### 1. Main Recording Interface (Not Recording)
**Filename**: `screenshots/01-main-interface.png`

**What to show**:
- Main screen when app first opens
- Green "Record" button visible
- Empty/inactive waveform (gray)
- Recording Vault on the left (with sample meetings if available)
- Settings and Action Items icons in top navigation

**How to capture**:
1. Open app at `http://localhost:5173`
2. Make sure you're NOT recording
3. Take full browser window screenshot

---

### 2. Recording in Progress (Gemini Mode)
**Filename**: `screenshots/02-recording-gemini.png`

**What to show**:
- Active recording with live waveform (blue/purple gradient)
- Timer showing (e.g., "01:23")
- Pause and Stop buttons visible
- Live Transcription panel on right with "✨ Gemini AI (Every 10s)"
- Some transcription text appearing
- Green status indicator showing "Listening..." or "Transcribing..."

**How to capture**:
1. Click "Record" button
2. Allow microphone access
3. Wait at least 10-15 seconds for first transcription
4. Take screenshot while recording
5. Click "Stop" when done

---

### 3. Settings View (Transcription Settings)
**Filename**: `screenshots/03-settings-transcription.png`

**What to show**:
- Settings panel open
- Transcription method options visible:
  - "✨ Gemini AI Transcription" option
  - "🎤 Browser Speech Recognition" option
- Gemini Model dropdown showing "Gemini 1.5 Flash (Recommended)"
- Color theme options at bottom

**How to capture**:
1. Click the Settings icon (gear) in top-right navigation
2. Ensure "Transcription Settings" section is visible
3. Take screenshot of settings panel

---

### 4. Meeting Detail View (Transcript Tab)
**Filename**: `screenshots/04-meeting-transcript.png`

**What to show**:
- A completed meeting opened from Recording Vault
- Three tabs: [Transcript] [Summary] [Analytics]
- Transcript tab selected (active)
- Transcript with speaker labels and timestamps
- Meeting title and duration at top

**How to capture**:
1. Record a test meeting (at least 30 seconds)
2. Stop the recording
3. Click on the meeting in the left Recording Vault
4. Ensure "Transcript" tab is selected
5. Take screenshot

---

### 5. Meeting Summary View (AI Summary)
**Filename**: `screenshots/05-meeting-summary.png`

**What to show**:
- Same meeting as above
- Summary tab selected (active)
- AI-generated summary displayed
- Sections like "Key Discussion Points", "Critical Decisions", "Next Steps"
- Action items if present

**How to capture**:
1. With meeting open from previous step
2. Click "Summary" tab
3. Wait for AI summary to generate (may take a few seconds)
4. Take screenshot

---

### 6. Analytics View (Speaking Time)
**Filename**: `screenshots/06-meeting-analytics.png`

**What to show**:
- Same meeting
- Analytics tab selected (active)
- Speaking time bar charts for each speaker
- Percentages and time durations
- Visual bars showing relative speaking time

**How to capture**:
1. With meeting still open
2. Click "Analytics" tab
3. Take screenshot showing the charts

---

## 📁 Where to Save Screenshots

Create a `screenshots` folder in the project root:

```
Brewha5151/
├── screenshots/
│   ├── 01-main-interface.png
│   ├── 02-recording-gemini.png
│   ├── 03-settings-transcription.png
│   ├── 04-meeting-transcript.png
│   ├── 05-meeting-summary.png
│   └── 06-meeting-analytics.png
├── src/
├── README.md
└── ...
```

### Create the folder:

```bash
cd Brewha5151
mkdir -p screenshots
```

---

## 🛠️ How to Take Screenshots

### Windows
- **Full window**: `Win + Shift + S` → Select area
- **Browser only**: `Alt + PrtScn`
- Save from clipboard to `screenshots/` folder

### macOS
- **Full window**: `Cmd + Shift + 4` → Press `Space` → Click window
- **Selected area**: `Cmd + Shift + 4` → Drag to select
- Screenshots save to Desktop by default, move to `screenshots/` folder

### Linux (Ubuntu/GNOME)
- **Screenshot tool**: Press `PrtScn` or open "Screenshot" app
- **Selected area**: `Shift + PrtScn`
- Save to `screenshots/` folder

### Browser DevTools Method (All Platforms)
1. Open Chrome/Edge DevTools (`F12`)
2. Press `Cmd/Ctrl + Shift + P`
3. Type "screenshot"
4. Select "Capture full size screenshot"
5. Save to `screenshots/` folder

---

## 🎨 Screenshot Best Practices

### Do:
✅ Use full browser window (not just partial view)
✅ Make sure text is readable
✅ Include relevant UI elements (nav bar, sidebars)
✅ Show real data/transcriptions (not empty screens)
✅ Use default theme (Medium Gray) for consistency
✅ Capture at decent resolution (at least 1280x720)

### Don't:
❌ Crop out important UI elements
❌ Include personal/sensitive information in transcriptions
❌ Use low-quality or blurry screenshots
❌ Mix different themes in different screenshots
❌ Include browser tabs or desktop background

---

## 📝 After Taking Screenshots

### 1. Verify all screenshots:

```bash
ls screenshots/
# Should show:
# 01-main-interface.png
# 02-recording-gemini.png
# 03-settings-transcription.png
# 04-meeting-transcript.png
# 05-meeting-summary.png
# 06-meeting-analytics.png
```

### 2. Update README.md

The README already has placeholders for screenshots. Replace the placeholder text with actual image references:

```markdown
## 📸 Screenshots

### Main Recording Interface
![Main Interface](screenshots/01-main-interface.png)
*Live recording interface with audio waveform visualization, rich text notes, and real-time transcription*

### Recording in Progress (Gemini AI)
![Recording with Gemini](screenshots/02-recording-gemini.png)
*Active recording showing Gemini AI transcription every 10 seconds*

### Settings Panel
![Settings](screenshots/03-settings-transcription.png)
*Choose between Gemini AI or Browser Speech Recognition, select models, and customize themes*

### Meeting Transcript View
![Transcript](screenshots/04-meeting-transcript.png)
*Full meeting transcript with speaker labels and timestamps*

### AI-Generated Summary
![Summary](screenshots/05-meeting-summary.png)
*AI-generated meeting summary with key points, decisions, and action items*

### Analytics Dashboard
![Analytics](screenshots/06-meeting-analytics.png)
*Speaking time analysis with visual charts showing participation distribution*
```

### 3. Commit and push:

```bash
git add screenshots/
git add README.md
git commit -m "Add application screenshots to documentation"
git push -u origin claude/meeting-transcription-app-01NnKrwZmzSwrBMtHiWLiH1i
```

---

## 🎯 Optional: Additional Screenshots

If you want to go above and beyond, you can add these optional screenshots:

### 7. Browser Speech Mode
**Filename**: `screenshots/07-recording-webspeech.png`
- Recording with "🎤 Web Speech API (Real-time)" mode
- Shows instant transcription

### 8. Action Items Dashboard
**Filename**: `screenshots/08-action-items.png`
- Click Action Items icon in nav
- Show action items from multiple meetings

### 9. Different Color Themes
**Filename**: `screenshots/09-theme-light.png`, `10-theme-midnight.png`, etc.
- Show the same screen in different themes
- Demonstrates theme variety

### 10. API Key Configuration
**Filename**: `screenshots/10-api-setup.png`
- Show .env file with API key (blur the actual key!)
- Or show Google AI Studio API key page

---

## ✅ Checklist

Before you commit, make sure:

- [ ] All 6 required screenshots captured
- [ ] Screenshots saved in `screenshots/` folder
- [ ] Filenames match the guide (01-main-interface.png, etc.)
- [ ] No personal information visible in screenshots
- [ ] Images are clear and high-quality
- [ ] README.md updated with image references
- [ ] Screenshots committed to git
- [ ] Changes pushed to GitHub

---

## 🎉 You're Done!

Your documentation is now complete with visual guides. Users can see exactly what the app looks like before installing it.

**Result**: Professional GitHub repository with comprehensive documentation and visual examples!
