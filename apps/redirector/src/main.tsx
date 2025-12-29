import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App.tsx'
import './index.css';

const key = "event-redirector:instance-url";

const params = new URLSearchParams(window.location.search);
if (params.has("setInstanceUrl")) {
  const url = params.get("setInstanceUrl")!;
  localStorage.setItem(key, url);
};

if (params.has("clearInstanceUrl")) {
  localStorage.removeItem(key);
};

const showUserInterface = (failed: boolean) => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App failed={failed} />
    </StrictMode>,
  );
};

if (params.has("action")) {
  if (localStorage.getItem(key)) {
    const url = localStorage.getItem(key);
    window.location.replace(`${url}?${params.toString()}`);
  } else {
    showUserInterface(true);
  }
} else {
  showUserInterface(false);
};
