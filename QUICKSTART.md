# Quick Start - FourBolt in 2 Minutes ⚡

Get the app running in under 2 minutes!

## Step 1: Get API Key (30 seconds)

1. Go to **[Google AI Studio](https://makersuite.google.com/app/apikey)**
2. Sign in with Google
3. Click **"Create API Key"**
4. Copy your key (starts with `AIza...`)

✅ **Free tier**: 60 requests/min, perfect for personal use

---

## Step 2: Install (1 minute)

```bash
# Clone and enter directory
git clone <your-repo-url>
cd Brewha5151

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

**Edit `.env`** and paste your API key:
```env
VITE_GEMINI_API_KEY=AIza...your_key_here
```

---

## Step 3: Run (10 seconds)

```bash
npm run dev:renderer
```

Open browser to: **http://localhost:5173**

---

## Step 4: Record Your First Meeting (30 seconds)

1. Click green **"Record"** button
2. Allow microphone access when prompted
3. Start speaking
4. Watch transcription appear every 10 seconds
5. Click **"Stop"** when done

**🎉 Done!** Your meeting is transcribed and summarized.

---

## What's Next?

- **View transcript**: Click your meeting in the left sidebar
- **See AI summary**: Click the "Summary" tab
- **Check analytics**: Click the "Analytics" tab
- **Change settings**: Click gear icon (try Browser Speech mode for instant transcription)

---

## Need Help?

- **No transcription?** → Wait 10 seconds for first chunk
- **API key error?** → Check `.env` format (no quotes, no spaces)
- **Microphone not working?** → Check browser permissions (lock icon in address bar)

📚 **Full guides**:
- [Complete Installation](./SETUP.md)
- [Usage Guide](./USAGE_GUIDE.md)
- [Troubleshooting](./README.md#troubleshooting)
- [Visual Guide](./VISUAL_GUIDE.md)

---

**That's it! You're transcribing with Gemini AI.** 🚀
