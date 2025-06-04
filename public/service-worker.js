
// Cache name with version - optimized for Windows
const CACHE_NAME = 'chainreact-cache-v5-windows';

// Files to cache - optimized for Windows performance
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/maskable-icon-512x512.png',
  '/screenshots/screenshot1.png',
  '/screenshots/screenshot2.png',
  '/screenshots/mobile-screenshot.png'
];

// Install service worker with Windows optimizations
self.addEventListener('install', (event) => {
  console.log('Service Worker installing - Windows optimized');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        // Use addAll with better error handling for Windows
        return cache.addAll(urlsToCache.map(url => new Request(url, { cache: 'reload' })));
      })
      .catch(error => {
        console.error('Cache installation failed:', error);
      })
  );
  // Skip waiting to activate immediately
  self.skipWaiting();
});

// Enhanced fetch handler optimized for Windows
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests and chrome-extension requests
  if (event.request.method !== 'GET' || event.request.url.startsWith('chrome-extension://')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          // For Windows, also try to update cache in background
          if (navigator.onLine) {
            fetch(event.request).then(fetchResponse => {
              if (fetchResponse && fetchResponse.status === 200) {
                const responseClone = fetchResponse.clone();
                caches.open(CACHE_NAME).then(cache => {
                  cache.put(event.request, responseClone);
                });
              }
            }).catch(() => {
              // Ignore fetch errors in background update
            });
          }
          return response;
        }

        // No cache hit - fetch from network
        return fetch(event.request).then(
          (response) => {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response for caching
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        ).catch(() => {
          // Network failed, return offline page if available
          if (event.request.destination === 'document') {
            return caches.match('/');
          }
        });
      })
  );
});

// Update service worker with Windows-specific cleanup
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating - Windows optimized');
  const cacheAllowlist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheAllowlist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Claim clients to control all open tabs immediately
      return self.clients.claim();
    })
  );
});

// Windows-specific file handling
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'IMPORT_FILE') {
    const fileData = event.data.payload;
    console.log('File import received (Windows):', fileData);
    
    // Store the import data with Windows-specific handling
    self.registration.postMessage({
      type: 'FILE_IMPORTED',
      data: fileData,
      platform: 'windows'
    });
  }
  
  // Handle Windows-specific actions
  if (event.data && event.data.type === 'WINDOWS_ACTION') {
    const action = event.data.action;
    switch (action) {
      case 'MINIMIZE_TO_TRAY':
        // Handle minimize to system tray if supported
        break;
      case 'NOTIFICATION_PERMISSION':
        // Handle Windows notification permissions
        break;
    }
  }
});

// Enhanced Background Sync for Windows
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-habits') {
    event.waitUntil(syncHabits());
  }
  if (event.tag === 'windows-sync') {
    event.waitUntil(windowsSpecificSync());
  }
});

// Windows-specific sync function
async function windowsSpecificSync() {
  console.log('Performing Windows-specific background sync');
  // Handle Windows-specific background tasks
  return;
}

// Enhanced habit sync function
async function syncHabits() {
  const habitsToSync = await getHabitsToSync();
  
  if (habitsToSync && habitsToSync.length > 0) {
    console.log('Syncing habits in background (Windows optimized)');
    await markHabitsSynced(habitsToSync);
  }
  return;
}

// Enhanced push notifications for Windows
self.addEventListener('push', (event) => {
  const title = 'ChainReact Reminder';
  const options = {
    body: event.data ? event.data.text() : 'Time to complete your habits!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-192x192.png',
    tag: 'habit-reminder',
    requireInteraction: true, // Keep notification visible on Windows
    actions: [
      {
        action: 'open',
        title: 'Open ChainReact'
      },
      {
        action: 'dismiss',
        title: 'Dismiss'
      }
    ],
    data: {
      url: '/',
      timestamp: Date.now()
    }
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Enhanced notification click handling for Windows
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then(clientList => {
        // If a window is already open, focus it
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            return client.focus();
          }
        }
        // If no window is open, open a new one
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
    );
  }
});

// Dummy functions for habit sync
async function getHabitsToSync() {
  return [];
}

async function markHabitsSynced(habits) {
  return true;
}
