export interface AudioRecorderConfig {
  onDataAvailable?: (blob: Blob) => void;
  onTranscript?: (text: string, isFinal: boolean) => void;
  onError?: (error: Error) => void;
  onAudioChunk?: (blob: Blob, timestamp: number) => void; // For Gemini transcription
  useGeminiTranscription?: boolean; // Flag to use Gemini instead of Web Speech API
}

export class AudioRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private stream: MediaStream | null = null;
  private recognition: any = null; // SpeechRecognition
  private config: AudioRecorderConfig;
  private chunkInterval: NodeJS.Timeout | null = null;
  private recordingStartTime: number = 0;

  constructor(config: AudioRecorderConfig = {}) {
    this.config = config;
  }

  /**
   * Initialize and start recording
   */
  async startRecording(): Promise<void> {
    try {
      // Request microphone access
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      });

      // Set up MediaRecorder for audio recording
      const mimeType = this.getSupportedMimeType();
      this.mediaRecorder = new MediaRecorder(this.stream, {
        mimeType,
        audioBitsPerSecond: 128000,
      });

      this.audioChunks = [];
      this.recordingStartTime = Date.now();

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
          if (this.config.onDataAvailable) {
            this.config.onDataAvailable(event.data);
          }
        }
      };

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: mimeType });
        if (this.config.onDataAvailable) {
          this.config.onDataAvailable(audioBlob);
        }
      };

      // Start recording with 1 second chunks
      this.mediaRecorder.start(1000);

      // Choose transcription method
      if (this.config.useGeminiTranscription) {
        // Use Gemini API for transcription
        this.initializeGeminiTranscription();
      } else {
        // Use browser's Web Speech API for real-time transcription
        this.initializeSpeechRecognition();
      }
    } catch (error) {
      console.error('Error starting recording:', error);
      if (this.config.onError) {
        this.config.onError(error as Error);
      }
      throw error;
    }
  }

  /**
   * Initialize Gemini-based transcription
   * Sends audio chunks periodically to Gemini for transcription
   */
  private initializeGeminiTranscription(): void {
    console.log('Using Gemini API for transcription');

    // Send audio chunks to Gemini every 10 seconds
    const CHUNK_INTERVAL = 10000; // 10 seconds
    let tempChunks: Blob[] = [];

    // Collect chunks
    if (this.mediaRecorder) {
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
          tempChunks.push(event.data);

          if (this.config.onDataAvailable) {
            this.config.onDataAvailable(event.data);
          }
        }
      };
    }

    // Set up interval to send chunks to Gemini
    this.chunkInterval = setInterval(() => {
      if (tempChunks.length > 0 && this.config.onAudioChunk) {
        const mimeType = this.getSupportedMimeType();
        const chunkBlob = new Blob(tempChunks, { type: mimeType });
        const elapsedSeconds = Math.floor((Date.now() - this.recordingStartTime) / 1000);

        console.log(`Sending ${tempChunks.length} audio chunks to Gemini (${elapsedSeconds}s elapsed)`);

        // Send to callback for Gemini processing
        this.config.onAudioChunk(chunkBlob, elapsedSeconds);

        // Clear temp chunks
        tempChunks = [];
      }
    }, CHUNK_INTERVAL);
  }

  /**
   * Initialize Web Speech API for live transcription
   */
  private initializeSpeechRecognition(): void {
    // Check if browser supports Speech Recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn('Speech Recognition not supported in this browser');
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';

    this.recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }

      if (finalTranscript && this.config.onTranscript) {
        this.config.onTranscript(finalTranscript.trim(), true);
      } else if (interimTranscript && this.config.onTranscript) {
        this.config.onTranscript(interimTranscript.trim(), false);
      }
    };

    this.recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      if (this.config.onError) {
        this.config.onError(new Error(`Speech recognition error: ${event.error}`));
      }
    };

    this.recognition.onend = () => {
      // Restart recognition if recording is still active
      if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
        try {
          this.recognition.start();
        } catch (error) {
          console.error('Error restarting recognition:', error);
        }
      }
    };

    try {
      this.recognition.start();
    } catch (error) {
      console.error('Error starting speech recognition:', error);
    }
  }

  /**
   * Pause recording
   */
  pause(): void {
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      this.mediaRecorder.pause();
    }
    if (this.recognition) {
      this.recognition.stop();
    }
  }

  /**
   * Resume recording
   */
  resume(): void {
    if (this.mediaRecorder && this.mediaRecorder.state === 'paused') {
      this.mediaRecorder.resume();
    }
    if (this.recognition) {
      try {
        this.recognition.start();
      } catch (error) {
        console.error('Error resuming recognition:', error);
      }
    }
  }

  /**
   * Stop recording and return the audio blob
   */
  async stopRecording(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error('MediaRecorder not initialized'));
        return;
      }

      // Clean up speech recognition
      if (this.recognition) {
        this.recognition.stop();
        this.recognition = null;
      }

      // Clean up Gemini chunk interval
      if (this.chunkInterval) {
        clearInterval(this.chunkInterval);
        this.chunkInterval = null;
      }

      this.mediaRecorder.onstop = () => {
        const mimeType = this.getSupportedMimeType();
        const audioBlob = new Blob(this.audioChunks, { type: mimeType });

        // Stop all tracks
        if (this.stream) {
          this.stream.getTracks().forEach((track) => track.stop());
          this.stream = null;
        }

        resolve(audioBlob);
      };

      if (this.mediaRecorder.state !== 'inactive') {
        this.mediaRecorder.stop();
      }
    });
  }

  /**
   * Get the supported MIME type for audio recording
   */
  private getSupportedMimeType(): string {
    const types = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/ogg;codecs=opus',
      'audio/mp4',
    ];

    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }

    return 'audio/webm'; // Default fallback
  }

  /**
   * Get audio level for visualization
   */
  getAudioLevel(callback: (level: number) => void): void {
    if (!this.stream) {
      return;
    }

    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const microphone = audioContext.createMediaStreamSource(this.stream);
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    analyser.smoothingTimeConstant = 0.8;
    analyser.fftSize = 1024;

    microphone.connect(analyser);

    const updateLevel = () => {
      analyser.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
      const normalizedLevel = average / 255;
      callback(normalizedLevel);

      if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
        requestAnimationFrame(updateLevel);
      }
    };

    updateLevel();
  }

  /**
   * Check if browser supports audio recording
   */
  static isSupported(): boolean {
    return !!(
      navigator.mediaDevices &&
      navigator.mediaDevices.getUserMedia &&
      window.MediaRecorder
    );
  }
}
