<template>
  <div class="page-container">
    <NavbarAdmin />

    <div class="content-wrapper">
      <header class="header">
        <h1>User Management</h1>
        <p>View and manage all users in the system</p>
      </header>

      <div class="search-container">
        <i class="fas fa-search search-icon"></i>
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Search users by name or email..." 
          class="search-input"
        >
      </div>

      <div class="table-card">
        <table class="users-table">
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
            <tr v-for="user in filteredUsers" :key="user.id">
              <td class="user-cell">
                <img :src="profileIcon" alt="avatar" class="avatar" />
                {{ user.username }}
              </td>
              <td class="email-cell">
                <img :src="mail" alt="mail" class="icon-small" /> {{ user.email }}
              </td>
              <td><img :src="weightIcon" class="icon-small" /> {{ user.berat_badan }} kg</td>
              <td><img :src="heightIcon" class="icon-small" /> {{ user.tinggi_badan }} cm</td>
              <td>
                <span :class="['badge', user.gender.toLowerCase()]">{{ user.gender }}</span>
              </td>
              <td>{{ user.target_calories }} cal</td>
              <td class="date-cell">
                <img :src="calendarIcon" class="icon-small" /> {{ formatDate(user.created_at) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { supabase } from '../lib/supabaseClient' 
import NavbarAdmin from '../components/NavbarAdmin.vue'

// Icons
import weightIcon from '../assets/icons/weight.svg'
import heightIcon from '../assets/icons/height.svg'
import calendarIcon from '../assets/icons/calendar.svg'
import profileIcon from '../assets/icons/profile.png'
import mail from '../assets/icons/mail.svg'

const users = ref([])
const searchQuery = ref('')
const loading = ref(true) // Tambahkan status loading

const fetchUsers = async () => {
  try {
    loading.value = true
  
    const { data, error } = await supabase.from('pengguna').select('*')
    
    if (error) throw error
    users.value = data
  } catch (err) {
    console.error('Error fetching users:', err.message)
  } finally {
    loading.value = false
  }
}

const filteredUsers = computed(() => {
  if (!users.value) return []
  return users.value.filter(u => 
    u.username?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })
}


onMounted(fetchUsers)
</script>

<style scoped>
.page-container { min-height: 100vh; background-color: #F9FAFB; }
.content-wrapper { max-width: 1200px; margin: 0 auto; padding: 2rem; }

.header h1 { font-size: 2rem; font-weight: 700; color: #111827; }
.header p { color: #6B7280; margin-bottom: 2rem; }

.search-container { position: relative; margin-bottom: 2rem; }
.search-input { width: 100%; padding: 1rem 1rem 1rem 3rem; border: 1px solid #E5E7EB; border-radius: 12px; }
.search-icon { position: absolute; left: 1rem; top: 1.2rem; color: #9CA3AF; }

.table-card { background: white; border-radius: 12px; border: 1px solid #E5E7EB; overflow: hidden; }
.users-table { width: 100%; border-collapse: collapse; }
.users-table th { background: #F9FAFB; padding: 1rem; text-align: left; font-size: 0.875rem; color: #4B5563; border-bottom: 1px solid #E5E7EB; }
.users-table td { padding: 1rem; border-bottom: 1px solid #E5E7EB; color: #374151; }

.user-cell { display: flex; align-items: center; gap: 0.75rem; font-weight: 600; }
.avatar { width: 32px; height: 32px; border-radius: 50%; }
.icon-small { width: 16px; height: 16px; margin-right: 4px; vertical-align: middle; }
.badge { padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 600; }
.male { background: #EFF6FF; color: #1E40AF; }
.female { background: #FDF2F8; color: #9D174D; }
</style>