import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/inter';
import '@fontsource-variable/jetbrains-mono';
import '../index.css';
import './landing.css';
import { Analytics } from '@vercel/analytics/react';
import { Landing } from './Landing';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Landing />
    <Analytics />
  </StrictMode>,
);
