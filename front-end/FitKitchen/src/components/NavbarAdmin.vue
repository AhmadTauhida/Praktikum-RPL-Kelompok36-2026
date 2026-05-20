<template>
  <header class="navbar fixed-top">
    <div class="logo">
      <img :src="logo" alt="FitKitchen Logo" class="mainIcon" /> 
      <span class="logo-text">FitKitchen</span>
    </div>

    <button
      class="nav-toggle"
      type="button"
      @click="toggleMenu"
      :aria-expanded="isMenuOpen"
      aria-label="Toggle navigation"
    >
      <span></span>
      <span></span>
      <span></span>
    </button>

    <div class="nav-right-section" :class="{ open: isMenuOpen }">
      <nav class="nav-links" :class="{ open: isMenuOpen }">
        <router-link to="/admin" class="nav-item" active-class="active" exact-active-class="active">
          <img :src="dashboardIcon" alt="Home" class="nav-custom-icon" />
          Dashboard
        </router-link>

        <router-link to="/RecipeManagement" class="nav-item" active-class="active" exact-active-class="active">
          <img :src="recipeIcon" alt="Recipes" class="nav-custom-icon" />
          Recipes
        </router-link>

        <router-link to="/userManagement" class="nav-item" active-class="active">
          <img :src="userIcon" alt="Users" class="nav-custom-icon" />
          Users
        </router-link>
      </nav>

      <div class="divider"></div>

      <div class="user-actions">
        <div class="user-info">
          <!-- Menampilkan data dari adminProfile secara dinamis -->
          <span class="user-name">{{ adminProfile.username || 'Loading...' }}</span>
          <span class="user-role">{{ adminProfile.role || 'Admin' }}</span>
        </div>
        
        <!-- Tombol logout dengan indikator loading -->
        <button class="btn-logout" @click="handleLogout" :disabled="isLoggingOut">
          <img :src="logoutIcon" alt="Logout" class="nav-custom-icon" />
          {{ isLoggingOut ? 'Logging out...' : 'Logout' }}
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
// 1. PERBAIKAN IMPORT: Menambahkan watch dan onUnmounted
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

// Import Icons
import logo from '../assets/icons/logo.svg' 
import dashboardIcon from '../assets/icons/dashboard.svg'
import recipeIcon from '../assets/icons/recipe.svg'
import userIcon from '../assets/icons/users.svg'
import logoutIcon from '../assets/icons/logout.svg'

const router = useRouter()
const route = useRoute() 

// 2. PERBAIKAN VARIABEL: Menyesuaikan dengan template (adminProfile)
const adminProfile = ref({
  username: '',
  role: ''
})

const isLoggedIn = ref(false)
const isLoggingOut = ref(false)
const isMenuOpen = ref(false)

// Pantau perubahan URL/Rute untuk update data navbar otomatis
watch(
  () => route.path,
  () => {
    checkAuthStatus()
    isMenuOpen.value = false
  }
)

onMounted(() => {
  checkAuthStatus()
  window.addEventListener('storage', checkAuthStatus)
})

onUnmounted(() => {
  window.removeEventListener('storage', checkAuthStatus)
})

// ==================== FUNGSI AUTH ====================

/**
 * Cek status autentikasi murni dari localStorage
 */
const checkAuthStatus = () => {
  const token = localStorage.getItem('token')
  const userRole = localStorage.getItem('userRole')
  const username = localStorage.getItem('username') 
  
  if (token) {
    isLoggedIn.value = true
    // Assign ke adminProfile agar muncul di template
    adminProfile.value = {
      username: username || 'Admin', 
      role: userRole || 'admin'
    }
  } else {
    isLoggedIn.value = false
    adminProfile.value = { username: '', role: '' }
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
  adminProfile.value = { username: '', role: '' }
  isLoggingOut.value = false
  isMenuOpen.value = false

  // Redirect ke halaman Landing
  router.push({ name: 'Landing' })
}

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}
</script>

<style scoped>
/* Desain tetap fokus pada style.css global */
</style>