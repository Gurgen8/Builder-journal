import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { TOKENS } from '@/constants/tokens';
import './index.css';

const root = document.documentElement;
root.style.setProperty('--color-bgDefault', TOKENS.colors.bgDefault);
root.style.setProperty('--color-textPrimary', TOKENS.colors.textPrimary);
root.style.setProperty('--color-actionHover', TOKENS.colors.actionHover);
root.style.setProperty('--color-scrollbarThumb', TOKENS.colors.scrollbarThumb);
root.style.setProperty('--color-scrollbarThumbHover', TOKENS.colors.scrollbarThumbHover);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
