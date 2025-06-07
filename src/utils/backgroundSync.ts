/**
 * © 2025 Vaion Developers. ChainReact — Free Forever, Not Yours to Rebrand.
 */

// Background Sync Utility for ChainReact
export class BackgroundSync {
  private static instance: BackgroundSync;
  
  public static getInstance(): BackgroundSync {
    if (!BackgroundSync.instance) {
      BackgroundSync.instance = new BackgroundSync();
    }
    return BackgroundSync.instance;
  }

  // Initialize background sync listener
  public init(): void {
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      navigator.serviceWorker.ready.then((registration) => {
        // Listen for messages from service worker
        navigator.serviceWorker.addEventListener('message', (event) => {
          if (event.data.type === 'SYNC_COMPLETE') {
            console.log('Background sync completed');
            // Refresh the UI or show notification
            this.onSyncComplete();
          } else if (event.data.type === 'APP_UPDATED') {
            console.log('App updated in background');
            this.onAppUpdated();
          }
        });
      });
    }
  }

  // Queue habit completion for background sync
  public queueHabitCompletion(habitId: string, completed: boolean): void {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        if (registration.active) {
          registration.active.postMessage({
            type: 'QUEUE_SYNC',
            payload: {
              type: 'habit_completion',
              habitId,
              completed,
              timestamp: Date.now()
            }
          });
        }
      });
    }
  }

  // Queue new habit creation for background sync
  public queueHabitCreation(habitData: any): void {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        if (registration.active) {
          registration.active.postMessage({
            type: 'QUEUE_SYNC',
            payload: {
              type: 'habit_creation',
              habitData,
              timestamp: Date.now()
            }
          });
        }
      });
    }
  }

  // Handle sync completion
  private onSyncComplete(): void {
    // Dispatch custom event for UI updates
    window.dispatchEvent(new CustomEvent('sync-complete'));
    
    // Show toast notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('ChainReact Sync', {
        body: 'Your habits have been synced successfully!',
        icon: '/icons/icon-192x192.png'
      });
    }
  }

  // Handle app update
  private onAppUpdated(): void {
    // Dispatch custom event for UI updates
    window.dispatchEvent(new CustomEvent('app-updated'));
    
    console.log('App has been updated in the background');
  }

  // Check if background sync is supported
  public isSupported(): boolean {
    return 'serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype;
  }

  // Check if periodic sync is supported
  public isPeriodicSyncSupported(): boolean {
    return 'serviceWorker' in navigator && 'periodicSync' in window.ServiceWorkerRegistration.prototype;
  }
}

export const backgroundSync = BackgroundSync.getInstance();
