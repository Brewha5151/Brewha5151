import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Note operations
  getNotes: () => ipcRenderer.invoke('get-notes'),
  getNote: (id: string) => ipcRenderer.invoke('get-note', id),
  saveNote: (note: any) => ipcRenderer.invoke('save-note', note),
  updateNote: (id: string, updates: any) => ipcRenderer.invoke('update-note', id, updates),
  deleteNote: (id: string) => ipcRenderer.invoke('delete-note', id),
  searchNotes: (query: string) => ipcRenderer.invoke('search-notes', query),

  // Tag operations
  getAllTags: () => ipcRenderer.invoke('get-all-tags'),
  getNotesByTag: (tag: string) => ipcRenderer.invoke('get-notes-by-tag', tag),

  // Event listeners
  onNewNote: (callback: () => void) => {
    ipcRenderer.on('new-note', callback);
    return () => ipcRenderer.removeListener('new-note', callback);
  },
  onFocusSearch: (callback: () => void) => {
    ipcRenderer.on('focus-search', callback);
    return () => ipcRenderer.removeListener('focus-search', callback);
  },
});

// Type definitions for TypeScript
export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  isPinned: boolean;
  isArchived: boolean;
  isTrashed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  name: string;
  noteCount: number;
  color?: string;
}

export interface ElectronAPI {
  getNotes: () => Promise<{ success: boolean; data?: Note[]; error?: string }>;
  getNote: (id: string) => Promise<{ success: boolean; data?: Note; error?: string }>;
  saveNote: (note: Note) => Promise<{ success: boolean; data?: Note; error?: string }>;
  updateNote: (id: string, updates: Partial<Note>) => Promise<{ success: boolean; error?: string }>;
  deleteNote: (id: string) => Promise<{ success: boolean; error?: string }>;
  searchNotes: (query: string) => Promise<{ success: boolean; data?: Note[]; error?: string }>;
  getAllTags: () => Promise<{ success: boolean; data?: Tag[]; error?: string }>;
  getNotesByTag: (tag: string) => Promise<{ success: boolean; data?: Note[]; error?: string }>;
  onNewNote: (callback: () => void) => () => void;
  onFocusSearch: (callback: () => void) => () => void;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
