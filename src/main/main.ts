import { app, BrowserWindow, ipcMain, globalShortcut } from 'electron';
import path from 'path';
import { AudioRecorder } from './services/AudioRecorder';
import { DatabaseService } from './services/DatabaseService';
import { TranscriptionService } from './services/TranscriptionService';

let mainWindow: BrowserWindow | null = null;
let audioRecorder: AudioRecorder | null = null;
let databaseService: DatabaseService | null = null;
let transcriptionService: TranscriptionService | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    titleBarStyle: 'hiddenInset',
    show: false,
  });

  // Load the app
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  // Initialize services
  databaseService = new DatabaseService();
  audioRecorder = new AudioRecorder();
  transcriptionService = new TranscriptionService();

  createWindow();

  // Register global shortcuts
  globalShortcut.register('CommandOrControl+Shift+R', () => {
    mainWindow?.webContents.send('toggle-recording');
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

// IPC Handlers
ipcMain.handle('start-recording', async (event, deviceId: string) => {
  try {
    const result = await audioRecorder?.startRecording(deviceId);
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('stop-recording', async () => {
  try {
    const result = await audioRecorder?.stopRecording();
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('pause-recording', async () => {
  try {
    await audioRecorder?.pauseRecording();
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('resume-recording', async () => {
  try {
    await audioRecorder?.resumeRecording();
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-audio-devices', async () => {
  try {
    // This will be implemented in the renderer process using navigator.mediaDevices
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('transcribe-audio', async (event, audioPath: string, options: any) => {
  try {
    const result = await transcriptionService?.transcribe(audioPath, options);
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('save-recording', async (event, recordingData: any) => {
  try {
    const result = await databaseService?.saveRecording(recordingData);
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-recordings', async () => {
  try {
    const recordings = await databaseService?.getRecordings();
    return { success: true, data: recordings };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-recording', async (event, id: string) => {
  try {
    const recording = await databaseService?.getRecording(id);
    return { success: true, data: recording };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('delete-recording', async (event, id: string) => {
  try {
    await databaseService?.deleteRecording(id);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('search-recordings', async (event, query: string) => {
  try {
    const results = await databaseService?.searchRecordings(query);
    return { success: true, data: results };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('export-transcript', async (event, recordingId: string, format: string) => {
  try {
    // Export functionality will be implemented
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-settings', async () => {
  try {
    // Settings will be implemented using electron-store
    return { success: true, data: {} };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('save-settings', async (event, settings: any) => {
  try {
    // Settings will be implemented using electron-store
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});
