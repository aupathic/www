const CACHE_NAME = 'aupathic-v1'
const urlsToCache = [
  '/',
  '/index.html',
  '/css/style.css',
  '/site.webmanifest',
  '/img/favicon.ico',
  '/img/favicon-16x16.png',
  '/img/favicon-32x32.png',
  '/img/apple-touch-icon.png',
  '/img/android-chrome-192x192.png',
  '/img/android-chrome-512x512.png',
  'https://fonts.googleapis.com/css2?family=Quicksand:wght@300..700&display=swap',
  'https://fonts.gstatic.com/s/quicksand/v31/6xK-dSZaM9iE8KbpRA_LJ3z8mH9BOJvgkP8o58m-wi40.woff2',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache)
    })
  )
})

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response.status === 200) {
          const responseToCache = response.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache)
          })
        }
        return response
      })
      .catch(() => {
        return caches.match(event.request).then((response) => {
          if (response) {
            return response
          }
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html')
          }
          throw new Error('No cached version available')
        })
      })
  )
})

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME]
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
})
