<template>
  <header class="navbar fixed-top">
    <div class="logo">
      <img :src="logo" alt="FitKitchen Logo" class="mainIcon" /> 
      <span class="logo-text">FitKitchen</span>
    </div>

    <nav class="nav-links">
      <router-link to="/" class="nav-item" active-class="active">
        <img :src="homeIcon" alt="Home" class="nav-custom-icon" /> Home
      </router-link>

      <router-link to="/meal-planner" class="nav-item" active-class="active">
        <img :src="mealIcon" alt="Meal Planner" class="nav-custom-icon" /> Meal Planner
      </router-link>

      <router-link to="/profile" class="nav-item" active-class="active">
        <img :src="profileIcon" alt="Profile" class="nav-custom-icon" /> Profile
      </router-link>
    </nav>

    <div class="user-actions">
      <div class="user-info">
        <!-- Tampilkan nama user jika login, tampilkan Guest jika belum -->
        <span class="user-name">{{ isLoggedIn ? userProfile.username : 'Guest' }}</span>
        <!-- Tampilkan role user jika login, tampilkan instruksi jika guest -->
        <span class="user-role">{{ isLoggedIn ? userProfile.role : 'Login untuk melanjutkan' }}</span>
      </div>
      
      <!-- Tampilkan Logout hanya jika user sudah login -->
      <button v-if="isLoggedIn" class="btn-logout" @click="handleLogout" :disabled="isLoggingOut">
        <img :src="logoutIcon" alt="Logout" class="nav-custom-icon" /> 
        {{ isLoggingOut ? 'Logging out...' : 'Logout' }}
      </button>

      <!-- Tampilkan Login button jika belum login -->
      <router-link v-else to="/login" class="btn-login">
        <img :src="logoutIcon" alt="Login" class="nav-custom-icon" /> Login
      </router-link>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router' // <-- TAMBAHKAN useRoute

// Import Icons
import homeIcon from '../assets/icons/home.png'
import mealIcon from '../assets/icons/planner.png'
import profileIcon from '../assets/icons/profile.png'
import logoutIcon from '../assets/icons/logout.svg'
import logo from '../assets/icons/logo.png'

const router = useRouter()
const route = useRoute() // <-- Inisialisasi route

// State untuk menyimpan data user
const userProfile = ref({
  username: '',
  role: ''
})

const isLoggedIn = ref(false)
const isLoggingOut = ref(false)

// ==================== PERUBAHAN UTAMA ====================
// Pantau perubahan URL/Rute. Setiap kali pindah halaman (termasuk setelah sukses login), 
// Navbar akan mengecek ulang localStorage secara otomatis.
watch(
  () => route.path,
  () => {
    checkAuthStatus()
  }
)

onMounted(() => {
  checkAuthStatus()
  // Dengarkan perubahan localStorage dari tab lain (tetap dipertahankan untuk keamanan multi-tab)
  window.addEventListener('storage', checkAuthStatus)
})

onUnmounted(() => {
  window.removeEventListener('storage', checkAuthStatus)
})

// ==================== FUNGSI AUTH ====================

/**
 * Cek status autentikasi murni dari localStorage (JWT Based)
 */
const checkAuthStatus = () => {
  const token = localStorage.getItem('token')
  const userRole = localStorage.getItem('userRole')
  const username = localStorage.getItem('username') 
  
  if (token) {
    isLoggedIn.value = true
    userProfile.value = {
      username: username || 'User', // Fallback jika username kosong
      role: userRole || 'user'
    }
  } else {
    isLoggedIn.value = false
    userProfile.value = { username: '', role: '' }
  }
}

/**
 * Handle logout: Hapus sesi lokal dan redirect
 */
const handleLogout = () => {
  isLoggingOut.value = true

  // Clear semua data kredensial di localStorage
  localStorage.removeItem('token')
  localStorage.removeItem('userRole')
  localStorage.removeItem('userId')
  localStorage.removeItem('username')
  localStorage.removeItem('isAuthenticated')

  // Update UI state
  isLoggedIn.value = false
  userProfile.value = { username: '', role: '' }
  isLoggingOut.value = false

  // Redirect ke halaman Landing
  router.push({ name: 'Landing' })
}
</script>