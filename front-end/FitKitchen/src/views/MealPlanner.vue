<template>
  <div class="meal-planner-page">
    <NavbarUser />

    <main class="content-container">
      <header class="planner-header">
        <h1>Meal Planner</h1>
        <p>Plan your healthy meals for the week</p>
      </header>

      <!-- Loading State -->
      <div v-if="isLoading" class="loading-state text-center">
        <p>Memuat jadwal makan...</p>
      </div>

      <!-- Jika Belum Login -->
      <div v-else-if="!userId" class="text-center auth-warning">
        <h2>Akses Ditolak</h2>
        <p>Silakan login terlebih dahulu untuk mengatur Meal Planner.</p>
      </div>

      <!-- Konten Utama Meal Planner -->
      <template v-else>
        <section v-for="day in days" :key="day" class="day-card">
          <div class="day-header">
            <h2>{{ day }}</h2>
            <div class="day-stats">
              <span class="stat-item">
               <img :src="caloriesIcon" alt="Calories" class="meta-icon" />  
               {{ calculateDailyTotals(day).calories }} cal
              </span>
              <span class="stat-item">
                <img :src="proteinIcon" alt="Protein" class="meta-icon" />  
                {{ calculateDailyTotals(day).protein }}g protein
              </span>
            </div>
          </div>

          <div class="meal-grid">
            <div v-for="time in mealTimes" :key="time" class="meal-slot">
              <span class="meal-label">{{ time }}</span>
              
              <div v-if="planner[day][time]" class="selected-recipe-card">
                <img :src="planner[day][time].image || placeholderImg" :alt="planner[day][time].title" class="card-main-img" />
                <div class="recipe-info">
                  <h3>{{ planner[day][time].title }}</h3>
                  <div class="card-meta">
                    <span class="meta-item">
                      <img :src="caloriesIcon" alt="Cal" class="meta-icon" />
                      {{ planner[day][time].calories }} cal
                    </span>
                    <span class="meta-item">
                      <img :src="proteinIcon" alt="Pro" class="meta-icon" />
                      {{ planner[day][time].protein }}g
                    </span>
                  </div>
                </div>
                <!-- Tombol Hapus -->
                <button @click="removeRecipe(day, time)" class="btn-remove" :disabled="isSaving">×</button>
              </div>

              <!-- Tombol Tambah -->
              <button v-else @click="openModal(day, time)" class="btn-add-recipe" :disabled="isSaving">
                <span class="plus-icon">+</span>
                Add Recipe
              </button>
            </div>
          </div>
        </section>
      </template>
    </main>

    <!-- Modal Pilihan Resep -->
    <Transition name="fade">
      <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
        <Transition name="slide-up">
          <div class="modal-content">
            <div class="modal-header">
              <h3>Select Recipe for {{ activeSlot.time }} ({{ activeSlot.day }})</h3>
              <button @click="closeModal" class="close-modal">&times;</button>
            </div>
            
            <div v-if="recipes.length === 0" class="text-center" style="margin-top: 2rem;">
              <p>Belum ada resep tersedia di database.</p>
            </div>

            <div class="recipe-selection-grid">
              <div 
                v-for="recipe in recipes" 
                :key="recipe.id_resep" 
                class="recipe-option"
                @click="selectRecipe(recipe)"
              >
                <img :src="recipe.image || placeholderImg" alt="" />
                <div class="option-details">
                  <h4>{{ recipe.title }}</h4>
                  <p>{{ recipe.calories }} cal | {{ recipe.protein }}g pro</p>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue';

// Komponen & Asset
import NavbarUser from '../components/NavbarUser.vue';
import caloriesIcon from '../assets/icons/Calori.png';
import proteinIcon from '../assets/icons/protein.png';
import placeholderImg from '../assets/icons/logo.png'; // Fallback jika img_url kosong

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const mealTimes = ['Breakfast', 'Lunch', 'Dinner'];

// State
const isLoading = ref(true);
const isSaving = ref(false);
const userId = ref(null);
const recipes = ref([]); // Data dari tabel 'resep'
const showModal = ref(false);
const activeSlot = ref({ day: '', time: '' });

let authSubscription = null;

// Struktur untuk melacak id_planner tiap harinya agar tidak insert berulang
const plannerIds = ref({
  Monday: null, Tuesday: null, Wednesday: null, Thursday: null, Friday: null, Saturday: null, Sunday: null
});

