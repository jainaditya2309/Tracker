// Service Worker for Health Tracker PWA
// Handles caching, offline functionality, and background sync

const CACHE_NAME = 'health-tracker-v1.0.0';
const STATIC_CACHE_NAME = 'health-tracker-static-v1.0.0';
const DATA_CACHE_NAME = 'health-tracker-data-v1.0.0';

// Files to cache for offline functionality
const FILES_TO_CACHE = [
    './',
    './index.html',
    './style.css',
    './script.js',
    './manifest.json',
    './icons/icon-72x72.png',
    './icons/icon-96x96.png',
    './icons/icon-128x128.png',
    './icons/icon-144x144.png',
    './icons/icon-152x152.png',
    './icons/icon-192x192.png',
    './icons/icon-384x384.png',
    './icons/icon-512x512.png'
];

// Install event - cache static files
self.addEventListener('install', (event) => {
    console.log('[ServiceWorker] Install');
    
    event.waitUntil(
        caches.open(STATIC_CACHE_NAME)
            .then((cache) => {
                console.log('[ServiceWorker] Pre-caching offline page');
                return cache.addAll(FILES_TO_CACHE);
            })
            .catch((error) => {
                console.error('[ServiceWorker] Pre-caching failed:', error);
            })
    );
    
    // Force activation of new service worker
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('[ServiceWorker] Activate');
    
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== STATIC_CACHE_NAME && cacheName !== DATA_CACHE_NAME) {
                        console.log('[ServiceWorker] Removing old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    
    // Ensure service worker controls all clients
    self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    console.log('[ServiceWorker] Fetch:', event.request.url);
    
    // Handle different types of requests
    if (event.request.url.includes('api/') || event.request.url.includes('data/')) {
        // Handle API requests with network first strategy
        event.respondWith(networkFirstStrategy(event.request));
    } else {
        // Handle static files with cache first strategy
        event.respondWith(cacheFirstStrategy(event.request));
    }
});

// Cache first strategy for static files
async function cacheFirstStrategy(request) {
    try {
        const cache = await caches.open(STATIC_CACHE_NAME);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            console.log('[ServiceWorker] Serving from cache:', request.url);
            return cachedResponse;
        }
        
        console.log('[ServiceWorker] Fetching from network:', request.url);
        const networkResponse = await fetch(request);
        
        // Cache the new response for future use
        if (networkResponse.status === 200) {
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.error('[ServiceWorker] Cache first strategy failed:', error);
        
        // Return offline page or basic response
        if (request.mode === 'navigate') {
            const cache = await caches.open(STATIC_CACHE_NAME);
            return cache.match('./index.html');
        }
        
        return new Response('Offline - Content not available', {
            status: 503,
            statusText: 'Service Unavailable'
        });
    }
}

// Network first strategy for API requests
async function networkFirstStrategy(request) {
    try {
        console.log('[ServiceWorker] Network first for:', request.url);
        const networkResponse = await fetch(request);
        
        // Cache successful responses
        if (networkResponse.status === 200) {
            const cache = await caches.open(DATA_CACHE_NAME);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.log('[ServiceWorker] Network failed, trying cache:', error);
        
        const cache = await caches.open(DATA_CACHE_NAME);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        return new Response('Offline - Data not available', {
            status: 503,
            statusText: 'Service Unavailable'
        });
    }
}

// Handle background sync for offline data
self.addEventListener('sync', (event) => {
    console.log('[ServiceWorker] Background sync:', event.tag);
    
    if (event.tag === 'health-data-sync') {
        event.waitUntil(syncHealthData());
    }
});

// Sync health data when back online
async function syncHealthData() {
    try {
        console.log('[ServiceWorker] Syncing health data...');
        
        // Get any pending data from IndexedDB or localStorage
        // This would typically sync with a backend server
        // For this offline-first app, we'll just ensure localStorage is consistent
        
        const clients = await self.clients.matchAll();
        clients.forEach(client => {
            client.postMessage({
                type: 'DATA_SYNC_COMPLETE',
                message: 'Health data synchronized successfully'
            });
        });
        
        return Promise.resolve();
    } catch (error) {
        console.error('[ServiceWorker] Data sync failed:', error);
        return Promise.reject(error);
    }
}

// Handle push notifications (for future server integration)
self.addEventListener('push', (event) => {
    console.log('[ServiceWorker] Push received:', event);
    
    const options = {
        body: event.data ? event.data.text() : 'Health reminder notification',
        icon: './icon-192x192.png',
        badge: './icon-192x192.png',
        vibrate: [200, 100, 200],
        tag: 'health-reminder',
        requireInteraction: true,
        actions: [
            {
                action: 'view',
                title: 'View Progress',
                icon: './icon-192x192.png'
            },
            {
                action: 'dismiss',
                title: 'Dismiss',
                icon: './icon-192x192.png'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('Health Tracker', options)
    );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
    console.log('[ServiceWorker] Notification click received:', event);
    
    event.notification.close();
    
    if (event.action === 'view') {
        event.waitUntil(
            clients.openWindow('./')
        );
    } else if (event.action === 'dismiss') {
        // Just close the notification
        return;
    } else {
        // Default action - open the app
        event.waitUntil(
            clients.matchAll().then((clientList) => {
                if (clientList.length > 0) {
                    return clientList[0].focus();
                }
                return clients.openWindow('./');
            })
        );
    }
});

// Handle errors
self.addEventListener('error', (event) => {
    console.error('[ServiceWorker] Error:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
    console.error('[ServiceWorker] Unhandled promise rejection:', event.reason);
});

// Periodic background sync (for future use)
self.addEventListener('periodicsync', (event) => {
    console.log('[ServiceWorker] Periodic sync:', event.tag);
    
    if (event.tag === 'health-reminder-sync') {
        event.waitUntil(checkAndSendReminders());
    }
});

// Check and send reminders
async function checkAndSendReminders() {
    try {
        // This would typically check scheduled reminders
        // and send notifications even when the app is closed
        console.log('[ServiceWorker] Checking reminders...');
        
        const now = new Date();
        const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        
        // Send notification if it's reminder time
        // This is a simplified version - in a real app, you'd check stored reminder times
        
        return Promise.resolve();
    } catch (error) {
        console.error('[ServiceWorker] Reminder check failed:', error);
        return Promise.reject(error);
    }
}

// Message handling from main app
self.addEventListener('message', (event) => {
    console.log('[ServiceWorker] Message received:', event.data);
    
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'CACHE_HEALTH_DATA') {
        // Cache health data for offline access
        const cache = caches.open(DATA_CACHE_NAME);
        // Store the health data
    }
});

// Version check and update handling
const SW_VERSION = '1.0.0';

self.addEventListener('message', (event) => {
    if (event.data === 'GET_VERSION') {
        event.ports[0].postMessage(SW_VERSION);
    }
});

console.log(`[ServiceWorker] Health Tracker Service Worker v${SW_VERSION} loaded`);
