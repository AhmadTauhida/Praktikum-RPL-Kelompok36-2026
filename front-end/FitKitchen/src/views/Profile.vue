<template>
  <NavbarUser />
  <div class="page-wrapper">
    <div class="profile-container" v-if="profile">
      <!-- Header -->
      <div class="profile-header">
        <h1>Profile</h1>
        <p>Manage your personal information and goals</p>
      </div>

      <!-- Informasi Pribadi -->
      <div class="card">
        <div class="card-actions">
          <button @click="goToCalculator" class="btn btn-orange">
            <img :src="iconCalculator" class="btn-icon" /> Calculator
          </button>
          <button @click="toggleEdit" class="btn btn-green">
            <img :src="iconEdit" class="btn-icon" /> 
            {{ isEditing ? 'Save Profile' : 'Edit Profile' }}
          </button>
        </div>

        <div class="info-list">
          <!-- Username -->
          <div class="info-item">
            <div class="icon-box green-bg"><img :src="iconProfile" /></div>
            <div class="info-text">
              <span class="label">Username</span>
              <input v-if="isEditing" v-model="profile.username" class="edit-input" />
              <span v-else class="value">{{ profile.username }}</span>
            </div>
          </div>

          <!-- Email -->
          <div class="info-item">
            <div class="icon-box green-bg"><img :src="iconMail" /></div>
            <div class="info-text">
              <span class="label">Email</span>
              <span class="value">{{ profile.email }}</span>
            </div>
          </div>

          <!-- Weight -->
          <div class="info-item">
            <div class="icon-box green-bg"><img :src="iconWeight" /></div>
            <div class="info-text">
              <span class="label">Weight (kg)</span>
              <div v-if="isEditing" class="edit-group">
                <input type="number" v-model="profile.berat_badan" class="edit-input goal-input" />
                <span class="unit">kg</span>
              </div>
              <span v-else class="value">{{ profile.berat_badan || '-' }} kg</span>
            </div>
          </div>

          <!-- Height -->
          <div class="info-item">
            <div class="icon-box green-bg"><img :src="iconHeight" /></div>
            <div class="info-text">
              <span class="label">Height (cm)</span>
              <div v-if="isEditing" class="edit-group">
                <input type="number" v-model="profile.tinggi_badan" class="edit-input goal-input" />
                <span class="unit">cm</span>
              </div>
              <span v-else class="value">{{ profile.tinggi_badan || '-' }} cm</span>
            </div>
          </div>

          <!-- Birth Date -->
          <div class="info-item">
            <div class="icon-box green-bg"><img :src="iconDate" /></div>
            <div class="info-text">
              <span class="label">Birth Date</span>
              <input v-if="isEditing" type="date" v-model="profile.tanggal_lahir" class="edit-input" />
              <span v-else class="value">{{ formattedBirthDate }}</span>
            </div>
          </div>
        </div>
        <!-- Informasi Gender -->
       <div class="info-item" style="margin-top: 1.5rem;">
          <div class="icon-box green-bg"><img :src="iconProfile" /></div>
          <div class="info-text">
            <span class="label">Gender</span>
            <span class="value">{{ profile.gender || '-' }}</span>
          </div>
        </div>

      </div>

      <!-- Nutrition Goals -->
      <div class="card goals-card">
        <h2>Nutrition Goals</h2>
        <div class="goals-grid">
          <div class="goal-item">
            <div class="icon-box orange-bg"><img :src="caloriesIcon" /></div>
            <div class="info-text">
              <span class="label">Target Calories</span>
              <span class="value">{{ profile.target_kalori || 'Belum diatur' }} cal/day</span>
            </div>
          </div>
          <div class="goal-item">
            <div class="icon-box green-bg"><img :src="proteinIcon" /></div>
            <div class="info-text">
              <span class="label">Target Protein</span>
              <span class="value">{{ profile.target_protein || 'Belum diatur' }} g/day</span>
            </div>
          </div>
        </div>
      </div>
     
    </div>

    <div v-else class="text-center" style="margin-top: 5rem;">
      <p>Memuat data profil...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

// Import Icons (Diberi prefix 'icon' agar tidak bentrok dengan nama variabel data)
import iconProfile from '../assets/icons/profile.png'
import iconMail from '../assets/icons/mail.svg'
import iconWeight from '../assets/icons/weight.svg'
import iconHeight from '../assets/icons/height.svg'
import iconDate from '../assets/icons/calendar.svg'
import iconCalculator from '../assets/icons/calculator.svg'
import iconEdit from '../assets/icons/editProfile.svg'
import NavbarUser from '../components/NavbarUser.vue'
import proteinIcon from '../assets/icons/protein.svg'
import caloriesIcon from '../assets/icons/Calori.svg'

