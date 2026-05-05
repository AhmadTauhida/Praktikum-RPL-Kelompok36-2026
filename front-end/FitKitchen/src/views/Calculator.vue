<template>
  <div class="calculator-page bg-gray-50 min-h-screen">
    <NavbarUser />

    <main class="container">
      <div class="header">
        <h1>Macro Calculator</h1>
        <p>Calculate your personalized daily macro</p>
      </div>

      <div class="grid-layout">
        <!-- FORM KIRI -->
        <div class="card left-card">
          <h2>Your Information</h2>

          <!-- Biological Sex -->
          <div class="input-group">
            <label><img :src="iconProfile" alt="Profile" class="icon" /> Biological Sex</label>
            <div class="row-options">
              <div 
                class="option-box flex-center" 
                :class="{ active: form.sex === 'male' }"
                @click="form.sex = 'male'"
              >
                <img :src="iconMale" alt="Male" class="icon-large" />
                <span>Male</span>
              </div>
              <div 
                class="option-box flex-center" 
                :class="{ active: form.sex === 'female' }"
                @click="form.sex = 'female'"
              >
                <img :src="iconFemale" alt="Female" class="icon-large" />
                <span>Female</span>
              </div>
            </div>
          </div>

          <!-- Age & Body Metrics -->
          <div class="input-group">
            <label><img :src="iconCalendar" alt="Age" class="icon" /> Age</label>
            <input type="number" v-model="form.age" placeholder="Enter your age" />
          </div>

          <div class="input-group">
            <label><img :src="iconHeight" alt="Height" class="icon" /> Height (cm)</label>
            <input type="number" v-model="form.height" placeholder="e.g., 175" />
          </div>

          <div class="input-group">
             <label><img :src="iconWeight" alt="Current Weight" class="icon" /> Current Weight (kg)</label>
            <input type="number" v-model="form.currentWeight" placeholder="e.g., 70" />
          </div>

          <div class="input-group">
            <label><img :src="iconTarget" alt="Target Weight" class="icon" /> Target Weight (kg)</label>
            <input type="number" v-model="form.targetWeight" placeholder="e.g., 65" />
          </div>

          <!-- Main Goal -->
          <div class="input-group">
            <label>Main Goal</label>
            <div class="row-options">
              <div 
                class="option-box flex-center" 
                :class="{ active: form.goal === 'lose' }"
                @click="form.goal = 'lose'"
              >
                <img :src="iconLose" alt="Lose" class="icon-medium" />
                <span>Lose</span>
              </div>
              <div 
                class="option-box flex-center" 
                :class="{ active: form.goal === 'maintain' }"
                @click="form.goal = 'maintain'"
              >
                <img :src="iconMaintain" alt="Maintain" class="icon-medium" />
                <span>Maintain</span>
              </div>
              <div 
                class="option-box flex-center" 
                :class="{ active: form.goal === 'gain' }"
                @click="form.goal = 'gain'"
              >
                <img :src="iconGain" alt="Gain" class="icon-medium" />
                <span>Gain</span>
              </div>
            </div>
          </div>

          <!-- Activity Level (Kembali Hadir) -->
          <div class="input-group">
            <label><img :src="iconActivity" alt="Activity" class="icon" /> Activity Level</label>
            <div class="col-options">
              <div 
                v-for="level in activityLevels" 
                :key="level.value"
                class="option-box list-box"
                :class="{ active: form.activity === level.value }"
                @click="form.activity = level.value"
              >
                <strong>{{ level.title }}</strong>
                <small>{{ level.desc }}</small>
              </div>
            </div>
          </div>

          <button class="btn-primary" @click="calculateMacros" :disabled="isLoading">
            {{ isLoading ? 'Loading...' : 'Calculate My Macros' }}
          </button>
        </div>

        <!-- HASIL KANAN -->
        <div class="card right-card">
          <div v-if="!isCalculated" class="empty-state">
            <div class="icon-circle gray">
              <img :src="iconCalories" alt="Calories" class="icon-xl" />
            </div>
            <h3>Your Results Will Appear Here</h3>
            <p>Fill in all the fields on the left and click "Calculate My Macros" to see your personalized nutrition targets</p>
          </div>

          <div v-else class="result-state">
            <div class="icon-circle green">
              <img :src="iconResults" alt="Results" class="icon-xl" />
            </div>
            <h3>Your Personalized Macros</h3>
            <p class="subtitle">Based on your {{ form.goal }} goal</p>

            <div class="result-box calories-box">
              <span>Daily Calories</span>
              <h2>{{ results.calories }}</h2>
              <small>kcal</small>
            </div>

            <div class="result-box protein-box">
              <span>Protein</span>
              <h2>{{ results.protein }}g</h2>
              <small>{{ results.proteinPercent }}% of calories</small>
            </div>

            <div class="tips-box">
              <h4><img :src="iconTips" alt="Tips" class="icon" /> Tips for Success</h4>
              <ul>
                <li v-for="(tip, index) in results.tips" :key="index">{{ tip }}</li>
              </ul>
            </div>

            <button class="btn-secondary" @click="resetCalculator">Calculate Again</button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import NavbarUser from '../components/NavbarUser.vue';

