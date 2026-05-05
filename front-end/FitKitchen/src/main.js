import { createApp } from 'vue'
import App from './App.vue'
import router from './router' 
import './style.css' 
import axios from 'axios'

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Menempelkan token ke header 'Authorization'
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 2. Kode Response Interceptor kamu yang sudah ada tetap di bawahnya
axios.interceptors.response.use(
  (response) => response, 
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      router.push({ name: 'Landing' });
      alert('Sesi Anda telah berakhir, silakan login kembali.');
    }
    return Promise.reject(error);
  }
);

const app = createApp(App)
app.use(router) 
app.mount('#app')