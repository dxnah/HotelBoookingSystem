import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

document.body.style.margin = '0';
document.body.style.padding = '0';
document.body.style.background = '#0d0d0d';
document.body.style.overflowX = 'hidden';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);