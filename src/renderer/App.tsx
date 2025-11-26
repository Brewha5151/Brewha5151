import React, { useState, useEffect, useRef } from 'react';
import {
  Search, Plus, Hash, Trash2, Star, Edit3,
  Pin, PinOff, Eye, FileText, ChevronRight, ChevronDown
} from 'lucide-react';
import { marked } from 'marked';
import { v4 as uuidv4 } from 'uuid';

interface Note {
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

interface Tag {
  name: string;
  noteCount: number;
  children?: Tag[];
}

function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(true);
  const [expandedTags, setExpandedTags] = useState<Set<string>>(new Set());
  const editorRef = useRef<HTMLTextAreaElement>(null);

  // Load notes on mount
  useEffect(() => {
    loadNotes();
  }, []);

  // Listen for keyboard shortcuts
  useEffect(() => {
    const handleNewNote = () => createNewNote();
    const handleFocusSearch = () => {
      document.getElementById('search-input')?.focus();
    };

    const unsubscribeNewNote = window.electronAPI?.onNewNote(handleNewNote);
    const unsubscribeFocusSearch = window.electronAPI?.onFocusSearch(handleFocusSearch);

    return () => {
      unsubscribeNewNote?.();
      unsubscribeFocusSearch?.();
    };
  }, []);

  const loadNotes = async () => {
    const result = await window.electronAPI?.getNotes();
    if (result?.success && result.data) {
      setNotes(result.data);
      if (!selectedNote && result.data.length > 0) {
        setSelectedNote(result.data[0]);
      }
    }
  };

