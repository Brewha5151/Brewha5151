import Database from 'better-sqlite3';
import path from 'path';
import { app } from 'electron';

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

export class DatabaseService {
  private db: Database.Database;

  constructor() {
    const dbPath = path.join(app.getPath('userData'), 'bear-notes.db');
    this.db = new Database(dbPath);
    this.initDatabase();
    this.seedSampleData();
  }

  private initDatabase() {
    // Create notes table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS notes (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        tags TEXT,
        isPinned INTEGER DEFAULT 0,
        isArchived INTEGER DEFAULT 0,
        isTrashed INTEGER DEFAULT 0,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      )
    `);

    // Create indices for faster searches
    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_notes_updatedAt ON notes(updatedAt DESC);
    `);

    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_notes_title ON notes(title);
    `);

    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_notes_tags ON notes(tags);
    `);
  }

  private seedSampleData() {
    // Check if we already have data
    const count = this.db.prepare('SELECT COUNT(*) as count FROM notes').get() as { count: number };
    if (count.count > 0) return;

    // Sample notes with various tags
    const sampleNotes: Note[] = [
      {
        id: '1',
        title: 'Welcome to Bear Notes',
        content: `# Welcome to Bear Notes

This is a beautiful note-taking app inspired by Bear.

## Features
- **Markdown support** with live preview
- **Tag-based organization** using #hashtags
- **Nested tags** like #work/projects
- Clean, minimal design
- Fast and responsive

Try creating your first note!

#welcome #getting-started`,
        tags: ['welcome', 'getting-started'],
        isPinned: true,
        isArchived: false,
        isTrashed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        title: 'Project Ideas',
        content: `# Project Ideas

## Web Apps
- Portfolio website redesign
- Task management app
- Recipe collection

## Mobile Apps
- Fitness tracker
- Reading list manager

#work/projects #ideas`,
        tags: ['work/projects', 'ideas'],
        isPinned: false,
        isArchived: false,
        isTrashed: false,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: '3',
        title: 'Meeting Notes - Q4 Planning',
        content: `# Q4 Planning Meeting
**Date:** November 26, 2025

## Attendees
- Sarah (Product)
- Mike (Engineering)
- Lisa (Design)

## Key Points
- Launch new feature by December
- Focus on mobile experience
- Increase performance by 30%

## Action Items
- [ ] Mike: Set up CI/CD pipeline
- [ ] Lisa: Create mockups
- [ ] Sarah: Write product specs

#work/meetings #planning`,
        tags: ['work/meetings', 'planning'],
        isPinned: false,
        isArchived: false,
        isTrashed: false,
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        updatedAt: new Date(Date.now() - 172800000).toISOString(),
      },
      {
        id: '4',
        title: 'Reading List',
        content: `# Books to Read

## Fiction
- The Midnight Library
- Project Hail Mary
- Tomorrow, and Tomorrow, and Tomorrow

## Non-Fiction
- Atomic Habits
- The Creative Act
- How to Take Smart Notes

#personal/reading #books`,
        tags: ['personal/reading', 'books'],
        isPinned: false,
        isArchived: false,
        isTrashed: false,
        createdAt: new Date(Date.now() - 259200000).toISOString(),
        updatedAt: new Date(Date.now() - 259200000).toISOString(),
      },
      {
        id: '5',
        title: 'Grocery List',
        content: `# Grocery List

## Produce
- Apples
- Bananas
- Spinach
- Tomatoes

## Dairy
- Milk
- Cheese
- Yogurt

## Pantry
- Pasta
- Rice
- Olive oil

#personal/shopping #groceries`,
        tags: ['personal/shopping', 'groceries'],
        isPinned: false,
        isArchived: false,
        isTrashed: false,
        createdAt: new Date(Date.now() - 345600000).toISOString(),
        updatedAt: new Date(Date.now() - 345600000).toISOString(),
      },
      {
        id: '6',
        title: 'Code Snippets',
        content: `# Useful Code Snippets

## React Hook - useLocalStorage
\`\`\`javascript
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value) => {
    setStoredValue(value);
    window.localStorage.setItem(key, JSON.stringify(value));
  };

  return [storedValue, setValue];
}
\`\`\`

#code/snippets #javascript #react`,
        tags: ['code/snippets', 'javascript', 'react'],
        isPinned: false,
        isArchived: false,
        isTrashed: false,
        createdAt: new Date(Date.now() - 432000000).toISOString(),
        updatedAt: new Date(Date.now() - 432000000).toISOString(),
      },
      {
        id: '7',
        title: 'Travel Plans - Japan 2026',
        content: `# Japan Trip Planning

## Cities to Visit
1. **Tokyo** (5 days)
   - Shibuya
   - Asakusa
   - Akihabara

2. **Kyoto** (4 days)
   - Fushimi Inari
   - Arashiyama Bamboo Grove
   - Kinkaku-ji

3. **Osaka** (2 days)
   - Dotonbori
   - Osaka Castle

## Budget
- Flights: $1200
- Hotels: $100/night
- Food: $50/day
- Activities: $500

#personal/travel #japan #planning`,
        tags: ['personal/travel', 'japan', 'planning'],
        isPinned: true,
        isArchived: false,
        isTrashed: false,
        createdAt: new Date(Date.now() - 518400000).toISOString(),
        updatedAt: new Date(Date.now() - 518400000).toISOString(),
      },
    ];

    // Insert sample notes
    const stmt = this.db.prepare(`
      INSERT INTO notes (id, title, content, tags, isPinned, isArchived, isTrashed, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const note of sampleNotes) {
      stmt.run(
        note.id,
        note.title,
        note.content,
        JSON.stringify(note.tags),
        note.isPinned ? 1 : 0,
        note.isArchived ? 1 : 0,
        note.isTrashed ? 1 : 0,
        note.createdAt,
        note.updatedAt
      );
    }
  }

  saveNote(note: Note): Note {
    const stmt = this.db.prepare(`
      INSERT INTO notes (id, title, content, tags, isPinned, isArchived, isTrashed, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      note.id,
      note.title,
      note.content,
      JSON.stringify(note.tags),
      note.isPinned ? 1 : 0,
      note.isArchived ? 1 : 0,
      note.isTrashed ? 1 : 0,
      note.createdAt,
      note.updatedAt
    );

    return note;
  }

  getNotes(): Note[] {
    const stmt = this.db.prepare(`
      SELECT * FROM notes WHERE isTrashed = 0 ORDER BY isPinned DESC, updatedAt DESC
    `);

    const rows = stmt.all() as any[];
    return rows.map(this.deserializeNote);
  }

  getNote(id: string): Note | null {
    const stmt = this.db.prepare(`
      SELECT * FROM notes WHERE id = ?
    `);

    const row = stmt.get(id) as any;
    return row ? this.deserializeNote(row) : null;
  }

  updateNote(id: string, updates: Partial<Note>): void {
    const fields: string[] = ['updatedAt = ?'];
    const values: any[] = [new Date().toISOString()];

    if (updates.title !== undefined) {
      fields.push('title = ?');
      values.push(updates.title);
    }
    if (updates.content !== undefined) {
      fields.push('content = ?');
      values.push(updates.content);
    }
    if (updates.tags !== undefined) {
      fields.push('tags = ?');
      values.push(JSON.stringify(updates.tags));
    }
    if (updates.isPinned !== undefined) {
      fields.push('isPinned = ?');
      values.push(updates.isPinned ? 1 : 0);
    }
    if (updates.isArchived !== undefined) {
      fields.push('isArchived = ?');
      values.push(updates.isArchived ? 1 : 0);
    }
    if (updates.isTrashed !== undefined) {
      fields.push('isTrashed = ?');
      values.push(updates.isTrashed ? 1 : 0);
    }

    values.push(id);
    const stmt = this.db.prepare(`
      UPDATE notes SET ${fields.join(', ')} WHERE id = ?
    `);

    stmt.run(...values);
  }

  deleteNote(id: string): void {
    const stmt = this.db.prepare('DELETE FROM notes WHERE id = ?');
    stmt.run(id);
  }

  searchNotes(query: string): Note[] {
    const searchPattern = `%${query}%`;
    const stmt = this.db.prepare(`
      SELECT * FROM notes
      WHERE isTrashed = 0 AND (title LIKE ? OR content LIKE ?)
      ORDER BY isPinned DESC, updatedAt DESC
    `);

    const rows = stmt.all(searchPattern, searchPattern) as any[];
    return rows.map(this.deserializeNote);
  }

  getAllTags(): Tag[] {
    const notes = this.getNotes();
    const tagMap = new Map<string, number>();

    notes.forEach(note => {
      note.tags.forEach(tag => {
        tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
      });
    });

    return Array.from(tagMap.entries())
      .map(([name, noteCount]) => ({ name, noteCount }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  getNotesByTag(tag: string): Note[] {
    const allNotes = this.getNotes();
    return allNotes.filter(note => note.tags.includes(tag));
  }

  private deserializeNote(row: any): Note {
    return {
      id: row.id,
      title: row.title,
      content: row.content,
      tags: row.tags ? JSON.parse(row.tags) : [],
      isPinned: row.isPinned === 1,
      isArchived: row.isArchived === 1,
      isTrashed: row.isTrashed === 1,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }

  close() {
    this.db.close();
  }
}
