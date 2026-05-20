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
import searchIcon from '../assets/icons/Search.png'
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
:root {
  /* Base font size for rem calculations */
  font-size: 16px;
}

/* ===== MOBILE FIRST - BASE STYLES ===== */
.loading-state {
  text-align: center;
  padding: 2.5rem 1rem;
  font-size: 1.125rem;
  color: #666;
}

.FitKitchen {
  font-family: 'Inter', sans-serif;
  background-color: #FAFAFA;
  min-height: 100vh;
}

.hero {
  background: linear-gradient(90deg, #E8F5E9 0%, #FFF3E0 100%);
  padding: 2rem 1rem;
  text-align: center;
}

.hero-content h1 {
  font-size: 1.5rem;
  margin-bottom: 0.625rem;
  color: #1A1A1A;
  line-height: 1.2;
}

.hero-content p {
  color: #666;
  font-size: 0.875rem;
  line-height: 1.5;
  max-width: 100%;
}

.content-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem 1rem;
}

.filter-bar {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: white;
  padding: 1rem;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  margin-bottom: 1.25rem;
}

.search-box {
  display: flex;
  align-items: center;
  flex: 1;
  background: #F9FAFB;
  padding: 0.625rem 0.938rem;
  border-radius: 0.5rem;
  width: 100%;
}

.search-box input {
  border: none;
  background: transparent;
  outline: none;
  width: 100%;
  margin-left: 0.625rem;
  font-size: 0.875rem;
}

.search-icon {
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
}

.dropdowns {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
}

.filter-select {
  padding: 0.625rem;
  border: 1px solid #E5E7EB;
  border-radius: 0.5rem;
  background-color: white;
  outline: none;
  cursor: pointer;
  font-size: 0.875rem;
  width: 100%;
}

.results-count {
  margin-bottom: 1.25rem;
  color: #666;
  font-size: 0.875rem;
}

.results-count strong {
  font-weight: 600;
}

.filter-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}

.filter-icon {
  position: absolute;
  left: 0.75rem;
  width: 1rem;
  height: 1rem;
  pointer-events: none;
  opacity: 0.6;
  z-index: 2;
}

.filter-select.has-icon {
  padding-left: 2.375rem;
  appearance: none;
  -webkit-appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.625rem center;
  background-size: 0.75rem;
  padding-right: 1.875rem;
}

/* Mobile: 1 column grid */
.recipe-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

.recipe-card {
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid #F3F4F6;
  cursor: pointer;
}

.recipe-card:active {
  transform: scale(0.98);
}

.card-image {
  position: relative;
  height: 12.5rem;
  background-color: #E5E7EB;
  width: 100%;
}

.img-placeholder {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.diet-tags {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.375rem;
}

.diet-tag {
  padding: 0.25rem 0.75rem;
  border-radius: 1.25rem;
  font-size: 0.75rem;
  font-weight: bold;
  color: white;
  text-transform: capitalize;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  white-space: nowrap;
}

.vegetarian { background-color: #F97316; }
.paleo { background-color: #D97706; }
.keto { background-color: #EA580C; }
.balanced { background-color: #E11D48; }

.card-content {
  padding: 1.25rem;
}

.card-content h3 {
  margin: 0 0 0.5rem 0;
  font-size: 0.938rem;
  color: #1F2937;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-weight: 600;
}

.card-content p {
  font-size: 0.8rem;
  color: #6B7280;
  margin-bottom: 1rem;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-meta {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  font-size: 0.75rem;
  color: #4B5563;
  font-weight: 500;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.meta-icon {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(1.875rem);
}

/* ===== TABLET (768px+) ===== */
@media (min-width: 48rem) {
  :root {
    font-size: 16px;
  }

  .hero {
    padding: 3rem 2rem;
    text-align: left;
  }

  .hero-content h1 {
    font-size: 2rem;
    margin-bottom: 0.75rem;
  }

  .hero-content p {
    font-size: 1rem;
    max-width: 90%;
  }

  .content-container {
    padding: 2rem;
  }

  .filter-bar {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1.25rem;
  }

  .search-box {
    flex: 1;
    margin-right: 0.5rem;
  }

  .dropdowns {
    flex-direction: row;
    gap: 1rem;
    width: auto;
  }

  .filter-select {
    width: auto;
    padding: 0.625rem 1rem;
    min-width: 10rem;
  }

  /* Tablet: 2 column grid */
  .recipe-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }

  .card-image {
    height: 15rem;
  }

  .card-content h3 {
    font-size: 1rem;
  }

  .card-content p {
    font-size: 0.875rem;
  }

  .card-meta {
    flex-direction: row;
    gap: 1rem;
  }

  .results-count {
    font-size: 0.938rem;
  }
}

/* ===== DESKTOP (1024px+) ===== */
@media (min-width: 64rem) {
  .hero {
    padding: 3.75rem 2.5rem;
  }

  .hero-content h1 {
    font-size: 2.25rem;
    margin-bottom: 0.625rem;
  }

  .hero-content p {
    font-size: 1.125rem;
    max-width: 100%;
  }

  .content-container {
    padding: 2.5rem 1.25rem;
  }

  .filter-bar {
    padding: 1rem 1.5rem;
  }

  /* Desktop: 4 column grid */
  .recipe-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
  }

  .recipe-card:hover {
    transform: translateY(-0.5rem);
    box-shadow: 0 12px 20px rgba(0, 0, 0, 0.1);
  }

  .recipe-card:active {
    transform: scale(1);
  }

  .card-image {
    height: 12.5rem;
  }

  .card-content {
    padding: 1.5rem;
  }

  .card-content h3 {
    font-size: 1rem;
  }

  .card-content p {
    font-size: 0.875rem;
  }
}
</style>