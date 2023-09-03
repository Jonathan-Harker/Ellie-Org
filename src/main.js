import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'

createApp(App).mount('#app')

const link = document.createElement('link');
link.rel = 'manifest';
link.href = '/manifest.json';
document.head.appendChild(link);
