<template>
  <div class="page-wrapper">
    <NavbarUser />

    <main class="profile-container">
      <div class="profile-header">
        <h1>Profile</h1>
        <p>Manage your personal information and goals</p>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="card main-card text-center">
        <p>Memuat data profil...</p>
      </div>

      <!-- Tampilan Jika User Null (Tidak ada sesi login) -->
      <div v-else-if="!userData" class="card main-card text-center">
        <h2>Tidak Ada Pengguna Aktif</h2>
        <p>Silakan login terlebih dahulu untuk melihat dan mengelola profil Anda.</p>
        <!-- Kamu bisa tambahkan tombol router.push('/login') di sini -->
      </div>

      <!-- Tampilan Profile (Jika data user tersedia) -->
      <div v-else>
        <div class="card main-card">
          <div class="card-actions">
            <button class="btn btn-orange" @click="goToCalculator">
              <img :src="calculator" alt="Calculator Icon" class="btn-icon" />
              Calculator
            </button>
            
            <button class="btn btn-green" @click="toggleEdit" :disabled="isSaving">
              <img :src="editProfile" alt="Edit Icon" class="btn-icon" />
              {{ isSaving ? 'Saving...' : (isEditing ? 'Save Profile' : 'Edit Profile') }}
            </button>
          </div>

          <div class="info-list">
            <div class="info-item">
              <div class="icon-box green-bg">
                <img :src="profile" alt="User" />
              </div>
              <div class="info-text">
                <span class="label">Username</span>
                <input v-if="isEditing" type="text" v-model="userData.username" class="edit-input" />
                <span v-else class="value">{{ userData.username }}</span>
              </div>
            </div>

            <div class="info-item">
              <div class="icon-box green-bg">
                <img :src="mail" alt="Mail" />
              </div>
              <div class="info-text">
                <span class="label">Email</span>
                <input v-if="isEditing" type="email" v-model="userData.email" class="edit-input" disabled title="Email biasanya tidak bisa diubah langsung" />
                <span v-else class="value">{{ userData.email }}</span>
              </div>
            </div>

            <div class="info-item">
              <div class="icon-box green-bg">
                <img :src="weight" alt="Weight" />
              </div>
              <div class="info-text">
                <span class="label">Weight (kg)</span>
                <input v-if="isEditing" type="number" v-model="userData.weight" class="edit-input" />
                <span v-else class="value">{{ userData.weight }} kg</span>
              </div>
            </div>

            <div class="info-item">
              <div class="icon-box green-bg">
                <img :src="height" alt="Height" />
              </div>
              <div class="info-text">
                <span class="label">Height (cm)</span>
                <input v-if="isEditing" type="number" v-model="userData.height" class="edit-input" />
                <span v-else class="value">{{ userData.height }} cm</span>
              </div>
            </div>

            <div class="info-item">
              <div class="icon-box green-bg">
                <img :src="date" alt="Date" />
              </div>
              <div class="info-text">
                <span class="label">Birth Date</span>
                <input v-if="isEditing" type="date" v-model="userData.birthDate" class="edit-input" />
                <span v-else class="value">{{ formattedBirthDate }}</span>
              </div>
            </div>

            <div class="info-item">
              <div class="icon-box green-bg">
                <img :src="profile" alt="Gender" />
              </div>
              <div class="info-text">
                <span class="label">Gender</span>
                <select v-if="isEditing" v-model="userData.gender" class="edit-input">
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                <span v-else class="value">{{ userData.gender || '-' }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="card goals-card">
          <h2>Nutrition Goals</h2>
          <div class="goals-grid">
            <div class="goal-item">
              <div class="icon-box orange-bg">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f39c12" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                </svg>
              </div>
              <div class="info-text">
                <span class="label">Target Calories</span>
                <div v-if="isEditing" class="edit-group">
                  <input type="number" v-model="userGoals.calories" class="edit-input goal-input" />
                  <span class="unit">cal/day</span>
                </div>
                <span v-else class="value">{{ userGoals.calories }} cal/day</span>
              </div>
            </div>

            <div class="goal-item">
              <div class="icon-box green-bg">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2ecc71" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                </svg>
              </div>
              <div class="info-text">
                <span class="label">Target Protein</span>
                <div v-if="isEditing" class="edit-group">
                  <input type="number" v-model="userGoals.protein" class="edit-input goal-input" />
                  <span class="unit">g/day</span>
                </div>
                <span v-else class="value">{{ userGoals.protein }} g/day</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../lib/supabaseClient' 

// Import Icons (Tetap sama)
import profile from '../assets/icons/profile.png'
import mail from '../assets/icons/mail.svg'
import weight from '../assets/icons/weight.svg'
import height from '../assets/icons/height.svg'
import date from '../assets/icons/calendar.svg'
import calculator from '../assets/icons/calculator.svg'
import editProfile from '../assets/icons/editProfile.svg'
import NavbarUser from '../components/NavbarUser.vue'

const router = useRouter()
const isEditing = ref(false)
const isLoading = ref(true)
const isSaving = ref(false)
const userData = ref(null)
const userGoals = ref({ target_kalori: 0, target_protein: 0 })

let authSubscription = null

// Fungsi ambil data dari Supabase
const fetchUserProfile = async (userId) => {
  if (!userId) {
    isLoading.value = false
    return
  }
  
  try {
    // Jangan set isLoading = true di sini agar tidak memicu flicker saat update data
    const { data, error } = await supabase
      .from('pengguna')
      .select('*')
      .eq('id_pengguna', userId)
      .single()

    if (error) throw error

    if (data) {
      userData.value = {
        id: data.id_pengguna,
        username: data.username,
        email: data.email,
        weight: data.berat_badan,
        height: data.tinggi_badan,
        birthDate: data.tanggal_lahir,
        gender: data.gender
      }
      userGoals.value = {
        calories: data.target_kalori || 0,
        protein: data.target_protein || 0
      }
    }
  } catch (err) {
    console.error("Gagal mengambil data profil:", err.message)
    userData.value = null
  } finally {
    // Pastikan loading dimatikan di sini, apapun hasilnya
    isLoading.value = false
  }
}

onMounted(async () => {
  // 1. Cek sesi saat ini
  const { data: { session } } = await supabase.auth.getSession()
  
  if (session?.user) {
    await fetchUserProfile(session.user.id)
  } else {
    // Jika tidak ada session, kita beri kesempatan listener auth
    // Tapi jika tetap tidak ada, loading dimatikan setelah 2 detik
    setTimeout(() => {
      if (isLoading.value) isLoading.value = false
    }, 2000)
  }

  // 2. Pasang Listener (Hanya satu kali)
  const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
    if (session?.user) {
      // Hanya fetch jika data lokal masih kosong
      if (!userData.value) {
        fetchUserProfile(session.user.id)
      }
    } else {
      userData.value = null
      isLoading.value = false
    }
  })
  authSubscription = subscription
})

