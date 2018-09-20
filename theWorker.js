importScripts('js/idb.js');

var staticCacheName = 'precache-v5';
var dynamicCacheName = 'dynamic-v5';


self.addEventListener('install', function(event) {
    console.log('[Service Worker] Installing the bad boy...', event);
    event.waitUntil(caches.open(staticCacheName).then(function(cache) {
        return cache.addAll([
            '/',
            '/js/dbhelper.js',
            '/js/idb.js',
            '/js/main.js',
            '/index.html',
            '/restaurant.html',
            '/css/styles.css',
            '/img/1.jpg',
            '/img/2.jpg',
            '/img/3.jpg',
            '/img/4.jpg',
            '/img/5.jpg',
            '/img/6.jpg',
            '/img/7.jpg',
            '/img/8.jpg',
            '/img/9.jpg',
            '/img/10.jpg',
            'https://fonts.googleapis.com/css?family=Lato:400,700,900|Open+Sans:400,700'
        ]);
    })
)
});

//create idb obect store only if there is no previous object store

var dbPromise = db.open('review-store', 1, function(db) {
    if (!db.objectStoreNames.contains('review')) {
        db.createObjectStore('review', {keyPath: 'id'})
    }
});

self.addEventListener('activate', function(event) {
    console.log('[Service Worker] Activated the bad boy...', event);
    event.waitUntil(caches.keys().then(function(keylist) {
        return Promise.all(keylist.map(function(key) {
            if (key !== staticCacheName && key !== dynamicCacheName) {
                console.log('[Service Worker] Rmoving old cache...', key);
                return caches.delete(key);
            }
        }))
    }));
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            if (response) {
                return response;
            } else {
                return fetch(event.request).then(function(res) {
                     return caches.open(dynamicCacheName).then(function(cache) {
                        cache.put(event.request.url, res.clone());
                        return res;
                    })
                }).catch(function(err) {

                });
            }
        })
    )
});