<template>
  <header class="navbar fixed-top">
    <div class="logo">
      <img :src="logo" alt="FitKitchen Logo" class="nav-custom-icon" /> 
      <span class="logo-text">FitKitchen</span>
    </div>

    <div class="nav-right-section">
      
      <nav class="nav-links">
        <router-link to="/admin" class="nav-item" active-class="active" exact-active-class="active">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nav-icon"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
          Recipes
        </router-link>

        <router-link to="/userManagement" class="nav-item" active-class="active">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nav-icon"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          Users
        </router-link>
      </nav>

      <div class="divider"></div>

      <div class="user-actions">
        <div class="user-info">
          <span class="user-name">Admin</span>
          <span class="user-role">Admin</span>
        </div>
        <button class="btn-logout" @click="handleLogout">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nav-icon"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
          Logout
        </button>
      </div>

    </div>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router'
// Kita hanya perlu import logo utama.
// Import icon SVG lainnya (recipe, users, logout) dihapus karena sudah menggunakan inline SVG di template.
import logo from '../assets/icons/logo.svg' // Sesuaikan ekstensi jika formatnya .png

const router = useRouter()

const handleLogout = () => {
  // Logika auth
  router.push('/login')
}
</script>

<style scoped>
/* Struktur Header Utama */
.navbar {
  display: flex;
  justify-content: space-between; /* Mendorong Logo ke kiri dan menu ke kanan */
  align-items: center;
  padding: 0.75rem 2rem;
  background-color: #ffffff;
  border-bottom: 1px solid #eaeaea;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo-text {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a1a1a;
}

/* Wrapper Kanan (Navigasi + Profil) */
.nav-right-section {
  display: flex;
  align-items: center;
  gap: 1.5rem; /* Jarak antar grup di sebelah kanan */
}

/* Styling Navigasi dan Efek Warna */
.nav-links {
  display: flex;
  gap: 0.5rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  text-decoration: none;
  color: #333; 
  font-weight: 500;
  font-size: 0.95rem;
  transition: all 0.2s ease;
}

/* Fitur Perubahan Warna Aktif */
.nav-item.active {
  background-color: #2ecc71; /* Background hijau saat aktif */
  color: #ffffff; /* Teks dan ikon akan otomatis menjadi putih */
}

.nav-item:hover:not(.active) {
  background-color: #f5f5f5;
}

/* Garis Pemisah */
.divider {
  width: 1px;
  height: 35px;
  background-color: #eaeaea;
}

/* Profil dan Tombol Logout */
.user-actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  line-height: 1.2;
}

.user-name {
  font-weight: 600;
  font-size: 0.9rem;
  color: #1a1a1a;
}

.user-role {
  font-size: 0.75rem;
  color: #888;
}

.btn-logout {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #333;
  font-weight: 500;
  font-size: 0.95rem;
  padding: 0;
  transition: color 0.2s ease;
}

.btn-logout:hover {
  color: #e74c3c; /* Berubah merah saat di-hover */
}

/* Ikon akan mewarisi warna dari elemen parent-nya */
.nav-icon {
  width: 18px;
  height: 18px;
}
</style>