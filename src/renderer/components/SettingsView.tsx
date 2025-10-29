import React, { useState, useEffect } from 'react';
import { Settings } from '../types';
import '../styles/SettingsView.css';

const SettingsView: React.FC = () => {
  const [settings, setSettings] = useState<Settings>({
    apiKey: '',
    defaultModel: 'whisper-1',
    sampleRate: 44100,
    audioFormat: 'wav',
    language: 'en',
    theme: 'light',
    recordingsPath: '',
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const result = await window.electronAPI.getSettings();
    if (result.success && result.data) {
      setSettings({ ...settings, ...result.data });
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    const result = await window.electronAPI.saveSettings(settings);
    if (result.success) {
      alert('Settings saved successfully!');
    } else {
      alert('Failed to save settings: ' + result.error);
    }
    setIsSaving(false);
  };

  const handleChange = (field: keyof Settings, value: any) => {
    setSettings({ ...settings, [field]: value });
  };

  return (
    <div className="settings-view">
      <div className="settings-header">
        <h2>Settings</h2>
      </div>

      <div className="settings-content">
        <div className="settings-section">
          <h3>Transcription</h3>

          <div className="form-group">
            <label htmlFor="apiKey">OpenAI API Key</label>
            <input
              id="apiKey"
              type="password"
              value={settings.apiKey}
              onChange={(e) => handleChange('apiKey', e.target.value)}
              placeholder="sk-..."
              className="input"
            />
            <p className="help-text">
              Required for audio transcription. Get your API key from{' '}
              <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer">
                OpenAI Platform
              </a>
            </p>
          </div>

          <div className="form-group">
            <label htmlFor="defaultModel">Default Model</label>
            <select
              id="defaultModel"
              value={settings.defaultModel}
              onChange={(e) => handleChange('defaultModel', e.target.value)}
              className="select"
            >
              <option value="whisper-1">Whisper-1 (Recommended)</option>
            </select>
            <p className="help-text">
              The AI model used for transcription. Whisper-1 provides the best balance of speed and accuracy.
            </p>
          </div>

          <div className="form-group">
            <label htmlFor="language">Default Language</label>
            <select
              id="language"
              value={settings.language}
              onChange={(e) => handleChange('language', e.target.value)}
              className="select"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="it">Italian</option>
              <option value="pt">Portuguese</option>
              <option value="nl">Dutch</option>
              <option value="auto">Auto-detect</option>
            </select>
            <p className="help-text">
              Set the default language for transcription, or use auto-detect.
            </p>
          </div>
        </div>

        <div className="settings-section">
          <h3>Audio Settings</h3>

          <div className="form-group">
            <label htmlFor="sampleRate">Sample Rate</label>
            <select
              id="sampleRate"
              value={settings.sampleRate}
              onChange={(e) => handleChange('sampleRate', parseInt(e.target.value))}
              className="select"
            >
              <option value="16000">16 kHz (Lower quality, smaller files)</option>
              <option value="44100">44.1 kHz (CD quality, recommended)</option>
              <option value="48000">48 kHz (Higher quality)</option>
            </select>
            <p className="help-text">
              Higher sample rates provide better quality but larger file sizes.
            </p>
          </div>

          <div className="form-group">
            <label htmlFor="audioFormat">Audio Format</label>
            <select
              id="audioFormat"
              value={settings.audioFormat}
              onChange={(e) => handleChange('audioFormat', e.target.value as 'wav' | 'mp3')}
              className="select"
            >
              <option value="wav">WAV (Uncompressed, highest quality)</option>
              <option value="mp3">MP3 (Compressed, smaller files)</option>
            </select>
            <p className="help-text">
              Choose the format for saving audio recordings.
            </p>
          </div>
        </div>

        <div className="settings-section">
          <h3>Appearance</h3>

          <div className="form-group">
            <label htmlFor="theme">Theme</label>
            <select
              id="theme"
              value={settings.theme}
              onChange={(e) => handleChange('theme', e.target.value as 'light' | 'dark')}
              className="select"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
            <p className="help-text">
              Choose your preferred color theme for the application.
            </p>
          </div>
        </div>

        <div className="settings-section">
          <h3>Keyboard Shortcuts</h3>
          <div className="shortcuts-list">
            <div className="shortcut-item">
              <span className="shortcut-label">Toggle Recording</span>
              <kbd>Cmd/Ctrl + Shift + R</kbd>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h3>About</h3>
          <p className="about-text">
            <strong>FourBolt</strong><br />
            Version 1.0.0<br />
            A cross-platform desktop application for audio recording and transcription.
          </p>
        </div>
      </div>

      <div className="settings-footer">
        <button onClick={handleSave} disabled={isSaving} className="btn btn-primary">
          {isSaving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
};

export default SettingsView;
