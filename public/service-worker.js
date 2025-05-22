
// Cache name with version
const CACHE_NAME = 'chainreact-cache-v1';

// Files to cache
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/maskable-icon-512x512.png'
];

// Install service worker
self.addEventListener('install', (event) => {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Cache and return requests
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request).then(
          (response) => {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // IMPORTANT: Clone the response
            // We need one to return to the browser and one to save in cache
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
});

// Update service worker
self.addEventListener('activate', (event) => {
  const cacheAllowlist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheAllowlist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Background Sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-habits') {
    event.waitUntil(syncHabits());
  }
});

// Function to sync habits data
async function syncHabits() {
  // Retrieve queued habit updates from IndexedDB
  // This would sync with a server if there was one
  const habitsToSync = await getHabitsToSync();
  
  if (habitsToSync && habitsToSync.length > 0) {
    console.log('Syncing habits in background');
    // In a real app, you would send this data to a server
    // Since this app is 100% offline, we'll just mark them as synced
    await markHabitsSynced(habitsToSync);
  }
  return;
}

// Dummy functions for habit sync - in a real app, these would interact with IndexedDB
async function getHabitsToSync() {
  // In real implementation, get from IndexedDB
  return [];
}

async function markHabitsSynced(habits) {
  // In real implementation, update IndexedDB
  return true;
}

// Periodic Background Sync (for newer browsers that support it)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'update-habits') {
    event.waitUntil(updateHabits());
  }
});

async function updateHabits() {
  console.log('Performing periodic sync to check for habit updates');
  // In a real app with a server, you would fetch updates
  // Since this is 100% offline, we'll just check for local updates
  return;
}

// Push notifications
self.addEventListener('push', (event) => {
  const title = 'ChainReact Reminder';
  const options = {
    body: event.data ? event.data.text() : 'Time to complete your habits!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-192x192.png'
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow('/')
  );
});
