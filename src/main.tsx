import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Intercept fetch calls to use absolute backend URL if VITE_API_BASE_URL is set
// This allows separating the frontend (e.g. Vercel) from the backend (e.g. Render/Railway)
if (import.meta.env.VITE_API_BASE_URL) {
  const originalFetch = window.fetch;
  window.fetch = async (...args) => {
    if (typeof args[0] === 'string' && args[0].startsWith('/api')) {
      args[0] = import.meta.env.VITE_API_BASE_URL + args[0];
    }
    return originalFetch(...args);
  };
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
