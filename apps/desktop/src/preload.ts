import { contextBridge, ipcRenderer } from 'electron';

// Ponte de APIs Nativas (ADR-001 PlatformAdapter)
contextBridge.exposeInMainWorld('__DESKVOICE_ELECTRON__', {
  isElectron: true,

  notify: async (title: string, options?: NotificationOptions) => {
    ipcRenderer.send('app:notify', { title, options });
  },

  requestNotificationPermission: async () => {
    return 'granted';
  },

  setTrayBadge: (count: number) => {
    ipcRenderer.send('app:set-badge', count);
  },

  bringToFront: () => {
    ipcRenderer.send('app:bring-to-front');
  },
});