const router = useRouter()
const profile = ref(null)
const isEditing = ref(false)

// 1. Fungsi Ambil Data dari Backend
const fetchProfile = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/pengguna/profile')
    if (response.data.success) {
      profile.value = response.data.data
    }
  } catch (error) {
    console.error("Gagal memuat profil:", error)
  }
}

// 2. Format Tanggal Lahir (MM/DD/YYYY)
const formattedBirthDate = computed(() => {
  if (!profile.value?.tanggal_lahir) return '-'
  const date = new Date(profile.value.tanggal_lahir)
  return date.toLocaleDateString('en-US')
})

// 3. Logika Edit (Placeholder untuk integrasi updateProfile)
const toggleEdit = async () => {
  if (isEditing.value) {
    try {
      await axios.put('http://localhost:3000/api/pengguna/profile', profile.value)
      isEditing.value = false
      alert('Profil berhasil diperbarui!')
    } catch (error) {
      alert('Gagal menyimpan perubahan')
    }
  } else {
    isEditing.value = true
  }
}

const goToCalculator = () => router.push('/calculator')

onMounted(fetchProfile)
</script>

<style scoped>
/* Reset & Base Variables */
.page-wrapper {
  background-color: #fafbfc;
  min-height: 100vh;
  padding-bottom: 3rem;
}

.profile-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

/* Header Typography */
.profile-header {
  margin-bottom: 2rem;
}

.profile-header h1 {
  font-size: 1.8rem;
  color: #1a1a1a;
  margin-bottom: 0.25rem;
  font-weight: 700;
}

.profile-header p {
  color: #888;
  font-size: 1rem;
  margin: 0;
}

/* Helper Class */
.text-center {
  text-align: center;
}

/* Card Styling */
.card {
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #eaeaea;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
  margin-bottom: 1.5rem;
}

/* Buttons */
.card-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-bottom: 2rem;
}

.btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  border: none;
  cursor: pointer;
  transition: opacity 0.2s ease;
  color: white;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn:hover:not(:disabled) {
  opacity: 0.9;
}

.btn-icon {
  width: 18px;
  height: 18px;
  filter: brightness(0) invert(1);
}

.btn-orange {
  background-color: #f39c12;
}

.btn-green {
  background-color: #2ecc71;
}

/* Profile Information List */
.info-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

/* Icon Boxes */
.icon-box {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-box img {
  width: 24px;
  height: 24px;
}

.green-bg {
  background-color: #e8f8f5;
  color: #2ecc71;
}

.green-bg img {
  filter: invert(56%) sepia(50%) saturate(468%) hue-rotate(94deg) brightness(94%) contrast(89%);
}

.orange-bg {
  background-color: #fdf2e9;
}

/* Text Detail & Inputs */
.info-text {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.info-text .label {
  font-size: 0.85rem;
  color: #888;
  font-weight: 500;
  margin-bottom: 0.2rem;
}

.info-text .value {
  font-size: 1.05rem;
  color: #222;
  font-weight: 600;
}

/* Styling untuk mode edit secara umum */
.edit-input {
  width: 100%;
  max-width: 300px;
  padding: 6px 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  color: #333;
  transition: border-color 0.3s;
}

.edit-input:focus {
  outline: none;
  border-color: #2ecc71;
  box-shadow: 0 0 0 2px rgba(46, 204, 113, 0.1);
}

.edit-input:disabled {
  background-color: #f0f0f0;
  cursor: not-allowed;
}

/* Styling khusus untuk input Nutrition Goals */
.edit-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.goal-input {
  max-width: 100px;
}

.unit {
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
}

/* Goals Card Typography */
.goals-card h2 {
  font-size: 1.25rem;
  color: #1a1a1a;
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-weight: 700;
}

.goals-grid {
  display: flex;
  gap: 3rem;
}

.goal-item {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

/* Responsiveness (Mobile View) */
@media (max-width: 600px) {
  .profile-container {
    padding: 1.5rem 1rem;
  }
  
  .card {
    padding: 1.5rem;
  }

  .card-actions {
    flex-direction: column;
    align-items: flex-start;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }

  .goals-grid {
    flex-direction: column;
    gap: 1.5rem;
  }

  .edit-input {
    max-width: 100%;
  }
}
</style>