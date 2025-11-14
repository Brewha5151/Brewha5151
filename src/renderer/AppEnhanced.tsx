import React, { useState, useEffect, useRef } from 'react';
import { Mic, Square, Pause, Play, Clock, Calendar, Search, Download, ChevronDown, User, FileText, TrendingUp, Settings, Zap, ArrowLeft, Edit2, Sparkles, BarChart3, Save, Bold, Italic, List, Filter, X, Plus, Lightbulb, CheckSquare, Users, Bookmark, Layers, Brain, Heading1, Archive, Palette } from 'lucide-react';
import { AudioRecorder } from './utils/audioRecorder';
import { geminiTranscription, TranscriptionSegment } from './utils/geminiTranscription';

// Color palettes (keeping the same as before)
const colorPalettes = {
  mediumGray: {
    name: 'Medium Gray',
    background: 'linear-gradient(135deg, #374151 0%, #4b5563 50%, #374151 100%)',
    cardBg: 'rgba(55, 65, 81, 0.5)',
    cardBorder: 'rgba(255, 255, 255, 0.1)',
    primary: '#00D9FF',
    secondary: '#7B2FF7',
    navBg: 'rgba(55, 65, 81, 0.5)',
    navBorder: 'rgba(123, 47, 247, 0.2)'
  },
  light: {
    name: 'Light',
    background: 'linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 50%, #cbd5e1 100%)',
    cardBg: 'rgba(255, 255, 255, 0.8)',
    cardBorder: 'rgba(0, 0, 0, 0.08)',
    primary: '#0284c7',
    secondary: '#7c3aed',
    navBg: 'rgba(240, 244, 248, 0.8)',
    navBorder: 'rgba(124, 58, 237, 0.15)',
    textPrimary: '#1e293b',
    textSecondary: '#475569',
    textTertiary: '#64748b'
  },
  midnight: {
    name: 'Midnight Blue',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
    cardBg: 'rgba(30, 41, 59, 0.4)',
    cardBorder: 'rgba(255, 255, 255, 0.08)',
    primary: '#38bdf8',
    secondary: '#818cf8',
    navBg: 'rgba(15, 23, 42, 0.4)',
    navBorder: 'rgba(129, 140, 248, 0.2)'
  },
  retro90s: {
    name: 'Retro 90s',
    background: 'linear-gradient(135deg, #008080 0%, #008080 100%)',
    cardBg: 'rgba(192, 192, 192, 0.95)',
    cardBorder: 'rgba(0, 0, 0, 0.3)',
    primary: '#000080',
    secondary: '#800080',
    navBg: 'rgba(192, 192, 192, 0.95)',
    navBorder: 'rgba(0, 0, 0, 0.3)',
    accent: '#808000',
    textPrimary: '#000000',
    textSecondary: '#000000',
    textTertiary: '#000000',
    buttonFace: '#c0c0c0',
    buttonShadow: '#808080',
    buttonHighlight: '#ffffff'
  }
};

