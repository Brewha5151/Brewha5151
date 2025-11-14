import React from 'react';
import ReactDOM from 'react-dom/client';
// Use AppEnhanced for real recording and Gemini integration
import App from './AppEnhanced';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
