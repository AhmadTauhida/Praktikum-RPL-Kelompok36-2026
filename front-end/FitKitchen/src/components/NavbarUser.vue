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
        <span class="user-name">{{ userProfile.username || 'Loading...' }}</span>
        <span class="user-role">{{ userProfile.role || 'Guest' }}</span>
      </div>
      <button class="btn-logout" @click="handleLogout">
        <img :src="logoutIcon" alt="Logout" class="nav-custom-icon" /> Logout
      </button>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

// Import Icons
import homeIcon from '../assets/icons/home.png'
import mealIcon from '../assets/icons/planner.png'
import profileIcon from '../assets/icons/profile.png'
import logoutIcon from '../assets/icons/logout.png'
import logo from '../assets/icons/logo.png'

const router = useRouter()

// State untuk menyimpan data user
const userProfile = ref({
  username: '',
  role: ''
})

// Fungsi untuk mengambil data user dari Supabase

// Jalankan fetch saat navbar dimuat
onMounted(() => {
  fetchUserProfile()
})

// Fungsi logout asli menggunakan Supabase

</script>

<style scoped>
/* Styling tetap kosong sesuai permintaanmu */
</style>