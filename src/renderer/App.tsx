import React, { useState, useEffect, useRef } from 'react';
import { Mic, Square, Pause, Play, Clock, Calendar, Search, Download, ChevronDown, User, FileText, TrendingUp, Settings, Zap, ArrowLeft, Edit2, Sparkles, BarChart3, Save, Bold, Italic, List, Filter, X, Plus, Lightbulb, CheckSquare, Users, Bookmark, Layers, Brain, Heading1, Archive, Palette } from 'lucide-react';

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
  const [view, setView] = useState('record');
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [transcriptView, setTranscriptView] = useState('transcript');
  const [actionItemsView, setActionItemsView] = useState(false);
  const [actionItemFilter, setActionItemFilter] = useState('all');
  const [actionItemSort, setActionItemSort] = useState('recent');
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [notes, setNotes] = useState('');
  const [currentMeeting, setCurrentMeeting] = useState(null);
  const [editingMeetingTitle, setEditingMeetingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ dateRange: 'all', speakers: [] });
  const [audioWaveform, setAudioWaveform] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(0);
  const [currentPalette, setCurrentPalette] = useState('mediumGray');
  const [editingSpeaker, setEditingSpeaker] = useState(null);
  const [newSpeakerName, setNewSpeakerName] = useState('');
  const [activeFormats, setActiveFormats] = useState({ bold: false, italic: false, list: false });
  const [newActionItem, setNewActionItem] = useState('');
  const [newActionAssignee, setNewActionAssignee] = useState('');
  const [newActionDueDate, setNewActionDueDate] = useState('');
  const [editingTitle, setEditingTitle] = useState(false);
  const [tempMeetingTitle, setTempMeetingTitle] = useState('');
  const [actionItemSearchQuery, setActionItemSearchQuery] = useState('');
  const waveformRef = useRef(null);
  const notesRef = useRef(null);

  const palette = colorPalettes[currentPalette];

  const [settings, setSettings] = useState({
    defaultAiModel: 'claude-sonnet-4.5',
    customVocabulary: ['forklift', 'pallet jack', 'reach truck', 'order picker'],
    selectedMicrophone: 'default',
    calendarIntegration: false
  });

  const meetingTemplates = [
    { id: 'general', name: 'General Meeting', icon: Users },
    { id: 'standup', name: 'Daily Standup', icon: Zap },
    { id: 'sales', name: 'Sales Call', icon: TrendingUp },
    { id: 'training', name: 'Training Session', icon: Brain }
  ];

  const cardColors = ['#3B82F6', '#8B5CF6', '#F59E0B', '#10B981', '#EC4899', '#06B6D4'];

  const [meetings, setMeetings] = useState([
    {
      id: 1,
      title: 'Q4 Sales Strategy Review',
      date: '2025-10-08',
      duration: '58:42',
      durationSeconds: 3522,
      selectedAiModel: 'claude-sonnet-4.5',
      template: 'sales',
      bookmarks: [
        { time: '04:30', label: 'Pricing discussion', timestamp: 270 },
        { time: '11:00', label: 'Partnership opportunities', timestamp: 660 }
      ],
      actionItems: [
        { id: 1, text: 'Prepare competitive analysis by October 15th', assignee: 'Sarah Chen', completed: true, priority: 'high', dueDate: '2025-10-07' },
        { id: 2, text: 'Develop tiered pricing model', assignee: 'Mike Ross', completed: false, priority: 'high', dueDate: '2025-10-20' },
        { id: 3, text: 'Review market positioning slides', assignee: 'Sarah Chen', completed: true, priority: 'medium', dueDate: '2025-10-09' },
        { id: 4, text: 'Schedule client feedback sessions', assignee: 'Jennifer Liu', completed: false, priority: 'medium', dueDate: '2025-10-17' },
        { id: 5, text: 'Update sales deck with new pricing', assignee: 'Mike Ross', completed: true, priority: 'high', dueDate: '2025-10-10' },
        { id: 6, text: 'Finalize Q4 revenue projections', assignee: 'Jennifer Liu', completed: true, priority: 'high', dueDate: '2025-10-08' }
      ],
      smartHighlights: [
        { time: '03:15', text: 'Jennifer identifies 15% pricing gap', type: 'insight' },
        { time: '09:30', text: 'Partnership with consulting firms', type: 'opportunity' }
      ],
      speakingTime: {
        'Sarah Chen': 1200,
        'Mike Ross': 980,
        'Jennifer Liu': 720,
        'David Park': 622
      },
      transcript: [
        { speaker: 'Sarah Chen', time: '00:00', timestamp: 0, text: 'Good morning everyone, thanks for joining. Let\'s dive into our Q4 strategy.' },
        { speaker: 'Mike Ross', time: '00:45', timestamp: 45, text: 'I agree completely. Our market analysis shows strong potential in the Northeast region. The competitive landscape has shifted significantly.' },
        { speaker: 'Jennifer Liu', time: '02:15', timestamp: 135, text: 'I\'ve been tracking our pricing against competitors. We have about a 15% gap that we need to address before year-end.' },
        { speaker: 'David Park', time: '03:30', timestamp: 210, text: 'From an operations perspective, we can support the volume increase. Our supply chain is ready.' }
      ],
      audioWaveform: Array(200).fill(0).map(() => Math.random() * 0.8 + 0.2)
    },
    {
      id: 2,
      title: 'Product Development Sprint Planning',
      date: '2025-10-07',
      duration: '32:18',
      durationSeconds: 1938,
      selectedAiModel: 'gpt-4',
      template: 'standup',
      bookmarks: [],
      actionItems: [
        { id: 1, text: 'Simplify authentication to email-only', assignee: 'Mike Ross', completed: true, priority: 'high', dueDate: '2025-10-05' },
        { id: 2, text: 'Update API documentation', assignee: 'Sarah Chen', completed: false, priority: 'medium', dueDate: '2025-10-12' },
        { id: 3, text: 'Refactor user dashboard components', assignee: 'Jennifer Liu', completed: true, priority: 'medium', dueDate: '2025-10-08' },
        { id: 4, text: 'Implement dark mode toggle', assignee: 'Mike Ross', completed: false, priority: 'low', dueDate: '2025-10-16' }
      ],
      smartHighlights: [],
      speakingTime: {
        'James Liu': 650,
        'Emily Zhang': 720,
        'Alex Torres': 568
      },
      transcript: [
        { speaker: 'James Liu', time: '00:00', timestamp: 0, text: 'Let\'s review the prototype feedback from last week\'s user testing sessions.' },
        { speaker: 'Emily Zhang', time: '01:20', timestamp: 80, text: 'The main issue users mentioned was the complex login flow. I propose we simplify to email-only authentication.' },
        { speaker: 'Alex Torres', time: '02:45', timestamp: 165, text: 'That makes sense. We can implement passwordless login with magic links. Much better UX.' }
      ],
      audioWaveform: Array(200).fill(0).map(() => Math.random() * 0.7 + 0.3)
    },
    {
      id: 3,
      title: 'Warehouse Operations Weekly Sync',
      date: '2025-10-05',
      duration: '45:12',
      durationSeconds: 2712,
      selectedAiModel: 'claude-sonnet-4.5',
      template: 'general',
      bookmarks: [],
      actionItems: [
        { id: 1, text: 'Order 3 new reach trucks for Bay 4', assignee: 'Sarah Chen', completed: true, priority: 'high', dueDate: '2025-10-06' },
        { id: 2, text: 'Schedule forklift maintenance for next week', assignee: 'Mike Ross', completed: true, priority: 'medium', dueDate: '2025-10-09' },
        { id: 3, text: 'Update warehouse safety protocols', assignee: 'Jennifer Liu', completed: false, priority: 'medium', dueDate: '2025-10-16' },
        { id: 4, text: 'Train new operators on pallet jack use', assignee: 'Sarah Chen', completed: true, priority: 'high', dueDate: '2025-10-07' }
      ],
      smartHighlights: [],
      speakingTime: {
        'Marcus Williams': 1200,
        'Sarah Johnson': 890,
        'Tom Chen': 622
      },
      transcript: [
        { speaker: 'Marcus Williams', time: '00:00', timestamp: 0, text: 'Good morning team. Let\'s start with the equipment status. Bay 4 needs additional reach trucks.' },
        { speaker: 'Sarah Johnson', time: '01:15', timestamp: 75, text: 'I\'ve noticed two of our older forklifts are showing signs of wear. We should schedule preventive maintenance.' },
        { speaker: 'Tom Chen', time: '02:40', timestamp: 160, text: 'The new pallet jack is working great. Productivity in Zone C is up 12% this week.' }
      ],
      audioWaveform: Array(200).fill(0).map(() => Math.random() * 0.6 + 0.3)
    },
    {
      id: 4,
      title: 'Client Onboarding - Midwest Logistics',
      date: '2025-10-03',
      duration: '1:14:25',
      durationSeconds: 4465,
      selectedAiModel: 'claude-sonnet-4.5',
      template: 'sales',
      bookmarks: [],
      actionItems: [
        { id: 1, text: 'Send contract proposal by Friday', assignee: 'Mike Ross', completed: true, priority: 'high', dueDate: '2025-10-05' },
        { id: 2, text: 'Schedule facility tour for next Tuesday', assignee: 'Sarah Chen', completed: true, priority: 'medium', dueDate: '2025-10-04' },
        { id: 3, text: 'Prepare product demonstration materials', assignee: 'Jennifer Liu', completed: false, priority: 'high', dueDate: '2025-10-13' },
        { id: 4, text: 'Follow up with client on equipment specifications', assignee: 'Mike Ross', completed: false, priority: 'high', dueDate: '2025-10-15' }
      ],
      smartHighlights: [],
      speakingTime: {
        'Rachel Green': 1800,
        'David Kim': 1450,
        'Client - John Miller': 1215
      },
      transcript: [
        { speaker: 'Rachel Green', time: '00:00', timestamp: 0, text: 'Thank you for taking the time to meet with us today. We\'re excited to discuss how we can support Midwest Logistics.' },
        { speaker: 'Client - John Miller', time: '01:05', timestamp: 65, text: 'We\'re looking to upgrade our material handling equipment across three facilities. Particularly interested in your electric forklift options.' },
        { speaker: 'David Kim', time: '02:30', timestamp: 150, text: 'We can definitely help with that. Our latest electric models have 30% longer battery life and reduced maintenance costs.' }
      ],
      audioWaveform: Array(200).fill(0).map(() => Math.random() * 0.75 + 0.25)
    },
    {
      id: 5,
      title: 'Safety Training - New Equipment Protocol',
      date: '2025-09-30',
      duration: '28:55',
      durationSeconds: 1735,
      selectedAiModel: 'gpt-4',
      template: 'training',
      bookmarks: [],
      actionItems: [
        { id: 1, text: 'Complete certification for all operators', assignee: 'Jennifer Liu', completed: false, priority: 'high', dueDate: '2025-10-18' },
        { id: 2, text: 'Update safety training manual', assignee: 'Sarah Chen', completed: true, priority: 'medium', dueDate: '2025-09-30' },
        { id: 3, text: 'Order new safety equipment for operators', assignee: 'Mike Ross', completed: false, priority: 'high', dueDate: '2025-10-12' }
      ],
      smartHighlights: [],
      speakingTime: {
        'Linda Martinez': 1200,
        'Operations Team': 535
      },
      transcript: [
        { speaker: 'Linda Martinez', time: '00:00', timestamp: 0, text: 'Today we\'re covering the new safety protocols for our order picker equipment. Pay close attention to the load capacity guidelines.' },
        { speaker: 'Operations Team', time: '05:20', timestamp: 320, text: 'What\'s the maximum height we can safely operate at with a full load?' },
        { speaker: 'Linda Martinez', time: '05:45', timestamp: 345, text: 'Great question. Maximum safe height is 25 feet with full capacity. Always check the load chart before lifting.' }
      ],
      audioWaveform: Array(200).fill(0).map(() => Math.random() * 0.65 + 0.3)
    }
  ]);

  const [elapsedTime, setElapsedTime] = useState(0);
  const [audioLevels, setAudioLevels] = useState(Array(50).fill(0));
  const timerRef = useRef(null);
  const phaseRef = useRef(0);

  const applySearchAndFilters = (meetings) => {
    let filtered = [...meetings];
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(m => m.title.toLowerCase().includes(query));
    }
    return filtered;
  };

  const filteredMeetings = applySearchAndFilters(meetings);
  const totalRecordings = filteredMeetings.length;
  const totalMinutes = Math.floor(filteredMeetings.reduce((sum, m) => sum + (m.durationSeconds || 0), 0) / 60);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}-${day}-${year}`;
  };

  const getDefaultMeetingTitle = () => {
    const dateStr = formatDate(new Date().toISOString());
    return `${dateStr} - Meeting`;
  };

  const addBookmark = () => {
    const timeStr = formatTime(elapsedTime);
    const newBookmark = { time: timeStr, label: `Bookmark ${bookmarks.length + 1}`, timestamp: elapsedTime };
    setBookmarks([...bookmarks, newBookmark]);

    const bookmarkText = `[${timeStr}] BOOKMARK ${bookmarks.length + 1}\n`;
    setTranscript(prev => prev + bookmarkText);
  };

  const togglePlayback = () => setIsPlaying(!isPlaying);
  const stopPlayback = () => { setIsPlaying(false); setPlaybackProgress(0); };

  const handleWaveformClick = (e) => {
    if (!waveformRef.current || !selectedMeeting?.audioWaveform) return;
    const rect = waveformRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setPlaybackProgress(Math.max(0, Math.min(100, percentage)));
  };

  const handleSpeakerNameClick = (speaker) => {
    setEditingSpeaker(speaker);
    setNewSpeakerName(speaker);
  };

  const updateSpeakerName = () => {
    if (!editingSpeaker || !newSpeakerName.trim() || !selectedMeeting) return;

    const updatedMeetings = meetings.map(m => {
      if (m.id === selectedMeeting.id) {
        return {
          ...m,
          transcript: m.transcript.map(entry => ({
            ...entry,
            speaker: entry.speaker === editingSpeaker ? newSpeakerName : entry.speaker
          })),
          speakingTime: Object.keys(m.speakingTime).reduce((acc, key) => {
            if (key === editingSpeaker) {
              acc[newSpeakerName] = m.speakingTime[key];
            } else {
              acc[key] = m.speakingTime[key];
            }
            return acc;
          }, {})
        };
      }
      return m;
    });

    setMeetings(updatedMeetings);
    setSelectedMeeting(updatedMeetings.find(m => m.id === selectedMeeting.id));
    setEditingSpeaker(null);
    setNewSpeakerName('');
  };

  const jumpToTimestamp = (timestamp) => {};

  const addActionItem = () => {
    if (!newActionItem.trim() || !selectedMeeting) return;

    const updatedMeetings = meetings.map(m => {
      if (m.id === selectedMeeting.id) {
        const newItem = {
          id: (m.actionItems?.length || 0) + 1,
          text: newActionItem,
          assignee: newActionAssignee || 'Unassigned',
          completed: false,
          priority: 'medium',
          dueDate: newActionDueDate || null
        };
        return {
          ...m,
          actionItems: [...(m.actionItems || []), newItem]
        };
      }
      return m;
    });

    setMeetings(updatedMeetings);
    setSelectedMeeting(updatedMeetings.find(m => m.id === selectedMeeting.id));
    setNewActionItem('');
    setNewActionAssignee('');
    setNewActionDueDate('');
  };

  const toggleActionItem = (meetingId, actionItemId) => {
    const updatedMeetings = meetings.map(m => {
      if (m.id === meetingId) {
        return {
          ...m,
          actionItems: m.actionItems.map(item =>
            item.id === actionItemId ? { ...item, completed: !item.completed } : item
          )
        };
      }
      return m;
    });

    setMeetings(updatedMeetings);
    if (selectedMeeting && selectedMeeting.id === meetingId) {
      setSelectedMeeting(updatedMeetings.find(m => m.id === meetingId));
    }
  };

  const saveMeetingTitle = () => {
    if (!tempMeetingTitle.trim()) return;

    if (currentMeeting) {
      setCurrentMeeting({ ...currentMeeting, title: tempMeetingTitle });
    }

    if (selectedMeeting) {
      const updatedMeetings = meetings.map(m =>
        m.id === selectedMeeting.id ? { ...m, title: tempMeetingTitle } : m
      );
      setMeetings(updatedMeetings);
      setSelectedMeeting(updatedMeetings.find(m => m.id === selectedMeeting.id));
    }

    setEditingTitle(false);
  };

  const applyFormatting = (format) => {
    if (!notesRef.current) return;
    notesRef.current.focus();

    document.execCommand('styleWithCSS', false, true);

    switch(format) {
      case 'bold':
        document.execCommand('bold', false, null);
        break;
      case 'italic':
        document.execCommand('italic', false, null);
        break;
      case 'list':
        document.execCommand('insertUnorderedList', false, null);
        break;
      case 'h1':
        document.execCommand('formatBlock', false, '<h3>');
        break;
    }

    setTimeout(() => updateFormatState(), 10);
  };

  const updateFormatState = () => {
    if (!notesRef.current || !document.hasFocus()) return;

    try {
      setActiveFormats({
        bold: document.queryCommandState('bold'),
        italic: document.queryCommandState('italic'),
        list: document.queryCommandState('insertUnorderedList')
      });
    } catch (e) {
      // Ignore
    }
  };

  const handleNotesInput = (e) => {
    setNotes(e.currentTarget.innerHTML);

    const text = e.currentTarget.textContent;
    const lastChars = text.slice(-2);

    if (lastChars === '* ' || lastChars === '- ') {
      const beforeText = text.slice(0, -2).trim();

      if (beforeText === '' || beforeText.endsWith('\n')) {
        e.currentTarget.textContent = text.slice(0, -2);

        const range = document.createRange();
        const sel = window.getSelection();
        range.selectNodeContents(e.currentTarget);
        range.collapse(false);
        sel.removeAllRanges();
        sel.addRange(range);

        document.execCommand('insertUnorderedList', false, null);
        setTimeout(() => updateFormatState(), 10);
      }
    }
  };

  const handleNotesKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && !e.shiftKey && !e.altKey) {
      if (e.key.toLowerCase() === 'b') {
        e.preventDefault();
        applyFormatting('bold');
        return;
      }
      if (e.key.toLowerCase() === 'i') {
        e.preventDefault();
        applyFormatting('italic');
        return;
      }
    }

    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === '8') {
      e.preventDefault();
      applyFormatting('list');
      return;
    }

    if (e.key === 'Tab') {
      e.preventDefault();

      const sel = window.getSelection();
      if (!sel.rangeCount) return;

      const range = sel.getRangeAt(0);
      let node = range.startContainer;

      while (node && node !== notesRef.current) {
        if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'LI') {
          if (e.shiftKey) {
            document.execCommand('outdent', false, null);
          } else {
            document.execCommand('indent', false, null);
          }
          setTimeout(() => updateFormatState(), 10);
          return;
        }
        node = node.parentNode;
      }

      document.execCommand('insertHTML', false, '&nbsp;&nbsp;&nbsp;&nbsp;');
    }

    if (e.key === 'Enter') {
      const sel = window.getSelection();
      if (!sel.rangeCount) return;

      let node = sel.getRangeAt(0).startContainer;
      while (node && node !== notesRef.current) {
        if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'LI') {
          if (node.textContent.trim() === '') {
            e.preventDefault();
            document.execCommand('outdent', false, null);
            setTimeout(() => updateFormatState(), 10);
          }
          return;
        }
        node = node.parentNode;
      }
    }

    if (e.key === 'Backspace') {
      const sel = window.getSelection();
      if (!sel.rangeCount || !sel.getRangeAt(0).collapsed) return;

      const range = sel.getRangeAt(0);
      let node = range.startContainer;

      while (node && node !== notesRef.current) {
        if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'LI') {
          if (range.startOffset === 0 && node.firstChild === range.startContainer) {
            e.preventDefault();
            document.execCommand('outdent', false, null);
            setTimeout(() => updateFormatState(), 10);
          }
          return;
        }
        node = node.parentNode;
      }
    }
  };

  const handleNotesClick = () => {
    setTimeout(() => updateFormatState(), 10);
  };

  const handleNotesKeyUp = (e) => {
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
      updateFormatState();
    }
  };

  useEffect(() => {
    let animationId = null;
    const animate = () => {
      phaseRef.current += 0.05;
      setAudioLevels(prev =>
        prev.map((_, i) => {
          if (isRecording && !isPaused) {
            const wave = Math.sin((i * 0.15) + phaseRef.current) * 0.4 + 0.5;
            return wave;
          }
          return 0.1;
        })
      );

      if (isRecording && !isPaused) {
        setAudioWaveform(prev => {
          const newWave = [...prev, Math.random() * 0.8 + 0.2];
          return newWave.slice(-200);
        });
      }

      animationId = requestAnimationFrame(animate);
    };
    if (isRecording) animate();
    return () => { if (animationId) cancelAnimationFrame(animationId); };
  }, [isRecording, isPaused]);

  useEffect(() => {
    if (isRecording && !isPaused) {
      timerRef.current = setInterval(() => setElapsedTime(prev => prev + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isRecording, isPaused]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startRecording = () => {
    setIsRecording(true);
    setIsPaused(false);
    setAudioWaveform([]);
    const defaultTitle = getDefaultMeetingTitle();
    setCurrentMeeting({ title: defaultTitle, startTime: new Date(), template: 'general' });
    setTempTitle(defaultTitle);
  };

  const pauseRecording = () => setIsPaused(true);
  const resumeRecording = () => setIsPaused(false);

  const stopRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
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
      transcript: [{ speaker: 'Speaker 1', time: '00:00', timestamp: 0, text: transcript || 'No transcript available' }],
      audioWaveform: [...audioWaveform]
    };
    setMeetings(prev => [newMeeting, ...prev]);
    setIsRecording(false);
    setIsPaused(false);
    setTranscript('');
    setNotes('');
    if (notesRef.current) notesRef.current.innerHTML = '';
    setElapsedTime(0);
    setCurrentMeeting(null);
    setAudioWaveform([]);
    setBookmarks([]);
  };

  const goHome = () => {
    setView('record');
    setSelectedMeeting(null);
  };

  const getTextColor = (type = 'primary') => {
    if (currentPalette === 'light') {
      if (type === 'primary') return palette.textPrimary || '#1e293b';
      if (type === 'secondary') return palette.textSecondary || '#475569';
      if (type === 'tertiary') return palette.textTertiary || '#64748b';
    }
    return type === 'primary' ? 'white' : type === 'secondary' ? '#d1d5db' : '#9ca3af';
  };

  return (
    <div className="min-h-screen" style={{
      background: palette.background,
      fontFamily: '"Roboto", -apple-system, BlinkMacSystemFont, system-ui, sans-serif'
    }}>
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
              <button onClick={() => setActionItemsView(!actionItemsView)}
                className="p-3 rounded-lg transition-all hover:opacity-70" style={{
                  color: getTextColor('secondary')
                }}>
                <CheckSquare className="w-5 h-5" />
              </button>
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

      {actionItemsView ? (
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2" style={{ color: getTextColor('primary') }}>Action Items</h2>
            <p className="text-sm" style={{ color: getTextColor('secondary') }}>All tasks from your meetings in one place</p>
          </div>

          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-4 space-y-6">
              {(() => {
                let assigneeStats = {};
                meetings.forEach(meeting => {
                  if (meeting.actionItems && meeting.actionItems.length > 0) {
                    meeting.actionItems.forEach(item => {
                      if (!assigneeStats[item.assignee]) {
                        assigneeStats[item.assignee] = { total: 0, completed: 0 };
                      }
                      assigneeStats[item.assignee].total++;
                      if (item.completed) assigneeStats[item.assignee].completed++;
                    });
                  }
                });

                const completionTimes = {
                  'Sarah Chen': 2.3,
                  'Mike Ross': 3.8,
                  'Jennifer Liu': 1.9
                };

                return Object.entries(assigneeStats).map(([assignee, stats], idx) => {
                  const percentage = ((stats.completed / stats.total) * 100).toFixed(0);
                  const circumference = 2 * Math.PI * 35;
                  const offset = circumference - (percentage / 100) * circumference;
                  const avgDays = completionTimes[assignee] || 0;

                  return (
                    <div key={assignee} style={{
                      background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.08)'
                    }} className="rounded-xl p-5">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{
                          background: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)'
                        }}>
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm" style={{ color: '#F8FAFC' }}>{assignee}</h3>
                          <p className="text-xs" style={{ color: '#94A3B8' }}>{stats.total} tasks</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center justify-center">
                          <div className="relative" style={{ width: '90px', height: '90px' }}>
                            <svg className="transform -rotate-90" width="90" height="90">
                              <circle
                                cx="45"
                                cy="45"
                                r="35"
                                stroke="rgba(14, 165, 233, 0.2)"
                                strokeWidth="10"
                                fill="none"
                              />
                              <circle
                                cx="45"
                                cy="45"
                                r="35"
                                stroke="url(#gradient)"
                                strokeWidth="10"
                                fill="none"
                                strokeDasharray={circumference}
                                strokeDashoffset={offset}
                                strokeLinecap="round"
                                style={{
                                  transition: 'stroke-dashoffset 0.5s ease'
                                }}
                              />
                              <defs>
                                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                  <stop offset="0%" stopColor="#0EA5E9" />
                                  <stop offset="100%" stopColor="#06B6D4" />
                                </linearGradient>
                              </defs>
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <div className="text-xl font-bold" style={{
                                color: '#0EA5E9'
                              }}>{percentage}%</div>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col justify-center">
                          <div className="relative h-20 rounded-lg flex items-end" style={{ background: 'rgba(14, 165, 233, 0.1)' }}>
                            <div
                              className="w-full rounded-lg relative flex items-center justify-center"
                              style={{
                                height: `${(avgDays / 5) * 100}%`,
                                background: 'linear-gradient(180deg, #06B6D4 0%, #0EA5E9 100%)'
                              }}>
                              <span className="text-sm font-bold text-white">{avgDays} days</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-3 border-t" style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
                        <div className="text-center">
                          <div className="text-lg font-bold" style={{
                            color: '#0EA5E9'
                          }}>{stats.completed}</div>
                          <div className="text-xs" style={{ color: '#94A3B8' }}>Done</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold" style={{ color: '#F8FAFC' }}>{stats.total - stats.completed}</div>
                          <div className="text-xs" style={{ color: '#94A3B8' }}>Todo</div>
                        </div>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>

            <div className="col-span-8">
              <div style={{
                background: palette.cardBg,
                border: `1px solid ${palette.cardBorder}`
              }} className="rounded-lg p-6 shadow-xl mb-6">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4" style={{ color: getTextColor('tertiary') }} />
                  <input type="text" placeholder="Search action items..."
                    style={{ background: 'rgba(0, 0, 0, 0.2)', border: `1px solid ${palette.cardBorder}`, color: getTextColor('primary') }}
                    className="flex-1 text-sm outline-none px-3 py-2 rounded-lg transition-colors" />
                </div>
              </div>
              <select value={actionItemFilter} onChange={(e) => setActionItemFilter(e.target.value)}
                style={{ background: 'rgba(0, 0, 0, 0.2)', border: `1px solid ${palette.cardBorder}`, color: getTextColor('primary') }}
                className="text-sm outline-none px-4 py-2 rounded-lg transition-colors">
                <option value="all">All Items</option>
                <option value="incomplete">Incomplete</option>
                <option value="complete">Complete</option>
                <option value="high">High Priority</option>
              </select>
              <select value={actionItemSort} onChange={(e) => setActionItemSort(e.target.value)}
                style={{ background: 'rgba(0, 0, 0, 0.2)', border: `1px solid ${palette.cardBorder}`, color: getTextColor('primary') }}
                className="text-sm outline-none px-4 py-2 rounded-lg transition-colors">
                <option value="recent">Most Recent</option>
                <option value="oldest">Oldest First</option>
                <option value="priority">By Priority</option>
                <option value="assignee">By Assignee</option>
              </select>
            </div>
          </div>

              <div className="space-y-4">
                {(() => {
                  let allActionItems = [];
                  meetings.forEach(meeting => {
                    if (meeting.actionItems && meeting.actionItems.length > 0) {
                      meeting.actionItems.forEach(item => {
                        const meetingDate = new Date(meeting.date);
                        const now = new Date();
                        const daysElapsed = Math.floor((now - meetingDate) / (1000 * 60 * 60 * 24));
                        allActionItems.push({
                          ...item,
                          meetingId: meeting.id,
                          meetingTitle: meeting.title,
                          meetingDate: meeting.date,
                          daysElapsed: daysElapsed
                        });
                      });
                    }
                  });

                  if (actionItemSearchQuery.trim()) {
                    const query = actionItemSearchQuery.toLowerCase();
                    allActionItems = allActionItems.filter(item =>
                      item.text.toLowerCase().includes(query) ||
                      item.assignee.toLowerCase().includes(query) ||
                      item.meetingTitle.toLowerCase().includes(query)
                    );
                  }

                  if (actionItemFilter === 'incomplete') {
                    allActionItems = allActionItems.filter(item => !item.completed);
                  } else if (actionItemFilter === 'complete') {
                    allActionItems = allActionItems.filter(item => item.completed);
                  } else if (actionItemFilter === 'high') {
                    allActionItems = allActionItems.filter(item => item.priority === 'high');
                  }

                  if (actionItemSort === 'recent') {
                    allActionItems.sort((a, b) => new Date(b.meetingDate) - new Date(a.meetingDate));
                  } else if (actionItemSort === 'oldest') {
                    allActionItems.sort((a, b) => new Date(a.meetingDate) - new Date(b.meetingDate));
                  } else if (actionItemSort === 'priority') {
                    allActionItems.sort((a, b) => {
                      const priorityOrder = { high: 0, medium: 1, low: 2 };
                      return priorityOrder[a.priority] - priorityOrder[b.priority];
                    });
                  } else if (actionItemSort === 'assignee') {
                    allActionItems.sort((a, b) => a.assignee.localeCompare(b.assignee));
                  }

                  return allActionItems.map((item, idx) => {
                    const dueDate = item.dueDate ? new Date(item.dueDate) : null;
                    const now = new Date();
                    const isOverdue = dueDate && dueDate < now && !item.completed;
                    const dueSoon = dueDate && !item.completed && (dueDate - now) / (1000 * 60 * 60 * 24) <= 3;

                    return (
                      <div key={idx} style={{
                        background: palette.cardBg,
                        border: `1px solid ${isOverdue ? '#ef4444' : palette.cardBorder}`
                      }} className="rounded-lg p-6 shadow-xl">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-4 flex-1">
                            <input
                              type="checkbox"
                              checked={item.completed}
                              onChange={() => toggleActionItem(item.meetingId, item.id)}
                              className="w-5 h-5 mt-0.5 rounded cursor-pointer"
                              style={{ accentColor: palette.primary }}
                            />
                            <div className="flex-1">
                              <p
                                className="text-base font-medium mb-2"
                                style={{
                                  color: getTextColor('primary'),
                                  textDecoration: item.completed ? 'line-through' : 'none',
                                  opacity: item.completed ? 0.6 : 1
                                }}>
                                {item.text}
                              </p>
                              <div className="flex items-center gap-3 text-sm flex-wrap">
                                <span style={{ color: getTextColor('tertiary') }}>
                                  From: <span
                                    className="cursor-pointer hover:underline"
                                    style={{ color: palette.primary }}
                                    onClick={() => {
                                      const meeting = meetings.find(m => m.id === item.meetingId);
                                      if (meeting) {
                                        setSelectedMeeting(meeting);
                                        setActionItemsView(false);
                                      }
                                    }}>
                                    {item.meetingTitle}
                                  </span>
                                </span>
                                <span style={{ color: getTextColor('tertiary') }}>•</span>
                                <span style={{ color: getTextColor('tertiary') }}>
                                  {item.daysElapsed === 0 ? 'Today' : item.daysElapsed === 1 ? '1 day ago' : `${item.daysElapsed} days ago`}
                                </span>
                                {dueDate && (
                                  <>
                                    <span style={{ color: getTextColor('tertiary') }}>•</span>
                                    <span style={{
                                      color: isOverdue ? '#ef4444' : dueSoon ? '#f59e0b' : getTextColor('tertiary'),
                                      fontWeight: isOverdue || dueSoon ? '600' : '400'
                                    }}>
                                      Due: {dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                      {isOverdue && ' (Overdue)'}
                                      {dueSoon && !isOverdue && ' (Soon)'}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <div className="text-xs mb-1" style={{ color: getTextColor('tertiary') }}>Assigned to</div>
                              <div className="text-sm font-medium" style={{ color: getTextColor('primary') }}>{item.assignee}</div>
                            </div>
                            <span className="text-xs px-3 py-1.5 rounded-lg font-medium" style={{
                              background: item.priority === 'high' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(251, 146, 60, 0.2)',
                              color: item.priority === 'high' ? '#fca5a5' : '#fdba74'
                            }}>
                              {item.priority}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          </div>
        </div>
      ) : view === 'settings' ? (
        <div className="max-w-5xl mx-auto px-6 py-12">
          <h2 className="text-3xl font-bold mb-8" style={{ color: getTextColor('primary') }}>Settings</h2>
          <div className="space-y-6">
            <div style={{
              background: palette.cardBg,
              border: `1px solid ${palette.cardBorder}`
            }} className="rounded-lg p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <Palette className="w-5 h-5" style={{ color: palette.primary }} />
                <h3 className="text-xl font-semibold" style={{ color: getTextColor('primary') }}>Color Theme</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(colorPalettes).map(([key, pal]) => (
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

            <div style={{
              background: palette.cardBg,
              border: `1px solid ${palette.cardBorder}`
            }} className="rounded-lg p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <Mic className="w-5 h-5" style={{ color: palette.primary }} />
                <h3 className="text-xl font-semibold" style={{ color: getTextColor('primary') }}>Recording Settings</h3>
              </div>
              <div>
                <label className="block font-medium mb-2" style={{ color: getTextColor('primary') }}>Microphone Input</label>
                <select value={settings.selectedMicrophone}
                  onChange={(e) => setSettings({...settings, selectedMicrophone: e.target.value})}
                  style={{ background: 'rgba(15, 30, 50, 0.4)', border: `1px solid ${palette.cardBorder}`, color: getTextColor('primary') }}
                  className="w-full rounded-lg px-4 py-2 outline-none transition-colors">
                  <option value="default">Default Microphone</option>
                  <option value="built-in">Built-in Microphone</option>
                  <option value="usb-mic">USB Microphone</option>
                </select>
              </div>
            </div>

            <div style={{
              background: palette.cardBg,
              border: `1px solid ${palette.cardBorder}`
            }} className="rounded-lg p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="w-5 h-5" style={{ color: palette.secondary }} />
                <h3 className="text-xl font-semibold" style={{ color: getTextColor('primary') }}>Meeting Notifications</h3>
              </div>

              <p className="text-sm mb-6" style={{ color: getTextColor('secondary') }}>Preview how notifications appear during meetings</p>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-4 text-sm" style={{ color: getTextColor('primary') }}>Meeting Starting</h4>
                  <div style={{
                    background: 'rgba(15, 30, 50, 0.6)',
                    border: `1px solid ${palette.primary}4D`
                  }} className="rounded-lg p-4 shadow-2xl">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{
                        background: `linear-gradient(135deg, ${palette.primary} 0%, ${palette.secondary} 100%)`
                      }}>
                        <Zap className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h5 className="font-bold text-sm mb-1" style={{ color: getTextColor('primary') }}>Meeting Starting Soon</h5>
                        <p className="text-xs" style={{ color: getTextColor('secondary') }}>Q4 Strategy Review</p>
                      </div>
                    </div>
                    <div style={{ background: `${palette.primary}1A`, border: `1px solid ${palette.primary}33` }}
                      className="rounded-lg p-3 mb-3">
                      <div className="flex items-center gap-2 text-xs mb-2">
                        <Clock className="w-3.5 h-3.5" style={{ color: palette.primary }} />
                        <span style={{ color: getTextColor('secondary') }}>2:00 PM - 3:00 PM</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <Users className="w-3.5 h-3.5 text-green-400" />
                        <span style={{ color: getTextColor('secondary') }}>4 participants</span>
                      </div>
                    </div>
                    <button className="w-full px-3 py-2 rounded-lg text-xs font-semibold text-white transition-all" style={{
                      background: `linear-gradient(135deg, ${palette.primary} 0%, ${palette.secondary} 100%)`
                    }}>
                      Join & Record
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-4 text-sm" style={{ color: getTextColor('primary') }}>While Recording</h4>
                  <div style={{
                    background: palette.cardBg,
                    border: `1px solid ${palette.cardBorder}`
                  }} className="rounded-lg px-4 py-3 shadow-2xl inline-flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-lg font-semibold" style={{ fontVariantNumeric: 'tabular-nums', color: getTextColor('primary') }}>00:10</span>
                    </div>
                    <div className="w-px h-7" style={{ background: palette.cardBorder }}></div>
                    <button className="w-8 h-8 rounded-lg flex items-center justify-center transition-all" style={{
                      background: 'rgba(255, 59, 92, 0.2)'
                    }}>
                      <Zap className="w-3.5 h-3.5 text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div style={{
              background: palette.cardBg,
              border: `1px solid ${palette.cardBorder}`
            }} className="rounded-lg p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <BarChart3 className="w-5 h-5" style={{ color: palette.primary }} />
                <h3 className="text-xl font-semibold" style={{ color: getTextColor('primary') }}>Statistics</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: FileText, label: 'Total Recordings', value: totalRecordings, color: palette.primary },
                  { icon: Clock, label: 'Total Minutes', value: totalMinutes, color: palette.secondary }
                ].map((stat, idx) => (
                  <div key={idx} style={{
                    background: 'rgba(0, 0, 0, 0.2)',
                    border: `1px solid ${palette.cardBorder}`
                  }} className="rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                      <span className="text-sm font-medium" style={{ color: getTextColor('secondary') }}>{stat.label}</span>
                    </div>
                    <p className="text-3xl font-bold" style={{ color: getTextColor('primary') }}>{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : selectedMeeting ? (
        // Meeting Detail View
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSelectedMeeting(null)}
                className="p-2 rounded-lg hover:bg-opacity-20 hover:bg-white transition-all"
                style={{ color: palette.primary }}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                {editingTitle ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={tempMeetingTitle}
                      onChange={(e) => setTempMeetingTitle(e.target.value)}
                      onBlur={() => {
                        setSelectedMeeting({ ...selectedMeeting, title: tempMeetingTitle });
                        setEditingTitle(false);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          setSelectedMeeting({ ...selectedMeeting, title: tempMeetingTitle });
                          setEditingTitle(false);
                        }
                      }}
                      className="text-2xl font-bold bg-transparent border-b-2 outline-none"
                      style={{
                        borderColor: palette.primary,
                        color: getTextColor('primary')
                      }}
                      autoFocus
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold" style={{ color: getTextColor('primary') }}>
                      {selectedMeeting.title}
                    </h2>
                    <button
                      onClick={() => {
                        setTempMeetingTitle(selectedMeeting.title);
                        setEditingTitle(true);
                      }}
                      className="p-1.5 rounded hover:bg-opacity-20 hover:bg-white transition-all"
                      style={{ color: palette.primary }}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
                <div className="flex items-center gap-4 mt-1">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" style={{ color: getTextColor('tertiary') }} />
                    <span className="text-xs" style={{ color: getTextColor('secondary') }}>{selectedMeeting.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" style={{ color: getTextColor('tertiary') }} />
                    <span className="text-xs" style={{ color: getTextColor('secondary') }}>{selectedMeeting.duration}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" style={{ color: getTextColor('tertiary') }} />
                    <span className="text-xs" style={{ color: getTextColor('secondary') }}>{selectedMeeting.participants.length} participants</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold transition-all"
                style={{
                  background: `linear-gradient(135deg, ${palette.primary} 0%, ${palette.secondary} 100%)`,
                  color: 'white'
                }}
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>

          <div className="flex gap-2 mb-6">
            {['transcript', 'summary', 'analytics'].map((tab) => (
              <button
                key={tab}
                onClick={() => setTranscriptView(tab)}
                className="px-4 py-2 rounded-lg font-medium transition-all text-sm"
                style={{
                  background: transcriptView === tab
                    ? `linear-gradient(135deg, ${palette.primary} 0%, ${palette.secondary} 100%)`
                    : palette.cardBg,
                  color: transcriptView === tab ? 'white' : getTextColor('primary'),
                  border: `1px solid ${palette.cardBorder}`
                }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {transcriptView === 'transcript' && (
            <div className="space-y-4">
              {selectedMeeting.transcript.map((segment, idx) => (
                <div
                  key={idx}
                  style={{
                    background: palette.cardBg,
                    border: `1px solid ${palette.cardBorder}`
                  }}
                  className="rounded-lg p-4 shadow-lg"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm"
                        style={{
                          background: `linear-gradient(135deg, ${palette.primary} 0%, ${palette.secondary} 100%)`,
                          color: 'white'
                        }}
                      >
                        {segment.speaker.split(' ').map(n => n[0]).join('')}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {editingSpeaker === `${idx}` ? (
                            <input
                              type="text"
                              value={newSpeakerName}
                              onChange={(e) => setNewSpeakerName(e.target.value)}
                              onBlur={() => {
                                const newTranscript = [...selectedMeeting.transcript];
                                newTranscript[idx].speaker = newSpeakerName;
                                setSelectedMeeting({ ...selectedMeeting, transcript: newTranscript });
                                setEditingSpeaker(null);
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  const newTranscript = [...selectedMeeting.transcript];
                                  newTranscript[idx].speaker = newSpeakerName;
                                  setSelectedMeeting({ ...selectedMeeting, transcript: newTranscript });
                                  setEditingSpeaker(null);
                                }
                              }}
                              className="text-sm font-semibold bg-transparent border-b outline-none"
                              style={{
                                borderColor: palette.primary,
                                color: getTextColor('primary')
                              }}
                              autoFocus
                            />
                          ) : (
                            <>
                              <span className="text-sm font-semibold" style={{ color: getTextColor('primary') }}>
                                {segment.speaker}
                              </span>
                              <button
                                onClick={() => {
                                  setNewSpeakerName(segment.speaker);
                                  setEditingSpeaker(`${idx}`);
                                }}
                                className="p-1 rounded hover:bg-opacity-20 hover:bg-white transition-all"
                                style={{ color: palette.primary }}
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                            </>
                          )}
                          <span className="text-xs" style={{ color: getTextColor('tertiary') }}>{segment.timestamp}</span>
                        </div>
                        <button
                          onClick={() => {
                            const newBookmarks = [...bookmarks, { meetingId: selectedMeeting.id, time: segment.timestamp, text: segment.text.slice(0, 50) + '...' }];
                            setBookmarks(newBookmarks);
                          }}
                          className="p-1.5 rounded-lg hover:bg-opacity-20 hover:bg-white transition-all"
                          style={{ color: palette.primary }}
                        >
                          <Bookmark className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-sm leading-relaxed" style={{ color: getTextColor('primary') }}>
                        {segment.text}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {transcriptView === 'summary' && (
            <div className="space-y-6">
              <div
                style={{
                  background: palette.cardBg,
                  border: `1px solid ${palette.cardBorder}`
                }}
                className="rounded-lg p-6 shadow-xl"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5" style={{ color: palette.primary }} />
                  <h3 className="text-lg font-semibold" style={{ color: getTextColor('primary') }}>AI Summary</h3>
                </div>
                <p className="text-sm leading-relaxed mb-4" style={{ color: getTextColor('primary') }}>
                  {selectedMeeting.summary}
                </p>
              </div>

              <div
                style={{
                  background: palette.cardBg,
                  border: `1px solid ${palette.cardBorder}`
                }}
                className="rounded-lg p-6 shadow-xl"
              >
                <div className="flex items-center gap-2 mb-4">
                  <CheckSquare className="w-5 h-5" style={{ color: palette.primary }} />
                  <h3 className="text-lg font-semibold" style={{ color: getTextColor('primary') }}>Action Items</h3>
                </div>
                <div className="space-y-3">
                  {selectedMeeting.actionItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start gap-3 p-3 rounded-lg"
                      style={{
                        background: 'rgba(0, 0, 0, 0.2)',
                        border: `1px solid ${palette.cardBorder}`
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => toggleActionItem(selectedMeeting.id, item.id)}
                        className="mt-1"
                        style={{ accentColor: palette.primary }}
                      />
                      <div className="flex-1">
                        <p className={`text-sm ${item.completed ? 'line-through opacity-60' : ''}`} style={{ color: getTextColor('primary') }}>
                          {item.text}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          {item.assignee && (
                            <div className="flex items-center gap-1">
                              <User className="w-3 h-3" style={{ color: getTextColor('tertiary') }} />
                              <span className="text-xs" style={{ color: getTextColor('secondary') }}>{item.assignee}</span>
                            </div>
                          )}
                          {item.dueDate && (
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" style={{ color: getTextColor('tertiary') }} />
                              <span className="text-xs" style={{ color: getTextColor('secondary') }}>{item.dueDate}</span>
                            </div>
                          )}
                          {item.priority && (
                            <span
                              className="text-xs px-2 py-0.5 rounded"
                              style={{
                                background: item.priority === 'high' ? 'rgba(239, 68, 68, 0.2)' :
                                          item.priority === 'medium' ? 'rgba(245, 158, 11, 0.2)' :
                                          'rgba(34, 197, 94, 0.2)',
                                color: item.priority === 'high' ? '#ef4444' :
                                       item.priority === 'medium' ? '#f59e0b' :
                                       '#22c55e'
                              }}
                            >
                              {item.priority}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div
                style={{
                  background: palette.cardBg,
                  border: `1px solid ${palette.cardBorder}`
                }}
                className="rounded-lg p-6 shadow-xl"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb className="w-5 h-5" style={{ color: palette.primary }} />
                  <h3 className="text-lg font-semibold" style={{ color: getTextColor('primary') }}>Key Points</h3>
                </div>
                <div className="space-y-2">
                  {selectedMeeting.keyPoints.map((point, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full mt-2" style={{ background: palette.primary }}></div>
                      <p className="text-sm flex-1" style={{ color: getTextColor('primary') }}>{point}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {transcriptView === 'analytics' && (
            <div className="space-y-6">
              <div
                style={{
                  background: palette.cardBg,
                  border: `1px solid ${palette.cardBorder}`
                }}
                className="rounded-lg p-6 shadow-xl"
              >
                <div className="flex items-center gap-2 mb-6">
                  <BarChart3 className="w-5 h-5" style={{ color: palette.primary }} />
                  <h3 className="text-lg font-semibold" style={{ color: getTextColor('primary') }}>Speaking Time</h3>
                </div>
                <div className="space-y-4">
                  {Object.entries(
                    selectedMeeting.transcript.reduce((acc, seg) => {
                      acc[seg.speaker] = (acc[seg.speaker] || 0) + 1;
                      return acc;
                    }, {})
                  ).map(([speaker, count]) => {
                    const percentage = (count / selectedMeeting.transcript.length) * 100;
                    return (
                      <div key={speaker}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium" style={{ color: getTextColor('primary') }}>{speaker}</span>
                          <span className="text-xs" style={{ color: getTextColor('secondary') }}>{percentage.toFixed(1)}%</span>
                        </div>
                        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(0, 0, 0, 0.2)' }}>
                          <div
                            className="h-full transition-all duration-500"
                            style={{
                              width: `${percentage}%`,
                              background: `linear-gradient(135deg, ${palette.primary} 0%, ${palette.secondary} 100%)`
                            }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Total Words', value: selectedMeeting.transcript.reduce((acc, seg) => acc + seg.text.split(' ').length, 0), icon: FileText },
                  { label: 'Speakers', value: new Set(selectedMeeting.transcript.map(s => s.speaker)).size, icon: Users },
                  { label: 'Action Items', value: selectedMeeting.actionItems.length, icon: CheckSquare }
                ].map((stat, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: palette.cardBg,
                      border: `1px solid ${palette.cardBorder}`
                    }}
                    className="rounded-lg p-4 shadow-xl"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <stat.icon className="w-4 h-4" style={{ color: palette.primary }} />
                      <span className="text-xs" style={{ color: getTextColor('secondary') }}>{stat.label}</span>
                    </div>
                    <p className="text-2xl font-bold" style={{ color: getTextColor('primary') }}>{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        // Main Recording View
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <div
              style={{
                background: palette.cardBg,
                border: `1px solid ${palette.cardBorder}`
              }}
              className="rounded-lg p-6 shadow-xl"
            >
              <h2 className="text-2xl font-bold mb-6" style={{ color: getTextColor('primary') }}>
                {isRecording ? 'Recording in Progress' : 'New Recording'}
              </h2>

              {isRecording && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-2xl font-bold font-mono" style={{ color: getTextColor('primary') }}>
                        00:00:00
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsPaused(!isPaused)}
                        className="px-4 py-2 rounded-lg flex items-center gap-2 font-semibold transition-all"
                        style={{
                          background: palette.cardBg,
                          border: `1px solid ${palette.cardBorder}`,
                          color: getTextColor('primary')
                        }}
                      >
                        {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                        {isPaused ? 'Resume' : 'Pause'}
                      </button>
                      <button
                        onClick={() => {
                          setIsRecording(false);
                          setIsPaused(false);
                        }}
                        className="px-4 py-2 rounded-lg flex items-center gap-2 font-semibold transition-all"
                        style={{
                          background: `linear-gradient(135deg, #ef4444 0%, #dc2626 100%)`,
                          color: 'white'
                        }}
                      >
                        <Square className="w-4 h-4" />
                        Stop & Save
                      </button>
                    </div>
                  </div>

                  <div className="h-24 rounded-lg overflow-hidden" style={{ background: 'rgba(0, 0, 0, 0.2)' }}>
                    <div className="h-full flex items-center justify-center gap-1 px-2">
                      {Array.from({ length: 100 }).map((_, i) => (
                        <div
                          key={i}
                          className="flex-1 rounded-full transition-all"
                          style={{
                            height: `${Math.random() * 100}%`,
                            background: `linear-gradient(135deg, ${palette.primary} 0%, ${palette.secondary} 100%)`,
                            opacity: isPaused ? 0.3 : 1
                          }}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {!isRecording && (
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: getTextColor('secondary') }}>
                      Meeting Title
                    </label>
                    <input
                      type="text"
                      placeholder="Enter meeting title..."
                      className="w-full px-4 py-3 rounded-lg outline-none transition-all"
                      style={{
                        background: 'rgba(0, 0, 0, 0.2)',
                        border: `1px solid ${palette.cardBorder}`,
                        color: getTextColor('primary')
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: getTextColor('secondary') }}>
                      Template
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {meetingTemplates.map((template) => (
                        <button
                          key={template.id}
                          className="px-4 py-3 rounded-lg flex items-center gap-2 transition-all"
                          style={{
                            background: 'rgba(0, 0, 0, 0.2)',
                            border: `1px solid ${palette.cardBorder}`,
                            color: getTextColor('primary')
                          }}
                        >
                          <template.icon className="w-4 h-4" />
                          <span className="text-sm font-medium">{template.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-center">
                <button
                  onClick={() => setIsRecording(!isRecording)}
                  className="w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-2xl"
                  style={{
                    background: isRecording
                      ? `linear-gradient(135deg, #ef4444 0%, #dc2626 100%)`
                      : `linear-gradient(135deg, ${palette.primary} 0%, ${palette.secondary} 100%)`,
                    color: 'white'
                  }}
                >
                  {isRecording ? <Square className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                </button>
              </div>
            </div>

            <div
              style={{
                background: palette.cardBg,
                border: `1px solid ${palette.cardBorder}`
              }}
              className="rounded-lg p-6 shadow-xl"
            >
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5" style={{ color: palette.primary }} />
                <h3 className="text-lg font-semibold" style={{ color: getTextColor('primary') }}>Notes</h3>
              </div>
              <div
                ref={notesRef}
                contentEditable
                className="min-h-[200px] p-4 rounded-lg outline-none"
                style={{
                  background: 'rgba(0, 0, 0, 0.2)',
                  border: `1px solid ${palette.cardBorder}`,
                  color: getTextColor('primary')
                }}
                onInput={(e) => setNotes(e.currentTarget.textContent || '')}
                suppressContentEditableWarning
              />
              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={() => applyFormatting('bold')}
                  className="p-2 rounded hover:bg-opacity-20 hover:bg-white transition-all"
                  style={{ color: activeFormats.bold ? palette.primary : getTextColor('secondary') }}
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button
                  onClick={() => applyFormatting('italic')}
                  className="p-2 rounded hover:bg-opacity-20 hover:bg-white transition-all"
                  style={{ color: activeFormats.italic ? palette.primary : getTextColor('secondary') }}
                >
                  <Italic className="w-4 h-4" />
                </button>
                <button
                  onClick={() => applyFormatting('list')}
                  className="p-2 rounded hover:bg-opacity-20 hover:bg-white transition-all"
                  style={{ color: activeFormats.list ? palette.primary : getTextColor('secondary') }}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {isRecording && (
              <div
                style={{
                  background: palette.cardBg,
                  border: `1px solid ${palette.cardBorder}`
                }}
                className="rounded-lg p-6 shadow-xl"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5" style={{ color: palette.primary }} />
                  <h3 className="text-lg font-semibold" style={{ color: getTextColor('primary') }}>Live Transcription</h3>
                </div>
                <div
                  className="p-4 rounded-lg min-h-[150px]"
                  style={{
                    background: 'rgba(0, 0, 0, 0.2)',
                    border: `1px solid ${palette.cardBorder}`,
                    color: getTextColor('primary')
                  }}
                >
                  <p className="text-sm leading-relaxed">
                    {transcript || 'Transcription will appear here...'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