  const createNewNote = () => {
    const newNote: Note = {
      id: uuidv4(),
      title: 'Untitled Note',
      content: '',
      tags: [],
      isPinned: false,
      isArchived: false,
      isTrashed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    window.electronAPI?.saveNote(newNote);
    setNotes([newNote, ...notes]);
    setSelectedNote(newNote);
    setIsEditing(true);
    setTimeout(() => editorRef.current?.focus(), 100);
  };

  const updateNote = async (updates: Partial<Note>) => {
    if (!selectedNote) return;

    const updatedNote = { ...selectedNote, ...updates };

    // Extract tags from content
    const tagMatches = updatedNote.content.match(/#[\w/-]+/g) || [];
    const extractedTags = tagMatches.map(tag => tag.substring(1));
    updatedNote.tags = [...new Set(extractedTags)];

    // Extract title from first line of content
    const firstLine = updatedNote.content.split('\n')[0];
    updatedNote.title = firstLine.replace(/^#\s*/, '').trim() || 'Untitled Note';

    await window.electronAPI?.updateNote(selectedNote.id, updatedNote);

    const updatedNotes = notes.map(n => n.id === selectedNote.id ? updatedNote : n);
    setNotes(updatedNotes);
    setSelectedNote(updatedNote);
  };

  const togglePin = async () => {
    if (!selectedNote) return;
    const updates = { isPinned: !selectedNote.isPinned };
    await updateNote(updates);
  };

  const deleteNote = async () => {
    if (!selectedNote) return;
    await window.electronAPI?.deleteNote(selectedNote.id);
    const updatedNotes = notes.filter(n => n.id !== selectedNote.id);
    setNotes(updatedNotes);
    setSelectedNote(updatedNotes[0] || null);
  };

  // Build tag hierarchy
  const buildTagHierarchy = (): Tag[] => {
    const tagMap = new Map<string, number>();

    notes.forEach(note => {
      note.tags.forEach(tag => {
        tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
      });
    });

    const hierarchy: Tag[] = [];
    const processedTags = new Set<string>();

    Array.from(tagMap.keys()).sort().forEach(tag => {
      if (processedTags.has(tag)) return;

      if (tag.includes('/')) {
        const parts = tag.split('/');
        const rootTag = parts[0];

        let rootNode = hierarchy.find(t => t.name === rootTag);
        if (!rootNode) {
          const rootCount = Array.from(tagMap.keys())
            .filter(t => t === rootTag || t.startsWith(rootTag + '/'))
            .reduce((sum, t) => sum + (tagMap.get(t) || 0), 0);

          rootNode = { name: rootTag, noteCount: rootCount, children: [] };
          hierarchy.push(rootNode);
        }

        if (parts.length > 1 && rootNode.children) {
          const childTag = parts.slice(1).join('/');
          if (!rootNode.children.find(c => c.name === childTag)) {
            rootNode.children.push({
              name: childTag,
              noteCount: tagMap.get(tag) || 0
            });
          }
        }
      } else {
        if (!hierarchy.find(t => t.name === tag)) {
          hierarchy.push({
            name: tag,
            noteCount: tagMap.get(tag) || 0
          });
        }
      }
      processedTags.add(tag);
    });

    return hierarchy;
  };

  const toggleTagExpansion = (tagName: string) => {
    const newExpanded = new Set(expandedTags);
    if (newExpanded.has(tagName)) {
      newExpanded.delete(tagName);
    } else {
      newExpanded.add(tagName);
    }
    setExpandedTags(newExpanded);
  };

  const selectTag = (fullTagName: string) => {
    setSelectedTag(fullTagName === selectedTag ? null : fullTagName);
  };

  // Filter notes based on search and selected tag
  const filteredNotes = notes.filter(note => {
    if (note.isTrashed) return false;

    const matchesSearch = searchQuery === '' ||
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTag = !selectedTag || note.tags.some(tag =>
      tag === selectedTag || tag.startsWith(selectedTag + '/')
    );

    return matchesSearch && matchesTag;
  });

  // Render markdown preview
  const renderMarkdown = (content: string) => {
    const html = marked(content, { breaks: true });
    return { __html: html };
  };

  const tagHierarchy = buildTagHierarchy();

  return (
    <div style={styles.container}>
      {/* Left Sidebar - Tags */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <div style={styles.appTitle}>Bear Notes</div>
        </div>

        <div style={styles.tagSection}>
          <div
            style={{
              ...styles.tagItem,
              ...(selectedTag === null ? styles.tagItemSelected : {})
            }}
            onClick={() => setSelectedTag(null)}
          >
            <FileText size={16} style={styles.tagIcon} />
            <span style={styles.tagName}>All Notes</span>
            <span style={styles.tagCount}>{notes.filter(n => !n.isTrashed).length}</span>
          </div>

          <div
            style={styles.tagItem}
          >
            <Star size={16} style={styles.tagIcon} />
            <span style={styles.tagName}>Pinned</span>
            <span style={styles.tagCount}>{notes.filter(n => n.isPinned && !n.isTrashed).length}</span>
          </div>
        </div>

        <div style={styles.tagDivider}></div>

        <div style={styles.tagSectionTitle}>TAGS</div>
        <div style={styles.tagList}>
          {tagHierarchy.map(tag => (
            <div key={tag.name}>
              <div
                style={{
                  ...styles.tagItem,
                  ...(selectedTag === tag.name ? styles.tagItemSelected : {})
                }}
                onClick={() => selectTag(tag.name)}
              >
                {tag.children && tag.children.length > 0 ? (
                  <span
                    style={styles.tagExpand}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTagExpansion(tag.name);
                    }}
                  >
                    {expandedTags.has(tag.name) ? (
                      <ChevronDown size={14} />
                    ) : (
                      <ChevronRight size={14} />
                    )}
                  </span>
                ) : (
                  <Hash size={16} style={styles.tagIcon} />
                )}
                <span style={styles.tagName}>{tag.name}</span>
                <span style={styles.tagCount}>{tag.noteCount}</span>
              </div>

              {tag.children && expandedTags.has(tag.name) && (
                <div style={styles.tagChildren}>
                  {tag.children.map(child => (
                    <div
                      key={child.name}
                      style={{
                        ...styles.tagItem,
                        ...styles.tagChild,
                        ...(selectedTag === `${tag.name}/${child.name}` ? styles.tagItemSelected : {})
                      }}
                      onClick={() => selectTag(`${tag.name}/${child.name}`)}
                    >
                      <Hash size={14} style={styles.tagIcon} />
                      <span style={styles.tagName}>{child.name}</span>
                      <span style={styles.tagCount}>{child.noteCount}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Middle Panel - Notes List */}
      <div style={styles.notesList}>
        <div style={styles.notesHeader}>
          <div style={styles.searchContainer}>
            <Search size={16} style={styles.searchIcon} />
            <input
              id="search-input"
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.searchInput}
            />
          </div>
          <button onClick={createNewNote} style={styles.newNoteButton}>
            <Plus size={20} />
          </button>
        </div>

        <div style={styles.notesListContent}>
          {filteredNotes.length === 0 ? (
            <div style={styles.emptyState}>
              <Edit3 size={48} style={styles.emptyIcon} />
              <div style={styles.emptyText}>No notes found</div>
              <div style={styles.emptySubtext}>
                {searchQuery ? 'Try a different search' : 'Create your first note'}
              </div>
            </div>
          ) : (
            filteredNotes.map(note => (
              <div
                key={note.id}
                style={{
                  ...styles.noteCard,
                  ...(selectedNote?.id === note.id ? styles.noteCardSelected : {})
                }}
                onClick={() => setSelectedNote(note)}
              >
                <div style={styles.noteCardHeader}>
                  <div style={styles.noteCardTitle}>
                    {note.isPinned && <Pin size={12} style={styles.pinIcon} />}
                    {note.title}
                  </div>
                  <div style={styles.noteCardDate}>
                    {new Date(note.updatedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                </div>
                <div style={styles.noteCardPreview}>
                  {note.content.substring(0, 100).replace(/#[\w/-]+/g, '').trim() || 'No content'}
                </div>
                {note.tags.length > 0 && (
                  <div style={styles.noteCardTags}>
                    {note.tags.slice(0, 3).map(tag => (
                      <span key={tag} style={styles.noteCardTag}>#{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Panel - Note Editor */}
      <div style={styles.editor}>
        {selectedNote ? (
          <>
            <div style={styles.editorHeader}>
              <div style={styles.editorActions}>
                <button onClick={togglePin} style={styles.iconButton} title={selectedNote.isPinned ? 'Unpin' : 'Pin'}>
                  {selectedNote.isPinned ? <PinOff size={18} /> : <Pin size={18} />}
                </button>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  style={styles.iconButton}
                  title={isEditing ? 'Preview' : 'Edit'}
                >
                  {isEditing ? <Eye size={18} /> : <Edit3 size={18} />}
                </button>
                <button onClick={deleteNote} style={styles.iconButton} title="Delete">
                  <Trash2 size={18} />
                </button>
              </div>
              <div style={styles.editorInfo}>
                {new Date(selectedNote.updatedAt).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit'
                })}
              </div>
            </div>

            {isEditing ? (
              <textarea
                ref={editorRef}
                value={selectedNote.content}
                onChange={(e) => updateNote({ content: e.target.value })}
                placeholder="Start writing... Use #tags to organize"
                style={styles.editorTextarea}
              />
            ) : (
              <div
                style={styles.editorPreview}
                dangerouslySetInnerHTML={renderMarkdown(selectedNote.content)}
              />
            )}
          </>
        ) : (
          <div style={styles.editorEmpty}>
            <Edit3 size={64} style={styles.editorEmptyIcon} />
            <div style={styles.editorEmptyText}>Select a note to start</div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    height: '100vh',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    backgroundColor: '#fff',
    color: '#333',
  },

  // Sidebar Styles
  sidebar: {
    width: '240px',
    backgroundColor: '#f7f7f7',
    borderRight: '1px solid #e0e0e0',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  sidebarHeader: {
    padding: '20px 16px',
    borderBottom: '1px solid #e0e0e0',
  },
  appTitle: {
    fontSize: '18px',
    fontWeight: 700,
    color: '#cc4444',
  },
  tagSection: {
    padding: '8px 0',
  },
  tagSectionTitle: {
    padding: '12px 16px 8px',
    fontSize: '11px',
    fontWeight: 600,
    color: '#999',
    letterSpacing: '0.5px',
  },
  tagList: {
    flex: 1,
    overflowY: 'auto',
    paddingBottom: '16px',
  },
  tagItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 16px',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#555',
    transition: 'background-color 0.15s',
  },
  tagItemSelected: {
    backgroundColor: '#e0e0e0',
    color: '#cc4444',
  },
  tagIcon: {
    marginRight: '8px',
    color: '#999',
    flexShrink: 0,
  },
  tagExpand: {
    marginRight: '4px',
    color: '#999',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
  },
  tagName: {
    flex: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  tagCount: {
    fontSize: '12px',
    color: '#999',
    marginLeft: '8px',
  },
  tagChildren: {
    marginLeft: '8px',
  },
  tagChild: {
    paddingLeft: '32px',
  },
  tagDivider: {
    height: '1px',
    backgroundColor: '#e0e0e0',
    margin: '8px 16px',
  },

  // Notes List Styles
  notesList: {
    width: '320px',
    backgroundColor: '#fafafa',
    borderRight: '1px solid #e0e0e0',
    display: 'flex',
    flexDirection: 'column',
  },
  notesHeader: {
    padding: '16px',
    borderBottom: '1px solid #e0e0e0',
    display: 'flex',
    gap: '8px',
  },
  searchContainer: {
    flex: 1,
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    color: '#999',
    pointerEvents: 'none',
  },
  searchInput: {
    width: '100%',
    padding: '10px 12px 10px 36px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    backgroundColor: '#fff',
    transition: 'border-color 0.15s',
  },
  newNoteButton: {
    padding: '10px',
    backgroundColor: '#cc4444',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.15s',
  },
  notesListContent: {
    flex: 1,
    overflowY: 'auto',
    padding: '8px',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    color: '#999',
  },
  emptyIcon: {
    marginBottom: '16px',
    opacity: 0.3,
  },
  emptyText: {
    fontSize: '18px',
    fontWeight: 600,
    marginBottom: '8px',
  },
  emptySubtext: {
    fontSize: '14px',
  },
  noteCard: {
    padding: '12px',
    marginBottom: '8px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    cursor: 'pointer',
    border: '1px solid #e0e0e0',
    transition: 'all 0.15s',
  },
  noteCardSelected: {
    borderColor: '#cc4444',
    backgroundColor: '#fff5f5',
  },
  noteCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '8px',
  },
  noteCardTitle: {
    fontSize: '15px',
    fontWeight: 600,
    color: '#333',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  pinIcon: {
    color: '#cc4444',
    flexShrink: 0,
  },
  noteCardDate: {
    fontSize: '12px',
    color: '#999',
    flexShrink: 0,
    marginLeft: '8px',
  },
  noteCardPreview: {
    fontSize: '13px',
    color: '#666',
    lineHeight: '1.5',
    marginBottom: '8px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
  },
  noteCardTags: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap',
  },
  noteCardTag: {
    fontSize: '11px',
    color: '#cc4444',
    backgroundColor: '#ffe5e5',
    padding: '2px 8px',
    borderRadius: '4px',
  },

  // Editor Styles
  editor: {
    flex: 1,
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'column',
  },
  editorHeader: {
    padding: '16px 24px',
    borderBottom: '1px solid #e0e0e0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  editorActions: {
    display: 'flex',
    gap: '8px',
  },
  iconButton: {
    padding: '8px',
    backgroundColor: 'transparent',
    border: '1px solid #e0e0e0',
    borderRadius: '6px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#666',
    transition: 'all 0.15s',
  },
  editorInfo: {
    fontSize: '12px',
    color: '#999',
  },
  editorTextarea: {
    flex: 1,
    padding: '24px',
    border: 'none',
    outline: 'none',
    fontSize: '16px',
    lineHeight: '1.7',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    resize: 'none',
  },
  editorPreview: {
    flex: 1,
    padding: '24px',
    fontSize: '16px',
    lineHeight: '1.7',
    overflowY: 'auto',
  },
  editorEmpty: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ccc',
  },
  editorEmptyIcon: {
    marginBottom: '16px',
    opacity: 0.3,
  },
  editorEmptyText: {
    fontSize: '18px',
    fontWeight: 600,
  },
};

export default App;