onUnmounted(() => {
  if (authSubscription) authSubscription.unsubscribe()
})

const formattedBirthDate = computed(() => {
  if (!userData.value || !userData.value.birthDate) return '-'
  const [year, month, day] = userData.value.birthDate.split('-')
  return `${month}/${day}/${year}`
})

const saveUserProfile = async () => {
  if (!userData.value) return
  try {
    isSaving.value = true
    
    // Pastikan payload yang dikirim menggunakan nama kolom asli di DB (kiri)
    // dan mengambil nilai dari properti yang benar di Vue (kanan)
    const payload = {
      username: userData.value.username,
      berat_badan: userData.value.weight,    // Di fetch kamu pakai .weight
      tinggi_badan: userData.value.height,   // Di fetch kamu pakai .height
      tanggal_lahir: userData.value.birthDate, // Di fetch kamu pakai .birthDate
      gender: userData.value.gender,
      target_kalori: userGoals.value.calories, // Di fetch kamu pakai .calories
      target_protein: userGoals.value.protein  // Di fetch kamu pakai .protein
    }

    const { error } = await supabase
      .from('pengguna')
      .update(payload)
      .eq('id_pengguna', userData.value.id)

    if (error) throw error
    alert('Profil berhasil diperbarui!')
  } catch (error) {
    console.error('Error detail:', error)
    alert('Gagal menyimpan profil: ' + error.message)
  } finally {
    isSaving.value = false
  }
}

const toggleEdit = async () => {
  if (isEditing.value) {
    await saveUserProfile()
    isEditing.value = false
  } else {
    isEditing.value = true
  }
}

const goToCalculator = () => router.push('/calculator')
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