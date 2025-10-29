export interface Recording {
  id: string;
  title: string;
  filePath: string;
  duration: number;
  createdAt: string;
  tags?: string[];
  notes?: string;
  transcript?: string;
  transcriptSegments?: TranscriptSegment[];
  language?: string;
  modelUsed?: string;
}

export interface TranscriptSegment {
  id: string;
  text: string;
  startTime: number;
  endTime: number;
  confidence?: number;
  speaker?: string;
}

export interface AudioDevice {
  deviceId: string;
  label: string;
  kind: string;
}

export interface RecordingState {
  isRecording: boolean;
  isPaused: boolean;
  duration: number;
  audioLevel: number;
}

export interface Settings {
  apiKey: string;
  defaultModel: string;
  sampleRate: number;
  audioFormat: 'wav' | 'mp3';
  language: string;
  theme: 'light' | 'dark';
  recordingsPath: string;
}
