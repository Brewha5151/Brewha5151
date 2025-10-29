import React, { useState, useEffect } from 'react';
import { Mic, History, Settings } from 'lucide-react';
import RecordingView from './components/RecordingView';
import HistoryView from './components/HistoryView';
import TranscriptView from './components/TranscriptView';
import SettingsView from './components/SettingsView';
import './styles/App.css';

type View = 'recording' | 'history' | 'transcript' | 'settings';

interface AppState {
  currentView: View;
  selectedRecordingId: string | null;
}

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    currentView: 'recording',
    selectedRecordingId: null,
  });

  const navigateToView = (view: View, recordingId?: string) => {
    setState({
      currentView: view,
      selectedRecordingId: recordingId || null,
    });
  };

  useEffect(() => {
    // Listen for global hotkey events
    const cleanup = window.electronAPI.onToggleRecording(() => {
      navigateToView('recording');
    });

    return cleanup;
  }, []);

  return (
    <div className="app">
      <nav className="sidebar">
        <div className="sidebar-header">
          <h1>FourBolt</h1>
        </div>
        <ul className="sidebar-nav">
          <li
            className={state.currentView === 'recording' ? 'active' : ''}
            onClick={() => navigateToView('recording')}
          >
            <Mic size={20} />
            <span>Record</span>
          </li>
          <li
            className={state.currentView === 'history' ? 'active' : ''}
            onClick={() => navigateToView('history')}
          >
            <History size={20} />
            <span>History</span>
          </li>
          <li
            className={state.currentView === 'settings' ? 'active' : ''}
            onClick={() => navigateToView('settings')}
          >
            <Settings size={20} />
            <span>Settings</span>
          </li>
        </ul>
      </nav>

      <main className="main-content">
        {state.currentView === 'recording' && <RecordingView />}
        {state.currentView === 'history' && (
          <HistoryView onSelectRecording={(id) => navigateToView('transcript', id)} />
        )}
        {state.currentView === 'transcript' && state.selectedRecordingId && (
          <TranscriptView
            recordingId={state.selectedRecordingId}
            onBack={() => navigateToView('history')}
          />
        )}
        {state.currentView === 'settings' && <SettingsView />}
      </main>
    </div>
  );
};

export default App;
