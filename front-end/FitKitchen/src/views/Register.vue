<template>
  <div class="auth-container">
    <div class="auth-header">
      <div class="logo-wrapper">
        <img :src="logo" alt="FitKitchen Logo" class="auth-logo" />
      </div>
      <h1>Create Your Account</h1>
      <p>Join FitKitchen and start your healthy journey</p>
    </div>

    <div class="auth-card">
      <form @submit.prevent="handleRegister">
        <div class="form-row-2">
          <div class="form-group">
            <label for="username">Username</label>
            <div class="input-wrapper">
               <img :src="profileIcon" alt="Profile" class="icon" />
              <input 
                type="text" 
                id="username" 
                v-model="form.username" 
                placeholder="John Doe" 
                required 
              />
            </div>
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <div class="input-wrapper">
               <img :src="mail" alt="Mail Icon" class="icon" />
              <input 
                type="email" 
                id="email" 
                v-model="form.email" 
                @blur="validateEmail"
                :class="{ 'input-error': emailError }"
                placeholder="your@email.com" 
                required 
              />
            </div>
            <span v-if="emailError" class="error-text">{{ emailError }}</span>
          </div>
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <div class="input-wrapper">
             <img :src="lock" alt="Lock Icon" class="icon" />
            <input 
              :type="showPassword ? 'text' : 'password'" 
              id="password" 
              v-model="form.password" 
              :class="{ 'input-error': !isPasswordValid && form.password.length > 0 }"
              placeholder="••••••••" 
              required 
            />
            <button 
              type="button" 
              class="toggle-password" 
              @click="showPassword = !showPassword"
            >
              {{ showPassword ? '👁️' : '🙈' }}
            </button>
          </div>
          
          <ul class="password-criteria" v-if="form.password.length > 0">
            <li :class="passwordRules.length ? 'valid' : 'invalid'">
              {{ passwordRules.length ? '✓' : '✗' }} Minimal 8 karakter
            </li>
            <li :class="passwordRules.capital ? 'valid' : 'invalid'">
              {{ passwordRules.capital ? '✓' : '✗' }} Mengandung huruf kapital
            </li>
            <li :class="passwordRules.number ? 'valid' : 'invalid'">
              {{ passwordRules.number ? '✓' : '✗' }} Mengandung angka
            </li>
            <li :class="passwordRules.symbol ? 'valid' : 'invalid'">
              {{ passwordRules.symbol ? '✓' : '✗' }} Mengandung simbol (!@#$%^&*)
            </li>
            <li :class="passwordRules.noSpace ? 'valid' : 'invalid'">
              {{ passwordRules.noSpace ? '✓' : '✗' }} Tidak mengandung spasi
            </li>
          </ul>
        </div>

        <div class="form-row-3">
          <div class="form-group">
            <label for="weight">Weight (kg)</label>
            <div class="input-wrapper">
               <img :src="weightIcon" alt="Weight Icon" class="icon" />
              <input 
                type="number" 
                id="weight" 
                v-model="form.weight" 
                placeholder="70" 
                required 
              />
            </div>
          </div>

          <div class="form-group">
            <label for="height">Height (cm)</label>
            <div class="input-wrapper">
               <img :src="heightIcon" alt="Height Icon" class="icon" />
              <input 
                type="number" 
                id="height" 
                v-model="form.height" 
                placeholder="170" 
                required 
              />
            </div>
          </div>

          <div class="form-group">
            <label for="birthdate">Birth Date</label>
            <div class="input-wrapper">
               <img :src="calendarIcon" alt="Calendar Icon" class="icon" />
              <input 
                type="date" 
                id="birthdate" 
                v-model="form.birthDate" 
                required 
              />
            </div>
          </div>
        </div>

        <div class="form-group">
          <label for="gender">Gender</label>
          <select id="gender" v-model="form.gender" class="form-select" required>
            <option value="" disabled selected></option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <button type="submit" class="btn-auth" :disabled="!isFormValid">Sign Up</button>
      </form>

      <div class="auth-footer">
        <p>Already have an account? <router-link to="/login" class="link-auth">Login</router-link></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import logo from '../assets/icons/logo.png'
import mail from '../assets/icons/mail.svg'
import lock from '../assets/icons/lock.svg'
import weightIcon from '../assets/icons/weight.svg'
import heightIcon from '../assets/icons/height.svg'
import calendarIcon from '../assets/icons/calendar.svg'
import profileIcon from '../assets/icons/profile.png'


const router = useRouter()

const showPassword = ref(false)

const form = ref({
  username: '',
  email: '',
  password: '',
  weight: '',
  height: '',
  birthDate: '',
  gender: ''
})

const emailError = ref('')

const validateEmail = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!form.value.email) {
    emailError.value = ''
  } else if (!emailRegex.test(form.value.email)) {
    emailError.value = 'Format email tidak valid (contoh: john@gmail.com)'
  } else {
    emailError.value = ''
  }
}

