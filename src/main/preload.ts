import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Recording controls
  startRecording: (deviceId: string) => ipcRenderer.invoke('start-recording', deviceId),
  stopRecording: () => ipcRenderer.invoke('stop-recording'),
  pauseRecording: () => ipcRenderer.invoke('pause-recording'),
  resumeRecording: () => ipcRenderer.invoke('resume-recording'),
  getAudioDevices: () => ipcRenderer.invoke('get-audio-devices'),

  // Transcription
  transcribeAudio: (audioPath: string, options: any) =>
    ipcRenderer.invoke('transcribe-audio', audioPath, options),

  // Database operations
  saveRecording: (recordingData: any) => ipcRenderer.invoke('save-recording', recordingData),
  getRecordings: () => ipcRenderer.invoke('get-recordings'),
  getRecording: (id: string) => ipcRenderer.invoke('get-recording', id),
  deleteRecording: (id: string) => ipcRenderer.invoke('delete-recording', id),
  searchRecordings: (query: string) => ipcRenderer.invoke('search-recordings', query),

  // Export
  exportTranscript: (recordingId: string, format: string) =>
    ipcRenderer.invoke('export-transcript', recordingId, format),

  // Settings
  getSettings: () => ipcRenderer.invoke('get-settings'),
  saveSettings: (settings: any) => ipcRenderer.invoke('save-settings', settings),

  // Event listeners
  onToggleRecording: (callback: () => void) => {
    ipcRenderer.on('toggle-recording', callback);
    return () => ipcRenderer.removeListener('toggle-recording', callback);
  },
});

// Type definitions for TypeScript
export interface ElectronAPI {
  startRecording: (deviceId: string) => Promise<{ success: boolean; data?: any; error?: string }>;
  stopRecording: () => Promise<{ success: boolean; data?: any; error?: string }>;
  pauseRecording: () => Promise<{ success: boolean; error?: string }>;
  resumeRecording: () => Promise<{ success: boolean; error?: string }>;
  getAudioDevices: () => Promise<{ success: boolean; error?: string }>;
  transcribeAudio: (audioPath: string, options: any) => Promise<{ success: boolean; data?: any; error?: string }>;
  saveRecording: (recordingData: any) => Promise<{ success: boolean; data?: any; error?: string }>;
  getRecordings: () => Promise<{ success: boolean; data?: any[]; error?: string }>;
  getRecording: (id: string) => Promise<{ success: boolean; data?: any; error?: string }>;
  deleteRecording: (id: string) => Promise<{ success: boolean; error?: string }>;
  searchRecordings: (query: string) => Promise<{ success: boolean; data?: any[]; error?: string }>;
  exportTranscript: (recordingId: string, format: string) => Promise<{ success: boolean; error?: string }>;
  getSettings: () => Promise<{ success: boolean; data?: any; error?: string }>;
  saveSettings: (settings: any) => Promise<{ success: boolean; error?: string }>;
  onToggleRecording: (callback: () => void) => () => void;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