// Alias Icon Imports untuk menghindari konflik penamaan
import iconProfile from '../assets/icons/profile.svg';
import iconCalendar from '../assets/icons/calendar.svg';
import iconResults from '../assets/icons/results.svg';
import iconCalories from '../assets/icons/calori.svg';
import iconWeight from '../assets/icons/weight.svg';
import iconHeight from '../assets/icons/height.svg';
import iconTarget from '../assets/icons/target.svg';
import iconActivity from '../assets/icons/activity.svg';
import iconLose from '../assets/icons/lose.svg';
import iconMaintain from '../assets/icons/maintain.svg';
import iconGain from '../assets/icons/gain.svg';
import iconMale from '../assets/icons/male.svg';
import iconFemale from '../assets/icons/female.svg';
import iconTips from '../assets/icons/tips.svg';

const isCalculated = ref(false);
const isLoading = ref(false);

const form = ref({
  sex: '',
  age: '',
  height: '',
  currentWeight: '',
  targetWeight: '',
  goal: '',
  activity: ''
});

const results = ref({
  calories: 0,
  protein: 0,
  proteinPercent: 0,
  bmi: 0,
  tips: [] 
});

const activityLevels = [
  { title: 'Sedentary', desc: 'Little or no exercise', value: 1.2 },
  { title: 'Lightly Active', desc: 'Exercise 1-3 times/week', value: 1.375 },
  { title: 'Moderately Active', desc: 'Exercise 4-5 times/week', value: 1.55 },
  { title: 'Very Active', desc: 'Intense exercise 6-7 times/week', value: 1.725 },
  { title: 'Extra Active', desc: 'Very intense exercise daily or physical job', value: 1.9 }
];

// --- FUNGSI IMPORT DATA BIOLOGIS ---
const fetchUserData = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get('http://localhost:3000/api/pengguna/profile');
    if (response.data.success) {
      const user = response.data.data;
      form.value.sex = user.gender || '';
      form.value.height = user.tinggi_badan || '';
      form.value.currentWeight = user.berat_badan || '';
      
      if (user.tanggal_lahir) {
        const birthDate = new Date(user.tanggal_lahir);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        form.value.age = age;
      }
    }
  } catch (error) {
    console.error("Gagal memuat data profil:", error);
  } finally {
    isLoading.value = false;
  }
};

const generateTipsByBMI = (bmi) => {
  if (bmi < 18.5) return ["Fokus pada surplus kalori nutrisi padat.", "Lakukan strength training.", "Makan porsi kecil namun sering."];
  if (bmi < 25) return ["Pertahankan keseimbangan kalori.", "Fokus pada variasi makanan utuh.", "Jaga hidrasi dan kualitas tidur."];
  if (bmi < 30) return ["Terapkan defisit kalori moderat (300-500 kcal).", "Tingkatkan asupan protein dan serat.", "Tingkatkan NEAT harian."];
  return ["Konsultasikan dengan ahli gizi.", "Olahraga low-impact.", "Ganti minuman manis dengan air putih."];
};

