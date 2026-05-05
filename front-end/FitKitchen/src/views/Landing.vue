<template>
  <div class="FitKitchen">
    <NavbarUser />

    <section class="hero">
      <div class="hero-content">
        <h1>Discover Healthy Recipes</h1>
        <p>Find nutritious and delicious meals for your healthy lifestyle</p>
      </div>
    </section>

    <main class="content-container">
      
      <div class="filter-bar">
        <div class="search-box">
          <img :src="searchIcon" alt="Search" class="search-icon" />
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Search recipes..." 
          />
        </div>
        

      </div>

      <div v-if="loading" class="loading-state">
        <p>Loading recipes...</p>
      </div>

      <div v-else>
        <div class="results-count">
          <p>Showing <strong>{{ filteredRecipes.length }}</strong> recipes</p>
        </div>

        <transition-group name="list" tag="div" class="recipe-grid">
          <div 
            class="recipe-card" 
            v-for="recipe in filteredRecipes" 
            :key="recipe.id"
            @click="goToRecipe(recipe.id)"
          >
            <div class="card-image">
              <img :src="recipe.image" :alt="recipe.title" class="img-placeholder" />
              <div class="diet-tags">
                <span 
                  v-for="(tag, index) in recipe.diets" 
                  :key="index"
                  class="diet-tag" 
                  :class="tag.toLowerCase()"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
            <div class="card-content">
              <h3>{{ recipe.title }}</h3>
              <p>{{ recipe.description }}</p>
              <div class="card-meta">
                <span class="meta-item">
                  <img :src="calories" alt="Calories" class="meta-icon" />
                   {{ recipe.calories }} cal
                </span>
                <span class="meta-item">
                  <img :src="protein" alt="Protein" class="meta-icon" />
                   {{ recipe.protein }}g protein
                </span>
              </div>
            </div>
          </div>
        </transition-group>
      </div>

    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import NavbarUser from '../components/NavbarUser.vue'
import axios from 'axios'

// Icons
import searchIcon from '../assets/icons/search.png'
import protein from '../assets/icons/protein.png'
import calories from '../assets/icons/Calori.png'


const router = useRouter()

const goToRecipe = (id) => {
  router.push(`/menu/${id}`)
}

const searchQuery = ref('')
const selectedSort = ref('none')

const recipes = ref([])
const loading = ref(true)

const fetchRecipes = async () => {
  try {
    loading.value = true;
    console.log("Memulai fetching resep..."); // Diagnosa 1
    
    const response = await axios.get('http://localhost:3000/api/resep');
    
    console.log("Data mentah dari backend:", response.data); // Diagnosa 2

    // Pastikan kita mengambil response.data.data karena di controller 
    // kamu mengirim res.status(200).json({ success: true, data: resep });
    if (response.data && response.data.success) {
      const rawData = response.data.data;
      
      recipes.value = rawData.map(item => ({
        id: item.id_resep,
        title: item.nama_resep,
        description: item.deskripsi || 'No description available',
        calories: item.kalori || 0,
        protein: item.protein || 0,
        image: item.img_url || 'https://via.placeholder.com/400x300?text=FitKitchen',
        diets: [] 
      }));
      
      console.log("Hasil mapping resep:", recipes.value); // Diagnosa 3
    }
  } catch (error) {
    console.error("Gagal memuat resep. Detail error:", error.response || error);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchRecipes()
})

const filteredRecipes = computed(() => {
  let result = recipes.value

  // Filter Search
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(r => 
      r.title.toLowerCase().includes(q) || 
      (r.description && r.description.toLowerCase().includes(q))
    )
  }

  // Sorting
  if (selectedSort.value === 'low-cal') {
    result = result.slice().sort((a, b) => a.calories - b.calories)
  } else if (selectedSort.value === 'high-pro') {
    result = result.slice().sort((a, b) => b.protein - a.protein)
  }

  // CATATAN: Filter diet dihapus sementara dari computed property ini 
  // karena berdasarkan skema database Supabase-mu, belum ada kolom untuk tag diet.

  return result
})
</script>

<style scoped>
.loading-state {
  text-align: center;
  padding: 40px;
  font-size: 1.2rem;
  color: #666;
}

.landing-page {
  font-family: 'Inter', sans-serif; 
  background-color: #FAFAFA;
  min-height: 100vh;
}

.hero {
  background: linear-gradient(90deg, #E8F5E9 0%, #FFF3E0 100%);
  padding: 60px 40px;
}

.hero h1 {
  font-size: 32px;
  margin-bottom: 10px;
  color: #1A1A1A;
}

.hero p {
  color: #666;
  font-size: 16px;
}

.content-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 15px 20px;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
}

.search-box {
  display: flex;
  align-items: center;
  flex: 1;
  background: #F9FAFB;
  padding: 10px 15px;
  border-radius: 8px;
  margin-right: 20px;
}

.search-box input {
  border: none;
  background: transparent;
  outline: none;
  width: 100%;
  margin-left: 10px;
  font-size: 14px;
}

.dropdowns {
  display: flex;
  gap: 15px;
}

.filter-select {
  padding: 10px;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  background-color: white;
  outline: none;
  cursor: pointer;
  font-size: 14px;
}

.results-count {
  margin-bottom: 20px;
  color: #666;
}

.filter-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.filter-icon {
  position: absolute;
  left: 12px;
  width: 16px;
  height: 16px;
  pointer-events: none;
  opacity: 0.6;
  z-index: 2; 
}

.filter-select.has-icon {
  padding-left: 38px; 
  appearance: none;   
  -webkit-appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 12px;
  padding-right: 30px; 
}

.recipe-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.recipe-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid #F3F4F6;
  cursor: pointer;
}

.recipe-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 20px rgba(0, 0, 0, 0.1);
}

.card-image {
  position: relative;
  height: 200px;
  background-color: #E5E7EB; 
}

.img-placeholder {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Penyesuaian Flexbox untuk multiple tags */
.diet-tags {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  flex-direction: column; /* Menyusun ke bawah agar tidak menutupi gambar menyamping */
  align-items: flex-end;
  gap: 6px;
}

.diet-tag {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
  color: white;
  text-transform: capitalize;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15); /* Tambahan shadow agar kontras dengan gambar */
}

/* Warna Tag Diet Spesifik */
.vegetarian { background-color: #F97316; }
.paleo { background-color: #D97706; }
.keto { background-color: #EA580C; }
.balanced { background-color: #E11D48; }

.card-content {
  padding: 20px;
}

.card-content h3 {
  margin: 0 0 8px 0;
  font-size: 16px;
  color: #1F2937;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-content p {
  font-size: 13px;
  color: #6B7280;
  margin-bottom: 16px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-meta {
  display: flex;
  gap: 15px;
  font-size: 12px;
  color: #4B5563;
  font-weight: 500;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>