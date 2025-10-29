import React, { useState, useEffect } from 'react';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { AudioDevice } from '../types';
import { v4 as uuidv4 } from 'uuid';
import '../styles/RecordingView.css';

const RecordingView: React.FC = () => {
  const { state, startRecording, stopRecording, pauseRecording, resumeRecording, getAudioDevices } =
    useAudioRecorder();
  const [devices, setDevices] = useState<AudioDevice[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const [recordingTitle, setRecordingTitle] = useState<string>('');
  const [recordingNotes, setRecordingNotes] = useState<string>('');
  const [isTranscribing, setIsTranscribing] = useState(false);

  useEffect(() => {
    loadAudioDevices();
  }, []);

  const loadAudioDevices = async () => {
    const deviceList = await getAudioDevices();
    setDevices(deviceList);
    if (deviceList.length > 0) {
      setSelectedDevice(deviceList[0].deviceId);
    }
  };

  const handleStartRecording = async () => {
    if (!recordingTitle.trim()) {
      alert('Please enter a recording title');
      return;
    }

    await startRecording(selectedDevice);
  };

  const handleStopRecording = async () => {
    try {
      const audioBlob = await stopRecording();

      // Convert blob to file and save
      const reader = new FileReader();
      reader.onloadend = async () => {
        const arrayBuffer = reader.result as ArrayBuffer;
        const buffer = Buffer.from(arrayBuffer);

        // Save recording metadata
        const recordingData = {
          id: uuidv4(),
          title: recordingTitle || `Recording ${new Date().toLocaleString()}`,
          filePath: '', // Will be set by the main process
          duration: state.duration,
          createdAt: new Date().toISOString(),
          notes: recordingNotes,
        };

        const result = await window.electronAPI.saveRecording({
          ...recordingData,
          audioData: Array.from(buffer),
        });

        if (result.success) {
          // Start transcription
          setIsTranscribing(true);
          const transcriptionResult = await window.electronAPI.transcribeAudio(
            result.data.filePath,
            {
              model: 'whisper-1',
              responseFormat: 'verbose_json',
            }
          );

          if (transcriptionResult.success) {
            alert('Recording saved and transcribed successfully!');
          } else {
            alert('Recording saved but transcription failed: ' + transcriptionResult.error);
          }
          setIsTranscribing(false);

          // Reset form
          setRecordingTitle('');
          setRecordingNotes('');
        }
      };

      reader.readAsArrayBuffer(audioBlob);
    } catch (error: any) {
      alert('Error stopping recording: ' + error.message);
    }
  };

  const formatDuration = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="recording-view">
      <div className="recording-header">
        <h2>Record Audio</h2>
      </div>

      <div className="recording-content">
        {!state.isRecording && !isTranscribing && (
          <div className="recording-setup">
            <div className="form-group">
              <label htmlFor="title">Recording Title</label>
              <input
                id="title"
                type="text"
                value={recordingTitle}
                onChange={(e) => setRecordingTitle(e.target.value)}
                placeholder="Enter a title for this recording"
                className="input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="device">Audio Input Device</label>
              <select
                id="device"
                value={selectedDevice}
                onChange={(e) => setSelectedDevice(e.target.value)}
                className="select"
              >
                {devices.map((device) => (
                  <option key={device.deviceId} value={device.deviceId}>
                    {device.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="notes">Notes (Optional)</label>
              <textarea
                id="notes"
                value={recordingNotes}
                onChange={(e) => setRecordingNotes(e.target.value)}
                placeholder="Add any notes or context about this recording"
                className="textarea"
                rows={4}
              />
            </div>
          </div>
        )}

        {state.isRecording && (
          <div className="recording-active">
            <div className="recording-info">
              <h3>{recordingTitle}</h3>
              <div className="duration">{formatDuration(state.duration)}</div>
            </div>

            <div className="audio-visualizer">
              <div className="audio-level-bar">
                <div
                  className="audio-level-fill"
                  style={{ width: `${state.audioLevel * 100}%` }}
                />
              </div>
            </div>

            {recordingNotes && (
              <div className="recording-notes">
                <p>{recordingNotes}</p>
              </div>
            )}
          </div>
        )}

        {isTranscribing && (
          <div className="transcribing">
            <div className="spinner"></div>
            <p>Transcribing audio...</p>
          </div>
        )}

        <div className="recording-controls">
          {!state.isRecording && !isTranscribing && (
            <button onClick={handleStartRecording} className="btn btn-primary btn-record">
              <span className="icon">⏺</span>
              Start Recording
            </button>
          )}

          {state.isRecording && (
            <>
              {!state.isPaused ? (
                <button onClick={pauseRecording} className="btn btn-secondary">
                  <span className="icon">⏸</span>
                  Pause
                </button>
              ) : (
                <button onClick={resumeRecording} className="btn btn-secondary">
                  <span className="icon">▶️</span>
                  Resume
                </button>
              )}

              <button onClick={handleStopRecording} className="btn btn-danger">
                <span className="icon">⏹</span>
                Stop & Save
              </button>
            </>
          )}
        </div>

        <div className="recording-tips">
          <h4>Tips for better recordings:</h4>
          <ul>
            <li>Find a quiet environment to minimize background noise</li>
            <li>Position your microphone 6-12 inches from your mouth</li>
            <li>Speak clearly and at a moderate pace</li>
            <li>Use the pause button for breaks instead of stopping</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RecordingView;
