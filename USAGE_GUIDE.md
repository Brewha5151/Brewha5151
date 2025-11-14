# How to Use FourBolt with Gemini Transcription 🎙️

This guide shows you how to use the FourBolt meeting transcription app with Google Gemini AI for accurate speech-to-text.

## Quick Start

### 1. Get Your Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy your API key

### 2. Configure Your API Key

Edit the `.env` file in your project root:

```env
VITE_GEMINI_API_KEY=paste_your_actual_api_key_here
```

**Important:** Never share or commit your API key!

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the App

```bash
npm run dev:renderer
```

Open your browser to: **http://localhost:5173**

---

## Recording Your First Meeting

### Step 1: Choose Transcription Method

Click the **Settings** (gear icon) in the top-right corner.

You have two options:

#### Option A: **Gemini AI Transcription** (Recommended) ✨
- ✅ More accurate
- ✅ Better speaker identification
- ✅ Works in any browser
- ⚠️ Processes audio every 10 seconds
- ⚠️ Uses API quota

#### Option B: **Browser Speech Recognition**
- ✅ Instant, real-time
- ✅ Free (no API usage)
- ⚠️ Less accurate
- ⚠️ Chrome/Edge/Safari only

**Default:** Gemini AI Transcription is enabled by default.

### Step 2: Start Recording

1. Click the green **"Record"** button
2. **Allow microphone access** when prompted
3. Start speaking!

### Step 3: During Recording

**What you'll see:**
- 🔴 **Recording indicator** with elapsed time
- 📊 **Live audio waveform** showing sound levels
- 📝 **Transcription appearing** every 10 seconds (Gemini) or instantly (Web Speech)
- ✏️ **Notes editor** on the left for typing additional notes

**Available actions:**
- **Pause** - Click pause to temporarily stop recording
- **Add Bookmark** - Mark important moments (shows in transcript)
- **Take Notes** - Type in the notes panel with your own thoughts

### Step 4: Stop & Save

1. Click the **"Stop"** button when done
2. App will automatically:
   - Generate AI summary
   - Extract action items
   - Save full transcript
   - Create meeting entry

---

## Understanding the Transcription

### Gemini AI Mode

When using Gemini:

1. **Recording starts** - Microphone captures audio
2. **Every 10 seconds** - Audio chunk sent to Gemini
3. **Processing** - You'll see "Transcribing with Gemini AI..."
4. **Transcript appears** - Text added with speaker labels
5. **Repeat** - Continues until you stop

**What you'll see:**
```
Live Transcription
✨ Gemini AI (Every 10s)          🟢 Transcribing...

[00:10] Speaker 1
Hello everyone, welcome to today's meeting...

[00:25] Speaker 2
Thanks for joining. Let's start with the agenda...
```

### Web Speech Mode

When using browser speech:

1. **Instant transcription** - Words appear as you speak
2. **Real-time** - No waiting
3. **Less accurate** - May miss technical terms

**What you'll see:**
```
Live Transcription
🎤 Web Speech API (Real-time)    🟢 Listening...

[00:01] Speaker 1
Hello everyone welcome to todays meeting...
```

---

## Viewing Past Meetings

1. Click on any meeting in the left sidebar
2. Switch between tabs:
   - **Transcript** - Full conversation with timestamps
   - **Summary** - AI-generated meeting summary
   - **Analytics** - Speaking time charts

---

## Tips for Best Results

### For Gemini Transcription:

✅ **DO:**
- Speak clearly and at moderate pace
- Use a good quality microphone
- Record in a quiet environment
- Let people finish speaking before interrupting

❌ **DON'T:**
- Record very short meetings (< 30 seconds)
- Have loud background music
- Speak over each other constantly
- Use in very noisy environments

### API Usage & Costs

**Gemini Free Tier:**
- 60 requests per minute
- Generous monthly quota
- Free for most personal use

**Typical meeting costs (with Gemini 1.5 Flash):**
- 10-minute meeting: ~60 audio chunks = ~$0.01
- 30-minute meeting: ~180 audio chunks = ~$0.03
- 60-minute meeting: ~360 audio chunks = ~$0.06

💡 **Flash is 20x cheaper than Pro** - use it unless you need maximum accuracy!

---

## Troubleshooting

### "API Key Missing" Warning

**Problem:** Red badge in navigation

**Solution:**
1. Check `.env` file exists in project root
2. Ensure `VITE_GEMINI_API_KEY=your_key_here`
3. Restart dev server: `npm run dev:renderer`

### No Transcription Appearing

**Problem:** Recording works but no text shows

**If using Gemini:**
1. Check browser console (F12) for errors
2. Verify API key is correct
3. Check you have remaining quota at [Google AI Studio](https://makersuite.google.com)
4. Wait 10 seconds - Gemini processes in chunks

**If using Web Speech:**
1. Use Chrome, Edge, or Safari (Firefox not supported)
2. Check microphone permissions
3. Speak clearly and wait 1-2 seconds

### "Transcription Failed" Error

**Possible causes:**
1. Invalid API key
2. No internet connection
3. API quota exceeded
4. Audio format not supported

**Solution:**
- Check console for specific error
- Verify API key
- Check internet connection
- Try recording a test meeting

### Microphone Not Working

**Problem:** No audio levels or waveform

**Solution:**
1. Check browser permissions (address bar lock icon)
2. Ensure no other app is using microphone
3. Try different browser
4. Check system microphone settings

---

## Settings Reference

### Transcription Method

**Gemini AI Transcription:**
- Uses Google Gemini 1.5 for audio processing
- Sends 10-second chunks for transcription
- More accurate, especially for technical terms
- Identifies speakers automatically
- Costs a few cents per hour

**Browser Speech Recognition:**
- Free, built-in to browser
- Real-time (instant)
- Works offline (Chrome)
- Less accurate
- Limited browser support

### Gemini Model

**Gemini 1.5 Flash** (Recommended):
- Faster processing
- 20x cheaper than Pro
- Great for most meetings
- Good accuracy

**Gemini 1.5 Pro**:
- Highest accuracy
- Better speaker diarization
- More expensive
- Use for important meetings

---

## Keyboard Shortcuts

- **Record/Stop** - Click UI buttons (no keyboard shortcut yet)
- **Pause** - Click pause button
- **Bookmark** - Click bookmark button during recording

---

## Privacy & Data

- **Audio recording** - Stored locally in browser memory
- **Transcripts** - Saved in browser (not uploaded to our servers)
- **Gemini API** - Audio chunks sent to Google for processing
- **API Key** - Stored in `.env` file (never committed to git)

**Important:** Do not record confidential meetings without proper authorization and understanding of data processing.

---

## Next Steps

1. ✅ Configure your API key
2. ✅ Choose transcription method
3. ✅ Record your first meeting
4. ✅ Review transcript and summary
5. ✅ Export or share results

**Need help?** Check [SETUP.md](./SETUP.md) for detailed installation and troubleshooting.

---

**Happy transcribing! 🎉**
