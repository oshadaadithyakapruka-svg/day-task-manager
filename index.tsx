
// Entry point for the Daily Focus application
// Fixes errors on line 3 and line 209 by providing explicit imports
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// --- Root Rendering ---
const container = document.getElementById('root');
if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

// --- Service Worker Logic ---
// Only register service worker if on the same origin (fixes ai.studio preview error)
if ('serviceWorker' in navigator && window.location.origin !== 'https://ai.studio') {
  window.addEventListener('load', () => {
    // Check if we are in a sandbox where SW might fail
    if (window.location.hostname.includes('google.goog')) {
        console.log('Skipping ServiceWorker in sandbox environment');
        return;
    }
    navigator.serviceWorker.register('./sw.js').catch(err => {
        console.warn('ServiceWorker registration skipped or failed:', err);
    });
  });
}
