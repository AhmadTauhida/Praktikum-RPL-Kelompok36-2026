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

<style scoped>
/* ===== MOBILE FIRST - BASE STYLES ===== */

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  z-index: 1000;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}

/* Body padding untuk fixed navbar */
:global(body) {
  padding-top: 5.5rem;
}

/* Logo Section */
.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;
}

.mainIcon {
  width: 2.25rem;
  height: 2.25rem;
}

.logo-text {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1A1A1A;
  white-space: nowrap;
}

/* Navigation Links - Mobile: Hidden by default */
.nav-links {
  display: none;
}

/* User Actions */
.user-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;
  margin-left: auto;
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.125rem;
}

.user-name {
  font-size: 0.75rem;
  font-weight: 600;
  color: #1F2937;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 8rem;
}

.user-role {
  font-size: 0.625rem;
  color: #6B7280;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 8rem;
}

/* Buttons */
.btn-logout,
.btn-login {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  white-space: nowrap;
}

.btn-logout {
  background-color: #FEE2E2;
  color: #DC2626;
}

.btn-logout:hover:not(:disabled) {
  background-color: #FECACA;
}

.btn-logout:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-login {
  background-color: #DBEAFE;
  color: #0284C7;
}

.btn-login:hover {
  background-color: #BFDBFE;
}

.nav-custom-icon {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
}

/* ===== TABLET (768px+) ===== */
@media (min-width: 48rem) {
  .navbar {
    padding: 1rem 1.5rem;
    flex-wrap: nowrap;
  }

  /* Show nav links */
  .nav-links {
    display: flex;
    gap: 0.5rem;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.625rem 1rem;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    color: #4B5563;
    text-decoration: none;
    transition: all 0.3s ease;
    white-space: nowrap;
  }

  .nav-item:hover {
    background-color: #F3F4F6;
    color: #1A1A1A;
  }

  .nav-item.active {
    background-color: #E8F5E9;
    color: #2D6A4F;
    font-weight: 600;
  }

  .user-actions {
    gap: 1rem;
  }

  .user-name {
    font-size: 0.8125rem;
    max-width: 10rem;
  }

  .user-role {
    font-size: 0.6875rem;
    max-width: 10rem;
  }

  .btn-logout,
  .btn-login {
    padding: 0.625rem 1rem;
    font-size: 0.8125rem;
  }
}

/* ===== DESKTOP (1024px+) ===== */
@media (min-width: 64rem) {
  .navbar {
    padding: 1.25rem 2rem;
  }

  .logo-text {
    font-size: 1.5rem;
  }

  .nav-links {
    gap: 1rem;
    flex: 1;
    justify-content: center;
  }

  .nav-item {
    padding: 0.75rem 1.25rem;
    font-size: 0.938rem;
  }

  .user-actions {
    gap: 1.5rem;
  }

  .user-name {
    font-size: 0.875rem;
    max-width: 12rem;
  }

  .user-role {
    font-size: 0.75rem;
    max-width: 12rem;
  }

  .btn-logout,
  .btn-login {
    padding: 0.75rem 1.25rem;
    font-size: 0.875rem;
  }

  .mainIcon {
    width: 2.5rem;
    height: 2.5rem;
  }
}
</style>