export interface IPlatformAdapter {
  isElectron: boolean;
  notify(title: string, options?: NotificationOptions): Promise<void>;
  requestNotificationPermission(): Promise<NotificationPermission>;
  setTrayBadge(count: number): void;
  bringToFront(): void;
  onGlobalShortcut?(key: string, callback: () => void): () => void;
}

class BrowserPlatformAdapter implements IPlatformAdapter {
  public isElectron = false;

  public async requestNotificationPermission(): Promise<NotificationPermission> {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return await Notification.requestPermission();
    }
    return 'denied';
  }

  public async notify(title: string, options?: NotificationOptions): Promise<void> {
    if (typeof window === 'undefined' || !('Notification' in window)) return;

    if (Notification.permission === 'granted') {
      new Notification(title, options);
    } else if (Notification.permission !== 'denied') {
      const perm = await Notification.requestPermission();
      if (perm === 'granted') {
        new Notification(title, options);
      }
    }
  }

  public setTrayBadge(count: number): void {
    if (typeof document !== 'undefined') {
      document.title = count > 0 ? `(${count}) DeskVoice` : 'DeskVoice';
    }
  }

  public bringToFront(): void {
    if (typeof window !== 'undefined') {
      window.focus();
    }
  }
}

// Em ambiente Electron, a bridge do Preload injeta window.__DESKVOICE_ELECTRON__
declare global {
  interface Window {
    __DESKVOICE_ELECTRON__?: IPlatformAdapter;
  }
}

export function getPlatformAdapter(): IPlatformAdapter {
  if (typeof window !== 'undefined' && window.__DESKVOICE_ELECTRON__) {
    return window.__DESKVOICE_ELECTRON__;
  }
  return new BrowserPlatformAdapter();
}
