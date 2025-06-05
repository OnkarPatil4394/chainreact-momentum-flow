
// Cache name with version - optimized for faster registration
const CACHE_NAME = 'chainreact-cache-v7-optimized';

// Essential files to cache immediately
const essentialCache = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Additional files to cache in background
const additionalCache = [
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/maskable-icon-512x512.png'
];

// Optimized install event
self.addEventListener('install', (event) => {
  console.log('Service Worker installing - optimized');
  event.waitUntil(
    cacheEssentialFiles()
      .then(() => cacheAdditionalFilesBackground())
      .catch(error => console.warn('Cache installation partial failure:', error))
  );
  self.skipWaiting();
});

// Cache essential files only during install
async function cacheEssentialFiles() {
  const cache = await caches.open(CACHE_NAME);
  const requests = essentialCache.map(url => new Request(url, { cache: 'reload' }));
  return cache.addAll(requests);
}

// Background caching for additional files
async function cacheAdditionalFilesBackground() {
  try {
    const cache = await caches.open(CACHE_NAME);
    for (const url of additionalCache) {
      try {
        await cache.add(new Request(url, { cache: 'reload' }));
      } catch (error) {
        console.warn('Failed to cache:', url);
      }
    }
  } catch (error) {
    console.warn('Background caching failed:', error);
  }
}

// Optimized fetch handler
self.addEventListener('fetch', (event) => {
  if (!shouldHandleRequest(event.request)) return;

  event.respondWith(
    handleFetchRequest(event.request)
  );
});

// Check if request should be handled
function shouldHandleRequest(request) {
  return request.method === 'GET' && 
         !request.url.startsWith('chrome-extension://') &&
         !request.url.startsWith('moz-extension://');
}

// Handle fetch requests with cache-first strategy
async function handleFetchRequest(request) {
  try {
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      // Update cache in background if online
      if (navigator.onLine) {
        updateCacheBackground(request);
      }
      return cachedResponse;
    }

    // Fetch from network with timeout
    const response = await fetchWithTimeout(request);
    
    if (response?.status === 200 && response.type === 'basic') {
      cacheResponse(request, response.clone());
    }
    
    return response;
  } catch (error) {
    return handleFetchError(request);
  }
}

// Fetch with timeout
function fetchWithTimeout(request, timeout = 5000) {
  return Promise.race([
    fetch(request),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Fetch timeout')), timeout)
    )
  ]);
}

// Cache response asynchronously
async function cacheResponse(request, response) {
  try {
    const cache = await caches.open(CACHE_NAME);
    await cache.put(request, response);
  } catch (error) {
    // Ignore cache errors
  }
}

// Update cache in background
function updateCacheBackground(request) {
  fetch(request)
    .then(response => {
      if (response?.status === 200) {
        cacheResponse(request, response.clone());
      }
    })
    .catch(() => {}); // Ignore background update errors
}

// Handle fetch errors
function handleFetchError(request) {
  if (request.destination === 'document') {
    return caches.match('/') || new Response('Offline', { status: 503 });
  }
  return new Response('Offline', { status: 503 });
}

// Optimized activate event
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating');
  event.waitUntil(
    cleanupOldCaches()
      .then(() => self.clients.claim())
      .then(() => cacheAdditionalFilesBackground())
  );
});

// Cleanup old caches
async function cleanupOldCaches() {
  const cacheNames = await caches.keys();
  const deletePromises = cacheNames
    .filter(name => name !== CACHE_NAME)
    .map(name => {
      console.log('Deleting old cache:', name);
      return caches.delete(name);
    });
  
  return Promise.all(deletePromises);
}

// Enhanced notification handling
self.addEventListener('push', (event) => {
  const options = {
    body: event.data?.text() || 'Time to complete your habits!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-192x192.png',
    tag: 'habit-reminder',
    requireInteraction: false,
    actions: [
      { action: 'open', title: 'Open ChainReact' },
      { action: 'dismiss', title: 'Dismiss' }
    ],
    data: { url: '/', timestamp: Date.now() }
  };

  event.waitUntil(
    self.registration.showNotification('ChainReact Reminder', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action !== 'dismiss') {
    event.waitUntil(openOrFocusApp());
  }
});

// Open or focus existing app window
async function openOrFocusApp() {
  const clients = await self.clients.matchAll({ type: 'window' });
  
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
}

// Background sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-habits') {
    event.waitUntil(syncHabits());
  }
});

// Simple sync implementation
async function syncHabits() {
  console.log('Syncing habits in background');
  return Promise.resolve();
}

// File handling
self.addEventListener('message', (event) => {
  if (event.data?.type === 'IMPORT_FILE') {
    console.log('File import received:', event.data.payload);
    self.registration.postMessage({
      type: 'FILE_IMPORTED',
      data: event.data.payload
    });
  }
});