export default function MeetingTranscriptionApp() {
  // State management (keeping most of the original state)
  const [view, setView] = useState('record');
  const [selectedMeeting, setSelectedMeeting] = useState<any>(null);
  const [transcriptView, setTranscriptView] = useState('transcript');
  const [actionItemsView, setActionItemsView] = useState(false);
  const [actionItemFilter, setActionItemFilter] = useState('all');
  const [actionItemSort, setActionItemSort] = useState('recent');
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptionSegment[]>([]);
  const [liveTranscriptText, setLiveTranscriptText] = useState('');
  const [notes, setNotes] = useState('');
  const [currentMeeting, setCurrentMeeting] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [audioWaveform, setAudioWaveform] = useState<number[]>([]);
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [currentPalette, setCurrentPalette] = useState('mediumGray');
  const [editingSpeaker, setEditingSpeaker] = useState<string | null>(null);
  const [newSpeakerName, setNewSpeakerName] = useState('');
  const [activeFormats, setActiveFormats] = useState({ bold: false, italic: false, list: false });
  const [newActionItem, setNewActionItem] = useState('');
  const [newActionAssignee, setNewActionAssignee] = useState('');
  const [newActionDueDate, setNewActionDueDate] = useState('');
  const [editingTitle, setEditingTitle] = useState(false);
  const [tempMeetingTitle, setTempMeetingTitle] = useState('');
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);

  const notesRef = useRef<HTMLDivElement>(null);
  const audioRecorderRef = useRef<AudioRecorder | null>(null);
  const waveformRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  const palette = (colorPalettes as any)[currentPalette];

  const [settings, setSettings] = useState({
    defaultAiModel: 'gemini-1.5-flash',
    customVocabulary: ['forklift', 'pallet jack', 'reach truck', 'order picker'],
    selectedMicrophone: 'default',
    calendarIntegration: false,
    useGeminiTranscription: true  // Use Gemini for transcription instead of Web Speech API
  });

  const [isTranscribing, setIsTranscribing] = useState(false);

  const [meetings, setMeetings] = useState<any[]>([
    // Sample meetings data (keeping from original)
  ]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}-${day}-${year}`;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getDefaultMeetingTitle = () => {
    const dateStr = formatDate(new Date().toISOString());
    return `${dateStr} - Meeting`;
  };

  const getTextColor = (type = 'primary') => {
    if (currentPalette === 'light') {
      if (type === 'primary') return palette.textPrimary || '#1e293b';
      if (type === 'secondary') return palette.textSecondary || '#475569';
      if (type === 'tertiary') return palette.textTertiary || '#64748b';
    }
    return type === 'primary' ? 'white' : type === 'secondary' ? '#d1d5db' : '#9ca3af';
  };

  // Timer effect
  useEffect(() => {
    if (isRecording && !isPaused) {
      timerRef.current = setInterval(() => setElapsedTime(prev => prev + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isRecording, isPaused]);

  // Start recording with real audio
  const startRecording = async () => {
    try {
      if (!AudioRecorder.isSupported()) {
        alert('Audio recording is not supported in this browser. Please use Chrome, Edge, or Safari.');
        return;
      }

      audioRecorderRef.current = new AudioRecorder({
        useGeminiTranscription: settings.useGeminiTranscription,

        // Callback for Gemini transcription (audio chunks every 10 seconds)
        onAudioChunk: async (audioBlob, timestamp) => {
          if (!settings.useGeminiTranscription) return;

          setIsTranscribing(true);
          setLiveTranscriptText('Transcribing with Gemini AI...');

          try {
            console.log(`Processing audio chunk at ${timestamp}s, size: ${audioBlob.size} bytes`);
            const segments = await geminiTranscription.transcribeAudio(audioBlob, timestamp);

            if (segments.length > 0) {
              setTranscript(prev => [...prev, ...segments]);
              setLiveTranscriptText('');
              console.log(`Added ${segments.length} transcription segments`);
            }
          } catch (error) {
            console.error('Gemini transcription error:', error);
            setLiveTranscriptText('Transcription failed. Check API key and quota.');
          } finally {
            setIsTranscribing(false);
          }
        },

        // Callback for Web Speech API transcription (real-time, browser built-in)
        onTranscript: (text, isFinal) => {
          if (settings.useGeminiTranscription) return; // Skip if using Gemini

          if (isFinal) {
            const newSegment: TranscriptionSegment = {
              speaker: 'Speaker 1',
              time: formatTime(elapsedTime),
              timestamp: elapsedTime,
              text: text
            };
            setTranscript(prev => [...prev, newSegment]);
            setLiveTranscriptText('');
          } else {
            setLiveTranscriptText(text);
          }
        },

        onError: (error) => {
          console.error('Recording error:', error);
          alert(`Recording error: ${error.message}`);
        }
      });

      // Start audio level monitoring
      await audioRecorderRef.current.startRecording();

      audioRecorderRef.current.getAudioLevel((level) => {
        setAudioLevel(level);
        setAudioWaveform(prev => {
          const newWave = [...prev, level];
          return newWave.slice(-200);
        });
      });

      setIsRecording(true);
      setIsPaused(false);
      setAudioWaveform([]);
      setTranscript([]);
      setElapsedTime(0);

      const defaultTitle = getDefaultMeetingTitle();
      setCurrentMeeting({ title: defaultTitle, startTime: new Date(), template: 'general' });
      setTempMeetingTitle(defaultTitle);
    } catch (error) {
      console.error('Failed to start recording:', error);
      alert('Failed to start recording. Please ensure microphone permissions are granted.');
    }
  };

  const pauseRecording = () => {
    if (audioRecorderRef.current) {
      audioRecorderRef.current.pause();
    }
    setIsPaused(true);
  };

  const resumeRecording = () => {
    if (audioRecorderRef.current) {
      audioRecorderRef.current.resume();
    }
    setIsPaused(false);
  };

  const stopRecording = async () => {
    if (timerRef.current) clearInterval(timerRef.current);

    let audioBlob: Blob | null = null;
    if (audioRecorderRef.current) {
      audioBlob = await audioRecorderRef.current.stopRecording();
    }

    // Generate summary using Gemini if we have transcript
    let generatedSummary = '';
    if (transcript.length > 0) {
      setIsGeneratingSummary(true);
      try {
        generatedSummary = await geminiTranscription.generateSummary(transcript);
      } catch (error) {
        console.error('Failed to generate summary:', error);
        generatedSummary = 'Summary generation failed. Please check your Gemini API key.';
      }
      setIsGeneratingSummary(false);
    }

    const newMeeting = {
      id: meetings.length + 1,
      title: currentMeeting?.title || `Meeting ${formatDate(new Date().toISOString())}`,
      date: new Date().toISOString().split('T')[0],
      duration: formatTime(elapsedTime),
      durationSeconds: elapsedTime,
      selectedAiModel: settings.defaultAiModel,
      template: currentMeeting?.template || 'general',
      bookmarks: bookmarks,
      actionItems: [],
      smartHighlights: [],
      speakingTime: {},
      transcript: transcript,
      audioWaveform: [...audioWaveform],
      audioBlob: audioBlob,
      summary: generatedSummary,
      notes: notes
    };

    setMeetings(prev => [newMeeting, ...prev]);
    setIsRecording(false);
    setIsPaused(false);
    setTranscript([]);
    setLiveTranscriptText('');
    setNotes('');
    if (notesRef.current) notesRef.current.innerHTML = '';
    setElapsedTime(0);
    setCurrentMeeting(null);
    setAudioWaveform([]);
    setBookmarks([]);
    audioRecorderRef.current = null;
  };

  const addBookmark = () => {
    const timeStr = formatTime(elapsedTime);
    const newBookmark = { time: timeStr, label: `Bookmark ${bookmarks.length + 1}`, timestamp: elapsedTime };
    setBookmarks([...bookmarks, newBookmark]);
  };

  const goHome = () => {
    setView('record');
    setSelectedMeeting(null);
  };

  // API Key check
  const hasApiKey = () => {
    return !!import.meta.env.VITE_GEMINI_API_KEY;
  };

  return (
    <div className="min-h-screen" style={{
      background: palette.background,
      fontFamily: '"Roboto", -apple-system, BlinkMacSystemFont, system-ui, sans-serif'
    }}>
      {/* Navigation */}
      <nav style={{
        background: palette.cardBg,
        borderBottom: `1px solid ${palette.cardBorder}`
      }}>
        <div className="max-w-[1800px] mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {(view !== 'record' || selectedMeeting || actionItemsView) && (
                <button onClick={() => { goHome(); setActionItemsView(false); }} className="p-2 rounded-lg transition-all hover:opacity-70" style={{
                  color: getTextColor('secondary')
                }}>
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              <div className="flex items-center gap-3 cursor-pointer transition-all hover:scale-105" onClick={() => { goHome(); setActionItemsView(false); }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{
                  background: `linear-gradient(135deg, ${palette.primary} 0%, ${palette.secondary} 100%)`
                }}>
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight" style={{
                  color: getTextColor('primary'),
                  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                  fontWeight: '800',
                  letterSpacing: '-0.02em'
                }}>FourBolt</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!hasApiKey() && (
                <div className="px-3 py-1 rounded-lg text-xs font-medium" style={{
                  background: 'rgba(239, 68, 68, 0.2)',
                  color: '#fca5a5'
                }}>
                  API Key Missing
                </div>
              )}
              <button onClick={() => setView(view === 'settings' ? 'record' : 'settings')}
                className="p-3 rounded-lg transition-all hover:opacity-70" style={{
                  color: getTextColor('secondary')
                }}>
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      {view === 'settings' ? (
        <div className="max-w-5xl mx-auto px-6 py-12">
          <h2 className="text-3xl font-bold mb-8" style={{ color: getTextColor('primary') }}>Settings</h2>

          {!hasApiKey() && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#fca5a5'
            }} className="rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Gemini API Key Required</h3>
                  <p className="text-sm opacity-90 mb-2">
                    To use AI-powered transcription summaries and action item extraction, you need to add your Gemini API key.
                  </p>
                  <p className="text-sm opacity-90">
                    1. Get your API key from{' '}
                    <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer"
                       className="underline hover:opacity-80">
                      Google AI Studio
                    </a>
                    <br />
                    2. Create a .env file in the project root
                    <br />
                    3. Add: <code className="bg-black bg-opacity-20 px-2 py-0.5 rounded">VITE_GEMINI_API_KEY=your_key_here</code>
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {/* Color Theme Settings */}
            <div style={{
              background: palette.cardBg,
              border: `1px solid ${palette.cardBorder}`
            }} className="rounded-lg p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <Palette className="w-5 h-5" style={{ color: palette.primary }} />
                <h3 className="text-xl font-semibold" style={{ color: getTextColor('primary') }}>Color Theme</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(colorPalettes).map(([key, pal]: [string, any]) => (
                  <button key={key} onClick={() => setCurrentPalette(key)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all hover:scale-105"
                    style={{
                      background: currentPalette === key ? `${palette.primary}26` : 'rgba(0,0,0,0.2)',
                      border: `1px solid ${currentPalette === key ? palette.primary : 'transparent'}`
                    }}>
                    <div className="flex gap-1">
                      <div className="w-5 h-5 rounded" style={{ background: pal.primary }}></div>
                      <div className="w-5 h-5 rounded" style={{ background: pal.secondary }}></div>
                    </div>
                    <span className="text-sm font-medium" style={{ color: getTextColor('primary') }}>{pal.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Recording Settings */}
            <div style={{
              background: palette.cardBg,
              border: `1px solid ${palette.cardBorder}`
            }} className="rounded-lg p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <Mic className="w-5 h-5" style={{ color: palette.primary }} />
                <h3 className="text-xl font-semibold" style={{ color: getTextColor('primary') }}>Transcription Settings</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block font-medium mb-2" style={{ color: getTextColor('primary') }}>Transcription Method</label>
                  <div className="space-y-3">
                    <button
                      onClick={() => setSettings({...settings, useGeminiTranscription: true})}
                      className="w-full px-4 py-3 rounded-lg transition-all text-left"
                      style={{
                        background: settings.useGeminiTranscription ? `${palette.primary}26` : 'rgba(0,0,0,0.2)',
                        border: `1px solid ${settings.useGeminiTranscription ? palette.primary : palette.cardBorder}`
                      }}>
                      <div className="flex items-start gap-3">
                        <Sparkles className="w-5 h-5 mt-1 flex-shrink-0" style={{ color: palette.primary }} />
                        <div className="flex-1">
                          <div className="font-semibold mb-1" style={{ color: getTextColor('primary') }}>Gemini AI Transcription</div>
                          <p className="text-xs" style={{ color: getTextColor('secondary') }}>
                            Uses Google Gemini 1.5 Flash for accurate speech-to-text. Processes audio every 10 seconds. Requires API key and uses quota.
                          </p>
                        </div>
                        {settings.useGeminiTranscription && (
                          <div className="w-2 h-2 rounded-full" style={{ background: palette.primary }}></div>
                        )}
                      </div>
                    </button>

                    <button
                      onClick={() => setSettings({...settings, useGeminiTranscription: false})}
                      className="w-full px-4 py-3 rounded-lg transition-all text-left"
                      style={{
                        background: !settings.useGeminiTranscription ? `${palette.primary}26` : 'rgba(0,0,0,0.2)',
                        border: `1px solid ${!settings.useGeminiTranscription ? palette.primary : palette.cardBorder}`
                      }}>
                      <div className="flex items-start gap-3">
                        <Mic className="w-5 h-5 mt-1 flex-shrink-0" style={{ color: getTextColor('secondary') }} />
                        <div className="flex-1">
                          <div className="font-semibold mb-1" style={{ color: getTextColor('primary') }}>Browser Speech Recognition</div>
                          <p className="text-xs" style={{ color: getTextColor('secondary') }}>
                            Uses browser's built-in Web Speech API for real-time transcription. Free, instant, but less accurate. Chrome/Edge/Safari only.
                          </p>
                        </div>
                        {!settings.useGeminiTranscription && (
                          <div className="w-2 h-2 rounded-full" style={{ background: palette.primary }}></div>
                        )}
                      </div>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-medium mb-2" style={{ color: getTextColor('primary') }}>Gemini Model</label>
                  <select value={settings.defaultAiModel}
                    onChange={(e) => setSettings({...settings, defaultAiModel: e.target.value})}
                    style={{ background: 'rgba(15, 30, 50, 0.4)', border: `1px solid ${palette.cardBorder}`, color: getTextColor('primary') }}
                    className="w-full rounded-lg px-4 py-2 outline-none transition-colors">
                    <option value="gemini-1.5-flash">Gemini 1.5 Flash (Recommended - Fast & Cheap)</option>
                    <option value="gemini-1.5-pro">Gemini 1.5 Pro (More Accurate)</option>
                  </select>
                </div>

                <div style={{ background: 'rgba(251, 146, 60, 0.1)', border: '1px solid rgba(251, 146, 60, 0.3)' }}
                     className="rounded-lg p-3">
                  <p className="text-xs" style={{ color: '#fdba74' }}>
                    <strong>Note:</strong> Gemini transcription uses your API quota. Flash model is recommended for best cost/performance balance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Recording View
        <div className="max-w-[1800px] mx-auto px-6 py-8">
          <div style={{
            background: palette.cardBg,
            border: `1px solid ${palette.cardBorder}`,
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
          }} className="rounded-lg overflow-hidden p-6">

            <div className="grid grid-cols-2 gap-6">
              {/* Recording Controls */}
              <div style={{
                background: 'rgba(0, 0, 0, 0.15)',
                borderRadius: '12px',
                padding: '24px'
              }}>
                {isRecording && (
                  <div className="mb-4">
                    <input
                      type="text"
                      value={currentMeeting?.title || 'Untitled Meeting'}
                      onChange={(e) => setCurrentMeeting({ ...currentMeeting, title: e.target.value })}
                      style={{ background: 'rgba(0, 0, 0, 0.2)', border: `1px solid ${palette.cardBorder}`, color: getTextColor('primary') }}
                      className="w-full text-lg font-semibold px-4 py-3 rounded-lg outline-none"
                    />
                  </div>
                )}

                {/* Waveform Visualization */}
                <div className="relative mb-4" style={{ height: '140px' }}>
                  <div className="h-full flex items-center justify-center gap-0.5 relative px-6">
                    {Array(50).fill(0).map((_, i) => {
                      const baseHeight = audioWaveform[audioWaveform.length - 50 + i] || 0.1;
                      return (
                        <div key={i} className="w-2 rounded-full transition-all" style={{
                          height: `${baseHeight * 80}%`,
                          background: isRecording && !isPaused ? `linear-gradient(to top, ${palette.primary}, ${palette.secondary})` : 'rgba(100, 116, 139, 0.3)',
                          opacity: isRecording && !isPaused ? 0.9 : 0.5
                        }} />
                      );
                    })}
                  </div>
                </div>

                {/* Recording Controls */}
                <div className="flex items-center justify-center gap-6 mb-4">
                  <button onClick={isPaused ? resumeRecording : pauseRecording} disabled={!isRecording}
                    style={{
                      background: 'rgba(0, 0, 0, 0.4)',
                      border: `1px solid ${palette.cardBorder}`,
                      height: '81px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                    }}
                    className="w-24 rounded-lg flex flex-col items-center justify-center gap-2 disabled:opacity-40 transition-all hover:shadow-lg">
                    <div className="h-1 w-10 rounded-full" style={{
                      background: !isRecording ? 'rgba(100, 116, 139, 0.4)' : isPaused ? '#00FF88' : '#FFB800'
                    }}></div>
                    <span className="text-sm font-medium uppercase" style={{
                      color: !isRecording ? 'rgb(100, 116, 139)' : getTextColor('primary')
                    }}>
                      {isPaused ? 'Resume' : 'Pause'}
                    </span>
                  </button>

                  {isRecording ? (
                    <div style={{
                      background: 'rgba(0, 0, 0, 0.4)',
                      border: `1px solid ${palette.cardBorder}`,
                      height: '81px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                    }}
                      className="rounded-lg px-6 py-3 flex items-center gap-3">
                      <span className="text-3xl font-semibold" style={{ fontVariantNumeric: 'tabular-nums', color: getTextColor('primary') }}>
                        {formatTime(elapsedTime)}
                      </span>
                      <div className="w-px h-8" style={{ background: `${palette.cardBorder}` }}></div>
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ background: '#FF3B5C' }}></div>
                        <span className="text-sm font-medium uppercase" style={{ color: getTextColor('secondary') }}>REC</span>
                      </div>
                    </div>
                  ) : (
                    <button onClick={startRecording}
                      style={{
                        background: 'rgba(0, 0, 0, 0.4)',
                        border: `1px solid ${palette.cardBorder}`,
                        height: '81px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                      }}
                      className="w-24 rounded-lg flex flex-col items-center justify-center gap-2 transition-all hover:shadow-lg group">
                      <div className="h-1 w-10 rounded-full group-hover:w-12 transition-all" style={{ background: '#00FF88' }}></div>
                      <span className="text-sm font-medium uppercase" style={{ color: getTextColor('primary') }}>Record</span>
                    </button>
                  )}

                  <button onClick={stopRecording} disabled={!isRecording}
                    style={{
                      background: 'rgba(0, 0, 0, 0.4)',
                      border: `1px solid ${palette.cardBorder}`,
                      height: '81px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                    }}
                    className="w-24 rounded-lg flex flex-col items-center justify-center gap-2 disabled:opacity-40 transition-all hover:shadow-lg">
                    <div className="h-1 w-10 rounded-full" style={{ background: !isRecording ? 'rgba(100, 116, 139, 0.4)' : '#FF3B5C' }}></div>
                    <span className="text-sm font-medium uppercase" style={{ color: !isRecording ? 'rgb(100, 116, 139)' : getTextColor('primary') }}>
                      Stop
                    </span>
                  </button>
                </div>

                {/* Notes Section */}
                <div className="flex flex-col" style={{ flex: 1 }}>
                  <div className="pb-3 mb-3">
                    <h3 className="text-base font-normal" style={{
                      color: getTextColor('secondary'),
                      letterSpacing: '0.01em'
                    }}>Meeting Notes</h3>
                  </div>
                  {isRecording && (
                    <button onClick={addBookmark}
                      style={{
                        background: 'rgba(251, 146, 60, 0.15)',
                        border: '1px solid rgba(251, 146, 60, 0.3)',
                        color: '#fb923c'
                      }}
                      className="mb-3 px-4 py-2 rounded-lg transition-all hover:bg-opacity-20 flex items-center gap-2">
                      <Bookmark className="w-4 h-4" />
                      <span className="text-sm font-medium">Add Bookmark</span>
                    </button>
                  )}
                  <div
                    ref={notesRef}
                    contentEditable
                    onInput={(e) => setNotes(e.currentTarget.textContent || '')}
                    style={{
                      minHeight: '200px',
                      background: 'rgba(0, 0, 0, 0.2)',
                      outline: 'none',
                      border: 'none',
                      color: getTextColor('secondary')
                    }}
                    className="flex-1 w-full rounded-lg p-4 overflow-y-auto"
                    suppressContentEditableWarning={true}
                  >
                    {!notes && <span style={{ color: 'rgb(107, 114, 128)', opacity: 0.5 }}>Take notes during the meeting...</span>}
                  </div>
                </div>
              </div>

              {/* Live Transcription */}
              <div style={{
                background: 'rgba(0, 0, 0, 0.15)',
                borderRadius: '12px',
                padding: '24px'
              }}>
                <div className="pb-3 mb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-normal" style={{
                        color: getTextColor('secondary'),
                        letterSpacing: '0.01em'
                      }}>Live Transcription</h3>
                      {isRecording && (
                        <div className="flex items-center gap-1.5 mt-1">
                          {settings.useGeminiTranscription ? (
                            <>
                              <Sparkles className="w-3 h-3" style={{ color: palette.primary }} />
                              <span className="text-xs" style={{ color: getTextColor('tertiary') }}>
                                Gemini AI {isTranscribing ? '(Processing...)' : '(Every 10s)'}
                              </span>
                            </>
                          ) : (
                            <>
                              <Mic className="w-3 h-3" style={{ color: getTextColor('tertiary') }} />
                              <span className="text-xs" style={{ color: getTextColor('tertiary') }}>
                                Web Speech API (Real-time)
                              </span>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                    {isRecording && !isPaused && (
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xs" style={{ color: getTextColor('tertiary') }}>
                          {isTranscribing ? 'Transcribing...' : 'Listening...'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3 text-sm overflow-y-auto" style={{ maxHeight: 'calc(100vh - 400px)' }}>
                  {transcript.length === 0 && !isRecording && (
                    <div className="text-center py-8">
                      <p className="text-xs" style={{ color: getTextColor('tertiary'), opacity: 0.7 }}>
                        Start recording to see live transcription
                      </p>
                    </div>
                  )}

                  {transcript.map((seg, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold" style={{
                          background: `linear-gradient(135deg, ${palette.primary} 0%, ${palette.secondary} 100%)`,
                          color: 'white'
                        }}>
                          {seg.speaker.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                        </div>
                        <span className="font-medium text-sm" style={{ color: palette.primary }}>{seg.speaker}</span>
                        <span className="text-xs" style={{ color: getTextColor('tertiary') }}>{seg.time}</span>
                      </div>
                      <p className="leading-relaxed pl-10" style={{ color: getTextColor('secondary') }}>{seg.text}</p>
                    </div>
                  ))}

                  {liveTranscriptText && (
                    <div className="space-y-2 opacity-60">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold" style={{
                          background: `linear-gradient(135deg, ${palette.primary} 0%, ${palette.secondary} 100%)`,
                          color: 'white'
                        }}>
                          S1
                        </div>
                        <span className="font-medium text-sm" style={{ color: palette.primary }}>Speaker 1</span>
                        <span className="text-xs" style={{ color: getTextColor('tertiary') }}>{formatTime(elapsedTime)}</span>
                      </div>
                      <p className="leading-relaxed pl-10 italic" style={{ color: getTextColor('secondary') }}>{liveTranscriptText}</p>
                    </div>
                  )}
                </div>

                {isGeneratingSummary && (
                  <div className="mt-4 p-4 rounded-lg" style={{
                    background: 'rgba(0, 0, 0, 0.2)',
                    border: `1px solid ${palette.cardBorder}`
                  }}>
                    <div className="flex items-center gap-3">
                      <div className="animate-spin">
                        <Sparkles className="w-5 h-5" style={{ color: palette.primary }} />
                      </div>
                      <span className="text-sm" style={{ color: getTextColor('secondary') }}>
                        Generating AI summary...
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
