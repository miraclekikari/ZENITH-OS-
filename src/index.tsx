import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import configureFontAwesome from './lib/fontAwesome';
import './index.css';

// Configurer FontAwesome au démarrage
configureFontAwesome();

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
