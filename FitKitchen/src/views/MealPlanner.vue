<template>
  
  <div class="meal-planner-page">
  <NavbarUser />

    <main class="content-container">
      <header class="planner-header">
        <h1>Meal Planner</h1>
        <p>Plan your healthy meals for the week</p>
      </header>

      <section v-for="day in days" :key="day" class="day-card">
        <div class="day-header">
          <h2>{{ day }}</h2>
          <div class="day-stats">
            <span>🔥 {{ calculateDailyTotals(day).calories }} cal</span>
            <span>💪 {{ calculateDailyTotals(day).protein }}g protein</span>
          </div>
        </div>

        <div class="meal-grid">
          <div v-for="time in mealTimes" :key="time" class="meal-slot">
            <span class="meal-label">{{ time }}</span>
            
            <div v-if="planner[day][time]" class="selected-recipe-card">
              <img :src="planner[day][time].image" :alt="planner[day][time].title" />
              <div class="recipe-info">
                <h3>{{ planner[day][time].title }}</h3>
                <p>{{ planner[day][time].calories }} cal | {{ planner[day][time].protein }}g pro</p>
              </div>
              <button @click="removeRecipe(day, time)" class="btn-remove">×</button>
            </div>

            <button v-else @click="openModal(day, time)" class="btn-add-recipe">
              <span class="plus-icon">+</span>
              Add Recipe
            </button>
          </div>
        </div>
      </section>
    </main>

    <Transition name="fade">
      <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
        <Transition name="slide-up">
          <div class="modal-content">
            <div class="modal-header">
              <h3>Select Recipe for {{ activeSlot.time }} ({{ activeSlot.day }})</h3>
              <button @click="closeModal" class="close-modal">&times;</button>
            </div>
            <div class="recipe-selection-grid">
              <div 
                v-for="recipe in recipes" 
                :key="recipe.id" 
                class="recipe-option"
                @click="selectRecipe(recipe)"
              >
                <img :src="recipe.image" alt="" />
                <div class="option-details">
                  <h4>{{ recipe.title }}</h4>
                  <p>{{ recipe.calories }} cal</p>
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
import { ref, reactive } from 'vue';
import { recipes } from '../data/recipes.js';
import NavbarUser from '../components/NavbarUser.vue'


const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const mealTimes = ['Breakfast', 'Lunch', 'Dinner'];

// State untuk menyimpan rencana makan
const planner = reactive({
  Monday: { Breakfast: null, Lunch: null, Dinner: null },
  Tuesday: { Breakfast: null, Lunch: null, Dinner: null },
  Wednesday: { Breakfast: null, Lunch: null, Dinner: null },
  Thursday: { Breakfast: null, Lunch: null, Dinner: null },
  Friday: { Breakfast: null, Lunch: null, Dinner: null },
  Saturday: { Breakfast: null, Lunch: null, Dinner: null },
  Sunday: { Breakfast: null, Lunch: null, Dinner: null },
});

// Modal State
const showModal = ref(false);
const activeSlot = ref({ day: '', time: '' });

const openModal = (day, time) => {
  activeSlot.value = { day, time };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const selectRecipe = (recipe) => {
  const { day, time } = activeSlot.value;
  planner[day][time] = recipe;
  closeModal();
};

const removeRecipe = (day, time) => {
  planner[day][time] = null;
};

const calculateDailyTotals = (day) => {
  let calories = 0;
  let protein = 0;
  Object.values(planner[day]).forEach(meal => {
    if (meal) {
      calories += meal.calories;
      protein += meal.protein;
    }
  });
  return { calories, protein };
};
</script>

<style scoped>


/* Reset dasar untuk memastikan tidak ada celah di atas */
.meal-planner-page { 
  background: #f8fafc; 
  min-height: 100vh; 
  padding-top: 100px; /* Memberi ruang agar konten tidak tertutup navbar fixed */
}

/* Navbar gaya fixed agar nempel di atas terus */
.navbar.fixed-top {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  /* Pro-tip: Tambahkan sedikit shadow agar terlihat terpisah dari konten saat di-scroll */
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.content-container { 
  max-width: 1100px; 
  margin: 0 auto; 
  padding: 0 20px 40px 20px; 
}

.planner-header {
  margin-bottom: 40px; /* Menambah jarak antara judul "Meal Planner" dengan kartu hari */
}

.planner-header h1 {
  font-size: 2.2rem;
  margin-bottom: 8px;
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
.selected-recipe-card img { width: 100%; height: 100px; object-fit: cover; }
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