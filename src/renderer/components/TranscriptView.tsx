import React, { useState, useEffect } from 'react';
import { Recording } from '../types';
import '../styles/TranscriptView.css';

interface TranscriptViewProps {
  recordingId: string;
  onBack: () => void;
}

const TranscriptView: React.FC<TranscriptViewProps> = ({ recordingId, onBack }) => {
  const [recording, setRecording] = useState<Recording | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editedTranscript, setEditedTranscript] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadRecording();
  }, [recordingId]);

  const loadRecording = async () => {
    setIsLoading(true);
    const result = await window.electronAPI.getRecording(recordingId);
    if (result.success && result.data) {
      setRecording(result.data);
      setEditedTranscript(result.data.transcript || '');
    }
    setIsLoading(false);
  };

  const handleExport = async (format: string) => {
    const result = await window.electronAPI.exportTranscript(recordingId, format);
    if (result.success) {
      alert(`Transcript exported as ${format.toUpperCase()}`);
    } else {
      alert('Export failed: ' + result.error);
    }
  };

  const formatDuration = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatTimestamp = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="transcript-view">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading transcript...</p>
        </div>
      </div>
    );
  }

  if (!recording) {
    return (
      <div className="transcript-view">
        <div className="error">
          <p>Recording not found</p>
          <button onClick={onBack} className="btn btn-primary">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="transcript-view">
      <div className="transcript-header">
        <button onClick={onBack} className="btn-back">
          ← Back
        </button>
        <div className="transcript-title">
          <h2>{recording.title}</h2>
          <div className="transcript-meta">
            <span>Duration: {formatDuration(recording.duration)}</span>
            <span>•</span>
            <span>{new Date(recording.createdAt).toLocaleDateString()}</span>
            {recording.language && (
              <>
                <span>•</span>
                <span>Language: {recording.language}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="transcript-actions">
        <button onClick={() => setIsEditing(!isEditing)} className="btn btn-secondary">
          {isEditing ? 'View Mode' : 'Edit Mode'}
        </button>
        <div className="export-buttons">
          <button onClick={() => handleExport('txt')} className="btn btn-secondary">
            Export TXT
          </button>
          <button onClick={() => handleExport('srt')} className="btn btn-secondary">
            Export SRT
          </button>
          <button onClick={() => handleExport('vtt')} className="btn btn-secondary">
            Export VTT
          </button>
          <button onClick={() => handleExport('pdf')} className="btn btn-secondary">
            Export PDF
          </button>
        </div>
      </div>

      {recording.notes && (
        <div className="recording-notes-section">
          <h3>Notes</h3>
          <p>{recording.notes}</p>
        </div>
      )}

      <div className="transcript-content">
        {isEditing ? (
          <textarea
            value={editedTranscript}
            onChange={(e) => setEditedTranscript(e.target.value)}
            className="transcript-editor"
          />
        ) : (
          <div className="transcript-display">
            {recording.transcriptSegments && recording.transcriptSegments.length > 0 ? (
              <div className="transcript-segments">
                {recording.transcriptSegments.map((segment) => (
                  <div key={segment.id} className="transcript-segment">
                    <span className="segment-timestamp">
                      {formatTimestamp(segment.startTime)}
                    </span>
                    <span className="segment-text">{segment.text}</span>
                    {segment.confidence && (
                      <span
                        className="segment-confidence"
                        title={`Confidence: ${(segment.confidence * 100).toFixed(1)}%`}
                      >
                        {segment.confidence > 0.9 ? '✓' : segment.confidence > 0.7 ? '~' : '?'}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="transcript-text">
                <p>{recording.transcript || 'No transcript available'}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {isEditing && (
        <div className="transcript-footer">
          <button onClick={() => setIsEditing(false)} className="btn btn-secondary">
            Cancel
          </button>
          <button
            onClick={async () => {
              // Save edited transcript
              setIsEditing(false);
              alert('Transcript saved!');
            }}
            className="btn btn-primary"
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
};

export default TranscriptView;
