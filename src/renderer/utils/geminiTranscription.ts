import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export interface TranscriptionSegment {
  speaker: string;
  time: string;
  timestamp: number;
  text: string;
}

export class GeminiTranscription {
  private genAI: GoogleGenerativeAI | null = null;
  private textModel: any = null;
  private audioModel: any = null;

  constructor() {
    if (API_KEY) {
      this.genAI = new GoogleGenerativeAI(API_KEY);
      // Use gemini-1.5-flash for audio processing (faster and cheaper)
      // You can also use 'gemini-1.5-pro' for better accuracy
      this.audioModel = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      this.textModel = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    } else {
      console.warn('Gemini API key not found. Transcription will not be available.');
    }
  }

  /**
   * Convert Blob to Base64 string
   */
  private async blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Remove the data URL prefix (e.g., "data:audio/webm;base64,")
        const base64Data = base64String.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  /**
   * Transcribe audio blob using Gemini 1.5 Flash/Pro
   * Uses Gemini's multimodal capabilities to process audio
   */
  async transcribeAudio(audioBlob: Blob, timestamp: number = 0): Promise<TranscriptionSegment[]> {
    if (!this.audioModel) {
      throw new Error('Gemini API not initialized. Please provide API key.');
    }

    try {
      console.log('Transcribing audio with Gemini, size:', audioBlob.size);

      // Convert blob to base64
      const base64Audio = await this.blobToBase64(audioBlob);

      // Determine MIME type from blob
      const mimeType = audioBlob.type || 'audio/webm';

      // Create the prompt for transcription
      const prompt = `Please transcribe the following audio recording. Provide the transcription as plain text without any additional commentary. If there are multiple speakers, try to identify them and label them as "Speaker 1", "Speaker 2", etc.`;

      // Send audio to Gemini with inline data
      const result = await this.audioModel.generateContent([
        {
          inlineData: {
            data: base64Audio,
            mimeType: mimeType
          }
        },
        prompt
      ]);

      const response = await result.response;
      const transcriptionText = response.text();

      console.log('Gemini transcription received:', transcriptionText);

      // Parse the transcription into segments
      // Try to detect speaker labels in the format "Speaker X: text"
      const lines = transcriptionText.split('\n').filter(line => line.trim());
      const segments: TranscriptionSegment[] = [];

      let currentSpeaker = 'Speaker 1';
      let segmentIndex = 0;

      for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine) continue;

        // Check if line starts with speaker label
        const speakerMatch = trimmedLine.match(/^(Speaker \d+|[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\s*:\s*(.+)$/);

        if (speakerMatch) {
          currentSpeaker = speakerMatch[1];
          const text = speakerMatch[2];

          segments.push({
            speaker: currentSpeaker,
            time: this.formatTime(timestamp + segmentIndex * 5), // Estimate 5 seconds per segment
            timestamp: timestamp + segmentIndex * 5,
            text: text
          });
        } else {
          // No speaker label, use current speaker
          segments.push({
            speaker: currentSpeaker,
            time: this.formatTime(timestamp + segmentIndex * 5),
            timestamp: timestamp + segmentIndex * 5,
            text: trimmedLine
          });
        }

        segmentIndex++;
      }

      return segments.length > 0 ? segments : [{
        speaker: 'Speaker 1',
        time: this.formatTime(timestamp),
        timestamp: timestamp,
        text: transcriptionText
      }];

    } catch (error) {
      console.error('Error transcribing audio with Gemini:', error);
      throw error;
    }
  }

  /**
   * Format seconds to MM:SS
   */
  private formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  /**
   * Generate meeting summary from transcript
   */
  async generateSummary(transcript: TranscriptionSegment[]): Promise<string> {
    if (!this.textModel) {
      throw new Error('Gemini API not initialized.');
    }

    const transcriptText = transcript
      .map((seg) => `[${seg.time}] ${seg.speaker}: ${seg.text}`)
      .join('\n');

    const prompt = `Please provide a concise summary of the following meeting transcript. Include:
1. Main topics discussed
2. Key decisions made
3. Important points raised

Transcript:
${transcriptText}`;

    try {
      const result = await this.textModel.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating summary:', error);
      throw error;
    }
  }

  /**
   * Extract action items from transcript
   */
  async extractActionItems(transcript: TranscriptionSegment[]): Promise<Array<{
    text: string;
    assignee: string;
    priority: 'high' | 'medium' | 'low';
  }>> {
    if (!this.textModel) {
      throw new Error('Gemini API not initialized.');
    }

    const transcriptText = transcript
      .map((seg) => `[${seg.time}] ${seg.speaker}: ${seg.text}`)
      .join('\n');

    const prompt = `Analyze the following meeting transcript and extract all action items.
For each action item, identify:
- The task description
- Who it's assigned to (if mentioned)
- Priority level (high/medium/low based on urgency or importance)

Format your response as a JSON array with objects containing: text, assignee, priority

Transcript:
${transcriptText}`;

    try {
      const result = await this.textModel.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Try to parse JSON from response
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      return [];
    } catch (error) {
      console.error('Error extracting action items:', error);
      return [];
    }
  }

  /**
   * Identify speakers and their speaking patterns
   */
  async analyzeSpeakers(transcript: TranscriptionSegment[]): Promise<Record<string, {
    totalTime: number;
    segments: number;
    topics: string[];
  }>> {
    if (!this.textModel) {
      throw new Error('Gemini API not initialized.');
    }

    const speakerStats: Record<string, { totalTime: number; segments: number; topics: string[] }> = {};

    transcript.forEach((seg) => {
      if (!speakerStats[seg.speaker]) {
        speakerStats[seg.speaker] = {
          totalTime: 0,
          segments: 0,
          topics: []
        };
      }
      speakerStats[seg.speaker].segments += 1;
    });

    // Use Gemini to extract topics discussed by each speaker
    for (const speaker of Object.keys(speakerStats)) {
      const speakerText = transcript
        .filter((seg) => seg.speaker === speaker)
        .map((seg) => seg.text)
        .join(' ');

      try {
        const prompt = `Extract 3-5 main topics or themes discussed by this person. Return only the topics as a comma-separated list:\n\n${speakerText.substring(0, 1000)}`;
        const result = await this.textModel.generateContent(prompt);
        const response = await result.response;
        const topics = response.text().split(',').map((t: string) => t.trim()).filter((t: string) => t);
        speakerStats[speaker].topics = topics;
      } catch (error) {
        console.error(`Error analyzing speaker ${speaker}:`, error);
      }
    }

    return speakerStats;
  }
}

export const geminiTranscription = new GeminiTranscription();
