import './index.css';
// Bundled by Vite into the SPA's own CSS — the standalone server must serve
// every asset itself (no CDN).
import '@xterm/xterm/css/xterm.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App.tsx';
import { isBrowserRuntime, isOfficePreview } from './runtime';

async function main() {
  // browserMock is for Vite dev mode only (UI prototyping without a server).
  // In standalone server mode, assets are loaded server-side and sent over WebSocket.
  if (isBrowserRuntime && (import.meta.env.DEV || isOfficePreview)) {
    const { initBrowserMock } = await import('./browserMock.js');
    await initBrowserMock();
  }
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

main().catch((error: unknown) => {
  console.error(error);
  // Static preview must not fail as an unexplained blank screen on Android.
  if (!isOfficePreview) return;
  const root = document.getElementById('root');
  if (!root) return;
  root.replaceChildren();
  const panel = document.createElement('main');
  panel.setAttribute('role', 'alert');
  panel.style.cssText =
    'min-height:100dvh;display:grid;place-content:center;gap:12px;padding:24px;' +
    'background:#111a29;color:#f3f4f6;font:16px system-ui,sans-serif;';
  const title = document.createElement('h1');
  title.textContent = 'Não foi possível carregar o escritório';
  const info = document.createElement('p');
  info.textContent =
    'Esta versão precisa ser aberta por um endereço HTTPS, não por um HTML extraído no celular.';
  const details = document.createElement('p');
  details.style.cssText = 'font-size:13px;color:#cbd5e1;overflow-wrap:anywhere';
  details.textContent = error instanceof Error ? error.message.slice(0, 280) : 'Erro de inicialização';
  panel.append(title, info, details);
  root.append(panel);
});
