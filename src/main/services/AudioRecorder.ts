import fs from 'fs';
import path from 'path';
import { app } from 'electron';
import { v4 as uuidv4 } from 'uuid';

export interface RecordingSession {
  id: string;
  filePath: string;
  startTime: Date;
  duration: number;
}

export class AudioRecorder {
  private currentSession: RecordingSession | null = null;
  private isPaused: boolean = false;
  private recordingsDir: string;

  constructor() {
    this.recordingsDir = path.join(app.getPath('userData'), 'recordings');
    this.ensureRecordingsDir();
  }

  private ensureRecordingsDir() {
    if (!fs.existsSync(this.recordingsDir)) {
      fs.mkdirSync(this.recordingsDir, { recursive: true });
    }
  }

  async startRecording(deviceId: string): Promise<RecordingSession> {
    if (this.currentSession) {
      throw new Error('Recording already in progress');
    }

    const sessionId = uuidv4();
    const fileName = `recording_${Date.now()}.wav`;
    const filePath = path.join(this.recordingsDir, fileName);

    this.currentSession = {
      id: sessionId,
      filePath,
      startTime: new Date(),
      duration: 0,
    };

    // Note: Actual audio recording will be handled in the renderer process
    // using Web Audio API and MediaRecorder, as Electron main process
    // doesn't have direct access to audio devices

    return this.currentSession;
  }

  async stopRecording(): Promise<RecordingSession | null> {
    if (!this.currentSession) {
      throw new Error('No recording in progress');
    }

    const session = this.currentSession;
    session.duration = Date.now() - session.startTime.getTime();

    this.currentSession = null;
    this.isPaused = false;

    return session;
  }

  async pauseRecording(): Promise<void> {
    if (!this.currentSession) {
      throw new Error('No recording in progress');
    }

    this.isPaused = true;
  }

  async resumeRecording(): Promise<void> {
    if (!this.currentSession) {
      throw new Error('No recording in progress');
    }

    this.isPaused = false;
  }

  getRecordingsDirectory(): string {
    return this.recordingsDir;
  }

  isRecording(): boolean {
    return this.currentSession !== null && !this.isPaused;
  }
}
