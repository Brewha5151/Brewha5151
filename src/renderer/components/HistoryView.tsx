import React, { useState, useEffect } from 'react';
import { Clock, Calendar, Trash2, Search as SearchIcon, X } from 'lucide-react';
import { Recording } from '../types';
import '../styles/HistoryView.css';

interface HistoryViewProps {
  onSelectRecording: (id: string) => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ onSelectRecording }) => {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRecordings();
  }, []);

  const loadRecordings = async () => {
    setIsLoading(true);
    const result = await window.electronAPI.getRecordings();
    if (result.success) {
      setRecordings(result.data || []);
    }
    setIsLoading(false);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadRecordings();
      return;
    }

    const result = await window.electronAPI.searchRecordings(searchQuery);
    if (result.success) {
      setRecordings(result.data || []);
    }
  };

  const handleDelete = async (id: string, event: React.MouseEvent) => {
    event.stopPropagation();

    if (confirm('Are you sure you want to delete this recording?')) {
      const result = await window.electronAPI.deleteRecording(id);
      if (result.success) {
        loadRecordings();
      }
    }
  };

  const formatDuration = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m ${seconds}s`;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="history-view">
      <div className="history-header">
        <h2>Recording History</h2>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search recordings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="input"
          />
          <button onClick={handleSearch} className="btn btn-secondary">
            <SearchIcon size={16} />
            Search
          </button>
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                loadRecordings();
              }}
              className="btn btn-secondary"
            >
              <X size={16} />
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="recordings-list">
        {isLoading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading recordings...</p>
          </div>
        ) : recordings.length === 0 ? (
          <div className="empty-state">
            <p>No recordings found</p>
            <p className="empty-subtitle">
              {searchQuery
                ? 'Try a different search term'
                : 'Start recording to see your sessions here'}
            </p>
          </div>
        ) : (
          <div className="recordings-grid">
            {recordings.map((recording) => (
              <div
                key={recording.id}
                className="recording-card"
                onClick={() => onSelectRecording(recording.id)}
              >
                <div className="recording-card-header">
                  <h3>{recording.title}</h3>
                  <button
                    onClick={(e) => handleDelete(recording.id, e)}
                    className="btn-icon btn-delete"
                    title="Delete recording"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="recording-card-meta">
                  <span className="meta-item">
                    <Clock size={16} />
                    {formatDuration(recording.duration)}
                  </span>
                  <span className="meta-item">
                    <Calendar size={16} />
                    {formatDate(recording.createdAt)}
                  </span>
                </div>

                {recording.notes && (
                  <p className="recording-notes">{recording.notes}</p>
                )}

                {recording.transcript && (
                  <div className="transcript-preview">
                    <p>{recording.transcript.substring(0, 150)}...</p>
                  </div>
                )}

                {recording.tags && recording.tags.length > 0 && (
                  <div className="recording-tags">
                    {recording.tags.map((tag, index) => (
                      <span key={index} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryView;
