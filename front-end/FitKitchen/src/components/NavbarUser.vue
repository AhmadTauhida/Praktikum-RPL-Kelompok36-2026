<template>
  <header class="navbar fixed-top">
    <div class="logo">
      <img :src="logo" alt="FitKitchen Logo" class="nav-custom-icon" /> 
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
        <span class="user-name">John Doe</span>
        <span class="user-role">User</span>
      </div>
      <button class="btn-logout" @click="handleLogout">
        <img :src="logoutIcon" alt="Logout" class="nav-custom-icon" /> Logout
      </button>
    </div>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router'
import homeIcon from '../assets/icons/home.png'
import mealIcon from '../assets/icons/planner.png'
import profileIcon from '../assets/icons/profile.png'
import logoutIcon from '../assets/icons/logout.png'
import logo from '../assets/icons/logo.png'

// Inisialisasi router
const router = useRouter()

// Fungsi untuk menangani proses logout
const handleLogout = () => {
  // tempat meletakkan logika auth asli.
  // Misalnya menghapus token dari localStorage atau mereset state user (John Doe).
  // Contoh: localStorage.removeItem('user-token');

  // Arahkan kembali ke halaman login
  router.push('/login')
}
</script>

<style scoped>
/* Styling dibiarkan kosong karena manajemen desain difokuskan pada style.css global */
</style>