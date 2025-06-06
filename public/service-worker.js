
// ChainReact Service Worker - Enhanced with Background & Periodic Sync
const CACHE_NAME = 'chainreact-v1';
const OFFLINE_URL = '/';

// Essential files to cache immediately
const STATIC_CACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Install event - cache essential files
self.addEventListener('install', (event) => {
  console.log('Service Worker installing');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching essential files');
        return cache.addAll(STATIC_CACHE_URLS);
      })
      .catch((error) => {
        console.error('Cache installation failed:', error);
      })
  );
  
  self.skipWaiting();
});

// Activate event - clean up old caches and register background sync
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating');
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Register for periodic background sync (if supported)
      self.registration.periodicSync?.register('habit-sync', {
        minInterval: 24 * 60 * 60 * 1000 // 24 hours
      }).then(() => {
        console.log('Periodic sync registered');
      }).catch((error) => {
        console.log('Periodic sync not supported:', error);
      })
    ]).then(() => {
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache, fallback to network, queue for sync
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;
  
  // Skip non-http requests
  if (!event.request.url.startsWith('http')) return;
  
  // Handle navigation requests
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // If network succeeds, cache and return the response
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // If network fails, serve from cache or fallback
          return caches.match(event.request)
            .then((cachedResponse) => {
              return cachedResponse || caches.match(OFFLINE_URL);
            });
        })
    );
    return;
  }
  
  // Handle other requests (assets, API calls, etc.)
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        
        return fetch(event.request)
          .then((response) => {
            // Cache successful responses
            if (response.status === 200 && response.type === 'basic') {
              const responseClone = response.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseClone);
              });
            }
            return response;
          })
          .catch(() => {
            // Queue failed requests for background sync
            if (event.request.url.includes('/api/')) {
              return self.registration.sync.register('background-sync')
                .then(() => {
                  return new Response('Queued for sync', { 
                    status: 202,
                    statusText: 'Accepted - Will sync when online'
                  });
                })
                .catch(() => {
                  return new Response('Offline', { 
                    status: 503,
                    statusText: 'Service Unavailable'
                  });
                });
            }
            
            return new Response('Offline', { 
              status: 503,
              statusText: 'Service Unavailable'
            });
          });
      })
  );
});

// Background Sync - Handle queued requests when back online
self.addEventListener('sync', (event) => {
  console.log('Background sync triggered:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(syncPendingRequests());
  }
});

// Periodic Background Sync - Update app data periodically
self.addEventListener('periodicsync', (event) => {
  console.log('Periodic sync triggered:', event.tag);
  
  if (event.tag === 'habit-sync') {
    event.waitUntil(performPeriodicSync());
  }
});

// Sync pending requests when back online
async function syncPendingRequests() {
  try {
    console.log('Syncing pending requests...');
    
    // Get pending data from IndexedDB or localStorage
    const pendingData = await getPendingData();
    
    if (pendingData.length > 0) {
      // Send pending habit completions
      for (const data of pendingData) {
        try {
          // Simulate sending to server (in a real app, this would be your API)
          console.log('Syncing habit data:', data);
          
          // Remove from pending queue after successful sync
          await removePendingData(data.id);
        } catch (error) {
          console.error('Failed to sync data:', error);
        }
      }
      
      // Notify all clients that sync is complete
      const clients = await self.clients.matchAll();
      clients.forEach(client => {
        client.postMessage({ type: 'SYNC_COMPLETE' });
      });
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Perform periodic sync to update app
async function performPeriodicSync() {
  try {
    console.log('Performing periodic sync...');
    
    // Update cache with latest resources
    const cache = await caches.open(CACHE_NAME);
    
    // Pre-cache updated resources
    const resourcesToUpdate = [
      '/',
      '/index.html',
      '/manifest.json'
    ];
    
    await cache.addAll(resourcesToUpdate);
    
    // Notify clients about update
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({ type: 'APP_UPDATED' });
    });
    
    console.log('Periodic sync completed');
  } catch (error) {
    console.error('Periodic sync failed:', error);
  }
}

// Helper functions for pending data management
async function getPendingData() {
  try {
    const pendingData = localStorage.getItem('pendingSync');
    return pendingData ? JSON.parse(pendingData) : [];
  } catch (error) {
    console.error('Failed to get pending data:', error);
    return [];
  }
}

async function removePendingData(id) {
  try {
    const pendingData = await getPendingData();
    const filteredData = pendingData.filter(item => item.id !== id);
    localStorage.setItem('pendingSync', JSON.stringify(filteredData));
  } catch (error) {
    console.error('Failed to remove pending data:', error);
  }
}

// Handle push notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data?.text() || 'Time to complete your habits!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-192x192.png',
    tag: 'habit-reminder'
  };

  event.waitUntil(
    self.registration.showNotification('ChainReact Reminder', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clients) => {
      // Focus existing window if available
      for (const client of clients) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      // Open new window if none exists
      if (self.clients.openWindow) {
        return self.clients.openWindow('/');
      }
    })
  );
});

// Handle messages from the main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  } else if (event.data && event.data.type === 'QUEUE_SYNC') {
    // Queue data for background sync
    queueDataForSync(event.data.payload);
  }
});

// Queue data for background sync
async function queueDataForSync(data) {
  try {
    const pendingData = await getPendingData();
    pendingData.push({
      id: Date.now(),
      ...data,
      timestamp: Date.now()
    });
    localStorage.setItem('pendingSync', JSON.stringify(pendingData));
    
    // Register for background sync
    await self.registration.sync.register('background-sync');
  } catch (error) {
    console.error('Failed to queue data for sync:', error);
  }
}
