<template>
  <div class="login-container">
    <div class="login-header">
      <div class="logo-wrapper">
        <img :src="logo" alt="FitKitchen Logo" class="login-logo" />
      </div>
      <h1>Welcome to FitKitchen</h1>
      <p>Sign in to access healthy recipes</p>
    </div>

    <div class="login-card">
      <form @submit.prevent="handleLogin">
        
        <div v-if="loginError" class="alert-error">
          {{ loginError }}
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <div class="input-wrapper">
            <img :src="mail" alt="Mail Icon" class="icon" />
            <input 
              type="email" 
              id="email" 
              v-model="email" 
              @blur="validateEmail"
              :class="{ 'input-error': emailError }"
              placeholder="your@email.com" 
              required 
            />
          </div>
          <span v-if="emailError" class="error-text">{{ emailError }}</span>
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <div class="input-wrapper">
            <img :src="lock" alt="Lock Icon" class="icon" />
            <input 
              :type="showPassword ? 'text' : 'password'" 
              id="password" 
              v-model="password" 
              placeholder="••••••••" 
              required 
            />
            <button 
                type="button" 
                class="toggle-password" 
                @click="showPassword = !showPassword"
            >
              <img v-if="showPassword" :src="eye" alt="Eye Icon" class="icon-eye" />
              <img v-else :src="eyesoff" alt="Eye Off Icon" class="icon-eye" />
            </button>
          </div>
        </div>

        <button type="submit" class="btn-login" :disabled="!isFormValid || loading">
          {{ loading ? 'Verifying...' : 'Log In' }}
        </button>
      </form>

      <div class="login-footer">
        <p>Don't have an account? <router-link to="/register" class="signup-link">Sign Up</router-link></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../lib/supabaseClient' // Pastikan path import ini benar

// Import Icons
import logo from '../assets/icons/logo.png'
import mail from '../assets/icons/mail.svg'
import lock from '../assets/icons/lock.svg'
import eye from '../assets/icons/eye.svg'
import eyesoff from '../assets/icons/eye-off.svg'

const email = ref('')
const password = ref('')
const emailError = ref('')
const loginError = ref('') // Untuk menangkap pesan error dari Supabase
const showPassword = ref(false)
const loading = ref(false) // Indikator proses login

const router = useRouter()

// Fungsi Validasi Format Email
const validateEmail = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email.value) {
    emailError.value = ''
  } else if (!emailRegex.test(email.value)) {
    emailError.value = 'Format email tidak valid (contoh: john@gmail.com)'
  } else {
    emailError.value = ''
  }
}

const isFormValid = computed(() => {
  return email.value && password.value && !emailError.value
})

const handleLogin = async () => {
  validateEmail() 
  if (!isFormValid.value) return

  try {
    loading.value = true
    loginError.value = ''

    // 1. Login via Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    })

    if (authError) throw authError

    const userId = authData.user.id

    // 2. Cek apakah ini Admin
    const { data: adminData } = await supabase
      .from('admin')
      .select('role')
      .eq('id_admin', userId)
      .maybeSingle()

    if (adminData) {
      localStorage.setItem('userRole', adminData.role || 'admin')
      router.push('/admin')
      return // Selesai
    }

    // 3. JIKA BUKAN ADMIN: Cek apakah data ada di tabel 'pengguna'
    const { data: userData, error: userTableError } = await supabase
      .from('pengguna')
      .select('username')
      .eq('id_pengguna', userId)
      .maybeSingle()

    if (userTableError) throw userTableError

    if (!userData) {
      // Kasus: Akun ada di Auth, tapi baris data di tabel 'pengguna' hilang
      // Ini yang bikin Profile.vue kamu null/kosong
      throw new Error('Data profil pengguna tidak ditemukan di database.')
    }

    // 4. Jika semua oke, baru arahkan ke home
    localStorage.setItem('userRole', 'user')
    router.push('/')

  } catch (error) {
    console.error('Login Error:', error.message)
    loginError.value = error.message 
    // Jika gagal, sebaiknya paksa logout dari auth agar sesi tidak menggantung
    await supabase.auth.signOut()
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Tambahan styling untuk pesan error Supabase */
.alert-error {
  background-color: #fdf2f2;
  color: #e74c3c;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid #fadcdc;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
  text-align: center;
  font-weight: 500;
}

/* Sisa style tetap sama persis seperti kode aslimu */
.login-container { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; background-color: #ffffff; }
.login-header { text-align: center; margin-bottom: 2rem; }
.logo-wrapper { background-color: #2ecc71; width: 80px; height: 80px; border-radius: 20px; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; }
.login-logo { width: 50px; height: auto; filter: brightness(0) invert(1); }
.login-header h1 { font-size: 2rem; color: #1a1a1a; margin-bottom: 0.5rem; font-weight: 700; }
.login-header p { color: #666; font-size: 1rem; }
.login-card { background: white; padding: 2.5rem; border-radius: 16px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05); width: 100%; max-width: 450px; border: 1px solid #f0f0f0; }
.form-group { margin-bottom: 1.5rem; }
.form-group label { display: block; font-size: 0.9rem; font-weight: 600; color: #333; margin-bottom: 0.5rem; }
.icon-eye { width: 20px; height: auto; opacity: 0.6; transition: opacity 0.3s; }
.toggle-password:hover .icon-eye { opacity: 1; }
.input-wrapper { position: relative; display: flex; align-items: center; }
.input-wrapper .icon { position: absolute; left: 12px; width: 20px; height: auto; color: #999; }
.input-wrapper input { width: 100%; padding: 12px 45px 12px 40px; border: 1px solid #eee; border-radius: 10px; background-color: #f9f9f9; font-size: 1rem; transition: all 0.3s ease; }
.input-wrapper input:focus { outline: none; border-color: #2ecc71; background-color: #fff; box-shadow: 0 0 0 3px rgba(46, 204, 113, 0.1); }
.toggle-password { position: absolute; right: 12px; background: none; border: none; cursor: pointer; font-size: 1.2rem; padding: 0; display: flex; align-items: center; justify-content: center; color: #999; transition: color 0.3s; }
.toggle-password:hover { color: #2ecc71; }
.input-error { border-color: #e74c3c !important; background-color: #fdf2f2 !important; }
.error-text { color: #e74c3c; font-size: 0.8rem; margin-top: 0.25rem; display: block; }
.btn-login { width: 100%; padding: 14px; background-color: #2ecc71; color: white; border: none; border-radius: 12px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: all 0.3s ease; margin-top: 1rem; }
.btn-login:hover { background-color: #27ae60; }
.btn-login:disabled { background-color: #95a5a6; cursor: not-allowed; opacity: 0.7; }
.login-footer { margin-top: 1.5rem; text-align: center; font-size: 0.9rem; color: #666; }
.signup-link { color: #2ecc71; text-decoration: none; font-weight: 600; }
.signup-link:hover { text-decoration: underline; }
</style>