const passwordRules = computed(() => {
  const p = form.value.password
  return {
    length: p.length >= 8,
    capital: /[A-Z]/.test(p),
    number: /[0-9]/.test(p),
    symbol: /[!@#$%^&*(),.?":{}|<>]/.test(p),
    noSpace: p.length > 0 && !/\s/.test(p)
  }
})

const isPasswordValid = computed(() => {
  const r = passwordRules.value
  return r.length && r.capital && r.number && r.symbol && r.noSpace
})

const isFormValid = computed(() => {
  return (
    form.value.username &&
    form.value.email &&
    !emailError.value &&
    isPasswordValid.value &&
    form.value.weight &&
    form.value.height &&
    form.value.birthDate &&
    form.value.gender
  )
})

const handleRegister = () => {
  validateEmail() 
  
  if (isFormValid.value) {
    router.push('/login')
  }
}
</script>

<style scoped>
.auth-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #ffffff;
  padding: 2rem 1rem;
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
}

.logo-wrapper {
  background-color: #2ecc71;
  width: 80px;
  height: 80px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
}

.auth-logo {
  width: 50px;
  height: auto;
  filter: brightness(0) invert(1);
}

.auth-header h1 {
  font-size: 2rem;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
  font-weight: 700;
}

.auth-header p {
  color: #666;
  font-size: 1rem;
}

.auth-card {
  background: white;
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 600px;
  border: 1px solid #f0f0f0;
}

.form-row-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-row-3 {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

/* PERBAIKAN CSS ICON: Memberikan dimensi yang seragam agar gambar tidak merusak layout */
.input-wrapper .icon {
  position: absolute;
  left: 12px;
  width: 20px;
  height: auto;
  opacity: 0.6; /* Membuat icon sedikit lebih transparan/abu-abu agar lebih elegan */
}

.input-wrapper input {
  width: 100%;
  padding: 12px 45px 12px 40px;
  border: 1px solid #eee;
  border-radius: 10px;
  background-color: #f9f9f9;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.toggle-password {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  transition: color 0.3s;
}

.toggle-password:hover {
  color: #2ecc71; 
}

.form-select {
  width: 100%;
  padding: 12px;
  border: 1px solid #eee;
  border-radius: 10px;
  background-color: #f9f9f9;
  font-size: 1rem;
  transition: all 0.3s ease;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1em;
}

.input-wrapper input:focus,
.form-select:focus {
  outline: none;
  border-color: #2ecc71;
  background-color: #fff;
  box-shadow: 0 0 0 3px rgba(46, 204, 113, 0.1);
}

.input-error {
  border-color: #e74c3c !important;
  background-color: #fdf2f2 !important;
}

.error-text {
  color: #e74c3c;
  font-size: 0.8rem;
  margin-top: 0.25rem;
  display: block;
}

.password-criteria {
  list-style: none;
  padding: 0;
  margin: 0.75rem 0 0 0;
  font-size: 0.85rem;
  background-color: #f9f9f9;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #eee;
}

.password-criteria li {
  margin-bottom: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.password-criteria li.valid {
  color: #2ecc71;
}

.password-criteria li.invalid {
  color: #e74c3c;
}

.btn-auth {
  width: 100%;
  padding: 14px;
  background-color: #2ecc71;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 1rem;
}

.btn-auth:hover {
  background-color: #27ae60;
}

.btn-auth:disabled {
  background-color: #95a5a6;
  cursor: not-allowed;
  opacity: 0.7;
}

.auth-footer {
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.9rem;
  color: #666;
}

.link-auth {
  color: #2ecc71;
  text-decoration: none;
  font-weight: 600;
}

.link-auth:hover {
  text-decoration: underline;
}

@media (max-width: 600px) {
  .form-row-2,
  .form-row-3 {
    grid-template-columns: 1fr;
    gap: 0;
  }
}
</style>