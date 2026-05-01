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
import { supabase } from '../lib/supabaseClient';

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
const fetchRecipes = async () => {
  const { data, error } = await supabase.from('resep').select('*');
  if (!error && data) {
    recipes.value = data.map(r => ({
      id_resep: r.id_resep,
      title: r.nama_resep,
      image: r.img_url,
      calories: r.kalori,
      protein: r.protein
    }));
  }
};

// 2. Ambil Jadwal Makan User dari DB
const fetchMealPlan = async () => {
  if (!userId.value) return;
  
  try {
    // Relational Query: Ambil planner beserta detailnya dan info resep sekaligus
    const { data: plans, error } = await supabase
      .from('meal_planner')
      .select(`
        id_planner,
        hari,
        detail_planner (
          id_detail,
          waktu,
          resep (
            id_resep,
            nama_resep,
            img_url,
            kalori,
            protein
          )
        )
      `)
      .eq('id_pengguna', userId.value);

    if (error) throw error;

    // Mapping hasil DB ke UI Reactivity
    if (plans) {
      plans.forEach(plan => {
        // Simpan id_planner untuk referensi saat Insert/Update nanti
        plannerIds.value[plan.hari] = plan.id_planner;
        
        plan.detail_planner.forEach(detail => {
          // Jika resep tidak null (belum dihapus dari tabel resep)
          if (detail.resep) {
            planner[plan.hari][detail.waktu] = {
              id_detail: detail.id_detail,
              id_resep: detail.resep.id_resep,
              title: detail.resep.nama_resep,
              image: detail.resep.img_url,
              calories: detail.resep.kalori,
              protein: detail.resep.protein
            };
          }
        });
      });
    }
  } catch (error) {
    console.error("Gagal memuat jadwal:", error.message);
  } finally {
    isLoading.value = false;
  }
};

// Autentikasi dan Inisialisasi
onMounted(async () => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (session?.user) {
    userId.value = session.user.id;
    await fetchRecipes();
    await fetchMealPlan();
  } else {
    isLoading.value = false;
  }

  const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
    if (session?.user && userId.value !== session.user.id) {
      userId.value = session.user.id;
      isLoading.value = true;
      await fetchRecipes();
      await fetchMealPlan();
    } else if (!session) {
      userId.value = null;
      isLoading.value = false;
    }
  });
  authSubscription = subscription;
});

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
const selectRecipe = async (recipe) => {
  const { day, time } = activeSlot.value;
  if (!userId.value) return;

  try {
    isSaving.value = true;
    let currentPlannerId = plannerIds.value[day];

    // Cek apakah tabel meal_planner untuk hari ini sudah terbuat
    if (!currentPlannerId) {
      const { data, error } = await supabase
        .from('meal_planner')
        .insert({ id_pengguna: userId.value, hari: day })
        .select('id_planner')
        .single();
      
      if (error) throw error;
      currentPlannerId = data.id_planner;
      plannerIds.value[day] = currentPlannerId; // Simpan ke state
    }

    const existingMeal = planner[day][time];
    let detailId = null;

    // Jika slot tersebut sudah ada isinya, kita lakukan UPDATE
    if (existingMeal && existingMeal.id_detail) {
      const { error } = await supabase
        .from('detail_planner')
        .update({ id_resep: recipe.id_resep })
        .eq('id_detail', existingMeal.id_detail);
      
      if (error) throw error;
      detailId = existingMeal.id_detail;
    } 
    // Jika slot masih kosong, kita lakukan INSERT
    else {
      const { data, error } = await supabase
        .from('detail_planner')
        .insert({ id_planner: currentPlannerId, id_resep: recipe.id_resep, waktu: time })
        .select('id_detail')
        .single();
      
      if (error) throw error;
      detailId = data.id_detail;
    }

    // Update state reaktif agar UI otomatis berubah
    planner[day][time] = {
      id_detail: detailId,
      id_resep: recipe.id_resep,
      title: recipe.title,
      image: recipe.image,
      calories: recipe.calories,
      protein: recipe.protein
    };

    closeModal();
  } catch (err) {
    console.error("Gagal menyimpan resep:", err.message);
    alert("Terjadi kesalahan saat mengatur meal plan.");
  } finally {
    isSaving.value = false;
  }
};

// 4. Hapus Resep dari Plan
const removeRecipe = async (day, time) => {
  const meal = planner[day][time];
  if (!meal || !meal.id_detail) return;

  try {
    isSaving.value = true;
    const { error } = await supabase
      .from('detail_planner')
      .delete()
      .eq('id_detail', meal.id_detail);

    if (error) throw error;

    // Bersihkan dari UI
    planner[day][time] = null;
  } catch (err) {
    console.error("Gagal menghapus resep:", err.message);
  } finally {
    isSaving.value = false;
  }
};

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