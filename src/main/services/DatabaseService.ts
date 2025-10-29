import Database from 'better-sqlite3';
import path from 'path';
import { app } from 'electron';
import fs from 'fs';

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

export class DatabaseService {
  private db: Database.Database;

  constructor() {
    const dbPath = path.join(app.getPath('userData'), 'recordings.db');
    this.db = new Database(dbPath);
    this.initDatabase();
  }

  private initDatabase() {
    // Create recordings table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS recordings (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        filePath TEXT NOT NULL,
        duration INTEGER NOT NULL,
        createdAt TEXT NOT NULL,
        tags TEXT,
        notes TEXT,
        transcript TEXT,
        transcriptSegments TEXT,
        language TEXT,
        modelUsed TEXT
      )
    `);

    // Create index for faster searches
    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_recordings_createdAt ON recordings(createdAt DESC);
    `);

    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_recordings_title ON recordings(title);
    `);
  }

  saveRecording(recording: Recording): Recording {
    const stmt = this.db.prepare(`
      INSERT INTO recordings (
        id, title, filePath, duration, createdAt, tags, notes,
        transcript, transcriptSegments, language, modelUsed
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      recording.id,
      recording.title,
      recording.filePath,
      recording.duration,
      recording.createdAt,
      recording.tags ? JSON.stringify(recording.tags) : null,
      recording.notes,
      recording.transcript,
      recording.transcriptSegments ? JSON.stringify(recording.transcriptSegments) : null,
      recording.language,
      recording.modelUsed
    );

    return recording;
  }

  getRecordings(): Recording[] {
    const stmt = this.db.prepare(`
      SELECT * FROM recordings ORDER BY createdAt DESC
    `);

    const rows = stmt.all() as any[];
    return rows.map(this.deserializeRecording);
  }

  getRecording(id: string): Recording | null {
    const stmt = this.db.prepare(`
      SELECT * FROM recordings WHERE id = ?
    `);

    const row = stmt.get(id) as any;
    return row ? this.deserializeRecording(row) : null;
  }

  updateRecording(id: string, updates: Partial<Recording>): void {
    const fields: string[] = [];
    const values: any[] = [];

    if (updates.title !== undefined) {
      fields.push('title = ?');
      values.push(updates.title);
    }
    if (updates.notes !== undefined) {
      fields.push('notes = ?');
      values.push(updates.notes);
    }
    if (updates.tags !== undefined) {
      fields.push('tags = ?');
      values.push(JSON.stringify(updates.tags));
    }
    if (updates.transcript !== undefined) {
      fields.push('transcript = ?');
      values.push(updates.transcript);
    }
    if (updates.transcriptSegments !== undefined) {
      fields.push('transcriptSegments = ?');
      values.push(JSON.stringify(updates.transcriptSegments));
    }

    if (fields.length === 0) return;

    values.push(id);
    const stmt = this.db.prepare(`
      UPDATE recordings SET ${fields.join(', ')} WHERE id = ?
    `);

    stmt.run(...values);
  }

  deleteRecording(id: string): void {
    const recording = this.getRecording(id);
    if (recording) {
      // Delete the audio file
      if (fs.existsSync(recording.filePath)) {
        fs.unlinkSync(recording.filePath);
      }

      // Delete from database
      const stmt = this.db.prepare('DELETE FROM recordings WHERE id = ?');
      stmt.run(id);
    }
  }

  searchRecordings(query: string): Recording[] {
    const searchPattern = `%${query}%`;
    const stmt = this.db.prepare(`
      SELECT * FROM recordings
      WHERE title LIKE ? OR notes LIKE ? OR transcript LIKE ?
      ORDER BY createdAt DESC
    `);

    const rows = stmt.all(searchPattern, searchPattern, searchPattern) as any[];
    return rows.map(this.deserializeRecording);
  }

  private deserializeRecording(row: any): Recording {
    return {
      id: row.id,
      title: row.title,
      filePath: row.filePath,
      duration: row.duration,
      createdAt: row.createdAt,
      tags: row.tags ? JSON.parse(row.tags) : undefined,
      notes: row.notes,
      transcript: row.transcript,
      transcriptSegments: row.transcriptSegments ? JSON.parse(row.transcriptSegments) : undefined,
      language: row.language,
      modelUsed: row.modelUsed,
    };
  }

  close() {
    this.db.close();
  }
}
