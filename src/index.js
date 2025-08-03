// src/index.js - Replace your current index.js with this
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

// Simple auto-update: Register service worker with automatic refresh
serviceWorkerRegistration.register({
    onUpdate: (registration) => {
        // Show simple notification and auto-refresh after 3 seconds
        const notification = document.createElement('div');
        notification.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #10B981;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        font-size: 14px;
        z-index: 10000;
        text-align: center;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      ">
        ✨ Updating to latest version...
      </div>
    `;

        document.body.appendChild(notification);

        // Auto-refresh after 3 seconds
        setTimeout(() => {
            if (registration.waiting) {
                registration.waiting.postMessage({ type: 'SKIP_WAITING' });
            }
            window.location.reload();
        }, 3000);
    },
    onSuccess: () => {
        console.log('App is ready for offline use');
    }
});

reportWebVitals();