// State Data Planner
const planner = reactive({
  Monday: { Breakfast: null, Lunch: null, Dinner: null },
  Tuesday: { Breakfast: null, Lunch: null, Dinner: null },
  Wednesday: { Breakfast: null, Lunch: null, Dinner: null },
  Thursday: { Breakfast: null, Lunch: null, Dinner: null },
  Friday: { Breakfast: null, Lunch: null, Dinner: null },
  Saturday: { Breakfast: null, Lunch: null, Dinner: null },
  Sunday: { Breakfast: null, Lunch: null, Dinner: null },
});

// 1. Ambil Katalog Resep dari DB

onUnmounted(() => {
  if (authSubscription) authSubscription.unsubscribe();
});

// --- FUNGSI MODAL & AKSI ---

const openModal = (day, time) => {
  activeSlot.value = { day, time };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

// 3. Simpan Resep ke Plan

// 4. Hapus Resep dari Plan

// Kalkulasi Nutrisi Harian
const calculateDailyTotals = (day) => {
  let calories = 0;
  let protein = 0;
  Object.values(planner[day]).forEach(meal => {
    if (meal) {
      calories += meal.calories || 0;
      protein += Number(meal.protein) || 0;
    }
  });
  return { 
    calories: Math.round(calories), 
    protein: Math.round(protein * 10) / 10 // Pembulatan 1 angka desimal
  };
};
</script>

<style scoped>
/* Tambahan class bantuan */
.text-center { text-align: center; }
.auth-warning { margin-top: 4rem; padding: 2rem; background: #fff; border-radius: 12px; }
.loading-state { padding: 4rem; font-weight: bold; color: #48bb78; }
.btn-remove:disabled, .btn-add-recipe:disabled { opacity: 0.5; cursor: not-allowed; }

/* Sisa styling tetap persis seperti yang kamu buat */
.content-container { 
  max-width: 1100px; 
  margin: 0 auto; 
  padding: 0 20px 40px 20px; 
}

.planner-header {
  margin-bottom: 40px; 
}

.planner-header h1 {
  font-size: 2.2rem;
  margin-bottom: 8px;
}

.meta-icon {
  width: 16px;
  height: 16px;
  object-fit: contain;
  vertical-align: middle;
  margin-right: 4px;
}

.stat-item, .meta-item {
  display: flex;
  align-items: center;
  font-size: 14px;
}

.card-meta {
  display: flex;
  gap: 10px;
  margin-top: 5px;
}

.recipe-info h3 {
  margin-bottom: 2px;
}

.day-card { 
  background: white; border-radius: 12px; padding: 20px; 
  margin-bottom: 25px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.day-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #edf2f7; margin-bottom: 15px; padding-bottom: 10px; }
.day-stats { display: flex; gap: 15px; font-weight: 600; color: #4a5568; }

.meal-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.meal-label { display: block; font-size: 14px; font-weight: bold; color: #718096; margin-bottom: 10px; }

.btn-add-recipe {
  width: 100%; height: 150px; border: 2px dashed #cbd5e0; border-radius: 10px;
  background: transparent; color: #a0aec0; cursor: pointer; transition: 0.3s;
}
.btn-add-recipe:hover { background: #edf2f7; border-color: #48bb78; color: #48bb78; }

.selected-recipe-card { position: relative; border-radius: 10px; overflow: hidden; border: 1px solid #e2e8f0; }

.selected-recipe-card .card-main-img { 
  width: 100%; 
  height: 100px; 
  object-fit: cover; 
}
.recipe-info { padding: 10px; }
.recipe-info h3 { font-size: 14px; margin: 0; }
.recipe-info p { font-size: 12px; color: #718096; margin: 5px 0 0; }

.btn-remove { position: absolute; top: 5px; right: 5px; background: #f56565; color: white; border: none; border-radius: 50%; width: 20px; height: 20px; cursor: pointer; }

/* MODAL STYLES */
.modal-overlay {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 1000;
}
.modal-content {
  background: white; width: 90%; max-width: 600px; border-radius: 15px;
  max-height: 80vh; overflow-y: auto; padding: 25px;
}
.modal-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #eee; padding-bottom: 10px;}
.close-modal { background: none; border: none; font-size: 1.5rem; cursor: pointer; }
.recipe-selection-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-top: 20px; }
.recipe-option { cursor: pointer; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden; transition: 0.2s; }
.recipe-option:hover { transform: scale(1.02); border-color: #48bb78; }
.recipe-option img { width: 100%; height: 80px; object-fit: cover; }
.option-details { padding: 10px; }

/* ANIMATIONS */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-up-enter-active, .slide-up-leave-active { transition: transform 0.3s ease-out; }
.slide-up-enter-from, .slide-up-leave-to { transform: translateY(50px); }
</style>