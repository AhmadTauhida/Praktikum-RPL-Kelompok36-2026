<script setup>
import { ref } from 'vue'

// Reactive state
const count = ref(0)

// Function logic
function increment() {
  count.value++
}
</script>

<template>
<<<<<<< HEAD
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

=======
  <div class="container">
    <h1>Count is: {{ count }}</h1>
    <button @click="increment">Increment</button>
  </div>
</template>

>>>>>>> parent of 6863edc (Feat : useManagement)
<style scoped>
.container {
  text-align: center;
  margin-top: 2rem;
}
</style>
