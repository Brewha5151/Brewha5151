import OpenAI from 'openai';
import fs from 'fs';
import { TranscriptSegment } from './DatabaseService';

export interface TranscriptionOptions {
  model?: 'whisper-1';
  language?: string;
  prompt?: string;
  temperature?: number;
  responseFormat?: 'json' | 'text' | 'srt' | 'verbose_json' | 'vtt';
}

export interface TranscriptionResult {
  text: string;
  segments?: TranscriptSegment[];
  language?: string;
  duration?: number;
}

export class TranscriptionService {
  private openai: OpenAI | null = null;

  constructor(apiKey?: string) {
    if (apiKey) {
      this.openai = new OpenAI({ apiKey });
    }
  }

  setApiKey(apiKey: string) {
    this.openai = new OpenAI({ apiKey });
  }

  async transcribe(
    audioPath: string,
    options: TranscriptionOptions = {}
  ): Promise<TranscriptionResult> {
    if (!this.openai) {
      throw new Error('OpenAI API key not set. Please configure in settings.');
    }

    if (!fs.existsSync(audioPath)) {
      throw new Error(`Audio file not found: ${audioPath}`);
    }

    try {
      const audioFile = fs.createReadStream(audioPath);

      const response = await this.openai.audio.transcriptions.create({
        file: audioFile,
        model: options.model || 'whisper-1',
        language: options.language,
        prompt: options.prompt,
        temperature: options.temperature || 0,
        response_format: options.responseFormat || 'verbose_json',
      });

      // Handle different response formats
      if (typeof response === 'string') {
        return { text: response };
      }

      // For verbose_json format
      const result: TranscriptionResult = {
        text: (response as any).text,
        language: (response as any).language,
        duration: (response as any).duration,
      };

      // Convert segments if available
      if ((response as any).segments) {
        result.segments = (response as any).segments.map((seg: any, index: number) => ({
          id: `seg_${index}`,
          text: seg.text,
          startTime: seg.start,
          endTime: seg.end,
          confidence: seg.avg_logprob ? Math.exp(seg.avg_logprob) : undefined,
        }));
      }

      return result;
    } catch (error: any) {
      console.error('Transcription error:', error);
      throw new Error(`Transcription failed: ${error.message}`);
    }
  }

  async transcribeWithDiarization(
    audioPath: string,
    options: TranscriptionOptions = {}
  ): Promise<TranscriptionResult> {
    // Note: Speaker diarization is not directly supported by Whisper API
    // This would require additional processing with libraries like pyannote or similar
    // For now, we'll use regular transcription
    return this.transcribe(audioPath, options);
  }

  formatAsPlainText(result: TranscriptionResult): string {
    return result.text;
  }

  formatAsSRT(result: TranscriptionResult): string {
    if (!result.segments) {
      return result.text;
    }

    let srt = '';
    result.segments.forEach((segment, index) => {
      const start = this.formatTimestamp(segment.startTime);
      const end = this.formatTimestamp(segment.endTime);
      srt += `${index + 1}\n${start} --> ${end}\n${segment.text.trim()}\n\n`;
    });

    return srt;
  }

  formatAsVTT(result: TranscriptionResult): string {
    if (!result.segments) {
      return `WEBVTT\n\n${result.text}`;
    }

    let vtt = 'WEBVTT\n\n';
    result.segments.forEach((segment) => {
      const start = this.formatTimestamp(segment.startTime);
      const end = this.formatTimestamp(segment.endTime);
      vtt += `${start} --> ${end}\n${segment.text.trim()}\n\n`;
    });

    return vtt;
  }

  private formatTimestamp(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 1000);

    return `${this.pad(hours, 2)}:${this.pad(minutes, 2)}:${this.pad(secs, 2)},${this.pad(ms, 3)}`;
  }

  private pad(num: number, size: number): string {
    return num.toString().padStart(size, '0');
  }
}
