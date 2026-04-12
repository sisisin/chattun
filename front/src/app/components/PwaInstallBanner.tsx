import React from 'react';
import { createPortal } from 'react-dom';
import './PwaInstallBanner.css';

const DISMISSED_KEY = 'pwa-install-dismissed';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PwaInstallBanner = () => {
  const [deferredPrompt, setDeferredPrompt] = React.useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = React.useState(() => {
    return localStorage.getItem(DISMISSED_KEY) === 'true';
  });

  React.useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    if (isStandalone || dismissed) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, [dismissed]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    localStorage.setItem(DISMISSED_KEY, 'true');
    setDismissed(true);
    setDeferredPrompt(null);
  };

  if (!deferredPrompt || dismissed) return null;

  return createPortal(
    <div className="pwa-install-banner">
      <span className="pwa-install-banner-text">アプリとしてインストールできます</span>
      <button type="button" className="pwa-install-banner-install" onClick={handleInstall}>
        インストール
      </button>
      <button type="button" className="pwa-install-banner-dismiss" onClick={handleDismiss}>
        ✕
      </button>
    </div>,
    document.body,
  );
};
