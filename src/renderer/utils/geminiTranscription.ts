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
  private model: any = null;

  constructor() {
    if (API_KEY) {
      this.genAI = new GoogleGenerativeAI(API_KEY);
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
    } else {
      console.warn('Gemini API key not found. Transcription will not be available.');
    }
  }

  /**
   * Transcribe audio blob using Gemini API
   * Note: Gemini Pro doesn't directly support audio transcription yet.
   * This is a placeholder for when audio support is available.
   * For now, we'll use browser's Web Speech API as fallback.
   */
  async transcribeAudio(audioBlob: Blob): Promise<TranscriptionSegment[]> {
    if (!this.model) {
      throw new Error('Gemini API not initialized. Please provide API key.');
    }

    // Placeholder: Gemini API doesn't support direct audio transcription yet
    // You would need to use Web Speech API or another service for actual audio-to-text
    console.log('Audio transcription requested, size:', audioBlob.size);

    return [];
  }

  /**
   * Generate meeting summary from transcript
   */
  async generateSummary(transcript: TranscriptionSegment[]): Promise<string> {
    if (!this.model) {
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
      const result = await this.model.generateContent(prompt);
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
    if (!this.model) {
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
      const result = await this.model.generateContent(prompt);
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
    if (!this.model) {
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
        const result = await this.model.generateContent(prompt);
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
