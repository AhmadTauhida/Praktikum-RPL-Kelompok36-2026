<template>
  <header class="navbar fixed-top">
    <div class="logo">
      <img :src="logo" alt="FitKitchen Logo" class="mainIcon" /> 
      <span class="logo-text">FitKitchen</span>
    </div>

    <div class="nav-right-section">
      <nav class="nav-links">
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
          <span class="user-name">{{ adminProfile.username || 'Loading...' }}</span>
          <span class="user-role">{{ adminProfile.role || 'Admin' }}</span>
        </div>
        <button class="btn-logout" @click="handleLogout">
          <img :src="logoutIcon" alt="Logout" class="nav-custom-icon" />
          Logout
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

// Import Icons
import logo from '../assets/icons/logo.svg' 
import dashboardIcon from '../assets/icons/dashboard.svg'
import recipeIcon from '../assets/icons/recipe.svg'
import userIcon from '../assets/icons/users.svg'
import logoutIcon from '../assets/icons/logout.svg'

const router = useRouter()

// State untuk profil admin
const adminProfile = ref({
  username: '',
  role: ''
})

// Fungsi untuk mengambil data profil dari tabel admin
onMounted(() => {
  fetchAdminProfile()
})


</script>

<style scoped>
/* Desain tetap fokus pada style.css global */
</style>