// --- FUNGSI PERHITUNGAN & EKSPORT DATA ---
const calculateMacros = async () => {
  if (!form.value.sex || !form.value.age || !form.value.height || !form.value.currentWeight || !form.value.activity || !form.value.goal) {
    alert("Mohon isi semua data terlebih dahulu.");
    return;
  }

  // 1. Hitung BMR (Mifflin-St Jeor Equation)
  let bmr = (10 * form.value.currentWeight) + (6.25 * form.value.height) - (5 * form.value.age);
  bmr = form.value.sex === 'male' ? bmr + 5 : bmr - 161;

  // 2. Hitung TDEE
  let tdee = bmr * parseFloat(form.value.activity);

  // 3. Adjustment Berdasarkan Goal
  if (form.value.goal === 'lose') tdee -= 500;
  else if (form.value.goal === 'gain') tdee += 500;

  const finalCalories = Math.round(tdee);
  const finalProtein = Math.round(form.value.currentWeight * 2); // 2g per kg berat badan
  
  // 4. Update UI Results
  results.value.calories = finalCalories;
  results.value.protein = finalProtein;
  results.value.proteinPercent = Math.round(((finalProtein * 4) / finalCalories) * 100);
  
  const heightInMeters = form.value.height / 100;
  const bmi = form.value.currentWeight / (heightInMeters * heightInMeters);
  results.value.tips = generateTipsByBMI(bmi);

  // 5. SIMPAN KE DATABASE (EKSPORT)
  try {
    isLoading.value = true;
    await axios.put('http://localhost:3000/api/pengguna/profile', {
      target_kalori: finalCalories,
      target_protein: finalProtein
    });
    isCalculated.value = true;
  } catch (error) {
    alert("Kalkulasi berhasil, tapi gagal menyimpan ke database.");
  } finally {
    isLoading.value = false;
  }
};

const resetCalculator = () => {
  isCalculated.value = false;
};

onMounted(fetchUserData);
</script>



<style scoped>
.bg-gray-50 {
  background-color: #fafafa;
}

.min-h-screen {
  min-height: 100vh;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.header {
  text-align: center;
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.5rem;
}

.header p {
  color: #6b7280;
}

.grid-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

@media (min-width: 768px) {
  .grid-layout {
    grid-template-columns: 1fr 1fr;
  }
}

.card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
}

.left-card h2 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #111827;
}

.input-group {
  margin-bottom: 1.25rem;
}

.input-group label {
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

input[type="number"] {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

input[type="number"]:focus {
  border-color: #22c55e;
}

.row-options {
  display: flex;
  gap: 1rem;
}

.row-options .option-box {
  flex: 1;
  text-align: center;
}

.col-options {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.option-box {
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
  background-color: white;
}

.option-box:hover {
  border-color: #9ca3af;
}

.option-box.active {
  border-color: #22c55e;
  background-color: #f0fdf4;
}

.flex-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.list-box {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.list-box strong {
  font-size: 0.875rem;
  color: #111827;
}

.list-box small {
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

.btn-primary {
  width: 100%;
  background-color: #f3f4f6;
  color: #9ca3af;
  padding: 1rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 1rem;
}

.btn-primary:hover, .btn-primary:active {
  background-color: #22c55e;
  color: white;
}

.icon {
  width: 18px;
  height: 18px;
  margin-right: 8px;
}

.icon-medium {
  width: 24px;
  height: 24px;
}

.icon-large {
  width: 32px;
  height: 32px;
}

.icon-xl {
  width: 40px;
  height: 40px;
}

.right-card {
  display: flex;
  flex-direction: column;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 100%;
  padding: 2rem;
}

.icon-circle {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.icon-circle.gray {
  background-color: #f3f4f6;
}

.icon-circle.green {
  background-color: #dcfce7;
}

.empty-state h3 {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.5;
}

.result-state {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.result-state h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.subtitle {
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
}

.result-box {
  width: 100%;
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 1rem;
  text-align: left;
}

.calories-box {
  background: linear-gradient(135deg, #ffedd5 0%, #fffaf0 100%);
  border: 1px solid #fed7aa;
}

.protein-box {
  background-color: #f3f4f6;
  border: 1px solid #e5e7eb;
}

.result-box span {
  font-size: 0.875rem;
  color: #4b5563;
}

.result-box h2 {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0.5rem 0 0.25rem 0;
  color: #111827;
}

.result-box small {
  font-size: 0.875rem;
  color: #6b7280;
}

.tips-box {
  width: 100%;
  background-color: #fff7ed;
  border: 1px solid #ffedd5;
  border-radius: 12px;
  padding: 1.25rem;
  margin-bottom: 1.5rem;
}

.tips-box h4 {
  font-weight: 600;
  color: #9a3412;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
}

.tips-box ul {
  list-style-type: disc;
  padding-left: 1.5rem;
  margin: 0;
}

.tips-box li {
  font-size: 0.875rem;
  color: #78350f;
  margin-bottom: 0.5rem;
}

.tips-box li:last-child {
  margin-bottom: 0;
}

.btn-secondary {
  width: 100%;
  background-color: #f3f4f6;
  color: #374151;
  padding: 1rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background-color: #e5e7eb;
}
</style>