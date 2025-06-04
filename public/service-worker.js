
// Cache name with version - optimized for faster registration
const CACHE_NAME = 'chainreact-cache-v6-optimized';

// Essential files to cache immediately - reduced for faster registration
const essentialCache = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Additional files to cache in background after registration
const additionalCache = [
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/maskable-icon-512x512.png'
];

// Install service worker with optimized caching strategy
self.addEventListener('install', (event) => {
  console.log('Service Worker installing - optimized for fast registration');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache - caching essential files only');
        // Cache only essential files during install for faster registration
        return cache.addAll(essentialCache.map(url => new Request(url, { cache: 'reload' })));
      })
      .then(() => {
        console.log('Essential files cached successfully');
        // Cache additional files in background after registration
        return cacheAdditionalFiles();
      })
      .catch(error => {
        console.error('Cache installation failed:', error);
        // Continue installation even if some files fail to cache
      })
  );
  // Skip waiting to activate immediately
  self.skipWaiting();
});

// Cache additional files in background
async function cacheAdditionalFiles() {
  try {
    const cache = await caches.open(CACHE_NAME);
    // Cache additional files one by one to avoid timeout
    for (const url of additionalCache) {
      try {
        await cache.add(new Request(url, { cache: 'reload' }));
        console.log('Cached additional file:', url);
      } catch (error) {
        console.warn('Failed to cache additional file:', url, error);
        // Continue with other files even if one fails
      }
    }
  } catch (error) {
    console.warn('Background caching failed:', error);
  }
}

// Optimized fetch handler with better error handling
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests and chrome-extension requests
  if (event.request.method !== 'GET' || 
      event.request.url.startsWith('chrome-extension://') ||
      event.request.url.startsWith('moz-extension://')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached response if available
        if (response) {
          // Update cache in background for next time
          if (navigator.onLine) {
            updateCacheInBackground(event.request);
          }
          return response;
        }

        // Fetch from network with timeout
        return fetchWithTimeout(event.request, 5000)
          .then((response) => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone and cache the response
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              })
              .catch(() => {
                // Ignore cache errors
              });

            return response;
          })
          .catch(() => {
            // Network failed, return offline fallback
            if (event.request.destination === 'document') {
              return caches.match('/');
            }
            // For other resources, return a minimal response
            return new Response('Offline', { status: 503 });
          });
      })
  );
});

// Fetch with timeout to prevent hanging requests
function fetchWithTimeout(request, timeout = 5000) {
  return Promise.race([
    fetch(request),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Fetch timeout')), timeout)
    )
  ]);
}

// Update cache in background without blocking
function updateCacheInBackground(request) {
  fetch(request).then(response => {
    if (response && response.status === 200) {
      const responseClone = response.clone();
      caches.open(CACHE_NAME).then(cache => {
        cache.put(request, responseClone);
      });
    }
  }).catch(() => {
    // Ignore background update errors
  });
}

// Optimized activate event
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating - optimized cleanup');
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
      // Claim clients immediately
      return self.clients.claim();
    }).then(() => {
      // Continue caching additional files after activation
      return cacheAdditionalFiles();
    })
  );
});

// Background sync with better error handling
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-habits') {
    event.waitUntil(syncHabits());
  }
});

// Enhanced push notifications
self.addEventListener('push', (event) => {
  const title = 'ChainReact Reminder';
  const options = {
    body: event.data ? event.data.text() : 'Time to complete your habits!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-192x192.png',
    tag: 'habit-reminder',
    requireInteraction: false, // Don't require interaction for better UX
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

// Optimized notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then(clientList => {
        // Focus existing window if available
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            return client.focus();
          }
        }
        // Open new window if none exists
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
    );
  }
});

// File handling for imports
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'IMPORT_FILE') {
    const fileData = event.data.payload;
    console.log('File import received:', fileData);
    
    // Store the import data
    self.registration.postMessage({
      type: 'FILE_IMPORTED',
      data: fileData
    });
  }
});

// Simplified sync functions
async function syncHabits() {
  console.log('Syncing habits in background');
  // Simplified sync logic
  return Promise.resolve();
}
