const CACHE_NAME = 'aupathic-v3'
const urlsToCache = [
  '/',
  '/index.html',
  '/static/css/style.css',
  '/static/js/theme.js',
  '/site.webmanifest',
  '/static/img/favicon-16x16.png',
  '/static/img/favicon-32x32.png',
  '/static/img/apple-touch-icon.png',
  '/static/img/android-chrome-192x192.png',
  '/static/img/android-chrome-512x512.png',
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
