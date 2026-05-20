<template>
  <div class="page-container">
    <NavbarAdmin />

    <div class="content-wrapper">
      <!-- Header Section -->
      <div class="header-section">
        <h1 class="page-title">User Management</h1>
        <p class="page-subtitle">View and manage all users in the system</p>
      </div>

      <!-- Search Section -->
      <div class="search-card">
        <div class="search-input-wrapper">
          <!-- Inline SVG Search Icon -->
          <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Search users by name or email..." 
            class="search-input"
          />
        </div>
      </div>

      <!-- Results Info -->
      <div class="results-info">
        <p>Showing <strong>{{ filteredUsers.length }}</strong> users</p>
      </div>

      <!-- Table Section -->
      <div class="table-card">
        <div v-if="loading" class="loading-state">Loading user data...</div>
        <div v-else-if="error" class="error-state">{{ error }}</div>
        
        <table v-else class="user-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Weight</th>
              <th>Height</th>
              <th>Gender</th>
              <th>Target Calories</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in filteredUsers" :key="user.id_pengguna">
              <td class="font-medium">{{ user.username }}</td>
              
              <td>
                <div class="cell-with-icon">
                  <img :src="emailIcon" alt="Email" class="icon" />
                  {{ user.email }}
                </div>
              </td>
              
              <!-- Memanggil kolom dari DB (berat_badan) -->
              <td>
                <div class="cell-with-icon">
                  <img :src="weightIcon" alt="Weight" class="icon" />
                  {{ user.berat_badan || '-' }} kg
                </div>
              </td>
              
              <!-- Memanggil kolom dari DB (tinggi_badan) -->
              <td>
                <div class="cell-with-icon">
                  <img :src="heightIcon" alt="Height" class="icon" />
                  {{ user.tinggi_badan || '-' }} cm
                </div>
              </td>
              
              <td>
                <span class="gender-badge">{{ user.gender || '-' }}</span>
              </td>
              
              <!-- Memanggil kolom dari DB (target_kalori) -->
              <td>{{ user.target_kalori || '-' }} cal</td>
              
              <!-- Memanggil kolom dari DB (created_at) dan di-format -->
              <td>
                <div class="cell-with-icon">
                  <img :src="joinedIcon" alt="Joined" class="icon" />
                  {{ formatDate(user.created_at) }}
                </div>
              </td>
            </tr>
            <tr v-if="filteredUsers.length === 0">
              <td colspan="7" class="empty-state">No users found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import NavbarAdmin from '../components/NavbarAdmin.vue'

// Icons Imports
import emailIcon from '../assets/icons/mail.svg'
import weightIcon from '../assets/icons/weight.svg'
import heightIcon from '../assets/icons/height.svg'
import joinedIcon from '../assets/icons/calendar.svg'

// State
const users = ref([])
const searchQuery = ref('')
const loading = ref(true)
const error = ref(null)

// API URL (Sesuaikan dengan endpoint yang sudah kita buat sebelumnya)
const API_URL = 'https://praktikum-rpl-kelompok36-2026-ul8w.vercel.app/api/pengguna/admin/users'

// Fetch Data
const fetchUsers = async () => {
  try {
    const token = localStorage.getItem('token')
    const response = await fetch(API_URL, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    const result = await response.json()
    
    if (result.success) {
      // Pastikan hanya menampilkan user biasa (opsional, jika ingin admin tidak masuk daftar)
      users.value = result.data.filter(u => u.role !== 'admin')
    } else {
      error.value = "Failed to load users: " + result.error
    }
  } catch (err) {
    console.error("Error fetching users:", err)
    error.value = "Connection error while fetching users."
  } finally {
    loading.value = false
  }
}

// Format Date (mengubah format ISO ke mm/dd/yyyy seperti di desain)
const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
}

// Computed Filter
const filteredUsers = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()
  if (!query) return users.value
  
  return users.value.filter(user => 
    (user.username && user.username.toLowerCase().includes(query)) ||
    (user.email && user.email.toLowerCase().includes(query))
  )
})

onMounted(() => {
  fetchUsers()
})
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  background-color: #F9FAFB;
  padding-bottom: 3rem;
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

/* Header */
.header-section {
  margin-bottom: 2rem;
}

.page-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.5rem;
}

.page-subtitle {
  color: #6B7280;
  font-size: 1rem;
}

/* Search Card */
.search-card {
  background: white;
  padding: 1.25rem;
  border-radius: 0.75rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  border: 1px solid #E5E7EB;
  margin-bottom: 2rem;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 1rem;
  color: #9CA3AF;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 3rem;
  border: 1px solid #E5E7EB;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  background-color: #F9FAFB;
  transition: all 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #22C55E;
  background-color: white;
}

/* Results Info */
.results-info {
  margin-bottom: 1rem;
  color: #6B7280;
  font-size: 0.875rem;
}

.results-info strong {
  color: #111827;
}

/* Table Card */
.table-card {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  border: 1px solid #E5E7EB;
  overflow-x: auto;
}

.user-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.875rem;
}

.user-table th {
  padding: 1rem 1.5rem;
  background-color: #F9FAFB;
  color: #374151;
  font-weight: 600;
  border-bottom: 1px solid #E5E7EB;
  white-space: nowrap;
}

.user-table td {
  padding: 1.25rem 1.5rem;
  color: #4B5563;
  border-bottom: 1px solid #E5E7EB;
}

.user-table tr:last-child td {
  border-bottom: none;
}

.font-medium {
  font-weight: 500;
  color: #111827;
}

/* Icons & Cells */
.cell-with-icon {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.icon {
  width: 1rem;
  height: 1rem;
  opacity: 0.6;
}

/* Badges */
.gender-badge {
  background-color: #F3F4F6;
  color: #374151;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

/* States */
.loading-state, .error-state, .empty-state {
  padding: 3rem;
  text-align: center;
  color: #6B7280;
}

.error-state {
  color: #EF4444;
}
</style>