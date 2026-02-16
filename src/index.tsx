import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import configureFontAwesome from './lib/fontAwesome';
import './index.css';

// Configurer FontAwesome au démarrage
configureFontAwesome();

// Enlever le loading spinner une fois que React est prêt
const removeLoadingSpinner = () => {
  const loadingElement = document.getElementById('loading');
  if (loadingElement) {
    loadingElement.style.opacity = '0';
    setTimeout(() => {
      loadingElement.remove();
    }, 300);
  }
};

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Enlever le spinner après le rendu
setTimeout(removeLoadingSpinner, 100);
