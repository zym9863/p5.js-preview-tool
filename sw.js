// Service Worker for P5.js Preview Tool PWA
// 提供缓存策略和离线功能

const CACHE_NAME = 'p5js-preview-tool-v1.0.0';
const STATIC_CACHE = 'p5js-static-v1.0.0';
const DYNAMIC_CACHE = 'p5js-dynamic-v1.0.0';

// 需要预缓存的静态资源
const STATIC_ASSETS = [
  './',
  './index.html',
  './styles.css',
  './script.js',
  './manifest.json',
  './favicon.ico',
  
  // 图标文件
  './icons/icon-72x72.png',
  './icons/icon-96x96.png',
  './icons/icon-128x128.png',
  './icons/icon-144x144.png',
  './icons/icon-152x152.png',
  './icons/icon-192x192.png',
  './icons/icon-384x384.png',
  './icons/icon-512x512.png',
  
  // 外部资源（可选，根据网络情况决定是否缓存）
  'https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400;500&family=Inter:wght@300;400;500;600&display=swap',
  'https://cdn.jsdelivr.net/npm/p5@1.7.0/lib/p5.min.js'
];

// 需要动态缓存的路径模式
const DYNAMIC_CACHE_PATTERNS = [
  /^https:\/\/fonts\.googleapis\.com\/.*/,
  /^https:\/\/fonts\.gstatic\.com\/.*/,
  /^https:\/\/cdn\.jsdelivr\.net\/.*/
];

// 安装事件 - 预缓存静态资源
self.addEventListener('install', event => {
  console.log('SW: 开始安装...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('SW: 缓存静态资源...');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('SW: 静态资源缓存完成');
        return self.skipWaiting(); // 立即激活新的 SW
      })
      .catch(error => {
        console.error('SW: 缓存静态资源失败:', error);
      })
  );
});

// 激活事件 - 清理旧缓存
self.addEventListener('activate', event => {
  console.log('SW: 开始激活...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            // 删除旧版本的缓存
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('SW: 删除旧缓存:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('SW: 激活完成');
        return self.clients.claim(); // 立即控制所有页面
      })
  );
});

// 请求拦截 - 实现缓存策略
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  
  // 跳过非 GET 请求
  if (request.method !== 'GET') {
    return;
  }
  
  // 处理导航请求（页面加载）
  if (request.mode === 'navigate') {
    event.respondWith(handleNavigationRequest(request));
    return;
  }
  
  // 处理静态资源
  if (isStaticAsset(request)) {
    event.respondWith(handleStaticAsset(request));
    return;
  }
  
  // 处理外部资源
  if (isDynamicAsset(request)) {
    event.respondWith(handleDynamicAsset(request));
    return;
  }
  
  // 其他请求直接通过网络
  event.respondWith(fetch(request));
});

// 处理导航请求（Cache First with Network Fallback）
async function handleNavigationRequest(request) {
  try {
    // 优先从缓存获取
    const cachedResponse = await caches.match('./index.html');
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // 缓存未命中，尝试网络请求
    const networkResponse = await fetch(request);
    return networkResponse;
  } catch (error) {
    console.error('SW: 导航请求失败:', error);
    // 返回离线页面
    return caches.match('./index.html');
  }
}

// 处理静态资源（Cache First）
async function handleStaticAsset(request) {
  try {
    // 优先从缓存获取
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // 缓存未命中，从网络获取并缓存
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('SW: 静态资源请求失败:', error);
    throw error;
  }
}

// 处理动态资源（Network First with Cache Fallback）
async function handleDynamicAsset(request) {
  try {
    // 优先尝试网络请求
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // 网络请求成功，更新缓存
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
    
    throw new Error('Network response not ok');
  } catch (error) {
    // 网络失败，尝试从缓存获取
    console.log('SW: 网络失败，尝试缓存:', request.url);
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw error;
  }
}

// 判断是否为静态资源
function isStaticAsset(request) {
  const url = new URL(request.url);
  
  // 本地静态文件
  if (url.origin === self.location.origin) {
    const pathname = url.pathname;
    return pathname.endsWith('.css') || 
           pathname.endsWith('.js') || 
           pathname.endsWith('.html') || 
           pathname.endsWith('.png') || 
           pathname.endsWith('.ico') || 
           pathname.endsWith('.jpg') || 
           pathname.endsWith('.jpeg') || 
           pathname.includes('/icons/');
  }
  
  return false;
}

// 判断是否为动态资源
function isDynamicAsset(request) {
  const url = request.url;
  return DYNAMIC_CACHE_PATTERNS.some(pattern => pattern.test(url));
}

// 监听消息（用于手动触发缓存更新等）
self.addEventListener('message', event => {
  const { action, data } = event.data;
  
  switch (action) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'GET_CACHE_INFO':
      getCacheInfo().then(info => {
        event.ports[0].postMessage(info);
      });
      break;
      
    case 'CLEAR_CACHE':
      clearCache().then(success => {
        event.ports[0].postMessage({ success });
      });
      break;
      
    default:
      console.log('SW: 未知消息:', action);
  }
});

// 获取缓存信息
async function getCacheInfo() {
  try {
    const cacheNames = await caches.keys();
    const cacheInfo = {};
    
    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName);
      const keys = await cache.keys();
      cacheInfo[cacheName] = {
        count: keys.length,
        urls: keys.map(request => request.url)
      };
    }
    
    return cacheInfo;
  } catch (error) {
    console.error('SW: 获取缓存信息失败:', error);
    return {};
  }
}

// 清理所有缓存
async function clearCache() {
  try {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames.map(cacheName => caches.delete(cacheName))
    );
    console.log('SW: 所有缓存已清理');
    return true;
  } catch (error) {
    console.error('SW: 清理缓存失败:', error);
    return false;
  }
}

// 监听同步事件（后台同步，如果支持）
self.addEventListener('sync', event => {
  console.log('SW: 后台同步事件:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

// 执行后台同步
async function doBackgroundSync() {
  console.log('SW: 执行后台同步...');
  // 这里可以实现一些后台任务，比如数据同步等
}

// 通知点击事件处理
self.addEventListener('notificationclick', event => {
  const { action, data } = event.notification;
  
  event.notification.close();
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(clientList => {
        // 如果已有窗口打开，则聚焦到该窗口
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            return client.focus();
          }
        }
        
        // 否则打开新窗口
        if (clients.openWindow) {
          return clients.openWindow('./');
        }
      })
  );
});

console.log('SW: Service Worker 已加载');
