import { app, BrowserWindow, ipcMain, globalShortcut } from 'electron';
import path from 'path';
import { DatabaseService, Note } from './services/DatabaseService';

let mainWindow: BrowserWindow | null = null;
let databaseService: DatabaseService | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#ffffff',
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
  // Initialize database service
  databaseService = new DatabaseService();

  createWindow();

  // Register global shortcuts
  globalShortcut.register('CommandOrControl+N', () => {
    mainWindow?.webContents.send('new-note');
  });

  globalShortcut.register('CommandOrControl+F', () => {
    mainWindow?.webContents.send('focus-search');
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
  databaseService?.close();
});

// IPC Handlers for Notes
ipcMain.handle('get-notes', async () => {
  try {
    const notes = databaseService?.getNotes();
    return { success: true, data: notes };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-note', async (event, id: string) => {
  try {
    const note = databaseService?.getNote(id);
    return { success: true, data: note };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('save-note', async (event, note: Note) => {
  try {
    const result = databaseService?.saveNote(note);
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('update-note', async (event, id: string, updates: Partial<Note>) => {
  try {
    databaseService?.updateNote(id, updates);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('delete-note', async (event, id: string) => {
  try {
    databaseService?.deleteNote(id);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('search-notes', async (event, query: string) => {
  try {
    const results = databaseService?.searchNotes(query);
    return { success: true, data: results };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-all-tags', async () => {
  try {
    const tags = databaseService?.getAllTags();
    return { success: true, data: tags };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-notes-by-tag', async (event, tag: string) => {
  try {
    const notes = databaseService?.getNotesByTag(tag);
    return { success: true, data: notes };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});
